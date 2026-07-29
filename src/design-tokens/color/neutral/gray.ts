export const gray = {
  // White base
  0: '#ffffff',
  
  // Light mode grays
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#e5e5e5',
  300: '#d4d4d4',
  400: '#a3a3a3',
  500: '#737373',
  600: '#525252',
  700: '#404040',
  800: '#262626',
  900: '#171717',
  
  // Dark mode grays
  950: '#0a0a0a',
  960: '#0d0d0d',
  970: '#141414',
  980: '#1a1a1a',
  990: '#262626',
  1000: '#333333',
} as const

export type Gray = typeof gray