// Shared Constants - Application Configuration
// Global configuration used across all features

export const CONFIG = {
  AUTH: {
    ACCESS_TOKEN_EXPIRY: 7 * 24 * 60 * 60,
    REFRESH_TOKEN_EXPIRY: 30 * 24 * 60 * 60,
  },
  WALLET: {
    MINIMUM_WITHDRAWAL: 5000,
    WITHDRAWAL_FEE: 0.02,
  },
  TASKS: {
    DAILY_LIMIT: 10,
    REWARD_RANGE: { MIN: 25, MAX: 500 },
  },
  CACHE: {
    TTL: 3600,
  },
} as const

export type Config = typeof CONFIG