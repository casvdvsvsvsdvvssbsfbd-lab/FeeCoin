# FEE - User Experience Flows
## Complete Interaction Design & Behavioral Specifications

---

## UX PHILOSOPHY

**Inspired by**: Telegram's frictionless UX + Apple's thoughtful interactions + Stripe's clarity
**Principle**: Every interaction should feel inevitable, not surprising
**Pattern**: Progressive disclosure - show only what's needed, when it's needed

---

## CORE UX PRINCIPLES

### 1. Frictionless Entry
- Zero barriers to first task completion
- No email, no password, no verification
- Telegram authentication is invisible

### 2. Immediate Feedback
- Balance updates in real-time (WebSocket)
- Task completion confirmed within 1 second
- No "processing" states longer than 2 seconds

### 3. Clear Expectations
- Users always know what they'll earn before starting
- Users always know when they can withdraw
- No hidden requirements or surprise limitations

### 4. Respectful Design
- No dark patterns (fake urgency, countdown timers)
- No gamification tricks (streaks, levels, celebrations)
- No manipulative language ("you're almost there!")

### 5. Error Recovery
- Every error has a clear path forward
- No dead ends
- No "something went wrong" without explanation

---

## COMPLETE UX FLOW LIBRARY

### Flow 1: First-Time User Onboarding
**Trigger**: User opens Fee for the first time
**Duration**: 30 seconds maximum
**Success Metric**: 90% completion rate

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Splash Screen (2 seconds)                          │
│ - App name "Fee" displayed                                  │
│ - Subtle spinner                                            │
│ - No interaction possible                                   │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Language Selection (10 seconds)                     │
│ - Auto-detects from Telegram locale                         │
│ - Pre-selects user's language                               │
│ - User can change if needed                                 │
│ - "Continue" button (full width, bottom)                    │
│                                                             │
│ INTERACTION: Tap "Continue"                                 │
│ FEEDBACK: Smooth transition to onboarding                   │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Onboarding Screen 1 (10 seconds)                    │
│ - Swipeable carousel                                        │
│ - "Earn FC for completing tasks"                            │
│ - 1/3 indicator dots                                        │
│                                                             │
│ INTERACTION: Swipe left OR tap "Next" (if added)            │
│ FEEDBACK: Smooth slide transition                           │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Onboarding Screen 2 (10 seconds)                    │
│ - "Your balance grows in real-time"                         │
│ - 2/3 indicator dots                                        │
│                                                             │
│ INTERACTION: Swipe left                                     │
│ FEEDBACK: Smooth slide transition                           │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 5: Onboarding Screen 3 (10 seconds)                    │
│ - "Withdraw during settlement"                              │
│ - "Get Started" button (replaces dots)                      │
│                                                             │
│ INTERACTION: Tap "Get Started"                              │
│ FEEDBACK: Smooth transition to Home                         │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 6: Home Screen (immediate)                             │
│ - Balance shows: 0 FC                                       │
│ - "Welcome Bonus" task appears in "Available Now"           │
│ - First task is pre-highlighted (subtle animation)          │
│                                                             │
│ INTERACTION: User taps "Welcome Bonus"                      │
│ FEEDBACK: Navigates to task flow                            │
└─────────────────────────────────────────────────────────────┘
```

**Key UX Decisions**:
- No skip button (onboarding is fast, educational)
- No "back" button (linear flow, no reason to go back)
- Swipe gesture for carousel (intuitive, Telegram-native)
- First task appears immediately (no waiting)

---

### Flow 2: Complete First Task (Watch Ad)
**Trigger**: User taps "Welcome Bonus" or any ad task
**Duration**: 30-60 seconds
**Success Metric**: 80% completion rate

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Task Detail Screen (5 seconds)                      │
│ - Shows: "Watch this 30-second video to earn 100 FC"        │
│ - Reward: "100 FC (≈ $1.00 USD)"                            │
│ - Requirements: "Must watch entire video"                   │
│ - "Start" button (full width, bottom)                       │
│                                                             │
│ INTERACTION: Tap "Start"                                    │
│ FEEDBACK: Smooth transition to ad player                    │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Ad Player (30 seconds)                              │
│ - Full-screen video                                         │
│ - Countdown timer: "30 seconds remaining" (top right)       │
│ - Progress bar: [████████████████████████] 100%             │
│ - No controls (no pause, no fullscreen)                     │
│                                                             │
│ INTERACTION: None (passive watching)                        │
│ FEEDBACK: Video plays, timer counts down                    │
│                                                             │
│ ERROR STATE: Ad fails to load                               │
│ - "Ad Unavailable" message                                  │
│ - "Try another task" button → Home                          │
│ - "Retry" button → Reloads ad                               │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Completion Screen (3 seconds)                       │
│ - Checkmark icon (center)                                   │
│ - "Ad Completed"                                            │
│ - "+100 FC" (subtle animation, not flashy)                  │
│ - "Claim" button (full width, bottom)                       │
│                                                             │
│ INTERACTION: Tap "Claim" OR wait 3 seconds (auto-advance)   │
│ FEEDBACK: Balance updates in real-time                      │
│           Smooth transition back to Home                    │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Home Screen (return)                                │
│ - Balance Card updates: "100 FC"                            │
│ - "Welcome Bonus" removed from "Available Now"              │
│ - "Recent Activity" shows: "✓ Watched Ad +100 FC · Just now"│
│ - Subtle toast notification: "You earned 100 FC"            │
│                                                             │
│ INTERACTION: User can continue browsing or complete tasks    │
│ FEEDBACK: Immediate visual confirmation                      │
└─────────────────────────────────────────────────────────────┘
```

