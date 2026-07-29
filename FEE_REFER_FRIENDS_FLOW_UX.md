# FEE - Refer Friends Flow UX
## Referral Dashboard & Sharing Experience

---

## CORE UX MISSION

**Purpose**: Enable users to share referral code/link and track referrals
**Inspiration**: Telegram Invite Links + Dropbox Referrals + Apple Wallet Sharing
**Principle**: Simple sharing, transparent tracking, immediate rewards

---

## FLOW POSITION IN APP

**Access**: Home → Primary Actions → "Refer Friends" OR Available Now → referral task
**Priority**: Quaternary earning method
**User Segment**: All users (100%)
**Frequency**: Monthly (20% of users)

---

## COMPLETE FLOW SPECIFICATION

### Flow Overview
```
Home
  ↓
Referral Dashboard
  ↓
Share via Telegram (user action)
  ↓
Friend completes first task (days later)
  ↓
Reward Notification (automatic)
  ↓
Referral Dashboard (updated)
```

**Total Flow Time**: 30 seconds to share, days for reward
**Success Metric**: 20% of users refer at least 1 friend

---

## SCREEN 1: REFERRAL DASHBOARD
**Position**: Between Home and Share Action
**Scan Time**: 5 seconds
**Priority**: ⭐⭐⭐⭐⭐ (HIGHEST)

### What It Displays
```
← Refer Friends ← Back button

┌─────────────────────────────────────┐
│                                     │
│  Your Referral Code                 │ ← Section label, 11px, Overline
│                                     │
│  FEE-JOHN-2024                      │ ← Code, 24px, Semibold, Primary color
│  [Copy]                             │ ← Secondary button
│                                     │
├─────────────────────────────────────┤
│                                     │
│  Your Referral Link                 │ ← Section label, 11px, Overline
│                                     │
│  https://t.me/FeeBot?               │ ← Link text, 13px, Regular
│  start=FEE-JOHN-2024                │
│                                     │
│  [Copy]              [Share]        │ ← Secondary buttons
│                                     │
├─────────────────────────────────────┤
│                                     │
│  Your Referrals                     │ ← Section label, 11px, Overline
│                                     │
│  Total: 0                           │ ← Metric, 18px, Semibold
│  Earned: 0 FC                       │ ← Metric, 18px, Semibold
│                                     │
│  No referrals yet                   │ ← Empty state message
│  Share your code with friends       │ ← Caption, 13px, Regular
│  to earn 500 FC each.               │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  How It Works                       │ ← Section label, 11px, Overline
│                                     │
│  1. Share your code or link         │ ← Step (15px, Regular)
│  2. Friend opens link and joins     │ ← Step
│  3. Friend completes first task     │ ← Step
│  4. Both receive 500 FC             │ ← Step
│                                     │
└─────────────────────────────────────┘
```

**Visual Treatment**:
- Header: 56px, with back button
- Sections: Grouped by cards or dividers
- Referral code: 24px, Semibold, Primary color (highlighted)
- Referral link: 13px, Regular, Neutral 800
- Buttons: Secondary, 48px height
- Metrics: 18px, Semibold, Neutral 900
- Steps: 15px, Regular, Neutral 800
- NO shadow
- NO border radius (flat design)

**Referral Code Format**: FEE-{NAME}-{YEAR}
- Example: FEE-JOHN-2024
- Unique per user
- Easy to remember and share

**Referral Link Format**: https://t.me/FeeBot?start=FEE-JOHN-2024
- Telegram deep link
- Opens Fee bot with referral code
- Auto-registers referral

### Why It Exists
1. **Viral Growth**: Users share code/link with friends
2. **Transparency**: Users see their referrals and earnings
3. **Motivation**: Clear reward (500 FC per referral)
4. **Education**: "How It Works" explains process

### User Questions Answered
- ✅ "What is my referral code?" - "FEE-JOHN-2024"
- ✅ "What is my referral link?" - "https://t.me/FeeBot?start=FEE-JOHN-2024"
- ✅ "How do I share?" - "Copy" or "Share" buttons
- ✅ "How many referrals do I have?" - "Total: 0"
- ✅ "How much have I earned?" - "Earned: 0 FC"
- ✅ "How does it work?" - 4-step process

### Eye Movement
1. User reads "Refer Friends" (header)
2. User sees referral code (large, highlighted)
3. User sees referral link (below code)
4. User sees "Copy" and "Share" buttons
5. User scans "Your Referrals" section
6. User reads "How It Works" section

