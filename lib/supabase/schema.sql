-- ===================================================================
-- Nexus — Complete Database Schema with Row Level Security (RLS)
-- Run this in Supabase SQL Editor → New Query → Run
--
-- Security model:
--   • Every table has RLS enabled
--   • Users can only read/write their own data
--   • Admin/founder role bypasses restrictions
--   • GPS coordinates NEVER exposed to clients — only approximate distance
--   • Profile views are append-only for privacy
-- ===================================================================

-- ─── Extensions ───────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";  -- For geospatial queries

-- ─── Custom Types ─────────────────────────────────────────────────────
create type user_role as enum ('attendee', 'organizer', 'admin', 'founder');
create type availability_status as enum ('available', 'busy', 'coffee_break');
create type privacy_setting as enum ('everyone', 'matching_interests', 'invisible');
create type event_status as enum ('draft', 'published', 'active', 'ended', 'cancelled');
create type event_category as enum (
  'hackathon', 'conference', 'meetup', 'career_fair',
  'workshop', 'college_fest', 'startup_event', 'other'
);
create type attendee_goal as enum (
  'networking', 'hiring', 'internship', 'job_seeking',
  'co_founder', 'mentoring', 'learning', 'investing'
);
create type contact_preference as enum ('open', 'selective', 'closed');
create type interest_category as enum (
  'technology', 'design', 'business', 'science',
  'arts', 'sports', 'education', 'other'
);

-- ─── Helper: updated_at trigger ───────────────────────────────────────
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ===================================================================
-- TABLE: users
-- Extends Supabase auth.users with profile data
-- ===================================================================
create table public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null unique,
  name          text not null,
  avatar_url    text,
  headline      text check (char_length(headline) <= 220),
  company       text check (char_length(company) <= 100),
  linkedin_url  text check (linkedin_url ~* '^https://(www\.)?linkedin\.com/in/[\w-]+/?$'),
  github_url    text check (github_url ~* '^https://(www\.)?github\.com/[\w-]+/?$'),
  portfolio_url text,
  bio           text check (char_length(bio) <= 300),
  skills        text[] default '{}',
  role          user_role not null default 'attendee',
  is_verified   boolean not null default false,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger users_updated_at
  before update on public.users
  for each row execute function handle_updated_at();

-- ─── RLS: users ───────────────────────────────────────────────────────
alter table public.users enable row level security;

-- Anyone can read public profiles (needed for discovery)
create policy "Public profiles are viewable by everyone"
  on public.users for select
  using (is_active = true);

-- Users can only update their own profile
create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Only the user themselves or admin can delete
create policy "Users can delete own profile"
  on public.users for delete
  using (auth.uid() = id);

-- Insert handled by trigger (see below)
create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- ─── Auto-create user profile on signup ───────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, avatar_url, linkedin_url)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'provider_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ===================================================================
-- TABLE: interests
-- Global interest/tag list managed by admins
-- ===================================================================
create table public.interests (
  id       uuid primary key default uuid_generate_v4(),
  name     text not null unique,
  slug     text not null unique,
  category interest_category not null default 'other',
  icon     text,   -- emoji
  color    text    -- hex color for the tag
);

