# FEE - Profile Screen UX
## Settings, History & Support Hub

---

## CORE UX MISSION

**Purpose**: Centralize all non-transactional user needs (settings, history, support)
**Inspiration**: Telegram Settings + Apple Wallet Settings + Revolut Profile
**Principle**: Keep Home clean, put operational tasks here

---

## SCREEN POSITION IN APP

**Access**: Bottom Navigation → Profile tab (tab 3)
**Priority**: Tertiary (after Home and Stats)
**User Segment**: All users (100%)
**Visit Frequency**: Monthly (50% of users)

---

## EYE MOVEMENT PATTERN

### F-Pattern Scan (for settings screens)
Users scan settings screens in an F-pattern:
1. Top: User info (who am I?)
2. Middle: Settings list (what can I configure?)
3. Bottom: Support and logout (help and exit)

**Fee Profile Screen Optimization**:
```
┌─────────────────────────────────────┐
│ ← Profile                           │ ← 1. Header (200ms)
├─────────────────────────────────────┤
│                                     │
│ 👤 John Doe                         │ ← 2. User info (300ms)
│ @johndoe                             │
│ Member since Jan 2025                │
│ Tasks: 47                            │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ Withdrawal History                  │ ← 3. History section (400ms)
│ December 1, 2024                    │
│ 10,000 FC · ≈ $100 USD              │
│ Status: Completed                    │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ Settings                            │ ← 4. Settings section (500ms)
│ Notifications           [On]        │
│ Currency Display        FC + USD    │
│ Language                English     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ Support                             │ ← 5. Support section (400ms)
│ FAQ                                 │
│ Contact Support                     │
│ Terms of Service                    │
│ Privacy Policy                      │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ Logout                              │ ← 6. Logout (200ms)
│                                     │
└─────────────────────────────────────┘

Total scan time: ~2 seconds
```

---

## COMPLETE PROFILE SCREEN UX SPECIFICATION

### SECTION 1: HEADER (56px height)
**Position**: Top of screen, fixed
**Scan Time**: 200ms

#### What It Displays
- **Left**: Back button (←) - 44x44px touch target
- **Center**: "Profile" - H1, 18px, Semibold

#### Why It Exists
1. **Context**: "Profile" confirms user is in the right place
2. **Navigation**: Back button returns to Home

#### User Questions Answered
- ✅ "Where am I?" - "I'm in Profile"

#### Eye Movement
1. User reads "Profile" (center, quick confirmation)
2. User notes back button (left side)

**Total Time**: 200ms

#### Interaction
- **Back button**: Navigates to Home
- **No other interaction**: Header is read-only

#### Why This Placement
- Standard mobile app pattern
- Simple, clean (no right-side actions needed)

---

### SECTION 2: USER INFO (120px height)
**Position**: Below header, full width with 16px margins
**Scan Time**: 300ms
**Priority**: ⭐⭐⭐⭐⭐ (HIGHEST)

#### What It Displays
```
┌─────────────────────────────────────┐
│ 👤 John Doe                         │ ← Avatar (40x40px) + Name (15px, Semibold)
│ @johndoe                             │ ← Username (13px, Regular, Neutral 500)
│                                     │
│ Member since January 2025           │ ← Overline, 11px, Neutral 500
│ Tasks completed: 47                 │ ← Overline, 11px, Neutral 500
└─────────────────────────────────────┘
```

**Visual Treatment**:
- Background: White
- Border: 1px solid Neutral 200
- Border Radius: 12px
- Padding: 16px
- Avatar: 40x40px, left side (circle, Telegram profile photo)
- Name: 15px, Semibold, Neutral 900
- Username: 13px, Regular, Neutral 500
- Metadata: 11px, Overline, Neutral 500
- NO shadow

#### Why It Exists
1. **Identity Confirmation**: "This is my account" (reassurance)
2. **Personalization**: Shows user's name and photo (humanizes app)
3. **Context**: Member since date shows tenure (trust building)
4. **Achievement**: Tasks completed shows activity (motivation)

#### User Questions Answered
- ✅ "Who am I?" - "John Doe (@johndoe)"
- ✅ "How long have I been using Fee?" - "Member since January 2025"
- ✅ "How active am I?" - "47 tasks completed"

#### Eye Movement
1. User sees avatar and name (quick identity confirmation)
2. User reads username (verification)
3. User scans metadata (member since, tasks completed)

**Total Time**: 300ms

#### Interaction
- **Tap**: No navigation (read-only)
- **No long-press**: No additional actions

