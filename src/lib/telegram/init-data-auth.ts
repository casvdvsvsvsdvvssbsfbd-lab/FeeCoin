// ============================================================
// Telegram InitData Auth (browser-side bridge)
// Reads window.Telegram.WebApp.initData, sends it to the
// Supabase Edge Function (telegram-auth) for server-side
// HMAC-SHA256 validation, and returns the authenticated profile.
//
// ANY failure (non-Telegram env, missing secret, network error)
// throws - the caller (auth-store) decides whether to fall back
// to the dev/test user.
// ============================================================

import { supabase, IS_OFFLINE_MODE } from '@/lib/supabase';
import { telegramSDK } from './telegram-sdk';

export interface TelegramAuthProfile {
  userId: string;
  telegramId: number;
  firstName: string;
  lastName: string;
  username: string;
  isPremium: boolean;
  languageCode: string;
  startParam: string | null;
  referralCode: string | null;
  isNew: boolean;
}

const EDGE_FUNCTION_NAME = 'telegram-auth';

/**
 * Await SDK init, ensure we have real initData, then call the
 * Edge Function. Throws on any failure so callers can fall back.
 */
export async function authenticateWithTelegram(): Promise<TelegramAuthProfile> {
  // 1) Offline mode => no real backend to validate against.
  if (IS_OFFLINE_MODE) {
    throw new Error('Offline mode: Telegram auth unavailable');
  }
  if (!supabase) {
    throw new Error('Supabase client unavailable');
  }

  // 2) Wait for the Telegram SDK to finish loading (or fall back to mock).
  //    In a real Telegram client this exposes window.Telegram.WebApp.
  await telegramSDK.waitForInitialization();

  const initData = telegramSDK.getInitDataString();
  if (!initData) {
    throw new Error('No Telegram initData available (not running inside Telegram)');
  }

  const startParam = telegramSDK.getStartParam();

  // 3) Call the Edge Function to validate + create-or-find user via the
  //    official SDK functions client (handles URL + anon headers).
  //    Race against a timeout so a non-responsive / hung Edge Function
  //    rejects within EDGE_TIMEOUT_MS instead of hanging the app startup.
  const EDGE_TIMEOUT_MS = 8000;
  const invokePromise = supabase.functions.invoke(
    EDGE_FUNCTION_NAME,
    {
      method: 'POST',
      body: { initData, referralCode: startParam },
    },
  );

  const { data: payload, error } = await Promise.race([
    invokePromise,
    new Promise<{ data: null; error: Error }>((resolve) => {
      setTimeout(() => {
        resolve({
          data: null,
          error: new Error(`Telegram auth timed out after ${EDGE_TIMEOUT_MS}ms`),
        });
      }, EDGE_TIMEOUT_MS);
    }),
  ]);

  if (error) {
    throw new Error(
      typeof error.message === 'string' ? error.message : 'Telegram auth failed',
    );
  }
  if (!payload?.ok || !payload?.userId) {
    throw new Error(payload?.error || 'Telegram auth returned an invalid response');
  }

  return {
    userId: payload.userId,
    telegramId: payload.telegramId,
    firstName: payload.firstName ?? '',
    lastName: payload.lastName ?? '',
    username: payload.username ?? '',
    isPremium: payload.isPremium ?? false,
    languageCode: payload.languageCode ?? 'en',
    startParam: payload.startParam ?? null,
    referralCode: payload.referralCode ?? null,
    isNew: payload.isNew ?? false,
  };
}
