export const ROUTES = {
  HOME: '/',
  EARN: '/earn',
  PROFILE: '/profile',
  WALLET: '/wallet',
  TASKS: '/tasks',
  REFERRAL: '/referral',
  STATS: '/stats',
  LOGIN: '/login',
} as const

export type Route = typeof ROUTES[keyof typeof ROUTES]