**No navigation**: This is a read-only section

#### Why This Placement
- **Top of content**: Identity first (who am I?)
- **Below header**: Standard pattern
- **Card format**: Groups related information

#### Accessibility
- Screen reader: "Profile, John Doe, @johndoe, Member since January 2025, 47 tasks completed"
- Touch target: N/A (read-only)
- High contrast: Neutral 900 on white (14.7:1 ratio)

---

### SECTION 3: WITHDRAWAL HISTORY (Flexible height, scrollable)
**Position**: Below user info, full width with 16px margins
**Scan Time**: 400ms
**Priority**: ⭐⭐⭐⭐ (HIGH)

#### What It Displays
```
Withdrawal History ← Section label, 11px, Overline, Neutral 500

December 1, 2024                     ← Date (15px, Regular, Neutral 800)
10,000 FC · ≈ $100 USD               ← Amount (13px, Regular, Neutral 500)
Status: Completed                     ← Status (13px, Regular, Success color)
Arrived: December 3, 2024            ← Timestamp (11px, Overline, Neutral 400)

November 1, 2024                     ← Date (15px, Regular, Neutral 800)
5,000 FC · ≈ $50 USD                 ← Amount (13px, Regular, Neutral 500)
Status: Completed                     ← Status (13px, Regular, Success color)
Arrived: November 3, 2024            ← Timestamp (11px, Overline, Neutral 400)
```

**Visual Treatment**:
- List of withdrawal items
- Each item: 80px minimum height
- Background: White
- Border Bottom: 1px solid Neutral 200
- Date: 15px, Regular (400), Neutral 800
- Amount: 13px, Regular (400), Neutral 500
- Status: 13px, Regular (400), Success color (green)
- Timestamp: 11px, Overline, Neutral 400
- NO shadow
- NO border radius (flat list)

**Status Colors**:
- Completed: Success color (green)
- Pending: Warning color (orange)
- Failed: Error color (red)
- Processing: Info color (blue)

#### Why It Exists
1. **Transparency**: Users can see all past withdrawals (trust building)
2. **Verification**: Users can confirm withdrawals arrived
3. **History**: Users can track withdrawal patterns
4. **Accountability**: Platform shows it processes withdrawals

#### User Questions Answered
- ✅ "When did I withdraw?" - "December 1, 2024"
- ✅ "How much did I withdraw?" - "10,000 FC (≈ $100 USD)"
- ✅ "Did it arrive?" - "Status: Completed, Arrived: December 3, 2024"

#### Eye Movement
1. User reads "Withdrawal History" label
2. User scans list top-to-bottom (most recent first)
3. User reads most recent withdrawal (date, amount, status)
4. User may scan older withdrawals (1-2 more items)

**Total Time**: 400ms

#### Interaction
- **Tap**: No navigation (read-only)
- **Long-press**: No action
- **Pull-to-refresh**: Updates withdrawal status

**No navigation**: This is a read-only section

#### Why This Placement
- **Below user info**: Identity first, then history
- **Scrollable**: Accommodates variable number of withdrawals
- **Read-only**: No action required, just information

#### Empty State
```
Withdrawal History

No withdrawals yet.

Complete tasks to reach the 5,000 FC minimum.
Next settlement: January 1, 2025
```

**Why**: Manages expectations, guides users to take action

#### Accessibility
- Screen reader: "Withdrawal History, December 1, 2024, 10,000 FC, approximately 100 dollars, Status: Completed, Arrived December 3, 2024"
- Touch target: N/A (read-only)
- High contrast: Neutral 800 on white (12.6:1 ratio)

---

### SECTION 4: SETTINGS (Flexible height, ~200px)
**Position**: Below withdrawal history, full width with 16px margins
**Scan Time**: 500ms
**Priority**: ⭐⭐⭐⭐⭐ (HIGHEST)

#### What It Displays
```
Settings ← Section label, 11px, Overline, Neutral 500

Notifications                              ← Label (15px, Regular, Neutral 800)
Receive notifications about settlements     ← Subtitle (13px, Regular, Neutral 500)
and new tasks                    [On]       ← Toggle switch

Currency Display                            ← Label (15px, Regular, Neutral 800)
How balances are displayed       FC + USD   ← Subtitle (13px, Regular, Neutral 500)
▼                                          ← Dropdown arrow

Language                                    ← Label (15px, Regular, Neutral 800)
English                                    ← Subtitle (13px, Regular, Neutral 500)
▼                                          ← Dropdown arrow
```

