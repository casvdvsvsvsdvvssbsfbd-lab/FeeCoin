# FEE - Stats Screen UX
## Data-Driven Insights for Power Users

---

## CORE UX MISSION

**Purpose**: Provide power users with actionable insights about their earning patterns
**Inspiration**: Revolut Stats + Apple Health + Telegram Analytics
**Principle**: Data should inform, not overwhelm

---

## SCREEN POSITION IN APP

**Access**: Bottom Navigation → Stats tab (tab 2)
**Priority**: Secondary (after Home)
**User Segment**: Active Earners and Power Users (40% of users)
**Visit Frequency**: Weekly (30% of users)

---

## EYE MOVEMENT PATTERN

### Z-Pattern Scan (for data screens)
Users scan data screens in a Z-pattern:
1. Top-left: Title and summary
2. Top-right: Time period selector
3. Middle-left to right: Primary chart
4. Middle-right to left: Secondary chart
5. Bottom: Key metrics

**Fee Stats Screen Optimization**:
```
┌─────────────────────────────────────┐
│ Your Stats            [7D][30D][90D]│ ← 1. Title + Time selector (200ms)
├─────────────────────────────────────┤
│                                     │
│ Earnings (Last 30 Days)             │ ← 2. Primary chart (800ms)
│ [Line chart showing earnings]       │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ Earnings by Category                │ ← 3. Secondary chart (600ms)
│ [Pie chart: Ads|Tasks|Apps|Refs]    │
│                                     │
├─────────────────────────────────────┤
│ Total: 12,450 FC    Avg: 415 FC/day │ ← 4. Key metrics (400ms)
│ Completion: 87%    Projected: 15K   │
└─────────────────────────────────────┘

Total scan time: ~2 seconds
```

---

## COMPLETE STATS SCREEN UX SPECIFICATION

### SECTION 1: HEADER (56px height)
**Position**: Top of screen, fixed
**Scan Time**: 200ms

#### What It Displays
- **Left**: Back button (←) - 44x44px touch target
- **Center**: "Your Stats" - H1, 18px, Semibold
- **Right**: Time period selector - [7D] [30D] [90D] [All]

#### Why It Exists
1. **Context**: "Your Stats" confirms user is in the right place
2. **Navigation**: Back button returns to Home
3. **Flexibility**: Time period selector allows different data views

#### User Questions Answered
- ✅ "Where am I?" - "I'm in Stats"
- ✅ "What time period is this?" - "30 days" (default)

#### Eye Movement
1. User reads "Your Stats" (center, quick confirmation)
2. User glances at time period selector (right side)
3. User notes current selection (30D is default)

**Total Time**: 200ms

#### Interaction
- **Back button**: Navigates to Home
- **Time period tabs**: Updates all charts and metrics
  - 7D: Last 7 days
  - 30D: Last 30 days (default)
  - 90D: Last 90 days
  - All: All time

**No other interaction**: Header is read-only except for tabs

#### Why This Placement
- Standard mobile app pattern
- Time selector is prominent (users often want to change it)
- Back button is accessible (standard navigation)

---

### SECTION 2: EARNINGS OVERVIEW CHART (Flexible height, ~250px)
**Position**: Below header, full width with 16px margins
**Scan Time**: 800ms
**Priority**: ⭐⭐⭐⭐⭐ (HIGHEST)

#### What It Displays
```
Earnings (Last 30 Days) ← Section label, 11px, Overline, Neutral 500

[Line Chart]
│
│     ╱╲
│    ╱  ╲   ╱╲
│   ╱    ╲ ╱  ╲
│  ╱      ╳    ╲
│ ╱      ╱ ╲    ╲
│╱      ╱   ╲    ╲
└────────────────────
  Jan 1  Jan 7 Jan 14 Jan 21 Jan 28

Y-axis: FC (0 - 1,000)
X-axis: Days
```

**Visual Treatment**:
- Chart type: Line chart (smooth curve, not jagged)
- Line color: Primary color (2px stroke)
- Fill: Gradient from Primary color (10% opacity) to transparent
- Grid lines: Neutral 200 (subtle)
- Y-axis labels: 13px, Caption, Neutral 500
- X-axis labels: 11px, Overline, Neutral 400
- No data points (clean, minimal)
- NO shadow
- NO 3D effects