**Key UX Decisions**:
- Task detail screen sets expectations (no surprises)
- Ad player is full-screen (no distractions)
- No skip button during ad (ensures advertiser gets view)
- Auto-advance after 3 seconds (reduces friction)
- Balance updates immediately (real-time feedback)

---

### Flow 3: Complete Survey Task
**Trigger**: User taps survey task from "Available Now" or "Complete Tasks"
**Duration**: 2-5 minutes
**Success Metric**: 60% completion rate

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Task Detail Screen (5 seconds)                      │
│ - "Complete Survey: Shopping Habits"                        │
│ - "Earn 100 FC (≈ $1.00 USD)"                              │
│ - "Takes about 2 minutes"                                   │
│ - "Requirements: Must complete all questions"               │
│ - "Start" button                                            │
│                                                             │
│ INTERACTION: Tap "Start"                                    │
│ FEEDBACK: Navigates to survey                               │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Survey Flow (2-5 minutes)                           │
│ - In-app form OR external browser (configurable)            │
│ - Progress indicator: "Question 3 of 5"                     │
│ - One question per screen (reduces cognitive load)          │
│ - "Next" and "Back" buttons                                 │
│                                                             │
│ INTERACTION: Answer questions, tap "Next"                   │
│ FEEDBACK: Smooth transition between questions               │
│                                                             │
│ ERROR STATE: User closes browser/external app               │
│ - "Survey Incomplete" message                               │
│ - "Resume" button → Returns to survey                       │
│ - "Abandon" button → No FC awarded, returns to Home         │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Completion Screen (3 seconds)                       │
│ - "Survey Completed"                                        │
│ - "+100 FC"                                                 │
│ - "Claim" button                                            │
│                                                             │
│ INTERACTION: Tap "Claim" OR wait 3 seconds                  │
│ FEEDBACK: Balance updates, returns to Home                  │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Home Screen (return)                                │
│ - Balance updated                                           │
│ - Activity feed shows completion                            │
│ - Survey task removed from "Available Now"                  │
└─────────────────────────────────────────────────────────────┘
```

**Key UX Decisions**:
- One question per screen (reduces overwhelm)
- Progress indicator (shows advancement)
- Resume option if user leaves (reduces frustration)
- No time pressure (users can take their time)

---

### Flow 4: Install App Task
**Trigger**: User taps app install task
**Duration**: 2-10 minutes (includes app store time)
**Success Metric**: 50% completion rate (lower due to external dependency)

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Task Detail Screen (5 seconds)                      │
│ - "Install GameX and reach level 3"                         │
│ - "Earn 200 FC (≈ $2.00 USD)"                              │
│ - "Requirements: Install app, complete tutorial, reach L3"  │
│ - "Start" button                                            │
│                                                             │
│ INTERACTION: Tap "Start"                                    │
│ FEEDBACK: Redirects to App Store/Play Store                 │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: External App Store (user action)                    │
│ - User installs app                                         │
│ - User opens app                                            │
│ - User completes tutorial/level 3                           │
│ - User returns to Fee (via deep link or manual)             │
│                                                             │
│ INTERACTION: User actions in external app                   │
│ FEEDBACK: None (external to Fee)                            │
│                                                             │
│ ERROR STATE: User doesn't return to Fee                     │
│ - No action (user must manually return)                     │
│ - Progress saved, can claim later                           │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Return to Fee - Verification (5 seconds)            │
│ - Auto-verification screen (spinner)                        │
│ - "Verifying installation..."                               │
│ - Checks: App installed? Level 3 reached?                   │
│                                                             │
│ INTERACTION: None (automatic)                               │
│ FEEDBACK: Verification completes                            │
│                                                             │
│ ERROR STATE: Verification fails                             │
│ - "Verification Failed"                                     │
│ - "Make sure you've installed the app and reached level 3"  │
│ - "Retry" button → Re-verifies                              │
│ - "Cancel" button → Returns to Home, no FC awarded          │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Completion Screen (3 seconds)                       │
│ - "Task Completed"                                          │
│ - "+200 FC"                                                 │
│ - "Claim" button                                            │
│                                                             │
│ INTERACTION: Tap "Claim" OR wait 3 seconds                  │
│ FEEDBACK: Balance updates, returns to Home                  │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 5: Home Screen (return)                                │
│ - Balance updated                                           │
│ - Activity feed shows completion                            │
│ - App task removed from "Available Now"                     │
└─────────────────────────────────────────────────────────────┘
```

