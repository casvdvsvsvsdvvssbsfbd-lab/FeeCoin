# FEE - Design Token System
## Complete Design Foundation for Premium Telegram Mini App

---

## DOCUMENT PURPOSE

This document defines the **complete design token system** for Fee. It establishes the visual language, design principles, and token architecture that will guide all UI implementation.

**This document is based on:**
- Fee Product DNA
- Fee Complete Product Blueprint
- Fee Home Page Wireframe
- Fee Design System
- Apple Wallet, Telegram Premium, Linear, Arc Browser design principles

**This document is used by:**
- UI/UX designers (to understand design language)
- Frontend developers (to implement designs)
- Design system maintainers (to evolve design tokens)
- Quality assurance (to verify design consistency)

---

## DESIGN PHILOSOPHY

### Visual Direction

**Inspired By**:
- **Apple Wallet**: Clean, minimal, premium card-based design
- **Telegram Premium**: Sophisticated, modern, subtle animations
- **Linear**: Precision, clarity, professional aesthetic
- **Arc Browser**: Modern, fluid, attention to detail
- **Modern iOS Liquid Glass**: Soft, translucent, depth

**Must NOT Feel Like**:
- ❌ Android Material (too heavy, too colorful)
- ❌ Bootstrap (generic, overused)
- ❌ Gaming UI (too flashy, too dark)
- ❌ Cyberpunk (too neon, too chaotic)
- ❌ Old-style Glassmorphism (too blurry, too heavy)

### Core Principles

**1. Minimal**
- Every element has a purpose
- No decorative elements
- Generous whitespace
- Clear hierarchy

**2. Professional**
- Enterprise-grade aesthetic
- Trustworthy and reliable
- Clean and organized
- Business-appropriate

**3. Luxury**
- Premium feel
- Attention to detail
- Subtle refinements
- High-quality perception

**4. Soft**
- Rounded corners everywhere
- Gentle shadows
- Smooth transitions
- No harsh edges

**5. Fluid**
- Liquid glass materials
- Smooth animations
- Natural movement
- Responsive interactions

**6. Enterprise**
- Scalable system
- Consistent patterns
- Accessible design
- Maintainable tokens

**7. Modern**
- Contemporary aesthetic
- Current design trends
- Forward-thinking
- Timeless appeal

**8. Timeless**
- Not trendy
- Not dated
- Classic proportions
- Enduring design

---

## DESIGN TOKEN ARCHITECTURE

### Token Organization

```
design-tokens/
├── color/
│   ├── neutral/
│   │   ├── gray-50.ts
│   │   ├── gray-100.ts
│   │   └── ...
│   ├── semantic/
│   │   ├── success.ts
│   │   ├── warning.ts
│   │   ├── error.ts
│   │   └── info.ts
│   ├── accent/
│   │   └── primary.ts
│   └── index.ts
├── typography/
│   ├── font-family.ts
│   ├── font-size.ts
│   ├── font-weight.ts
│   ├── line-height.ts
│   └── letter-spacing.ts
├── spacing/
│   └── index.ts
├── border/
│   ├── radius.ts
│   └── width.ts
├── shadow/
│   └── index.ts
├── glass/
│   ├── blur.ts
│   ├── opacity.ts
│   └── material.ts
├── animation/
│   ├── duration.ts
│   ├── spring.ts
│   └── easing.ts
├── layout/
│   ├── grid.ts
│   ├── breakpoints.ts
│   └── container.ts
├── component/
│   ├── icon-size.ts
│   ├── avatar-size.ts
│   └── z-index.ts
└── index.ts
```

---

## COLOR SYSTEM

### Design Principles

**Base**: Black & White
- Primary background: Black (dark mode) / White (light mode)
- Surface backgrounds: Variations of black/white
- Text: White (dark mode) / Black (light mode)

**Accent**: Minimal
- Single accent color (not rainbow)
- Used sparingly for CTAs and highlights
- Subtle, not overwhelming

**Semantic**: Functional
- Success, warning, error, info
- Used for status and feedback
- Muted, not bright

