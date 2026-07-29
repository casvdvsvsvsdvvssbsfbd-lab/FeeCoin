# Fee - Home Page Wireframe
## Premium Telegram Mini App Information Architecture

---

## Design Philosophy
**Inspiration**: Telegram Wallet + Apple Wallet
**Tone**: Minimal, premium, purposeful, trustworthy
**Excluded**: Gaming aesthetics, crypto casino vibes, dashboard complexity

---

## WIREFRAME LAYOUT

```
┌─────────────────────────────────────┐
│  ≡ Fee                      ⚙️      │  ← Header (60px)
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │    Your Balance             │    │  ← Balance Card (180px)
│  │                             │    │
│  │    12,450 FC                │    │
│  │                             │    │
│  │    ≈ $124.50                │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│  Earn FC                           │  ← Section Label (40px)
│                                     │
│  ┌──────────┐ ┌──────────┐         │
│  │          │ │          │         │
│  │  Watch   │ │ Complete │         │  ← Primary Actions (120px)
│  │  Ads     │ │  Tasks   │         │
│  │          │ │          │         │
│  └──────────┘ └──────────┘         │
│  ┌──────────┐ ┌──────────┐         │
│  │          │ │          │         │
│  │  Install │ │ Refer    │         │
│  │  Apps    │ │  Friends │         │
│  │          │ │          │         │
│  └──────────┘ └──────────┘         │
│                                     │
│  Available Now                      │  ← Section Label (40px)
│                                     │
│  ┌─────────────────────────────┐    │
│  │ ▸ Watch Video Ad            │    │
│  │   Earn 50 FC · 30 sec       │    │  ← Task List (flexible)
│  ├─────────────────────────────┤    │
│  │ ▸ Complete Survey            │    │
│  │   Earn 100 FC · 2 min       │    │
│  ├─────────────────────────────┤    │
│  │ ▸ Install App: GameX         │    │
│  │   Earn 200 FC · Level 3     │    │
│  └─────────────────────────────┘    │
│                                     │
│  Recent Activity                    │  ← Section Label (40px)
│                                     │
│  ┌─────────────────────────────┐    │
│  │ ✓ Watched Ad           +50  │    │
│  │   2 min ago                 │    │  ← Activity Feed (flexible)
│  ├─────────────────────────────┤    │
│  │ ✓ Completed Task         +100│    │
│  │   1 hour ago                │    │
│  ├─────────────────────────────┤    │
│  │ ✓ Referral Bonus        +500 │    │
│  │   3 hours ago               │    │
│  └─────────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│  🏠 Home    📊 Stats    👤 Profile  │  ← Bottom Nav (60px)
└─────────────────────────────────────┘
```

---

## DETAILED SECTION BREAKDOWN

### 1. HEADER (60px height)
**Position**: Top of screen, fixed

**Why it exists**: 
- Provides app identity and context
- Offers quick access to settings
- Maintains consistent navigation pattern

**What it displays**:
- Left: Hamburger menu icon (≡)
- Center: App name "Fee" (minimal, no logo)
- Right: Settings icon (⚙️)

**Why placed there**: 
- Standard mobile app header position
- Immediate brand recognition
- Settings access without cluttering main content

**What happens after clicking**:
- ≡ Menu: Opens side drawer with links (FAQ, Support, Terms, Logout)
- ⚙️ Settings: Opens settings screen (notifications, currency display, language)

---

### 2. BALANCE CARD (180px height)
**Position**: Top of content area, full width with margins

**Why it exists**:
- Primary user motivation (like Apple Wallet card)
- Single source of truth for earnings
- Creates emotional connection to value

**What it displays**:
- Label: "Your Balance" (small, muted)
- Primary value: "12,450 FC" (large, bold)
- Secondary value: "≈ $124.50" (smaller, muted)
- Subtle card background (no gradients, no shadows in wireframe)

**Why placed there**:
- First thing users see (F-pattern reading)
- Reinforces purpose of app immediately
- Creates sense of progress and achievement

**What happens after clicking**:
- Navigates to Balance/Portfolio screen
- Shows earning history, conversion rates, withdrawal options
- No action on long-press

---

### 3. PRIMARY ACTIONS GRID (120px height)
**Position**: Below balance, 2x2 grid layout

**Why it exists**:
- Clear entry points to all earning methods
- Reduces cognitive load (4 clear options)
- Matches user mental model (how do I earn?)

**What it displays**:
- 4 equal-sized buttons with icons + labels:
  1. Watch Ads (play icon)
  2. Complete Tasks (checkmark icon)
  3. Install Apps (download icon)
  4. Refer Friends (person+ icon)

**Why placed there**:
- Secondary hierarchy (after balance)
- Grid layout for quick scanning
- Equal weight to all earning methods

**What happens after clicking**:
- Watch Ads → Opens ad player interface
- Complete Tasks → Shows available tasks list
- Install Apps → Shows app install offers
- Refer Friends → Opens referral dashboard with link/code

---

### 4. AVAILABLE NOW SECTION (flexible height)
**Position**: Middle of screen, scrollable list

**Why it exists**:
- Shows immediate earning opportunities
- Creates urgency and engagement
- Personalized content feed

**What it displays**:
- Section header: "Available Now"
- List of 3-5 active opportunities:
  - Task name/description
  - Reward amount (FC)
  - Time/effort estimate
  - Progress indicator (if applicable)

