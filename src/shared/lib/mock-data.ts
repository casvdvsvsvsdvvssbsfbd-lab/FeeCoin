// ============================================
// Mock Data Store
// Production-ready mock data for all screens
// Swap with real API calls when backend is ready
// ============================================

export interface UserProfile {
  id: string;
  telegramId: number;
  username: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  languageCode: string;
  countryCode: string;
  isPremium: boolean;
}

export interface WalletData {
  availableFC: number;
  pendingFC: number;
  totalEarned: number;
  totalWithdrawn: number;
  withdrawProgress: number;
  estimatedUnlockDate: string;
  energy: number;
  maxEnergy: number;
  energyRegenRate: number;
}

export interface EarningsStats {
  today: number;
  weekly: number;
  monthly: number;
  allTime: number;
}

export interface Reward {
  id: string;
  type: 'ad' | 'task' | 'referral' | 'bonus' | 'mission' | 'daily';
  amount: number;
  description: string;
  timestamp: string;
  icon: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  provider: string;
  completionRate: number;
  type: 'survey' | 'install' | 'offer' | 'social';
  completed: boolean;
  icon: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  firstName: string;
  photoUrl: string;
  score: number;
  isCurrentUser: boolean;
}

export interface Transaction {
  id: string;
  type: 'reward' | 'withdrawal' | 'referral' | 'bonus';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: 'reward' | 'referral' | 'mission' | 'withdrawal' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special' | 'seasonal';
  reward: number;
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
  expiresAt: string;
  icon: string;
}

export interface ReferralData {
  totalReferrals: number;
  activeReferrals: number;
  totalEarned: number;
  referralCode: string;
  referralLink: string;
  referralTree: ReferralNode[];
}

export interface ReferralNode {
  userId: string;
  username: string;
  level: number;
  earned: number;
  joinedAt: string;
  children: ReferralNode[];
}

// Mock User
export const mockUser: UserProfile = {
  id: 'user_001',
  telegramId: 123456789,
  username: 'crypto_farmer',
  firstName: 'Alex',
  lastName: 'Johnson',
  photoUrl: '',
  languageCode: 'en',
  countryCode: 'US',
  isPremium: true,
};

// Mock Wallet
export const mockWallet: WalletData = {
  availableFC: 153490751,
  pendingFC: 2500000,
  totalEarned: 185000000,
  totalWithdrawn: 29000000,
  withdrawProgress: 72,
  estimatedUnlockDate: '2026-08-15',
  energy: 85,
  maxEnergy: 100,
  energyRegenRate: 1,
};

// Mock Earnings
export const mockEarnings: EarningsStats = {
  today: 45230,
  weekly: 312000,
  monthly: 1450000,
  allTime: 185000000,
};

// Mock Rewards
export const mockRewards: Reward[] = [
  { id: 'r1', type: 'ad', amount: 2500, description: 'Watched Ad: Game of Kings', timestamp: '2 min ago', icon: '📺' },
  { id: 'r2', type: 'referral', amount: 5000, description: 'Referral bonus - @john_crypto', timestamp: '15 min ago', icon: '👥' },
  { id: 'r3', type: 'task', amount: 15000, description: 'Completed survey: Market Research', timestamp: '1 hour ago', icon: '📋' },
  { id: 'r4', type: 'bonus', amount: 1000, description: 'Daily bonus day 3', timestamp: '3 hours ago', icon: '🎁' },
  { id: 'r5', type: 'ad', amount: 2500, description: 'Watched Ad: Crypto Arena', timestamp: '5 hours ago', icon: '📺' },
  { id: 'r6', type: 'mission', amount: 50000, description: 'Weekly mission completed!', timestamp: '1 day ago', icon: '🏆' },
];

