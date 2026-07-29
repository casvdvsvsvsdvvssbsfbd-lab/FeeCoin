# FEE - Information Architecture
## Complete Application Structure & Navigation Flow

---

## DESIGN PHILOSOPHY

**Inspired by**: Telegram's minimal navigation + Apple's hierarchical clarity
**Principle**: Every page exists for one reason. No dead ends. No confusion.
**Pattern**: Linear flows with clear entry/exit points. No circular navigation traps.

---

## COMPLETE PAGE INVENTORY

### Authentication & Entry
1. Splash Screen
2. Language Selection (first launch only)
3. Welcome / Onboarding

### Core Navigation (Bottom Tabs)
4. Home
5. Stats
6. Profile

### Task Flows (From Home)
7. Watch Ads - Ad Player
8. Complete Tasks - Task List
9. Install Apps - App Offers
10. Refer Friends - Referral Dashboard

### Detail Screens
11. Balance Detail
12. Task Detail (individual task view)
13. Withdrawal Flow
14. Settlement Info

### Settings & Support
15. Settings
16. FAQ
17. Terms of Service
18. Privacy Policy
19. Contact Support

### System Screens
20. Loading States
21. Error States
22. Empty States
23. Success Confirmations

---

## NAVIGATION FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  SPLASH SCREEN                                              │
│  (Auto-dismiss after 2 seconds)                             │
│                                                             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  LANGUAGE SELECTION                                         │
│  (First launch only - auto-detects from Telegram)           │
│                                                             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  WELCOME / ONBOARDING                                       │
│  (First launch only - 3 screens max)                        │
│                                                             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  HOME (Primary Tab)                                         │
│  - Balance Card                                            │
│  - Primary Actions Grid                                    │
│  - Available Now List                                      │
│  - Recent Activity List                                    │
│                                                             │
│  [Bottom Navigation: Home | Stats | Profile]               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┬───────────────┐
        │               │               │               │
        ↓               ↓               ↓               ↓
   ┌────────┐     ┌──────────┐   ┌──────────┐   ┌──────────┐
   │ STATS  │     │ PROFILE  │   │  TASK    │   │ BALANCE  │
   │(Tab 2)│     │ (Tab 3)  │   │ FLOWS    │   │  DETAIL  │
   └────────┘     └──────────┘   └──────────┘   └──────────┘
