import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';
import type { Player, StakingContract, Transaction, WithdrawalRequest, ReferralLog, LeaderboardEntry } from '../types';

// ─── CONFIG CHECK ───
// The app is served by Next.js (src/app/page.tsx), so env vars are read from
// process.env.NEXT_PUBLIC_* (statically inlined by Next at build/dev time).
// We also fall back to VITE_* (import.meta.env) for standalone Vite usage.

declare const process: { env: { [key: string]: string | undefined } };

// Vite-only fallback (safe-reference). Next.js inlines process.env at build
// time; this reference is only used when running under Vite. We access it
// via a guarded expression so server-side prerender never throws.
const viteEnv = typeof import.meta !== 'undefined' ? (import.meta as any)?.env : undefined;
const viteUrl = viteEnv?.VITE_SUPABASE_URL;
const viteKey = viteEnv?.VITE_SUPABASE_ANON_KEY;

const SUPABASE_URL =
  process?.env?.NEXT_PUBLIC_SUPABASE_URL ||
  (typeof viteUrl === 'string' && viteUrl ? viteUrl : '') ||
  '';
const SUPABASE_ANON_KEY =
  process?.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  (typeof viteKey === 'string' && viteKey ? viteKey : '') ||
  '';

const isSupabaseConfigured =
  SUPABASE_URL.startsWith('https://') &&
  SUPABASE_ANON_KEY.length > 10 &&
  !SUPABASE_URL.includes('your-project.supabase.co');

let supabaseClient: SupabaseClient<Database> | null = null;

if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY) as SupabaseClient<Database>;
    console.log('[Supabase] Connected to remote database.');
  } catch (e) {
    console.warn('[Supabase] Failed to create client, falling back to offline mode.', e);
    supabaseClient = null;
  }
} else {
  console.log('[Supabase] No valid Supabase keys found. Running in OFFLINE mock mode.');
}

// ─── OFFLINE MOCK STORE ───
const LS_KEY = 'watchearn_mock_db';

function getMockDb(): Record<string, any[]> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveMockDb(db: Record<string, any[]>) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(db));
  } catch {}
}

function getOrInitCollection<T>(name: string, initial: T[] = []): T[] {
  const db = getMockDb();
  if (!db[name]) db[name] = initial;
  const data = db[name] as T[];
  saveMockDb(db);
  return data;
}

function pushToCollection(name: string, item: any): any {
  const db = getMockDb();
  if (!db[name]) db[name] = [];
  const newItem = { ...item, id: crypto.randomUUID?.() || `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`, created_at: new Date().toISOString() };
  db[name].push(newItem);
  saveMockDb(db);
  return newItem;
}

function updateInCollection(name: string, id: string, updates: Record<string, any>): any | null {
  const db = getMockDb();
  if (!db[name]) return null;
  const idx = db[name].findIndex((item: any) => item.id === id);
  if (idx === -1) return null;
  db[name][idx] = { ...db[name][idx], ...updates, updated_at: new Date().toISOString() };
  saveMockDb(db);
  return db[name][idx];
}

function findInCollection<T>(name: string, predicate: (item: T) => boolean): T | undefined {
  const db = getMockDb();
  if (!db[name]) return undefined;
  return (db[name] as T[]).find(predicate);
}

function filterCollection<T>(name: string, predicate: (item: T) => boolean): T[] {
  const db = getMockDb();
  if (!db[name]) return [];
  return (db[name] as T[]).filter(predicate);
}