// Mock Tasks
export const mockTasks: Task[] = [
  { id: 't1', title: 'Market Research Survey', description: 'Share your opinion on digital payments', reward: 15000, estimatedTime: '5 min', difficulty: 'easy', provider: 'SurveyMonkey', completionRate: 85, type: 'survey', completed: false, icon: '📊' },
  { id: 't2', title: 'Install & Try Crypto Wallet', description: 'Install and create an account', reward: 25000, estimatedTime: '3 min', difficulty: 'easy', provider: 'TrustWallet', completionRate: 72, type: 'install', completed: false, icon: '💼' },
  { id: 't3', title: 'Special Offer: VPN Plus', description: 'Subscribe to annual plan', reward: 75000, estimatedTime: '2 min', difficulty: 'medium', provider: 'ExpressVPN', completionRate: 34, type: 'offer', completed: false, icon: '🔒' },
  { id: 't4', title: 'Join Telegram Channel', description: 'Join our crypto news channel', reward: 5000, estimatedTime: '1 min', difficulty: 'easy', provider: 'Telegram', completionRate: 95, type: 'social', completed: true, icon: '✈️' },
  { id: 't5', title: 'Product Feedback Survey', description: 'Help us improve our platform', reward: 20000, estimatedTime: '8 min', difficulty: 'medium', provider: 'Typeform', completionRate: 63, type: 'survey', completed: false, icon: '💬' },
  { id: 't6', title: 'Install Game: Crypto Tycoon', description: 'Play and reach level 5', reward: 50000, estimatedTime: '30 min', difficulty: 'hard', provider: 'GameStudio', completionRate: 28, type: 'install', completed: false, icon: '🎮' },
  { id: 't7', title: 'Follow on Twitter', description: 'Follow our Twitter account', reward: 3000, estimatedTime: '1 min', difficulty: 'easy', provider: 'Twitter', completionRate: 92, type: 'social', completed: false, icon: '🐦' },
  { id: 't8', title: 'Exclusive: Premium Survey', description: 'Premium users only - high reward', reward: 100000, estimatedTime: '15 min', difficulty: 'hard', provider: 'SurveyMonkey', completionRate: 18, type: 'survey', completed: false, icon: '👑' },
];

// Mock Leaderboard
export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: 'u001', username: 'crypto_whale', firstName: 'Satoshi', photoUrl: '', score: 15200000, isCurrentUser: false },
  { rank: 2, userId: 'u002', username: 'mining_king', firstName: 'Vitalik', photoUrl: '', score: 12800000, isCurrentUser: false },
  { rank: 3, userId: 'u003', username: 'token_farmer', firstName: 'CZ', photoUrl: '', score: 10900000, isCurrentUser: false },
  { rank: 4, userId: 'user_001', username: 'crypto_farmer', firstName: 'Alex', photoUrl: '', score: 8750000, isCurrentUser: true },
  { rank: 5, userId: 'u005', username: 'blockchain_dev', firstName: 'Gavin', photoUrl: '', score: 7200000, isCurrentUser: false },
  { rank: 6, userId: 'u006', username: 'defi_lover', firstName: 'Anatoly', photoUrl: '', score: 6100000, isCurrentUser: false },
  { rank: 7, userId: 'u007', username: 'nft_collector', firstName: 'Beeple', photoUrl: '', score: 5400000, isCurrentUser: false },
  { rank: 8, userId: 'u008', username: 'staking_pro', firstName: 'Charles', photoUrl: '', score: 4800000, isCurrentUser: false },
  { rank: 9, userId: 'u009', username: 'yield_farmer', firstName: 'Andre', photoUrl: '', score: 3900000, isCurrentUser: false },
  { rank: 10, userId: 'u010', username: 'airdrop_hunter', firstName: 'Hayden', photoUrl: '', score: 3100000, isCurrentUser: false },
  { rank: 11, userId: 'u011', username: 'crypto_trader', firstName: 'Brian', photoUrl: '', score: 2800000, isCurrentUser: false },
  { rank: 12, userId: 'u012', username: 'hodl_strong', firstName: 'Michael', photoUrl: '', score: 2100000, isCurrentUser: false },
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  { id: 'tx1', type: 'reward', amount: 2500, status: 'completed', description: 'Ad reward - Crypto Arena', timestamp: '2 min ago' },
  { id: 'tx2', type: 'reward', amount: 15000, status: 'completed', description: 'Survey completed', timestamp: '1 hour ago' },
  { id: 'tx3', type: 'referral', amount: 5000, status: 'completed', description: 'Referral bonus @john_crypto', timestamp: '3 hours ago' },
  { id: 'tx4', type: 'withdrawal', amount: 500000, status: 'pending', description: 'Withdrawal to UzCard', timestamp: '1 day ago' },
  { id: 'tx5', type: 'reward', amount: 50000, status: 'completed', description: 'Weekly mission reward', timestamp: '2 days ago' },
  { id: 'tx6', type: 'bonus', amount: 10000, status: 'completed', description: 'Level up bonus', timestamp: '3 days ago' },
  { id: 'tx7', type: 'withdrawal', amount: 250000, status: 'completed', description: 'Withdrawal to Humo', timestamp: '5 days ago' },
  { id: 'tx8', type: 'referral', amount: 2500, status: 'completed', description: 'Referral bonus @new_user', timestamp: '1 week ago' },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  { id: 'n1', type: 'reward', title: 'Reward Received!', message: 'You earned 2,500 FC for watching an ad.', isRead: false, timestamp: '2 min ago' },
  { id: 'n2', type: 'referral', title: 'Referral Joined!', message: '@john_crypto joined using your link. You earned 5,000 FC!', isRead: false, timestamp: '15 min ago' },
  { id: 'n3', type: 'mission', title: 'Mission Complete!', message: 'Weekly mission completed. Claim your 50,000 FC reward!', isRead: false, timestamp: '1 hour ago' },
  { id: 'n4', type: 'withdrawal', title: 'Withdrawal Processing', message: 'Your withdrawal of 500,000 FC is being processed.', isRead: true, timestamp: '1 day ago' },
  { id: 'n5', type: 'system', title: 'Welcome to Fee!', message: 'Start earning by completing tasks and watching ads.', isRead: true, timestamp: '3 days ago' },
  { id: 'n6', type: 'reward', title: 'Daily Bonus!', message: 'Day 3 bonus claimed: 1,000 FC', isRead: true, timestamp: '5 days ago' },
];