```

---

## DETAILED PAGE SPECIFICATIONS

### 1. SPLASH SCREEN
**Purpose**: Brand recognition while app loads
**Duration**: 2 seconds (auto-advance)
**Display**: 
- App name "Fee" (centered, minimal)
- Subtle loading indicator
- No interactive elements

**Why it exists**: 
- Professional app feel
- Time to initialize Telegram authentication
- Brand reinforcement

**Navigation**:
- Auto-advances to Language Selection (first launch) or Home (returning user)
- No back button
- No skip option

---

### 2. LANGUAGE SELECTION
**Purpose**: Set user's preferred language
**Trigger**: First launch only
**Display**:
- Header: "Select Language"
- List of 5-10 languages (based on user's Telegram locale)
- Auto-detected language pre-selected
- "Continue" button (bottom, full width)

**Why it exists**: 
- Respects user preference
- Required before showing content
- One-time setup (stored in user profile)

**Navigation**:
- Select language → Tap "Continue" → Welcome/Onboarding
- No back button (first screen after splash)
- No skip option (language is required)

---

### 3. WELLLOW / ONBOARDING
**Purpose**: Educate user on how Fee works
**Trigger**: First launch only (after language selection)
**Display**: 3 screens, swipeable

**Screen 1: "Earn FC"**
- Icon: Simple FC coin or task icon
- Headline: "Earn FC for completing tasks"
- Body: "Watch ads, complete surveys, install apps, and refer friends to collect FC."
- Indicator: 1/3 dots

**Screen 2: "Collect & Wait"**
- Icon: Calendar or clock
- Headline: "Your balance grows in real-time"
- Body: "FC is credited instantly. Withdrawals open during scheduled settlement periods."
- Indicator: 2/3 dots

**Screen 3: "Withdraw"**
- Icon: Arrow pointing up or wallet
- Headline: "Withdraw during settlement"
- Body: "When the next settlement opens, withdraw your FC via Payeer."
- Button: "Get Started" (replaces dots)

**Why it exists**: 
- Sets clear expectations (no surprises)
- Educates on settlement model (unique to Fee)
- Reduces confusion and support tickets
- Builds trust through transparency

**Navigation**:
- Swipe left/right between screens
- "Get Started" button on screen 3 → Home
- No skip button (onboarding is fast, 30 seconds max)
- No back button (linear flow)

---

### 4. HOME (Primary Tab)
**Purpose**: Main dashboard - single source of truth for FC journey
**Access**: Bottom navigation (always visible)

**Sections** (top to bottom):
1. Balance Card (tap → Balance Detail)
2. Primary Actions Grid (4 buttons → task category screens)
3. Available Now (scrollable list → individual tasks)
4. Recent Activity (scrollable list, read-only)

**Why it exists**: 
- Central hub for all user actions
- Balance visibility creates motivation
- Clear paths to earning
- Social proof through activity

**Navigation**:
- Bottom nav: Home (active), Stats, Profile
- Balance Card → Balance Detail
- Primary Actions → Category screens (Watch Ads, Complete Tasks, Install Apps, Refer Friends)
- Available Now items → Task flows
- Recent Activity → No navigation (read-only)
- Pull-to-refresh → Updates content

---

### 5. STATS (Secondary Tab)
**Purpose**: Data-driven insights for power users
**Access**: Bottom navigation (tab 2)

**Sections**:
- Header: "Your Stats"
- Earnings Overview (line chart: last 30 days)
- Earnings by Category (pie chart: ads, tasks, apps, referrals)
- Key Metrics:
  - Total earned (FC + USD)
  - Average per day/week/month
  - Task completion rate
  - Projected earnings at next settlement
- Time period selector: 7D | 30D | 90D | All Time

**Why it exists**: 
- Power users want to optimize
- Data creates stickiness
- Professional feel (like Revolut)
- Separates data from action

**Navigation**:
- Bottom nav: Home, Stats (active), Profile
- Time period selector → Updates charts
- No other navigation (read-only dashboard)
- Pull-to-refresh → Updates data

**Empty State** (no data yet):
```
Your Stats

