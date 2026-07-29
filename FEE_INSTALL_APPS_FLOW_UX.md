# FEE - Install Apps Flow UX
## App Install & Verification Experience

---

## CORE UX MISSION

**Purpose**: Enable users to install and try new apps to earn FC
**Inspiration**: App Store + Google Play + Telegram Deep Links
**Principle**: Seamless transition between Fee and app stores, transparent verification

---

## FLOW POSITION IN APP

**Access**: Home → Primary Actions → "Install Apps" OR Available Now → specific app task
**Priority**: Tertiary earning method
**User Segment**: All users (100%)
**Frequency**: Weekly (40% of users)

---

## COMPLETE FLOW SPECIFICATION

### Flow Overview
```
Home
  ↓
App Offers List
  ↓
Task Detail (optional)
  ↓
External App Store (user action)
  ↓
Return to Fee (auto-verification)
  ↓
Completion Screen
  ↓
Home (balance updated)
```

**Total Flow Time**: 2-10 minutes (includes app store time)
**Success Metric**: 50% completion rate

---

## SCREEN 1: APP OFFERS LIST
**Position**: Between Home and App Store
**Scan Time**: 5 seconds
**Priority**: ⭐⭐⭐⭐⭐ (HIGHEST)

### What It Displays
```
← Install Apps ← Back button

┌─────────────────────────────────────┐
│                                     │
│ ▸ GameX                             │ ← App icon + Name
│   by GameStudio                     │ ← Developer name
│                                     │
│   Earn 200 FC                       │ ← Reward (highlighted)
│   Reach level 3                     │ ← Requirement
│                                     │
│   Progress: 0/3                     │ ← Progress bar (if multi-step)
│   ████████░░░░░░░░░░ 30%            │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ ▸ Fitness Pro                       │
│   by HealthTech                     │
│                                     │
│   Earn 150 FC                       │
│   Open app for 7 days               │
│                                     │
│   Progress: 0/7                     │
│   ████░░░░░░░░░░░░░░ 0%             │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ ▸ Photo Editor                      │
│   by CreativeApps                   │
│                                     │
│   Earn 100 FC                       │
│   Install only                      │
│                                     │
└─────────────────────────────────────┘
```

**Visual Treatment**:
- Header: 56px, with back button
- List of app offer cards
- Each card: 120px minimum height
- Background: White
- Border: 1px solid Neutral 200
- Border Radius: 12px
- Padding: 16px
- App icon: 48x48px, left side (rounded corners)
- App name: 15px, Semibold, Neutral 900
- Developer: 13px, Regular, Neutral 500
- Reward: 15px, Semibold, Primary color (highlighted)
- Requirement: 13px, Regular, Neutral 500
- Progress bar: 4px height, Primary color (if multi-step)
- NO shadow

**App Offer Types**:
1. **Install + Level**: "Install GameX, reach level 3" (200 FC)
2. **Install + Open Daily**: "Open Fitness Pro for 7 days" (150 FC)
3. **Install Only**: "Install Photo Editor" (100 FC)

### Why It Exists
1. **App Discovery**: Users find new apps to try
2. **Transparency**: Users see reward and requirements before installing
3. **Progress Tracking**: Users can see their progress on multi-step tasks
4. **Choice**: Users can pick apps they're interested in

### User Questions Answered
- ✅ "What apps can I install?" - List of available apps
- ✅ "How much will I earn?" - Reward amount shown
- ✅ "What do I need to do?" - Requirements shown (install, reach level, open daily)
- ✅ "How much progress have I made?" - Progress bar shows completion

### Eye Movement
1. User reads "Install Apps" (header)
2. User scans list top-to-bottom
3. User reads app name and developer
4. User focuses on reward (highlighted)
5. User reads requirements
6. User checks progress (if applicable)
7. User selects app

**Total Time**: 5 seconds

### Interaction
- **Tap app card**: Navigates to Task Detail or directly to App Store
- **Back button**: Returns to Home
- **Pull-to-refresh**: Updates app offers list

**Progress Tracking**:
- If user has started task, shows progress
- Progress bar updates when user returns to Fee
- User can continue where they left off

### Why This Placement
- **Between Home and App Store**: Natural flow
- **Card format**: Professional app store aesthetic
- **Progress tracking**: Shows ongoing tasks

### Empty State
```
Install Apps

No app offers available right now.
Check back soon for new opportunities.
```

