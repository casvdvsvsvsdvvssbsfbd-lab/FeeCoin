# FEE - Watch Ads Flow UX
## Ad Player Experience

---

## CORE UX MISSION

**Purpose**: Enable users to watch video advertisements and earn FC
**Inspiration**: YouTube Ads + Telegram Video Player + Apple TV
**Principle**: Focused, distraction-free, transparent

---

## FLOW POSITION IN APP

**Access**: Home → Primary Actions → "Watch Ads" OR Available Now → specific ad task
**Priority**: Primary earning method
**User Segment**: All users (100%)
**Frequency**: Daily (80% of users)

---

## COMPLETE FLOW SPECIFICATION

### Flow Overview
```
Home
  ↓
Ad Queue (if multiple ads available)
  ↓
Task Detail (if shown)
  ↓
Ad Player (full-screen video)
  ↓
Completion Screen
  ↓
Home (balance updated)
```

**Total Flow Time**: 30-60 seconds per ad
**Success Metric**: 80% completion rate

---

## SCREEN 1: AD QUEUE (Optional)
**Position**: Between Home and Ad Player
**Scan Time**: 3 seconds
**Priority**: ⭐⭐⭐ (MEDIUM - only shown if multiple ads available)

### What It Displays
```
Available Ads ← Section label, 11px, Overline, Neutral 500

▸ Video Ad 1                    ← Icon + Title (15px, Regular)
  Earn 50 FC · 30 seconds       ← Caption (13px, Regular, Neutral 500)

▸ Video Ad 2                    ← Icon + Title (15px, Regular)
  Earn 50 FC · 30 seconds       ← Caption (13px, Regular, Neutral 500)

▸ Video Ad 3                    ← Icon + Title (15px, Regular)
  Earn 75 FC · 45 seconds       ← Caption (13px, Regular, Neutral 500)
```

**Visual Treatment**:
- List of available ads
- Each item: 56px minimum height
- Background: White
- Border Bottom: 1px solid Neutral 200
- Icon: 16x16px, left side (play icon)
- Title: 15px, Regular (400), Neutral 800
- Caption: 13px, Regular (400), Neutral 500
- NO shadow
- NO border radius (flat list)

### Why It Exists
1. **Choice**: Users can select which ad to watch
2. **Transparency**: Users see reward and time before starting
3. **Efficiency**: Users can pick shortest/highest paying ad

### User Questions Answered
- ✅ "What ads are available?" - List of all available ads
- ✅ "How much will I earn?" - Reward amount shown
- ✅ "How long will it take?" - Time estimate shown

### Eye Movement
1. User reads "Available Ads" label
2. User scans list top-to-bottom
3. User selects ad (usually first one or highest paying)

**Total Time**: 3 seconds

### Interaction
- **Tap ad**: Navigates to Ad Player
- **Back button**: Returns to Home (no ad started)

### Why This Placement
- **Between Home and Ad Player**: Natural flow
- **Optional**: If only 1 ad available, skip this screen

### Empty State
```
Available Ads

No ads available right now.
Check back soon or try another task.
```

### Accessibility
- Screen reader: "Available Ads, Video Ad 1, Earn 50 FC, 30 seconds, button"
- Touch target: Entire row is tappable (minimum 44x44px)
- High contrast: Neutral 800 on white (12.6:1 ratio)

---

## SCREEN 2: TASK DETAIL (Optional)
**Position**: Between Ad Queue and Ad Player
**Scan Time**: 5 seconds
**Priority**: ⭐⭐⭐⭐ (HIGH - recommended for first-time users)

### What It Displays
```
← Task Details ← Back button

┌─────────────────────────────────────┐
│                                     │
│           ▶                         │ ← Icon, 48x48px
│                                     │
│      Watch Video Ad                 │ ← H2, 18px, Semibold
│                                     │
│  Watch this 30-second video ad      │ ← Body, 15px, Regular
│  to earn FC.                        │
│                                     │
│  Earn: 50 FC (≈ $0.50 USD)         │ ← Highlighted, 18px, Semibold
│                                     │
│  Requirements:                      │ ← Overline, 11px, Neutral 500
│  • Must watch entire video          │ ← Body, 15px, Regular
│  • One completion per user          │ ← Body, 15px, Regular
│                                     │
│  Takes about 30 seconds             │ ← Caption, 13px, Regular, Neutral 500
│                                     │
│  [Start]                            │ ← Primary button, full width
│                                     │
└─────────────────────────────────────┘
```

