// ============================================
// Database Types
// Auto-generated from Supabase schema
// ============================================

/* eslint-disable @typescript-eslint/no-explicit-any */

export type UserStatus = 'active' | 'suspended' | 'banned' | 'pending';
export type TransactionType = 'credit' | 'debit' | 'transfer' | 'withdrawal' | 'refund' | 'bonus' | 'penalty';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled' | 'reversed';
export type SettlementStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type AdType = 'video' | 'banner' | 'interstitial' | 'native';
export type AdNetwork = 'google_admob' | 'unity_ads' | 'iron_source' | 'applovin' | 'facebook_audience' | 'custom';
export type SurveyStatus = 'available' | 'in_progress' | 'completed' | 'disqualified' | 'expired';
export type OfferwallType = 'cpi' | 'cpa' | 'cpl' | 'survey';
export type OfferwallStatus = 'available' | 'in_progress' | 'completed' | 'rejected' | 'expired';
export type MissionType = 'daily' | 'weekly' | 'achievement' | 'special' | 'referral';
export type MissionStatus = 'active' | 'completed' | 'expired' | 'locked';
export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type EventType = 'seasonal' | 'special' | 'tournament' | 'community';
export type EventStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';
export type NotificationType = 'reward' | 'mission' | 'achievement' | 'system' | 'promotion' | 'referral';
export type TicketStatus = 'open' | 'in_progress' | 'waiting_for_user' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type FraudRiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type FraudStatus = 'pending' | 'investigating' | 'confirmed' | 'false_positive' | 'resolved';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type SessionStatus = 'active' | 'expired' | 'revoked';
export type LogLevel = 'debug' | 'info' | 'warning' | 'error' | 'critical';
export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'all_time';

// ============================================
// CORE USER TABLES
// ============================================

