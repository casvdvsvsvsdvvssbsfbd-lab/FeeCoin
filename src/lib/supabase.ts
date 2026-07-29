import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Player, StakingContract, Transaction, WithdrawalRequest, ReferralLog, LeaderboardEntry } from '../types';

// ─── CONFIG CHECK ───
declare const process: { env: { [key: string]: string | undefined } };

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured =
  SUPABASE_URL.startsWith('https://') &&
  SUPABASE_ANON_KEY.length > 10 &&
  !SUPABASE_URL.includes('your-project.supabase.co');

let supabaseClient: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
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
export const supabase = supabaseClient as SupabaseClient;

// ─── ensureConnection helper ───
export async function ensureConnection(): Promise<boolean> {
  if (!IS_OFFLINE_MODE && supabaseClient) {
    try {
      const { error } = await supabaseClient.from('players').select('id').limit(1);
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

// ═══════════════════════════════════════════════
//  PUBLIC API FUNCTIONS
// ═══════════════════════════════════════════════

export async function getOrCreatePlayer(telegramId: number, username: string, firstName: string) {
  if (!IS_OFFLINE_MODE && supabaseClient) {
    try {
      const { data: existing, error: fetchError } = await supabaseClient
        .from('players')
        .select('*')
        .eq('telegram_id', telegramId)
        .single();

      if (existing) return { player: existing as Player, isNew: false };
      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      const { data: newPlayer, error: insertError } = await supabaseClient
        .from('players')
        .insert({
          telegram_id: telegramId,
          username,
          first_name: firstName,
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
        })
        .select()
        .single();

      if (insertError) throw insertError;
      return { player: newPlayer as Player, isNew: true };
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
      const updateData: Record<string, number> = { fee_balance: feeBalance };
      if (pendingFee !== undefined) updateData.pending_fee = pendingFee;
      if (lifetimeEarningsFee !== undefined) updateData.lifetime_earnings_fee = lifetimeEarningsFee;

      const { data, error } = await supabaseClient
        .from('players')
        .update(updateData)
        .eq('id', playerId)
        .select()
        .single();

      if (error) throw error;
      return data as Player;
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
        .from('players')
        .update({ today_watched: todayWatched, total_watched: totalWatched })
        .eq('id', playerId);
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
      const { data, error } = await supabaseClient
        .from('transactions')
        .insert(tx)
        .select()
        .single();
      if (error) throw error;
      return data as Transaction;
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
  if (!IS_OFFLINE_MODE && supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('staking_contracts')
        .insert({
          player_id: playerId,
          amount_fee: amountFee,
          interest_rate: interestRate,
          start_date: new Date().toISOString(),
          end_date: endDate,
          status: 'active',
        })
        .select()
        .single();
      if (error) throw error;
      return data as StakingContract;
    } catch (err) {
      console.warn('[Supabase] createStakingContract failed, falling back to mock:', err);
    }
  }

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
  if (!IS_OFFLINE_MODE && supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('staking_contracts')
        .select('*')
        .eq('player_id', playerId)
        .in('status', ['active', 'locked'])
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as StakingContract[];
    } catch (err) {
      console.warn('[Supabase] getActiveStakings failed, falling back to mock:', err);
    }
  }

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
        .from('withdrawal_requests')
        .insert({
          player_id: playerId,
          amount_fee: amountFee,
          method,
          account_details: accountDetails,
          status: 'pending',
        })
        .select()
        .single();
      if (error) throw error;
      return data as WithdrawalRequest;
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
        .eq('player_id', playerId)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as Transaction[];
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
        .from('referral_logs')
        .select('*')
        .eq('referrer_id', referrerId)
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data as ReferralLog[];
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
      const { error } = await supabaseClient
        .from('referral_logs')
        .insert({
          referrer_id: referrerId,
          referred_username: referredUsername,
          bonus_fee: bonusFee,
        });
      if (error) throw error;
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
        .from('players')
        .update({ pending_fee: pendingFee })
        .eq('id', playerId);
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
      let query = supabaseClient.from('players').select('id, username, first_name, avatar_url');
      
      if (period === 'daily') {
        const today = new Date().toISOString().split('T')[0];
        query = query.eq('updated_at', today);
      } else if (period === 'weekly') {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        query = query.gte('updated_at', weekAgo);
      }
      
      const { data, error } = await query
        .order('fee_balance', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return (data || []).map((p: any, idx: number) => ({
        rank: idx + 1,
        player_id: p.id,
        username: p.username,
        first_name: p.first_name,
        score: p.fee_balance || 0,
        avatar_url: p.avatar_url,
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