Complete tasks to see your earnings data.
Stats appear after your first task completion.
```

---

### 6. PROFILE (Tertiary Tab)
**Purpose**: Settings, history, support
**Access**: Bottom navigation (tab 3)

**Sections**:
- User Info:
  - Telegram name and avatar
  - Member since: [date]
  - Total tasks completed: [X]
- Withdrawal History:
  - List of past settlements (date, amount, status)
  - "No withdrawals yet" empty state
- Settings:
  - Notifications (toggle)
  - Currency Display (FC / USD / Both)
  - Language (link to Language Selection)
- Support:
  - FAQ (link)
  - Contact Support (link)
  - Terms of Service (link)
  - Privacy Policy (link)
- Logout Button (bottom, full width)

**Why it exists**: 
- Standard mobile app pattern
- Keeps Home screen clean
- Separates transactional from operational
- Provides support access

**Navigation**:
- Bottom nav: Home, Stats, Profile (active)
- Withdrawal History items → Withdrawal Detail (future)
- Settings items → Settings screens
- Support links → respective pages
- Logout → Confirmation dialog → Splash Screen

---

### 7. WATCH ADS - AD PLAYER
**Purpose**: Play video advertisements and earn FC
**Access**: Home → Primary Actions → "Watch Ads" OR Available Now → specific ad task

**Flow**:
1. **Ad Queue Screen** (if multiple ads available)
   - List of available ads
   - Each shows: "Earn X FC · Y seconds"
   - Tap to select ad

2. **Ad Player Screen**
   - Full-screen video player
   - Countdown timer (top right)
   - "Skip" button appears after mandatory watch time (if applicable)
   - No controls (no pause, no fullscreen toggle)
   - Progress bar at bottom

3. **Completion Screen**
   - Checkmark icon
   - "Ad Completed"
   - "+X FC" (animated, subtle)
   - "Claim" button
   - Auto-advances to next ad or Home after 3 seconds

**Why it exists**: 
- Primary earning method
- Clear, focused experience (no distractions)
- Immediate feedback (FC credited)

**Navigation**:
- Back button (top left) → Home (ad not completed, no FC awarded)
- "Claim" button → Home (FC credited)
- Auto-advance → Home or next ad
- No other navigation during ad playback

**Error States**:
- Ad failed to load → "Ad unavailable. Try another task." → Home
- Network error → "Connection lost. Check your internet." → Retry or Home

---

### 8. COMPLETE TASKS - TASK LIST
**Purpose**: Browse and complete surveys, offers, and other tasks
**Access**: Home → Primary Actions → "Complete Tasks" OR Available Now → specific task

**Display**:
- Header: "Complete Tasks"
- Filter tabs: All | Surveys | Offers | Daily
- Scrollable list of task cards:
  ```
  ▸ [Icon] Task Name
    Earn X FC · Y minutes
    [Progress bar if multi-step]
  ```

**Task Types**:
- Surveys: "Complete Survey: Shopping Habits" → External link or in-app form
- Offers: "Sign up for Service X" → External link with tracking
- Quizzes: "Answer 5 questions about Y" → In-app quiz
- Daily Tasks: "Daily Check-in" → One-tap claim

**Why it exists**: 
- Secondary earning method
- Variety of task types
- Filtering reduces cognitive load

**Navigation**:
- Back button → Home
- Task card tap → Task Detail or external link
- Pull-to-refresh → Updates task list
- Filter tabs → Filters list

**Task Flow**:
- Survey → In-app form or external browser → Return to Fee → "Claim FC"
- Offer → External link → Return to Fee → Verification → "Claim FC"
- Quiz → In-app quiz → Submit → "Claim FC"
- Daily → One-tap → "Claimed +X FC"

---

### 9. INSTALL APPS - APP OFFERS
**Purpose**: Install and try new apps to earn FC
**Access**: Home → Primary Actions → "Install Apps" OR Available Now → specific app

**Display**:
- Header: "Install Apps"
- Scrollable list of app offers:
  ```
  ┌─────────────────────────────┐
  │ [App Icon] App Name         │
  │           Developer Name    │
  │                             │
  │ Earn X FC · Reach Level Y   │
  │ [Progress: 0/3]             │
  └─────────────────────────────┘
  ```

**App Offer Types**:
- Install only: "Install AppX" → App Store/Play Store → Return to Fee → Verify → "Claim FC"
- Install + Level: "Install GameY, reach level 3" → App Store/Play Store → Return to Fee → Verify level → "Claim FC"
- Open daily: "Open AppZ for 7 days" → App Store/Play Store → Return daily → "Claim FC" each day

**Why it exists**: 
- Third earning method
- Higher FC rewards (users invest more time)
- Partnership opportunities with app developers

**Navigation**:
- Back button → Home
- App card tap → App Store/Play Store (external)
- Return to Fee → Auto-verification → "Claim FC" or progress update
- Pull-to-refresh → Updates offers

**Verification Flow**:
1. User taps app offer
2. Redirected to App Store/Play Store
3. User installs app
4. User returns to Fee (via deep link or manual)
5. Fee verifies installation (device check)
6. If level requirement: Fee checks app analytics (requires SDK integration)
7. FC credited or progress updated

---

### 10. REFER FRIENDS - REFERRAL DASHBOARD
**Purpose**: Share referral link/code and track referrals
**Access**: Home → Primary Actions → "Refer Friends" OR Available Now → referral bonus

**Display**:
- Header: "Refer Friends"
- Your Referral Code:
  - Large, copyable code (e.g., "FEE-JOHN-2024")
  - "Copy" button
- Your Referral Link:
  - Telegram deep link (e.g., "https://t.me/FeeBot?start=FEE-JOHN-2024")
  - "Copy" button
  - "Share" button (opens Telegram share sheet)
- Your Referrals:
  - List of referred users (Telegram names)
  - Status: "Pending" | "Active" | "Rewarded"
  - Total referrals: X
  - Total earned from referrals: Y FC
- Rewards:
  - "Earn 500 FC for each friend who completes their first task"
  - "Your friend also earns 500 FC"

**Why it exists**: 
- Fourth earning method
- Viral growth mechanism
- Low cost per acquisition (CPA)

**Navigation**:
- Back button → Home
- "Copy" buttons → Copies to clipboard, shows "Copied!" toast
- "Share" button → Opens Telegram share sheet
- Referral list → No navigation (read-only)
- Pull-to-refresh → Updates referral status

**Referral Flow**:
1. User copies code/link
2. User shares via Telegram
3. Friend opens link
4. Friend connects Telegram account
5. Friend completes first task
6. Both users receive 500 FC
7. Referral status updates to "Rewarded"

---

### 11. BALANCE DETAIL
**Purpose**: Detailed view of FC balance and transaction history
**Access**: Home → Balance Card tap

**Display**:
- Header: "Your Balance"
- Current Balance:
  - Large: "12,450 FC"
  - Secondary: "≈ $124.50 USD"
- Pending Earnings:
  - "Tasks completed but not yet credited: +250 FC"
  - "Will be credited within 24 hours"
- Next Settlement:
  - "Next settlement: January 1, 2025"
  - "Withdrawal opens in 15 days"
- Withdrawal Threshold:
  - "Minimum withdrawal: 5,000 FC"
  - "You can withdraw: Yes" or "You need X more FC"
- Transaction History:
  - List of all FC movements (credits and debits)
  - Each shows: date, description, amount, balance after

**Why it exists**: 
- Transparency (users see every transaction)
- Trust (no hidden movements)
- Anticipation (next settlement date)
- Clarity (withdrawal threshold)

**Navigation**:
- Back button → Home
- Transaction items → No navigation (read-only)
- Pull-to-refresh → Updates balance and history

**Empty State** (no transactions):
```
Transaction History

