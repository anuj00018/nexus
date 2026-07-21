-- ===================================================================
-- Nexus — Quick Start Schema (No PostGIS required)
-- Run this in Supabase SQL Editor → paste → click Run
-- ===================================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- Custom Types
create type if not exists user_role as enum ('attendee', 'organizer', 'admin', 'founder');
create type if not exists availability_status as enum ('available', 'busy', 'coffee_break');
create type if not exists privacy_setting as enum ('everyone', 'matching_interests', 'invisible');
create type if not exists event_status as enum ('draft', 'published', 'active', 'ended', 'cancelled');
create type if not exists attendee_goal as enum (
  'networking', 'hiring', 'internship', 'job_seeking',
  'co_founder', 'mentoring', 'learning', 'investing'
);
create type if not exists contact_preference as enum ('open', 'selective', 'closed');

-- Updated_at helper
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ===================================================================
-- TABLE: users
-- ===================================================================
create table if not exists public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null unique,
  name          text not null,
  avatar_url    text,
  headline      text,
  company       text,
  linkedin_url  text,
  github_url    text,
  portfolio_url text,
  bio           text,
  skills        text[] default '{}',
  role          user_role not null default 'attendee',
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Public profiles viewable" on public.users
  for select using (is_active = true);

create policy "Users update own profile" on public.users
  for update using (auth.uid() = id);

create policy "Users insert own profile" on public.users
  for insert with check (auth.uid() = id);

-- ===================================================================
-- TABLE: user_preferences
-- ===================================================================
create table if not exists public.user_preferences (
  user_id            uuid primary key references public.users(id) on delete cascade,
  availability       availability_status not null default 'available',
  privacy            privacy_setting not null default 'everyone',
  goals              attendee_goal[] default '{}',
  contact_preference contact_preference not null default 'open',
  onboarding_done    boolean not null default false,
  updated_at         timestamptz not null default now()
);

alter table public.user_preferences enable row level security;

create policy "Users view own prefs" on public.user_preferences
  for select using (auth.uid() = user_id);

create policy "Users update own prefs" on public.user_preferences
  for update using (auth.uid() = user_id);

create policy "Users insert own prefs" on public.user_preferences
  for insert with check (auth.uid() = user_id);

-- ===================================================================
-- TABLE: interests
-- ===================================================================
create table if not exists public.interests (
  id       uuid primary key default uuid_generate_v4(),
  name     text not null unique,
  slug     text not null unique,
  category text not null default 'technology',
  icon     text not null default '🔖'
);

alter table public.interests enable row level security;
create policy "Interests viewable by all" on public.interests
  for select using (true);

-- Seed interests
insert into public.interests (name, slug, category, icon) values
  ('AI / Machine Learning', 'ai-ml', 'technology', '🤖'),
  ('Web Development', 'web-dev', 'technology', '🌐'),
  ('Mobile Development', 'mobile-dev', 'technology', '📱'),
  ('UI/UX Design', 'ui-ux', 'design', '🎨'),
  ('Startups', 'startups', 'business', '🚀'),
  ('Venture Capital', 'venture-capital', 'business', '💰'),
  ('Product Management', 'product-management', 'business', '📋'),
  ('Data Science', 'data-science', 'science', '📊'),
  ('Blockchain / Web3', 'blockchain', 'technology', '⛓️'),
  ('Cybersecurity', 'cybersecurity', 'technology', '🔐'),
  ('Cloud & DevOps', 'cloud-devops', 'technology', '☁️'),
  ('Open Source', 'open-source', 'technology', '🔓'),
  ('Gaming', 'gaming', 'arts', '🎮'),
  ('EdTech', 'edtech', 'education', '📚'),
  ('Climate Tech', 'climate-tech', 'other', '🌱'),
  ('Social Impact', 'social-impact', 'other', '🌍')
on conflict (slug) do nothing;

-- ===================================================================
-- TABLE: user_interests
-- ===================================================================
create table if not exists public.user_interests (
  user_id     uuid references public.users(id) on delete cascade,
  interest_id uuid references public.interests(id) on delete cascade,
  primary key (user_id, interest_id)
);

alter table public.user_interests enable row level security;

create policy "User interests viewable" on public.user_interests
  for select using (true);

create policy "Users manage own interests" on public.user_interests
  for all using (auth.uid() = user_id);

-- ===================================================================
-- TABLE: events
-- ===================================================================
create table if not exists public.events (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  description   text,
  join_code     text not null unique,
  category      text not null default 'other',
  status        event_status not null default 'active',
  organizer_id  uuid references public.users(id),
  venue_name    text,
  venue_address text,
  start_time    timestamptz,
  end_time      timestamptz,
  max_attendees int,
  is_private    boolean not null default false,
  tags          text[] default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.events enable row level security;
create policy "Active events viewable" on public.events
  for select using (status != 'draft' or organizer_id = auth.uid());

-- ===================================================================
-- TABLE: event_participants
-- ===================================================================
create table if not exists public.event_participants (
  event_id       uuid references public.events(id) on delete cascade,
  user_id        uuid references public.users(id) on delete cascade,
  joined_at      timestamptz not null default now(),
  left_at        timestamptz,
  lat            float,
  lng            float,
  primary key (event_id, user_id)
);

alter table public.event_participants enable row level security;

create policy "Participants viewable" on public.event_participants
  for select using (true);

create policy "Users manage own participation" on public.event_participants
  for all using (auth.uid() = user_id);

-- ===================================================================
-- TABLE: profile_views
-- ===================================================================
create table if not exists public.profile_views (
  id          uuid primary key default uuid_generate_v4(),
  viewer_id   uuid references public.users(id) on delete cascade,
  viewed_id   uuid references public.users(id) on delete cascade,
  event_id    uuid references public.events(id) on delete cascade,
  viewed_at   timestamptz not null default now()
);

alter table public.profile_views enable row level security;

create policy "Users see who viewed them" on public.profile_views
  for select using (auth.uid() = viewed_id or auth.uid() = viewer_id);

create policy "Users insert views" on public.profile_views
  for insert with check (auth.uid() = viewer_id);

-- ===================================================================
-- FUNCTION: Auto-create user profile on LinkedIn sign-in
-- ===================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, avatar_url, linkedin_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'iss'
  )
  on conflict (id) do update set
    name       = excluded.name,
    avatar_url = excluded.avatar_url,
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: runs every time someone signs in via LinkedIn
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ===================================================================
-- DEMO EVENTS (for testing without real events)
-- ===================================================================
insert into public.events (title, join_code, category, status, venue_name, venue_address)
values
  ('TechFest 2025',   'NEXUS1', 'college_fest',   'active', 'Demo Venue', 'Hyderabad, India'),
  ('Startup Meetup',  'NEXUS2', 'meetup',          'active', 'Demo Venue', 'Hyderabad, India'),
  ('AI Hackathon',    'NEXUS3', 'hackathon',        'active', 'Demo Venue', 'Hyderabad, India')
on conflict (join_code) do nothing;