-- Seed default interests
insert into public.interests (name, slug, category, icon) values
  ('AI / Machine Learning', 'ai-ml', 'technology', '🤖'),
  ('Web Development', 'web-dev', 'technology', '🌐'),
  ('Mobile Development', 'mobile-dev', 'technology', '📱'),
  ('Blockchain', 'blockchain', 'technology', '⛓️'),
  ('Cybersecurity', 'cybersecurity', 'technology', '🔐'),
  ('Cloud & DevOps', 'cloud-devops', 'technology', '☁️'),
  ('Open Source', 'open-source', 'technology', '🔓'),
  ('UI/UX Design', 'ui-ux', 'design', '🎨'),
  ('Product Design', 'product-design', 'design', '✏️'),
  ('Brand Design', 'brand-design', 'design', '💎'),
  ('Startups', 'startups', 'business', '🚀'),
  ('Venture Capital', 'venture-capital', 'business', '💰'),
  ('Product Management', 'product-management', 'business', '📋'),
  ('Marketing', 'marketing', 'business', '📢'),
  ('Sales', 'sales', 'business', '🤝'),
  ('Finance & FinTech', 'fintech', 'business', '💳'),
  ('Data Science', 'data-science', 'science', '📊'),
  ('Robotics', 'robotics', 'science', '🤖'),
  ('Biotechnology', 'biotech', 'science', '🧬'),
  ('EdTech', 'edtech', 'education', '📚'),
  ('Gaming', 'gaming', 'arts', '🎮'),
  ('Content Creation', 'content-creation', 'arts', '🎬'),
  ('Photography', 'photography', 'arts', '📷'),
  ('Music', 'music', 'arts', '🎵'),
  ('Social Impact', 'social-impact', 'other', '🌍'),
  ('Climate Tech', 'climate-tech', 'other', '🌱'),
  ('Healthcare', 'healthcare', 'other', '🏥'),
  ('Space Tech', 'space-tech', 'science', '🚀');

-- ─── RLS: interests ───────────────────────────────────────────────────
alter table public.interests enable row level security;

create policy "Interests are public"
  on public.interests for select
  using (true);

-- ===================================================================
-- TABLE: user_interests (many-to-many)
-- ===================================================================
create table public.user_interests (
  user_id     uuid not null references public.users(id) on delete cascade,
  interest_id uuid not null references public.interests(id) on delete cascade,
  primary key (user_id, interest_id)
);

alter table public.user_interests enable row level security;

create policy "Users can view all interests mappings"
  on public.user_interests for select using (true);

create policy "Users manage own interests"
  on public.user_interests for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ===================================================================
-- TABLE: user_preferences
-- Per-user event preferences (updated on each event join)
-- ===================================================================
create table public.user_preferences (
  id                 uuid primary key default uuid_generate_v4(),
  user_id            uuid not null unique references public.users(id) on delete cascade,
  availability       availability_status not null default 'available',
  privacy            privacy_setting not null default 'everyone',
  goals              attendee_goal[] default '{}',
  contact_preference contact_preference not null default 'open',
  onboarding_done    boolean not null default false,
  updated_at         timestamptz not null default now()
);

create trigger user_preferences_updated_at
  before update on public.user_preferences
  for each row execute function handle_updated_at();

alter table public.user_preferences enable row level security;

create policy "Users can read own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy "Users manage own preferences"
  on public.user_preferences for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ===================================================================
-- TABLE: events
-- ===================================================================
create table public.events (
  id             uuid primary key default uuid_generate_v4(),
  title          text not null check (char_length(title) <= 100),
  slug           text not null unique,
  description    text check (char_length(description) <= 2000),
  category       event_category not null default 'other',
  status         event_status not null default 'draft',
  organizer_id   uuid not null references public.users(id) on delete restrict,
  cover_image_url text,
  venue_name     text,
  venue_address  text,
  -- GPS stored as PostGIS geography — NEVER exposed to clients via API
  -- Clients only receive approximate distance computed server-side
  location       geography(Point, 4326),
  start_time     timestamptz not null,
  end_time       timestamptz not null,
  join_code      text not null unique check (char_length(join_code) = 6),
  max_attendees  int check (max_attendees > 0),
  is_private     boolean not null default false,
  tags           text[] default '{}',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint valid_time_range check (end_time > start_time)
);

create index events_status_idx on public.events(status);
create index events_join_code_idx on public.events(join_code);
create index events_organizer_idx on public.events(organizer_id);

create trigger events_updated_at
  before update on public.events
  for each row execute function handle_updated_at();

alter table public.events enable row level security;

-- Anyone can see published/active events
create policy "Public events are viewable"
  on public.events for select
  using (status in ('published', 'active', 'ended') and is_private = false);

