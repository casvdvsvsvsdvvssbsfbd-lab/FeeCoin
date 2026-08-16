// ============================================
// Auth Store
// ============================================

import { create } from 'zustand';
import { supabase, IS_OFFLINE_MODE } from '../supabase';
import { authenticateWithTelegram } from '../telegram/init-data-auth';
import { telegramSDK } from '../telegram/telegram-sdk';

// ============================================================
// DEV/TEST ONLY: Real Supabase test user credentials.
// NEVER used in production. Gated by NODE_ENV/import.meta.env.
// The test user was created via the proper supabase.auth.signUp()
// path (2026-08-06) which writes a valid auth.users + auth.identities
// pair, so GoTrue can read it and issue a session:
//   id:      d1c877b3-1d94-4657-b12a-38579dd8916f
//   email:   test@fee.dev
//   password: TestPass123!
// ============================================================
const TEST_USER_ID = 'd1c877b3-1d94-4657-b12a-38579dd8916f';
const TEST_EMAIL = 'test@fee.dev';
const TEST_PASSWORD = 'TestPass123!';

/** True only in a local dev build (never in production). */
function isDevEnvironment(): boolean {
  if (typeof process !== 'undefined' && process?.env?.NODE_ENV) {
    return process.env.NODE_ENV !== 'production';
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any)?.env) {
    return (import.meta as any).env?.MODE !== 'production';
  }
  return true;
}

const DEV_ONLY = isDevEnvironment();

export interface AuthState {
  // User state
  user: any | null;
  profile: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Session state
  session: any | null;
  lastActivity: Date | null;

  // Auth source
  authSource: 'telegram' | 'test' | 'none' | null;

  // Actions
  setUser: (user: any | null) => void;
  setProfile: (profile: any | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSession: (session: any | null) => void;
  updateLastActivity: () => void;
  reset: () => void;
  setTelegramUser: (user: any, initData: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state: not authenticated until the session init resolves.
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  session: null,
  lastActivity: null,
  authSource: null,

  // Actions
  setUser: (user) => set({
    user,
    isAuthenticated: !!user,
    lastActivity: new Date(),
  }),

  setTelegramUser: (user: any, initData: string) => {
    // Generate a proper UUID from Telegram ID
    const telegramId = user.id || 0;
    const uuid = `00000000-0000-0000-0000-${telegramId.toString().padStart(12, '0')}`;
    
    set({
      user: {
        id: uuid,
        firstName: user.first_name || 'User',
        lastName: user.last_name || '',
        username: user.username || 'user',
        email: null,
        telegramId: telegramId,
        isPremium: user.is_premium || false,
        languageCode: user.language_code || 'en',
      },
      profile: {
        user_id: uuid,
        username: user.username || 'user',
        first_name: user.first_name || 'User',
        last_name: user.last_name || '',
        is_premium: user.is_premium || false,
        language_code: user.language_code || 'en',
      },
      isAuthenticated: true,
      authSource: 'telegram',
      lastActivity: new Date(),
    });
  },

  setProfile: (profile) => set({ profile }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setSession: (session) => set({
    session,
    user: session?.user || null,
    isAuthenticated: !!session?.user,
  }),

  updateLastActivity: () => set({
    lastActivity: new Date(),
  }),

  reset: () => set({
    user: null,
    profile: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    session: null,
    lastActivity: null,
    authSource: null,
  }),
}));

/**
 * Attempt Telegram-first authentication.
 * Returns true if a real Telegram session was established.
 */
async function tryTelegramAuth(store: AuthState): Promise<boolean> {
  try {
    const profile = await authenticateWithTelegram();
    // Get initData from telegramSDK
    const initData = telegramSDK.getInitDataString() || '';
    // Use the new setTelegramUser action which generates proper UUID from Telegram ID
    store.setTelegramUser({
      id: profile.telegramId,
      first_name: profile.firstName,
      last_name: profile.lastName,
      username: profile.username,
      is_premium: profile.isPremium,
      language_code: profile.languageCode,
    }, initData);
    store.setError(null);
    (store as any).authSource = 'telegram';
    return true;
  } catch (error: any) {
    console.warn('[Auth] Telegram auth failed, will fall back:', error?.message ?? error);
    (store as any).authSource = DEV_ONLY ? 'test' : 'none';
    return false;
  }
}

/**
 * DEV/TEST ONLY: sign in as the fixed test user so the referral/wallet
 * data persists to the real DB during local development. Never invoked
 * in production builds.
 */
async function signInTestUser(store: AuthState): Promise<void> {
  if (!DEV_ONLY) {
    console.warn('[Auth] Test-user sign-in blocked in production.');
    return;
  }

  store.setLoading(true);
  try {
    // 1) Try to restore an existing session first.
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session?.user?.id) {
      store.setSession(sessionData.session);
      store.setLoading(false);
      return;
    }

    // 2) Try to sign in with the fixed test user.
    let { data, error } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    // 3) If sign-in failed (e.g. the test user was seeded via a raw
    //    auth.users INSERT that GoTrue can't read, or the user doesn't
    //    exist yet), create the user through the proper signUp path.
    if (error && !data.session) {
      console.warn('[Auth] Test sign-in failed, attempting signUp. Reason:', {
        code: error.code,
        status: (error as any)?.status,
        message: error.message,
      });

      try {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: TEST_EMAIL,
          password: TEST_PASSWORD,
        });

        if (signUpError && !signUpError.message?.includes('already registered')) {
          console.warn('[Auth] signUp also failed:', signUpError.message);
        } else {
          const retry = await supabase.auth.signInWithPassword({
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
          });
          data = retry.data;
          error = retry.error;
        }
      } catch (err: any) {
        console.warn('[Auth] signUp threw:', err?.message);
      }
    }

    if (error) {
      console.error('[Auth] Test user sign-in FAILED:', {
        code: error.code,
        status: (error as any)?.status,
        message: error.message,
      });
      // Fall back to demo id so the UI still renders.
      store.setUser({
        id: TEST_USER_ID,
        firstName: 'Test',
        lastName: 'User',
        username: 'test_user',
        email: TEST_EMAIL,
      });
      store.setLoading(false);
      return;
    }

    if (data.session) {
      store.setSession(data.session);
      store.setError(null);
      (store as any).authSource = 'test';
    }
  } catch (err: any) {
    console.warn('[Auth] Session init failed, using offline demo user:', err?.message);
  } finally {
    store.setLoading(false);
  }
}