No transactions yet.
Complete your first task to see your history.
```

---

### 12. TASK DETAIL
**Purpose**: Detailed view of individual task before starting
**Access**: Available Now → Task card tap OR Task List → Task card tap

**Display**:
- Header: "Task Details"
- Task Icon (large)
- Task Name
- Description:
  - "Watch this 30-second video ad to earn FC."
  - "Complete this survey about your shopping habits."
- Reward:
  - "Earn: 50 FC"
  - "≈ $0.50 USD"
- Requirements:
  - "Must watch entire video"
  - "Must be 18+ years old"
  - "One completion per user"
- Time Estimate:
  - "Takes about 30 seconds"
- Start Button (bottom, full width)

**Why it exists**: 
- Sets expectations before user commits
- Reduces drop-off (users know what they're getting into)
- Transparency (no hidden requirements)

**Navigation**:
- Back button → Home or Task List
- "Start" button → Task flow (Ad Player, Survey, etc.)
- No other navigation

---

### 13. WITHDRAWAL FLOW
**Purpose**: Process FC withdrawal during settlement period
**Access**: Balance Detail → "Withdraw" button (only during settlement window)

**Flow** (3 screens):

**Screen 1: Withdrawal Amount**
- Header: "Withdraw FC"
- Available Balance: "12,450 FC"
- Withdrawal Threshold: "Minimum: 5,000 FC"
- Amount Input:
  - Pre-filled with max available (or min threshold)
  - Slider or input field
  - Shows USD equivalent in real-time
- Fee Display:
  - "Withdrawal fee: 2% (X FC)"
  - "You will receive: Y FC (≈ $Z USD)"
- Next Button

**Screen 2: Payeer Account**
- Header: "Select Payeer Account"
- Saved Accounts (if any):
  - List of previously used Payeer accounts
  - Radio button selection
- Add New Account:
  - Payeer ID input
  - "Save account" checkbox
- Next Button

**Screen 3: Confirmation**
- Header: "Confirm Withdrawal"
- Summary:
  - Amount: X FC
  - Fee: Y FC
  - You receive: Z FC (≈ $A USD)
  - To: Payeer ID
- Terms:
  - "Withdrawals are processed within 1-3 business days."
  - "This action cannot be undone."
- Confirm Button (bottom, full width)

**Success Screen**:
- Checkmark icon
- "Withdrawal Initiated"
- "You will receive $X USD within 1-3 business days."
- "Next settlement: [date]"
- "Done" button → Home

**Why it exists**: 
- Professional withdrawal experience (like a bank)
- Clear fees and timeline
- Reduces anxiety (users know what to expect)

**Navigation**:
- Back buttons → Previous screen or Balance Detail
- "Done" button → Home
- No other navigation during flow

**Error States**:
- Insufficient balance → "You need X more FC" → Back to Screen 1
- Invalid Payeer ID → "Please enter a valid Payeer ID" → Back to Screen 2
- Settlement not open → "Withdrawals open on [date]" → Back to Balance Detail

---

### 14. SETTLEMENT INFO
**Purpose**: Educate users on how settlement works
**Access**: Balance Detail → "Learn more about settlement" link

**Display**:
- Header: "How Settlement Works"
- Sections:
  1. What is Settlement?
     - "Settlement is when we process withdrawals for all users."
     - "It happens on the 1st of each month."
  2. When is Next Settlement?
     - "Next settlement: January 1, 2025"
     - "Withdrawal window: 48 hours (Jan 1-2)"
  3. How Do I Withdraw?
     - "During the settlement window, open Fee and tap 'Withdraw'."
     - "Select your Payeer account and confirm."
  4. When Do I Receive Funds?
     - "Funds are sent within 1-3 business days after settlement closes."
  5. Minimum Withdrawal
     - "Minimum withdrawal: 5,000 FC (≈ $50 USD)"
     - "No maximum withdrawal limit"

**Why it exists**: 
- Reduces support tickets
- Sets clear expectations
- Builds trust through education

**Navigation**:
- Back button → Balance Detail
- No other navigation (read-only)

---

### 15. SETTINGS
**Purpose**: User preferences and app configuration
**Access**: Profile → Settings section

**Display**:
- Header: "Settings"
- Settings List:
  1. Notifications
     - Toggle: On/Off
     - Subtitle: "Receive notifications about settlements and new tasks"
  2. Currency Display
     - Options: FC Only | USD Only | FC + USD
     - Subtitle: "How balances are displayed"
  3. Language
     - Current language: "English"
     - Tap → Language Selection
  4. Account
     - "Connected Telegram: @username"
     - "Logout" button (red, bottom)

**Why it exists**: 
- User control over experience
- Standard mobile app pattern
- Logout access (hidden in profile to prevent accidental logouts)

**Navigation**:
- Back button → Profile
- Language → Language Selection (if changed, returns to Profile)
- Logout → Confirmation dialog → Splash Screen

---

### 16. FAQ
**Purpose**: Answer common questions
**Access**: Profile → FAQ link

**Display**:
- Header: "Frequently Asked Questions"
- Accordion list:
  - "What is FC?" → Expandable answer
  - "How do I earn FC?" → Expandable answer
  - "When can I withdraw?" → Expandable answer
  - "What is the minimum withdrawal?" → Expandable answer
  - "How long does withdrawal take?" → Expandable answer
  - "Is Fee legitimate?" → Expandable answer
  - "How do you make money?" → Expandable answer
  - "Can I have multiple accounts?" → Expandable answer
  - "What if I find a bug?" → Expandable answer
  - "How do I contact support?" → Expandable answer

**Why it exists**: 
- Reduces support burden
- Builds trust through transparency
- Answers sensitive questions (how we make money)

**Navigation**:
- Back button → Profile
- Accordion expand/collapse (no navigation)
- "Contact Support" link → Contact Support screen

---

### 17. TERMS OF SERVICE
**Purpose**: Legal terms and conditions
**Access**: Profile → Terms of Service link

**Display**:
- Header: "Terms of Service"
- Scrollable text:
  - Acceptance of terms
  - FC system explanation
  - Settlement and withdrawal terms
  - Prohibited activities
  - Account termination
  - Limitation of liability
  - Dispute resolution
- Last updated: [date]
- "Accept" button (if not yet accepted)

**Why it exists**: 
- Legal requirement
- Sets rules for platform use
- Protects company and users

**Navigation**:
- Back button → Profile
- "Accept" button → Profile (if first time)
- No other navigation (read-only)

---

### 18. PRIVACY POLICY
**Purpose**: Data collection and usage transparency
**Access**: Profile → Privacy Policy link

**Display**:
- Header: "Privacy Policy"
- Scrollable text:
  - Data we collect
  - How we use data
  - Data sharing (ad networks, Payeer)
  - Data security
  - User rights
  - Cookie policy (if applicable)
- Last updated: [date]

**Why it exists**: 
- Legal requirement (GDPR, etc.)
- Builds trust through transparency
- Explains data usage

**Navigation**:
- Back button → Profile
- No other navigation (read-only)

---

### 19. CONTACT SUPPORT
**Purpose**: User support and feedback
**Access**: Profile → Contact Support link OR FAQ → "Contact Support"

**Display**:
- Header: "Contact Support"
- Options:
  1. FAQ (link) - "Check FAQ first"
  2. Send Message:
     - Text area (max 500 characters)
     - "Send" button
  3. Email:
     - "support@fee.app" (mailto link)
  4. Telegram:
     - "@FeeSupport" (opens Telegram chat)

**Why it exists**: 
- User support channel
- Feedback collection
- Issue resolution

**Navigation**:
- Back button → Profile
- FAQ link → FAQ
- Send button → Success confirmation → Profile
- Email/Telegram links → External apps

**Success State**:
```
Message Sent

