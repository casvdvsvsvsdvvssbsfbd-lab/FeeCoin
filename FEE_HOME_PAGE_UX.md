# FEE - Home Page UX
## Perfect Information Architecture & User Experience

---

## CORE UX MISSION

**Answer 6 questions in 3 seconds**:
1. Who am I?
2. How many FC do I have?
3. What should I do now?
4. Where do I earn more?
5. What is happening today?
6. What reward can I claim?

**Inspired by**: Apple Wallet (card-based balance) + Telegram Wallet (clean, minimal, fast)

---

## EYE MOVEMENT PATTERN

### The F-Pattern Scan (Nielsen Norman Group)
Users scan in an F-pattern:
1. Horizontal movement across top (header)
2. Horizontal movement across middle (balance)
3. Vertical movement down left side (content)

**Fee Home Page Optimization**:
```
┌─────────────────────────────────────┐
│ ≡ Fee                      ⚙️      │ ← 1. Quick brand scan (200ms)
├─────────────────────────────────────┤
│ ┌─────────────────────────────┐    │
│ │ Your Balance                │    │ ← 2. Balance scan (500ms) - PRIMARY
│ │ 12,450 FC                   │    │
│ │ ≈ $124.50 USD               │    │
│ └─────────────────────────────┘    │
│                                     │
│ Earn FC                             │ ← 3. Actions scan (500ms) - SECONDARY
│ ┌──────────┐ ┌──────────┐         │
│ │ Watch Ads│ │ Complete │         │
│ ├──────────┤ ├──────────┤         │
│ │ Install  │ │ Refer    │         │
│ │ Apps     │ │ Friends  │         │
│ └──────────┘ └──────────┘         │
│                                     │
│ Available Now                       │ ← 4. Opportunities scan (800ms)
│ ▸ Watch Video Ad                    │
│ ▸ Complete Survey                   │
│ ▸ Install App: GameX                │
│                                     │
│ Recent Activity                     │ ← 5. Social proof (800ms)
│ ✓ Watched Ad               +50 FC  │
│ ✓ Completed Survey         +100 FC │
│                                     │
├─────────────────────────────────────┤
│ 🏠 Home    📊 Stats    👤 Profile  │ ← 6. Navigation (always visible)
└─────────────────────────────────────┘

Total scan time: ~3 seconds
```

---

## COMPLETE HOME PAGE UX SPECIFICATION

### SECTION 1: HEADER (56px height)
**Position**: Top of screen, fixed
**Scan Time**: 200ms

#### What It Displays
- **Left**: Hamburger menu icon (≡) - 44x44px touch target
- **Center**: "Fee" - App name, 18px, Semibold
- **Right**: Settings icon (⚙️) - 44x44px touch target

#### Why It Exists
1. **Brand Recognition**: "Fee" confirms user is in the right app (200ms)
2. **Navigation Access**: Menu provides access to FAQ, Support, Terms, Logout
3. **Settings Access**: Quick path to notifications, language, currency display