**Data Displayed**:
- Daily earnings (FC)
- Smooth line showing trend
- Area fill under line (subtle)
- Grid lines for reference

#### Why It Exists
1. **Trend Visualization**: Shows earning pattern over time (increasing, decreasing, stable)
2. **Motivation**: Visual proof of progress (line going up = success)
3. **Pattern Recognition**: Users can identify best earning days
4. **Goal Setting**: Users can see if they're on track

#### User Questions Answered
- ✅ "How much have I earned over time?" - Line chart shows daily earnings
- ✅ "Am I earning more or less?" - Trend line shows direction
- ✅ "What are my best days?" - Peaks in chart show high-earning days

#### Eye Movement
1. User reads "Earnings (Last 30 Days)" label
2. User scans chart left-to-right (sees overall trend)
3. User identifies peaks and valleys (high and low earning days)
4. User notes current position (right side of chart)

**Total Time**: 800ms

#### Interaction
- **Tap data point**: Shows tooltip with exact value
  - "Jan 15: 650 FC"
  - Tooltip: 150ms fade in
- **Pull-to-refresh**: Updates chart data
- **No zoom**: Keeps it simple (time period selector handles this)

**Tooltip Design**:
```
┌─────────────┐
│ Jan 15      │
│ 650 FC      │
│ ≈ $6.50 USD │
└─────────────┘
```
- Background: Neutral 900
- Text: White
- Border Radius: 8px
- Padding: 8px 12px
- Arrow pointing down to data point

#### Why This Placement
- **Primary focus**: Most important data visualization
- **Top of content**: Users expect to see trends first
- **Large size**: Easy to read, clear visualization

#### Empty State (no data)
```
Earnings (Last 30 Days)

No earnings data yet.
Complete tasks to see your earnings trend.
```

**Why**: Manages expectations, guides users

#### Accessibility
- Screen reader: "Line chart showing earnings from January 1 to January 30. Highest earning day: January 15 with 650 FC. Total earnings: 12,450 FC."
- Touch target: Data points are 44x44px minimum
- High contrast: Primary color on white (4.5:1 minimum)

---

### SECTION 3: EARNINGS BY CATEGORY CHART (Flexible height, ~200px)
**Position**: Below earnings overview, full width with 16px margins
**Scan Time**: 600ms
**Priority**: ⭐⭐⭐⭐ (HIGH)

#### What It Displays
```
Earnings by Category ← Section label, 11px, Overline, Neutral 500

[Pie Chart]
    ╱─────╲
   │  Ads  │ 35% ← 4,350 FC
  ╱─────────╲
 │  Tasks    │ 40% ← 4,980 FC
│  40%       │
│  Apps 15%  │ ← 1,868 FC
│  Refs 10%  │ ← 1,242 FC
 └───────────┘

Legend:
● Ads (35%) - 4,350 FC
● Tasks (40%) - 4,980 FC
● Apps (15%) - 1,868 FC
● Referrals (10%) - 1,242 FC
```

**Visual Treatment**:
- Chart type: Pie chart (donut style, not solid pie)
- Colors: 4 distinct colors from palette
  - Ads: Primary color
  - Tasks: Secondary color
  - Apps: Info color (blue)
  - Referrals: Success color (green)
- Donut hole: 60% of chart size
- Center text: "100%" or "12,450 FC" (total)
- Legend: Right side or below chart
- NO shadow
- NO 3D effects

**Data Displayed**:
- Percentage breakdown by category
- FC amount for each category
- Total earnings (in donut hole)

#### Why It Exists
1. **Category Insights**: Shows which earning methods are most profitable
2. **Diversification**: Shows if user relies on one method or multiple
3. **Optimization**: Users can focus on highest-earning categories
4. **Transparency**: Clear breakdown of all earnings

#### User Questions Answered
- ✅ "Which earning method is best for me?" - "Tasks (40%)"
- ✅ "How much did I earn from referrals?" - "1,242 FC (10%)"
- ✅ "Am I diversified?" - "Yes, I use all 4 methods"