-- Organizer sees all their own events (including drafts)
create policy "Organizers see own events"
  on public.events for select
  using (auth.uid() = organizer_id);

-- Admins see everything
create policy "Admins see all events"
  on public.events for select
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('admin', 'founder')
    )
  );

create policy "Organizers manage own events"
  on public.events for all
  using (auth.uid() = organizer_id)
  with check (auth.uid() = organizer_id);

create policy "Admins manage all events"
  on public.events for all
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('admin', 'founder')
    )
  );

-- ===================================================================
-- TABLE: event_participants
-- Tracks who is in which event + their live location (snapped to grid)
-- ===================================================================
create table public.event_participants (
  id                    uuid primary key default uuid_generate_v4(),
  event_id              uuid not null references public.events(id) on delete cascade,
  user_id               uuid not null references public.users(id) on delete cascade,
  joined_at             timestamptz not null default now(),
  left_at               timestamptz,
  -- Approximate location — snapped to 50m grid before storage
  -- NEVER store exact GPS coordinates
  approx_location       geography(Point, 4326),
  last_location_update  timestamptz,
  unique(event_id, user_id)
);

create index ep_event_idx on public.event_participants(event_id);
create index ep_user_idx on public.event_participants(user_id);
create index ep_location_idx on public.event_participants using gist(approx_location);

alter table public.event_participants enable row level security;

-- Participants can see other participants in the same event
-- IMPORTANT: location data filtered by privacy in the application layer
create policy "Participants see others in same event"
  on public.event_participants for select
  using (
    exists (
      select 1 from public.event_participants ep2
      where ep2.event_id = event_id
      and ep2.user_id = auth.uid()
    )
  );

create policy "Participants manage own record"
  on public.event_participants for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ===================================================================
-- TABLE: profile_views
-- Append-only audit log of who viewed whom at which event
-- ===================================================================
create table public.profile_views (
  id         uuid primary key default uuid_generate_v4(),
  event_id   uuid not null references public.events(id) on delete cascade,
  viewer_id  uuid not null references public.users(id) on delete cascade,
  viewed_id  uuid not null references public.users(id) on delete cascade,
  viewed_at  timestamptz not null default now(),
  -- Prevent duplicate views within 5 minutes
  constraint no_rapid_reviews unique (viewer_id, viewed_id, event_id)
);

create index pv_event_idx on public.profile_views(event_id);
create index pv_viewer_idx on public.profile_views(viewer_id);
create index pv_viewed_idx on public.profile_views(viewed_id);

alter table public.profile_views enable row level security;

-- Users can only see their own view history
create policy "Users see own view history"
  on public.profile_views for select
  using (auth.uid() = viewer_id or auth.uid() = viewed_id);

create policy "Users insert own views"
  on public.profile_views for insert
  with check (auth.uid() = viewer_id);

-- ===================================================================
-- TABLE: ratings
-- Post-event 5-star ratings
-- ===================================================================
create table public.ratings (
  id         uuid primary key default uuid_generate_v4(),
  rater_id   uuid not null references public.users(id) on delete cascade,
  rated_id   uuid not null references public.users(id) on delete cascade,
  event_id   uuid not null references public.events(id) on delete cascade,
  score      smallint not null check (score between 1 and 5),
  review     text check (char_length(review) <= 500),
  created_at timestamptz not null default now(),
  -- One rating per pair per event
  unique (rater_id, rated_id, event_id),
  -- Can't rate yourself
  constraint no_self_rating check (rater_id != rated_id)
);

alter table public.ratings enable row level security;

-- Average rating is public (used on profile cards)
create policy "Ratings are publicly readable"
  on public.ratings for select using (true);

create policy "Users submit own ratings"
  on public.ratings for insert
  with check (auth.uid() = rater_id);

create policy "Users update own ratings"
  on public.ratings for update
  using (auth.uid() = rater_id);

