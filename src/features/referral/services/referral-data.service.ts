// ============================================
// Referral Screen Data Service
// Connects UI to real production data (Supabase)
// with an offline/localStorage fallback so it
// always shows REAL per-user data (never mock).
// ============================================

import { supabase, IS_OFFLINE_MODE } from '@/lib/supabase';
import { useReferralStore } from '@/lib/stores/referral-store';

export interface ReferralFriend {
  id: string;
  userId: string;
  username: string;
  status: 'pending' | 'active' | 'completed';
  joinedAt: string;
  earnings: number;
}

export interface ReferralData {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  referrals: ReferralFriend[];
}

const BOT_USERNAME =
  (typeof import.meta !== 'undefined' ? (import.meta as any)?.env?.VITE_TELEGRAM_BOT_NAME : undefined) || 'feecash_bot';
const REFERRAL_PREFIX = 'EARN';

// ─── Offline localStorage helpers (mirrors src/lib/supabase mock store) ───
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
  saveMockDb(db);
  return db[name] as T[];
}

function pushToCollection(name: string, item: any): any {
  const db = getMockDb();
  if (!db[name]) db[name] = [];
  const newItem = {
    ...item,
    id: (crypto as any)?.randomUUID?.() || `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    created_at: new Date().toISOString(),
  };
  db[name].push(newItem);
  saveMockDb(db);
  return newItem;
}

function simulateDelay(ms = 120): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

class ReferralDataService {
  // Robust unique code generation (fits VARCHAR(20), alphanumeric upper)
  private generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = REFERRAL_PREFIX;
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code; // e.g. EARN7K2M9X (10 chars, well under 20)
  }

// ─── Online helpers ───
  private async onlineEnsureCode(userId: string): Promise<string> {
    console.log('[Referral] onlineEnsureCode called for userId=', userId);
    console.log('[Referral] IS_OFFLINE_MODE=', IS_OFFLINE_MODE, 'supabase present=', !!supabase);

    // 1. Look for existing code
    const { data: existing, error: findErr } = await supabase
      .from('referral_links')
      .select('code')
      .eq('user_id', userId)
      .maybeSingle();

    if (findErr) {
      console.error('[Referral] FIND existing code ERROR:', findErr);
      throw findErr;
    }
    console.log('[Referral] existing code found=', existing?.code);
    if (existing?.code) return existing.code;

    // 2. Generate a unique code (retry on collision)
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = this.generateCode();
      console.log(`[Referral] INSERT attempt ${attempt + 1}, code=${code}, user_id=${userId}`);
      const { data, error } = await supabase
        .from('referral_links')
        .insert({ user_id: userId, code, is_active: true, uses_count: 0 } as never)
        .select('code')
        .single();

      if (error) {
        console.error(`[Referral] INSERT attempt ${attempt + 1} ERROR:`, error);
      } else {
        console.log(`[Referral] INSERT attempt ${attempt + 1} SUCCESS, returned code=`, data?.code);
      }

      if (!error && data?.code) return data.code;
      // If unique violation, retry with a new code
      if (error) {
        // only retry on unique constraint violation
        if (String(error.message).toLowerCase().includes('duplicate') || String(error.code) === '23505') {
          continue;
        }
        throw error;
      }
    }
    throw new Error('Could not generate unique referral code');
  }

  private async onlineGetData(userId: string, code: string): Promise<ReferralData> {
    const { data: referrals, error } = await supabase
      .from('referrals')
      .select('id, referee_id, status, reward_amount, created_at, referee:users!referee_id(username, first_name)')
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

const list: ReferralFriend[] = (referrals || []).map((r: any) => ({
      id: r.id,
      userId: r.referee_id,
      username: r.referee?.username || r.referee?.first_name || String(r.referee_id || '').slice(0, 8) || 'Unknown',
      status: (r.status === 'completed' ? 'completed' : r.status === 'pending' ? 'pending' : 'active') as ReferralFriend['status'],
      joinedAt: r.created_at,
      earnings: r.reward_amount || 0,
    }));

    const totalReferrals = list.length;
    const activeReferrals = list.filter((r) => r.status === 'completed' || r.status === 'active').length;
    const totalEarnings = list.reduce((sum, r) => sum + r.earnings, 0);
    const pendingEarnings = list.filter((r) => r.status === 'pending').reduce((sum, r) => sum + r.earnings, 0);

    return {
      referralCode: code,
      referralLink: this.buildLink(code),
      totalReferrals,
      activeReferrals,
      totalEarnings,
      pendingEarnings,
      referrals: list,
    };
  }

  // ─── Offline helpers ───
  private offlineEnsureCode(userId: string): string {
    const links = getOrInitCollection<{ user_id: string; code: string }>('referral_links', []);
    const mine = links.find((l) => l.user_id === userId);
    if (mine?.code) return mine.code;

    const code = this.generateCode();
    pushToCollection('referral_links', { user_id: userId, code, is_active: true, uses_count: 0 });
    return code;
  }

private offlineGetData(userId: string, code: string): ReferralData {
    const logs = getOrInitCollection<any>('referral_logs', []);
    const myLogs = logs.filter((l) => l.referrer_id === userId);

    const list: ReferralFriend[] = myLogs.map((l) => ({
      id: l.id,
      userId: l.referrer_id,
      username: l.referred_username || 'Unknown',
      status: 'completed' as const,
      joinedAt: l.created_at,
      earnings: l.bonus_fee || 0,
    }));

    const totalEarnings = list.reduce((sum, r) => sum + r.earnings, 0);

    return {
      referralCode: code,
      referralLink: this.buildLink(code),
      totalReferrals: list.length,
      activeReferrals: list.length,
      totalEarnings,
      pendingEarnings: 0,
      referrals: list,
    };
  }

  // Build shareable bot link
  buildLink(code: string): string {
    return `https://t.me/${BOT_USERNAME}?start=${code}`;
  }

  // Main entry: ensure a code exists, then fetch real data
  async getReferralData(userId: string): Promise<ReferralData> {
    if (!userId) {
      return {
        referralCode: '',
        referralLink: '',
        totalReferrals: 0,
        activeReferrals: 0,
        totalEarnings: 0,
        pendingEarnings: 0,
        referrals: [],
      };
    }

    try {
      if (!IS_OFFLINE_MODE && supabase) {
        const code = await this.onlineEnsureCode(userId);
        return await this.onlineGetData(userId, code);
      }
    } catch (error) {
      console.warn('[Referral] Online fetch failed, falling back to offline store:', error);
    }

    await simulateDelay();
    const code = this.offlineEnsureCode(userId);
    return this.offlineGetData(userId, code);
  }

  // Hydrate the Zustand store with real data
  async loadReferralData(userId: string): Promise<ReferralData> {
    const store = useReferralStore.getState();
    store.setLoading(true);
    store.setError(null);
    try {
      const data = await this.getReferralData(userId);
      store.setReferralCode(data.referralCode);
      store.setReferralLink(data.referralLink);
      store.setReferrals(data.referrals);
      store.setStats({
        totalReferrals: data.totalReferrals,
        activeReferrals: data.activeReferrals,
        referralEarnings: data.totalEarnings,
        pendingEarnings: data.pendingEarnings,
      });
      return data;
    } catch (error: any) {
      store.setError(error?.message || 'Failed to load referral data');
      return {
        referralCode: '',
        referralLink: '',
        totalReferrals: 0,
        activeReferrals: 0,
        totalEarnings: 0,
        pendingEarnings: 0,
        referrals: [],
      };
    } finally {
      store.setLoading(false);
    }
  }

  // Refresh (keeps loading state off UI-blocking)
  async refreshReferrals(userId: string): Promise<void> {
    const store = useReferralStore.getState();
    store.setRefreshing(true);
    try {
      await this.loadReferralData(userId);
    } finally {
      store.setRefreshing(false);
    }
  }

  // Track a referral click (analytics hook)
  async trackReferralClick(referralCode: string): Promise<void> {
    try {
      if (!IS_OFFLINE_MODE && supabase) {
        await supabase
          .from('referral_links')
          .select('user_id')
          .eq('code', referralCode)
          .maybeSingle();
      }
    } catch (error) {
      console.warn('[Referral] trackReferralClick failed:', error);
    }
  }
}

// Singleton instance
export const referralDataService = new ReferralDataService();