### Neutral Palette

**Philosophy**: Pure black and white base with subtle gray variations for depth and hierarchy.

```typescript
// design-tokens/color/neutral/gray.ts

export const gray = {
  // White base
  0: '#ffffff',      // Pure white (light mode background)
  
  // Light mode grays
  50: '#fafafa',     // Subtle gray (light mode surface)
  100: '#f5f5f5',    // Light gray (light mode border)
  200: '#e5e5e5',    // Gray (light mode divider)
  300: '#d4d4d4',    // Medium gray (light mode disabled)
  400: '#a3a3a3',    // Gray (light mode secondary text)
  500: '#737373',    // Medium gray (light mode tertiary text)
  600: '#525252',    // Gray (light mode placeholder)
  700: '#404040',    // Dark gray (light mode primary text)
  800: '#262626',    // Darker gray (light mode elevated)
  900: '#171717',    // Near black (light mode overlay)
  
  // Dark mode grays
  950: '#0a0a0a',    // Near black (dark mode background)
  960: '#0d0d0d',    // Dark gray (dark mode surface)
  970: '#141414',    // Gray (dark mode elevated)
  980: '#1a1a1a',    // Medium gray (dark mode border)
  990: '#262626',    // Light gray (dark mode divider)
  1000: '#333333',   // Gray (dark mode secondary text)
} as const
```

**Rationale**:
- **Gray 0**: Pure white for light mode backgrounds
- **Gray 50-400**: Light mode surface hierarchy (subtle to medium)
- **Gray 500-900**: Light mode text hierarchy (tertiary to primary)
- **Gray 950-1000**: Dark mode surface hierarchy (near black to medium gray)
- **11 shades per mode**: Sufficient for depth without complexity

### Semantic Colors

**Philosophy**: Muted, professional colors for status and feedback. Not bright or overwhelming.

```typescript
// design-tokens/color/semantic/index.ts

export const semantic = {
  success: {
    50: '#f0fdf4',    // Light green background
    100: '#dcfce7',   // Light green border
    500: '#22c55e',   // Success green (primary)
    600: '#16a34a',   // Success green (hover)
    700: '#15803d',   // Success green (active)
  },
  warning: {
    50: '#fffbeb',    // Light yellow background
    100: '#fef3c7',   // Light yellow border
    500: '#f59e0b',   // Warning amber (primary)
    600: '#d97706',   // Warning amber (hover)
    700: '#b45309',   // Warning amber (active)
  },
  error: {
    50: '#fef2f2',    // Light red background
    100: '#fee2e2',   // Light red border
    500: '#ef4444',   // Error red (primary)
    600: '#dc2626',   // Error red (hover)
    700: '#b91c1c',   // Error red (active)
  },
  info: {
    50: '#eff6ff',    // Light blue background
    100: '#dbeafe',   // Light blue border
    500: '#3b82f6',   // Info blue (primary)
    600: '#2563eb',   // Info blue (hover)
    700: '#1d4ed8',   // Info blue (active)
  },
} as const
```

**Rationale**:
- **50-100**: Light backgrounds for status indicators
- **500**: Primary semantic color (balanced, not too bright)
- **600-700**: Hover/active states (darker for feedback)
- **Muted tones**: Professional, not overwhelming

### Accent Color

**Philosophy**: Single accent color for CTAs and highlights. Minimal, sophisticated, premium.

```typescript
// design-tokens/color/accent/primary.ts

export const accent = {
  // Primary accent (blue - professional, trustworthy)
  50: '#eff6ff',     // Light blue background
  100: '#dbeafe',    // Light blue border
  200: '#bfdbfe',    // Light blue hover
  500: '#3b82f6',    // Primary blue (CTA, links)
  600: '#2563eb',    // Blue (hover)
  700: '#1d4ed8',    // Blue (active)
  900: '#1e3a8a',    // Dark blue (emphasis)
} as const
```

**Rationale**:
- **Blue accent**: Professional, trustworthy, premium
- **Single accent**: Minimal, not rainbow
- **Used sparingly**: CTAs, links, highlights only
- **Sophisticated palette**: Not bright, not neon