**Total Time**: 5 seconds

### Interaction
- **Copy code button**: Copies code to clipboard → Toast "Copied!"
- **Copy link button**: Copies link to clipboard → Toast "Copied!"
- **Share button**: Opens Telegram share sheet → User selects contact/group
- **Back button**: Returns to Home

**Share Flow**:
1. User taps "Share" button
2. Telegram share sheet opens
3. User selects contact or group
4. Message sent: "Join Fee and earn FC! Use my link: https://t.me/FeeBot?start=FEE-JOHN-2024"
5. Friend receives message
6. Friend taps link
7. Friend opens Fee
8. Friend completes first task
9. Both users receive 500 FC

### Why This Placement
- **Between Home and Share**: Natural flow
- **Code + Link**: Two ways to share (code for verbal, link for digital)
- **Referrals section**: Shows progress and earnings
- **How It Works**: Educates users

### Empty State (No Referrals)
```
Your Referrals

Total: 0
Earned: 0 FC

No referrals yet.
Share your code with friends to earn 500 FC each.
```

### Accessibility
- Screen reader: "Refer Friends, Your Referral Code, FEE-JOHN-2024, Copy button, Your Referral Link, https://t.me/FeeBot?start=FEE-JOHN-2024, Copy button, Share button, Your Referrals, Total 0, Earned 0 FC, No referrals yet, Share your code with friends to earn 500 FC each"
- Touch target: Buttons 48x48px minimum
- High contrast: Neutral 900 on white (14.7:1 ratio)

---

## SCREEN 2: SHARE VIA TELEGRAM (User Action)
**Position**: Outside Fee (Telegram app)
**Duration**: 10-30 seconds
**Priority**: ⭐⭐⭐⭐⭐ (HIGHEST)

### What User Does
1. **Telegram share sheet opens** (from Fee)
2. **User selects contact or group** (or copies link)
3. **User sends message** (if sharing to contact/group)
4. **Message sent**: "Join Fee and earn FC! Use my link: https://t.me/FeeBot?start=FEE-JOHN-2024"
5. **User returns to Fee** (automatic)

### Why This Exists
1. **Native Sharing**: Uses Telegram's native share sheet
2. **Trust**: Users share via trusted platform
3. **Convenience**: One-tap sharing

### User Questions Answered
- ✅ "How do I share?" - "Tap Share button, select contact"
- ✅ "What message is sent?" - Pre-written message with link

### Eye Movement
- User is in Telegram (outside Fee)
- User selects contact or group
- User sends message

**Total Time**: 10-30 seconds

### Interaction
- **Select contact**: Opens chat with contact
- **Send message**: Sends referral message
- **Return to Fee**: Automatic (deep link)

### Error States
- **User cancels**: No action (user returns to Fee)
- **No Telegram installed**: "Please install Telegram to share" (rare)

### Accessibility
- Telegram share sheet accessibility is handled by Telegram
- Fee is not responsible for external app accessibility

---

## SCREEN 3: REWARD NOTIFICATION (Automatic)
**Position**: System notification (push notification)
**Duration**: Instant
**Priority**: ⭐⭐⭐⭐⭐ (HIGHEST)

### What It Displays
```
┌─────────────────────────────────────┐
│ Fee                                 │ ← App name
│                                     │
│ Referral Reward                     │ ← Title
│                                     │
│ Your friend @johndoe completed      │ ← Body
│ their first task.                   │
│ You earned 500 FC.                  │
│                                     │
│ [Open]                             │ ← Action button
└─────────────────────────────────────┘
```

**Visual Treatment**:
- Standard Telegram push notification
- App icon: Fee logo
- Title: "Referral Reward"
- Body: "Your friend @johndoe completed their first task. You earned 500 FC."
- Action button: "Open"

**Notification Timing**:
- Sent immediately after friend completes first task
- Real-time via WebSocket or push notification

### Why It Exists
1. **Immediate Feedback**: User knows referral was successful
2. **Reward Confirmation**: User sees exact FC earned
3. **Engagement**: User opens app to see updated balance

### User Questions Answered
- ✅ "Did my friend complete the task?" - "Yes, @johndoe completed their first task"
- ✅ "How much did I earn?" - "You earned 500 FC"

### Eye Movement
1. User sees notification (system level)
2. User reads title: "Referral Reward"
3. User reads body: "Your friend @johndoe completed their first task. You earned 500 FC."
4. User taps "Open" (optional)

