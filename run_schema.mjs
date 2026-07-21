import pg from 'pg';

const client = new pg.Client({
  host: 'db.wonzuboufzbnqcdidyjd.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Nx$u5Ev3nt@2025Db',
  ssl: { rejectUnauthorized: false },
});

console.log('🔌 Connecting to Supabase...');
await client.connect();
console.log('✅ Connected!\n');

async function run(label, sql) {
  try {
    await client.query(sql);
    console.log(`  ✅ ${label}`);
    return true;
  } catch (e) {
    if (e.message.includes('already exists') || e.message.includes('duplicate')) {
      console.log(`  ⏭️  ${label} (already exists)`);
    } else {
      console.log(`  ❌ ${label}: ${e.message.substring(0, 80)}`);
    }
    return false;
  }
}

// ── Extensions ──
console.log('📦 Extensions...');
await run('uuid-ossp', `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

// ── Types ──
console.log('📝 Types...');
const types = [
  [`user_role`, `CREATE TYPE user_role AS ENUM ('attendee','organizer','admin','founder')`],
  [`availability_status`, `CREATE TYPE availability_status AS ENUM ('available','busy','coffee_break')`],
  [`privacy_setting`, `CREATE TYPE privacy_setting AS ENUM ('everyone','matching_interests','invisible')`],
  [`event_status`, `CREATE TYPE event_status AS ENUM ('draft','published','active','ended','cancelled')`],
  [`attendee_goal`, `CREATE TYPE attendee_goal AS ENUM ('networking','hiring','internship','job_seeking','co_founder','mentoring','learning','investing')`],
  [`contact_preference`, `CREATE TYPE contact_preference AS ENUM ('open','selective','closed')`],
];
for (const [name, sql] of types) {
  await run(name, `DO $$ BEGIN ${sql}; EXCEPTION WHEN duplicate_object THEN null; END $$`);
}

// ── Helper function ──
console.log('⚙️ Functions...');
await run('handle_updated_at', `
  CREATE OR REPLACE FUNCTION handle_updated_at()
  RETURNS trigger AS $fn$
  BEGIN
    new.updated_at = now();
    RETURN new;
  END;
  $fn$ LANGUAGE plpgsql
`);

// ── Users table ──
console.log('📋 Tables...');
await run('users', `
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
`);

// ── User preferences ──
await run('user_preferences', `
  CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id            uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    availability       availability_status NOT NULL DEFAULT 'available',
    privacy            privacy_setting NOT NULL DEFAULT 'everyone',
    goals              attendee_goal[] DEFAULT '{}',
    contact_preference contact_preference NOT NULL DEFAULT 'open',
    onboarding_done    boolean NOT NULL DEFAULT false,
    updated_at         timestamptz NOT NULL DEFAULT now()
  )
`);

// ── Interests ──
await run('interests', `
  CREATE TABLE IF NOT EXISTS public.interests (
    id       uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name     text NOT NULL UNIQUE,
    slug     text NOT NULL UNIQUE,
    category text NOT NULL DEFAULT 'technology',
    icon     text NOT NULL DEFAULT '🔖'
  )
`);

// ── User interests (join) ──
await run('user_interests', `
  CREATE TABLE IF NOT EXISTS public.user_interests (
    user_id     uuid REFERENCES public.users(id) ON DELETE CASCADE,
    interest_id uuid REFERENCES public.interests(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, interest_id)
  )
`);

// ── Events ──
await run('events', `
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
`);

// ── Event participants ──
await run('event_participants', `
  CREATE TABLE IF NOT EXISTS public.event_participants (
    event_id  uuid REFERENCES public.events(id) ON DELETE CASCADE,
    user_id   uuid REFERENCES public.users(id) ON DELETE CASCADE,
    joined_at timestamptz NOT NULL DEFAULT now(),
    left_at   timestamptz,
    lat       float,
    lng       float,
    PRIMARY KEY (event_id, user_id)
  )
`);

// ── Profile views ──
await run('profile_views', `
  CREATE TABLE IF NOT EXISTS public.profile_views (
    id        uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    viewer_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    viewed_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    event_id  uuid REFERENCES public.events(id) ON DELETE CASCADE,
    viewed_at timestamptz NOT NULL DEFAULT now()
  )
