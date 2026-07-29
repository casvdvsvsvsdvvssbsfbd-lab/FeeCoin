# FeeCoin Design System (v2) — Trust-First, Mobile-First, Telegram Mini App

> Rule: No screen design. Only visual + interaction rules, tokens, and component specifications.

---

## 0) Product Principles (Design Constraints)
1. **Trust-first UI**: reward states and financial status must be unambiguous (Pending vs Verified vs Rewarded).
2. **Premium dark**: dark-first surfaces, subtle glass, controlled neon.
3. **Thumb & accessibility**: 44×44 minimum touch target, WCAG contrast targets, reduced motion support.
4. **Telegram Mini App adaptation**: prioritize vertical rhythm, safe areas, and low cognitive load.
5. **Apple HIG adaptation**: predictable typography hierarchy, consistent spacing, clear affordances.

---

## 1) Brand Identity

### 1.1 Brand Marks
- **Primary logomark**: FeeCoin wordmark in neon-cyan with subtle glow.
- **Icon style**: geometric, high contrast, minimal internal detail at 24px.
- **Motion motif (optional)**: slow glow/scanline shimmer for “live” status only.

### 1.2 Brand Voice (visual)
- Confident, legible, never playful-disordered.
- Reward and errors use **color + label + icon**.
- Avoid ambiguous gradients for text; gradients only for backgrounds/CTAs.

---

## 2) Color Palette

### 2.1 Core Colors (Hex)
- **Cyan (primary)**: `#00BFFF`
- **Gold (reward)**: `#F0B90B`
- **Emerald (success)**: `#10B981`
- **Blue (info)**: `#3B82F6`
- **Danger (errors)**: `#EF4444`
- **Purple (premium/boost)**: `#A855F7`
- **Pink (redline accent)**: `#FF3366`

### 2.2 Neutrals
- **Background**: `#0A0A0D`
- **Surface (card base)**: `rgba(29, 29, 38, 0.95)`
- **Surface (glass)**: `rgba(29, 29, 38, 0.75)`
- **Border**: `rgba(255, 255, 255, 0.08)`
- **Border (soft)**: `rgba(255, 255, 255, 0.06)`
- **Text primary**: `#FFFFFF`
- **Text secondary**: `#9CA3AF`
- **Text tertiary**: `#6B7280`

### 2.3 Semantic Color Roles (must be used in UI)
- **Action Primary**: Cyan
- **Action Secondary**: `rgba(255,255,255,0.05)` with cyan border glow on hover
- **Reward**: Gold
- **Success**: Emerald
- **Info**: Blue
- **Error**: Danger red
- **Warning**: `#F59E0B`
- **Premium**: Purple
- **Focus Ring**: Cyan

### 2.4 Opacity & Glow Rules
- Neon glows must be **subtle** and **bounded**.
- Default glow: `0 0 20px rgba(0,191,255,0.25)`
- Strong glow (only on primary CTA): `0 0 24px rgba(0,191,255,0.5)`
- Never use glow behind body text.

---

## 3) Typography

### 3.1 Font Families
- **Sans**: Inter / SF Pro Display / system-ui
- **Mono**: JetBrains Mono / monospace

### 3.2 Type Scale (Mobile-first)
| Role | Size | Weight | Line Height | Letter Spacing | Usage |
|---|---:|---:|---:|---:|---|
| Display | 36px | 900 | 1.2 | -0.02em | App name, milestones |
| H1 | 30px | 900 | 1.3 | 0 | Screen title |
| H2 | 24px | 800 | 1.3 | 0 | Card title, key metric |
| H3 | 18px | 700 | 1.4 | 0.01em | Section header |
| H4 | 16px | 700 | 1.4 | 0.01em | Subsection |
| Body | 14px | 400 | 1.5 | 0 | Explanations |
| Body Medium | 14px | 500 | 1.5 | 0 | Emphasis |
| Small | 12px | 400 | 1.5 | 0 | Supporting text |
| Caption | 10px | 600 | 1.4 | 0.06em | Labels, statuses |
| Micro | 9px | 700 | 1.3 | 0.08em | Currency units, tiny metadata |

### 3.3 Typography Rules
- Uppercase headings may use **tracking-wider**; keep uppercase short.
- Numbers use **tabular-nums** (mono) for alignment.
- Don’t set body text below 12px.

---

## 4) Spacing & Layout Rhythm

### 4.1 Spacing Scale (8-point grid)
- `space-1 = 4px`
- `space-2 = 8px`
- `space-3 = 12px`
- `space-4 = 16px`
- `space-5 = 20px`
- `space-6 = 24px`
- `space-8 = 32px`

### 4.2 Layout Rules
- Mobile container max width: **448px**.
- Horizontal padding: **16px** (px-4) default.
- Vertical sections use multiples of 8 or 4 only.

---

## 5) Grid System
- **Mobile (default)**: 4-column conceptual grid.
- **Breakpoints**:
  - Small: 320–374
  - Medium: 375–414
  - Large: 414–768
  - Tablet: ≥768
- **Landscape rule**: keep primary controls near the bottom/center, avoid long single columns.

