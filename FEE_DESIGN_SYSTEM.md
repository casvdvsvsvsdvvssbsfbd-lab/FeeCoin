# FEE - Design System
## Complete Visual Design Framework & Principles

---

## DESIGN PHILOSOPHY

**Inspired by**: Telegram's minimalism + Apple's precision + Stripe's clarity
**Principle**: Design is invisible. Users should focus on content, not decoration.
**Pattern**: Systematic consistency with purposeful variation

---

## CORE DESIGN PRINCIPLES

### 1. Content First
- Design serves content, not the other way around
- Every element must have a purpose
- Remove anything that doesn't add value

### 2. Clarity Over Cleverness
- Obvious is better than clever
- Users should never have to guess what something does
- Labels > icons alone

### 3. Consistency Creates Trust
- Same patterns across all screens
- Predictable behavior
- Professional, not playful

### 4. Accessibility is Non-Negotiable
- WCAG AA minimum (4.5:1 contrast)
- 44x44px minimum touch targets
- Keyboard navigation support
- Screen reader compatibility

### 5. Performance is Design
- Fast = good design
- No unnecessary animations
- Optimize for perceived speed

---

## VISUAL HIERARCHY

### Hierarchy Levels

**Level 1: Primary (Balance)**
- Purpose: User's main motivation
- Treatment: Largest, boldest, highest contrast
- Example: "12,450 FC" on Home screen

**Level 2: Secondary (Actions)**
- Purpose: Clear paths to earning
- Treatment: Medium size, clear labels, icons
- Example: "Watch Ads", "Complete Tasks" buttons

**Level 3: Tertiary (Content)**
- Purpose: Information and opportunities
- Treatment: Standard size, muted colors
- Example: Task list, activity feed

**Level 4: Quaternary (Metadata)**
- Purpose: Supporting information
- Treatment: Small, muted, secondary color
- Example: Timestamps, subtitles, descriptions

---

## TYPOGRAPHY SYSTEM

### Type Scale

**Display (Hero Text)**
- Size: 32px
- Weight: Bold (700)
- Line Height: 1.2
- Use: App name on splash screen only
- Example: "Fee"

**H1 (Page Titles)**
- Size: 24px
- Weight: Semibold (600)
- Line Height: 1.3
- Use: Screen headers
- Example: "Your Balance", "Complete Tasks"

**H2 (Section Headers)**
- Size: 18px
- Weight: Semibold (600)
- Line Height: 1.4
- Use: Section titles
- Example: "Available Now", "Recent Activity"

**H3 (Subsection Headers)**
- Size: 16px
- Weight: Medium (500)
- Line Height: 1.5
- Use: Subsection titles
- Example: "Current Balance", "Pending Earnings"

**Body (Primary Text)**
- Size: 15px
- Weight: Regular (400)
- Line Height: 1.6
- Use: Main content, descriptions
- Example: Task descriptions, explanations

**Caption (Secondary Text)**
- Size: 13px
- Weight: Regular (400)
- Line Height: 1.5
- Use: Subtitles, timestamps, metadata
- Example: "Earn 10-50 FC per ad", "2 minutes ago"

**Overline (Labels)**
- Size: 11px
- Weight: Medium (500)
- Line Height: 1.4
- Letter Spacing: 0.5px
- Use: Small labels, category tags
- Example: "BALANCE", "EARN FC"

### Font Family
**Primary**: System font stack (native, fast, familiar)
- iOS: -apple-system, SF Pro
- Android: Roboto
- Fallback: sans-serif

**Why System Fonts**:
- Zero load time (already on device)
- Native feel (matches OS)
- Better accessibility (user font settings respected)
- Smaller bundle size

### Font Weights
- **Regular (400)**: Body text, captions
- **Medium (500)**: Subtitles, labels, secondary buttons
- **Semibold (600)**: Headers, primary buttons
- **Bold (700)**: Display text, emphasis

### Text Alignment
- **Headings**: Left-aligned (except splash screen - centered)
- **Body**: Left-aligned
- **Numbers**: Right-aligned (for tabular data)
- **Buttons**: Center-aligned

---

## SPACING SYSTEM

### Base Unit: 4px

**Scale**:
- 4px (xs): Tight spacing, icon padding
- 8px (sm): Small gaps, list item padding
- 12px (md): Medium spacing, button padding
- 16px (lg): Standard spacing, card padding
- 24px (xl): Section spacing
- 32px (2xl): Large section spacing
- 48px (3xl): Screen padding, major sections
- 64px (4xl): Extra large spacing

