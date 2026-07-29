# FEE - Complete Tasks Flow UX
## Surveys, Offers & Daily Tasks Experience

---

## CORE UX MISSION

**Purpose**: Enable users to complete surveys, offers, and daily tasks to earn FC
**Inspiration**: Google Opinion Rewards + Telegram Forms + Apple Shortcuts
**Principle**: Clear, simple, progressive disclosure

---

## FLOW POSITION IN APP

**Access**: Home → Primary Actions → "Complete Tasks" OR Available Now → specific task
**Priority**: Secondary earning method
**User Segment**: All users (100%)
**Frequency**: Daily (70% of users)

---

## COMPLETE FLOW SPECIFICATION

### Flow Overview
```
Home
  ↓
Task List (filtered by category)
  ↓
Task Detail (optional, for complex tasks)
  ↓
Task Execution (survey, offer, quiz, daily)
  ↓
Completion Screen
  ↓
Home (balance updated)
```

**Total Flow Time**: 2-10 minutes per task
**Success Metric**: 60% completion rate

---

## SCREEN 1: TASK LIST
**Position**: Between Home and Task Detail/Execution
**Scan Time**: 5 seconds
**Priority**: ⭐⭐⭐⭐⭐ (HIGHEST)

### What It Displays
```
← Complete Tasks ← Back button

┌─────────────────────────────────────┐
│                                     │
│ All | Surveys | Offers | Daily      │ ← Filter tabs, 44px height
│                                     │
├─────────────────────────────────────┤
│                                     │
│ ▸ Shopping Habits Survey            │ ← Icon + Title
│   Earn 100 FC · 2 minutes           │ ← Caption
│                                     │
│ ▸ Sign Up for ServiceX              │ ← Icon + Title
│   Earn 150 FC · 5 minutes           │ ← Caption
│                                     │
│ ▸ Daily Check-in                    │ ← Icon + Title
│   Earn 25 FC · Available now        │ ← Caption
│                                     │
│ ▸ Answer 5 Questions About Y        │ ← Icon + Title
│   Earn 75 FC · 3 minutes            │ ← Caption
│                                     │
└─────────────────────────────────────┘
```

**Visual Treatment**:
- Header: 56px, with back button
- Filter tabs: 44px height, below header
- List of task cards
- Each item: 56px minimum height
- Background: White
- Border Bottom: 1px solid Neutral 200
- Icon: 16x16px, left side
- Title: 15px, Regular (400), Neutral 800
- Caption: 13px, Regular (400), Neutral 500
- NO shadow
- NO border radius (flat list)

**Task Icons**:
- Survey: Checkmark icon (✓)
- Offer: Tag icon (🏷️)
- Daily: Gift icon (🎁)
- Quiz: Question mark icon (❓)

**Filter Tabs**:
- All: Shows all tasks (default)
- Surveys: Shows only surveys
- Offers: Shows only offers
- Daily: Shows only daily tasks

### Why It Exists
1. **Centralized Task Hub**: All tasks in one place
2. **Filtering**: Users can focus on task type
3. **Transparency**: Users see reward and time before starting
4. **Efficiency**: Users can pick best task for their time

### User Questions Answered
- ✅ "What tasks are available?" - List of all tasks
- ✅ "How much will I earn?" - Reward amount shown
- ✅ "How long will it take?" - Time estimate shown
- ✅ "What type of task is this?" - Filter tabs categorize

### Eye Movement
1. User reads "Complete Tasks" (header)
2. User glances at filter tabs
3. User scans list top-to-bottom
4. User selects task (usually highest paying or shortest)

**Total Time**: 5 seconds

### Interaction
- **Tap task**: Navigates to Task Detail or directly to task execution
- **Tap filter**: Filters task list (no navigation)
- **Back button**: Returns to Home
- **Pull-to-refresh**: Updates task list

**Filter Behavior**:
- Tap "Surveys" → Shows only surveys
- Tap "Offers" → Shows only offers
- Tap "Daily" → Shows only daily tasks
- Tap "All" → Shows all tasks (default)
- Smooth transition between filters (200ms)

### Why This Placement
- **Between Home and Task Execution**: Natural flow
- **Filter tabs**: Easy access to task categories
- **Scrollable list**: Accommodates variable number of tasks