export interface User {
  id: string;
  telegram_id?: number;
  email?: string;
  phone?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  status: UserStatus;
  email_verified: boolean;
  phone_verified: boolean;
  is_premium: boolean;
  last_login_at?: string;
  last_active_at: string;
  registered_at: string;
  deleted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  avatar_url?: string;
  bio?: string;
  language_code: string;
  timezone: string;
  country_code?: string;
  level: number;
  experience_points: number;
  rank: string;
  total_earned: number;
  total_withdrawn: number;
  tasks_completed: number;
  ads_watched: number;
  apps_installed: number;
  referrals_count: number;
  current_streak: number;
  longest_streak: number;
  is_public: boolean;
  show_on_leaderboard: boolean;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  pending_balance: number;
  withdrawable_balance: number;
  total_earned: number;
  total_withdrawn: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// FC LEDGER (Financial Core)
// ============================================

export interface FcLedger {
  id: string;
  user_id: string;
  transaction_type: TransactionType;
  amount: number;
  balance_before: number;
  balance_after: number;
  reference_type?: string;
  reference_id?: string;
  description?: string;
  metadata: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface RewardPool {
  id: string;
  name: string;
  description?: string;
  total_amount: number;
  distributed_amount: number;
  remaining_amount: number;
  currency: string;
  is_active: boolean;
  starts_at?: string;
  ends_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  wallet_id: string;
  transaction_type: TransactionType;
  status: TransactionStatus;
  amount: number;
  fee: number;
  net_amount: number;
  currency: string;
  description?: string;
  reference_type?: string;
  reference_id?: string;
  metadata: Record<string, any>;
  processed_at?: string;
  failed_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface Settlement {
  id: string;
  settlement_cycle_id?: string;
  user_id: string;
  amount: number;
  currency: string;
  status: SettlementStatus;
  payment_method?: string;
  payment_details: Record<string, any>;
  transaction_id?: string;
  processed_at?: string;
  failed_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface SettlementCycle {
  id: string;
  name: string;
  period_start: string;
  period_end: string;
  total_amount: number;
  total_users: number;
  status: SettlementStatus;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// AD REWARDS SYSTEM
// ============================================

export interface AdNetworkConfig {
  id: string;
  name: string;
  type: AdNetwork;
  api_key?: string;
  api_secret?: string;
  is_active: boolean;
  priority: number;
  fill_rate?: number;
  ecpm?: number;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AdView {
  id: string;
  user_id: string;
  ad_network_id?: string;
  ad_type: AdType;
  ad_unit_id?: string;
  placement?: string;
  reward_amount: number;
  currency: string;
  watch_time: number;
  is_completed: boolean;
  is_skipped: boolean;
  fraud_score: number;
  device_fingerprint?: string;
  ip_address?: string;
  user_agent?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface AdReward {
  id: string;
  ad_view_id: string;
  user_id: string;
  reward_pool_id?: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  transaction_id?: string;
  processed_at?: string;
  created_at: string;
}

// ============================================
// SURVEYS SYSTEM
// ============================================

export interface Survey {
  id: string;
  title: string;
  description?: string;
  provider: string;
  provider_survey_id: string;
  reward_amount: number;
  currency: string;
  estimated_time: number;
  difficulty?: string;
  tags: string[];
  is_active: boolean;
  available_from?: string;
  available_until?: string;
  max_completions?: number;
  current_completions: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SurveyHistory {
  id: string;
  user_id: string;
  survey_id: string;
  status: SurveyStatus;
  started_at: string;
  completed_at?: string;
  reward_amount?: number;
  currency?: string;
  provider_response_id?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// ============================================
// OFFERWALLS SYSTEM
// ============================================

export interface Offerwall {
  id: string;
  name: string;
  type: OfferwallType;
  provider: string;
  api_key?: string;
  api_secret?: string;
  is_active: boolean;
  priority: number;
  icon_url?: string;
  description?: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface OfferwallHistory {
  id: string;
  user_id: string;
  offerwall_id: string;
  offer_id: string;
  offer_name: string;
  status: OfferwallStatus;
  reward_amount?: number;
  currency?: string;
  started_at: string;
  completed_at?: string;
  provider_transaction_id?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// ============================================
// APP INSTALLS
// ============================================

export interface AppInstall {
  id: string;
  user_id: string;
  app_name: string;
  package_name?: string;
  app_store_url?: string;
  reward_amount: number;
  currency: string;
  status: TransactionStatus;
  device_id: string;
  ip_address?: string;
  user_agent?: string;
  screenshot_url?: string;
  verified_at?: string;
  completed_at?: string;
  failed_reason?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// REFERRAL SYSTEM
// ============================================

export interface ReferralLink {
  id: string;
  user_id: string;
  code: string;
  uses_count: number;
  max_uses?: number;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referee_id: string;
  referral_link_id: string;
  reward_amount: number;
  currency: string;
  status: TransactionStatus;
  referee_verified: boolean;
  referee_verified_at?: string;
  reward_paid_at?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ReferralReward {
  id: string;
  referral_id: string;
  user_id: string;
  reward_type: string;
  amount: number;
  currency: string;
  transaction_id?: string;
  created_at: string;
}

// ============================================
// MISSIONS SYSTEM
// ============================================

export interface Mission {
  id: string;
  title: string;
  description?: string;
  type: MissionType;
  requirements: Record<string, any>;
  rewards: Record<string, any>;
  difficulty: number;
  is_active: boolean;
  is_repeatable: boolean;
  max_completions: number;
  available_from?: string;
  available_until?: string;
  created_at: string;
  updated_at: string;
}

export interface MissionProgress {
  id: string;
  user_id: string;
  mission_id: string;
  progress: Record<string, any>;
  current_value: number;
  target_value: number;
  status: MissionStatus;
  started_at: string;
  completed_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// GAMIFICATION
// ============================================

export interface Achievement {
  id: string;
  name: string;
  description?: string;
  icon_url?: string;
  criteria: Record<string, any>;
  rewards: Record<string, any>;
  is_hidden: boolean;
  created_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description?: string;
  icon_url?: string;
  rarity: BadgeRarity;
  criteria: Record<string, any>;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date?: string;
  freeze_available: boolean;
  freeze_count: number;
  created_at: string;
  updated_at: string;
}

export interface DailyBonus {
  id: string;
  user_id: string;
  day_number: number;
  reward_amount: number;
  currency: string;
  claimed_at: string;
}

// ============================================
// EVENTS SYSTEM
// ============================================

export interface Event {
  id: string;
  name: string;
  description?: string;
  type: EventType;
  status: EventStatus;
  rewards: Record<string, any>;
  rules: Record<string, any>;
  starts_at: string;
  ends_at: string;
  is_public: boolean;
  max_participants?: number;
  created_at: string;
  updated_at: string;
}

export interface EventReward {
  id: string;
  event_id: string;
  user_id: string;
  rank_position?: number;
  reward_amount: number;
  currency: string;
  transaction_id?: string;
  claimed_at?: string;
  created_at: string;
}

// ============================================
// LEADERBOARDS
// ============================================

export interface LeaderboardDaily {
  id: string;
  user_id: string;
  score: number;
  rank: number;
  period_date: string;
  created_at: string;
  updated_at: string;
}

export interface LeaderboardWeekly {
  id: string;
  user_id: string;
  score: number;
  rank: number;
  period_start: string;
  period_end: string;
  created_at: string;
  updated_at: string;
}

export interface LeaderboardMonthly {
  id: string;
  user_id: string;
  score: number;
  rank: number;
  period_year: number;
  period_month: number;
  created_at: string;
  updated_at: string;
}

export interface LeaderboardAllTime {
  id: string;
  user_id: string;
  score: number;
  rank: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// NOTIFICATIONS
// ============================================

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, any>;
  is_read: boolean;
  read_at?: string;
  action_url?: string;
  created_at: string;
}

// ============================================
// SUPPORT SYSTEM
// ============================================

export interface SupportTicket {
  id: string;
  user_id: string;
  ticket_number: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  category?: string;
  assigned_to?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  user_id?: string;
  sender_type: string;
  message: string;
  attachments: any[];
  is_internal: boolean;
  created_at: string;
}

// ============================================
// ADMIN SYSTEM
// ============================================

export interface AdminUser {
  id: string;
  user_id: string;
  role: string;
  permissions: string[];
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminAction {
  id: string;
  admin_id: string;
  action_type: string;
  target_type?: string;
  target_id?: string;
  description?: string;
  metadata: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// ============================================
// FRAUD DETECTION
// ============================================

export interface FraudDetection {
  id: string;
  user_id: string;
  risk_level: FraudRiskLevel;
  status: FraudStatus;
  detection_type: string;
  score: number;
  evidence: Record<string, any>;
  reviewed_by?: string;
  reviewed_at?: string;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface FraudReport {
  id: string;
  fraud_detection_id: string;
  reported_by: string;
  reason: string;
  evidence: Record<string, any>;
  status: FraudStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

// ============================================
// DEVICE TRACKING
// ============================================

export interface UserDevice {
  id: string;
  user_id: string;
  device_id: string;
  device_type: DeviceType;
  device_name?: string;
  device_model?: string;
  os_version?: string;
  app_version?: string;
  is_trusted: boolean;
  first_seen_at: string;
  last_seen_at: string;
}

export interface DeviceSession {
  id: string;
  user_id: string;
  device_id: string;
  device_type: DeviceType;
  device_name?: string;
  ip_address: string;
  user_agent?: string;
  location: Record<string, any>;
  status: SessionStatus;
  last_active_at: string;
  expires_at: string;
  created_at: string;
}

// ============================================
// SYSTEM TABLES
// ============================================

export interface Country {
  code: string;
  name: string;
  phone_code?: string;
  is_active: boolean;
  created_at: string;
}

export interface Language {
  code: string;
  name: string;
  native_name: string;
  is_active: boolean;
  created_at: string;
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description?: string;
  is_enabled: boolean;
  rollout_percentage: number;
  target_audience: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface RemoteConfig {
  id: string;
  key: string;
  value: Record<string, any>;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================
// ANALYTICS & LOGGING
// ============================================

export interface AppStatistic {
  id: string;
  date: string;
  total_users: number;
  active_users: number;
  new_users: number;
  total_transactions: number;
  total_volume: number;
  total_rewards: number;
  total_withdrawals: number;
  ad_views_count: number;
  surveys_completed: number;
  offerwalls_completed: number;
  referrals_count: number;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsEvent {
  id: string;
  user_id?: string;
  event_name: string;
  event_category?: string;
  properties: Record<string, any>;
  device_id?: string;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface SystemLog {
  id: string;
  level: LogLevel;
  logger: string;
  message: string;
  context: Record<string, any>;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// ============================================
// AUDIT LOGS
// ============================================

export interface AuditLog {
  id: string;
  user_id?: string;
  admin_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// ============================================
// DATABASE TYPES FOR SUPABASE
// ============================================

export interface Database {
  public: {
    Tables: {
      users: { Row: User; Insert: Omit<User, 'created_at' | 'updated_at'>; Update: Partial<Omit<User, 'created_at' | 'updated_at'>> };
      profiles: { Row: Profile; Insert: Omit<Profile, 'created_at' | 'updated_at'>; Update: Partial<Omit<Profile, 'created_at' | 'updated_at'>> };
      wallets: { Row: Wallet; Insert: Omit<Wallet, 'created_at' | 'updated_at'>; Update: Partial<Omit<Wallet, 'created_at' | 'updated_at'>> };
      fc_ledger: { Row: FcLedger; Insert: Omit<FcLedger, 'created_at'>; Update: Partial<Omit<FcLedger, 'created_at'>> };
      reward_pool: { Row: RewardPool; Insert: Omit<RewardPool, 'created_at' | 'updated_at'>; Update: Partial<Omit<RewardPool, 'created_at' | 'updated_at'>> };
      transactions: { Row: Transaction; Insert: Omit<Transaction, 'created_at' | 'updated_at'>; Update: Partial<Omit<Transaction, 'created_at' | 'updated_at'>> };
      settlements: { Row: Settlement; Insert: Omit<Settlement, 'created_at' | 'updated_at'>; Update: Partial<Omit<Settlement, 'created_at' | 'updated_at'>> };
      settlement_cycles: { Row: SettlementCycle; Insert: Omit<SettlementCycle, 'created_at' | 'updated_at'>; Update: Partial<Omit<SettlementCycle, 'created_at' | 'updated_at'>> };
      ad_views: { Row: AdView; Insert: Omit<AdView, 'created_at'>; Update: Partial<Omit<AdView, 'created_at'>> };
      ad_networks: { Row: AdNetworkConfig; Insert: Omit<AdNetworkConfig, 'created_at' | 'updated_at'>; Update: Partial<Omit<AdNetworkConfig, 'created_at' | 'updated_at'>> };
      ad_rewards: { Row: AdReward; Insert: Omit<AdReward, 'created_at'>; Update: Partial<Omit<AdReward, 'created_at'>> };
      surveys: { Row: Survey; Insert: Omit<Survey, 'created_at' | 'updated_at'>; Update: Partial<Omit<Survey, 'created_at' | 'updated_at'>> };
      survey_history: { Row: SurveyHistory; Insert: Omit<SurveyHistory, 'created_at' | 'updated_at'>; Update: Partial<Omit<SurveyHistory, 'created_at' | 'updated_at'>> };
      offerwalls: { Row: Offerwall; Insert: Omit<Offerwall, 'created_at' | 'updated_at'>; Update: Partial<Omit<Offerwall, 'created_at' | 'updated_at'>> };
      offerwall_history: { Row: OfferwallHistory; Insert: Omit<OfferwallHistory, 'created_at' | 'updated_at'>; Update: Partial<Omit<OfferwallHistory, 'created_at' | 'updated_at'>> };
      app_installs: { Row: AppInstall; Insert: Omit<AppInstall, 'created_at' | 'updated_at'>; Update: Partial<Omit<AppInstall, 'created_at' | 'updated_at'>> };
      referral_links: { Row: ReferralLink; Insert: Omit<ReferralLink, 'created_at' | 'updated_at'>; Update: Partial<Omit<ReferralLink, 'created_at' | 'updated_at'>> };
      referrals: { Row: Referral; Insert: Omit<Referral, 'created_at' | 'updated_at'>; Update: Partial<Omit<Referral, 'created_at' | 'updated_at'>> };
      referral_rewards: { Row: ReferralReward; Insert: Omit<ReferralReward, 'created_at'>; Update: Partial<Omit<ReferralReward, 'created_at'>> };
      missions: { Row: Mission; Insert: Omit<Mission, 'created_at' | 'updated_at'>; Update: Partial<Omit<Mission, 'created_at' | 'updated_at'>> };
      mission_progress: { Row: MissionProgress; Insert: Omit<MissionProgress, 'created_at' | 'updated_at'>; Update: Partial<Omit<MissionProgress, 'created_at' | 'updated_at'>> };
      achievements: { Row: Achievement; Insert: Omit<Achievement, 'created_at'>; Update: Partial<Omit<Achievement, 'created_at'>> };
      badges: { Row: Badge; Insert: Omit<Badge, 'created_at'>; Update: Partial<Omit<Badge, 'created_at'>> };
      user_badges: { Row: UserBadge; Insert: Omit<UserBadge, 'earned_at'>; Update: Partial<Omit<UserBadge, 'earned_at'>> };
      streaks: { Row: Streak; Insert: Omit<Streak, 'created_at' | 'updated_at'>; Update: Partial<Omit<Streak, 'created_at' | 'updated_at'>> };
      daily_bonus: { Row: DailyBonus; Insert: Omit<DailyBonus, 'claimed_at'>; Update: Partial<Omit<DailyBonus, 'claimed_at'>> };
      events: { Row: Event; Insert: Omit<Event, 'created_at' | 'updated_at'>; Update: Partial<Omit<Event, 'created_at' | 'updated_at'>> };
      event_rewards: { Row: EventReward; Insert: Omit<EventReward, 'created_at'>; Update: Partial<Omit<EventReward, 'created_at'>> };
      leaderboard_daily: { Row: LeaderboardDaily; Insert: Omit<LeaderboardDaily, 'created_at' | 'updated_at'>; Update: Partial<Omit<LeaderboardDaily, 'created_at' | 'updated_at'>> };
      leaderboard_weekly: { Row: LeaderboardWeekly; Insert: Omit<LeaderboardWeekly, 'created_at' | 'updated_at'>; Update: Partial<Omit<LeaderboardWeekly, 'created_at' | 'updated_at'>> };
      leaderboard_monthly: { Row: LeaderboardMonthly; Insert: Omit<LeaderboardMonthly, 'created_at' | 'updated_at'>; Update: Partial<Omit<LeaderboardMonthly, 'created_at' | 'updated_at'>> };
      leaderboard_all_time: { Row: LeaderboardAllTime; Insert: Omit<LeaderboardAllTime, 'created_at' | 'updated_at'>; Update: Partial<Omit<LeaderboardAllTime, 'created_at' | 'updated_at'>> };
      notifications: { Row: Notification; Insert: Omit<Notification, 'created_at'>; Update: Partial<Omit<Notification, 'created_at'>> };
      support_tickets: { Row: SupportTicket; Insert: Omit<SupportTicket, 'created_at' | 'updated_at'>; Update: Partial<Omit<SupportTicket, 'created_at' | 'updated_at'>> };
      support_messages: { Row: SupportMessage; Insert: Omit<SupportMessage, 'created_at'>; Update: Partial<Omit<SupportMessage, 'created_at'>> };
      audit_logs: { Row: AuditLog; Insert: Omit<AuditLog, 'created_at'>; Update: Partial<Omit<AuditLog, 'created_at'>> };
      admin_users: { Row: AdminUser; Insert: Omit<AdminUser, 'created_at' | 'updated_at'>; Update: Partial<Omit<AdminUser, 'created_at' | 'updated_at'>> };
      admin_actions: { Row: AdminAction; Insert: Omit<AdminAction, 'created_at'>; Update: Partial<Omit<AdminAction, 'created_at'>> };
      fraud_detection: { Row: FraudDetection; Insert: Omit<FraudDetection, 'created_at' | 'updated_at'>; Update: Partial<Omit<FraudDetection, 'created_at' | 'updated_at'>> };
      fraud_reports: { Row: FraudReport; Insert: Omit<FraudReport, 'created_at'>; Update: Partial<Omit<FraudReport, 'created_at'>> };
      user_devices: { Row: UserDevice; Insert: Omit<UserDevice, 'first_seen_at' | 'last_seen_at'>; Update: Partial<Omit<UserDevice, 'first_seen_at' | 'last_seen_at'>> };
      device_sessions: { Row: DeviceSession; Insert: Omit<DeviceSession, 'created_at'>; Update: Partial<Omit<DeviceSession, 'created_at'>> };
      countries: { Row: Country; Insert: Omit<Country, 'created_at'>; Update: Partial<Omit<Country, 'created_at'>> };
      languages: { Row: Language; Insert: Omit<Language, 'created_at'>; Update: Partial<Omit<Language, 'created_at'>> };
      feature_flags: { Row: FeatureFlag; Insert: Omit<FeatureFlag, 'created_at' | 'updated_at'>; Update: Partial<Omit<FeatureFlag, 'created_at' | 'updated_at'>> };
      remote_configs: { Row: RemoteConfig; Insert: Omit<RemoteConfig, 'created_at' | 'updated_at'>; Update: Partial<Omit<RemoteConfig, 'created_at' | 'updated_at'>> };
      app_statistics: { Row: AppStatistic; Insert: Omit<AppStatistic, 'created_at' | 'updated_at'>; Update: Partial<Omit<AppStatistic, 'created_at' | 'updated_at'>> };
      analytics_events: { Row: AnalyticsEvent; Insert: Omit<AnalyticsEvent, 'created_at'>; Update: Partial<Omit<AnalyticsEvent, 'created_at'>> };
      system_logs: { Row: SystemLog; Insert: Omit<SystemLog, 'created_at'>; Update: Partial<Omit<SystemLog, 'created_at'>> };
    };
  };
}