#### User Questions Answered
- ❌ "Who am I?" - NOT answered here (too early, user doesn't care yet)
- ✅ "Where am I?" - "I'm in Fee" (brand confirmation)

#### Eye Movement
- User glances at center: "Fee" (brand confirmation)
- User doesn't interact unless needed (menu/settings are secondary)

#### Interaction
- **≡ Menu**: Opens side drawer (FAQ, Support, Terms, Logout)
- **⚙️ Settings**: Opens settings screen (notifications, currency, language)
- **No other interaction**: Header is read-only

#### Why This Placement
- Standard mobile app pattern (users expect it)
- Doesn't compete with balance (below)
- Always accessible (fixed position)

---

### SECTION 2: BALANCE CARD (180px height)
**Position**: Top of content, full width with 16px margins
**Scan Time**: 500ms
**Priority**: ⭐⭐⭐⭐⭐ (HIGHEST)

#### What It Displays
```
┌─────────────────────────────────────┐
│ Your Balance                        │ ← Overline, 11px, Medium, Neutral 500
│                                     │
│ 12,450 FC                           │ ← H1, 24px, Semibold, Neutral 900
│                                     │
│ ≈ $124.50 USD                       │ ← Caption, 13px, Regular, Neutral 500
│                                     │
│ Updated 2 min ago                   │ ← Overline, 11px, Medium, Neutral 400
└─────────────────────────────────────┘
```

**Visual Treatment**:
- Background: White
- Border Radius: 12px
- Padding: 16px
- Border: 1px solid Neutral 200 (subtle)
- NO shadow (keeps it flat, minimal)
- NO gradient (keeps it simple)

#### Why It Exists
1. **Primary Motivation**: Users open Fee to check their balance (like checking bank account)
2. **Single Source of Truth**: One place to see FC and USD value
3. **Emotional Connection**: Balance represents time, effort, value
4. **Trust Building**: Transparent, always visible, never hidden

#### User Questions Answered
- ✅ "How many FC do I have?" - "12,450 FC" (BIG, BOLD, IMMEDIATE)
- ✅ "What is my FC worth?" - "≈ $124.50 USD" (context, muted)

#### Eye Movement
1. User opens app → Eyes go directly to balance (F-pattern, top-left to top-right)
2. User reads "Your Balance" (label, small)
3. User reads "12,450 FC" (BIG, BOLD - PRIMARY FOCUS)
4. User reads "≈ $124.50 USD" (secondary, muted)
5. User reads "Updated 2 min ago" (tertiary, very muted)

**Total Time**: 500ms (instant recognition)

#### Interaction
- **Tap**: Navigates to Balance Detail screen
  - Shows: Current balance, pending earnings, next settlement, withdrawal threshold, transaction history
- **Long-press**: No action
- **Auto-update**: Balance updates in real-time via WebSocket (no manual refresh needed)

#### Why This Placement
- **First thing users see** (F-pattern scanning)
- **Reinforces purpose immediately** (this is where I see my earnings)
- **Creates motivation** (balance grows = progress)
- **Apple Wallet pattern** (card-based balance display)

#### Accessibility
- Screen reader: "Your balance: 12,450 FC, approximately 124 dollars and 50 cents"
- High contrast: Neutral 900 on white (14.7:1 ratio)
- Touch target: Entire card is tappable (minimum 44x44px)

---

### SECTION 3: PRIMARY ACTIONS GRID (120px height)
**Position**: Below balance card, full width with 16px margins
**Scan Time**: 500ms
**Priority**: ⭐⭐⭐⭐⭐ (HIGHEST)

#### What It Displays
```
Earn FC ← Section label, 11px, Overline, Neutral 500

┌──────────────┐ ┌──────────────┐
│              │ │              │
│  ▶ Watch Ads │ │  ✓ Complete  │ ← Icon (24x24px) + Label (15px, Medium)
│              │ │   Tasks      │
│ 10-50 FC     │ │ Surveys,     │ ← Caption (13px, Regular, Neutral 500)
│              │ │ offers, more │
└──────────────┘ └──────────────┘
┌──────────────┐ ┌──────────────┐
│              │ │              │
│  ↓ Install   │ │  👤 Refer    │
│   Apps       │ │   Friends    │
│              │ │              │
│ Try new apps │ │ Earn 500 FC  │
│  earn FC     │ │ per referral │
└──────────────┘ └──────────────┘
```

**Visual Treatment**:
- 2x2 grid layout
- Each button: 48px height, equal width
- Background: White
- Border: 1px solid Neutral 200
- Border Radius: 8px
- Icon: 24x24px, left side
- Label: 15px, Medium (500), Neutral 800
- Caption: 13px, Regular (400), Neutral 500
- NO shadow (flat design)
- NO gradient

#### Why It Exists
1. **Clear Entry Points**: 4 clear paths to earning (reduces cognitive load)
2. **User Mental Model**: "How do I earn?" → "I can watch ads, complete tasks, install apps, or refer friends"
3. **Equal Weight**: All methods are equally important (no hierarchy among them)
4. **Quick Scanning**: Grid layout allows fast visual scan

#### User Questions Answered
- ✅ "What should I do now?" - "Watch Ads, Complete Tasks, Install Apps, or Refer Friends"
- ✅ "Where do I earn more?" - All 4 earning methods displayed

#### Eye Movement
1. User reads "Earn FC" label (overline, small)
2. User scans 2x2 grid (left-to-right, top-to-bottom)
3. User reads each button: Icon + Label + Caption
4. User decides which action to take

**Total Time**: 500ms (quick scan)

#### Interaction
- **Watch Ads**: Navigates to Ad Player or Ad Queue
- **Complete Tasks**: Navigates to Task List (surveys, offers, daily)
- **Install Apps**: Navigates to App Offers
- **Refer Friends**: Navigates to Referral Dashboard

**No long-press**: No additional actions
**No badges**: No notification dots (keeps it minimal)
**No hover states**: Mobile-only design

#### Why This Placement
- **Secondary hierarchy** (after balance)
- **Clear paths to value** (users know how to earn)
- **Grid layout** (easy to scan, equal weight)
- **Below balance** (balance first, then actions)

#### Accessibility
- Screen reader: "Watch Ads, Earn 10-50 FC per ad, button"
- Touch target: 48x48px minimum (exceeds 44x44px requirement)
- High contrast: Neutral 800 on white (12.6:1 ratio)

---

### SECTION 4: AVAILABLE NOW (Flexible height, scrollable)
**Position**: Below primary actions, full width with 16px margins
**Scan Time**: 800ms
**Priority**: ⭐⭐⭐⭐ (HIGH)

#### What It Displays
```
Available Now ← Section label, 11px, Overline, Neutral 500

▸ Watch Video Ad                     ← Icon (16x16px) + Title (15px, Regular)
  Earn 50 FC · 30 seconds            ← Caption (13px, Regular, Neutral 500)

▸ Complete Survey                    ← Icon (16x16px) + Title (15px, Regular)
  Earn 100 FC · 2 minutes            ← Caption (13px, Regular, Neutral 500)

▸ Install App: GameX                 ← Icon (16x16px) + Title (15px, Regular)
  Earn 200 FC · Reach level 3        ← Caption (13px, Regular, Neutral 500)

▸ Daily Bonus                        ← Icon (16x16px) + Title (15px, Regular)
  Earn 25 FC · Available now         ← Caption (13px, Regular, Neutral 500)
```

**Visual Treatment**:
- List of task cards
- Each card: 56px minimum height
- Background: White
- Border Bottom: 1px solid Neutral 200
- Icon: 16x16px, left side (task type icon)
- Title: 15px, Regular (400), Neutral 800
- Caption: 13px, Regular (400), Neutral 500
- NO shadow
- NO border radius (flat list)

**Task Icons**:
- Watch Video Ad: Play icon (▶)
- Complete Survey: Checkmark icon (✓)
- Install App: Download icon (↓)
- Daily Bonus: Gift icon (🎁)

#### Why It Exists
1. **Immediate Opportunities**: Shows what users can earn RIGHT NOW
2. **Personalized Feed**: Tasks are curated for user (based on profile, history)
3. **Gentle Urgency**: "Available Now" creates motivation without "LIMITED TIME!!!" 
4. **Reduces Decision Fatigue**: Users don't have to search for tasks

#### User Questions Answered
- ✅ "What is happening today?" - "Here are the tasks available right now"
- ✅ "What reward can I claim?" - "You can earn 50 FC, 100 FC, 200 FC, 25 FC"

#### Eye Movement
1. User reads "Available Now" label (overline, small)
2. User scans list top-to-bottom (vertical scan)
3. User reads each task: Icon + Title + Caption
4. User identifies interesting task
5. User taps task to start

**Total Time**: 800ms (scan 3-4 tasks)

#### Interaction
- **Tap task**: Navigates to Task Detail or directly to task flow
  - Ad → Ad Player
  - Survey → Survey form
  - App Install → App Store link
  - Daily Bonus → One-tap claim
- **Pull-to-refresh**: Updates task list (new tasks appear)
- **Swipe left**: Optional - dismiss/skip task (not recommended, keep it simple)

**Task Detail Screen** (if shown):
- Shows full task description
- Shows exact reward amount
- Shows requirements
- Shows time estimate
- "Start" button

#### Why This Placement
- **Tertiary hierarchy** (after balance and actions)
- **Scrollable** (accommodates variable number of tasks)
- **Clear "now" framing** (Available Now = immediate action)
- **Below actions** (actions are categories, this is specific tasks)

#### Empty State
```
Available Now

No tasks available right now.
Check back soon for new opportunities.
```

**Why**: Manages expectations, reduces confusion

#### Accessibility
- Screen reader: "Available Now, Watch Video Ad, Earn 50 FC, 30 seconds, button"
- Touch target: Entire row is tappable (minimum 44x44px)
- High contrast: Neutral 800 on white (12.6:1 ratio)

---

### SECTION 5: RECENT ACTIVITY (Flexible height, scrollable)
**Position**: Below Available Now, full width with 16px margins
**Scan Time**: 800ms
**Priority**: ⭐⭐⭐ (MEDIUM)

#### What It Displays
```
Recent Activity ← Section label, 11px, Overline, Neutral 500

✓ Watched Ad                 +50 FC  ← Icon + Action + Reward (right-aligned)
  2 minutes ago                       ← Timestamp (13px, Caption, Neutral 400)

✓ Completed Survey           +100 FC ← Icon + Action + Reward (right-aligned)
  1 hour ago                          ← Timestamp (13px, Caption, Neutral 400)

✓ Referral Bonus             +500 FC ← Icon + Action + Reward (right-aligned)
  3 hours ago                         ← Timestamp (13px, Caption, Neutral 400)

✓ Daily Bonus                +25 FC  ← Icon + Action + Reward (right-aligned)
  1 day ago                           ← Timestamp (13px, Caption, Neutral 400)
```

**Visual Treatment**:
- List of activity items
- Each item: 56px minimum height
- Background: White
- Border Bottom: 1px solid Neutral 200
- Icon: 16x16px, left side (checkmark for completed tasks)
- Action: 15px, Regular (400), Neutral 800
- Reward: 15px, Medium (500), Neutral 900, right-aligned
- Timestamp: 13px, Regular (400), Neutral 400, below action

**Activity Icons**:
- Watched Ad: Play icon (▶)
- Completed Survey: Checkmark icon (✓)
- Referral Bonus: Person icon (👤)
- Daily Bonus: Gift icon (🎁)
- Withdrawal: Arrow up icon (↑)

#### Why It Exists
1. **Social Proof**: Shows that the system works (others are earning)
2. **Validation**: Confirms user's own earnings (reinforces trust)
3. **Momentum**: Shows recent activity (creates FOMO - "I should earn more")
4. **Transparency**: Every FC movement is visible (no hidden transactions)

#### User Questions Answered
- ✅ "What is happening today?" - "I watched an ad 2 minutes ago, completed a survey 1 hour ago"
- ✅ "What reward can I claim?" - "I've earned 50 FC, 100 FC, 500 FC, 25 FC recently"

#### Eye Movement
1. User reads "Recent Activity" label (overline, small)
2. User scans list top-to-bottom (vertical scan)
3. User reads most recent activity (top item)
4. User may scan older activities (1-2 more items)
5. User doesn't tap (read-only, no navigation)

**Total Time**: 800ms (scan 3-4 recent activities)

#### Interaction
- **Tap**: No navigation (read-only)
- **Long-press**: No action
- **Pull-to-refresh**: Updates activity feed (new activities appear)

**No navigation**: This is a read-only section (users don't need to do anything)

#### Why This Placement
- **Quaternary hierarchy** (after balance, actions, opportunities)
- **Scrollable** (accommodates variable number of activities)
- **Below Available Now** (opportunities first, then social proof)
- **Read-only** (no action required, just information)

#### Empty State
```
Recent Activity

Your recent earnings will appear here.
Start completing tasks to build your history.
```

**Why**: Manages expectations, guides users to take action

#### Accessibility
- Screen reader: "Recent Activity, Watched Ad, plus 50 FC, 2 minutes ago"
- Touch target: N/A (read-only, no interaction)
- High contrast: Neutral 800 on white (12.6:1 ratio)

---

### SECTION 6: BOTTOM NAVIGATION (60px height)
**Position**: Bottom of screen, fixed
**Scan Time**: Always visible
**Priority**: ⭐⭐⭐⭐⭐ (HIGHEST)

#### What It Displays
```
┌─────────────────────────────────────┐
│ 🏠 Home    📊 Stats    👤 Profile  │
└─────────────────────────────────────┘
```

**Visual Treatment**:
- Height: 60px
- Background: White
- Border Top: 1px solid Neutral 200
- 3 tabs, equal width
- Icon: 24x24px
- Label: 11px, Medium (500), below icon
- Spacing: 8px between icon and label

**Active State (Home)**:
- Icon: Primary color
- Label: Primary color, Medium (500)

**Inactive State (Stats, Profile)**:
- Icon: Neutral 400
- Label: Neutral 400, Medium (500)

#### Why It Exists
1. **Primary Navigation**: Users can switch between main screens
2. **Always Accessible**: Fixed position, never hidden
3. **Clear Hierarchy**: Home is primary (active), Stats and Profile are secondary
4. **Telegram Pattern**: Standard Telegram Mini App navigation

#### User Questions Answered
- ✅ "Where can I go?" - "Home, Stats, Profile"
- ✅ "Where am I?" - "Home" (active tab is highlighted)

#### Eye Movement
- User doesn't scan bottom nav (it's always visible, peripheral vision)
- User taps when needed (intentional action)

**Total Time**: N/A (always visible, not scanned)

#### Interaction
- **Home**: Current screen (no action)
- **Stats**: Navigates to Stats screen (earnings charts, metrics)
- **Profile**: Navigates to Profile screen (settings, withdrawal history, support)

**No swipe gestures**: Keeps it simple (tap only)

#### Why This Placement
- **Thumb-friendly zone**: Bottom of screen (easy to reach)
- **Standard pattern**: Users expect bottom navigation
- **Always visible**: No hidden navigation (users always know where they are)
- **3 tabs max**: Keeps it simple (no more than 3)

#### Accessibility
- Screen reader: "Home tab, active", "Stats tab", "Profile tab"
- Touch target: Entire tab is tappable (minimum 44x44px)
- High contrast: Primary color or Neutral 400 on white

---

## COMPLETE USER SCENARIO

### Scenario: User Opens Fee for the First Time

**Time: 0:00 - 0:03 (3 seconds)**

```
┌─────────────────────────────────────┐
│ ≡ Fee                      ⚙️      │ ← 0:00-0:02: User sees "Fee" (brand)
├─────────────────────────────────────┤
│ ┌─────────────────────────────┐    │
│ │ Your Balance                │    │ ← 0:02-0:03: User sees "Your Balance"
│ │ 0 FC                        │    │ ← 0:03-0:05: User sees "0 FC" (starting balance)
│ │ ≈ $0.00 USD                 │    │
│ └─────────────────────────────┘    │
│                                     │
│ Earn FC                             │
│ ┌──────────┐ ┌──────────┐         │
│ │ Watch Ads│ │ Complete │         │ ← 0:05-0:08: User scans actions
│ ├──────────┤ ├──────────┤         │
│ │ Install  │ │ Refer    │         │
│ │ Apps     │ │ Friends  │         │
│ └──────────┘ └──────────┘         │
│                                     │
│ Available Now                       │
│ ▸ Watch Video Ad                    │ ← 0:08-0:10: User sees "Welcome Bonus"
│   Earn 100 FC · 30 seconds         │
│                                     │
│ Recent Activity                     │
│                                     │ ← 0:10-0:12: User sees empty state
└─────────────────────────────────────┘
```

**User's Internal Monologue**:
- "I'm in Fee" (0:02)
- "I have 0 FC" (0:05)
- "I can earn FC by watching ads, completing tasks, installing apps, or referring friends" (0:08)
- "I can watch a video ad to earn 100 FC" (0:10)
- "Let me tap that" (0:12)

**Action**: User taps "Watch Video Ad" task

---

## SECTION PRIORITIZATION

### Priority 1: Balance Card (⭐⭐⭐⭐⭐)
**Why**: User's primary motivation
**When**: Always visible, first thing users see
**Action**: Tap to see details

### Priority 2: Primary Actions Grid (⭐⭐⭐⭐⭐)
**Why**: Clear paths to earning
**When**: Always visible, second thing users see
**Action**: Tap to start earning

### Priority 3: Bottom Navigation (⭐⭐⭐⭐⭐)
**Why**: Primary navigation
**When**: Always visible
**Action**: Tap to switch screens

### Priority 4: Available Now (⭐⭐⭐⭐)
**Why**: Immediate opportunities
**When**: Scrollable, third section
**Action**: Tap to start task

### Priority 5: Recent Activity (⭐⭐⭐)
**Why**: Social proof
**When**: Scrollable, fourth section
**Action**: Read-only (no action)

---

## INFORMATION HIERARCHY

### Visual Hierarchy (Top to Bottom)

**1. Balance Card (Largest, Boldest)**
- Size: 24px, Semibold
- Color: Neutral 900 (highest contrast)
- Purpose: Primary focus

**2. Primary Actions (Medium, Clear)**
- Size: 15px, Medium
- Color: Neutral 800
- Purpose: Secondary focus

**3. Available Now (Standard, Muted)**
- Size: 15px, Regular
- Color: Neutral 800
- Purpose: Tertiary focus

**4. Recent Activity (Standard, Muted)**
- Size: 15px, Regular
- Color: Neutral 800
- Purpose: Quaternary focus

**5. Metadata (Smallest, Most Muted)**
- Size: 13px, Regular
- Color: Neutral 500
- Purpose: Supporting information

---

## UX PRINCIPLES APPLIED

### 1. Frictionless Entry
- Zero barriers: User sees balance immediately
- No login required (Telegram auth is invisible)
- First task is visible ("Welcome Bonus")

### 2. Immediate Feedback
- Balance is always visible (no loading)
- Task list updates in real-time
- Activity feed shows recent actions

### 3. Clear Expectations
- Users know what they'll earn before starting (task caption shows reward)
- Users know when they can withdraw (Balance Detail shows settlement date)
- No hidden requirements

### 4. Respectful Design
- No dark patterns (no fake urgency)
- No gamification (no streaks, levels, celebrations)
- No manipulative language

### 5. Error Recovery
- Empty states guide users ("No tasks available, check back soon")
- Error states provide clear next steps ("Retry" or "Go Home")
- No dead ends

---

## COMPARISON: APPLE WALLET vs. TELEGRAM WALLET vs. FEE

### Apple Wallet
- **Balance**: Card-based, top of screen
- **Actions**: None (passive)
- **Content**: Passes list (cards, tickets)
- **Pattern**: Card-based, minimal

### Telegram Wallet
- **Balance**: Card-based, top of screen
- **Actions**: Send, Request, Swap (3 primary actions)
- **Content**: Transaction history
- **Pattern**: Clean, minimal, fast

### Fee
- **Balance**: Card-based, top of screen ✅
- **Actions**: 4 primary actions (Watch Ads, Complete Tasks, Install Apps, Refer Friends) ✅
- **Content**: Available tasks + Recent activity ✅
- **Pattern**: Card-based, minimal, transparent ✅

**Fee follows both patterns**:
- Apple Wallet: Card-based balance display
- Telegram Wallet: Clean, minimal, fast UX

---

## RESPONSIVE BEHAVIOR

### Mobile (375px) - Primary
- Full-width cards (100% - 32px)
- 2x2 grid for primary actions
- Full-width list items
- Bottom navigation: 3 tabs

### Tablet (768px)
- Cards centered, max-width 600px
- Primary actions: 4-column row (optional, keeps 2x2 for consistency)
- List items: Max-width 600px, centered
- Bottom navigation: 3 tabs (same as mobile)

### Desktop (1024px+)
- Constrained to mobile width (375-414px), centered
- OR expand to tablet layout with side navigation (future)
- Telegram Mini Apps typically stay mobile-width

---

## ACCESSIBILITY CHECKLIST

### Visual
- [x] Balance card: 14.7:1 contrast (Neutral 900 on white)
- [x] Primary text: 12.6:1 contrast (Neutral 800 on white)
- [x] Secondary text: 7.2:1 contrast (Neutral 500 on white)
- [x] Caption text: 4.6:1 contrast (Neutral 400 on white) - WCAG AA compliant

### Motor
- [x] All touch targets: 44x44px minimum (exceeds requirement)
- [x] Primary actions: 48x48px (recommended size)
- [x] Spacing: 8px minimum between touch targets

### Cognitive
- [x] Simple language: No jargon
- [x] Clear labels: "Watch Ads", "Complete Tasks"
- [x] Consistent patterns: Same layout across screens
- [x] No surprises: Clear expectations

### Screen Reader
- [x] Semantic headings: H1, H2, H3
- [x] ARIA labels: All icons and buttons
- [x] Live regions: Balance updates, new tasks
- [x] Descriptive text: "Your balance: 12,450 FC"

---

## PERFORMANCE OPTIMIZATION

### Load Time
- **Target**: < 2 seconds (Telegram Mini App requirement)
- **Balance**: Cached for 30 seconds (Redis)
- **Tasks**: Cached for 5 minutes (Redis)
- **Activity**: Cached for 1 minute (Redis)

### Perceived Performance
- **Skeleton screens**: Show structure while loading
- **Optimistic UI**: Update balance immediately, verify in background
- **Progressive loading**: Load critical content first (balance), then tasks, then activity

### Animation Performance
- **Balance update**: 500ms (subtle, not distracting)
- **Button tap**: 150ms (tactile feedback)
- **Page transition**: 200ms (smooth, fast)
- **No heavy animations**: Keeps it performant

---

## USABILITY TESTING CHECKLIST

### First-Time User
- [ ] User can find balance within 2 seconds
- [ ] User understands what FC is (from onboarding)
- [ ] User can identify how to earn (primary actions)
- [ ] User can start first task within 10 seconds

### Returning User
- [ ] User can check balance in < 2 seconds
- [ ] User can find available tasks in < 3 seconds
- [ ] User can complete a task in < 30 seconds
- [ ] User can navigate to Stats or Profile in < 2 seconds

### Accessibility
- [ ] Screen reader user can navigate entire Home screen
- [ ] Keyboard user can access all interactive elements
- [ ] User with color blindness can distinguish elements
- [ ] User with motor impairments can tap all buttons

---

## SUCCESS METRICS

### Time to First Task
- **Target**: < 10 seconds (from app open to task start)
- **Current**: ~12 seconds (balance scan 3s + actions scan 3s + task selection 6s)
- **Optimization**: Pre-highlight first task (reduces selection time)

### Balance Visibility
- **Target**: 100% (always in viewport)
- **Current**: 100% (fixed position, always visible)

### Task Discovery
- **Target**: 90% of users find a task within 5 seconds
- **Current**: ~8 seconds (scan balance 3s + scan actions 3s + scan tasks 2s)

### User Satisfaction
- **Target**: 4.5/5 app store rating
- **Target**: < 2% support ticket rate
- **Target**: > 40% DAU/MAU ratio

---

## CONCLUSION

The Fee Home Page is designed to answer 6 critical questions in 3 seconds:

1. **Who am I?** - "Fee" (header, brand confirmation)
2. **How many FC do I have?** - "12,450 FC" (balance card, PRIMARY)
3. **What should I do now?** - "Watch Ads, Complete Tasks, Install Apps, Refer Friends" (primary actions)
4. **Where do I earn more?** - Same as above (primary actions)
5. **What is happening today?** - "Available Now" list (immediate opportunities)
6. **What reward can I claim?** - "Recent Activity" list (recent earnings)

**Eye Movement**: F-pattern scan (header → balance → actions → content → navigation)

**Design Philosophy**: Apple Wallet (card-based balance) + Telegram Wallet (clean, minimal, fast)

**Key Principles**:
- Balance first (motivation)
- Actions second (how to earn)
- Opportunities third (what's available)
- Activity fourth (social proof)
- Navigation always visible

**No gaming aesthetics. No crypto casino vibes. No dashboard complexity. Just clean, minimal, transparent UX.**

---

*Home Page UX Version 1.0*
*Created: 2026-07-18*
*Status: Ready for Visual Design*
*Next Step: Component Design*