---

## 6) Border Radius

| Token | Radius |
|---|---:|
| sm | 12px |
| md | 16px |
| lg | 20px |
| xl | 24px |
| full | 9999px |

Rules:
- Primary cards: **xl (24px)**
- Inputs: **md (16px)**
- Chips/badges: **full**
- Bottom sheets: **xl** top corners, bottom corners may be md.

---

## 7) Shadows & Elevation

### 7.1 Shadow Tokens
- **Card Shadow**: `0 8px 32px rgba(0,0,0,0.4)`
- **Lift Shadow (hover/active)**: `0 12px 48px rgba(0,0,0,0.55)`
- **Toast Shadow**: `0 10px 40px rgba(0,0,0,0.6)`

### 7.2 Elevation Rules
- Use at most 1 elevation step per component.
- Glass cards require both border + backdrop-filter.

---

## 8) Icons

### 8.1 Icon Sizes
- Inline: 12px
- Button: 16px
- Card: 20px
- Navigation: 24px

### 8.2 Icon Containers
- Small: 32×32
- Medium: 40×40
- Large: 56×56
- XLarge: 72×72

### 8.3 Icon Style
- Stroke icons preferred (consistent weight).
- Avoid multi-color icons; use color via CSS.
- Every icon-only control must have an accessible label.

---

## 9) Buttons

### 9.1 Variants
1. **Primary (CTA)**
   - Height: **48px**
   - Background: **#229ED9** (no gradient)
   - Radius: **18px**
   - Padding: **20px**
   - Text: **16px, semibold**, Inter
   - Glow: **none**
2. **Secondary**
   - Background: `rgba(255,255,255,0.05)`
   - Border: `1px solid rgba(255,255,255,0.1)`
   - Text: white, 14px, semi-bold
3. **Destructive**
   - Background: `rgba(239,68,68,0.12)`
   - Border: `rgba(239,68,68,0.35)`
   - Text: error red
4. **Icon Button**
   - 40×40 with minimum effective hit area 44×44

### 9.2 States
- Default: full opacity
- Hover: +brightness 110%, slight scale (max 1.02)
- Active: scale down (max 0.98)
- Disabled: opacity 0.5, no pointer events

---

## 10) Inputs & Forms

### 10.1 Input Field
- Background: `rgba(0,0,0,0.4)`
- Border: `1px solid rgba(255,255,255,0.1)`
- Radius: 16px
- Padding: `py-3.5 px-4`
- Text: 16px, bold, mono
- Focus: cyan border + cyan glow ring
- Placeholder: `#6B7280` at reduced opacity

### 10.2 Input with Suffix
- Suffix color: cyan
- Suffix style: 12px bold mono

### 10.3 Validation
- Error state border: `rgba(239,68,68,0.45)`
- Error helper text: error red, 12px

---

## 11) Cards & Surfaces

### 11.1 Standard Card
- Background: `rgba(29,29,38,0.95)`
- Border: `rgba(255,255,255,0.08)`
- Radius: 24px
- Padding: 20px
- Shadow: card shadow
- Backdrop-filter: optional (use on overlays)

### 11.2 Glass Card
- Background: `rgba(29,29,38,0.75)`
- Backdrop-filter: blur(16–20px)
- Border: same as standard

### 11.3 Accent Card (timers, deposits)
- Background: theme-tinted gradient at 8–10% opacity
- Border: theme at 20–25% opacity
- Glow: theme shadow (bounded)

---

## 12) Navigation Bars

### 12.1 Bottom Navigation Bar
- Height: 64px
- Background: `rgba(10,10,13,0.95)`
- Border-top: `1px solid rgba(255,255,255,0.06)`
- Backdrop-filter: blur(20px)
- 4 equal items, centered
- Active: cyan icon + label
- Inactive: text secondary
- Label: 9px bold uppercase, tracking-wider

### 12.2 Top Navigation (App Bar)
- Height: 56px (mobile)
- Background: transparent or subtle surface depending on scroll
- Title centered (when single primary title)
- Back action left; icon-only allowed with accessible label

---

## 13) Wallet Components (Visual Rules Only)

### 13.1 Balance Display
- Primary number: large (24px–30px), mono, tabular nums
- Currency label: small/caption (gold for earnings contexts)
- Secondary fiat: 12px, text secondary

### 13.2 Wallet Status Chips
- Use badge style (see badges section)
- “Available”, “Locked”, “Pending” must be label+color+icon

---

## 14) Earn Components (Visual Rules Only)

### 14.1 Task/Offer Card (list item)
- Contains: icon, title, reward amount, time estimate, status chip
- Visual hierarchy: reward amount dominates secondary info.
- Reward highlight card uses Gold or Cyan depending on category.

### 14.2 Task State Badges
- **Available**: neutral/soft border
- **In Progress**: blue tinted
- **Pending Verification**: gold tinted + spinner indicator token
- **Verified/Rewarded**: emerald tinted
- **Rejected/Failed**: error red tinted

---

## 15) Progress Components

### 15.1 Streak / Levels
- Progress bar: 8px height, rounded-full
- Filled color: cyan gradient
- Milestones: small dots with emerald for achieved