### Empty State
```
Complete Tasks

No tasks available right now.
Check back soon for new opportunities.
```

### Accessibility
- Screen reader: "Complete Tasks, All tab, active, Shopping Habits Survey, Earn 100 FC, 2 minutes, button"
- Touch target: Entire row is tappable (minimum 44x44px)
- Filter tabs: 44x44px minimum
- High contrast: Neutral 800 on white (12.6:1 ratio)

---

## SCREEN 2: TASK DETAIL (Optional)
**Position**: Between Task List and Task Execution
**Scan Time**: 5 seconds
**Priority**: ⭐⭐⭐⭐ (HIGH - recommended for complex tasks)

### What It Displays
```
← Task Details ← Back button

┌─────────────────────────────────────┐
│                                     │
│           ✓                         │ ← Icon, 48x48px
│                                     │
│      Shopping Habits Survey         │ ← H2, 18px, Semibold
│                                     │
│  Complete this survey about your    │ ← Body, 15px, Regular
│  shopping habits to earn FC.        │
│                                     │
│  Earn: 100 FC (≈ $1.00 USD)        │ ← Highlighted, 18px, Semibold
│                                     │
│  Requirements:                      │ ← Overline, 11px, Neutral 500
│  • Must complete all questions      │ ← Body, 15px, Regular
│  • One completion per user          │ ← Body, 15px, Regular
│  • Takes about 2 minutes            │ ← Body, 15px, Regular
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
- Button: Primary, full width, bottom

### Why It Exists
1. **Set Expectations**: Users know what they're getting into
2. **Transparency**: Clear requirements, no surprises
3. **Reduce Drop-off**: Users commit before starting

### User Questions Answered
- ✅ "What will I do?" - "Complete a survey about shopping habits"
- ✅ "How much will I earn?" - "100 FC (≈ $1.00 USD)"
- ✅ "What are the requirements?" - "Must complete all questions, one completion per user"
- ✅ "How long will it take?" - "2 minutes"

### Eye Movement
1. User reads "Task Details" (header)
2. User sees icon (center)
3. User reads title
4. User reads description
5. User focuses on reward (highlighted)
6. User reads requirements
7. User taps "Start" button

**Total Time**: 5 seconds

### Interaction
- **Back button**: Returns to Task List
- **Start button**: Navigates to Task Execution

### Why This Placement
- **Before Task Execution**: Sets expectations
- **Optional**: Can skip for simple tasks (daily check-in)

### Accessibility
- Screen reader: "Task Details, Shopping Habits Survey, Complete this survey about your shopping habits to earn FC, Earn 100 FC, approximately 1 dollar, Requirements: Must complete all questions, One completion per user, Takes about 2 minutes, Start button"
- Touch target: Start button 48x48px minimum
- High contrast: Neutral 900 on white (14.7:1 ratio)

---

## SCREEN 3: TASK EXECUTION (Multiple Types)

### 3A: SURVEY FLOW
**Position**: Main task execution
**Duration**: 2-5 minutes
**Priority**: ⭐⭐⭐⭐ (HIGH)

#### What It Displays
```
┌─────────────────────────────────────┐
│ ← Survey                    [2/5]   │ ← Header with progress
├─────────────────────────────────────┤
│                                     │
│  How often do you shop online?      │ ← Question (18px, Semibold)
│                                     │
│  ○ Daily                            │ ← Option (15px, Regular)
│  ○ Weekly                           │ ← Option (15px, Regular)
│  ○ Monthly                          │ ← Option (15px, Regular)
│  ○ Rarely                           │ ← Option (15px, Regular)
│                                     │
│                                     │
│  [Back]              [Next →]       │ ← Navigation buttons
│                                     │
└─────────────────────────────────────┘
```

**Visual Treatment**:
- Header: 56px, with back button and progress indicator
- Question: 18px, Semibold, Neutral 900
- Options: 15px, Regular, Neutral 800
- Radio buttons: 20x20px, left side
- Navigation: Secondary button (Back), Primary button (Next)
- NO shadow

**Survey Flow**:
1. Question 1 of 5
2. User selects answer
3. User taps "Next"
4. Question 2 of 5
5. ...
6. Question 5 of 5
7. User taps "Submit"
8. Completion screen

**Progress Indicator**: "2/5" (top right, 13px, Caption)

**Interaction**:
- **Tap option**: Selects option (radio button fills)
- **Back button**: Returns to previous question
- **Next button**: Advances to next question
- **Submit button**: Submits survey (on last question)

**Error States**:
- **No option selected**: "Please select an answer" (validation message)
- **Network error**: "Connection lost" + "Retry" button
- **Survey closed**: "Survey is no longer available" + "Go Home" button

**Accessibility**:
- Screen reader: "Survey, Question 2 of 5, How often do you shop online?, Daily, radio button, not selected, Weekly, radio button, not selected, Monthly, radio button, not selected, Rarely, radio button, not selected, Next button"
- Touch target: Options 44x44px minimum
- High contrast: Neutral 900 on white (14.7:1 ratio)

---

### 3B: OFFER FLOW
**Position**: Main task execution
**Duration**: 5-10 minutes
**Priority**: ⭐⭐⭐ (MEDIUM)

#### What It Displays
```
┌─────────────────────────────────────┐
│ ← Offer                [Step 1/3]  │ ← Header with progress
├─────────────────────────────────────┤
│                                     │
│  Sign Up for ServiceX               │ ← Title (18px, Semibold)
│                                     │
│  Follow these steps:                │ ← Body (15px, Regular)
│                                     │
│  1. Tap "Open ServiceX" below       │ ← Step (15px, Regular)
│  2. Create an account               │ ← Step (15px, Regular)
│  3. Return to Fee                   │ ← Step (15px, Regular)
│                                     │
│  [Open ServiceX]                    │ ← Primary button
│                                     │
│  I've completed this task           │ ← Tertiary button
│                                     │
└─────────────────────────────────────┘
```

**Visual Treatment**:
- Header: 56px, with back button and progress
- Title: 18px, Semibold, Neutral 900
- Steps: 15px, Regular, Neutral 800
- Button: Primary, full width
- Tertiary button: Below primary button

**Offer Flow**:
1. User sees instructions
2. User taps "Open ServiceX" (opens external app/browser)
3. User completes offer (signs up, etc.)
4. User returns to Fee
5. User taps "I've completed this task"
6. Verification (automatic or manual)
7. Completion screen

**Interaction**:
- **Open ServiceX button**: Opens external link (App Store, website, etc.)
- **I've completed button**: Triggers verification
- **Back button**: Returns to Task List (no FC awarded)

**Error States**:
- **User doesn't return**: No action (user must manually return)
- **Verification fails**: "Verification failed" + "Retry" or "Cancel"
- **Offer expired**: "Offer is no longer available" + "Go Home"

**Accessibility**:
- Screen reader: "Offer, Sign Up for ServiceX, Follow these steps, 1. Tap Open ServiceX below, 2. Create an account, 3. Return to Fee, Open ServiceX button, I've completed this task button"
- Touch target: Buttons 48x48px minimum
- High contrast: Neutral 900 on white (14.7:1 ratio)

---

### 3C: DAILY BONUS FLOW
**Position**: Main task execution
**Duration**: 1 second (one-tap)
**Priority**: ⭐⭐⭐⭐⭐ (HIGHEST)

#### What It Displays
```
┌─────────────────────────────────────┐
│ ← Daily Bonus                       │
├─────────────────────────────────────┤
│                                     │
│           🎁                         │ ← Icon, 48x48px
│                                     │
│      Daily Bonus                    │ ← H2, 18px, Semibold
│                                     │
│  Claim your daily bonus of 25 FC.   │ ← Body, 15px, Regular
│                                     │
│  Come back tomorrow for more!       │ ← Caption, 13px, Regular, Neutral 500
│                                     │
│  [Claim 25 FC]                      │ ← Primary button, full width
│                                     │
└─────────────────────────────────────┘
```

**Visual Treatment**:
- Header: 56px, with back button
- Icon: 48x48px, center
- Title: 18px, Semibold, Neutral 900
- Description: 15px, Regular, Neutral 800
- Caption: 13px, Regular, Neutral 500
- Button: Primary, full width, bottom

**Daily Bonus Flow**:
1. User sees daily bonus screen
2. User taps "Claim 25 FC"
3. FC credited immediately
4. Completion screen
5. Returns to Home

**Interaction**:
- **Claim button**: Credits FC → Completion screen → Home
- **Back button**: Returns to Task List (bonus not claimed)

**Why This Placement**:
- **Simplest task**: One-tap claim
- **Daily habit**: Encourages daily app opens
- **Immediate reward**: Instant gratification

**Accessibility**:
- Screen reader: "Daily Bonus, Claim your daily bonus of 25 FC, Come back tomorrow for more, Claim 25 FC button"
- Touch target: Claim button 48x48px minimum
- High contrast: Neutral 900 on white (14.7:1 ratio)

---

## SCREEN 4: COMPLETION SCREEN
**Position**: After task finishes, full-screen overlay
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
│         +100 FC                     │ ← Highlighted, 24px, Semibold, Primary color
│                                     │
│      ≈ $1.00 USD                   │ ← Caption, 13px, Regular, Neutral 500
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
- ✅ "How much did I earn?" - "+100 FC" (highlighted)
- ✅ "What's next?" - "Claim" button

### Eye Movement
1. User sees checkmark icon (center)
2. User reads "Task Completed" (title)
3. User focuses on "+100 FC" (highlighted, large)
4. User reads "≈ $1.00 USD" (secondary)
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
5. Toast notification: "You earned 100 FC"

### Why This Placement
- **Full-screen**: Clear completion, no distractions
- **Highlighted reward**: Emphasizes earning
- **Auto-advance**: Reduces friction (user doesn't have to tap)

### Accessibility
- Screen reader: "Task Completed, You earned 100 FC, approximately 1 dollar, Claim button"
- Touch target: Claim button 48x48px minimum
- High contrast: Primary color on white (4.5:1 minimum)

---

## COMPLETE USER SCENARIO

### Scenario: User Completes Survey

**Time: 0:00 - 3:00 (3 minutes total)**

```
┌─────────────────────────────────────┐
│ ← Complete Tasks                    │ ← 0:00-0:05: User sees task list
│                                     │
│ All | Surveys | Offers | Daily      │
│                                     │
│ ▸ Shopping Habits Survey            │
│   Earn 100 FC · 2 minutes           │
│ ▸ Sign Up for ServiceX              │
│   Earn 150 FC · 5 minutes           │
└─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────┐
│ ← Task Details                      │ ← 0:05-0:10: User sees task details
│                                     │
│           ✓                         │
│      Shopping Habits Survey         │
│  Complete this survey about your    │
│  shopping habits to earn FC.        │
│                                     │
│  Earn: 100 FC (≈ $1.00 USD)        │
│  Requirements:                      │
│  • Must complete all questions      │
│  • One completion per user          │
│  Takes about 2 minutes              │
│                                     │
│  [Start]                            │
└─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────┐
│ ← Survey                    [1/5]  │ ← 0:10-0:40: User answers questions
│                                     │
│  How often do you shop online?      │
│                                     │
│  ○ Daily                            │
│  ○ Weekly                           │
│  ○ Monthly                          │
│  ○ Rarely                           │
│                                     │
│  [Back]              [Next →]       │
└─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────┐
│ ← Survey                    [2/5]  │ ← 0:40-1:10: More questions
│ ...                                 │
└─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────┐
│ ← Survey                    [5/5]  │ ← 1:40-2:00: Last question
│ ...                                 │
│  [Back]              [Submit →]     │
└─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────┐
│                                     │ ← 2:00-2:03: Completion
│              ✓                      │
│         Task Completed              │
│         +100 FC                     │
│      ≈ $1.00 USD                   │
│         [Claim]                     │
└─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────┐
│ ≡ Fee                      ⚙️      │ ← 2:03: User returns to Home
│ ┌─────────────────────────────┐    │
│ │ Your Balance                │    │
│ │ 100 FC                      │    │ ← Balance updated!
│ │ ≈ $1.00 USD                │    │
│ └─────────────────────────────┘    │
│                                     │
│ Recent Activity                     │
│ ✓ Completed Survey          +100 FC │
│   2 minutes ago                     │
└─────────────────────────────────────┘
```

**User's Internal Monologue**:
- "I can complete a survey to earn 100 FC" (0:05)
- "It takes 2 minutes" (0:10)
- "I'll do it" (0:10)
- [Answers questions] (0:10-2:00)
- "Survey completed, I earned 100 FC" (2:00)
- "Let me claim it" (2:02)
- "My balance is now 100 FC" (2:03)

**Action**: User returns to Home, sees updated balance

---

## FLOW PRIORITIZATION

### Priority 1: Task List (⭐⭐⭐⭐⭐)
**Why**: Central hub for all tasks
**When**: First screen in flow
**Action**: Tap task to start

### Priority 2: Completion Screen (⭐⭐⭐⭐⭐)
**Why**: Confirmation and reward display
**When**: After task finishes
**Action**: Tap "Claim" or auto-advance

### Priority 3: Task Detail (⭐⭐⭐⭐)
**Why**: Sets expectations, reduces drop-off
**When**: Before task execution
**Action**: Tap "Start"

### Priority 4: Task Execution (⭐⭐⭐⭐)
**Why**: Core task experience
**When**: Middle of flow
**Action**: Varies by task type (survey, offer, daily)

---

## INFORMATION HIERARCHY

### Visual Hierarchy (Within Flow)

**1. Task List (Title + Reward)**
- Size: 15px, Regular
- Color: Neutral 800
- Purpose: Task identification

**2. Reward Amount**
- Size: 18px, Semibold
- Color: Primary color
- Purpose: Motivation

**3. Time Estimate**
- Size: 13px, Regular
- Color: Neutral 500
- Purpose: Planning

**4. Filter Tabs**
- Size: 13px, Medium
- Color: Primary or Neutral 500
- Purpose: Category selection

---

## UX PRINCIPLES APPLIED

### 1. Progressive Disclosure
- Task List shows overview (title, reward, time)
- Task Detail shows details (requirements, description)
- Task Execution shows actual task

### 2. Clear Expectations
- Reward shown before starting
- Time estimate shown before starting
- Requirements shown before starting

### 3. Immediate Feedback
- Balance updates immediately after claiming
- Toast notification confirms earning
- Smooth transition back to Home

### 4. Respectful Design
- No time pressure (users can take their time)
- No dark patterns
- Clear error messages

### 5. Error Recovery
- Validation messages (select an answer)
- "Try Another Task" option
- "Go Home" escape route

---

## COMPARISON: GOOGLE OPINION REWARDS vs. TELEGRAM FORMS vs. FEE

### Google Opinion Rewards
- **Tasks**: Surveys only
- **Flow**: Simple survey, 1-3 questions
- **Reward**: Google Play credit
- **Pattern**: Minimal, fast, simple

### Telegram Forms
- **Tasks**: Surveys, quizzes
- **Flow**: In-app form, multiple questions
- **Reward**: None
- **Pattern**: Clean, simple, functional

### Fee
- **Tasks**: Surveys, offers, daily, quizzes ✅
- **Flow**: Task List → Task Detail → Task Execution → Completion ✅
- **Reward**: FC (internal currency) ✅
- **Pattern**: Clear, transparent, progressive ✅

**Fee follows both patterns**: Google (simple surveys) + Telegram (clean forms)

---

## RESPONSIVE BEHAVIOR

### Mobile (375px) - Primary
- Full-width task list (100% - 32px)
- Full-width task execution (100% - 32px)
- Filter tabs: Full width, equal size

### Tablet (768px)
- Task list centered, max-width 600px
- Task execution centered, max-width 600px
- Filter tabs: Centered, max-width 600px

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
- [x] Task items: 44x44px minimum
- [x] Filter tabs: 44x44px minimum
- [x] Buttons: 48x48px minimum
- [x] Radio buttons: 44x44px minimum (touch target)
- [x] Spacing: 8px minimum between touch targets

### Cognitive
- [x] Simple language: "Survey", "Offer", "Daily Bonus"
- [x] Clear labels: "Earn 100 FC", "Takes 2 minutes"
- [x] Consistent patterns: Same task card style
- [x] No surprises: Clear requirements

### Screen Reader
- [x] Semantic headings: H1, H2, H3
- [x] ARIA labels: All tasks, buttons, options
- [x] Live regions: Progress updates, completion
- [x] Descriptive text: "Shopping Habits Survey, Earn 100 FC, 2 minutes"

---

## PERFORMANCE OPTIMIZATION

### Load Time
- **Target**: < 2 seconds
- **Task list**: Cached for 5 minutes (Redis)
- **Task execution**: Loads instantly (in-app)
- **Completion screen**: Instant (no loading)

### Survey Performance
- **Questions**: Load all at once (no pagination)
- **Progress**: Update in real-time (no API call)
- **Submission**: Instant (optimistic UI)

### Perceived Performance
- **Skeleton screens**: Show task list structure while loading
- **Optimistic UI**: Show completion immediately, verify in background
- **Progressive loading**: Load task list first, then task details

---

## USABILITY TESTING CHECKLIST

### First-Time User
- [ ] User can find tasks easily
- [ ] User can filter by category
- [ ] User can understand task requirements
- [ ] User can complete a simple task (daily bonus)
- [ ] User can complete a survey

### Returning User
- [ ] User can find new tasks quickly
- [ ] User can switch between filters
- [ ] User can complete tasks without reading details
- [ ] User sees balance update after completion

### Accessibility
- [ ] Screen reader user can navigate task list
- [ ] Screen reader user can complete survey
- [ ] Keyboard user can select radio buttons
- [ ] User with motor impairments can tap all buttons

---

## SUCCESS METRICS

### Task Completion
- **Target**: 60% completion rate (users who start task finish it)
- **Target**: 80% completion rate for daily bonus
- **Target**: 50% completion rate for surveys
- **Target**: 40% completion rate for offers

### User Satisfaction
- **Target**: < 2% support tickets about tasks
- [ ] Target: 90% of users understand task flow
- **Target**: 70% of users complete multiple tasks per session

### Engagement
- **Target**: Average 5-10 tasks per user per session
- **Target**: 80% of users complete first task
- **Target**: 60% of users complete second task

---

## ANTI-PATTERNS TO AVOID

### ❌ Avoid
- Too many questions (> 10 per survey)
- Required account creation (for offers)
- Time limits (users should take their time)
- Auto-advancing questions (user loses control)
- Hidden requirements
- Fake progress bars
- Multiple tasks at once

### ✅ Embrace
- 3-5 questions per survey (optimal)
- Clear requirements
- No time limits
- User-controlled navigation (Back, Next)
- Transparent reward display
- Progress indicator
- One task at a time

---

## IMPLEMENTATION NOTES

### Survey Implementation
**Library**: React Hook Form + Zod validation
**Features**:
- Multiple question types (radio, checkbox, text)
- Progress indicator
- Auto-save draft (optional)
- Validation before submission

### Offer Implementation
**Integration**: Ad network API (abstracted)
**Flow**:
1. Show offer details
2. User taps "Open ServiceX"
3. Opens external link (deep link if possible)
4. User completes offer
5. User returns to Fee
6. Verification (automatic or manual)
7. Credit FC

### Daily Bonus Implementation
**Logic**:
- Check if user already claimed today
- If not, show claim button
- If yes, show "Come back tomorrow"
- Reset at midnight UTC

### Tracking
**Events**:
- task_started: User starts task
- task_progress: Question 1/5, 2/5, etc.
- task_completed: User completes task
- task_abandoned: User leaves task
- task_failed: Task fails

---

## CONCLUSION

The Complete Tasks flow is designed to be clear, simple, and respectful. It answers key questions:

- ✅ "What tasks are available?" - Task List shows all tasks
- ✅ "What will I earn?" - Reward shown before starting
- ✅ "How long will it take?" - Time estimate shown
- ✅ "What are the requirements?" - Requirements listed
- ✅ "Did I complete it?" - Completion screen confirms
- ✅ "How much did I earn?" - "+100 FC" displayed prominently

**Design Philosophy**: Google Opinion Rewards (simple surveys) + Telegram Forms (clean, functional)

**Key Principles**:
- Clear task list with filters
- Transparent reward and time estimates
- Progressive disclosure (list → detail → execution)
- No time pressure (users take their time)
- Immediate feedback (balance updates)

**No hidden requirements. No time limits. No dark patterns. Just clear, simple, respectful task completion.**

---

*Complete Tasks Flow UX Version 1.0*
*Created: 2026-07-18*
*Status: Ready for Visual Design*
*Next Step: Install Apps Flow UX*