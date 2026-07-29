export const fontFamily = {
  sans: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  mono: [
    'SF Mono',
    'Monaco',
    'Inconsolata',
    'Fira Code',
    'monospace',
  ],
} as const

export type FontFamily = typeof fontFamily