**Total Time**: 2 seconds

### Interaction
- **Tap notification**: Opens Fee → Referral Dashboard (updated)
- **Dismiss**: No action (user can check later in app)

### Why This Placement
- **System notification**: Immediate, attention-grabbing
- **Real-time**: Sent immediately after friend completes task

### Accessibility
- Screen reader: "Referral Reward, Your friend @johndoe completed their first task, You earned 500 FC, Open button"
- Standard Telegram notification accessibility

---

## SCREEN 4: REFERRAL DASHBOARD (Updated)
**Position**: After friend completes task
**Scan Time**: 3 seconds
**Priority**: ⭐⭐⭐⭐⭐ (HIGHEST)

### What It Displays
```
← Refer Friends ← Back button

┌─────────────────────────────────────┐
│                                     │
│  Your Referral Code                 │
│  FEE-JOHN-2024                      │
│  [Copy]                             │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  Your Referral Link                 │
│  https://t.me/FeeBot?               │
│  start=FEE-JOHN-2024                │
│  [Copy]              [Share]        │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  Your Referrals                     │
│                                     │
│  Total: 1                           │ ← Updated!
│  Earned: 500 FC                     │ ← Updated!
│                                     │
│  @johndoe                           │ ← New referral
│  Status: Rewarded                   │ ← Status
│  +500 FC                            │ ← Reward
│  2 hours ago                        │ ← Timestamp
│                                     │
├─────────────────────────────────────┤
│                                     │
│  How It Works                       │
│  ...                                │
│                                     │
└─────────────────────────────────────┘
```

**Visual Treatment**:
- Same as initial Referral Dashboard
- New referral appears at top of list
- Metrics updated (Total: 1, Earned: 500 FC)
- New referral highlighted (subtle animation)

**Referral List Item**:
```
@johndoe                           ← Username (15px, Regular, Neutral 800)
Status: Rewarded                   ← Status (13px, Regular, Success color)
+500 FC                            ← Reward (15px, Medium, Primary color)
2 hours ago                        ← Timestamp (11px, Overline, Neutral 400)
```

**Referral Statuses**:
- **Pending**: Friend opened link, but hasn't completed task yet
- **Active**: Friend completed first task, reward pending
- **Rewarded**: Reward credited to both users

### Why It Exists
1. **Transparency**: Users see all referrals and their status
2. **Verification**: Users can confirm rewards were credited
3. **Motivation**: Seeing referrals encourages more sharing

### User Questions Answered
- ✅ "Who did I refer?" - "@johndoe"
- ✅ "What's their status?" - "Rewarded"
- ✅ "How much did I earn?" - "+500 FC"
- ✅ "When did they join?" - "2 hours ago"

### Eye Movement
1. User reads "Refer Friends" (header)
2. User scans "Your Referrals" section
3. User sees updated metrics (Total: 1, Earned: 500 FC)
4. User reads new referral (@johndoe, Rewarded, +500 FC)
5. User may scan other sections

**Total Time**: 3 seconds

### Interaction
- **Referral list**: Read-only (no navigation)
- **Copy/Share buttons**: Same as before
- **Back button**: Returns to Home

### Why This Placement
- **Updated dashboard**: Shows real-time referral status
- **New referral highlighted**: Draws attention to reward

### Accessibility
- Screen reader: "Refer Friends, Your Referrals, Total 1, Earned 500 FC, @johndoe, Status Rewarded, plus 500 FC, 2 hours ago"
- Touch target: Buttons 48x48px minimum
- High contrast: Neutral 900 on white (14.7:1 ratio)

---

## COMPLETE USER SCENARIO

### Scenario: User Shares Referral Link

**Time: 0:00 - 0:30 (30 seconds)**