**Key UX Decisions**:
- Clear requirements before starting (no surprises)
- Deep link back to Fee (reduces friction)
- Auto-verification (no manual proof needed)
- Progress saved (users can complete later if needed)

---

### Flow 5: Refer a Friend
**Trigger**: User taps "Refer Friends" from Home
**Duration**: 30 seconds to share, days for reward
**Success Metric**: 20% of users refer at least 1 friend

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Referral Dashboard (immediate)                      │
│ - Header: "Refer Friends"                                   │
│ - Your Referral Code: "FEE-JOHN-2024"                       │
│   - Large, copyable text                                    │
│   - "Copy" button (right side)                              │
│ - Your Referral Link:                                       │
│   - "https://t.me/FeeBot?start=FEE-JOHN-2024"              │
│   - "Copy" and "Share" buttons                              │
│ - Your Referrals:                                           │
│   - "Total: 0"                                              │
│   - "Earned: 0 FC"                                          │
│ - Rewards info:                                             │
│   - "Earn 500 FC for each friend who completes first task"  │
│   - "Your friend also earns 500 FC"                         │
│                                                             │
│ INTERACTION: Tap "Copy" OR tap "Share"                      │
│ FEEDBACK: Toast notification "Copied to clipboard"          │
│           OR opens Telegram share sheet                     │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Share via Telegram (user action)                    │
│ - User selects contact/group                                │
│ - User sends message                                        │
│ - Friend receives link: "Join Fee and earn FC!"             │
│                                                             │
│ INTERACTION: User actions in Telegram                       │
│ FEEDBACK: None (external to Fee)                            │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Friend Completes First Task (days later)            │
│ - Friend opens link                                         │
│ - Friend connects Telegram                                  │
│ - Friend completes first task                               │
│                                                             │
│ INTERACTION: Friend actions                                 │
│ FEEDBACK: None (happens in background)                      │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Reward Notification (automatic)                     │
│ - Push notification: "Referral Reward"                      │
│ - "Your friend @username completed their first task"        │
│ - "You earned 500 FC"                                       │
│                                                             │
│ INTERACTION: User taps notification                         │
│ FEEDBACK: Opens Fee, shows updated balance                  │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 5: Referral Dashboard (updated)                        │
│ - Total Referrals: 1                                        │
│ - Total Earned: 500 FC                                      │
│ - Referral list shows:                                      │
│   - @username · Status: Rewarded · +500 FC                 │
│                                                             │
│ INTERACTION: User can share again or return to Home         │
│ FEEDBACK: Updated dashboard                                 │
└─────────────────────────────────────────────────────────────┘
```

**Key UX Decisions**:
- One-tap copy (reduces friction)
- Telegram share sheet (native, trusted)
- Clear reward explanation (transparency)
- Real-time status updates (trust)

---

### Flow 6: Withdraw FC
**Trigger**: User taps "Withdraw" during settlement period
**Duration**: 2 minutes
**Success Metric**: 70% completion rate (for users who start)

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Balance Detail → Withdraw Button                    │
│ - User navigates to Balance Detail                          │
│ - Sees "Withdraw" button (only during settlement)           │
│ - Button is prominent (full width, bottom)                  │
│                                                             │
│ INTERACTION: Tap "Withdraw"                                 │
│ FEEDBACK: Smooth transition to withdrawal flow              │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Withdrawal Amount (30 seconds)                      │
│ - Header: "Withdraw FC"                                     │
│ - Available: "12,450 FC"                                    │
│ - Minimum: "5,000 FC"                                       │
│ - Amount input:                                             │
│   - Pre-filled with max available                           │
│   - Slider + manual input                                   │
│   - Real-time USD conversion                                │
│ - Fee breakdown:                                            │
│   - "Withdrawal fee: 2% (200 FC)"                           │
│   - "You will receive: 9,800 FC (≈ $98.00 USD)"            │
│ - "Next" button                                             │
│                                                             │
│ INTERACTION: Adjust amount (optional) → Tap "Next"          │
│ FEEDBACK: Smooth transition to next screen                  │
│                                                             │
│ ERROR STATE: Insufficient balance                           │
│ - "You need 3,550 FC more"                                  │
│ - "Minimum withdrawal: 5,000 FC"                            │
│ - "Go Back" button → Balance Detail                         │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Select Payeer Account (20 seconds)                  │
│ - Header: "Select Payeer Account"                           │
│ - Saved Accounts (if any):                                  │
│   - Radio button list                                       │
│   - Shows: "P1000000000 (ending in 0000)"                   │
│ - Add New Account:                                          │
│   - Payeer ID input field                                   │
│   - "Save this account" checkbox                            │
│ - "Next" button                                             │
│                                                             │
│ INTERACTION: Select account OR enter new → Tap "Next"       │
│ FEEDBACK: Smooth transition to confirmation                 │
│                                                             │
│ ERROR STATE: Invalid Payeer ID                              │
│ - "Please enter a valid Payeer ID"                          │
│ - Input field highlighted                                   │
│ - "Next" button disabled until valid                        │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Confirm Withdrawal (20 seconds)                     │
│ - Header: "Confirm Withdrawal"                              │
│ - Summary:                                                  │
│   - Amount: 10,000 FC                                       │
│   - Fee: 200 FC                                             │
│   - You receive: 9,800 FC (≈ $98.00 USD)                   │
│   - To: P1000000000                                         │
│ - Terms:                                                    │
│   - "Withdrawals processed in 1-3 business days"            │
│   - "This action cannot be undone"                          │
│ - "Confirm Withdrawal" button (full width, bottom)          │
│                                                             │
│ INTERACTION: Tap "Confirm Withdrawal"                       │
│ FEEDBACK: Loading spinner (2 seconds)                       │
│           Success screen                                    │
│                                                             │
│ ERROR STATE: Settlement not open                            │
│ - "Withdrawals open on January 1, 2025"                     │
│ - "Next settlement in 15 days"                              │
│ - "Go Back" button → Balance Detail                         │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 5: Success Screen (3 seconds)                          │
│ - Checkmark icon (center)                                   │
│ - "Withdrawal Initiated"                                    │
│ - "You will receive $98.00 USD within 1-3 business days."   │
│ - "Next settlement: January 1, 2025"                        │
│ - "Done" button                                             │
│                                                             │
│ INTERACTION: Tap "Done" OR wait 3 seconds (auto-advance)    │
│ FEEDBACK: Returns to Home                                   │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 6: Home Screen (return)                                │
│ - Balance shows pending withdrawal: "12,450 FC (pending)"   │
│ - Activity feed shows: "✓ Withdrawal initiated -10,000 FC"  │
│ - Toast notification: "Withdrawal initiated"                │
└─────────────────────────────────────────────────────────────┘
```