### Color Usage

**Light Mode**:
```typescript
// design-tokens/color/light.ts

export const light = {
  background: gray[0],           // White
  surface: gray[50],             // Subtle gray
  surfaceElevated: gray[100],    // Light gray
  border: gray[200],             // Gray
  textPrimary: gray[900],        // Near black
  textSecondary: gray[700],      // Dark gray
  textTertiary: gray[500],       // Medium gray
  textDisabled: gray[400],       // Gray
}
```

**Dark Mode**:
```typescript
// design-tokens/color/dark.ts

export const dark = {
  background: gray[950],         // Near black
  surface: gray[960],            // Dark gray
  surfaceElevated: gray[970],    // Gray
  border: gray[980],             // Light gray
  textPrimary: gray[0],          // White
  textSecondary: gray[400],      // Gray
  textTertiary: gray[500],       // Medium gray
  textDisabled: gray[600],       // Dark gray
}
```

---

## TYPOGRAPHY

### Font Family

**Philosophy**: System fonts for performance and native feel. Clean, modern, readable.

```typescript
// design-tokens/typography/font-family.ts

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
```

**Rationale**:
- **System fonts**: No font loading, native performance
- **Cross-platform**: Works on iOS, Android, Desktop
- **Clean and modern**: Professional appearance
- **Readable**: Optimized for screens

### Font Size Scale

**Philosophy**: Modular scale based on 1.25 ratio (Major Third). Consistent, harmonious, readable.

```typescript
// design-tokens/typography/font-size.ts

export const fontSize = {
  xs: '0.75rem',      // 12px - Captions, labels
  sm: '0.875rem',     // 14px - Secondary text
  base: '1rem',       // 16px - Body text
  lg: '1.125rem',     // 18px - Large body
  xl: '1.25rem',      // 20px - Small heading
  '2xl': '1.5rem',    // 24px - Heading
  '3xl': '1.875rem',  // 30px - Large heading
  '4xl': '2.25rem',   // 36px - Display
  '5xl': '3rem',      // 48px - Hero
} as const
```

**Rationale**:
- **1.25 ratio**: Harmonious scale (Major Third)
- **9 sizes**: Sufficient for all use cases
- **Base 16px**: Standard web size
- **Progressive**: Clear hierarchy

### Font Weight Scale

**Philosophy**: Limited weights for performance and consistency. Only necessary weights.

```typescript
// design-tokens/typography/font-weight.ts

export const fontWeight = {
  normal: 400,        // Regular text
  medium: 500,        // Emphasized text
  semibold: 600,      // Subheadings
  bold: 700,          // Headings
} as const
```

**Rationale**:
- **4 weights**: Sufficient for hierarchy
- **Performance**: Fewer font files
- **Consistency**: Limited choices
- **Modern**: Clean, not heavy

### Line Height Scale

**Philosophy**: Generous line height for readability. Tight for headings, loose for body text.

```typescript
// design-tokens/typography/line-height.ts

export const lineHeight = {
  tight: 1.2,         // Headings
  snug: 1.375,        // Subheadings
  normal: 1.5,        // Body text
  relaxed: 1.625,     // Large body
  loose: 2,           // Captions
} as const
```

**Rationale**:
- **Tight (1.2)**: Headings (compact)
- **Normal (1.5)**: Body text (readable)
- **Loose (2)**: Captions (breathing room)

### Letter Spacing

**Philosophy**: Subtle letter spacing for elegance. Tight for headings, normal for body.

```typescript
// design-tokens/typography/letter-spacing.ts

export const letterSpacing = {
  tighter: '-0.05em',  // Large headings
  tight: '-0.025em',   // Small headings
  normal: '0',         // Body text
  wide: '0.025em',     // Uppercase
  wider: '0.05em',     // Labels
} as const
```

**Rationale**:
- **Negative spacing**: Headings (tight, modern)
- **Normal**: Body text (standard)
- **Positive spacing**: Uppercase (elegant)