```
┌─────────────────────────────────────┐
│ ← Refer Friends                     │ ← 0:00-0:05: User sees dashboard
│                                     │
│ Your Referral Code                  │
│ FEE-JOHN-2024                       │
│ [Copy]                              │
│                                     │
│ Your Referral Link                  │
│ https://t.me/FeeBot?                │
│ start=FEE-JOHN-2024                 │
│ [Copy]              [Share]         │
│                                     │
│ Your Referrals                      │
│ Total: 0                            │
│ Earned: 0 FC                        │
│                                     │
│ No referrals yet                    │
│ Share your code with friends        │
│ to earn 500 FC each.                │
│                                     │
│ How It Works                        │
│ 1. Share your code or link          │
│ 2. Friend opens link and joins      │
│ 3. Friend completes first task      │
│ 4. Both receive 500 FC              │
└─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────┐
│                                     │ ← 0:05-0:10: User taps Share
│         [TELEGRAM SHARE SHEET]      │
│                                     │
│  Select contact or group:           │
│  👤 John Smith                      │
│  👤 Jane Doe                        │
│  👥 Friends Group                   │
│  👥 Colleagues                      │
│                                     │
│  [Cancel]                           │
└─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────┐
│                                     │ ← 0:10-0:15: User selects contact
│         [TELEGRAM CHAT]             │
│                                     │
│  To: Jane Doe                       │
│                                     │
│  Join Fee and earn FC!              │
│  Use my link:                       │
│  https://t.me/FeeBot?               │
│  start=FEE-JOHN-2024                │
│                                     │
│  [Send]                             │
└─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────┐
│                                     │ ← 0:15: Message sent
│         [TELEGRAM CHAT]             │
│                                     │
│  Message sent!                      │
│                                     │
│  [Return to Fee]                    │
│                                     │
└─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────┐
│ ← Refer Friends                     │ ← 0:15-0:20: User returns to Fee
│                                     │
│ Your Referral Code                  │
│ FEE-JOHN-2024                       │
│ [Copy]                              │
│                                     │
│ Your Referral Link                  │
│ https://t.me/FeeBot?                │
│ start=FEE-JOHN-2024                 │
│ [Copy]              [Share]         │
│                                     │
│ Your Referrals                      │
│ Total: 0                            │
│ Earned: 0 FC                        │
│ (Waiting for friend to complete     │
│  first task)                        │
│                                     │
│ How It Works                        │
│ ...                                 │
└─────────────────────────────────────┘
```

**User's Internal Monologue**:
- "I can refer friends to earn 500 FC each" (0:05)
- "I'll share my link with Jane" (0:10)
- "Message sent" (0:15)
- "Now I wait for Jane to complete her first task" (0:20)

**Action**: User returns to Home, waits for friend to complete task

---

## REWARD NOTIFICATION (Days Later)

**Time: 0:00 - 0:02 (2 seconds)**

```
┌─────────────────────────────────────┐
│ Fee                                 │
│                                     │
│ Referral Reward                     │
│                                     │
│ Your friend @janedoe completed      │
│ their first task.                   │
│ You earned 500 FC.                  │
│                                     │
│ [Open]                             │
└─────────────────────────────────────┘
```

**User's Internal Monologue**:
- "Jane completed her first task!" (0:02)
- "I earned 500 FC" (0:02)
- "Let me open Fee to see my balance" (0:02)

**Action**: User taps notification, opens Fee

---

## REFERRAL DASHBOARD (Updated)

**Time: 0:00 - 0:03 (3 seconds)**

```
┌─────────────────────────────────────┐
│ ← Refer Friends                     │
│                                     │
│ Your Referral Code                  │
│ FEE-JOHN-2024                       │
│ [Copy]                              │
│                                     │
│ Your Referral Link                  │
│ https://t.me/FeeBot?                │
│ start=FEE-JOHN-2024                 │
│ [Copy]              [Share]         │
│                                     │
│ Your Referrals                      │
│ Total: 1                            │ ← Updated!
│ Earned: 500 FC                      │ ← Updated!
│                                     │
│ @janedoe                            │ ← New referral
│ Status: Rewarded                    │
│ +500 FC                             │
│ 2 hours ago                         │
│                                     │
│ How It Works                        │
│ ...                                 │
└─────────────────────────────────────┘
```

**User's Internal Monologue**:
- "I have 1 referral" (0:03)
- "Jane completed her first task" (0:03)
- "I earned 500 FC" (0:03)
- "My balance should be updated" (0:03)

**Action**: User taps back, returns to Home, sees updated balance

---

## FLOW PRIORITIZATION

### Priority 1: Referral Dashboard (⭐⭐⭐⭐⭐)
**Why**: Central hub for sharing and tracking
**When**: First screen in flow
**Action**: Copy or share code/link

### Priority 2: Reward Notification (⭐⭐⭐⭐⭐)
**Why**: Confirms referral success
**When**: After friend completes task
**Action**: Tap to open app

### Priority 3: Share via Telegram (⭐⭐⭐⭐)
**Why**: Actual sharing mechanism
**When**: After user taps "Share"
**Action**: Select contact, send message