**Visual Treatment**:
- Header: 56px, with back button
- Content: Centered, max-width 400px
- Icon: 48x48px, center
- Title: 18px, Semibold, Neutral 900
- Description: 15px, Regular, Neutral 800
- Reward: 18px, Semibold, Primary color (highlighted)
- Requirements: 15px, Regular, Neutral 800
- Time estimate: 13px, Regular, Neutral 500
- Button: Primary, full width, bottom

### Why It Exists
1. **Set Expectations**: Users know what they're getting into
2. **Transparency**: Clear requirements, no surprises
3. **Reduce Drop-off**: Users commit before starting

### User Questions Answered
- ✅ "What will I do?" - "Watch a 30-second video ad"
- ✅ "How much will I earn?" - "50 FC (≈ $0.50 USD)"
- ✅ "What are the requirements?" - "Must watch entire video, one completion per user"
- ✅ "How long will it take?" - "30 seconds"

### Eye Movement
1. User reads "Task Details" (header)
2. User sees play icon (center)
3. User reads "Watch Video Ad" (title)
4. User reads description
5. User focuses on reward (highlighted)
6. User reads requirements
7. User reads time estimate
8. User taps "Start" button

**Total Time**: 5 seconds

### Interaction
- **Back button**: Returns to Home or Ad Queue
- **Start button**: Navigates to Ad Player

### Why This Placement
- **Before Ad Player**: Sets expectations
- **Optional**: Can skip for experienced users (future optimization)

### Accessibility
- Screen reader: "Task Details, Watch Video Ad, Watch this 30-second video ad to earn FC, Earn 50 FC, approximately 50 cents, Requirements: Must watch entire video, One completion per user, Takes about 30 seconds, Start button"
- Touch target: Start button 48x48px minimum
- High contrast: Neutral 900 on white (14.7:1 ratio)

---

## SCREEN 3: AD PLAYER (Full-Screen)
**Position**: Main flow, full-screen overlay
**Duration**: 30-60 seconds (depends on ad)
**Priority**: ⭐⭐⭐⭐⭐ (HIGHEST)

### What It Displays
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│                                     │
│         [VIDEO PLAYER]              │ ← Full-screen video
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
│  ▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸ 30s ← Countdown │ ← Top right, 13px, Caption
│                                     │
│  ████████████████████░░░░ 80% ← Progress │ ← Bottom, progress bar
│                                     │
└─────────────────────────────────────┘
```

**Visual Treatment**:
- Full-screen video player (100% width, 100% height)
- Video: 16:9 aspect ratio, centered
- Countdown timer: Top right, 13px, Caption, Neutral 500
- Progress bar: Bottom, 4px height, Primary color
- NO controls (no pause, no fullscreen, no volume)
- NO skip button (until mandatory watch time is met)
- NO overlays (no watermarks, no logos)

**Video Player States**:
1. **Loading**: Spinner (center) + "Loading ad..."
2. **Playing**: Video plays, countdown timer, progress bar
3. **Paused**: Not allowed (no pause button)
4. **Completed**: Video ends, shows completion screen
5. **Error**: Error message + "Retry" or "Go Home"

### Why It Exists
1. **Focused Experience**: No distractions, just the ad
2. **Advertiser Requirement**: Must watch full video (ensures impression)
3. **Transparency**: Countdown shows remaining time
4. **Progress**: Progress bar shows advancement

### User Questions Answered
- ✅ "How long is this ad?" - Countdown timer shows remaining time
- ✅ "How much longer?" - Progress bar shows completion
- ✅ "Can I skip?" - No skip button (must watch full ad)

### Eye Movement
1. User watches video (center of screen)
2. User glances at countdown timer (top right)
3. User glances at progress bar (bottom)
4. User continues watching

**Total Time**: 30-60 seconds (passive viewing)

### Interaction
- **No interaction**: User watches video passively
- **No tap**: No pause, no skip, no controls
- **No gesture**: No swipe, no pinch, no zoom

**Error States**:
- **Ad fails to load**: "Ad Unavailable" message + "Try Another Task" button
- **Network error**: "Connection Lost" message + "Retry" button
- **Video playback error**: "Playback Error" message + "Retry" button

**Error State Design**:
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│                                     │
│           ⚠️                        │
│                                     │
│      Ad Unavailable                 │
│                                     │
│  This ad could not be loaded.       │
│  Try another task or check back     │
│  later.                             │
│                                     │
│      [Try Another Task]  [Go Home]  │
│                                     │
└─────────────────────────────────────┘
```

