-- ===================================================================
-- One-time migration: clean up linkedin_url values corrupted by the old
-- handle_new_user() trigger, which was writing the OIDC "iss" (issuer)
-- claim — e.g. "https://www.linkedin.com" — into linkedin_url instead of
-- a real profile URL.
--
-- Run this ONCE in the Supabase SQL Editor, after applying the corrected
-- trigger in schema_quickstart.sql / schema.sql.
--
-- Effect: any linkedin_url that is not a valid
--   https://[www.]linkedin.com/in/<username>
-- profile URL gets set back to NULL. Affected users will be redirected to
-- /onboarding (via the updated middleware.ts) to re-enter a real profile
-- URL the next time they visit a protected route.
-- ===================================================================

update public.users
set linkedin_url = null,
    updated_at   = now()
where linkedin_url is not null
  and linkedin_url !~* '^https?://(www\.)?linkedin\.com/in/[^\s/]+/?.*$';

-- Optional sanity check — run after the update to confirm no bad rows remain:
-- select id, email, linkedin_url from public.users
-- where linkedin_url is not null
--   and linkedin_url !~* '^https?://(www\.)?linkedin\.com/in/[^\s/]+/?.*$';