---

## BORDER RADIUS

### Philosophy

**Everything is rounded. No sharp corners anywhere.**

```typescript
// design-tokens/border/radius.ts

export const borderRadius = {
  none: '0',           // No rounding (rarely used)
  sm: '0.25rem',       // 4px - Subtle rounding
  md: '0.375rem',      // 6px - Default rounding
  lg: '0.5rem',        // 8px - Cards, buttons
  xl: '0.75rem',       // 12px - Large cards
  '2xl': '1rem',       // 16px - Modals, sheets
  '3xl': '1.5rem',     // 24px - Large modals
  full: '9999px',      // Pills, avatars
} as const
```

**Rationale**:
- **No sharp corners**: Everything rounded
- **Progressive scale**: 4px to 24px
- **Full rounding**: Pills, avatars, badges
- **Soft aesthetic**: Friendly, modern, premium

### Border Width

```typescript
// design-tokens/border/width.ts

export const borderWidth = {
  none: '0',
  thin: '1px',         // Default borders
  medium: '2px',       // Focus rings
  thick: '4px',        // Emphasis
} as const
```

**Rationale**:
- **1px default**: Subtle, minimal
- **2px focus**: Accessible, visible
- **4px emphasis**: Rare, intentional

---

## SHADOWS

### Philosophy

**Soft, subtle shadows for depth. Not harsh or dramatic.**

```typescript
// design-tokens/shadow/index.ts

export const shadow = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',           // Subtle
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',         // Default
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',       // Elevated
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',       // High
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',  // Maximum
} as const
```

**Rationale**:
- **Soft shadows**: Low opacity (5-25%)
- **Subtle elevation**: Progressive depth
- **No harsh shadows**: Gentle, professional
- **Dark mode compatible**: Works on both light/dark

---

## GLASS MATERIALS

### Philosophy

**Modern iOS Liquid Glass - translucent, soft, depth without heaviness.**

```typescript
// design-tokens/glass/material.ts

export const glassMaterial = {
  // Light mode glass
  light: {
    subtle: 'rgba(255, 255, 255, 0.1)',      // Very subtle
    light: 'rgba(255, 255, 255, 0.3)',       // Light glass
    medium: 'rgba(255, 255, 255, 0.5)',      // Medium glass
    heavy: 'rgba(255, 255, 255, 0.7)',       // Heavy glass
  },
  
  // Dark mode glass
  dark: {
    subtle: 'rgba(0, 0, 0, 0.1)',            // Very subtle
    light: 'rgba(0, 0, 0, 0.3)',             // Light glass
    medium: 'rgba(0, 0, 0, 0.5)',            // Medium glass
    heavy: 'rgba(0, 0, 0, 0.7)',             // Heavy glass
  },
} as const
```

**Rationale**:
- **Translucent**: See-through effect
- **Soft**: Not harsh or heavy
- **Depth**: Creates hierarchy
- **Modern**: iOS Liquid Glass aesthetic

### Blur Levels

```typescript
// design-tokens/glass/blur.ts

export const blur = {
  none: '0',
  sm: '4px',          // Subtle blur
  md: '8px',          // Default blur
  lg: '12px',         // Medium blur
  xl: '16px',         // Strong blur
  '2xl': '24px',      // Maximum blur
} as const
```

**Rationale**:
- **Progressive blur**: 4px to 24px
- **Subtle**: Not overwhelming
- **Performance**: Reasonable blur values

### Glass Usage

```typescript
// Example: Glass card
<div
  className="
    bg-glass-light-medium
    backdrop-blur-md
    border border-white/10
    rounded-2xl
  "
>
  Content
</div>
```

---

## SPACING

### Philosophy

**8px base grid. Consistent, harmonious, scalable.**

```typescript
// design-tokens/spacing/index.ts

export const spacing = {
  0: '0',           // 0px
  1: '0.25rem',     // 4px
  2: '0.5rem',      // 8px
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  8: '2rem',        // 32px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
} as const
```