### Spacing Rules

**Screen Padding**: 16px (mobile), 24px (tablet)
**Card Padding**: 16px
**Button Padding**: 12px vertical, 16px horizontal
**List Item Padding**: 12px vertical, 16px horizontal
**Section Spacing**: 24px between sections
**Element Spacing**: 8px between related elements

### Vertical Rhythm
- Maintain consistent vertical spacing
- Use multiples of 4px
- Example: 16px → 24px → 32px → 48px

---

## COLOR SYSTEM

### Color Philosophy
**Minimal palette**: 2-3 colors maximum
**Purpose-driven**: Color communicates meaning, not decoration
**Accessible**: All combinations meet WCAG AA (4.5:1 contrast)

### Color Roles

**Primary Color**
- Purpose: Brand identity, primary actions, active states
- Usage: 10% of UI (buttons, active tabs, links)
- Contrast: 4.5:1 minimum on white background

**Secondary Color**
- Purpose: Secondary actions, less important elements
- Usage: 5% of UI (secondary buttons, subtitles)
- Contrast: 4.5:1 minimum on white background

**Neutral Colors**
- Purpose: Text, backgrounds, borders
- Usage: 85% of UI
- Scale: 9 shades (50-900)
  - 50: Lightest (backgrounds)
  - 100-200: Light (borders, dividers)
  - 300-400: Medium (disabled text, captions)
  - 500: Base (body text)
  - 600-700: Dark (headings)
  - 800-900: Darkest (high emphasis)

**Semantic Colors**
- Success: Green (positive actions, confirmations)
- Error: Red (errors, destructive actions)
- Warning: Orange (warnings, cautions)
- Info: Blue (informational, links)

### Color Usage Rules

**Text on Background**:
- Primary text: Neutral 800-900 on white
- Secondary text: Neutral 500-600 on white
- Caption text: Neutral 400-500 on white
- Disabled text: Neutral 300-400 on white

**Backgrounds**:
- Primary background: White or Neutral 50
- Card background: White
- Elevated background: White with shadow
- Divider: Neutral 200

**Interactive Elements**:
- Primary button: Primary color background, white text
- Secondary button: Transparent, Primary color border/text
- Disabled button: Neutral 300 background, Neutral 400 text

**Status Indicators**:
- Success: Green 600
- Error: Red 600
- Warning: Orange 600
- Info: Blue 600

---

## LAYOUT SYSTEM

### Grid
**Columns**: 4-column grid (mobile), 8-column grid (tablet)
**Gutter**: 16px (mobile), 24px (tablet)
**Margin**: 16px (mobile), 24px (tablet)

### Container Widths
- Mobile: Full width (100% - 32px)
- Tablet: Max-width 600px, centered
- Desktop: Max-width 414px (mobile width), centered

### Breakpoints
- Mobile: 375px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

### Safe Areas
- Top: 44px (status bar)
- Bottom: 34px (home indicator)
- Left/Right: 0px (edge-to-edge)

---

## COMPONENT SYSTEM

### Buttons

**Primary Button**
- Height: 48px
- Padding: 12px vertical, 24px horizontal
- Border Radius: 8px
- Font: Semibold (600), 15px
- Background: Primary color
- Text: White
- Shadow: None
- States:
  - Default: Primary color background
  - Hover: 10% darker (if applicable)
  - Active: 20% darker, scale 0.98
  - Disabled: Neutral 300 background, Neutral 400 text
- Usage: Main CTAs (Claim, Confirm, Start)

**Secondary Button**
- Height: 48px
- Padding: 12px vertical, 24px horizontal
- Border Radius: 8px
- Font: Medium (500), 15px
- Background: Transparent
- Text: Primary color
- Border: 1px solid Primary color
- States:
  - Default: Transparent background
  - Active: Primary color background (10% opacity)
- Usage: Secondary actions (Back, Cancel)

**Tertiary Button**
- Height: 48px
- Padding: 12px vertical, 24px horizontal
- Border Radius: 8px
- Font: Medium (500), 15px
- Background: Transparent
- Text: Primary color
- Border: None
- States:
  - Default: Transparent background
  - Active: Primary color background (10% opacity)
- Usage: Tertiary actions (Skip, Learn More)

**Icon Button**
- Size: 44x44px
- Border Radius: 8px
- Icon: 24x24px
- Background: Transparent
- States:
  - Default: Transparent
  - Active: Neutral 100 background
