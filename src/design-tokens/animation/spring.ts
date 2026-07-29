export const spring = {
  gentle: {
    tension: 180,
    friction: 12,
  },
  default: {
    tension: 200,
    friction: 20,
  },
  bouncy: {
    tension: 220,
    friction: 15,
  },
  snappy: {
    tension: 240,
    friction: 25,
  },
} as const

export type Spring = typeof spring