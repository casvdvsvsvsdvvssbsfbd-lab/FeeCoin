export const glassMaterial = {
  light: {
    subtle: 'rgba(255, 255, 255, 0.1)',
    light: 'rgba(255, 255, 255, 0.3)',
    medium: 'rgba(255, 255, 255, 0.5)',
    heavy: 'rgba(255, 255, 255, 0.7)',
  },
  dark: {
    subtle: 'rgba(0, 0, 0, 0.1)',
    light: 'rgba(0, 0, 0, 0.3)',
    medium: 'rgba(0, 0, 0, 0.5)',
    heavy: 'rgba(0, 0, 0, 0.7)',
  },
} as const

export type GlassMaterial = typeof glassMaterial