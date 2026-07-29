// ============================================
// Core Business Engine Types
// Pure TypeScript - No UI dependencies
// ============================================

export type RewardSource = 
  | 'ad_view'
  | 'survey'
  | 'offerwall'
  | 'app_install'
  | 'referral'
  | 'daily_bonus'
  | 'mission'
  | 'event';

export type Currency = 'FC';

export interface UserContext {
  userId: string;
  level: number;
  rank: string;
  countryCode?: string;
  isVip: boolean;
  vipLevel?: number;
  currentStreak: number;
  longestStreak: number;
  totalEarned: number;
  tasksCompleted: number;
  adsWatched: number;
  appsInstalled: number;
  referralsCount: number;
  energy: number;
  maxEnergy: number;
  lastActiveAt: string;
}

export interface RewardCalculation {
  baseAmount: number;
  finalAmount: number;
  currency: Currency;
  multipliers: MultiplierBreakdown;
  adjustments: AdjustmentBreakdown;
  isValid: boolean;
  validationErrors: string[];
  metadata: Record<string, any>;
}

export interface MultiplierBreakdown {
  base: number;
  level: number;
  rank: number;
  vip: number;
  country: number;
  campaign: number;
  streak: number;
  total: number;
}

export interface AdjustmentBreakdown {
  antiFraud: number;
  dailyLimit: number;
  campaignLimit: number;
  fraudScore: number;
  total: number;
}

export interface EnergyState {
  current: number;
  maximum: number;
  rechargeSpeed: number; // per minute
  rechargeInterval: number; // minutes
  lastRechargeAt: string;
  nextRechargeAt: string;
  isFull: boolean;
}

export interface EnergyCost {
  action: string;
  cost: number;
  isFree: boolean;
}

export interface WithdrawalProgress {
  currentPercentage: number;
  targetPercentage: number;
  currentAmount: number;
  targetAmount: number;
  remainingAmount: number;
  estimatedDays: number;
  canWithdraw: boolean;
  nextMilestone?: {
    percentage: number;
    amount: number;
    remaining: number;
  };
}

export interface EconomyConfig {
  // Base rewards
  baseAdReward: number;
  baseSurveyReward: number;
  baseOfferwallReward: number;
  baseAppInstallReward: number;
  baseReferralReward: number;
  baseDailyBonus: number;
  baseMissionReward: number;
  baseEventReward: number;

  // Multipliers
  levelMultipliers: Record<number, number>;
  rankMultipliers: Record<string, number>;
  vipMultipliers: Record<number, number>;
  countryMultipliers: Record<string, number>;
  campaignMultipliers: Record<string, number>;
  streakMultipliers: Record<number, number>;

  // Energy
  defaultMaxEnergy: number;
  defaultRechargeSpeed: number;
  defaultRechargeInterval: number;
  energyCosts: Record<string, number>;

  // Limits
  dailyAdLimit: number;
  dailySurveyLimit: number;
  dailyOfferwallLimit: number;
  dailyAppInstallLimit: number;
  dailyReferralLimit: number;
  campaignLimits: Record<string, number>;

  // Anti-fraud
  fraudScoreThreshold: number;
  antiFraudReductionRate: number;
  duplicateActionWindow: number; // minutes

  // Withdrawal
  withdrawalThresholds: Array<{
    percentage: number;
    amount: number;
  }>;

  // Bonuses
  referralEnergyBonus: number;
  missionEnergyBonus: number;
  vipEnergyBonus: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  metadata: Record<string, any>;
}

export interface DailyLimit {
  action: RewardSource;
  current: number;
  limit: number;
  remaining: number;
  resetAt: string;
}

export interface CampaignLimit {
  campaignId: string;
  current: number;
  limit: number;
  remaining: number;
  endsAt: string;
}

export interface FraudCheck {
  score: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  isBlocked: boolean;
}