#### Eye Movement
1. User reads "Earnings by Category" label
2. User scans pie chart (sees largest segment)
3. User reads legend (sees exact numbers)
4. User identifies their top category

**Total Time**: 600ms

#### Interaction
- **Tap segment**: Highlights segment, shows details
  - "Tasks: 4,980 FC (40%)"
  - Other segments dim (50% opacity)
- **Tap legend item**: Highlights corresponding segment
- **Pull-to-refresh**: Updates chart data

**No drill-down**: This is a summary view (detail view is future enhancement)

#### Why This Placement
- **Secondary focus**: After trend chart
- **Complementary**: Shows distribution, not trend
- **Quick scan**: Pie chart is easy to understand at a glance

#### Empty State (no data)
```
Earnings by Category

No earnings data yet.
Complete tasks to see your category breakdown.
```

**Why**: Manages expectations

#### Accessibility
- Screen reader: "Pie chart showing earnings by category. Tasks: 40% (4,980 FC). Ads: 35% (4,350 FC). Apps: 15% (1,868 FC). Referrals: 10% (1,242 FC)."
- Touch target: Segments are tappable (minimum 44x44px)
- High contrast: All colors meet 4.5:1 contrast on white

---

### SECTION 4: KEY METRICS (Flexible height, ~150px)
**Position**: Below charts, full width with 16px margins
**Scan Time**: 400ms
**Priority**: ⭐⭐⭐⭐ (HIGH)

#### What It Displays
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Total Earned          Average per Day    Completion Rate   │
│  12,450 FC             415 FC             87%               │
│  ≈ $124.50 USD         ≈ $4.15 USD                          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Projected at Next        Tasks Completed                    │
│  Settlement              47                                 │
│  15,000 FC                                        │
│  ≈ $150 USD                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Visual Treatment**:
- 2x2 grid layout
- Each metric card:
  - Background: White
  - Border: 1px solid Neutral 200
  - Border Radius: 8px
  - Padding: 16px
- Label: 11px, Overline, Neutral 500
- Primary value: 18px, Semibold, Neutral 900
- Secondary value: 13px, Regular, Neutral 500
- NO shadow

**Metrics Displayed**:
1. **Total Earned**: 12,450 FC (≈ $124.50 USD)
2. **Average per Day**: 415 FC (≈ $4.15 USD)
3. **Completion Rate**: 87%
4. **Projected at Next Settlement**: 15,000 FC (≈ $150 USD)
5. **Tasks Completed**: 47

**Why These Metrics**:
- Total Earned: Overall achievement
- Average per Day: Consistency indicator
- Completion Rate: Efficiency indicator
- Projected: Future planning
- Tasks Completed: Volume indicator

#### Why It Exists
1. **Quick Summary**: Key metrics at a glance (no need to calculate)
2. **Goal Tracking**: Users can see progress toward goals
3. **Motivation**: Numbers reinforce earning momentum
4. **Planning**: Projected earnings help users plan withdrawals

#### User Questions Answered
- ✅ "How much have I earned total?" - "12,450 FC"
- ✅ "How consistent am I?" - "415 FC per day"
- ✅ "Am I efficient?" - "87% completion rate"
- ✅ "How much will I have at next settlement?" - "15,000 FC"

#### Eye Movement
1. User scans 2x2 grid (left-to-right, top-to-bottom)
2. User reads each metric: Label + Value
3. User focuses on most relevant metric (varies by user)

**Total Time**: 400ms

#### Interaction
- **Tap metric**: No navigation (read-only)
- **Pull-to-refresh**: Updates metrics

**No drill-down**: These are summary metrics (detail view is future)

#### Why This Placement
- **Below charts**: Charts show trends, metrics show numbers
- **Quick scan**: Grid layout allows fast reading
- **Summary**: Bottom of screen (after detailed data)

#### Empty State (no data)
```
Key Metrics

Complete tasks to see your metrics.
Stats appear after your first task completion.
```

**Why**: Manages expectations

#### Accessibility
- Screen reader: "Total Earned: 12,450 FC, approximately 124 dollars and 50 cents. Average per Day: 415 FC, approximately 4 dollars and 15 cents. Completion Rate: 87%. Projected at Next Settlement: 15,000 FC, approximately 150 dollars. Tasks Completed: 47."
- Touch target: N/A (read-only)
- High contrast: Neutral 900 on white (14.7:1 ratio)

