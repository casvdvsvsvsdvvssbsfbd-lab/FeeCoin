// ============================================
// Lib Index - Barrel Exports
// ============================================

// Supabase
export { supabase } from './supabase/client';

// Stores
export { useAppStore } from './stores/app-store';
export { useAuthStore } from './stores/auth-store';
export { useWalletStore } from './stores/wallet-store';
export { useTaskStore } from './stores/task-store';
export { useLeaderboardStore } from './stores/leaderboard-store';
export { useMissionStore } from './stores/mission-store';
export { useReferralStore } from './stores/referral-store';
export { useNotificationStore } from './stores/notification-store';
export { useSettingsStore } from './stores/settings-store';
export { useRealtimeStore } from './stores/realtime-store';
export { useSupportStore } from './stores/support-store';

// Analytics
export { analytics, useAnalytics } from './analytics';

// Telegram
export { telegramSDK } from './telegram/telegram-sdk';

// Utils
export { cn } from './utils/cn';
export { formatCurrency as formatFC, formatDate, formatRelativeTime } from './utils/format';