### Priority 4: Updated Dashboard (⭐⭐⭐⭐)
**Why**: Shows referral status
**When**: After reward is credited
**Action**: Read-only

---

## INFORMATION HIERARCHY

### Visual Hierarchy (Within Flow)

**1. Referral Code**
- Size: 24px, Semibold
- Color: Primary color
- Purpose: Primary sharing method

**2. Referral Link**
- Size: 13px, Regular
- Color: Neutral 800
- Purpose: Secondary sharing method

**3. Metrics (Total, Earned)**
- Size: 18px, Semibold
- Color: Neutral 900
- Purpose: Referral tracking

**4. Referral List**
- Size: 15px, Regular
- Color: Neutral 800
- Purpose: Detailed tracking

---

## UX PRINCIPLES APPLIED

### 1. Simple Sharing
- One-tap copy (code and link)
- One-tap share (Telegram share sheet)
- Pre-written message (no typing needed)

### 2. Transparent Tracking
- Clear metrics (total referrals, total earned)
- Detailed list (username, status, reward, timestamp)
- Real-time updates (WebSocket notification)

### 3. Immediate Feedback
- Toast notification when code/link copied
- Push notification when referral completes
- Balance updates immediately

### 4. Respectful Design
- No spam (users share intentionally)
- No fake urgency
- Clear reward explanation

### 5. Error Recovery
- Copy fallback (if share fails)
- Manual link sharing (if Telegram not installed)
- Clear error messages

---

## COMPARISON: DROPBOX REFERRALS vs. TELEGRAM INVITES vs. FEE

### Dropbox Referrals
- **Pattern**: Referral code + link, reward for both users
- **Sharing**: Email, social media, copy link
- **Tracking**: Dashboard with referrals list
- **Reward**: Extra storage space

### Telegram Invites
- **Pattern**: Invite link, track joins
- **Sharing**: Telegram contacts, groups
- **Tracking**: Simple list of invited users
- **Reward**: None

### Fee
- **Pattern**: Referral code + link, reward for both users ✅
- **Sharing**: Copy, Telegram share sheet ✅
- **Tracking**: Dashboard with referrals list, status, rewards ✅
- **Reward**: 500 FC for both users ✅

**Fee follows both patterns**: Dropbox (reward structure) + Telegram (native sharing)

---

## RESPONSIVE BEHAVIOR

### Mobile (375px) - Primary
- Full-width dashboard (100% - 32px)
- Code and link full width
- Buttons side-by-side (Copy + Share)

### Tablet (768px)
- Dashboard centered, max-width 600px
- Code and link centered
- Buttons side-by-side

### Desktop (1024px+)
- Constrained to mobile width (375-414px), centered
- Same as mobile (Telegram Mini Apps stay mobile-width)

---

## ACCESSIBILITY CHECKLIST

### Visual
- [x] Text: Neutral 900 on white (14.7:1 ratio)
- [x] Secondary text: Neutral 500 on white (7.2:1 ratio)
- [x] Caption text: Neutral 400 on white (4.6:1 ratio) - WCAG AA compliant
- [x] Code/link: Primary color on white (4.5:1 minimum)

### Motor
- [x] Buttons: 48x48px minimum
- [x] Code/link: 44x44px minimum (copy target)
- [x] Spacing: 8px minimum between touch targets

### Cognitive
- [x] Simple language: "Referral Code", "Share", "Earn 500 FC"
- [x] Clear labels: "Copy", "Share"
- [x] Consistent patterns: Same button style
- [x] No surprises: Clear reward explanation

### Screen Reader
- [x] Semantic headings: H1, H2, H3
- [x] ARIA labels: All buttons, code, link
- [x] Live regions: New referral notification
- [x] Descriptive text: "Your Referral Code, FEE-JOHN-2024, Copy button"

---

## PERFORMANCE OPTIMIZATION

### Load Time
- **Target**: < 2 seconds
- **Dashboard**: Cached (loaded once)
- **Referral list**: Cached for 1 minute (Redis)
- **Notification**: Real-time (WebSocket)

### Sharing
- **Copy to clipboard**: Instant
- **Telegram share sheet**: Instant (native)
- **Deep link**: Instant

### Real-time Updates
- **WebSocket**: Real-time referral status updates
- **Push notification**: Immediate notification
- **Balance update**: Real-time via WebSocket

### Perceived Performance
- **Skeleton screens**: Show dashboard structure while loading
- **Optimistic UI**: Show "Copied!" immediately
- **Progressive loading**: Load code/link first, then referrals