### 15.2 Mining Timer Visualization
- Timer digits: mono
- Background: accent card tinted cyan
- “Ends soon” warning: gold→warning rules (use only when urgent)

---

## 16) Charts & Statistics Cards (Micro Visual Spec)

### 16.1 Chart Styles
- Lines/areas use cyan (primary) and emerald (success) series.
- Gridlines: `rgba(255,255,255,0.06)`
- Text: caption and small only.

### 16.2 Statistics Cards
- 2–3 metrics per row, each with:
  - label (caption, text secondary)
  - value (H3 or H2 size, mono)
  - optional delta indicator (up green / down red)

---

## 17) Dialogs & Alerts

### 17.1 Modal/Dialog
- Backdrop: `rgba(0,0,0,0.6)`
- Card: standard card with radius xl
- Title: H3
- Actions: primary button first, secondary second
- Max width: 448px

### 17.2 Toast/Inline Alerts
- Toast radius: lg
- Duration: 2.5–4s
- Error toast uses danger red strip
- Success toast uses emerald strip

---

## 18) Bottom Sheets
- Top corners radius: 24px; bottom corners optional md
- Drag handle: 28–36px wide, centered, low opacity
- Background: standard card or glass card depending on emphasis
- Primary action stays fixed at sheet bottom.

---

## 19) Loading, Skeleton, and Feedback

### 19.1 Loading Indicators
- Use minimal spinner token (circular stroke)
- Loading colors: cyan only

### 19.2 Skeletons
- Skeleton base: `rgba(255,255,255,0.06)`
- Highlight shimmer: `rgba(255,255,255,0.12)`
- Shimmer must stop under `prefers-reduced-motion`.

---

## 20) Animations & Motion

### 20.1 General Rules
- Prefer fades and subtle transforms.
- Maximum duration: 250–350ms for UI transitions.
- No auto-playing animations beyond gentle status indicators.

### 20.2 Reduced Motion
- If user has `prefers-reduced-motion: reduce`:
  - disable shimmer
  - reduce glow pulse
  - keep essential state changes instantaneous.

### 20.3 Allowed Motion Types
- Button press scale (0.98)
- Card hover lift (lift shadow)
- Live badge pulse dot
- Loading spinner

---

## 21) Badges, Chips, and Labels

### 21.1 Status Badge (generic)
- Border: theme at 30% opacity
- Background: theme at 20% opacity
- Text: theme color, 9px bold uppercase
- Padding: `px-2 py-0.5`
- Radius: full

### 21.2 Live Badge
- Background: cyan at 10% opacity
- Border: cyan at 20% opacity
- Dot: 6px cyan, pulse allowed
- Text: cyan, 9px bold

---

## 22) Accessibility

### 22.1 Contrast
- Target WCAG AA:
  - body: >= 4.5:1
  - large text: >= 3:1
- Validate semantic combinations (text + background + overlay).

### 22.2 Touch Targets
- Minimum interactive target: 44×44 effective area.
- Spacing between touch targets: >= 8px.

### 22.3 Focus & Keyboard Navigation (web)
- Focus ring: 2px cyan outline
- Never remove outline; replace with custom ring.

### 22.4 Screen Reader Rules
- Icon-only controls: provide aria-label
- State changes must be announced via appropriate live region patterns.

---

## 23) Responsive Rules (No pages, only behavior)

### 23.1 Typography scaling
- Small devices: reduce font size by 1px equivalent for non-critical labels.

### 23.2 Safe areas
- Top safe area: 24px (pt-8 equivalent)
- Bottom safe area: 112px (pb-28 equivalent) to avoid home indicator overlap

### 23.3 Orientation
- Landscape: reduce vertical padding and keep primary actions visible near lower half.

---

## 24) Telegram Mini App Guidelines (Adaptation Spec)
- Favor compact header patterns and persistent bottom navigation.
- Avoid dense navigation hierarchies.
- Ensure webview scroll behaves predictably; sticky wallet summary must not cover content.
- Keep CTAs thumb-reachable in one hand (right/left alignment as needed).

---

## 25) Apple HIG Adaptation Spec
- Clear hierarchy: titles, then primary action, then supporting info.
- Consistent component shapes: rounded rectangles, soft borders.
- Communicate status with **both** color and text.
- Avoid excessive visual noise; neon is an accent, not a wallpaper.

---

## 26) Token Index (Implementation-agnostic)
- Colors: primary cyan, reward gold, success emerald, info blue, danger red, premium purple
- Spacing: 4/8/12/16/20/24/32
- Radius: 12/16/20/24/full
- Elevation: card shadow + lift shadow
- Typography: Display/H1/H2/H3/H4/Body/Small/Caption/Micro

---

## Summary
This Design System defines FeeCoin’s complete visual and interaction rules: identity, colors, typography, spacing, grid, radii, elevation, icons, buttons, inputs, cards, navigation, wallet/earn/progress patterns, charts/stat cards, dialogs/bottom sheets, loading/skeletons, animations, accessibility, responsive rules, and adaptations for Telegram Mini Apps and Apple HIG.