**Visual Treatment**:
- List of setting items
- Each item: 56px minimum height
- Background: White
- Border Bottom: 1px solid Neutral 200
- Label: 15px, Regular (400), Neutral 800
- Subtitle: 13px, Regular (400), Neutral 500
- Control: Toggle switch or dropdown arrow
- NO shadow
- NO border radius (flat list)

**Setting Types**:
1. **Notifications**: Toggle switch (On/Off)
2. **Currency Display**: Dropdown (FC Only / USD Only / FC + USD)
3. **Language**: Dropdown (English / Spanish / Portuguese / etc.)

#### Why It Exists
1. **User Control**: Users can customize their experience
2. **Accessibility**: Users can choose language, currency format
3. **Preferences**: Users can enable/disable notifications
4. **Standard Pattern**: Every app has settings

#### User Questions Answered
- ✅ "Can I change my language?" - "Yes, tap Language"
- ✅ "Can I see only FC or USD?" - "Yes, tap Currency Display"
- ✅ "Can I turn off notifications?" - "Yes, toggle Notifications"

#### Eye Movement
1. User reads "Settings" label
2. User scans list top-to-bottom
3. User identifies setting they want to change
4. User taps setting to modify

**Total Time**: 500ms

#### Interaction
- **Notifications toggle**: Tap to toggle On/Off
  - Immediate feedback (toggle animates)
  - Saves automatically (no "Save" button)
- **Currency Display dropdown**: Tap to open dropdown
  - Options: FC Only / USD Only / FC + USD
  - Select option → Immediate update
- **Language dropdown**: Tap to open dropdown
  - Options: List of available languages
  - Select option → Immediate update

**Auto-save**: All settings save immediately (no confirmation needed)

#### Why This Placement
- **Below history**: Identity → history → settings (logical flow)
- **Scrollable**: Accommodates future settings
- **Standard pattern**: Users expect settings in profile

#### Accessibility
- Screen reader: "Settings, Notifications, Receive notifications about settlements and new tasks, toggle, On"
- Touch target: Entire row is tappable (minimum 44x44px)
- Toggle switch: 44x44px minimum
- High contrast: Neutral 800 on white (12.6:1 ratio)

---

### SECTION 5: SUPPORT (Flexible height, ~200px)
**Position**: Below settings, full width with 16px margins
**Scan Time**: 400ms
**Priority**: ⭐⭐⭐⭐ (HIGH)

#### What It Displays
```
Support ← Section label, 11px, Overline, Neutral 500

FAQ                              ← Label (15px, Regular, Neutral 800)
Check frequently asked questions  ← Subtitle (13px, Regular, Neutral 500)
›                                ← Arrow icon

Contact Support                  ← Label (15px, Regular, Neutral 800)
Send us a message                ← Subtitle (13px, Regular, Neutral 500)
›                                ← Arrow icon

Terms of Service                 ← Label (15px, Regular, Neutral 800)
Read our terms                   ← Subtitle (13px, Regular, Neutral 500)
›                                ← Arrow icon

Privacy Policy                   ← Label (15px, Regular, Neutral 800)
Read our privacy policy          ← Subtitle (13px, Regular, Neutral 500)
›                                ← Arrow icon
```

**Visual Treatment**:
- List of support items
- Each item: 56px minimum height
- Background: White
- Border Bottom: 1px solid Neutral 200
- Label: 15px, Regular (400), Neutral 800
- Subtitle: 13px, Regular (400), Neutral 500
- Arrow: 20x20px, right side, Neutral 400
- NO shadow
- NO border radius (flat list)

**Support Items**:
1. **FAQ**: Frequently asked questions
2. **Contact Support**: Send message to support team
3. **Terms of Service**: Legal terms
4. **Privacy Policy**: Data privacy policy

#### Why It Exists
1. **Self-Service**: FAQ reduces support burden
2. **Support Access**: Users can contact support when needed
3. **Transparency**: Terms and Privacy Policy build trust
4. **Legal Requirement**: Must provide terms and privacy policy

#### User Questions Answered
- ✅ "How do I get help?" - "Tap FAQ or Contact Support"
- ✅ "What are the rules?" - "Tap Terms of Service"
- ✅ "How is my data used?" - "Tap Privacy Policy"

#### Eye Movement
1. User reads "Support" label
2. User scans list top-to-bottom
3. User identifies support option they need
4. User taps to navigate

