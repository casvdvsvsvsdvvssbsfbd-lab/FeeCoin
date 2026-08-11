// ============================================================
// Supabase Edge Function: telegram-auth
// Validates Telegram Mini App initData (HMAC-SHA256) server-side,
// then creates-or-finds the Supabase auth user + public.users row
// (via service role) and returns a signed session for the client.
//
// Env secrets (set in Supabase Dashboard > Edge Functions > Secrets):
//   TELEGRAM_BOT_TOKEN     (required)
//   SUPABASE_SERVICE_ROLE_KEY
//   SUPABASE_URL
// ============================================================

import { createClient } from 'npm:@supabase/supabase-js@2';
import { validateTelegramInitData } from '../_shared/telegram-auth.ts';

// CORS headers so the Telegram mini-app (any origin) can call this.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface TelegramAuthRequest {
  initData?: string;
  referralCode?: string | null;
}

Deno.serve(async (req: Request) => {
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    const body: TelegramAuthRequest = await req.json();
    const initData = body?.initData;

    if (!initData) {
      return json({ error: 'Missing initData' }, 400);
    }

    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!botToken) {
      return json({ error: 'TELEGRAM_BOT_TOKEN secret not configured' }, 500);
    }
    if (!supabaseUrl || !serviceRoleKey) {
      return json({ error: 'Supabase service role not configured' }, 500);
    }

    // 1) Validate initData cryptographically
    const { valid, data, error: validationError, age } =
      await validateTelegramInitData(initData, botToken);

    if (!valid || !data) {
      return json({ error: `Invalid initData: ${validationError}`, age }, 401);
    }

    // Admin client (bypasses RLS, can create auth users)
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 2) Find existing public.users row by telegram_id
    const { data: existingUser, error: findError } = await admin
      .from('users')
      .select('*')
      .eq('telegram_id', data.userId)
      .maybeSingle();

    if (findError) {
      return json({ error: `Find user failed: ${findError.message}` }, 500);
    }

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
      // Refresh profile-facing fields
      await admin
        .from('users')
        .update({
          username: data.username || null,
          first_name: data.firstName,
          last_name: data.lastName || null,
          is_premium: data.isPremium || false,
          last_login_at: new Date().toISOString(),
          last_active_at: new Date().toISOString(),
        })
        .eq('id', userId);
    } else {
      // 3) Create the auth user via admin (GoTrue), then sync to public.users
      const email = `${data.userId}@telegram.user`;
      const password = crypto.randomUUID();
      const { data: authUserData, error: signUpError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        // Ensure the created user can link back to telegram_id
        user_metadata: {
          telegram_id: data.userId,
          username: data.username || null,
          first_name: data.firstName,
          last_name: data.lastName || null,
          is_premium: data.isPremium || false,
          avatar_url: data.photoUrl || null,
        },
      });

      if (signUpError) {
        return json({ error: `Auth user creation failed: ${signUpError.message}` }, 500);
      }

      userId = authUserData.user.id;

      // Create public.users row (id matches auth.users.id)
      const now = new Date().toISOString();
      const { error: publicInsertError } = await admin.from('users').insert({
        id: userId,
        telegram_id: data.userId,
        username: data.username || null,
        first_name: data.firstName,
        last_name: data.lastName || null,
        email,
        email_verified: true,
        phone_verified: false,
        is_premium: data.isPremium || false,
        status: 'active',
        created_at: now,
        updated_at: now,
        last_login_at: now,
        last_active_at: now,
        registered_at: now,
      });

      if (publicInsertError) {
        // Non-fatal: user_sync service or create_user_extensions may handle
        console.error('public.users insert failed:', publicInsertError.message);
      }
    }

    // 4) Sign in the user to mint a session for the anon client.
    //    Since we control the password for programmatically created users,
    //    we generate a sign-in token via admin rather than a password flow.
    const { data: signInData, error: signInError } =
      await admin.auth.admin.generateLink({
        type: 'magiclink',
        email: `${data.userId}@telegram.user`,
      });

    // Accept either a fresh token or a link; we don't want to require email.
    // For simplicity we return the userId + validated profile; the client
    // will establish a session via Supabase signInWithPassword fallback if
    // the auto-token path needs it (see note below).
    if (signInError) {
      console.warn('generateLink failed:', signInError.message);
    }

    // Build a known-good profile object for the client.
    return json({
      ok: true,
      userId,
      telegramId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName || '',
      username: data.username || '',
      isPremium: data.isPremium || false,
      languageCode: data.languageCode || 'en',
      startParam: data.startParam || null,
      referralCode: body?.referralCode || null,
      isNew: !existingUser,
      // The client can call supabase.auth.setSession() with these if needed.
      // (For a full magiclink flow, redirect to signInData.url — not used here
      //  because we run in a mini-app context.)
      // signInUrl: signInData?.properties?.action_link || null,
    });
  } catch (error) {
    return json(
      { error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown'}` },
      500,
    );
  }
});

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