### Accessibility
- Screen reader: "Install Apps, GameX, by GameStudio, Earn 200 FC, Reach level 3, Progress 30%, button"
- Touch target: Entire card is tappable (minimum 44x44px)
- High contrast: Neutral 900 on white (14.7:1 ratio)

---

## SCREEN 2: TASK DETAIL (Optional)
**Position**: Between App Offers List and App Store
**Scan Time**: 5 seconds
**Priority**: ⭐⭐⭐⭐ (HIGH - recommended for first-time users)

### What It Displays
```
← Task Details ← Back button

┌─────────────────────────────────────┐
│                                     │
│         [App Icon]                  │ ← Icon, 48x48px
│                                     │
│      Install GameX                  │ ← H2, 18px, Semibold
│      by GameStudio                  │ ← Caption, 13px, Regular, Neutral 500
│                                     │
│  Install GameX and reach level 3    │ ← Body, 15px, Regular
│  to earn FC.                        │
│                                     │
│  Earn: 200 FC (≈ $2.00 USD)        │ ← Highlighted, 18px, Semibold
│                                     │
│  Requirements:                      │ ← Overline, 11px, Neutral 500
│  • Install GameX from App Store     │ ← Body, 15px, Regular
│  • Complete tutorial                │ ← Body, 15px, Regular
│  • Reach level 3                    │ ← Body, 15px, Regular
│                                     │
│  [Open App Store]                   │ ← Primary button, full width
│                                     │
└─────────────────────────────────────┘
```

**Visual Treatment**:
- Header: 56px, with back button
- Content: Centered, max-width 400px
- Icon: 48x48px, center
- Title: 18px, Semibold, Neutral 900
- Developer: 13px, Regular, Neutral 500
- Description: 15px, Regular, Neutral 800
- Reward: 18px, Semibold, Primary color (highlighted)
- Requirements: 15px, Regular, Neutral 800
- Button: Primary, full width, bottom

### Why It Exists
1. **Set Expectations**: Users know what they're getting into
2. **Transparency**: Clear requirements, no surprises
3. **Reduce Drop-off**: Users commit before starting

### User Questions Answered
- ✅ "What app should I install?" - "GameX by GameStudio"
- ✅ "How much will I earn?" - "200 FC (≈ $2.00 USD)"
- ✅ "What are the requirements?" - "Install, complete tutorial, reach level 3"
- ✅ "Where do I get it?" - "Open App Store" button

### Eye Movement
1. User reads "Task Details" (header)
2. User sees app icon (center)
3. User reads app name and developer
4. User reads description
5. User focuses on reward (highlighted)
6. User reads requirements
7. User taps "Open App Store" button

**Total Time**: 5 seconds

### Interaction
- **Back button**: Returns to App Offers List
- **Open App Store button**: Opens App Store/Play Store (external)

### Why This Placement
- **Before App Store**: Sets expectations
- **Optional**: Can skip for experienced users

### Accessibility
- Screen reader: "Task Details, Install GameX, by GameStudio, Install GameX and reach level 3 to earn FC, Earn 200 FC, approximately 2 dollars, Requirements: Install GameX from App Store, Complete tutorial, Reach level 3, Open App Store button"
- Touch target: Open App Store button 48x48px minimum
- High contrast: Neutral 900 on white (14.7:1 ratio)

---

## SCREEN 3: EXTERNAL APP STORE (User Action)
**Position**: Outside Fee (App Store/Play Store)
**Duration**: 2-10 minutes (user action)
**Priority**: ⭐⭐⭐⭐⭐ (HIGHEST)

### What User Does
1. **App Store/Play Store opens** (deep link from Fee)
2. **User installs app** (taps "Get" or "Install")
3. **User opens app** (first launch)
4. **User completes requirements**:
   - Completes tutorial
   - Reaches level 3 (for level-based tasks)
   - Opens app for 7 days (for daily tasks)
5. **User returns to Fee** (via deep link or manual)

### Why This Exists
1. **App Installation**: User must install app from official store
2. **Verification**: App Store/Play Store verifies installation
3. **User Action**: User must complete requirements in app

### User Questions Answered
- ✅ "Where do I install the app?" - App Store/Play Store
- ✅ "How do I complete the task?" - Follow requirements (install, reach level, etc.)
- ✅ "How do I return to Fee?" - Deep link or manual return

### Eye Movement
- User is in App Store/Play Store (outside Fee)
- User follows app's onboarding flow
- User completes requirements