### Why This Placement
- **Full-screen**: No distractions, focused on ad
- **No controls**: Ensures advertiser gets full impression
- **Countdown + Progress**: Transparency about time remaining

### Accessibility
- Screen reader: "Video ad playing, 30 seconds remaining, 80% complete"
- No keyboard controls (passive viewing)
- No reduced motion (video is content, not decoration)

---

## SCREEN 4: COMPLETION SCREEN
**Position**: After ad finishes, full-screen overlay
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
│         Ad Completed                │ ← H2, 18px, Semibold
│                                     │
│         +50 FC                      │ ← Highlighted, 24px, Semibold, Primary color
│                                     │
│      ≈ $0.50 USD                   │ ← Caption, 13px, Regular, Neutral 500
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
- NO animation (except subtle scale on icon)

**Animation**:
- Icon scales in: 1.0 → 1.2 → 1.0 (300ms)
- Reward text fades in: 200ms
- Button fades in: 200ms

### Why It Exists
1. **Confirmation**: User knows ad was completed
2. **Reward Display**: User sees exact FC earned
3. **Action**: User taps "Claim" to credit FC
4. **Closure**: Clear end to flow

### User Questions Answered
- ✅ "Did I complete the ad?" - "Ad Completed" (checkmark)
- ✅ "How much did I earn?" - "+50 FC" (highlighted)
- ✅ "What's next?" - "Claim" button

### Eye Movement
1. User sees checkmark icon (center)
2. User reads "Ad Completed" (title)
3. User focuses on "+50 FC" (highlighted, large)
4. User reads "≈ $0.50 USD" (secondary)
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
5. Toast notification: "You earned 50 FC"

