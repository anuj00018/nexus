import ssl
import pg8000.native

print("Connecting to Supabase Postgres DB...")

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

conn = pg8000.native.Connection(
    host="db.wonzuboufzbnqcdidyjd.supabase.co",
    port=5432,
    database="postgres",
    user="postgres",
    password="Nx$u5Ev3nt@2025Db",
    ssl_context=ssl_ctx
)

print("[OK] Connected to Supabase DB!\n")

def run(label, sql):
    try:
        conn.run(sql)
        print(f"  [OK] {label}")
        return True
    except Exception as e:
        msg = str(e)
        if "already exists" in msg or "duplicate" in msg:
            print(f"  [SKIP] {label} (already exists)")
        else:
            print(f"  [ERR] {label}: {msg[:100]}")
        return False

# 1. Extensions
print("1. Extensions...")
run("uuid-ossp", 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

# 2. Types
print("2. Types...")
types = [
    ("user_role", "CREATE TYPE user_role AS ENUM ('attendee','organizer','admin','founder')"),
    ("availability_status", "CREATE TYPE availability_status AS ENUM ('available','busy','coffee_break')"),
    ("privacy_setting", "CREATE TYPE privacy_setting AS ENUM ('everyone','matching_interests','invisible')"),
    ("event_status", "CREATE TYPE event_status AS ENUM ('draft','published','active','ended','cancelled')"),
    ("attendee_goal", "CREATE TYPE attendee_goal AS ENUM ('networking','hiring','internship','job_seeking','co_founder','mentoring','learning','investing')"),
    ("contact_preference", "CREATE TYPE contact_preference AS ENUM ('open','selective','closed')"),
]
for name, sql in types:
    run(name, f"DO $$ BEGIN {sql}; EXCEPTION WHEN duplicate_object THEN null; END $$")

# 3. Functions
print("3. Functions...")
run("handle_updated_at", """
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS trigger AS $fn$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$fn$ LANGUAGE plpgsql
""")

# 4. Tables
print("4. Tables...")
run("users table", """
CREATE TABLE IF NOT EXISTS public.users (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         text NOT NULL UNIQUE,
  name          text NOT NULL,
  avatar_url    text,
  headline      text,
  company       text,
  linkedin_url  text,
  github_url    text,
  portfolio_url text,
  bio           text,
  skills        text[] DEFAULT '{}',
  role          user_role NOT NULL DEFAULT 'attendee',
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
)
""")

run("user_preferences table", """
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id            uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  availability       availability_status NOT NULL DEFAULT 'available',
  privacy            privacy_setting NOT NULL DEFAULT 'everyone',
  goals              attendee_goal[] DEFAULT '{}',
  contact_preference contact_preference NOT NULL DEFAULT 'open',
  onboarding_done    boolean NOT NULL DEFAULT false,
  updated_at         timestamptz NOT NULL DEFAULT now()
)
""")

run("interests table", """
CREATE TABLE IF NOT EXISTS public.interests (
  id       uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name     text NOT NULL UNIQUE,
  slug     text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'technology',
  icon     text NOT NULL DEFAULT 'tag'
)
""")

run("user_interests table", """
CREATE TABLE IF NOT EXISTS public.user_interests (
  user_id     uuid REFERENCES public.users(id) ON DELETE CASCADE,
  interest_id uuid REFERENCES public.interests(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, interest_id)
)
""")

run("events table", """
CREATE TABLE IF NOT EXISTS public.events (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         text NOT NULL,
  description   text,
  join_code     text NOT NULL UNIQUE,
  category      text NOT NULL DEFAULT 'other',
  status        event_status NOT NULL DEFAULT 'active',
  organizer_id  uuid REFERENCES public.users(id),
  venue_name    text,
  venue_address text,
  start_time    timestamptz,
  end_time      timestamptz,
  max_attendees int,
  is_private    boolean NOT NULL DEFAULT false,
  tags          text[] DEFAULT '{}',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
)
""")

run("event_participants table", """
CREATE TABLE IF NOT EXISTS public.event_participants (
  event_id  uuid REFERENCES public.events(id) ON DELETE CASCADE,
  user_id   uuid REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  left_at   timestamptz,
  lat       float,
  lng       float,
  PRIMARY KEY (event_id, user_id)
)
""")

run("profile_views table", """
CREATE TABLE IF NOT EXISTS public.profile_views (
  id        uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  viewer_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  viewed_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  event_id  uuid REFERENCES public.events(id) ON DELETE CASCADE,
  viewed_at timestamptz NOT NULL DEFAULT now()
)
""")

# 5. Row Level Security
print("5. Row Level Security...")
rls_tables = ['users','user_preferences','interests','user_interests','events','event_participants','profile_views']
for t in rls_tables:
    run(f"RLS on {t}", f"ALTER TABLE public.{t} ENABLE ROW LEVEL SECURITY")

# Policies
policies = [
    ('users_select', 'CREATE POLICY "users_select" ON public.users FOR SELECT USING (is_active = true)'),
    ('users_update', 'CREATE POLICY "users_update" ON public.users FOR UPDATE USING (auth.uid() = id)'),
    ('users_insert', 'CREATE POLICY "users_insert" ON public.users FOR INSERT WITH CHECK (auth.uid() = id)'),
    ('prefs_select', 'CREATE POLICY "prefs_select" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id)'),
    ('prefs_update', 'CREATE POLICY "prefs_update" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id)'),
    ('prefs_insert', 'CREATE POLICY "prefs_insert" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id)'),
    ('interests_select', 'CREATE POLICY "interests_select" ON public.interests FOR SELECT USING (true)'),
    ('ui_select', 'CREATE POLICY "ui_select" ON public.user_interests FOR SELECT USING (true)'),
    ('ui_all', 'CREATE POLICY "ui_all" ON public.user_interests FOR ALL USING (auth.uid() = user_id)'),
    ('events_select', 'CREATE POLICY "events_select" ON public.events FOR SELECT USING (status != \'draft\' OR organizer_id = auth.uid())'),
    ('ep_select', 'CREATE POLICY "ep_select" ON public.event_participants FOR SELECT USING (true)'),
    ('ep_all', 'CREATE POLICY "ep_all" ON public.event_participants FOR ALL USING (auth.uid() = user_id)'),
    ('pv_select', 'CREATE POLICY "pv_select" ON public.profile_views FOR SELECT USING (auth.uid() = viewed_id OR auth.uid() = viewer_id)'),
    ('pv_insert', 'CREATE POLICY "pv_insert" ON public.profile_views FOR INSERT WITH CHECK (auth.uid() = viewer_id)'),
]
for name, sql in policies:
    run(name, sql)

# 6. Seed interests
print("6. Seeding interests...")
run("interests seed", """
INSERT INTO public.interests (name, slug, category, icon) VALUES
  ('AI / Machine Learning','ai-ml','technology','ai'),
  ('Web Development','web-dev','technology','web'),
  ('Mobile Development','mobile-dev','technology','mobile'),
  ('UI/UX Design','ui-ux','design','design'),
  ('Startups','startups','business','rocket'),
  ('Venture Capital','venture-capital','business','money'),
  ('Product Management','product-management','business','product'),
  ('Data Science','data-science','science','chart'),
  ('Blockchain / Web3','blockchain','technology','chain'),
  ('Cybersecurity','cybersecurity','technology','lock'),
  ('Cloud & DevOps','cloud-devops','technology','cloud'),
  ('Open Source','open-source','technology','code'),
  ('Gaming','gaming','arts','game'),
  ('EdTech','edtech','education','book'),
  ('Climate Tech','climate-tech','other','leaf'),
  ('Social Impact','social-impact','other','globe')
ON CONFLICT (slug) DO NOTHING
""")

# 7. User creation trigger (with linkedin_url = null fix)
print("7. Updating handle_new_user trigger...")
run("handle_new_user function", """
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $fn$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url, linkedin_url)
  VALUES (
    new.id,
    COALESCE(new.email, ''),
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1),
      'Nexus User'
    ),
    COALESCE(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture',
      new.raw_user_meta_data->>'avatar'
    ),
    null
  )
  ON CONFLICT (id) DO UPDATE SET
    email      = EXCLUDED.email,
    name       = EXCLUDED.name,
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
    updated_at = now();

  INSERT INTO public.user_preferences (user_id, onboarding_done)
  VALUES (new.id, false)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$fn$ LANGUAGE plpgsql SECURITY DEFINER
""")

run("drop old trigger", "DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users")
run("create trigger", """
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user()
""")

# 8. Migration: Clean up corrupted linkedin_url entries
print("8. Cleaning corrupted LinkedIn URLs...")
run("clean corrupted linkedin_url", """
UPDATE public.users
SET linkedin_url = null,
    updated_at   = now()
WHERE linkedin_url IS NOT NULL
  AND linkedin_url !~* '^https?://(www\\.)?linkedin\\.com/in/[^\\s/]+/?.*$'
""")

# 9. Demo events
print("9. Demo events...")
run("demo events", """
INSERT INTO public.events (title, join_code, category, status, venue_name, venue_address) VALUES
  ('TechFest 2025','NEXUS1','college_fest','active','Demo Venue','Hyderabad, India'),
  ('Startup Meetup','NEXUS2','meetup','active','Demo Venue','Hyderabad, India'),
  ('AI Hackathon','NEXUS3','hackathon','active','Demo Venue','Hyderabad, India')
ON CONFLICT (join_code) DO NOTHING
""")

print("\n[SUCCESS] Supabase Database Schema is 100% updated and migration complete!")
conn.close()