- Usage: Header icons, close buttons

### Cards

**Standard Card**
- Background: White
- Border Radius: 12px
- Padding: 16px
- Shadow: None (wireframe), subtle shadow (final design)
- Border: 1px solid Neutral 200 (optional)
- Usage: Balance card, task cards

**Elevated Card**
- Background: White
- Border Radius: 12px
- Padding: 16px
- Shadow: 0 2px 8px rgba(0,0,0,0.08)
- Border: None
- Usage: Modals, important content

**Interactive Card**
- Background: White
- Border Radius: 12px
- Padding: 16px
- Border: 1px solid Neutral 200
- States:
  - Default: Neutral 200 border
  - Hover: Primary color border (if applicable)
  - Active: Neutral 300 background
- Usage: Task cards, list items

### Inputs

**Text Input**
- Height: 48px
- Padding: 12px 16px
- Border Radius: 8px
- Border: 1px solid Neutral 300
- Background: White
- Font: Regular (400), 15px
- States:
  - Default: Neutral 300 border
  - Focus: Primary color border, 2px
  - Error: Error color border, 2px
  - Disabled: Neutral 200 background, Neutral 400 text
- Usage: Forms, search

**Textarea**
- Height: Auto (min 120px)
- Padding: 12px 16px
- Border Radius: 8px
- Border: 1px solid Neutral 300
- Background: White
- Font: Regular (400), 15px
- Line Height: 1.6
- States: Same as text input
- Usage: Multi-line text, feedback

### Lists

**Standard List Item**
- Height: Auto (min 56px)
- Padding: 12px 16px
- Border Bottom: 1px solid Neutral 200
- Background: White
- Font: Regular (400), 15px
- States:
  - Default: White background
  - Active: Neutral 50 background
- Usage: Task list, activity feed

**List Item with Icon**
- Icon: 24x24px, left side
- Content: Right of icon
- Spacing: 12px between icon and content
- Usage: Tasks with icons, settings items

**List Item with Arrow**
- Content: Left side
- Arrow: 20x20px, right side
- Spacing: 8px between content and arrow
- Usage: Navigation items, settings

### Navigation

**Bottom Navigation**
- Height: 60px
- Background: White
- Border Top: 1px solid Neutral 200
- Items: 3 tabs, equal width
- Icon: 24x24px
- Label: 11px, Medium (500), below icon
- Spacing: 8px between icon and label
- States:
  - Active: Primary color icon + label
  - Inactive: Neutral 400 icon + label
- Usage: Main app navigation

**Tab Bar**
- Height: 44px
- Background: White
- Border Bottom: 1px solid Neutral 200
- Items: Horizontal tabs
- Indicator: 2px line below active tab
- States:
  - Active: Primary color text + indicator
  - Inactive: Neutral 500 text
- Usage: Filter tabs, time period selector

**Header**
- Height: 56px
- Background: White
- Border Bottom: 1px solid Neutral 200
- Left: Back button or menu icon (44x44px)
- Center: Title (H1, 18px)
- Right: Action icon (44x44px)
- Usage: Screen headers

### Modals

**Full-Screen Modal**
- Background: White
- Header: 56px, with back button
- Content: Scrollable
- Footer: Fixed bottom (optional)
- Transition: Slide up from bottom
- Usage: Task flows, withdrawal flow

**Bottom Sheet**
- Height: Auto (max 80% of screen)
- Background: White
- Border Radius: 16px (top corners only)
- Handle: 32x4px, centered top
- Content: Scrollable
- Transition: Slide up from bottom
- Usage: Action sheets, pickers

**Dialog**
- Width: 280px (mobile)
- Background: White
- Border Radius: 12px
- Padding: 24px
- Title: H2, 18px
- Body: Body text, 15px
- Actions: Right-aligned buttons
- Overlay: 50% black background
- Usage: Confirmations, alerts

### Icons

**Icon Size**
- Small: 16x16px (inline icons)
- Medium: 24x24px (buttons, list items)
- Large: 32x32px (empty states)
- Extra Large: 48x48px (success/error states)

**Icon Style**
- Weight: 2px stroke
- Style: Outline (not filled)
- Corner Radius: 2px
- Color: Matches text color

**Icon Usage**
- Always pair with text label (except universally recognized icons)
- Consistent placement (left of text, right for arrows)
- Minimum touch target: 44x44px (even if icon is smaller)