// Mock Missions
export const mockMissions: Mission[] = [
  { id: 'm1', title: 'Watch 10 Ads', description: 'Watch 10 advertisements today', type: 'daily', reward: 15000, progress: 7, target: 10, completed: false, claimed: false, expiresAt: '2026-07-22T00:00:00Z', icon: '📺' },
  { id: 'm2', title: 'Complete 5 Tasks', description: 'Complete any 5 tasks', type: 'daily', reward: 25000, progress: 3, target: 5, completed: false, claimed: false, expiresAt: '2026-07-22T00:00:00Z', icon: '✅' },
  { id: 'm3', title: 'Invite 3 Friends', description: 'Invite 3 friends to join Fee', type: 'daily', reward: 30000, progress: 1, target: 3, completed: false, claimed: false, expiresAt: '2026-07-22T00:00:00Z', icon: '👥' },
  { id: 'm4', title: 'Watch 50 Ads', description: 'Watch 50 ads this week', type: 'weekly', reward: 100000, progress: 32, target: 50, completed: false, claimed: false, expiresAt: '2026-07-28T00:00:00Z', icon: '📺' },
  { id: 'm5', title: 'Earn 500k FC', description: 'Earn 500,000 FC this week', type: 'weekly', reward: 150000, progress: 312000, target: 500000, completed: false, claimed: false, expiresAt: '2026-07-28T00:00:00Z', icon: '💰' },
  { id: 'm6', title: 'Complete 20 Surveys', description: 'Complete 20 survey tasks in a month', type: 'monthly', reward: 500000, progress: 12, target: 20, completed: false, claimed: false, expiresAt: '2026-08-01T00:00:00Z', icon: '📊' },
  { id: 'm7', title: 'Summer Event', description: 'Earn double rewards on all tasks', type: 'seasonal', reward: 1000000, progress: 1, target: 1, completed: true, claimed: true, expiresAt: '2026-09-01T00:00:00Z', icon: '☀️' },
];