**Rationale**:
- **8px base**: Standard web grid
- **4px increments**: Fine control
- **Progressive**: 0 to 96px
- **Consistent**: Harmonious spacing

---

## GRID SYSTEM

### Philosophy

**12-column grid. Responsive, flexible, standard.**

```typescript
// design-tokens/layout/grid.ts

export const grid = {
  columns: 12,                    // 12 columns
  gutter: '1rem',                 // 16px gutter
  margin: '1rem',                 // 16px margin
} as const
```

**Rationale**:
- **12 columns**: Standard, flexible
- **16px gutter**: Consistent spacing
- **16px margin**: Edge padding

---

## BREAKPOINTS

### Philosophy

**Mobile-first. Standard breakpoints. Consistent across devices.**

```typescript
// design-tokens/layout/breakpoints.ts

export const breakpoints = {
  xs: '320px',       // Small phones
  sm: '375px',       // Standard phones
  md: '768px',       // Tablets
  lg: '1024px',      // Small laptops
  xl: '1280px',      // Desktops
  '2xl': '1536px',   // Large desktops
} as const

export const mediaQueries = {
  xs: `(min-width: ${breakpoints.xs})`,
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
  '2xl': `(min-width: ${breakpoints['2xl']})`,
} as const
```

**Rationale**:
- **Mobile-first**: Start small, scale up
- **Standard sizes**: Industry standard
- **6 breakpoints**: Sufficient for all devices

---

## CONTAINER WIDTHS

```typescript
// design-tokens/layout/container.ts

export const container = {
  sm: '640px',       // Small containers
  md: '768px',       // Medium containers
  lg: '1024px',      // Large containers
  xl: '1280px',      // Extra large containers
  '2xl': '1536px',   // Maximum width
} as const
```

**Rationale**:
- **Max widths**: Prevent overly wide content
- **Responsive**: Scale with breakpoints
- **Readable**: Optimal line length

---

## ICON SIZES

### Philosophy

**Consistent icon sizes. Clear, recognizable, scalable.**

```typescript
// design-tokens/component/icon-size.ts

export const iconSize = {
  xs: '0.75rem',     // 12px - Inline icons
  sm: '1rem',        // 16px - Small icons
  md: '1.25rem',     // 20px - Default icons
  lg: '1.5rem',      // 24px - Large icons
  xl: '2rem',        // 32px - Extra large icons
  '2xl': '3rem',     // 48px - Hero icons
} as const
```

**Rationale**:
- **6 sizes**: Sufficient for all use cases
- **8px increments**: Consistent scale
- **Clear hierarchy**: xs to 2xl

---

## AVATAR SIZES

```typescript
// design-tokens/component/avatar-size.ts

export const avatarSize = {
  xs: '1.5rem',      // 24px - Tiny
  sm: '2rem',        // 32px - Small
  md: '2.5rem',      // 40px - Default
  lg: '3rem',        // 48px - Large
  xl: '4rem',        // 64px - Extra large
  '2xl': '6rem',     // 96px - Hero
} as const
```

**Rationale**:
- **6 sizes**: Sufficient for all use cases
- **8px increments**: Consistent scale
- **Full rounding**: Always circular

---

## ANIMATION

### Animation Durations

**Philosophy**: Fast, responsive, smooth. Not slow or sluggish.

```typescript
// design-tokens/animation/duration.ts

export const duration = {
  instant: '0ms',           // Instant
  fast: '150ms',            // Fast interactions
  normal: '250ms',          // Default transitions
  slow: '350ms',            // Complex animations
  slower: '500ms',          // Page transitions
} as const
```

**Rationale**:
- **Fast by default**: Responsive feel
- **Progressive**: Instant to 500ms
- **Smooth**: Not jarring

### Spring Presets

**Philosophy**: Natural, fluid motion. iOS-style springs.

```typescript
// design-tokens/animation/spring.ts

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
```

**Rationale**:
- **4 presets**: Gentle, default, bouncy, snappy
- **iOS-inspired**: Natural motion
- **Configurable**: Tension and friction

### Transition Curves