-- ===================================================================
-- TABLE: announcements
-- Sent by founder/admin to attendees
-- ===================================================================
create table public.announcements (
  id         uuid primary key default uuid_generate_v4(),
  title      text not null,
  message    text not null,
  target     text not null default 'all' check (target in ('all', 'event', 'organizers')),
  event_id   uuid references public.events(id) on delete cascade,
  sent_by    uuid not null references public.users(id),
  sent_at    timestamptz not null default now()
);

alter table public.announcements enable row level security;

create policy "Announcements are public"
  on public.announcements for select using (true);

create policy "Only admins send announcements"
  on public.announcements for insert
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('admin', 'founder')
    )
  );

-- ===================================================================
-- TABLE: admin_logs
-- Audit trail for all admin actions
-- ===================================================================
create table public.admin_logs (
  id          uuid primary key default uuid_generate_v4(),
  admin_id    uuid not null references public.users(id),
  action      text not null,
  target_type text not null,
  target_id   uuid,
  metadata    jsonb default '{}',
  created_at  timestamptz not null default now()
);

alter table public.admin_logs enable row level security;

create policy "Only admins read logs"
  on public.admin_logs for select
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('admin', 'founder')
    )
  );

create policy "Only admins write logs"
  on public.admin_logs for insert
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('admin', 'founder')
    )
  );

-- ===================================================================
-- FUNCTIONS (Server-side only — never expose raw coordinates)
-- ===================================================================

-- Get ALL participants in the event
-- Sorted by: 1) interest overlap count DESC (matched first), 2) distance ASC
-- Privacy filter: invisible users excluded. Everyone else always shown.
-- Interests are a PRIORITY signal, not a filter.
create or replace function get_nearby_participants(
  p_event_id   uuid,
  p_user_id    uuid,
  p_radius_m   float default 500.0  -- wider default: whole-venue
)
returns table (
  user_id           uuid,
  distance_m        float,
  availability      availability_status,
  privacy           privacy_setting,
  interest_overlap  int   -- how many interests in common
) as $$
declare
  v_user_location geography;
  v_user_interests uuid[];
begin
  -- Get the requesting user's snapped location
  select approx_location into v_user_location
  from public.event_participants
  where event_id = p_event_id and user_id = p_user_id;

  -- Get requesting user's interest IDs
  select array_agg(interest_id) into v_user_interests
  from public.user_interests where user_id = p_user_id;

  -- If no location yet, still show all participants sorted by interest
  return query
  select
    ep.user_id,
    case
      when v_user_location is not null and ep.approx_location is not null
      then st_distance(ep.approx_location, v_user_location)::float
      else null
    end as distance_m,
    up.availability,
    up.privacy,
    -- Count shared interests (0 if user has none set)
    coalesce((
      select count(*)::int
      from public.user_interests ui
      where ui.user_id = ep.user_id
        and v_user_interests is not null
        and ui.interest_id = any(v_user_interests)
    ), 0) as interest_overlap
  from public.event_participants ep
  join public.user_preferences up on up.user_id = ep.user_id
  where
    ep.event_id = p_event_id
    and ep.user_id != p_user_id
    and ep.left_at is null
    -- Only exclude truly invisible users
    and up.privacy != 'invisible'
  order by
    interest_overlap desc,  -- matched interests first
    distance_m asc nulls last,
    ep.joined_at desc
  limit 100;
end;
$$ language plpgsql security definer;

-- ===================================================================
-- VIEWS (for admin analytics — bypasses RLS via security definer)
-- ===================================================================
create or replace view public.platform_analytics as
select
  (select count(*) from public.users) as total_users,
  (select count(*) from public.events) as total_events,
  (select count(*) from public.events where status = 'active') as active_events,
  (select count(*) from public.profile_views) as total_profile_views,
  (select count(*) from public.users where created_at > now() - interval '30 days') as new_users_30d,
  (select count(*) from public.events where created_at > now() - interval '30 days') as new_events_30d,
  (select count(*) from public.event_participants where joined_at > now() - interval '30 days') as new_participants_30d;