We'll respond within 24 hours.
Thank you for contacting support.
```

---

### 20-23. SYSTEM SCREENS

#### 20. LOADING STATES
**Purpose**: Indicate background processing
**Display**:
- Minimal spinner (center screen)
- No text (or subtle "Loading...")
- No interactive elements

**When shown**:
- Initial app load
- Balance updates
- Task list refresh
- Form submissions

**Duration**: 
- Short: < 1 second (spinner)
- Long: > 1 second (spinner + "Loading..." text)

#### 21. ERROR STATES
**Purpose**: Communicate failures gracefully
**Display**:
- Error icon (X or warning)
- Error message (clear, simple)
- "Retry" button (if applicable)
- "Go Home" button (always)

**Examples**:
- Network error: "Connection lost. Check your internet and try again."
- Task failed: "Task could not be completed. Try again or choose another task."
- Server error: "Something went wrong. We're working on it."

**Navigation**:
- "Retry" → Retries action
- "Go Home" → Home

#### 22. EMPTY STATES
**Purpose**: Guide users when no data exists
**Display**:
- Icon (illustration or simple icon)
- Headline: "No [data] yet"
- Body: "Explanation of why and how to fix"
- Action button (if applicable)

**Examples**:
- No tasks: "No tasks available right now. Check back soon."
- No activity: "Your recent earnings will appear here. Start completing tasks."
- No referrals: "Refer friends to earn 500 FC each. Share your code."

**Navigation**:
- Action button → Relevant screen (e.g., "Browse Tasks" → Task List)
- Back button → Previous screen

#### 23. SUCCESS CONFIRMATIONS
**Purpose**: Confirm completed actions
**Display**:
- Success icon (checkmark)
- Headline: "Success!"
- Body: "What happened"
- "Done" button

**Examples**:
- Task completed: "You earned 50 FC"
- Referral shared: "Referral code copied to clipboard"
- Settings saved: "Settings updated"

**Navigation**:
- "Done" button → Previous screen or Home
- Auto-dismiss after 3 seconds (toast notifications)

---

## NAVIGATION PATTERNS

### Bottom Navigation (Primary)
**Always visible** on: Home, Stats, Profile
**Tabs**: Home | Stats | Profile
**Behavior**: 
- Tap to switch tabs
- Active tab has visual indicator
- No swipe gestures (keeps it simple)
- No hiding (always accessible)

### Back Navigation
**Pattern**: Top-left back button (←) on all screens except Home
**Behavior**:
- Returns to previous screen
- Maintains navigation stack
- No swipe-back gesture (keeps it simple)

### Modal Navigation
**Pattern**: Full-screen overlays for focused tasks
**Used for**:
- Ad Player (full-screen video)
- Withdrawal Flow (3-step process)
- Task flows (surveys, quizzes)

**Behavior**:
- No bottom navigation
- Back button exits modal
- No swipe-to-dismiss

### Deep Linking
**Supported**:
- Referral links: t.me/FeeBot?start=CODE
- Task links: Direct to specific task
- Settlement notifications: Direct to Balance Detail

**Behavior**:
- Opens app directly to relevant screen
- Bypasses Home if context is clear
- Falls back to Home if deep link is invalid

---

## INFORMATION HIERARCHY

### Level 1: Primary (Always Visible)
- Bottom Navigation (Home, Stats, Profile)
- Balance Card (on Home)

### Level 2: Secondary (Contextual)
- Primary Actions Grid (on Home)
- Section headers (Available Now, Recent Activity)

### Level 3: Tertiary (Scrollable)
- Task lists
- Activity feeds
- Settings options

### Level 4: Quaternary (Drill-down)
- Task Detail
- Balance Detail
- Transaction history

---

## USER FLOW EXAMPLES

### Flow 1: First-Time User
```
Splash → Language Selection → Welcome (3 screens) → Home
```

### Flow 2: Complete First Task
```
Home → Available Now → Tap "Watch Video Ad" → Ad Player → 
"Claim FC" → Home (balance updated)
```

### Flow 3: Check Stats
```
Home → Tap "Stats" tab → View charts → Tap "Home" tab → Home
```

### Flow 4: Withdraw FC
```
Home → Tap Balance Card → Balance Detail → Tap "Withdraw" → 
Withdrawal Flow (3 screens) → Success → Home
```

### Flow 5: Refer Friend
```
Home → Tap "Refer Friends" → Copy code → Share via Telegram → 
Friend completes task → Both receive 500 FC
```

### Flow 6: Change Settings
```
Home → Tap "Profile" tab → Tap "Settings" → Change notification 
preference → Back → Profile → Back → Home
```

### Flow 7: Get Help
```
Home → Tap "Profile" tab → Tap "FAQ" → Read answer → Back → 
Profile → Tap "Contact Support" → Send message → Success → Profile
```

---

## ACCESSIBILITY NAVIGATION

### Keyboard Navigation
- Tab order follows visual hierarchy (top to bottom, left to right)
- Enter/Space activates focused element
- Escape closes modals and returns to previous screen

### Screen Reader
- All pages have semantic headings (H1, H2, H3)
- Navigation landmarks: navigation, main, complementary
- Live regions for dynamic content (balance updates, new tasks)
- ARIA labels for all icons

### Focus Management
- Focus moves to new screen on navigation
- Focus returns to trigger element on back navigation
- Modals trap focus (Tab cycles within modal)
- No focus traps in main flow

---

## RESPONSIVE NAVIGATION

### Mobile (Primary - 375px)
- Bottom navigation: 3 tabs
- Back button: Top left
- Full-width cards and buttons
- Swipe gestures: Disabled (keeps it simple)

### Tablet (768px+)
- Bottom navigation: 3 tabs (same as mobile)
- Cards: Max-width 600px, centered
- Increased margins (24px)
- No side navigation (maintains mobile pattern)

### Desktop (1024px+)
- Constrained to mobile width (375-414px) centered
- OR expand to tablet layout with side navigation (future consideration)
- Telegram Mini Apps typically stay mobile-width

---

## ERROR RECOVERY PATHS

### Network Error
```
Any screen → Error state → "Retry" or "Go Home"
```

### Authentication Error
```
Any screen → Error state → "Re-authenticate" → Splash → Home
```

### Task Completion Error
```
Task flow → Error state → "Try Again" or "Choose Another Task" → 
Task List or Home
```

### Withdrawal Error
```
Withdrawal Flow → Error state → "Try Again" or "Go Back" → 
Balance Detail or previous step
```

---

## NAVIGATION ANTI-PATTERNS

### ❌ Avoid
- Hamburger menus with 10+ items
- Circular navigation (A → B → A)
- Hidden navigation (swipe to reveal)
- Tab bars with 5+ tabs
- Modal stacks (more than 2 modals deep)
- Infinite scroll without clear endpoints
- Breadcrumbs (not needed for 3-level hierarchy)

### ✅ Embrace
- Bottom tab bar (3 tabs max)
- Linear flows (A → B → C → D)
- Clear back buttons
- Modal overlays for focused tasks
- Pull-to-refresh
- Empty states with clear next actions

---

## IMPLEMENTATION PRIORITY

### Phase 1: Core Navigation (MVP)
1. Splash Screen
2. Language Selection
3. Welcome/Onboarding
4. Home (all sections)
5. Bottom Navigation (Home, Stats, Profile)
6. Basic task flows (Watch Ads, Complete Tasks)

### Phase 2: Enhanced Flows
7. Install Apps
8. Refer Friends
9. Balance Detail
10. Withdrawal Flow
11. Settings

### Phase 3: Support & Polish
12. FAQ
13. Terms of Service
14. Privacy Policy
15. Contact Support
16. Error/Empty/Success states

---

## SUCCESS CRITERIA

### Navigation Clarity
- Users can reach any screen in ≤ 3 taps from Home
- No dead-end screens (every screen has clear exit)
- No confusing navigation patterns

### User Understanding
- Users know where they are (clear headers)
- Users know how to go back (visible back button)
- Users know what to do next (clear CTAs)

### Technical Performance
- Screen transitions < 300ms
- No navigation lag or jank
- Deep links work 100% of the time

---

*Information Architecture Version 1.0*
*Created: 2026-07-18*
*Status: Ready for Visual Design*
*Next Step: Wireframe Refinement*