**Total Time**: 400ms

#### Interaction
- **FAQ**: Navigates to FAQ screen (accordion list of questions)
- **Contact Support**: Navigates to Contact Support screen (form + email + Telegram)
- **Terms of Service**: Navigates to Terms of Service screen (scrollable text)
- **Privacy Policy**: Navigates to Privacy Policy screen (scrollable text)

**Navigation**: All items navigate to respective screens

#### Why This Placement
- **Below settings**: Settings → support (logical flow)
- **Scrollable**: Accommodates future support options
- **Standard pattern**: Users expect support in profile

#### Accessibility
- Screen reader: "Support, FAQ, Check frequently asked questions, button"
- Touch target: Entire row is tappable (minimum 44x44px)
- High contrast: Neutral 800 on white (12.6:1 ratio)

---

### SECTION 6: LOGOUT (48px height)
**Position**: Below support, full width with 16px margins
**Scan Time**: 200ms
**Priority**: ⭐⭐⭐ (MEDIUM)

#### What It Displays
```
┌─────────────────────────────────────┐
│ Logout                              │ ← Text button, 15px, Medium, Error color
└─────────────────────────────────────┘
```

**Visual Treatment**:
- Height: 48px
- Background: Transparent
- Border: None
- Text: 15px, Medium (500), Error color (red)
- NO shadow
- NO border radius

**Button Style**: Tertiary button (text only, no background)

#### Why It Exists
1. **Account Security**: Users can logout when needed
2. **Account Switching**: Users can switch Telegram accounts
3. **Privacy**: Users can logout on shared devices

#### User Questions Answered
- ✅ "How do I logout?" - "Tap Logout button"

#### Eye Movement
- User scans to bottom of screen
- User sees "Logout" button (red text, stands out)
- User taps if they want to logout

**Total Time**: 200ms (if interacting)

#### Interaction
- **Tap**: Opens confirmation dialog
  - "Are you sure you want to logout?"
  - Buttons: "Cancel" | "Logout"
  - Tap "Logout" → Clears session → Navigates to Splash Screen
  - Tap "Cancel" → Dismisses dialog

**Confirmation Dialog**:
```
┌─────────────────────────────────────┐
│                                     │
│         Logout                      │
│                                     │
│  Are you sure you want to logout?   │
│                                     │
│        [Cancel]  [Logout]           │
│                                     │
└─────────────────────────────────────┘
```
- Width: 280px
- Background: White
- Border Radius: 12px
- Padding: 24px
- Title: 18px, Semibold
- Body: 15px, Regular
- Actions: Right-aligned

**Why Confirmation**: Prevents accidental logouts (destructive action)