**Philosophy**: Smooth, natural easing. Not linear or robotic.

```typescript
// design-tokens/animation/easing.ts

export const easing = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',  // Bouncy
} as const
```

**Rationale**:
- **Standard easings**: Linear, easeIn, easeOut, easeInOut
- **Spring easing**: Bouncy, playful
- **Smooth**: Natural motion

---

## OPACITY

### Philosophy

**Subtle opacity for depth and hierarchy. Not transparent or washed out.**

```typescript
// design-tokens/glass/opacity.ts

export const opacity = {
  0: '0',
  5: '0.05',
  10: '0.1',
  20: '0.2',
  30: '0.3',
  40: '0.4',
  50: '0.5',
  60: '0.6',
  70: '0.7',
  80: '0.8',
  90: '0.9',
  100: '1',
} as const
```

**Rationale**:
- **5% increments**: Fine control
- **Subtle**: Not overwhelming
- **Consistent**: Standard scale

---

## Z-INDEX LAYERS

### Philosophy

**Clear z-index hierarchy. No z-index wars.**

```typescript
// design-tokens/component/z-index.ts

export const zIndex = {
  base: 0,              // Base layer
  dropdown: 1000,       // Dropdowns
  sticky: 1100,         // Sticky headers
  overlay: 1200,        // Overlays
  modal: 1300,          // Modals
  popover: 1400,        // Popovers
  tooltip: 1500,        // Tooltips
  toast: 1600,          // Toasts
} as const
```

**Rationale**:
- **Clear hierarchy**: Base to toast
- **100pt increments**: Easy to remember
- **No conflicts**: Defined layers

---

## ELEVATION LEVELS

### Philosophy

**Elevation through shadows and blur. Not just shadows.**

```typescript
// design-tokens/shadow/elevation.ts

export const elevation = {
  level0: {
    shadow: 'none',
    blur: 'none',
  },
  level1: {
    shadow: shadow.sm,
    blur: blur.sm,
  },
  level2: {
    shadow: shadow.md,
    blur: blur.md,
  },
  level3: {
    shadow: shadow.lg,
    blur: blur.lg,
  },
  level4: {
    shadow: shadow.xl,
    blur: blur.xl,
  },
} as const
```

**Rationale**:
- **5 levels**: Subtle to prominent
- **Shadow + blur**: Modern elevation
- **Consistent**: Clear hierarchy

---

## COMPLETE TOKEN EXPORT

### Index File

```typescript
// design-tokens/index.ts

export * from './color'
export * from './typography'
export * from './spacing'
export * from './border'
export * from './shadow'
export * from './glass'
export * from './animation'
export * from './layout'
export * from './component'
```

---

## TAILWIND CSS CONFIGURATION

### Token Integration

```typescript
// tailwind.config.ts

import type { Config } from 'tailwindcss'
import { gray, accent, semantic } from '@/design-tokens/color'
import { fontSize, fontWeight, lineHeight, letterSpacing, fontFamily } from '@/design-tokens/typography'
import { spacing } from '@/design-tokens/spacing'
import { borderRadius } from '@/design-tokens/border/radius'
import { shadow } from '@/design-tokens/shadow'
import { blur } from '@/design-tokens/glass/blur'
import { breakpoints, mediaQueries } from '@/design-tokens/layout/breakpoints'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Neutral palette
        gray: gray,
        
        // Accent color
        primary: accent,
        
        // Semantic colors
        success: semantic.success,
        warning: semantic.warning,
        error: semantic.error,
        info: semantic.info,
      },
      fontFamily: {
        sans: fontFamily.sans,
        mono: fontFamily.mono,
      },
      fontSize: fontSize,
      fontWeight: fontWeight,
      lineHeight: lineHeight,
      letterSpacing: letterSpacing,
      spacing: spacing,
      borderRadius: borderRadius,
      boxShadow: shadow,
      blur: blur,
      screens: breakpoints,
    },
  },
  plugins: [],
}

export default config
```

---

## CSS CUSTOM PROPERTIES

### Light Mode