---

### SECTION 5: TIME PERIOD SELECTOR (44px height)
**Position**: Below header, full width
**Scan Time**: 200ms
**Priority**: ⭐⭐⭐⭐⭐ (HIGH)

#### What It Displays
```
[7D] [30D] [90D] [All]
```

**Visual Treatment**:
- Height: 44px
- Background: White
- Border Bottom: 1px solid Neutral 200
- 4 tabs, equal width
- Font: 13px, Medium (500)
- Spacing: 8px between tabs

**Active State (30D)**:
- Text: Primary color
- Indicator: 2px line below tab

**Inactive State (7D, 90D, All)**:
- Text: Neutral 500
- No indicator

#### Why It Exists
1. **Flexibility**: Users can view different time periods
2. **Comparison**: Users can compare performance across periods
3. **Detail**: Users can zoom in (7D) or zoom out (90D, All)

#### User Questions Answered
- ✅ "How much did I earn this week?" - Tap "7D"
- ✅ "How much did I earn this month?" - Tap "30D" (default)
- ✅ "How much did I earn this quarter?" - Tap "90D"
- ✅ "How much have I earned all time?" - Tap "All"

#### Eye Movement
- User glances at tabs (right side of header)
- User taps if they want to change period
- User doesn't scan (small, familiar pattern)

**Total Time**: 200ms (if interacting)

#### Interaction
- **Tap tab**: Updates all charts and metrics
  - 7D: Last 7 days
  - 30D: Last 30 days (default)
  - 90D: Last 90 days
  - All: All time
- **No swipe**: Keeps it simple (tap only)

**Data Update**:
- Charts animate to new data (300ms transition)
- Metrics update immediately (no animation)

#### Why This Placement
- **Below header**: Easy to access
- **Full width**: Easy to tap
- **Standard pattern**: Users expect tab selectors

#### Accessibility
- Screen reader: "7 days tab, inactive", "30 days tab, active", "90 days tab, inactive", "All time tab, inactive"
- Touch target: Entire tab is tappable (minimum 44x44px)
- High contrast: Primary color or Neutral 500 on white

---

## COMPLETE USER SCENARIO

### Scenario: Returning User Checks Stats

**Time: 0:00 - 0:02 (2 seconds)**

```
┌─────────────────────────────────────┐
│ ← Your Stats        [7D][30D][90D]  │ ← 0:00-0:02: User sees "Your Stats"
├─────────────────────────────────────┤
│                                     │
│ Earnings (Last 30 Days)             │ ← 0:02-0:04: User sees chart title
│ [Line chart showing upward trend]   │ ← 0:04-0:06: User sees trend (going up!)
│                                     │
├─────────────────────────────────────┤
│                                     │
│ Earnings by Category                │ ← 0:06-0:08: User sees pie chart
│ [Pie chart: Tasks 40%, Ads 35%]     │ ← 0:08-0:10: User sees breakdown
│                                     │
├─────────────────────────────────────┤
│ Total: 12,450 FC    Avg: 415 FC/day │ ← 0:10-0:12: User scans metrics
│ Completion: 87%    Projected: 15K   │
└─────────────────────────────────────┘
```

**User's Internal Monologue**:
- "I'm in Stats" (0:02)
- "My earnings are trending up!" (0:06)
- "Tasks are my best category" (0:10)
- "I'm averaging 415 FC per day" (0:12)
- "I'll have 15,000 FC by next settlement" (0:12)

**Action**: User taps back button, returns to Home

---

## SECTION PRIORITIZATION

### Priority 1: Earnings Overview Chart (⭐⭐⭐⭐⭐)
**Why**: Shows trend over time (most important data)
**When**: First thing users see
**Action**: Tap data points for details

### Priority 2: Time Period Selector (⭐⭐⭐⭐⭐)
**Why**: Controls all data views
**When**: Always visible, below header
**Action**: Tap to change time period

### Priority 3: Key Metrics (⭐⭐⭐⭐)
**Why**: Quick summary of important numbers
**When**: Below charts
**Action**: Read-only