#### Why This Placement
- **Bottom of screen**: Separated from other content (destructive action)
- **Red text**: Stands out (warning color)
- **Text button**: Not prominent (users shouldn't tap accidentally)

#### Accessibility
- Screen reader: "Logout button"
- Touch target: 48x48px minimum (exceeds 44x44px requirement)
- High contrast: Error color on white (4.5:1 minimum)
- Confirmation dialog: Focus trap, Escape to close

---

## COMPLETE USER SCENARIO

### Scenario: User Checks Withdrawal History

**Time: 0:00 - 0:02 (2 seconds)**

```
┌─────────────────────────────────────┐
│ ← Profile                           │ ← 0:00-0:02: User sees "Profile"
├─────────────────────────────────────┤
│ 👤 John Doe                         │ ← 0:02-0:04: User sees their name
│ @johndoe                             │
│ Member since Jan 2025                │
│ Tasks: 47                            │
├─────────────────────────────────────┤
│ Withdrawal History                  │ ← 0:04-0:06: User sees section
│ December 1, 2024                    │ ← 0:06-0:08: User sees last withdrawal
│ 10,000 FC · ≈ $100 USD              │
│ Status: Completed                    │
│ Arrived: December 3, 2024           │
└─────────────────────────────────────┘
```

**User's Internal Monologue**:
- "I'm in Profile" (0:02)
- "This is my account" (0:04)
- "My last withdrawal was December 1st" (0:08)
- "It arrived on December 3rd" (0:08)
- "Good, it worked" (0:08)

**Action**: User taps back button, returns to Home

---

## SECTION PRIORITIZATION

### Priority 1: User Info (⭐⭐⭐⭐⭐)
**Why**: Identity confirmation
**When**: First thing users see
**Action**: Read-only

### Priority 2: Settings (⭐⭐⭐⭐⭐)
**Why**: User control and preferences
**When**: Middle of screen
**Action**: Tap to modify

### Priority 3: Support (⭐⭐⭐⭐)
**Why**: Help and legal information
**When**: Below settings
**Action**: Tap to navigate

### Priority 4: Withdrawal History (⭐⭐⭐⭐)
**Why**: Transparency and verification
**When**: Below user info
**Action**: Read-only

### Priority 5: Logout (⭐⭐⭐)
**Why**: Account security
**When**: Bottom of screen
**Action**: Tap → Confirmation → Logout

---

## INFORMATION HIERARCHY

### Visual Hierarchy (Top to Bottom)

**1. User Info (Name + Avatar)**
- Size: 15px, Semibold
- Color: Neutral 900
- Purpose: Identity confirmation

**2. Settings (Labels + Controls)**
- Size: 15px, Regular
- Color: Neutral 800
- Purpose: User control

**3. Support (Labels + Arrows)**
- Size: 15px, Regular
- Color: Neutral 800
- Purpose: Help and legal

**4. Withdrawal History (Dates + Amounts)**
- Size: 15px, Regular
- Color: Neutral 800
- Purpose: Transaction history

**5. Metadata (Subtitles, Timestamps)**
- Size: 13px, Regular
- Color: Neutral 500
- Purpose: Supporting information

**6. Logout (Red Text)**
- Size: 15px, Medium
- Color: Error color
- Purpose: Destructive action (stands out)

---

## UX PRINCIPLES APPLIED

### 1. Separation of Concerns
- Home: Transactional (earning tasks)
- Stats: Data (insights and metrics)
- Profile: Operational (settings, history, support)

### 2. Clear Hierarchy
- Identity first (who am I?)
- Settings second (what can I configure?)
- Support third (where do I get help?)
- History fourth (what have I done?)
- Logout last (destructive action, separated)

### 3. Immediate Feedback
- Settings save immediately (no "Save" button)
- Toggle switches animate (150ms)
- Dropdowns open instantly (200ms)

### 4. Respectful Design
- No dark patterns (no "Are you sure you want to logout?" spam)
- Clear labels (no jargon)
- Obvious actions (arrows indicate navigation)

### 5. Error Recovery
- Confirmation dialog for logout (prevents mistakes)
- Empty states for withdrawal history (guides users)
- Clear support options (users can get help)

---

## COMPARISON: TELEGRAM SETTINGS vs. APPLE WALLET SETTINGS vs. FEE

### Telegram Settings
- **Sections**: Account, Privacy, Security, Notifications, etc.
- **Pattern**: List of settings with toggles and arrows
- **Layout**: Grouped by category
- **Style**: Clean, minimal, functional

### Apple Wallet Settings
- **Sections**: Passes, Payment, Privacy
- **Pattern**: Simple list, minimal options
- **Layout**: Single list, no grouping
- **Style**: Ultra-minimal, focused

### Fee
- **Sections**: User Info, Withdrawal History, Settings, Support, Logout ✅
- **Pattern**: List of items with toggles and arrows ✅
- **Layout**: Grouped by category (Info, History, Settings, Support) ✅
- **Style**: Clean, minimal, functional ✅

**Fee follows both patterns**:
- Telegram: Comprehensive settings with clear labels
- Apple: Minimal, focused, no clutter

---

## RESPONSIVE BEHAVIOR

### Mobile (375px) - Primary
- Full-width cards and lists (100% - 32px)
- Single column layout
- Bottom navigation: 3 tabs

### Tablet (768px)
- Cards centered, max-width 600px
- Lists: Max-width 600px, centered
- Bottom navigation: 3 tabs (same as mobile)

### Desktop (1024px+)
- Constrained to mobile width (375-414px), centered
- OR expand to tablet layout with side navigation (future)
- Telegram Mini Apps typically stay mobile-width

---

## ACCESSIBILITY CHECKLIST

### Visual
- [x] Text: Neutral 900 on white (14.7:1 ratio)
- [x] Secondary text: Neutral 500 on white (7.2:1 ratio)
- [x] Caption text: Neutral 400 on white (4.6:1 ratio) - WCAG AA compliant
- [x] Logout button: Error color on white (4.5:1 minimum)

### Motor
- [x] All touch targets: 44x44px minimum
- [x] Toggle switches: 44x44px minimum
- [x] Spacing: 8px minimum between touch targets

### Cognitive
- [x] Simple language: "Notifications", "Language", "Logout"
- [x] Clear labels: "Receive notifications about settlements"
- [x] Consistent patterns: Same list style across screen
- [x] No surprises: Confirmation dialog for logout

### Screen Reader
- [x] Semantic headings: H1, H2, H3
- [x] ARIA labels: All settings, buttons, links
- [x] Live regions: Setting changes
- [x] Descriptive text: "Notifications toggle, On"

---

## PERFORMANCE OPTIMIZATION

### Load Time
- **Target**: < 2 seconds
- **User info**: Cached (loaded once)
- **Withdrawal history**: Cached for 5 minutes (Redis)
- **Settings**: Cached (loaded once)

### Perceived Performance
- **Skeleton screens**: Show structure while loading
- **Optimistic UI**: Settings save immediately, sync in background
- **Progressive loading**: Load user info first, then history, then settings

### Animation
- **Toggle switch**: 150ms ease-in-out
- **Dropdown open**: 200ms ease-out
- **Confirmation dialog**: 200ms fade in

---

## USABILITY TESTING CHECKLIST

### First-Time User
- [ ] User can find settings easily
- [ ] User can change language
- [ ] User can toggle notifications
- [ ] User can find support options
- [ ] User can logout

### Returning User
- [ ] User can check withdrawal history
- [ ] User can modify settings quickly
- [ ] User can find FAQ
- [ ] User can contact support

### Accessibility
- [ ] Screen reader user can navigate entire Profile screen
- [ ] Keyboard user can access all interactive elements
- [ ] User with color blindness can distinguish elements
- [ ] User with motor impairments can tap all buttons

---

## SUCCESS METRICS

### Profile Screen Usage
- **Target**: 50% of users visit Profile monthly
- **Target**: 20% of users visit Profile weekly
- **Target**: Average visit duration: 20 seconds

### Settings Adoption
- **Target**: 80% of users keep notifications enabled
- [ ] Target: 60% of users use default currency display (FC + USD)
- [ ] Target: 90% of users keep default language

### Support Usage
- **Target**: < 2% of users contact support
- **Target**: 50% reduction in support tickets after FAQ launch
- **Target**: 90% of users find FAQ helpful

### Withdrawal History
- **Target**: 100% of users who withdraw check history
- **Target**: < 1% support tickets about withdrawal status

---

## ANTI-PATTERNS TO AVOID

### ❌ Avoid
- Too many settings (> 10)
- Technical jargon ("API", "token", "cache")
- Cluttered layouts
- Small text (< 13px)
- Low contrast
- No confirmation for logout
- Hidden settings (deep in menu)
- Auto-saving without feedback

### ✅ Embrace
- 3-5 settings (not overwhelming)
- Simple language ("Notifications", "Language")
- Clean layouts
- Readable text (13px minimum)
- High contrast
- Confirmation dialog for logout
- Visible settings (in Profile)
- Immediate feedback (toggle animates)

---

## IMPLEMENTATION NOTES

### Settings Storage
- **Local Storage**: User preferences (language, currency, notifications)
- **Backend**: Sync with user profile (for cross-device sync)
- **Default**: English, FC + USD, Notifications On

### Withdrawal History
- **Pagination**: Load 10 withdrawals at a time
- **Infinite scroll**: Load more when user scrolls to bottom
- **Caching**: Cache for 5 minutes (Redis)

### Support Links
- **FAQ**: In-app screen (accordion)
- **Contact Support**: In-app screen (form) + external links (email, Telegram)
- **Terms/Privacy**: In-app screens (scrollable text)

---

## CONCLUSION

The Profile Screen centralizes all non-transactional user needs. It answers key questions:

- ✅ "Who am I?" - User info section
- ✅ "What are my past withdrawals?" - Withdrawal History section
- ✅ "What can I configure?" - Settings section
- ✅ "Where do I get help?" - Support section
- ✅ "How do I logout?" - Logout button

**Design Philosophy**: Telegram Settings (comprehensive) + Apple Wallet Settings (minimal)

**Key Principles**:
- Separation of concerns (Home = transactional, Profile = operational)
- Clear hierarchy (identity → history → settings → support → logout)
- Immediate feedback (settings save instantly)
- Respectful design (confirmation for destructive actions)
- Fast performance (< 2s load)

**No clutter. No confusion. Just clear, organized, accessible settings.**

---

*Profile Screen UX Version 1.0*
*Created: 2026-07-18*
*Status: Ready for Visual Design*
*Next Step: Task Flow UX Specifications*