### Why This Placement
- **Full-screen**: Clear completion, no distractions
- **Highlighted reward**: Emphasizes earning
- **Auto-advance**: Reduces friction (user doesn't have to tap)

### Accessibility
- Screen reader: "Ad Completed, You earned 50 FC, approximately 50 cents, Claim button"
- Touch target: Claim button 48x48px minimum
- High contrast: Primary color on white (4.5:1 minimum)

---

## COMPLETE USER SCENARIO

### Scenario: User Watches First Ad

**Time: 0:00 - 0:40 (40 seconds total)**

```
┌─────────────────────────────────────┐
│ ← Available Ads                     │ ← 0:00-0:03: User sees ad list
│                                     │
│ ▸ Video Ad 1                        │
│   Earn 50 FC · 30 seconds           │
│ ▸ Video Ad 2                        │
│   Earn 50 FC · 30 seconds           │
└─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────┐
│ ← Task Details                      │ ← 0:03-0:08: User sees task details
│                                     │
│           ▶                         │
│      Watch Video Ad                 │
│  Watch this 30-second video ad      │
│  to earn FC.                        │
│                                     │
│  Earn: 50 FC (≈ $0.50 USD)         │
│  Requirements:                      │
│  • Must watch entire video          │
│  • One completion per user          │
│  Takes about 30 seconds             │
│                                     │
│  [Start]                            │
└─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────┐
│                                     │ ← 0:08-0:38: User watches ad
│         [VIDEO PLAYER]              │
│                                     │
│  ▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸ 30s            │
│  ████████████████████░░░░ 80%       │
│                                     │
└─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────┐
│                                     │ ← 0:38-0:41: User sees completion
│              ✓                      │
│         Ad Completed                │
│         +50 FC                      │
│      ≈ $0.50 USD                   │
│         [Claim]                     │
└─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────┐
│ ≡ Fee                      ⚙️      │ ← 0:41: User returns to Home
│ ┌─────────────────────────────┐    │
│ │ Your Balance                │    │
│ │ 50 FC                       │    │ ← Balance updated!
│ │ ≈ $0.50 USD                │    │
│ └─────────────────────────────┘    │
│                                     │
│ Recent Activity                     │
│ ✓ Watched Ad               +50 FC  │
│   2 minutes ago                     │
└─────────────────────────────────────┘
```

**User's Internal Monologue**:
- "I can watch a video ad to earn 50 FC" (0:03)
- "It takes 30 seconds" (0:08)
- "I'll watch it" (0:08)
- [Watches ad] (0:08-0:38)
- "Ad completed, I earned 50 FC" (0:38)
- "Let me claim it" (0:40)
- "My balance is now 50 FC" (0:41)

**Action**: User returns to Home, sees updated balance

---

## FLOW PRIORITIZATION

### Priority 1: Ad Player (⭐⭐⭐⭐⭐)
**Why**: Core experience, must be flawless
**When**: Main flow, 30-60 seconds
**Action**: Passive viewing

### Priority 2: Completion Screen (⭐⭐⭐⭐⭐)
**Why**: Confirmation and reward display
**When**: After ad finishes, 3 seconds
**Action**: Tap "Claim" or auto-advance

### Priority 3: Task Detail (⭐⭐⭐⭐)
**Why**: Sets expectations, reduces drop-off
**When**: Before ad player, 5 seconds
**Action**: Tap "Start"

### Priority 4: Ad Queue (⭐⭐⭐)
**Why**: Choice and transparency
**When**: Before task detail, 3 seconds
**Action**: Tap ad to select

---

## INFORMATION HIERARCHY

### Visual Hierarchy (Within Flow)

**1. Ad Player (Video)**
- Size: Full-screen
- Color: Video content
- Purpose: Primary focus

**2. Countdown Timer**
- Size: 13px, Caption
- Color: Neutral 500
- Purpose: Time remaining

**3. Progress Bar**
- Size: 4px height
- Color: Primary color
- Purpose: Completion progress

**4. Completion Screen (Reward)**
- Size: 24px, Semibold
- Color: Primary color
- Purpose: Reward confirmation

---

## UX PRINCIPLES APPLIED

### 1. Focused Experience
- Full-screen video (no distractions)
- No controls (ensures ad completion)
- No navigation (user can't leave)

### 2. Transparency
- Countdown timer shows remaining time
- Progress bar shows completion
- Reward shown before starting (Task Detail)

### 3. Immediate Feedback
- Balance updates immediately after claiming
- Toast notification confirms earning
- Smooth transition back to Home

### 4. Respectful Design
- No skip button (advertiser requirement)
- No fake countdown (actual time remaining)
- No dark patterns

### 5. Error Recovery
- Clear error messages
- "Try Another Task" option
- "Go Home" escape route

---

## COMPARISON: YOUTUBE ADS vs. TELEGRAM VIDEO vs. FEE

### YouTube Ads
- **Player**: Full-screen, skippable after 5 seconds
- **Controls**: Play/pause, fullscreen, volume
- **Countdown**: "Skip in 5s"
- **Pattern**: Standard video player

### Telegram Video
- **Player**: Full-screen, no controls
- **Controls**: Play/pause, fullscreen
- **Countdown**: None
- **Pattern**: Minimal, focused

### Fee
- **Player**: Full-screen, NO controls ✅
- **Controls**: None (passive viewing) ✅
- **Countdown**: Remaining time (top right) ✅
- **Progress bar**: Bottom (completion) ✅
- **Pattern**: Focused, transparent, minimal ✅

**Fee follows Telegram pattern**: Minimal, focused, no distractions

---

## RESPONSIVE BEHAVIOR

### Mobile (375px) - Primary
- Full-screen video (100% width, 100% height)
- Countdown timer: Top right
- Progress bar: Bottom, full width

### Tablet (768px)
- Full-screen video (100% width, 100% height)
- Same as mobile (video is always full-screen)

### Desktop (1024px+)
- Full-screen video (100% width, 100% height)
- Same as mobile (Telegram Mini Apps stay mobile-width)

---

## ACCESSIBILITY CHECKLIST

### Visual
- [x] Countdown timer: Neutral 500 on black (7.2:1 ratio)
- [x] Progress bar: Primary color on black (4.5:1 minimum)
- [x] Completion screen: Neutral 900 on white (14.7:1 ratio)

### Motor
- [x] No interaction required (passive viewing)
- [x] Claim button: 48x48px minimum
- [x] Error buttons: 48x48px minimum

### Cognitive
- [x] Simple language: "Ad Completed", "Claim"
- [x] Clear labels: Countdown, progress
- [x] No surprises: Clear error messages

### Screen Reader
- [x] Video playing announced: "Video ad playing, 30 seconds remaining"
- [x] Completion announced: "Ad completed, You earned 50 FC"
- [x] Error announced: "Ad unavailable, Try Another Task button"

---

## PERFORMANCE OPTIMIZATION

### Load Time
- **Target**: < 2 seconds (ad starts playing)
- **Video**: Preload next ad (background)
- **Completion screen**: Instant (no loading)

### Video Playback
- **Format**: MP4 (H.264) for compatibility
- **Resolution**: 720p (balance quality and size)
- **Compression**: Optimized for mobile
- **CDN**: Cloudflare (fast delivery)

### Perceived Performance
- **Loading state**: Spinner + "Loading ad..."
- **Skeleton**: Not needed (video is content)
- **Optimistic UI**: Not applicable (passive viewing)

---

## USABILITY TESTING CHECKLIST

### First-Time User
- [ ] User understands they must watch full ad
- [ ] User can see countdown timer
- [ ] User can see progress bar
- [ ] User sees completion screen
- [ ] User can claim FC

### Returning User
- [ ] User can start ad quickly
- [ ] User understands no skip option
- [ ] User sees balance update after claiming
- [ ] User can return to Home

### Accessibility
- [ ] Screen reader user knows ad is playing
- [ ] Screen reader user knows when ad completes
- [ ] Screen reader user can claim FC
- [ ] User with motor impairments can watch ad (no interaction needed)

---

## SUCCESS METRICS

### Ad Completion
- **Target**: 80% completion rate (users who start ad finish it)
- **Target**: < 5% error rate (ad fails to load)
- **Target**: < 2 seconds load time (ad starts playing)

### User Satisfaction
- **Target**: < 1% support tickets about ads
- **Target**: 90% of users understand ad flow
- **Target**: 70% of users watch multiple ads per session

### Engagement
- **Target**: Average 3-5 ads per user per session
- **Target**: 80% of users complete first ad
- **Target**: 60% of users complete second ad

---

## ANTI-PATTERNS TO AVOID

### ❌ Avoid
- Skip button (advertiser requirement)
- Pause button (ensures ad completion)
- Volume control (distraction)
- Fullscreen toggle (already full-screen)
- Ad overlays (watermarks, logos)
- Fake countdown (must be accurate)
- Multiple ads at once (overwhelming)
- Auto-play next ad (user should choose)

### ✅ Embrace
- No controls (focused experience)
- Countdown timer (transparency)
- Progress bar (completion)
- Clear error messages
- "Try Another Task" option
- Auto-advance after completion (reduces friction)

---

## IMPLEMENTATION NOTES

### Video Player
**Library**: React Player or native HTML5 video
**Features**:
- Autoplay
- No controls
- Loop: false
- Muted: false (user can hear ad)
- Playsinline: true (iOS)

### Ad Serving
**Integration**: Ad network API (abstracted)
**Flow**:
1. Fetch available ads from API
2. Display ad queue (if multiple)
3. User selects ad
4. Load ad video URL
5. Play ad
6. Track completion
7. Credit FC

### Tracking
**Events**:
- ad_started: User starts watching ad
- ad_progress: 25%, 50%, 75%, 100%
- ad_completed: User watches full ad
- ad_skipped: User leaves early (if applicable)
- ad_failed: Ad fails to load

### Fraud Prevention
- **IP tracking**: Detect multiple accounts
- **Device fingerprinting**: Detect fraud
- **View time**: Must watch 100% of ad (no skipping)
- **Completion tracking**: Verify with ad network

---

## CONCLUSION

The Watch Ads flow is designed to be focused, transparent, and respectful. It answers key questions:

- ✅ "What ad should I watch?" - Ad Queue shows options
- ✅ "What will I earn?" - Task Detail shows reward
- ✅ "How long is it?" - Countdown timer shows remaining time
- ✅ "Did I complete it?" - Completion screen confirms
- ✅ "How much did I earn?" - "+50 FC" displayed prominently

**Design Philosophy**: Telegram Video (minimal, focused) + YouTube Ads (standard, familiar)

**Key Principles**:
- Full-screen video (no distractions)
- No controls (ensures completion)
- Countdown + progress (transparency)
- Clear reward display (motivation)
- Auto-advance (reduces friction)

**No skip buttons. No pause buttons. No distractions. Just watch, earn, claim.**

---

*Watch Ads Flow UX Version 1.0*
*Created: 2026-07-18*
*Status: Ready for Visual Design*
*Next Step: Complete Tasks Flow UX*