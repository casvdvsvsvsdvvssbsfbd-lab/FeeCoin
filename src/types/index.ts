export interface Player {
  id: string;
  telegram_id: number;
  username: string;
  first_name: string;
  avatar_url?: string;
  fee_balance: number; // Changed from UZS/RUB to FEE tokens
  pending_fee: number;
  level: number;
  rank: string;
  total_watched: number;
  today_watched: number;
  lifetime_earnings_fee: number;
  total_referrals: number;
  referral_earnings: number;
  created_at: string;
  updated_at: string;
  first_seen_at: string; // For 30-day countdown
}

export interface StakingContract {
  id: string;
  player_id: string;
  amount_fee: number;
  interest_rate: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'locked' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Transaction {
  id: string;
  player_id: string;
  type: 'ad_reward' | 'staking_deposit' | 'staking_interest' | 'referral_bonus' | 'withdrawal' | 'withdrawal_fee';
  amount_fee: number;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  created_at: string;
}

export interface WithdrawalRequest {
  id: string;
  player_id: string;
  amount_fee: number;
  method: 'uzcard' | 'humo' | 'payeer' | 'qiwi';
  account_details: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface ReferralLog {
  id: string;
  referrer_id: string;
  referred_username: string;
  bonus_fee: number;
  created_at: string;
}

export interface AdWatchState {
  isWatching: boolean;
  cooldownUntil: number | null;
  todayCount: number;
  lastWatchTime: number | null;
}

export interface LeaderboardEntry {
  rank: number;
  player_id: string;
  username: string;
  first_name: string;
  score: number; // fee_balance or today_watched depending on period
  avatar_url?: string;
}