**Key UX Decisions**:
- 3-step flow (not overwhelming)
- Clear fee breakdown (transparency)
- Pre-filled amount (reduces friction)
- Real-time USD conversion (clarity)
- Confirmation screen (prevents mistakes)
- Success state with timeline (manages expectations)

---

### Flow 7: Check Stats
**Trigger**: User taps "Stats" tab
**Duration**: Ongoing (browsing)
**Success Metric**: 30% of users visit Stats weekly

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Stats Screen (immediate)                            │
│ - Header: "Your Stats"                                      │
│ - Earnings Overview:                                        │
│   - Line chart (last 30 days)                               │
│   - Y-axis: FC, X-axis: Days                                │
│ - Earnings by Category:                                     │
│   - Pie chart: Ads | Tasks | Apps | Referrals               │
│ - Key Metrics:                                              │
│   - Total Earned: 12,450 FC (≈ $124.50 USD)                │
│   - Average per Day: 415 FC (≈ $4.15 USD)                  │
│   - Task Completion Rate: 87%                               │
│   - Projected at Next Settlement: 15,000 FC                │
│ - Time Period Selector: 7D | 30D | 90D | All Time          │
│                                                             │
│ INTERACTION: Tap time period → Charts update                │
│ FEEDBACK: Smooth chart animation (300ms)                    │
│                                                             │
│ EMPTY STATE: No data yet                                    │
│ - "Complete tasks to see your earnings data"                │
│ - "Stats appear after your first task completion"           │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: User browses stats (ongoing)                        │
│ - Scrolls to see all metrics                                │
│ - Taps different time periods                               │
│ - Reviews charts                                            │
│                                                             │
│ INTERACTION: Scroll, tap time periods                       │
│ FEEDBACK: Smooth scrolling, chart updates                   │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Return to Home                                      │
│ - User taps "Home" tab                                      │
│                                                             │
│ INTERACTION: Tap "Home" tab                                 │
│ FEEDBACK: Smooth transition back to Home                    │
└─────────────────────────────────────────────────────────────┘
```

**Key UX Decisions**:
- Read-only (no actions, just data)
- Time period selector (flexibility)
- Empty state guides users (education)
- Charts are minimal (no flashy animations)

---

### Flow 8: Change Settings
**Trigger**: User navigates to Profile → Settings
**Duration**: 30 seconds
**Success Metric**: 10% of users visit Settings monthly

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Navigate to Settings                                │
│ - Home → Tap "Profile" tab → Tap "Settings"                 │
│                                                             │
│ INTERACTION: Tap "Profile" → Tap "Settings"                 │
│ FEEDBACK: Smooth transitions                                │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Settings Screen (immediate)                         │
│ - Header: "Settings"                                        │
│ - Notifications:                                            │
│   - Toggle: On/Off                                          │
│   - Subtitle: "Receive notifications about settlements..."   │
│ - Currency Display:                                         │
│   - Options: FC Only | USD Only | FC + USD                  │
│   - Subtitle: "How balances are displayed"                  │
│ - Language:                                                 │
│   - Current: "English"                                      │
│   - Tap → Language Selection                                │
│ - Account:                                                  │
│   - "Connected Telegram: @username"                         │
│   - "Logout" button (red, bottom)                           │
│                                                             │
│ INTERACTION: Toggle notifications → Change currency → etc.  │
│ FEEDBACK: Immediate toggle, smooth transitions              │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Change Language (optional)                          │
│ - User taps "Language"                                      │
│ - Navigates to Language Selection                           │
│ - User selects new language                                 │
│ - Taps "Continue"                                           │
│ - Returns to Settings                                       │
│                                                             │
│ INTERACTION: Select language → Tap "Continue"               │
│ FEEDBACK: Smooth transition, language updates immediately   │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Logout (optional)                                   │
│ - User taps "Logout"                                        │
│ - Confirmation dialog:                                      │
│   - "Are you sure you want to logout?"                      │
│   - "Cancel" | "Logout" buttons                             │
│                                                             │
│ INTERACTION: Tap "Logout" to confirm                        │
│ FEEDBACK: Smooth transition to Splash Screen                │
└─────────────────────────────────────────────────────────────┘
```