### Priority 4: Earnings by Category (⭐⭐⭐⭐)
**Why**: Shows distribution of earnings
**When**: Below primary chart
**Action**: Tap segments for details

---

## INFORMATION HIERARCHY

### Visual Hierarchy (Top to Bottom)

**1. Header (Title + Time Selector)**
- Size: 18px, Semibold
- Color: Neutral 900
- Purpose: Context and control

**2. Earnings Overview Chart**
- Size: Large (250px height)
- Color: Primary color line
- Purpose: Primary data visualization

**3. Earnings by Category Chart**
- Size: Medium (200px height)
- Color: Multi-color pie
- Purpose: Secondary data visualization

**4. Key Metrics**
- Size: 18px, Semibold
- Color: Neutral 900
- Purpose: Summary numbers

**5. Metadata**
- Size: 13px, Regular
- Color: Neutral 500
- Purpose: Supporting information (axis labels, captions)

---

## UX PRINCIPLES APPLIED

### 1. Data Clarity
- Simple charts (line and pie, no complex visualizations)
- Clear labels (no jargon)
- Obvious time periods (7D, 30D, 90D, All)

### 2. Progressive Disclosure
- Overview first (charts)
- Details second (metrics)
- Drill-down available (tap data points)

### 3. Immediate Feedback
- Charts update immediately when time period changes
- Metrics update immediately
- Smooth transitions (300ms)

### 4. Respectful Design
- No overwhelming data dumps
- No complex visualizations
- No confusing terminology

### 5. Error Recovery
- Empty states guide users
- No data states are handled
- Clear messaging

---

## COMPARISON: REVOLUT STATS vs. APPLE HEALTH vs. FEE

### Revolut Stats
- **Charts**: Line charts, pie charts, bar charts
- **Metrics**: Summary cards at bottom
- **Time selector**: Tabs (7D, 30D, 90D, All)
- **Pattern**: Clean, data-focused, minimal

### Apple Health
- **Charts**: Line charts, bar charts
- **Metrics**: Summary cards, detailed breakdowns
- **Time selector**: Tabs (Day, Week, Month, Year)
- **Pattern**: Visual, intuitive, comprehensive

### Fee
- **Charts**: Line chart (trend), pie chart (distribution) ✅
- **Metrics**: Summary cards (total, average, completion, projected) ✅
- **Time selector**: Tabs (7D, 30D, 90D, All) ✅
- **Pattern**: Clean, data-focused, minimal ✅

**Fee follows both patterns**:
- Revolut: Clean, minimal, data-focused
- Apple Health: Visual, intuitive, comprehensive

---

## RESPONSIVE BEHAVIOR

### Mobile (375px) - Primary
- Full-width charts (100% - 32px)
- 2x2 grid for metrics
- Time selector: 4 tabs, equal width
- Bottom navigation: 3 tabs

### Tablet (768px)
- Charts centered, max-width 600px
- Metrics: 2x2 grid, max-width 600px, centered
- Time selector: 4 tabs, centered
- Bottom navigation: 3 tabs (same as mobile)

### Desktop (1024px+)
- Constrained to mobile width (375-414px), centered
- OR expand to tablet layout with side navigation (future)
- Telegram Mini Apps typically stay mobile-width

---

## ACCESSIBILITY CHECKLIST

### Visual
- [x] Chart colors: 4.5:1 contrast minimum
- [x] Text: Neutral 900 on white (14.7:1 ratio)
- [x] Secondary text: Neutral 500 on white (7.2:1 ratio)
- [x] Caption text: Neutral 400 on white (4.6:1 ratio) - WCAG AA compliant

### Motor
- [x] Time selector tabs: 44x44px minimum
- [x] Chart data points: 44x44px minimum
- [x] Spacing: 8px minimum between touch targets

### Cognitive
- [x] Simple language: "Earnings", "Category", "Average"
- [x] Clear labels: "Last 30 Days", "Total Earned"
- [x] Consistent patterns: Same chart style across screen
- [x] No surprises: Clear time periods