// Mock Referral
export const mockReferral: ReferralData = {
  totalReferrals: 24,
  activeReferrals: 18,
  totalEarned: 185000,
  referralCode: 'FEE_ALEX123',
  referralLink: 'https://t.me/fee_bot?start=ref_FEE_ALEX123',
  referralTree: [
    {
      userId: 'ref1', username: 'john_crypto', level: 1, earned: 12500, joinedAt: '2026-07-15',
      children: [
        { userId: 'ref1a', username: 'alice_wallet', level: 2, earned: 5000, joinedAt: '2026-07-16', children: [] },
        { userId: 'ref1b', username: 'bob_trader', level: 2, earned: 3000, joinedAt: '2026-07-17', children: [] },
      ],
    },
    {
      userId: 'ref2', username: 'sarah_miner', level: 1, earned: 8500, joinedAt: '2026-07-10',
      children: [
        { userId: 'ref2a', username: 'david_stake', level: 2, earned: 2000, joinedAt: '2026-07-12', children: [] },
      ],
    },
    { userId: 'ref3', username: 'mike_defi', level: 1, earned: 5000, joinedAt: '2026-07-05', children: [] },
    { userId: 'ref4', username: 'emma_nft', level: 1, earned: 3500, joinedAt: '2026-06-28', children: [] },
    { userId: 'ref5', username: 'chris_hodl', level: 1, earned: 2500, joinedAt: '2026-06-20', children: [] },
  ],
};

// Countries for selection
export const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', timezone: 'America/New_York', phoneCode: '+1' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', currency: 'UZS', timezone: 'Asia/Tashkent', phoneCode: '+998' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', currency: 'RUB', timezone: 'Europe/Moscow', phoneCode: '+7' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', timezone: 'Europe/London', phoneCode: '+44' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', currency: 'EUR', timezone: 'Europe/Berlin', phoneCode: '+49' },
  { code: 'FR', name: 'France', flag: '🇫🇷', currency: 'EUR', timezone: 'Europe/Paris', phoneCode: '+33' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', currency: 'JPY', timezone: 'Asia/Tokyo', phoneCode: '+81' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', currency: 'KRW', timezone: 'Asia/Seoul', phoneCode: '+82' },
  { code: 'CN', name: 'China', flag: '🇨🇳', currency: 'CNY', timezone: 'Asia/Shanghai', phoneCode: '+86' },
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', timezone: 'Asia/Kolkata', phoneCode: '+91' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', currency: 'BRL', timezone: 'America/Sao_Paulo', phoneCode: '+55' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD', timezone: 'America/Toronto', phoneCode: '+1' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD', timezone: 'Australia/Sydney', phoneCode: '+61' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', currency: 'AED', timezone: 'Asia/Dubai', phoneCode: '+971' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', currency: 'SGD', timezone: 'Asia/Singapore', phoneCode: '+65' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', currency: 'TRY', timezone: 'Europe/Istanbul', phoneCode: '+90' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', currency: 'KZT', timezone: 'Asia/Almaty', phoneCode: '+7' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', currency: 'IDR', timezone: 'Asia/Jakarta', phoneCode: '+62' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', currency: 'THB', timezone: 'Asia/Bangkok', phoneCode: '+66' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', currency: 'VND', timezone: 'Asia/Ho_Chi_Minh', phoneCode: '+84' },
];

// Languages for selection
export const languages = [
  { code: 'en', name: 'English', nativeName: 'English', isRTL: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', isRTL: false },
  { code: 'fr', name: 'French', nativeName: 'Français', isRTL: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', isRTL: false },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', isRTL: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', isRTL: false },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', isRTL: false },
  { code: 'zh', name: 'Chinese', nativeName: '中文', isRTL: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', isRTL: false },
  { code: 'ko', name: 'Korean', nativeName: '한국어', isRTL: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', isRTL: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isRTL: false },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', isRTL: false },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', isRTL: false },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', isRTL: false },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', isRTL: false },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', isRTL: false },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', isRTL: false },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', isRTL: false },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', isRTL: false },
  { code: 'uz', name: 'Uzbek', nativeName: 'O\'zbek', isRTL: false },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ', isRTL: false },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', isRTL: true },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', isRTL: true },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', isRTL: true },
];

export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toLocaleString();
}

export function formatFC(amount: number): string {
  return amount.toLocaleString();
}