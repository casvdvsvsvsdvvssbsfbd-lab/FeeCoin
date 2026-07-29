// Auth Feature Constants

export const AUTH_CONFIG = {
  ACCESS_TOKEN_EXPIRY: 7 * 24 * 60 * 60, // 7 days in seconds
  REFRESH_TOKEN_EXPIRY: 30 * 24 * 60 * 60, // 30 days in seconds
  TELEGRAM_AUTH_URL: process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL || 'https://t.me/your_bot_username',
  SESSION_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes in milliseconds
} as const

export type AuthConfig = typeof AUTH_CONFIG