**Key UX Decisions**:
- Settings are simple (no complex configurations)
- Immediate feedback (toggles update instantly)
- Logout is hidden (prevents accidental logouts)
- Confirmation dialog for logout (prevents mistakes)

---

### Flow 9: Get Help (FAQ)
**Trigger**: User navigates to Profile → FAQ
**Duration**: 1-5 minutes (reading)
**Success Metric**: 50% reduction in support tickets

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Navigate to FAQ                                     │
│ - Home → Tap "Profile" tab → Tap "FAQ"                      │
│                                                             │
│ INTERACTION: Tap "Profile" → Tap "FAQ"                      │
│ FEEDBACK: Smooth transition                                 │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: FAQ Screen (immediate)                              │
│ - Header: "Frequently Asked Questions"                      │
│ - Accordion list:                                           │
│   - "What is FC?" (collapsed)                               │
│   - "How do I earn FC?" (collapsed)                         │
│   - "When can I withdraw?" (collapsed)                      │
│   - ... (10 questions total)                                │
│                                                             │
│ INTERACTION: Tap question → Expands answer                  │
│ FEEDBACK: Smooth expand/collapse animation (200ms)          │
│                                                             │
│ BEHAVIOR: Only one question open at a time (accordion)      │
│           Tapping another question closes previous          │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Read Answer (ongoing)                               │
│ - User reads answer                                          │
│ - User can collapse and expand other questions              │
│                                                             │
│ INTERACTION: Tap questions to expand/collapse               │
│ FEEDBACK: Smooth animations                                 │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Contact Support (if needed)                         │
│ - User taps "Contact Support" link at bottom                │
│ - Navigates to Contact Support screen                       │
│                                                             │
│ INTERACTION: Tap "Contact Support"                          │
│ FEEDBACK: Smooth transition                                 │
└─────────────────────────────────────────────────────────────┘
```

**Key UX Decisions**:
- Accordion pattern (reduces cognitive load)
- One open at a time (focus)
- Smooth animations (polished feel)
- Contact Support link (escalation path)

---

### Flow 10: Pull-to-Refresh
**Trigger**: User pulls down on any scrollable screen
**Duration**: 1-2 seconds
**Success Metric**: Used by 40% of users daily

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: User Pulls Down                                      │
│ - User touches screen and drags down                         │
│ - Pull distance > 100px triggers refresh                     │
│                                                             │
│ INTERACTION: Pull down gesture                               │
│ FEEDBACK: Spinner appears at top, "Pull to refresh" text    │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Refresh Triggered                                    │
│ - Spinner animates (rotating)                                │
│ - "Refreshing..." text appears                               │
│ - Content dims slightly (20% opacity)                        │
│                                                             │
│ INTERACTION: None (automatic)                                │
│ FEEDBACK: Visual feedback that refresh is happening          │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Data Updates (1-2 seconds)                           │
│ - API call to fetch new data                                 │
│ - Balance updates (if changed)                               │
│ - Task list updates (new tasks appear)                       │
│ - Activity feed updates (new activities appear)              │
│                                                             │
│ INTERACTION: None (automatic)                                │
│ FEEDBACK: Content updates smoothly                           │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Refresh Complete                                     │
│ - Spinner disappears                                         │
│ - "Updated just now" text appears briefly                    │
│ - Content returns to full opacity                            │
│                                                             │
│ INTERACTION: User can scroll content                         │
│ FEEDBACK: Smooth transition to normal state                  │
└─────────────────────────────────────────────────────────────┘
```