---

## INTERACTION DESIGN

### Touch Targets
**Minimum Size**: 44x44px
**Recommended**: 48x48px for primary actions
**Spacing**: 8px minimum between touch targets

### Gestures
**Supported**:
- Tap: Primary interaction
- Pull-to-refresh: Scrollable screens
- Swipe: Onboarding carousel only

**Not Supported**:
- Swipe to delete
- Swipe to go back
- Long press
- Pinch to zoom
- Shake

### Animations

**Duration**:
- Fast: 150ms (button taps, toggles)
- Standard: 300ms (page transitions, modals)
- Slow: 500ms (page transitions, modals)

**Easing**:
- Ease-out: Entering elements (fast start, slow end)
- Ease-in: Exiting elements (slow start, fast end)
- Ease-in-out: Continuous animations

**What to Animate**:
- Page transitions (fade, slide)
- Modal entrances (slide up)
- Button taps (scale, color)
- Balance updates (scale, flash)
- Accordion expand/collapse

**What NOT to Animate**:
- Decorative elements
- Content changes (causes confusion)
- Loading states (use spinners instead)
- Error states (use icons instead)

### Transitions

**Page Transition**:
- Current screen fades out (100ms)
- New screen fades in (100ms)
- Total: 200ms

**Modal Transition**:
- Modal slides up from bottom (300ms ease-out)
- Overlay fades in (200ms)

**Tab Switch**:
- Content fades out (100ms)
- Content fades in (100ms)
- Total: 200ms

---

## ACCESSIBILITY

### Visual
**Contrast**:
- Normal text: 4.5:1 minimum (WCAG AA)
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

**Color Blindness**:
- Don't rely on color alone (use icons + text)
- Test with color blindness simulators
- Provide text alternatives

**Focus Indicators**:
- 2px solid outline
- High contrast color
- Visible on all interactive elements

### Motor
**Touch Targets**:
- Minimum 44x44px
- Adequate spacing (8px minimum)
- No small, clustered buttons

**Timing**:
- No time limits (except ads)
- Extendable timeouts
- Pause animations on request

### Cognitive
**Language**:
- Simple, clear language
- No jargon
- No idioms

**Consistency**:
- Same patterns across screens
- Predictable behavior
- No surprises

**Error Prevention**:
- Confirm destructive actions
- Clear error messages
- Easy recovery

### Screen Reader
**Semantic HTML**:
- Proper heading hierarchy (H1, H2, H3)
- Landmark regions (nav, main, complementary)
- Descriptive link text

**ARIA Labels**:
- All icons have labels
- All buttons have labels
- Live regions for dynamic content

**Announcements**:
- Balance updates
- New tasks
- Success/error messages

---

## RESPONSIVE DESIGN

### Mobile (375px)
- Primary design target
- Full-width cards
- 2x2 grid for primary actions
- Bottom navigation: 3 tabs

### Tablet (768px)
- Cards centered, max-width 600px
- Primary actions: 4-column row (optional)
- Increased margins (24px)
- Bottom navigation: 3 tabs (same as mobile)

### Desktop (1024px+)
- Constrained to mobile width (375-414px)
- Centered on screen
- OR expand to tablet layout with side nav (future)

---

## DARK MODE (FUTURE)

### When to Implement
- After MVP launch
- User request threshold: > 20% of users
- Platform support: Telegram supports dark mode

### Design Approach
- Invert neutral colors (white ↔ black)
- Adjust primary/secondary colors for contrast
- Keep semantic colors (green, red, orange)
- Test all screens in both modes

---

## ANIMATION LIBRARY

### Microinteractions

**Button Tap**:
- Scale: 1.0 → 0.95 → 1.0
- Duration: 150ms
- Easing: Ease-out

**Balance Update**:
- Scale: 1.0 → 1.1 → 1.0
- Color flash: 200ms
- Duration: 500ms total

**Tab Switch**:
- Fade out: 100ms
- Fade in: 100ms
- Total: 200ms

**Pull-to-Refresh**:
- Spinner: Continuous rotation
- Text fade: 200ms
- Complete fade: 500ms

**Accordion**:
- Expand/collapse: 200ms ease-in-out
- Icon rotate: 200ms
- Content fade: 100ms

### Page Transitions

**Forward Navigation**:
- Current: Fade out 100ms
- Next: Fade in 100ms
- Total: 200ms

