import type { Config } from 'tailwindcss'
import { gray, accent, semantic } from './src/design-tokens/color'
import { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing } from './src/design-tokens/typography'
import { spacing } from './src/design-tokens/spacing'
import { borderRadius } from './src/design-tokens/border/radius'
import { shadow } from './src/design-tokens/shadow'
import { blur } from './src/design-tokens/glass/blur'
import { breakpoints } from './src/design-tokens/layout/breakpoints'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gray: gray,
        primary: accent,
        success: semantic.success,
        warning: semantic.warning,
        error: semantic.error,
        info: semantic.info,
      },
      fontFamily: {
        sans: [...fontFamily.sans],
        mono: [...fontFamily.mono],
      },
      fontSize: Object.fromEntries(
        Object.entries(fontSize).map(([k, v]) => [k, Array.isArray(v) ? [...v] : v])
      ),
      fontWeight: Object.fromEntries(
        Object.entries(fontWeight).map(([k, v]) => [k, String(v)])
      ),
      lineHeight: Object.fromEntries(
        Object.entries(lineHeight).map(([k, v]) => [k, String(v)])
      ),
      letterSpacing: Object.fromEntries(
        Object.entries(letterSpacing).map(([k, v]) => [k, String(v)])
      ),
      spacing: spacing,
      borderRadius: borderRadius,
      boxShadow: shadow,
      blur: blur,
      screens: breakpoints,
    } as any,
  },
  plugins: [],
}

export default config