---

## USABILITY TESTING CHECKLIST

### First-Time User
- [ ] User can find referral code
- [ ] User can copy code
- [ ] User can copy link
- [ ] User can share via Telegram
- [ ] User understands how referrals work
- [ ] User knows reward amount

### Returning User
- [ ] User can see referral history
- [ ] User can see referral status
- [ ] User can see total earnings from referrals
- [ ] User receives notification when referral completes

### Accessibility
- [ ] Screen reader user can navigate dashboard
- [ ] Screen reader user can copy code/link
- [ ] Screen reader user can share via Telegram
- [ ] Screen reader user receives referral notification

---

## SUCCESS METRICS

### Referral Rate
- **Target**: 20% of users refer at least 1 friend
- **Target**: Average 1.5 referrals per user who refers
- **Target**: 50% of referred friends complete first task

### User Satisfaction
- **Target**: < 1% support tickets about referrals
- [ ] Target: 95% of users understand referral flow
- **Target**: 90% of users find sharing easy

### Engagement
- **Target**: Users with referrals have 30% higher retention
- **Target**: 80% of users who share get at least 1 referral
- **Target**: Average 500 FC earned per referral

---

## ANTI-PATTERNS TO AVOID

### ❌ Avoid
- Complex referral codes (hard to remember)
- Multiple sharing steps (copy → open app → paste)
- Hidden rewards (users don't know how much they'll earn)
- No tracking (users don't know if referral worked)
- Spammy sharing (forced sharing)
- Delayed notifications (users don't know if referral worked)

### ✅ Embrace
- Simple referral code (FEE-JOHN-2024)
- One-tap sharing (Copy or Share button)
- Clear reward (500 FC for both users)
- Real-time tracking (dashboard updates immediately)
- Optional sharing (users share intentionally)
- Immediate notifications (real-time via WebSocket)

---

## IMPLEMENTATION NOTES

### Referral Code Generation
**Format**: FEE-{NAME}-{YEAR}
- NAME: First 4 characters of username (or random if no username)
- YEAR: Current year (2024, 2025, etc.)
- Example: FEE-JOHN-2024, FEE-JANE-2024

**Uniqueness**: Check for duplicates, add number if needed
- Example: FEE-JOHN-2024, FEE-JOHN2-2024

### Referral Link
**Format**: https://t.me/FeeBot?start=FEE-JOHN-2024
- Deep link to Fee bot
- Auto-registers referral code
- Opens Fee Mini App

### Referral Tracking
**Database**: referrals table
- referrer_id: User who shared
- referee_id: User who joined
- referral_code: Code used
- status: pending, active, rewarded
- referrer_reward_credited: Boolean
- referee_reward_credited: Boolean

**Status Flow**:
1. Friend opens link → status: pending
2. Friend creates account → status: active
3. Friend completes first task → status: rewarded, both rewards credited

### Reward Distribution
**Amount**: 500 FC for referrer, 500 FC for referee
**Timing**: Immediately after referee completes first task
**Notification**: Push notification to referrer

### Fraud Prevention
- **IP tracking**: Detect multiple accounts from same IP
- **Device fingerprinting**: Detect fraud
- **Telegram account age**: New accounts don't count
- **Task completion**: Referee must complete first task (not just sign up)

---

## CONCLUSION

The Refer Friends flow is designed to be simple, transparent, and rewarding. It answers key questions:

- ✅ "What is my referral code?" - "FEE-JOHN-2024"
- ✅ "What is my referral link?" - "https://t.me/FeeBot?start=FEE-JOHN-2024"
- ✅ "How do I share?" - "Copy" or "Share" buttons
- ✅ "How many referrals do I have?" - Dashboard shows total
- ✅ "How much have I earned?" - Dashboard shows total FC
- ✅ "When will I get rewarded?" - After friend completes first task

**Design Philosophy**: Dropbox (reward structure) + Telegram (native sharing)

**Key Principles**:
- Simple referral code (easy to remember)
- One-tap sharing (Copy or Share)
- Transparent tracking (dashboard with status)
- Immediate rewards (500 FC for both users)
- Real-time notifications (WebSocket)

**No complicated processes. No manual verification. Just share, wait, earn.**

---

*Refer Friends Flow UX Version 1.0*
*Created: 2026-07-18*
*Status: Ready for Visual Design*
*Next Step: Balance Detail Screen UX*