### Screen Reader
- [x] Semantic headings: H1, H2, H3
- [x] ARIA labels: Charts, tabs, metrics
- [x] Live regions: Data updates
- [x] Descriptive text: "Line chart showing earnings trend"

---

## PERFORMANCE OPTIMIZATION

### Load Time
- **Target**: < 2 seconds
- **Charts**: Cached for 1 hour (Redis)
- **Metrics**: Cached for 1 hour (Redis)
- **Progressive loading**: Load header first, then charts, then metrics

### Chart Rendering
- **Library**: Lightweight chart library (Chart.js or Recharts)
- **Animation**: 300ms ease-out
- **Data points**: Max 30 (for 30D view)
- **No heavy animations**: Keeps it performant

### Perceived Performance
- **Skeleton screens**: Show chart structure while loading
- **Progressive rendering**: Render chart outline first, then data
- **Optimistic UI**: Show cached data immediately, update in background

---

## USABILITY TESTING CHECKLIST

### First-Time User
- [ ] User can understand what the charts show
- [ ] User can change time period
- [ ] User can read key metrics
- [ ] User can navigate back to Home

### Returning User
- [ ] User can see trend at a glance
- [ ] User can identify best earning category
- [ ] User can check projected earnings
- [ ] User can switch time periods quickly

### Accessibility
- [ ] Screen reader user can understand chart data
- [ ] Keyboard user can navigate tabs
- [ ] User with color blindness can distinguish chart segments
- [ ] User with motor impairments can tap tabs

---

## SUCCESS METRICS

### Stats Screen Usage
- **Target**: 30% of users visit Stats weekly
- **Target**: 50% of users visit Stats monthly
- **Target**: Average visit duration: 30 seconds

### Data Comprehension
- **Target**: 90% of users understand the charts
- **Target**: 80% of users can identify their top earning category
- **Target**: 70% of users check projected earnings

### Engagement
- **Target**: Users who visit Stats have 20% higher retention
- **Target**: Users who visit Stats complete 15% more tasks
- **Target**: < 2% support tickets about Stats

---

## ANTI-PATTERNS TO AVOID

### ❌ Avoid
- Complex charts (3D, stacked, multi-axis)
- Too many metrics (> 6)
- Jargon ("CPM", "CPA", "conversion rate")
- Cluttered layouts
- Small text (< 13px)
- Low contrast charts
- No time period selector
- Infinite scroll
- Auto-refreshing data (distracting)

### ✅ Embrace
- Simple charts (line, pie)
- 4-6 key metrics
- Clear labels ("Earnings", "Average", "Completion")
- Clean layouts
- Readable text (13px minimum)
- High contrast colors
- Time period selector
- Pull-to-refresh
- Static data (updates on refresh)

---

## IMPLEMENTATION NOTES

### Chart Library
**Recommended**: Recharts (React-based, lightweight, accessible)
**Alternative**: Chart.js (more features, larger bundle)

### Data Fetching
- **Initial load**: Fetch all data for default time period (30D)
- **Time period change**: Fetch new data, animate transition
- **Caching**: Cache data for 1 hour (Redis)
- **Real-time**: No real-time updates (user refreshes manually)

### Animation
- **Chart transition**: 300ms ease-out
- **Data point hover**: 150ms fade in
- **Tab switch**: 200ms fade

---

## CONCLUSION

The Stats Screen provides power users with actionable insights about their earning patterns. It answers key questions:

- ✅ "How much have I earned?" - Total Earned metric
- ✅ "What's my trend?" - Line chart shows trend
- ✅ "Which method is best?" - Pie chart shows category breakdown
- ✅ "How efficient am I?" - Completion Rate metric
- ✅ "What will I have next settlement?" - Projected earnings

**Design Philosophy**: Revolut (clean, data-focused) + Apple Health (visual, intuitive)

**Key Principles**:
- Simple charts (line and pie only)
- Clear metrics (4-6 key numbers)
- Time period selector (flexibility)
- Read-only (no actions, just data)
- Fast performance (< 2s load)

**No complex dashboards. No overwhelming data. Just clear, actionable insights.**

---

*Stats Screen UX Version 1.0*
*Created: 2026-07-18*
*Status: Ready for Visual Design*
*Next Step: Profile Screen UX*