-- ============================================================
-- Migration 20250101000008 - Support Telegram Mini App auth
-- Best-effort (idempotent): ensures public.users can be looked up
-- by telegram_id and that the Edge Function's upsert path works.
-- Does NOT create the actual auth user (that's done at runtime by
-- the telegram-auth Edge Function with the service role) and does
-- NOT hardcode any Telegram credentials here.
-- ============================================================

-- 1) Unique lookup path for Telegram users.
--    telegram_id may be NULL for non-Telegram rows, so use a partial
--    unique index (safe to re-run).
CREATE UNIQUE INDEX IF NOT EXISTS users_telegram_id_key
  ON public.users (telegram_id)
  WHERE telegram_id IS NOT NULL;

-- 2) Helper: enrich a newly-created auth/Telegram user with default
--    profile/wallet/streak rows. Idempotent (ON CONFLICT DO NOTHING).
--    Used by the Edge Function as a safety net in case the app's
--    create_user_extensions trigger is not present.
CREATE OR REPLACE FUNCTION ensure_telegram_user_extensions(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO profiles (user_id, language_code, timezone, is_public, show_on_leaderboard)
    VALUES (p_user_id, 'en', 'UTC', TRUE, TRUE)
    ON CONFLICT (user_id) DO NOTHING;

    INSERT INTO wallets (user_id, balance, pending_balance, withdrawable_balance,
                         total_earned, total_withdrawn, currency)
    VALUES (p_user_id, 0, 0, 0, 0, 0, 'FC')
    ON CONFLICT (user_id) DO NOTHING;

    INSERT INTO streaks (user_id, current_streak, longest_streak, freeze_available)
    VALUES (p_user_id, 0, 0, FALSE)
    ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- 3) Grant execution to the roles used by the Edge Function.
GRANT EXECUTE ON FUNCTION public.ensure_telegram_user_extensions(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_telegram_user_extensions(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.ensure_telegram_user_extensions(UUID) TO anon;

