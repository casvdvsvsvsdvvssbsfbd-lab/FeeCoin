-- ============================================
-- 20250101000005_seed_test_user.sql
-- DEV/TEST ONLY: Real Supabase test user + RLS fixes
-- so referral data is persisted to the real database.
--
-- NOTE(PROD): Remove/replace with real Telegram auth before shipping.
-- To apply: open Supabase Dashboard > SQL Editor > paste this file's
-- contents > Run. (Or: supabase db push)
-- ============================================

-- Ensure pgcrypto is available for crypt()/gen_salt()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) NOTE: We DO NOT manually INSERT into auth.users here.
--    A raw INSERT into auth.users (used previously) produces a broken row
--    that GoTrue/Supabase Auth cannot read, causing signInWithPassword to
--    fail with HTTP 500: "Database error querying schema".
--    Instead, the app (`initializeAuthSession`) creates the test user via the
--    proper `auth.signUp()` path, which writes a valid auth.users +
--    auth.identities pair. That produces a working session.
--    Here we ONLY clean up any previously-broken raw-seeded test user so the
--    next signUp can create a fresh, valid one.
DELETE FROM auth.identities WHERE user_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001';
DELETE FROM public.users WHERE id = '00000000-0000-0000-0000-000000000001';

-- 1b) Fix the create_user_extensions() trigger function.
--    The remote DB may hold a broken version of this function that
--    references NEW.raw_user_meta_data, which exists on auth.users but
--    NOT on public.users, causing the public.users INSERT to fail with:
--    record "new" has no field "raw_user_meta_data".
--    Re-create it to only derive data from columns present on public.users.
--    Each INSERT is wrapped in its own BEGIN/EXCEPTION block so a failure
--    in one table never aborts the auth.users INSERT (which would turn a
--    sign-in/sign-up into a 500 error).
CREATE OR REPLACE FUNCTION create_user_extensions()
RETURNS TRIGGER AS $$
BEGIN
    -- Create profile (never fail the outer transaction)
    BEGIN
        INSERT INTO profiles (user_id, language_code, timezone)
        VALUES (NEW.id, 'en', 'UTC')
        ON CONFLICT DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'create_user_extensions: profile insert failed for %: %', NEW.id, SQLERRM;
    END;

    -- Create wallet (never fail the outer transaction)
    BEGIN
        INSERT INTO wallets (user_id, balance, pending_balance, withdrawable_balance)
        VALUES (NEW.id, 0, 0, 0)
        ON CONFLICT DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'create_user_extensions: wallet insert failed for %: %', NEW.id, SQLERRM;
    END;

    -- Create streak (never fail the outer transaction)
    BEGIN
        INSERT INTO streaks (user_id, current_streak, longest_streak, freeze_available)
        VALUES (NEW.id, 0, 0, FALSE)
        ON CONFLICT DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'create_user_extensions: streak insert failed for %: %', NEW.id, SQLERRM;
    END;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2) Create matching row in public.users.
--    The create_user_extensions trigger auto-creates profile/wallet/streak.
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
VALUES (
  '00000000-0000-0000-0000-000000000001',
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

-- 3) RLS policies for `referrals`.
--    RLS is enabled but these tables had NO policies, so the referral
--    screen could not read real data via the anon client.
CREATE POLICY "Users can view referrals as referrer"
  ON referrals FOR SELECT USING (auth.uid() = referrer_id);

CREATE POLICY "Users can view referrals as referee"
  ON referrals FOR SELECT USING (auth.uid() = referee_id);

CREATE POLICY "Users can insert referrals"
  ON referrals FOR INSERT WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Service role can manage referrals"
  ON referrals FOR ALL USING (auth.role() = 'service_role');

-- 3b) RLS policies for `referral_links` (safety net).
--    These are normally added by the base schema, but re-declaring them
--    here guarantees the app can SELECT + INSERT the user's referral
--    one-time code even if the base schema policies were never applied
--    to an existing database. `DO` blocks avoid duplicate-policy errors.
DO $$ BEGIN
  CREATE POLICY "Users can view own referral links"
    ON referral_links FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert own referral links"
    ON referral_links FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can view referral links by code"
    ON referral_links FOR SELECT USING (TRUE);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 4) RLS policies for `referral_rewards`.
CREATE POLICY "Users can view own referral rewards"
  ON referral_rewards FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage referral rewards"
  ON referral_rewards FOR ALL USING (auth.role() = 'service_role');