```css
/* src/styles/design-tokens.css */

:root {
  /* Colors - Light Mode */
  --color-background: #ffffff;
  --color-surface: #fafafa;
  --color-surface-elevated: #f5f5f5;
  --color-border: #e5e5e5;
  --color-text-primary: #171717;
  --color-text-secondary: #404040;
  --color-text-tertiary: #737373;
  --color-text-disabled: #a3a3a3;
  
  /* Typography */
  --font-family-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-family-mono: 'SF Mono', Monaco, monospace;
  
  /* Spacing */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  /* Blur */
  --blur-sm: 4px;
  --blur-md: 8px;
  --blur-lg: 12px;
  
  /* Animation */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
  
  /* Z-Index */
  --z-base: 0;
  --z-dropdown: 1000;
  --z-modal: 1300;
  --z-toast: 1600;
}
```

### Dark Mode

```css
/* src/styles/design-tokens.css */

[data-theme="dark"] {
  /* Colors - Dark Mode */
  --color-background: #0a0a0a;
  --color-surface: #0d0d0d;
  --color-surface-elevated: #141414;
  --color-border: #262626;
  --color-text-primary: #ffffff;
  --color-text-secondary: #a3a3a3;
  --color-text-tertiary: #737373;
  --color-text-disabled: #525252;
}
```

---

## DESIGN TOKEN USAGE

### In Components

```typescript
// Example: Button component
import { cn } from '@/lib/utils/cn'
import { designTokens } from '@/design-tokens'

export function Button({ variant = 'primary', size = 'md', className, ...props }) {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center font-medium transition-colors',
        
        // Border radius
        'rounded-lg',  // var(--radius-lg)
        
        // Size variants
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        
        // Color variants
        {
          'bg-primary-500 text-white hover:bg-primary-600': variant === 'primary',
          'bg-gray-100 text-gray-900 hover:bg-gray-200': variant === 'secondary',
        },
        
        className
      )}
      {...props}
    />
  )
}
```

---

## DESIGN PRINCIPLES SUMMARY

### Visual Language

**Shapes**: Everything rounded (no sharp corners)
**Colors**: Black & white base, minimal accent
**Typography**: System fonts, clean, readable
**Spacing**: 8px grid, generous whitespace
**Shadows**: Soft, subtle, professional
**Glass**: Modern Liquid Glass, translucent, soft
**Animation**: Fast, smooth, natural
**Depth**: Elevation through shadow + blur

### Design Rules

1. **No sharp corners**: Everything rounded
2. **Black & white base**: Minimal accent colors
3. **Liquid Glass**: Modern, translucent materials
4. **Soft shadows**: Not harsh or dramatic
5. **Fast animations**: 150-350ms
6. **Generous spacing**: 8px grid
7. **System fonts**: No custom fonts
8. **Minimal decoration**: Every element has purpose

### Accessibility

- **Contrast**: WCAG AA minimum (4.5:1)
- **Touch targets**: Minimum 44x44px
- **Focus states**: Visible, clear
- **Screen readers**: Semantic HTML
- **Keyboard navigation**: Full support

---

## CONCLUSION

This Design Token System establishes the **complete visual foundation** for Fee. It defines the design language, token architecture, and implementation strategy that will guide all UI work.

**Key Principles Applied**:
- **Minimal**: Every element has purpose
- **Professional**: Enterprise-grade aesthetic
- **Luxury**: Premium feel, attention to detail
- **Soft**: Rounded corners, gentle shadows
- **Fluid**: Liquid Glass materials, smooth animations
- **Modern**: Contemporary, timeless design
- **Scalable**: Token-based, maintainable system

**Next Steps**:
1. Review with design team
2. Create Figma design system
3. Implement tokens in Tailwind CSS
4. Create base components (Button, Card, Input)
5. Build design system documentation
6. Train team on design tokens

**This token system is the foundation for all visual design. Every component, every screen, every interaction must align with this design language.**

---

*Design Token System V1*
*Created: 2026-07-18*
*Status: COMPLETE*
*Next Phase: Component Design*