**Key UX Decisions**:
- Standard pull-to-refresh gesture (Telegram-native)
- Visual feedback during refresh (spinner + text)
- Content dims (indicates loading state)
- "Updated just now" confirmation (reassurance)

---

## INTERACTION PATTERNS

### Tap Interactions
**Pattern**: Immediate feedback (< 100ms)
**Behavior**:
- Button scales down slightly (95%) on tap
- Color darkens momentarily
- No delay between tap and action

**Examples**:
- Primary buttons: Scale + color change
- List items: Background highlight
- Tabs: Color/weight change

---

### Scroll Interactions
**Pattern**: Smooth, native-feeling scroll
**Behavior**:
- Momentum scrolling (iOS) / edge glow (Android)
- No scroll indicators (minimal)
- Pull-to-refresh at top only
- No infinite scroll (all content is finite)

**Scroll Boundaries**:
- Home: Balance and actions fixed, content scrolls
- Task lists: Full scroll
- Settings: Full scroll
- No overscroll bounce (keeps it contained)

---

### Gesture Interactions
**Pattern**: Minimal gestures (only where intuitive)
**Supported Gestures**:
- Swipe left/right: Onboarding carousel only
- Pull down: Refresh on scrollable screens
- Tap: Primary interaction (90% of interactions)

**Unsupported Gestures** (intentionally):
- Swipe to delete (too complex, use "skip" button instead)
- Swipe to go back (use back button instead)
- Long press (no use case in Fee)
- Pinch to zoom (no zoomable content)
- Shake to undo (not needed)

---

### Loading Interactions
**Pattern**: Skeleton screens + spinners
**Behavior**:
- Short load (< 1s): Spinner only
- Medium load (1-3s): Skeleton screen
- Long load (> 3s): Spinner + "Loading..." text

**Skeleton Screen Example** (Home):
```
┌─────────────────────────────────────┐
│ ████████████                        │  ← Balance card skeleton
│ ████████████                        │
│ ████████████                        │
├─────────────────────────────────────┤
│ ██████  ██████                      │  ← Action buttons skeleton
│ ██████  ██████                      │
├─────────────────────────────────────┤
│ ████████████                        │  ← Task list skeleton
│ ████████████                        │
│ ████████████                        │
└─────────────────────────────────────┘
```

**Why Skeleton Screens**: Feels faster than spinners, maintains layout stability

---

### Error Interactions
**Pattern**: Clear error + actionable recovery
**Behavior**:
- Error icon (X or warning triangle)
- Clear error message (1-2 sentences)
- Primary action button ("Retry" or "Go Home")
- Secondary action button (if applicable)

**Error State Examples**:

**Network Error**:
```
┌─────────────────────────────────────┐
│                                     │
│           ⚠️                        │
│                                     │
│      Connection Lost                │
│                                     │
│  Check your internet connection     │
│  and try again.                     │
│                                     │
│      [Retry]  [Go Home]             │
│                                     │
└─────────────────────────────────────┘
```