/**
 * Production fallback: sets a demo/guest user so the UI always renders
 * even when there is no Telegram initData or the Edge Function fails.
 * The error message is surfaced non-blockingly by consumers.
 */
function setGuestFallback(store: AuthState, message: string): void {
  store.setUser({
    id: '00000000-0000-0000-0000-000000000000',  // ← Haqiqiy UUID format
    firstName: 'Guest',
    lastName: '',
    username: 'guest',
    email: null,
    telegramId: 0,
  });
  store.setProfile({
    user_id: '00000000-0000-0000-0000-000000000000',  // ← Haqiqiy UUID format
    username: 'guest',
    first_name: 'Guest',
    language_code: 'en',
  });
  store.setError(message);
  (store as any).authSource = 'none';
}

/**
 * App startup auth initializer.
 * Priority: real Telegram auth (via Edge Function) > dev/test user.
 * In production with no Telegram context, a demo/guest fallback is used so
 * the UI NEVER gets stuck — the app always renders (with a non-blocking
 * error message) instead of staying on a blank/loading screen.
 */
async function initializeAuthSessionInternal(): Promise<void> {
  const store = useAuthStore.getState();

  // Offline mode → keep demo fallback (dev only).
  if (IS_OFFLINE_MODE) {
    if (DEV_ONLY) {
      store.setUser({
        id: TEST_USER_ID,
        firstName: 'Test',
        lastName: 'User',
        username: 'test_user',
        email: TEST_EMAIL,
      });
      store.setError(null);
      (store as any).authSource = 'test';
    } else {
      console.warn('[Auth] Offline mode in production — using guest fallback.');
      setGuestFallback(store, 'Service temporarily unavailable');
    }
    store.setLoading(false);
    return;
  }

  store.setLoading(true);
  try {
    // 1) Telegram-first (only meaningful inside a real Telegram client).
    const telegramOk = await tryTelegramAuth(store);
    if (telegramOk) {
      store.setLoading(false);
      return;
    }

    // 2) Dev-only fallback to the test user.
    if (DEV_ONLY) {
      await signInTestUser(store);
    } else {
      // Production without Telegram data → guest fallback so the UI renders.
      console.warn('[Auth] No Telegram initData in production — using guest fallback.');
      setGuestFallback(store, 'Authentication required');
    }
  } catch (err: any) {
    console.error('[Auth] initializeAuthSession failed:', err?.message);
    // Always ensure the UI renders even on an unexpected error.
    if (!DEV_ONLY && !useAuthStore.getState().user) {
      setGuestFallback(store, 'Authentication unavailable');
    }
    store.setLoading(false);
  }
}

/** Bound the whole auth init so it can never hang the app startup. */
const AUTH_INIT_TIMEOUT_MS = 10000;

// Maintains the exported function signature used by main.tsx.
export async function initializeAuthSession(): Promise<void> {
  const store = useAuthStore.getState();
  await Promise.race([
    initializeAuthSessionInternal(),
    new Promise<void>((resolve) => {
      setTimeout(() => {
        console.warn(`[Auth] Auth init timed out after ${AUTH_INIT_TIMEOUT_MS}ms — releasing UI.`);
        // Guarantee isLoading is cleared and a user exists so the app renders.
        const s = useAuthStore.getState();
        if (s.isLoading) s.setLoading(false);
        if (!s.user) {
          setGuestFallback(s, 'Authentication timed out');
          s.setLoading(false);
        }
        resolve();
      }, AUTH_INIT_TIMEOUT_MS);
    }),
  ]);
}
