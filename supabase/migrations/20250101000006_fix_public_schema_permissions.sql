-- ============================================================
-- Migration 20250101000006 - Fix `public` schema permissions
-- ============================================================
-- Problem:
--   Console error: "permission denied for schema public" (HTTP
--   403 Forbidden) when the anon/authenticated client queries
--   `public.*` (e.g. referral_links SELECT/INSERT from the
--   Profile -> Referral screen).
--
--   This is NOT an RLS issue - RLS policies already exist on the
--   tables. It is a schema-level permission issue: the `anon` and
--   `authenticated` roles lack USAGE on the `public` schema
--   (Supabase's secure default runs `REVOKE ALL ON SCHEMA public
--   FROM PUBLIC`), so EVERY query is rejected before RLS is
--   evaluated.
--
-- These GRANT statements are additive and idempotent (safe to
-- re-run: granting the same privilege twice has no adverse effect).
--
-- To apply to the REMOTE project:
--   npx supabase db push            (project must be linked + logged in)
--   -- OR paste this file into the Supabase SQL Editor (Remote) --
-- ============================================================

-- 1) Schema-level USAGE is required BEFORE any table privilege can
--    be exercised. Grant to both app roles.
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 2) Authenticated users: full CRUD on every table. RLS policies
--    scope the rows to the authenticated user's own data, so this
--    does NOT bypass row-level security.
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- 3) Anonymous users: read-only access to public reference data
--    (leaderboards, countries, languages, surveys, offerwalls...).
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- 4) DURABILITY: apply the same privileges to FUTURE tables created
--    in this schema, so newly added tables don't re-trigger the
--    "permission denied for schema public" error.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO anon;

-- 5) Sequences: allow authenticated/anon to use sequence-backed
--    defaults (defensive - the current schema uses gen_random_uuid()
--    defaults, but future serial columns require USAGE on sequences).
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE ON SEQUENCES TO anon;

-- ============================================================
-- Post-apply verification (run after granting):
--   SELECT has_schema_privilege('anon',        'public', 'USAGE');
--   SELECT has_schema_privilege('authenticated', 'public', 'USAGE');
--   SELECT tablename,
--          has_table_privilege('authenticated', 'public.'||tablename, 'INSERT') AS auth_insert
--   FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
-- ============================================================