**Task Failed**:
```
┌─────────────────────────────────────┐
│                                     │
│           ✕                         │
│                                     │
│      Task Unavailable               │
│                                     │
│  This task could not be completed.  │
│  Try another task or check back     │
│  later.                             │
│                                     │
│      [Try Another Task]  [Go Home]  │
│                                     │
└─────────────────────────────────────┘
```

**Key UX Decisions**:
- Error icon provides immediate visual cue
- Message explains what happened (not technical jargon)
- Primary action is clear ("Retry" or "Go Home")
- Secondary action provides escape route

---

### Success Interactions
**Pattern**: Confirmation + auto-dismiss
**Behavior**:
- Success icon (checkmark)
- Clear message (what happened)
- "Done" button (or auto-dismiss after 3s)
- Toast notification for minor actions

**Success State Examples**:

**Task Completed** (full screen):
```
┌─────────────────────────────────────┐
│                                     │
│           ✓                         │
│                                     │
│      Task Completed                 │
│                                     │
│      You earned 50 FC.              │
│                                     │
│           [Done]                    │
│                                     │
└─────────────────────────────────────┘
```

**Referral Copied** (toast):
```
┌─────────────────────────────────────┐
│                                     │
│   ✓ Referral code copied            │
│                                     │
└─────────────────────────────────────┘
```
(Toast appears at top, auto-dismisses after 3s)

**Key UX Decisions**:
- Full screen for major actions (withdrawal, task completion)
- Toast for minor actions (copy, settings saved)
- Auto-dismiss reduces friction (no need to tap "Done")
- Clear confirmation (users know what happened)

---

## MICROINTERACTIONS

### Balance Update
**Trigger**: FC credited to account
**Animation**:
1. Balance number scales up slightly (1.0 → 1.1 → 1.0)
2. Color flashes (subtle, 200ms)
3. "+X FC" toast appears at top
4. Toast auto-dismisses after 3s

**Duration**: 500ms total
**Purpose**: Immediate feedback without being distracting

---

### Button Tap
**Trigger**: User taps any button
**Animation**:
1. Button scales down (1.0 → 0.95)
2. Color darkens (10%)
3. On release: Scales back up (0.95 → 1.0)
4. Color returns to normal

**Duration**: 150ms total
**Purpose**: Tactile feedback (feels like pressing a physical button)

---

### Tab Switch
**Trigger**: User taps bottom navigation tab
**Animation**:
1. Active tab indicator slides to new tab (200ms)
2. Screen content fades out (100ms)
3. New screen content fades in (100ms)

**Duration**: 300ms total
**Purpose**: Smooth transition, clear context change

---

### Pull-to-Refresh
**Trigger**: User pulls down on scrollable screen
**Animation**:
1. Spinner rotates continuously
2. "Pull to refresh" text fades in as user pulls
3. "Refreshing..." text appears when triggered
4. Spinner and text fade out when complete

**Duration**: Continuous during pull, 500ms fade out
**Purpose**: Clear feedback that refresh is happening

---

### Accordion Expand/Collapse
**Trigger**: User taps FAQ question
**Animation**:
1. Answer section expands/collapses (200ms ease-in-out)
2. Chevron icon rotates (180°)
3. Content fades in (100ms)

**Duration**: 300ms total
**Purpose**: Smooth, polished feel

---

## ACCESSIBILITY INTERACTIONS

### Keyboard Navigation
**Pattern**: Tab order follows visual hierarchy
**Behavior**:
- Tab moves focus forward (top to bottom, left to right)
- Shift+Tab moves focus backward
- Enter/Space activates focused element
- Escape closes modals

**Focus Indicators**:
- 2px solid outline around focused element
- High contrast color (meets WCAG AA)
- No custom focus styles that hide default

---

### Screen Reader Interactions
**Pattern**: Live regions for dynamic content
**Behavior**:
- Balance updates announced: "Your balance is now 12,450 FC"
- New tasks announced: "3 new tasks available"
- Success messages announced: "Task completed. You earned 50 FC"

**ARIA Live Regions**:
- `aria-live="polite"` for balance updates
- `aria-live="assertive"` for errors
- `aria-live="off"` for decorative content

---

### Reduced Motion
**Pattern**: Respects user preference
**Behavior**:
- If `prefers-reduced-motion: reduce` is set:
  - No animations (instant transitions)
  - No microinteractions
  - No auto-advancing carousels
  - No auto-dismissing toasts

**Implementation**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## RESPONSIVE INTERACTIONS