**Example items**:
```
▸ Watch Video Ad
  Earn 50 FC · 30 seconds

▸ Complete Survey
  Earn 100 FC · 2 minutes

▸ Install App: GameX
  Earn 200 FC · Reach level 3
```

**Why placed there**:
- Tertiary hierarchy (after primary actions)
- Scrollable to accommodate variable content
- Clear "now" framing creates action

**What happens after clicking**:
- Each item navigates to specific task flow
- Ad → Video player with countdown
- Survey → External link or in-app form
- App Install → App Store/Play Store link with tracking

---

### 5. RECENT ACTIVITY SECTION (flexible height)
**Position**: Below available tasks, scrollable list

**Why it exists**:
- Provides social proof and validation
- Shows earning momentum
- Builds trust through transparency

**What it displays**:
- Section header: "Recent Activity"
- List of 3-5 recent actions:
  - Action type (icon + text)
  - Reward amount (+XX FC)
  - Timestamp (relative: "2 min ago", "1 hour ago")

**Example items**:
```
✓ Watched Ad           +50 FC
  2 minutes ago

✓ Completed Task        +100 FC
  1 hour ago

✓ Referral Bonus       +500 FC
  3 hours ago
```

**Why placed there**:
- Quaternary hierarchy (after opportunities)
- Reinforces that system works
- Creates FOMO (fear of missing out)

**What happens after clicking**:
- No navigation (read-only)
- Could expand to show full transaction history
- No action on long-press

---

### 6. BOTTOM NAVIGATION (60px height)
**Position**: Bottom of screen, fixed

**Why it exists**:
- Primary app navigation
- Standard Telegram Mini App pattern
- Clear information architecture

**What it displays**:
- 3 tabs with icons + labels:
  1. Home (house icon) - Active state
  2. Stats (chart icon) - Inactive
  3. Profile (person icon) - Inactive

**Why placed there**:
- Thumb-friendly zone
- Standard mobile pattern
- Clear hierarchy (Home is primary)

**What happens after clicking**:
- Home → Current screen (no action)
- Stats → Opens statistics dashboard (earnings over time, categories, etc.)
- Profile → Opens user profile (settings, withdrawal, support)

---

## INTERACTION PATTERNS

### Scroll Behavior
- Balance card and primary actions: Fixed (do not scroll)
- Available Now and Recent Activity: Scrollable independently
- Bottom nav: Fixed

### Pull-to-Refresh
- Available on entire screen
- Refreshes available tasks and activity feed
- Shows spinner animation
- Updates balance if new earnings detected

### Empty States
**No available tasks**:
```
Available Now

No tasks available right now.
Check back soon for new opportunities.
```

**No recent activity**:
```
Recent Activity

Your recent earnings will appear here.
Start completing tasks to see your activity.
```

---

## INFORMATION HIERARCHY

### Priority 1 (Must See)
- Balance Card (user's primary motivation)

### Priority 2 (Primary Actions)
- 4 Earning Method Buttons (clear paths to value)

### Priority 3 (Opportunities)
- Available Now list (immediate engagement)

### Priority 4 (Social Proof)
- Recent Activity (validation and trust)

---

## DESIGN PRINCIPLES APPLIED

### Telegram Wallet Influence
- Card-based balance display
- Clean, minimal typography
- Focus on value/balance
- Trustworthy, professional aesthetic

### Apple Wallet Influence
- Card metaphor for balance
- List-based task presentation
- Clear visual hierarchy
- Generous whitespace
- Subtle, refined interactions

### Anti-Patterns Avoided
- ❌ No gamification elements (streaks, levels, badges)
- ❌ No flashy animations or celebrations
- ❌ No fake progress bars or loading states
- ❌ No dark patterns or urgency manipulation
- ❌ No crypto-trading interface vibes
- ❌ No complex dashboards or analytics overload

---

## RESPONSIVE BEHAVIOR

### Mobile (Primary - 375px width)
- Full layout as shown in wireframe
- 2x2 grid for primary actions
- Full-width cards with 16px margins

### Tablet (768px+ width)
- Primary actions could expand to 4-column row
- Cards maintain max-width (600px) centered
- Increased margins (24px)

### Desktop (1024px+ width)
- Constrained to mobile width (375-414px) centered
- OR expand to tablet layout with side navigation
- Telegram Mini Apps typically stay mobile-width

---

## ACCESSIBILITY CONSIDERATIONS

### Visual
- High contrast text (WCAG AA minimum)
- Minimum 44x44px touch targets
- Clear focus states for keyboard navigation

### Screen Readers
- Semantic HTML structure
- ARIA labels for icons
- Live regions for balance updates

### Motion
- Respects prefers-reduced-motion
- No auto-playing animations
- Subtle transitions only

---

## NEXT STEPS (Post-Wireframe)

1. **User Testing**: Validate information hierarchy with 5-10 users
2. **Content Strategy**: Define copy for all labels and empty states
3. **Visual Design**: Apply color palette and typography system
4. **Prototype**: Create interactive prototype for flow testing
5. **Technical Spec**: Document exact spacing, sizing, and behavior

---

## SUCCESS METRICS

### Primary
- Time to first task completion < 10 seconds
- Balance visibility 100% (always in viewport)
- Task completion rate > 40%

### Secondary
- Daily active users (DAU)
- Average session duration
- Earning method distribution (which methods users prefer)

---

*Wireframe Version 1.0*
*Created: 2026-07-18*
*Status: Ready for Review*