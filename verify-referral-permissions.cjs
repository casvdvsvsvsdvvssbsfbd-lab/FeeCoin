/* verify-referral-permissions.cjs
 *
 * Verifies the "permission denied for schema public" (403) fix against the
 * REAL Supabase database using ONLY the anon key (no service_role needed):
 *
 *   Test A - unauthenticated (anon) SELECT on referral_links  -> proves anon schema USAGE
 *   Test B - authenticated (test@fee.dev) SELECT + INSERT on  -> proves the app's referral
 *                      referral_links                          write path lands in the real DB
 *
 * Run:  node verify-referral-permissions.cjs
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// --- load .env manually (no dependency on dotenv) ---
const ENV = {};
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) ENV[m[1]] = m[2].trim();
  }
}

const URL = ENV.NEXT_PUBLIC_SUPABASE_URL || ENV.VITE_SUPABASE_URL;
const ANON = ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY || ENV.VITE_SUPABASE_ANON_KEY;
const TEST_EMAIL = 'test@fee.dev';
const TEST_PASSWORD = 'TestPass123!';

const log = (...a) => console.log('[verify]', ...a);

(async () => {
  if (!URL || !ANON) {
    log('FATAL: missing NEXT_PUBLIC_SUPABASE_URL / ANON_KEY in .env');
    process.exit(2);
  }
  log('Supabase URL =', URL);

  const anon = createClient(URL, ANON, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // --- TEST A: anon (no session) SELECT on referral_links ---
  log('\n=== TEST A: anon (unauthenticated) SELECT referral_links (limit 1) ===');
  const a = await anon.from('referral_links').select('*').limit(1);
  if (a.error) {
    log('RESULT: anon SELECT FAILED  ->', a.error.code, '|', a.error.message, '(HTTP', a.error.status + ')');
    log('        ^ This is the "permission denied for schema public" (403) blocker for the anon role.');
  } else {
    log('RESULT: anon SELECT OK      ->', a.data?.length, 'row(s). Schema USAGE is granted to anon.');
  }

  // --- TEST B: authenticated test user (same flow as auth-store.ts) ---
  log('\n=== TEST B: signInWithPassword as', TEST_EMAIL, '===');
  const si = await anon.auth.signInWithPassword({ email: TEST_EMAIL, password: TEST_PASSWORD });
  if (si.error || !si.data?.session) {
    log('RESULT: sign-in FAILED      ->', si.error?.code, '|', si.error?.message, '(HTTP', si.error?.status + ')');
    log('        ^ If code = email_not_confirmed, confirm the test user in Supabase Dashboard (Auth > Users).');
    process.exit(0);
  }
  const session = si.data.session;
  log('SIGN-IN OK: user_id =', session.user.id);

  const authed = createClient(URL, ANON, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: 'Bearer ' + session.access_token } },
  });

  // TEST B1: authenticated SELECT
  log('\n=== TEST B1: authenticated SELECT referral_links for', session.user.id, '===');
  const b = await authed
    .from('referral_links')
    .select('id,user_id,code,created_at')
    .eq('user_id', session.user.id);
  if (b.error) {
    log('RESULT: authed SELECT FAILED ->', b.error.code, '|', b.error.message, '(HTTP', b.error.status + ')');
  } else {
    log('RESULT: authed SELECT OK    ->', JSON.stringify(b.data));
  }

  // TEST B2: authenticated INSERT (exactly what the app's referral screen does)
  log('\n=== TEST B2: authenticated INSERT a referral_links row ===');
  const code = 'TEST' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const c = await authed
    .from('referral_links')
    .insert({ user_id: session.user.id, code, is_active: true, uses_count: 0 })
    .select('id,user_id,code,created_at')
    .single();
  if (c.error) {
    log('RESULT: authed INSERT FAILED ->', c.error.code, '|', c.error.message, '(HTTP', c.error.status + ')');
    log('        ^ This is the "permission denied for schema public" (403) blocking referral code persistence.');
  } else {
    log('RESULT: authed INSERT OK    ->', JSON.stringify(c.data));
    log('        SUCCESS: referral code persisted to the REAL database!');
    // keep the DB clean - remove the probe row
    const d = await authed.from('referral_links').delete().eq('code', code);
    log('cleanup       :', d.error ? 'delete error ' + d.error.code : 'test row removed');
  }
  process.exit(0);
})().catch((e) => {
  log('THREW:', e);
  process.exit(1);
});