**Total Time**: 2-10 minutes (varies by app)

### Interaction
- **Install button**: Installs app
- **Open button**: Opens app
- **In-app actions**: Completes tutorial, reaches level, etc.
- **Return to Fee**: Deep link or manual

### Error States
- **User doesn't return**: No action (user must manually return)
- **App not installed**: "Please install the app first" (when user returns)
- **Requirements not met**: "You need to reach level 3" (when user returns)

### Accessibility
- App Store/Play Store accessibility is handled by Apple/Google
- Fee is not responsible for external app accessibility

---

## SCREEN 4: RETURN TO FEE - VERIFICATION
**Position**: Between App Store and Completion
**Duration**: 5 seconds
**Priority**: ⭐⭐⭐⭐⭐ (HIGHEST)

### What It Displays
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│           ⏳                         │ ← Spinner, 48x48px
│                                     │
│      Verifying...                   │ ← Body, 15px, Regular, Neutral 500
│                                     │
│  Please wait while we verify        │ ← Caption, 13px, Regular, Neutral 400
│  your progress.                     │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

**Visual Treatment**:
- Full-screen overlay (white background)
- Spinner: 48x48px, center, Primary color
- Text: 15px, Regular, Neutral 500
- Caption: 13px, Regular, Neutral 400
- NO shadow

**Verification Process**:
1. User returns to Fee (via deep link or manual)
2. Fee detects user returned from App Store
3. Fee verifies:
   - App is installed (device check)
   - Requirements met (level 3 reached, 7 days opened, etc.)
4. Verification takes 2-5 seconds
5. Shows completion screen or error

**Verification Methods**:
- **Install verification**: Check if app is installed on device
- **Level verification**: SDK integration with app (if available)
- **Daily open verification**: Check app launch timestamps

### Why It Exists
1. **Automatic Verification**: No manual proof needed
2. **Transparency**: User knows what's happening
3. **Trust**: Platform verifies requirements are met

### User Questions Answered
- ✅ "What's happening?" - "Verifying your progress"
- ✅ "How long will it take?" - "Please wait" (2-5 seconds)

### Eye Movement
1. User sees spinner (center)
2. User reads "Verifying..." (center)
3. User waits for completion

**Total Time**: 5 seconds

### Interaction
- **No interaction**: User waits for verification
- **No back button**: Verification is automatic

### Error States
- **Verification fails**: "Verification Failed" message + "Retry" or "Cancel"
- **Requirements not met**: "You need to reach level 3" + "Continue" or "Cancel"
- **Network error**: "Connection lost" + "Retry" or "Go Home"

**Error State Design**:
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│           ⚠️                        │
│                                     │
│      Verification Failed            │
│                                     │
│  Make sure you've installed the     │
│  app and reached level 3.           │
│                                     │
│      [Retry]  [Cancel]              │
│                                     │
└─────────────────────────────────────┘
```

### Accessibility
- Screen reader: "Verifying your progress, Please wait"
- No keyboard controls (automatic process)
- Spinner animates (respects reduced motion)

---

## SCREEN 5: COMPLETION SCREEN
**Position**: After verification succeeds, full-screen overlay
**Duration**: 3 seconds (auto-advance) or until user taps "Claim"
**Priority**: ⭐⭐⭐⭐⭐ (HIGHEST)

### What It Displays
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│                                     │
│              ✓                      │ ← Success icon, 48x48px
│                                     │
│         Task Completed              │ ← H2, 18px, Semibold
│                                     │
│         +200 FC                     │ ← Highlighted, 24px, Semibold, Primary color
│                                     │
│      ≈ $2.00 USD                   │ ← Caption, 13px, Regular, Neutral 500
│                                     │
│         [Claim]                     │ ← Primary button, full width
│                                     │
│                                     │
└─────────────────────────────────────┘
```

**Visual Treatment**:
- Full-screen overlay (white background)
- Success icon: 48x48px, center, Success color (green)
- Title: 18px, Semibold, Neutral 900
- Reward: 24px, Semibold, Primary color (highlighted)
- USD equivalent: 13px, Regular, Neutral 500
- Button: Primary, full width, bottom
- NO shadow

**Animation**:
- Icon scales in: 1.0 → 1.2 → 1.0 (300ms)
- Reward text fades in: 200ms
- Button fades in: 200ms

### Why It Exists
1. **Confirmation**: User knows task was completed
2. **Reward Display**: User sees exact FC earned
3. **Action**: User taps "Claim" to credit FC
4. **Closure**: Clear end to flow