**Back Navigation**:
- Current: Fade out 100ms
- Previous: Fade in 100ms
- Total: 200ms

**Modal**:
- Overlay: Fade in 200ms
- Modal: Slide up 300ms ease-out
- Total: 300ms

---

## DESIGN TOKENS

### Spacing Tokens
```
--space-4: 4px
--space-8: 8px
--space-12: 12px
--space-16: 16px
--space-24: 24px
--space-32: 32px
--space-48: 48px
--space-64: 64px
```

### Typography Tokens
```
--font-display: 32px, Bold, 1.2 line-height
--font-h1: 24px, Semibold, 1.3 line-height
--font-h2: 18px, Semibold, 1.4 line-height
--font-h3: 16px, Medium, 1.5 line-height
--font-body: 15px, Regular, 1.6 line-height
--font-caption: 13px, Regular, 1.5 line-height
--font-overline: 11px, Medium, 1.4 line-height, 0.5px letter-spacing
```

### Color Tokens
```
--color-primary: [Primary color]
--color-secondary: [Secondary color]
--color-neutral-50: [Lightest]
--color-neutral-100: [Light]
--color-neutral-200: [Border]
--color-neutral-300: [Disabled]
--color-neutral-400: [Caption]
--color-neutral-500: [Secondary text]
--color-neutral-600: [Body text]
--color-neutral-700: [Heading]
--color-neutral-800: [Dark heading]
--color-neutral-900: [Darkest]
--color-success: [Green]
--color-error: [Red]
--color-warning: [Orange]
--color-info: [Blue]
```

### Shadow Tokens
```
--shadow-none: none
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
--shadow-md: 0 2px 8px rgba(0,0,0,0.08)
--shadow-lg: 0 4px 16px rgba(0,0,0,0.1)
```

### Border Radius Tokens
```
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
--radius-full: 9999px
```

---

## DESIGN CHECKLIST

### Before Shipping Any Screen
- [ ] Follows visual hierarchy (Level 1-4)
- [ ] Uses correct typography scale
- [ ] Uses correct spacing (multiples of 4px)
- [ ] Meets contrast requirements (4.5:1)
- [ ] Touch targets are 44x44px minimum
- [ ] Has clear back button (if not Home)
- [ ] Has clear page title
- [ ] Has clear primary action
- [ ] Empty states are handled
- [ ] Error states are handled
- [ ] Loading states are handled
- [ ] Keyboard navigation works
- [ ] Screen reader announces content
- [ ] Animations are subtle (200-300ms)
- [ ] No unnecessary decoration
- [ ] Consistent with other screens

---

## DESIGN ANTI-PATTERNS

### ❌ Avoid
- Gradients (unless brand requires)
- Drop shadows (unless elevation needed)
- Decorative images/illustrations
- Multiple fonts
- All caps (except FC)
- Exclamation marks (except success states)
- Emojis in serious contexts
- Animations longer than 500ms
- More than 3 colors
- Cluttered layouts
- Small touch targets (< 44x44px)
- Low contrast text (< 4.5:1)
- Inconsistent spacing
- Unclear labels
- Hidden navigation

### ✅ Embrace
- Minimal color palette
- System fonts
- Generous whitespace
- Clear hierarchy
- Consistent patterns
- Accessible contrast
- Large touch targets
- Obvious labels
- Visible navigation
- Subtle animations
- Fast performance
- Content-first design

---

## IMPLEMENTATION GUIDELINES

### For Designers
1. Start with wireframes (already done)
2. Apply design system tokens
3. Test accessibility (contrast, touch targets)
4. Review with developers before finalizing
5. Create component library in Figma

### For Developers
1. Use design tokens (CSS variables)
2. Build component library first
3. Follow accessibility guidelines
4. Test on real devices
5. Optimize performance (images, fonts)

### For Product Managers
1. Reference design system in specs
2. Don't request exceptions without good reason
3. Test accessibility early
4. Prioritize content over decoration

---

## CONCLUSION

Fee's design system is built on simplicity, clarity, and accessibility. Every decision serves the user. No decoration for decoration's sake. No cleverness at the expense of clarity. No exceptions to accessibility.

**Our design promise**:
- Minimal: Less is more
- Clear: Obvious is better than clever
- Accessible: Everyone can use it
- Fast: Performance is design
- Consistent: Same patterns, everywhere

---

*Design System Version 1.0*
*Created: 2026-07-18*
*Status: Ready for Visual Design*
*Next Step: Component Library*