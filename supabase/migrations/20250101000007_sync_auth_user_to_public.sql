-- ============================================================
-- 20250101000007_sync_auth_user_to_public.sql
-- DEV/TEST ONLY: Sync the REAL Supabase Auth test user into the
-- `public.users` table so `referral_links.user_id` FK resolves.
--
-- Why this is needed:
--   The auth test user exists in `auth.users` (id
--   d1c877b3-1d94-4657-b12a-38579dd8916f, email test@fee.dev) but
--   there is NO matching row in `public.users`. Every table that
--   references `users(id)` (e.g. referral_links, profiles, wallets,
--   transactions) enforces a FOREIGN KEY, so the app's
--   Profile -> Referral code INSERT fails with:
--      23503: insert or update on table "referral_links" violates
--              foreign key constraint "referral_links_user_id_fkey"
--
--   The GRANT fix (migration 000006) already fixed the schema-level
--   "permission denied for schema public" (403). This migration
--   creates the missing parent row so the FK constraint is satisfied.
--
-- NOTE(PROD): Remove/adapt for real Telegram auth before shipping.
-- ============================================================

-- Ensure the auth user's public.users parent row exists.
-- The `create_user_extensions_after_insert` trigger on `users`
-- auto-creates matching profiles / wallets / streaks rows.
INSERT INTO public.users (
  id,
  telegram_id,
  username,
  first_name,
  last_name,
  status,
  email,
  email_verified,
  phone_verified,
  is_premium,
  last_login_at,
  last_active_at,
  registered_at
)
VALUES
  (
    'd1c877b3-1d94-4657-b12a-38579dd8916f',
    1000000001,
    'test_user',
    'Test',
    'User',
    'active',
    'test@fee.dev',
    true,
    false,
    false,
    now(),
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- Safety net: if the trigger was missing/disabled, ensure the
-- dependant rows exist so the app's other writes (wallet, profile)
-- also satisfy their FK constraints. Each is idempotent.
INSERT INTO profiles (user_id, language_code, timezone)
VALUES ('d1c877b3-1d94-4657-b12a-38579dd8916f', 'en', 'UTC')
ON CONFLICT DO NOTHING;

INSERT INTO wallets (user_id, balance, pending_balance, withdrawable_balance)
VALUES ('d1c877b3-1d94-4657-b12a-38579dd8916f', 0, 0, 0)
ON CONFLICT DO NOTHING;

INSERT INTO streaks (user_id, current_streak, longest_streak, freeze_available)
VALUES ('d1c877b3-1d94-4657-b12a-38579dd8916f', 0, 0, FALSE)
ON CONFLICT DO NOTHING;