### User Questions Answered
- ✅ "Did I complete the task?" - "Task Completed" (checkmark)
- ✅ "How much did I earn?" - "+200 FC" (highlighted)
- ✅ "What's next?" - "Claim" button

### Eye Movement
1. User sees checkmark icon (center)
2. User reads "Task Completed" (title)
3. User focuses on "+200 FC" (highlighted, large)
4. User reads "≈ $2.00 USD" (secondary)
5. User taps "Claim" button

**Total Time**: 3 seconds (or until user taps)

### Interaction
- **Claim button**: Credits FC to user → Navigates to Home
- **Auto-advance**: After 3 seconds, automatically claims and returns to Home
- **No back button**: Flow is complete, no going back

**Claim Action**:
1. FC credited to user balance (real-time via WebSocket)
2. Balance updates immediately
3. Transaction recorded
4. Navigate to Home
5. Toast notification: "You earned 200 FC"

### Why This Placement
- **Full-screen**: Clear completion, no distractions
- **Highlighted reward**: Emphasizes earning
- **Auto-advance**: Reduces friction (user doesn't have to tap)

### Accessibility
- Screen reader: "Task Completed, You earned 200 FC, approximately 2 dollars, Claim button"
- Touch target: Claim button 48x48px minimum
- High contrast: Primary color on white (4.5:1 minimum)

---

## COMPLETE USER SCENARIO

### Scenario: User Installs App

**Time: 0:00 - 5:00 (5 minutes total)**

```
┌─────────────────────────────────────┐
│ ← Install Apps                      │ ← 0:00-0:05: User sees app list
│                                     │
│ ▸ GameX                             │
│   by GameStudio                     │
│   Earn 200 FC                       │
│   Reach level 3                     │
│   Progress: 0/3                     │
└─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────┐
│ ← Task Details                      │ ← 0:05-0:10: User sees task details
│                                     │
│         [App Icon]                  │
│      Install GameX                  │
│      by GameStudio                  │
│                                     │
│  Install GameX and reach level 3    │
│  to earn FC.                        │
│                                     │
│  Earn: 200 FC (≈ $2.00 USD)        │
│  Requirements:                      │
│  • Install GameX from App Store     │
│  • Complete tutorial                │
│  • Reach level 3                    │
│                                     │
│  [Open App Store]                   │
└─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────┐
│                                     │ ← 0:10-3:00: User in App Store
│         [APP STORE]                 │
│                                     │
│  [Get]                              │
│                                     │
│  User installs GameX                │
│  User opens GameX                   │
│  User completes tutorial            │
│  User reaches level 3               │
│                                     │
└─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────┐
│                                     │ ← 3:00-3:05: User returns to Fee
│           ⏳                         │
│      Verifying...                   │
│  Please wait while we verify        │
│  your progress.                     │
│                                     │
└─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────┐
│                                     │ ← 3:05-3:08: Completion
│              ✓                      │
│         Task Completed              │
│         +200 FC                     │
│      ≈ $2.00 USD                   │
│         [Claim]                     │
└─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────┐
│ ≡ Fee                      ⚙️      │ ← 3:08: User returns to Home
│ ┌─────────────────────────────┐    │
│ │ Your Balance                │    │
│ │ 200 FC                      │    │ ← Balance updated!
│ │ ≈ $2.00 USD                │    │
│ └─────────────────────────────┘    │
│                                     │
│ Recent Activity                     │
│ ✓ Installed GameX           +200 FC │
│   3 minutes ago                     │
└─────────────────────────────────────┘
```

**User's Internal Monologue**:
- "I can install GameX to earn 200 FC" (0:05)
- "I need to reach level 3" (0:10)
- "I'll install it" (0:10)
- [Installs app, completes tutorial, reaches level 3] (0:10-3:00)
- "I earned 200 FC" (3:05)
- "Let me claim it" (3:07)
- "My balance is now 200 FC" (3:08)

**Action**: User returns to Home, sees updated balance

---

## FLOW PRIORITIZATION

### Priority 1: App Offers List (⭐⭐⭐⭐⭐)
**Why**: Central hub for all app offers
**When**: First screen in flow
**Action**: Tap app to start

### Priority 2: Completion Screen (⭐⭐⭐⭐⭐)
**Why**: Confirmation and reward display
**When**: After verification
**Action**: Tap "Claim" or auto-advance

### Priority 3: Task Detail (⭐⭐⭐⭐)
**Why**: Sets expectations, reduces drop-off
**When**: Before App Store
**Action**: Tap "Open App Store"

### Priority 4: Verification Screen (⭐⭐⭐⭐)
**Why**: Automatic verification, transparency
**When**: After user returns from App Store
**Action**: Automatic (no user action)

---

## INFORMATION HIERARCHY

### Visual Hierarchy (Within Flow)

**1. App Offers List (App Name + Reward)**
- Size: 15px, Semibold
- Color: Neutral 900
- Purpose: App identification

**2. Reward Amount**
- Size: 15px, Semibold
- Color: Primary color
- Purpose: Motivation

**3. Requirements**
- Size: 13px, Regular
- Color: Neutral 500
- Purpose: Planning

**4. Progress Bar**
- Size: 4px height
- Color: Primary color
- Purpose: Progress tracking

---

## UX PRINCIPLES APPLIED

### 1. Seamless Transitions
- Deep link to App Store (no copy-paste)
- Auto-verification (no manual proof)
- Smooth return to Fee

### 2. Clear Expectations
- Reward shown before installing
- Requirements shown before starting
- Progress tracking for multi-step tasks

### 3. Immediate Feedback
- Balance updates immediately after claiming
- Toast notification confirms earning
- Smooth transition back to Home

### 4. Respectful Design
- No time pressure (users take their time)
- No dark patterns
- Clear error messages

### 5. Error Recovery
- Verification retry option
- "Cancel" button to exit
- "Go Home" escape route

---

## COMPARISON: APP STORE vs. GOOGLE PLAY vs. FEE

### App Store
- **Pattern**: App cards with icon, name, developer, rating
- **Actions**: Get, Open, Download
- **Progress**: Download progress bar
- **Style**: Clean, professional, visual

### Google Play
- **Pattern**: App cards with icon, name, developer, rating
- **Actions**: Install, Open, Uninstall
- **Progress**: Download and install progress
- **Style**: Clean, professional, visual

### Fee
- **Pattern**: App cards with icon, name, developer, reward ✅
- **Actions**: Open App Store, Verify, Claim ✅
- **Progress**: Task progress bar (install, level, days) ✅
- **Style**: Clean, professional, minimal ✅

**Fee follows both patterns**: App Store/Play (professional app cards) + Fee (reward-focused)

---

## RESPONSIVE BEHAVIOR

### Mobile (375px) - Primary
- Full-width app cards (100% - 32px)
- App icon: 48x48px
- Progress bar: Full width

### Tablet (768px)
- App cards centered, max-width 600px
- App icon: 48x48px
- Progress bar: Max-width 600px

### Desktop (1024px+)
- Constrained to mobile width (375-414px), centered
- Same as mobile (Telegram Mini Apps stay mobile-width)

---

## ACCESSIBILITY CHECKLIST

### Visual
- [x] Text: Neutral 900 on white (14.7:1 ratio)
- [x] Secondary text: Neutral 500 on white (7.2:1 ratio)
- [x] Caption text: Neutral 400 on white (4.6:1 ratio) - WCAG AA compliant
- [x] Reward text: Primary color on white (4.5:1 minimum)

### Motor
- [x] App cards: 44x44px minimum
- [x] Buttons: 48x48px minimum
- [x] Spacing: 8px minimum between touch targets

### Cognitive
- [x] Simple language: "Install", "Earn", "Reach level"
- [x] Clear labels: "Earn 200 FC", "Reach level 3"
- [x] Consistent patterns: Same app card style
- [x] No surprises: Clear requirements

### Screen Reader
- [x] Semantic headings: H1, H2, H3
- [x] ARIA labels: All apps, buttons, progress
- [x] Live regions: Verification status, completion
- [x] Descriptive text: "GameX, by GameStudio, Earn 200 FC, Reach level 3"

---

## PERFORMANCE OPTIMIZATION

### Load Time
- **Target**: < 2 seconds
- **App offers list**: Cached for 5 minutes (Redis)
- **Verification**: 2-5 seconds (automatic)
- **Completion screen**: Instant (no loading)

### Deep Linking
- **iOS**: Universal Links (https://fee.app/app/xyz)
- **Android**: App Links (https://fee.app/app/xyz)
- **Fallback**: Manual App Store/Play Store link

### Verification
- **Method**: Device check + SDK integration (if available)
- **Caching**: Cache verification result for 24 hours
- **Retry**: Allow retry if verification fails

### Perceived Performance
- **Skeleton screens**: Show app list structure while loading
- **Optimistic UI**: Show completion immediately, verify in background
- **Progressive loading**: Load app list first, then details

---

## USABILITY TESTING CHECKLIST

### First-Time User
- [ ] User can find app offers easily
- [ ] User can understand requirements
- [ ] User can open App Store/Play Store
- [ ] User can return to Fee
- [ ] User sees verification screen
- [ ] User can claim FC

### Returning User
- [ ] User can see progress on multi-step tasks
- [ ] User can continue where they left off
- [ ] User understands verification process
- [ ] User sees balance update after claiming

### Accessibility
- [ ] Screen reader user can navigate app list
- [ ] Screen reader user understands verification
- [ ] Screen reader user can claim FC
- [ ] User with motor impairments can tap all buttons

---

## SUCCESS METRICS

### App Install Completion
- **Target**: 50% completion rate (users who start install finish it)
- **Target**: 70% verification success rate
- **Target**: < 5 seconds verification time

### User Satisfaction
- **Target**: < 2% support tickets about app installs
- [ ] Target: 90% of users understand app install flow
- **Target**: 60% of users install multiple apps per month

### Engagement
- **Target**: Average 2-3 app installs per user per month
- **Target**: 50% of users complete first app install
- **Target**: 30% of users complete second app install

---

## ANTI-PATTERNS TO AVOID

### ❌ Avoid
- Required account creation (for offers)
- Hidden requirements
- Manual verification (upload screenshots, etc.)
- No progress tracking
- Fake progress bars
- Multiple apps at once
- Auto-install (user must consent)

### ✅ Embrace
- Clear requirements
- Automatic verification
- Progress tracking for multi-step tasks
- Transparent reward display
- Deep linking to App Store/Play Store
- One app at a time
- User consent (user taps to install)

---

## IMPLEMENTATION NOTES

### Deep Linking
**iOS**: Universal Links
- https://fee.app/app/xyz → Opens App Store
- https://fee.app/return → Returns to Fee

**Android**: App Links
- https://fee.app/app/xyz → Opens Play Store
- https://fee.app/return → Returns to Fee

**Fallback**: If deep link fails, show manual instructions

### Verification Methods
**Method 1: Device Check**
- Check if app is installed on device
- Limited to iOS (can check installed apps)
- Not available on Android (privacy restrictions)

**Method 2: SDK Integration**
- App integrates Fee SDK
- SDK reports progress to Fee
- Most accurate, requires app developer cooperation

**Method 3: Manual Verification**
- User taps "I've completed this task"
- Manual review by support team
- Fallback if automatic verification fails

### Progress Tracking
**Multi-Step Tasks**:
- Track each step (install, tutorial, level 3)
- Update progress in real-time (if SDK available)
- Show progress bar in app offers list

**Daily Tasks**:
- Track daily opens (timestamp check)
- Reset at midnight UTC
- Show remaining days (e.g., "5/7 days")

### Tracking
**Events**:
- app_offer_viewed: User views app offer
- app_offer_started: User taps "Open App Store"
- app_installed: App is installed (if verifiable)
- app_opened: App is opened (if SDK available)
- app_progress: Level reached, days completed
- app_completed: All requirements met
- app_verification_failed: Verification fails

---

## CONCLUSION

The Install Apps flow is designed to be seamless, transparent, and respectful. It answers key questions:

- ✅ "What apps can I install?" - App Offers List shows options
- ✅ "What will I earn?" - Task Detail shows reward
- ✅ "What do I need to do?" - Requirements listed
- ✅ "How do I install?" - "Open App Store" button
- ✅ "How do I verify?" - Automatic verification
- ✅ "How much did I earn?" - "+200 FC" displayed prominently

**Design Philosophy**: App Store (professional, familiar) + Fee (reward-focused, transparent)

**Key Principles**:
- Seamless deep linking to App Store/Play Store
- Automatic verification (no manual proof)
- Progress tracking for multi-step tasks
- Clear requirements and rewards
- Immediate feedback (balance updates)

**No manual verification. No screenshot uploads. No complicated processes. Just install, complete, earn.**

---

*Install Apps Flow UX Version 1.0*
*Created: 2026-07-18*
*Status: Ready for Visual Design*
*Next Step: Refer Friends Flow UX*