function queryCollection<T>(name: string, opts?: {
  eq?: [string, any][];
  orderBy?: string;
  orderAsc?: boolean;
  limit?: number;
}): T[] {
  const db = getMockDb();
  if (!db[name]) return [];
  let results = [...db[name]] as T[];

  if (opts?.eq) {
    for (const [key, val] of opts.eq) {
      results = results.filter((item: any) => item[key] === val);
    }
  }

  if (opts?.orderBy) {
    results.sort((a: any, b: any) => {
      const aVal = a[opts.orderBy!] ?? '';
      const bVal = b[opts.orderBy!] ?? '';
      if (typeof aVal === 'string') {
        return opts.orderAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return opts.orderAsc ? aVal - bVal : bVal - aVal;
    });
  }

  if (opts?.limit && opts.limit > 0) {
    results = results.slice(0, opts.limit);
  }

  return results;
}

// ─── MOCK DATA SEEDER ───
function ensureMockPlayerExists(telegramId: number, username: string, firstName: string): Player {
  const existing = findInCollection<Player>('players', (p) => p.telegram_id === telegramId);
  if (existing) return existing;

  const newPlayer = pushToCollection('players', {
    telegram_id: telegramId,
    username,
    first_name: firstName,
    avatar_url: null,
    fee_balance: 0,
    pending_fee: 0,
    level: 1,
    rank: 'Rookie',
    total_watched: 0,
    today_watched: 0,
    lifetime_earnings_fee: 0,
    total_referrals: 0,
    referral_earnings: 0,
    first_seen_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }) as Player;

  return newPlayer;
}

// ─── SIMMULATED NETWORK DELAY ───
async function simulateDelay(ms = 150): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── MODE FLAG ───
export const IS_OFFLINE_MODE = !isSupabaseConfigured || supabaseClient === null;

// ─── SUPABASE CLIENT ───
export const supabase = supabaseClient as SupabaseClient<Database>;

// ─── ensureConnection helper ───
export async function ensureConnection(): Promise<boolean> {
  if (!IS_OFFLINE_MODE && supabaseClient) {
    try {
      const { error } = await supabaseClient.from('users').select('id').limit(1);
      if (error) {
        console.warn('[Supabase] Connection test failed:', error.message);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }
  return true;
}

// ─── Internal helpers: composite Player DTO from new schema ───
function mapToPlayer(
  user: Database['public']['Tables']['users']['Row'],
  profile: Database['public']['Tables']['profiles']['Row'] | null,
  wallet: Database['public']['Tables']['wallets']['Row'] | null,
): Player {
  return {
    id: user.id,
    telegram_id: user.telegram_id || 0,
    username: user.username || '',
    first_name: user.first_name || '',
    avatar_url: profile?.avatar_url || undefined,
    fee_balance: wallet?.balance || 0,
    pending_fee: wallet?.pending_balance || 0,
    level: profile?.level || 1,
    rank: profile?.rank || 'Rookie',
    total_watched: profile?.ads_watched || 0,
    today_watched: 0,
    lifetime_earnings_fee: wallet?.total_earned || 0,
    total_referrals: profile?.referrals_count || 0,
    referral_earnings: 0,
    created_at: user.created_at,
    updated_at: user.updated_at,
    first_seen_at: user.registered_at || user.created_at,
  };
}

async function fetchPlayerById(userId: string): Promise<Player | null> {
  if (!supabaseClient) return null;
  try {
    const { data: user, error: userError } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (userError || !user) return null;

    const [{ data: profile }, { data: wallet }] = await Promise.all([
      supabaseClient.from('profiles').select('*').eq('user_id', userId).maybeSingle(),
      supabaseClient.from('wallets').select('*').eq('user_id', userId).maybeSingle(),
    ]);

    return mapToPlayer(user, profile, wallet);
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════
//  PUBLIC API FUNCTIONS
// ═══════════════════════════════════════════════

export async function getOrCreatePlayer(telegramId: number, username: string, firstName: string) {
  if (!IS_OFFLINE_MODE && supabaseClient) {
    try {
      const { data: existingUser, error: fetchError } = await supabaseClient
        .from('users')
        .select('*')
        .eq('telegram_id', telegramId)
        .maybeSingle();

      if (existingUser) {
        const player = await fetchPlayerById(existingUser.id);
        if (player) return { player, isNew: false };
      }
      if (fetchError) throw fetchError;

      const now = new Date().toISOString();
      const { data: newUser, error: insertError } = await supabaseClient
        .from('users')
        .insert({
          telegram_id: telegramId,
          username,
          first_name: firstName,
          status: 'active',
          email_verified: false,
          phone_verified: false,
          is_premium: false,
          last_login_at: now,
          last_active_at: now,
          registered_at: now,
        } as never)
        .select()
        .single();

      if (insertError) throw insertError;

      await Promise.all([
        supabaseClient.from('profiles').insert({
          user_id: newUser.id,
          language_code: 'en',
          timezone: 'UTC',
          level: 1,
          experience_points: 0,
          rank: 'Rookie',
          total_earned: 0,
          total_withdrawn: 0,
          tasks_completed: 0,
          ads_watched: 0,
          apps_installed: 0,
          referrals_count: 0,
          current_streak: 0,
          longest_streak: 0,
          is_public: true,
          show_on_leaderboard: true,
        } as never),
        supabaseClient.from('wallets').insert({
          user_id: newUser.id,
          balance: 0,
          pending_balance: 0,
          withdrawable_balance: 0,
          total_earned: 0,
          total_withdrawn: 0,
          currency: 'FC',
        } as never),
      ]);

      const player = mapToPlayer(newUser, null, null);
      return { player, isNew: true };
    } catch (err) {
      console.warn('[Supabase] getOrCreatePlayer failed, falling back to mock:', err);
    }
  }

  await simulateDelay();
  const player = ensureMockPlayerExists(telegramId, username, firstName);
  return { player, isNew: player.total_watched === 0 && player.lifetime_earnings_fee === 0 };
}

export async function updatePlayerBalance(
  playerId: string,
  feeBalance: number,
  pendingFee?: number,
  lifetimeEarningsFee?: number,
) {
  if (!IS_OFFLINE_MODE && supabaseClient) {
    try {
      const updateData: Record<string, number> = { balance: feeBalance };
      if (pendingFee !== undefined) updateData.pending_balance = pendingFee;
      if (lifetimeEarningsFee !== undefined) updateData.total_earned = lifetimeEarningsFee;

      const { error } = await supabaseClient
        .from('wallets').update(updateData as never)
        .eq('user_id', playerId);

      if (error) throw error;
      const player = await fetchPlayerById(playerId);
      if (player) return player;
      throw new Error('Player not found after balance update');
    } catch (err) {
      console.warn('[Supabase] updatePlayerBalance failed, falling back to mock:', err);
    }
  }

  await simulateDelay();
  const updates: Record<string, number> = { fee_balance: feeBalance };
  if (pendingFee !== undefined) updates.pending_fee = pendingFee;
  if (lifetimeEarningsFee !== undefined) updates.lifetime_earnings_fee = lifetimeEarningsFee;
  
  const updated = updateInCollection('players', playerId, updates);
  if (!updated) throw new Error('Player not found in offline store');
  return updated as Player;
}

export async function incrementWatchCount(playerId: string, todayWatched: number, totalWatched: number) {
  if (!IS_OFFLINE_MODE && supabaseClient) {
    try {
      const { error } = await supabaseClient
        .from('profiles')
        .update({ ads_watched: totalWatched } as never)
        .eq('user_id', playerId);
      if (error) throw error;
      return;
    } catch (err) {
      console.warn('[Supabase] incrementWatchCount failed, falling back to mock:', err);
    }
  }

  await simulateDelay(50);
  updateInCollection('players', playerId, { today_watched: todayWatched, total_watched: totalWatched });
}

export async function recordTransaction(tx: Omit<Transaction, 'id' | 'created_at'>) {
  if (!IS_OFFLINE_MODE && supabaseClient) {
    try {
      const { data: wallet, error: walletErr } = await supabaseClient
        .from('wallets')
        .select('id')
        .eq('user_id', tx.player_id)
        .maybeSingle();

      if (walletErr || !wallet) throw new Error('Wallet not found for transaction');

      const typeMap: Record<string, 'credit' | 'debit' | 'transfer' | 'withdrawal' | 'refund' | 'bonus' | 'penalty'> = {
        'ad_reward': 'credit',
        'staking_deposit': 'debit',
        'staking_interest': 'credit',
        'referral_bonus': 'bonus',
        'withdrawal': 'withdrawal',
        'withdrawal_fee': 'debit',
      };

      const { data, error } = await supabaseClient
        .from('transactions')
        .insert({
          user_id: tx.player_id,
          wallet_id: wallet.id,
          transaction_type: typeMap[tx.type] || 'credit',
          amount: tx.amount_fee,
          fee: 0,
          net_amount: tx.amount_fee,
          currency: 'FC',
          status: tx.status,
          description: tx.description,
          reference_type: tx.type,
          metadata: {},
        } as never)
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        player_id: data.user_id,
        type: tx.type,
        amount_fee: data.amount,
        status: data.status as Transaction['status'],
        description: data.description || '',
        created_at: data.created_at,
      } as Transaction;
    } catch (err) {
      console.warn('[Supabase] recordTransaction failed, falling back to mock:', err);
    }
  }

  await simulateDelay();
  return pushToCollection('transactions', tx) as Transaction;
}

export async function createStakingContract(
  playerId: string,
  amountFee: number,
  interestRate: number,
  endDate: string,
) {
  // Staking table does not exist in new schema — mock-only to preserve UI
  await simulateDelay();
  return pushToCollection('staking_contracts', {
    player_id: playerId,
    amount_fee: amountFee,
    interest_rate: interestRate,
    start_date: new Date().toISOString(),
    end_date: endDate,
    status: 'active',
  }) as StakingContract;
}

export async function getActiveStakings(playerId: string) {
  // Staking table does not exist in new schema — mock-only to preserve UI
  await simulateDelay();
  return queryCollection<StakingContract>('staking_contracts', {
    eq: [['player_id', playerId]],
    orderBy: 'created_at',
    orderAsc: false,
  }).filter((s) => s.status === 'active' || s.status === 'locked');
}

export async function createWithdrawalRequest(
  playerId: string,
  amountFee: number,
  method: WithdrawalRequest['method'],
  accountDetails: string,
) {
  if (!IS_OFFLINE_MODE && supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('settlements')
        .insert({
          user_id: playerId,
          amount: amountFee,
          currency: 'FC',
          status: 'pending',
          payment_method: method,
          payment_details: { account: accountDetails },
        } as never)
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        player_id: data.user_id,
        amount_fee: data.amount,
        method: data.payment_method as WithdrawalRequest['method'],
        account_details: (data.payment_details as any)?.account || '',
        status: 'pending' as WithdrawalRequest['status'],
        created_at: data.created_at,
        updated_at: data.updated_at,
      } as WithdrawalRequest;
    } catch (err) {
      console.warn('[Supabase] createWithdrawalRequest failed, falling back to mock:', err);
    }
  }

  await simulateDelay();
  return pushToCollection('withdrawal_requests', {
    player_id: playerId,
    amount_fee: amountFee,
    method,
    account_details: accountDetails,
    status: 'pending',
  }) as WithdrawalRequest;
}

export async function getTransactions(playerId: string) {
  if (!IS_OFFLINE_MODE && supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('transactions')
        .select('*')
        .eq('user_id', playerId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return (data || []).map((tx) => ({
        id: tx.id,
        player_id: tx.user_id,
        type: tx.reference_type || tx.transaction_type,
        amount_fee: tx.amount,
        status: tx.status as Transaction['status'],
        description: tx.description || '',
        created_at: tx.created_at,
      })) as Transaction[];
    } catch (err) {
      console.warn('[Supabase] getTransactions failed, falling back to mock:', err);
    }
  }

  await simulateDelay();
  return queryCollection<Transaction>('transactions', {
    eq: [['player_id', playerId]],
    orderBy: 'created_at',
    orderAsc: false,
    limit: 50,
  });
}

export async function getReferralLogs(referrerId: string) {
  if (!IS_OFFLINE_MODE && supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('referrals')
        .select('*, referee:users!referee_id(username, first_name)')
        .eq('referrer_id', referrerId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return (data || []).map((r: any) => ({
        id: r.id,
        referrer_id: r.referrer_id,
        referred_username: r.referee?.username || r.referee_id || 'Unknown',
        bonus_fee: r.reward_amount || 0,
        created_at: r.created_at,
      })) as ReferralLog[];
    } catch (err) {
      console.warn('[Supabase] getReferralLogs failed, falling back to mock:', err);
    }
  }

  await simulateDelay();
  return queryCollection<ReferralLog>('referral_logs', {
    eq: [['referrer_id', referrerId]],
    orderBy: 'created_at',
    orderAsc: false,
    limit: 20,
  });
}

export async function addReferralBonus(
  referrerId: string,
  referredUsername: string,
  bonusFee: number,
) {
  if (!IS_OFFLINE_MODE && supabaseClient) {
    try {
      const { data: referredUser } = await supabaseClient
        .from('users')
        .select('id')
        .eq('username', referredUsername)
        .maybeSingle();

      if (!referredUser) {
        console.warn('[Supabase] Referred user not found for bonus:', referredUsername);
        return;
      }

      const { data: referral, error: refError } = await supabaseClient
        .from('referrals')
        .insert({
          referrer_id: referrerId,
          referee_id: referredUser.id,
          status: 'active',
          reward_amount: bonusFee,
        } as never)
        .select()
        .single();

      if (refError) throw refError;

      await supabaseClient.from('referral_rewards').insert({
        referral_id: referral.id,
        user_id: referrerId,
        reward_type: 'referral_bonus',
        amount: bonusFee,
        currency: 'FC',
      } as never);

      return;
    } catch (err) {
      console.warn('[Supabase] addReferralBonus failed, falling back to mock:', err);
    }
  }

  await simulateDelay();
  pushToCollection('referral_logs', {
    referrer_id: referrerId,
    referred_username: referredUsername,
    bonus_fee: bonusFee,
  });
}

// ─── Utility: update player pending_fee ───
export async function updatePlayerPending(playerId: string, pendingFee: number) {
  if (!IS_OFFLINE_MODE && supabaseClient) {
    try {
      const { error } = await supabaseClient
        .from('wallets')
        .update({ pending_balance: pendingFee } as never)
        .eq('user_id', playerId);
      if (error) throw error;
      return;
    } catch (err) {
      console.warn('[Supabase] updatePlayerPending failed, falling back to mock:', err);
    }
  }

  await simulateDelay(50);
  updateInCollection('players', playerId, { pending_fee: pendingFee });
}

// ─── Leaderboard helpers ───
export async function getLeaderboard(period: 'daily' | 'weekly' | 'alltime', limit: number = 100): Promise<LeaderboardEntry[]> {
  if (!IS_OFFLINE_MODE && supabaseClient) {
    try {
const tableMap: Record<string, 'leaderboard_daily' | 'leaderboard_weekly' | 'leaderboard_all_time'> = {
        daily: 'leaderboard_daily',
        weekly: 'leaderboard_weekly',
        alltime: 'leaderboard_all_time',
      };
const table = tableMap[period] || 'leaderboard_all_time';

      // Cast to any to avoid deep type instantiation from relational joins
      const { data, error } = await (supabaseClient as any)
        .from(table)
        .select('*, user:users!user_id(username, first_name), profile:profiles!user_id(avatar_url)')
        .order('score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []).map((entry: any, idx: number) => ({
        rank: entry.rank || idx + 1,
        player_id: entry.user_id,
        username: entry.user?.username || '',
        first_name: entry.user?.first_name || '',
        score: entry.score || 0,
        avatar_url: entry.profile?.avatar_url,
      }));
    } catch (err) {
      console.warn('[Supabase] getLeaderboard failed, falling back to mock:', err);
    }
  }

  // Offline mock leaderboard
  await simulateDelay(100);
  const db = getMockDb();
  const players = db.players || [];
  return players
    .sort((a: any, b: any) => (b.fee_balance || 0) - (a.fee_balance || 0))
    .slice(0, limit)
    .map((p: any, idx: number) => ({
      rank: idx + 1,
      player_id: p.id,
      username: p.username,
      first_name: p.first_name,
      score: p.fee_balance || 0,
      avatar_url: p.avatar_url,
    }));
}