`);

// ── RLS policies ──
console.log('🔒 Row Level Security...');
const rlsTables = ['users','user_preferences','interests','user_interests','events','event_participants','profile_views'];
for (const t of rlsTables) {
  await run(`RLS on ${t}`, `ALTER TABLE public.${t} ENABLE ROW LEVEL SECURITY`);
}

// Policies
const policies = [
  ['users_select', `CREATE POLICY "users_select" ON public.users FOR SELECT USING (is_active = true)`],
  ['users_update', `CREATE POLICY "users_update" ON public.users FOR UPDATE USING (auth.uid() = id)`],
  ['users_insert', `CREATE POLICY "users_insert" ON public.users FOR INSERT WITH CHECK (auth.uid() = id)`],
  ['prefs_select', `CREATE POLICY "prefs_select" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id)`],
  ['prefs_update', `CREATE POLICY "prefs_update" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id)`],
  ['prefs_insert', `CREATE POLICY "prefs_insert" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id)`],
  ['interests_select', `CREATE POLICY "interests_select" ON public.interests FOR SELECT USING (true)`],
  ['ui_select', `CREATE POLICY "ui_select" ON public.user_interests FOR SELECT USING (true)`],
  ['ui_all', `CREATE POLICY "ui_all" ON public.user_interests FOR ALL USING (auth.uid() = user_id)`],
  ['events_select', `CREATE POLICY "events_select" ON public.events FOR SELECT USING (status != 'draft' OR organizer_id = auth.uid())`],
  ['ep_select', `CREATE POLICY "ep_select" ON public.event_participants FOR SELECT USING (true)`],
  ['ep_all', `CREATE POLICY "ep_all" ON public.event_participants FOR ALL USING (auth.uid() = user_id)`],
  ['pv_select', `CREATE POLICY "pv_select" ON public.profile_views FOR SELECT USING (auth.uid() = viewed_id OR auth.uid() = viewer_id)`],
  ['pv_insert', `CREATE POLICY "pv_insert" ON public.profile_views FOR INSERT WITH CHECK (auth.uid() = viewer_id)`],
];
for (const [name, sql] of policies) {
  await run(name, sql);
}

// ── Seed interests ──
console.log('🌱 Seeding interests...');
await run('interests seed', `
  INSERT INTO public.interests (name, slug, category, icon) VALUES
    ('AI / Machine Learning','ai-ml','technology','🤖'),
    ('Web Development','web-dev','technology','🌐'),
    ('Mobile Development','mobile-dev','technology','📱'),
    ('UI/UX Design','ui-ux','design','🎨'),
    ('Startups','startups','business','🚀'),
    ('Venture Capital','venture-capital','business','💰'),
    ('Product Management','product-management','business','📋'),
    ('Data Science','data-science','science','📊'),
    ('Blockchain / Web3','blockchain','technology','⛓️'),
    ('Cybersecurity','cybersecurity','technology','🔐'),
    ('Cloud & DevOps','cloud-devops','technology','☁️'),
    ('Open Source','open-source','technology','🔓'),
    ('Gaming','gaming','arts','🎮'),
    ('EdTech','edtech','education','📚'),
    ('Climate Tech','climate-tech','other','🌱'),
    ('Social Impact','social-impact','other','🌍')
  ON CONFLICT (slug) DO NOTHING
`);

// ── Auto-create user profile trigger ──
console.log('🔧 User creation trigger...');
await run('handle_new_user fn', `
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger AS $fn$
  BEGIN
    INSERT INTO public.users (id, email, name, avatar_url)
    VALUES (
      new.id,
      new.email,
      COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
      new.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE SET
      name       = EXCLUDED.name,
      avatar_url = EXCLUDED.avatar_url,
      updated_at = now();
    RETURN new;
  END;
  $fn$ LANGUAGE plpgsql SECURITY DEFINER
`);

await run('drop old trigger', `DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users`);
await run('create trigger', `
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user()
`);

// ── Demo events ──
console.log('🎪 Demo events...');
await run('demo events', `
  INSERT INTO public.events (title, join_code, category, status, venue_name, venue_address) VALUES
    ('TechFest 2025','NEXUS1','college_fest','active','Demo Venue','Hyderabad, India'),
    ('Startup Meetup','NEXUS2','meetup','active','Demo Venue','Hyderabad, India'),
    ('AI Hackathon','NEXUS3','hackathon','active','Demo Venue','Hyderabad, India')
  ON CONFLICT (join_code) DO NOTHING
`);

// ── Insert user record for existing auth user ──
console.log('👤 Creating user record from existing auth...');
await run('backfill users', `
  INSERT INTO public.users (id, email, name, avatar_url)
  SELECT
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1)),
    raw_user_meta_data->>'avatar_url'
  FROM auth.users
  ON CONFLICT (id) DO UPDATE SET
    name       = EXCLUDED.name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = now()
`);

console.log('\n🎉 ALL DONE! Database is ready.');
await client.end();