### Mobile (375px)
- Touch targets: Minimum 44x44px
- Gestures: Tap, pull-to-refresh, swipe (onboarding only)
- Haptic feedback: None (Telegram Web Apps don't support haptics)

### Tablet (768px+)
- Touch targets: Minimum 44x44px (same as mobile)
- Gestures: Same as mobile
- Layout: Cards centered, max-width 600px

### Desktop (1024px+)
- Touch targets: Minimum 44x44px (same, for consistency)
- Gestures: Same as mobile (no hover states)
- Layout: Constrained to mobile width (375-414px) centered

---

## PERFORMANCE INTERACTIONS

### Transition Timing
**Standard**: 300ms (most transitions)
**Fast**: 150ms (button taps, toggles)
**Slow**: 500ms (page transitions, modals)

**Easing**:
- Ease-out for entering elements (fast start, slow end)
- Ease-in for exiting elements (slow start, fast end)
- Ease-in-out for continuous animations

---

### Loading Thresholds
**Instant** (< 100ms): No loading indicator
**Short** (100ms - 1s): Spinner only
**Medium** (1s - 3s): Skeleton screen
**Long** (> 3s): Spinner + "Loading..." text

---

### Optimistic UI
**Pattern**: Update UI immediately, verify in background
**Examples**:
- Task completion: Show "+50 FC" immediately, verify with server
- Settings change: Apply immediately, sync with server
- Referral copy: Show "Copied!" immediately, copy to clipboard

**Rollback**: If server returns error, revert UI and show error message

---

## INTERACTION ANTI-PATTERNS

### ❌ Avoid
- Animations longer than 500ms (feels slow)
- Multiple animations at once (overwhelming)
- Loading spinners without context (users don't know what's loading)
- Error messages without recovery path (dead ends)
- Auto-advancing carousels (users lose control)
- Hover states on mobile (doesn't work)
- Swipe gestures for navigation (confusing)
- Long press interactions (not discoverable)

### ✅ Embrace
- Immediate feedback (< 100ms)
- Smooth, subtle animations (200-300ms)
- Clear loading states (spinner + text)
- Actionable error messages (retry, go home)
- User-controlled carousels (swipe or dots)
- Tap interactions (90% of interactions)
- Clear back buttons (always visible)
- Progressive disclosure (show only what's needed)

---

## USABILITY TESTING CHECKLIST

### Navigation
- [ ] Users can reach any screen in ≤ 3 taps from Home
- [ ] Users can always find the back button
- [ ] Users understand bottom navigation (Home, Stats, Profile)
- [ ] Users can complete first task without help

### Task Completion
- [ ] Users understand what they'll earn before starting
- [ ] Users know when task is complete
- [ ] Users see balance update immediately
- [ ] Users can recover from errors without frustration

### Withdrawal Flow
- [ ] Users understand settlement model
- [ ] Users can complete withdrawal in < 2 minutes
- [ ] Users understand fees and timeline
- [ ] Users feel confident about the process

### Settings
- [ ] Users can find settings easily
- [ ] Users understand what each setting does
- [ ] Users can change language without confusion
- [ ] Users can logout without accidental clicks

### Accessibility
- [ ] Keyboard navigation works for all screens
- [ ] Screen reader announces all important content
- [ ] Focus management is logical
- [ ] Reduced motion is respected

---

## SUCCESS METRICS

### Task Completion
- First task completion rate: > 80%
- Average time to first task: < 10 seconds
- Task completion rate (overall): > 70%
- Error recovery rate: > 90% (users retry after error)

### Navigation
- Time to reach any screen from Home: < 3 taps
- Back button usage: > 80% (users know how to go back)
- Bottom nav usage: > 90% (users understand navigation)

### Engagement
- Daily active users (DAU): > 40% of monthly users
- Session duration: 3-5 minutes (focused, not endless scrolling)
- Pull-to-refresh usage: > 40% of users daily

### Satisfaction
- Support ticket rate: < 2% (users don't need help)
- App store rating: > 4.5/5
- Net Promoter Score (NPS): > 50

---

## CONCLUSION

Fee's UX flows are designed to be frictionless, clear, and respectful. Every interaction has a purpose. Every feedback is immediate. Every error has a recovery path. Users never feel lost, confused, or manipulated.

**Our UX promise**:
- Frictionless: Zero barriers to earning
- Clear: Users always know where they are and what to do
- Respectful: We don't manipulate, we don't trick, we don't rush
- Professional: Every interaction feels polished and intentional

---

*User Experience Flows Version 1.0*
*Created: 2026-07-18*
*Status: Ready for Visual Design*
*Next Step: Design System*