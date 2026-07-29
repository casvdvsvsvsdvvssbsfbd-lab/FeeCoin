// ============================================
// Global Stores Index
// ============================================

// Core application stores
export { useAppStore } from './app-store';
export { useAuthStore } from './auth-store';
export { useWalletStore } from './wallet-store';
export { useTaskStore } from './task-store';
export { useLeaderboardStore } from './leaderboard-store';
export { useMissionStore } from './mission-store';
export { useReferralStore } from './referral-store';
export { useNotificationStore } from './notification-store';
export { useSettingsStore } from './settings-store';
export { useRealtimeStore } from './realtime-store';
export { useSupportStore } from './support-store';

// Utility stores
export { useLoadingStore, useGlobalLoading, usePageLoading, useComponentLoading } from '../loading/loading-store';
export { toastStore } from '../notifications/toast-store';