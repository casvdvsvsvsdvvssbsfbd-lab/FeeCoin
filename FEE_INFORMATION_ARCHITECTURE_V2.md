# FEE - Information Architecture V2
## Complete App Structure & Navigation Design

---

## DOCUMENT PURPOSE

This document defines the **complete information architecture** for Fee. It organizes every page, every feature, and every navigation path into a logical, scalable structure that minimizes cognitive load and maximizes usability.

**This document is based on:**
- Fee Product DNA
- Fee Complete Product Blueprint
- Fee Complete User Flows

**This document is used by:**
- UX designers (to understand app structure)
- Product managers (to plan features)
- Developers (to implement navigation)
- QA engineers (to test navigation flows)

---

## ARCHITECTURE PRINCIPLES

### 1. Apple-Inspired Organization
- **Flat hierarchy**: Maximum 3 levels deep (Home → Screen → Detail)
- **Clear grouping**: Related features grouped together
- **Minimal navigation**: 3-tab bottom nav, no hidden menus
- **Predictable patterns**: Same navigation everywhere

### 2. Cognitive Load Minimization
- **3 tabs max**: Home, Earn, Profile (Hick's Law)
- **5-7 items max per screen**: Miller's Law
- **One primary action per screen**: Clear next step
- **Progressive disclosure**: Show overview, details on demand

### 3. Scalability to 10M+ Users
- **Modular design**: Each module is independent
- **Feature flags**: Can enable/disable features per user segment
- **A/B testing ready**: Can test different structures
- **Performance optimized**: Lazy loading, caching, CDN

### 4. Accessibility
- **Clear labels**: No jargon, no ambiguity
- **Consistent navigation**: Same patterns everywhere
- **Keyboard accessible**: All features accessible via keyboard
- **Screen reader friendly**: Semantic structure

---

## NAVIGATION ARCHITECTURE

### Top-Level Navigation (3 Tabs)

```
┌─────────────────────────────────────┐
│                                     │
│  🏠 Home    💰 Earn    👤 Profile  │ ← Bottom Navigation (always visible)
│                                     │
└─────────────────────────────────────┘
```

**Rationale**:
- **3 tabs max**: Hick's Law (3-5 options optimal)
- **Clear labels**: Home, Earn, Profile (no jargon)
- **Always visible**: No hidden navigation, no hamburger menus
- **Thumb-friendly**: Bottom of screen (easy to reach)

**Tab Purposes**:
1. **Home**: Quick access to balance, available tasks, recent activity
2. **Earn**: All earning methods in one place
3. **Profile**: User info, settings, support, history

---

## MODULE ORGANIZATION

### Module 1: Core Module (Home)
**Purpose**: Quick access to balance, available tasks, recent activity
**User Frequency**: Daily (100% of users)
**Business Importance**: Critical (first screen users see)
**UX Priority**: Highest
**Future Scalability**: High (can add widgets, customization)

**Pages**:
1. Home (main dashboard)
2. Balance Detail (wallet overview)
3. Transaction History (all transactions)

**Navigation**:
- Entry: Bottom nav (Home tab)
- Exit: Bottom nav (Earn, Profile) or tap task

---

### Module 2: Earning Module (Earn)
**Purpose**: All ways to earn FC in one place
**User Frequency**: Daily (80% of users)
**Business Importance**: Critical (core value proposition)
**UX Priority**: Highest
**Future Scalability**: High (can add new earning methods)

**Pages**:
1. Earn (all earning methods)
2. Daily Bonus (7-day cycle)
3. Daily Check-in (one-tap)
4. Watch Ads (video ads)
5. Complete Tasks (surveys, offers)
6. Install Apps (app offers)
7. Weekly Missions (weekly tasks)
8. Monthly Missions (monthly tasks)
9. Referral (refer friends)
10. Events (seasonal events)

**Navigation**:
- Entry: Bottom nav (Earn tab)
- Exit: Bottom nav (Home, Profile) or complete task

---

### Module 3: Progression Module
**Purpose**: Track progress, achievements, leaderboard
**User Frequency**: Weekly (60% of users)
**Business Importance**: High (retention, engagement)
**UX Priority**: High
**Future Scalability**: Medium (can add more achievements, events)

**Pages**:
1. Achievements (badge grid)
2. Leaderboard (top users)
3. Level Progress (level details)

**Navigation**:
- Entry: Profile tab → Achievements/Leaderboard
- Exit: Back button or bottom nav

---

### Module 4: Financial Module
**Purpose**: Manage earnings, withdrawals, settlement
**User Frequency**: Weekly (40% of users)
**Business Importance**: Critical (trust, transparency)
**UX Priority**: High
**Future Scalability**: High (can add more withdrawal methods, features)

**Pages**:
1. Wallet (balance, pending, settlement info)
2. Settlement History (past settlements)
3. Withdraw (withdrawal form)
4. Withdrawal History (past withdrawals)
5. Transaction History (all transactions)

**Navigation**:
- Entry: Home (balance card) or Profile (Wallet section)
- Exit: Back button or bottom nav

---

### Module 5: Support Module
**Purpose**: Get help, contact support, FAQ
**User Frequency**: Monthly (10% of users)
**Business Importance**: Medium (user satisfaction)
**UX Priority**: Medium
**Future Scalability**: High (can add live chat, AI support)

**Pages**:
1. Support (main support page)
2. FAQ (accordion list)
3. Contact Support (form)
4. Ticket System (create, view, reply)
5. News/Announcements (platform updates)

**Navigation**:
- Entry: Profile (Support section)
- Exit: Back button or bottom nav

---

### Module 6: Settings Module
**Purpose**: User preferences, security, privacy
**User Frequency**: Monthly (20% of users)
**Business Importance**: Medium (user control, trust)
**UX Priority**: Medium
**Future Scalability**: High (can add more settings)

**Pages**:
1. Settings (main settings page)
2. Notifications (notification preferences)
3. Language (language selection)
4. Currency (currency display)
5. Security (2FA, login alerts)
6. Privacy (profile visibility, data)

**Navigation**:
- Entry: Profile (Settings section)
- Exit: Back button or bottom nav

---

### Module 7: Admin Module
**Purpose**: Platform management, moderation, analytics
**User Frequency**: Daily (admin users only)
**Business Importance**: Critical (operations)
**UX Priority**: Low (admin only)
**Future Scalability**: High (can add more admin features)

**Pages**:
1. Admin Panel (main admin dashboard)
2. User Management (view, ban, verify users)
3. Task Management (create, edit, delete tasks)
4. Event Management (create, edit, delete events)
5. Settlement Management (approve, reject settlements)
6. Withdrawal Management (approve, reject withdrawals)
7. Analytics Dashboard (user, revenue, task metrics)
8. Moderation Panel (user reports, task reports)
9. Fraud Detection (alerts, flags)
10. Security Center (incidents, bans, system health)

**Navigation**:
- Entry: Admin login (separate from user app)
- Exit: Logout

---

## COMPLETE PAGE INVENTORY

### Module 1: Core Module (Home)

#### 1.1 Home
- **Purpose**: Main dashboard, quick access to balance, tasks, activity
- **Parent**: None (top-level)
- **Child Pages**: Balance Detail, Transaction History, Earn screens
- **Navigation Method**: Bottom nav (Home tab)
- **User Frequency**: Daily (100%)
- **Business Importance**: Critical
- **UX Priority**: Highest
- **Future Scalability**: High (widgets, customization)

**Sections**:
1. Balance Card (FC balance, USD equivalent)
2. Primary Actions (Watch Ads, Tasks, Install Apps, Refer Friends)
3. Available Now (current tasks)
4. Recent Activity (recent earnings)

**Merged Pages**:
- ✅ Daily Bonus (merged into Earn module)
- ✅ Daily Check-in (merged into Earn module)

**Split Pages**:
- ❌ None (Home is well-scoped)

---

#### 1.2 Balance Detail (Wallet)
- **Purpose**: Detailed balance view, pending earnings, settlement info
- **Parent**: Home (Balance Card)
- **Child Pages**: Transaction History, Withdraw, Settlement History
- **Navigation Method**: Tap Balance Card
- **User Frequency**: Weekly (40%)
- **Business Importance**: Critical
- **UX Priority**: High
- **Future Scalability**: High (can add more financial features)

**Sections**:
1. Current Balance (FC, USD)
2. Pending Earnings (FC, USD)
3. Next Settlement (date, amount)
4. Withdrawal Threshold (minimum FC)
5. Quick Actions (Withdraw, History)

**Merged Pages**:
- ✅ Wallet + Balance Detail (merged into one page)

**Split Pages**:
- ❌ None (well-scoped)

---

#### 1.3 Transaction History
- **Purpose**: View all transactions (FC earned, settlement, withdrawal)
- **Parent**: Balance Detail (Wallet)
- **Child Pages**: Transaction Detail (future)
- **Navigation Method**: Tap "Transaction History" button
- **User Frequency**: Weekly (30%)
- **Business Importance**: High
- **UX Priority**: Medium
- **Future Scalability**: Medium (can add filters, export)

**Sections**:
1. Filter tabs (All, FC Earned, Settlement, Withdrawal)
2. Transaction list (date, type, amount, status)
3. Pull-to-refresh

**Merged Pages**:
- ✅ History + Transaction History (merged into one page)

**Split Pages**:
- ❌ None (well-scoped)

---

### Module 2: Earning Module (Earn)

#### 2.1 Earn (Main Earning Hub)
- **Purpose**: All earning methods in one place
- **Parent**: None (top-level, bottom nav)
- **Child Pages**: Daily Bonus, Daily Check-in, Watch Ads, Complete Tasks, Install Apps, Weekly Missions, Monthly Missions, Referral, Events
- **Navigation Method**: Bottom nav (Earn tab)
- **User Frequency**: Daily (80%)
- **Business Importance**: Critical
- **UX Priority**: Highest
- **Future Scalability**: High (can add new earning methods)

**Sections**:
1. Daily Section (Daily Bonus, Daily Check-in)
2. Tasks Section (Watch Ads, Complete Tasks, Install Apps)
3. Missions Section (Weekly Missions, Monthly Missions)
4. Social Section (Referral)
5. Special Section (Events)

**Merged Pages**:
- ✅ All earning methods merged into one "Earn" screen
- ✅ Daily Bonus + Daily Check-in (grouped in Daily section)

**Split Pages**:
- ❌ None (grouped logically)

---

#### 2.2 Daily Bonus
- **Purpose**: 7-day reward cycle, increasing rewards
- **Parent**: Earn (Daily section)
- **Child Pages**: None
- **Navigation Method**: Tap "Daily Bonus" card
- **User Frequency**: Daily (70%)
- **Business Importance**: High
- **UX Priority**: High
- **Future Scalability**: Low (stable feature)

**Sections**:
1. 7-day cycle visualization
2. Current day reward
3. Claim button
4. Streak indicator

**Merged Pages**:
- ✅ Daily Bonus + Daily Check-in (grouped in Earn → Daily section)

**Split Pages**:
- ❌ None (well-scoped)

---

#### 2.3 Daily Check-in
- **Purpose**: One-tap daily check-in, 5 FC reward
- **Parent**: Earn (Daily section)
- **Child Pages**: None
- **Navigation Method**: Tap "Daily Check-in" button
- **User Frequency**: Daily (60%)
- **Business Importance**: Medium
- **UX Priority**: High
- **Future Scalability**: Low (stable feature)

**Sections**:
1. Check-in button
2. Streak indicator
3. Reward display (5 FC)

**Merged Pages**:
- ✅ Daily Check-in + Daily Bonus (grouped in Earn → Daily section)

**Split Pages**:
- ❌ None (well-scoped)

---

#### 2.4 Watch Ads
- **Purpose**: Watch video ads to earn FC
- **Parent**: Earn (Tasks section) or Home (Primary Actions)
- **Child Pages**: Ad Queue, Task Detail, Ad Player, Completion Screen
- **Navigation Method**: Tap "Watch Ads" button
- **User Frequency**: Daily (50%)
- **Business Importance**: Critical
- **UX Priority**: Highest
- **Future Scalability**: High (can add new ad formats)

**Flow**:
1. Ad Queue (if multiple ads)
2. Task Detail (optional)
3. Ad Player (full-screen video)
4. Completion Screen

**Merged Pages**:
- ✅ Watch Ads flow pages (Ad Queue, Task Detail, Ad Player, Completion) kept separate (flow screens)

**Split Pages**:
- ❌ None (well-scoped)

---

#### 2.5 Complete Tasks
- **Purpose**: Complete surveys, offers, quizzes to earn FC
- **Parent**: Earn (Tasks section) or Home (Primary Actions)
- **Child Pages**: Task List, Task Detail, Task Execution, Completion Screen
- **Navigation Method**: Tap "Tasks" button
- **User Frequency**: Daily (60%)
- **Business Importance**: Critical
- **UX Priority**: Highest
- **Future Scalability**: High (can add new task types)

**Flow**:
1. Task List (filtered by category)
2. Task Detail (optional)
3. Task Execution (survey, offer, quiz)
4. Completion Screen

**Merged Pages**:
- ✅ Complete Tasks flow pages (Task List, Task Detail, Task Execution, Completion) kept separate (flow screens)

**Split Pages**:
- ❌ None (well-scoped)

---

#### 2.6 Install Apps
- **Purpose**: Install and try new apps to earn FC
- **Parent**: Earn (Tasks section) or Home (Primary Actions)
- **Child Pages**: App Offers List, Task Detail, App Store, Verification, Completion Screen
- **Navigation Method**: Tap "Install Apps" button
- **User Frequency**: Weekly (30%)
- **Business Importance**: High
- **UX Priority**: High
- **Future Scalability**: High (can add new app offers)

**Flow**:
1. App Offers List
2. Task Detail (optional)
3. App Store (external)
4. Verification Screen
5. Completion Screen

**Merged Pages**:
- ✅ Install Apps flow pages (App Offers, Task Detail, Verification, Completion) kept separate (flow screens)

**Split Pages**:
- ❌ None (well-scoped)

---

#### 2.7 Weekly Missions
- **Purpose**: Weekly tasks with higher rewards
- **Parent**: Earn (Missions section)
- **Child Pages**: Mission Detail, Mission Execution, Completion Screen
- **Navigation Method**: Tap "Weekly Missions" card
- **User Frequency**: Weekly (40%)
- **Business Importance**: High
- **UX Priority**: High
- **Future Scalability**: Medium (stable feature)

**Sections**:
1. Mission list (3-5 missions)
2. Progress indicator
3. Time remaining (resets Monday)

**Merged Pages**:
- ✅ Weekly Missions + Monthly Missions (grouped in Earn → Missions section)

**Split Pages**:
- ❌ None (well-scoped)

---

#### 2.8 Monthly Missions
- **Purpose**: Monthly tasks with highest rewards
- **Parent**: Earn (Missions section)
- **Child Pages**: Mission Detail, Mission Execution, Completion Screen
- **Navigation Method**: Tap "Monthly Missions" card
- **User Frequency**: Monthly (30%)
- **Business Importance**: High
- **UX Priority**: High
- **Future Scalability**: Medium (stable feature)

**Sections**:
1. Mission list (5-10 missions)
2. Progress indicator
3. Time remaining (resets 1st of month)

**Merged Pages**:
- ✅ Monthly Missions + Weekly Missions (grouped in Earn → Missions section)

**Split Pages**:
- ❌ None (well-scoped)

---

#### 2.9 Referral
- **Purpose**: Share referral code/link, track referrals
- **Parent**: Earn (Social section) or Home (Primary Actions)
- **Child Pages**: None
- **Navigation Method**: Tap "Refer Friends" button
- **User Frequency**: Monthly (20%)
- **Business Importance**: High (viral growth)
- **UX Priority**: High
- **Future Scalability**: Medium (stable feature)

**Sections**:
1. Referral Code (copy)
2. Referral Link (copy, share)
3. Referral History (list of referrals)
4. How It Works (4-step process)

**Merged Pages**:
- ✅ Referral Dashboard (all referral features in one page)

**Split Pages**:
- ❌ None (well-scoped)

---

#### 2.10 Events
- **Purpose**: Seasonal and temporary events
- **Parent**: Earn (Special section) or Home (event banner)
- **Child Pages**: Event Detail, Event Execution, Completion Screen
- **Navigation Method**: Tap event banner or "Events" card
- **User Frequency**: Weekly (during events)
- **Business Importance**: Medium
- **UX Priority**: Medium
- **Future Scalability**: High (can add many events)

**Sections**:
1. Active events list
2. Event details (requirements, rewards, duration)
3. Event progress

**Merged Pages**:
- ✅ Events page (all events in one page)

**Split Pages**:
- ❌ None (well-scoped)

---

### Module 3: Progression Module

#### 3.1 Achievements
- **Purpose**: View achievements, track progress, earn badges
- **Parent**: Profile (Achievements section)
- **Child Pages**: Achievement Detail (future)
- **Navigation Method**: Tap "Achievements" card
- **User Frequency**: Weekly (30%)
- **Business Importance**: Medium
- **UX Priority**: Medium
- **Future Scalability**: High (can add many achievements)

**Sections**:
1. Achievement grid (by category)
2. Progress indicator
3. Badge display

**Merged Pages**:
- ✅ Achievements page (all achievements in one page)

**Split Pages**:
- ❌ None (well-scoped)

---

#### 3.2 Leaderboard
- **Purpose**: View top users by FC, level, referrals, streak
- **Parent**: Profile (Leaderboard section) or Earn (Leaderboard section)
- **Child Pages**: None
- **Navigation Method**: Tap "Leaderboard" card
- **User Frequency**: Weekly (20%)
- **Business Importance**: Medium
- **UX Priority**: Medium
- **Future Scalability**: High (can add more categories)

**Sections**:
1. Category tabs (Top Earners, Top Level, Top Referrers, Top Streak)
2. Leaderboard list (top 100)
3. User rank (if in top 100)

**Merged Pages**:
- ✅ Leaderboard page (all categories in one page)

**Split Pages**:
- ❌ None (well-scoped)

---

#### 3.3 Level Progress
- **Purpose**: View level progress, next level requirements
- **Parent**: Profile (Level section) or Home (Level indicator)
- **Child Pages**: None
- **Navigation Method**: Tap level indicator
- **User Frequency**: Weekly (40%)
- **Business Importance**: Medium
- **UX Priority**: Medium
- **Future Scalability**: Low (stable feature)

**Sections**:
1. Current level
2. Progress to next level (progress bar)
3. Level benefits
4. Next level requirements

**Merged Pages**:
- ✅ Level Progress (merged into Profile page)

**Split Pages**:
- ❌ None (well-scoped)

---

### Module 4: Financial Module

#### 4.1 Wallet
- **Purpose**: View balance, pending earnings, settlement info
- **Parent**: Home (Balance Card) or Profile (Wallet section)
- **Child Pages**: Transaction History, Withdraw, Settlement History
- **Navigation Method**: Tap Balance Card
- **User Frequency**: Weekly (40%)
- **Business Importance**: Critical
- **UX Priority**: High
- **Future Scalability**: High (can add more financial features)

**Sections**:
1. Current Balance (FC, USD)
2. Pending Earnings (FC, USD)
3. Next Settlement (date, amount)
4. Withdrawal Threshold (minimum FC)
5. Quick Actions (Withdraw, History)

**Merged Pages**:
- ✅ Wallet + Balance Detail (merged into one page)

**Split Pages**:
- ❌ None (well-scoped)

---

#### 4.2 Settlement History
- **Purpose**: View past settlements, understand settlement process
- **Parent**: Wallet (Settlement section)
- **Child Pages**: Settlement Detail (future)
- **Navigation Method**: Tap "Settlement History" button
- **User Frequency**: Monthly (30%)
- **Business Importance**: High
- **UX Priority**: Medium
- **Future Scalability**: Medium (stable feature)

**Sections**:
1. Settlement list (date, FC, USD, status)
2. Next settlement date
3. Pending earnings

**Merged Pages**:
- ✅ Settlement + Settlement History (merged into Wallet page)

**Split Pages**:
- ❌ None (well-scoped)

---

#### 4.3 Withdraw
- **Purpose**: Withdraw earnings to Payeer account
- **Parent**: Wallet (Withdraw button)
- **Child Pages**: Withdrawal History
- **Navigation Method**: Tap "Withdraw" button
- **User Frequency**: Monthly (20%)
- **Business Importance**: Critical
- **UX Priority**: High
- **Future Scalability**: High (can add more withdrawal methods)

**Sections**:
1. Withdrawal form (amount, Payeer account)
2. Minimum withdrawal (5,000 FC ≈ $50 USD)
3. Processing time (24-48 hours)
4. Fee (2%)
5. Confirmation

**Merged Pages**:
- ✅ Withdraw + Withdrawal History (merged into Wallet page)

**Split Pages**:
- ❌ None (well-scoped)

---

#### 4.4 Transaction History
- **Purpose**: View all transactions (FC earned, settlement, withdrawal)
- **Parent**: Wallet (Transaction History button)
- **Child Pages**: Transaction Detail (future)
- **Navigation Method**: Tap "Transaction History" button
- **User Frequency**: Weekly (30%)
- **Business Importance**: High
- **UX Priority**: Medium
- **Future Scalability**: Medium (can add filters, export)

**Sections**:
1. Filter tabs (All, FC Earned, Settlement, Withdrawal)
2. Transaction list (date, type, amount, status)
3. Pull-to-refresh

**Merged Pages**:
- ✅ Transaction History (merged into Wallet page)

**Split Pages**:
- ❌ None (well-scoped)

---

### Module 5: Support Module

#### 5.1 Support
- **Purpose**: Get help, contact support, view FAQ
- **Parent**: Profile (Support section)
- **Child Pages**: FAQ, Contact Support, Ticket System, News
- **Navigation Method**: Tap "Support" button
- **User Frequency**: Monthly (10%)
- **Business Importance**: Medium
- **UX Priority**: Medium
- **Future Scalability**: High (can add live chat, AI support)

**Sections**:
1. FAQ (accordion list)
2. Contact Support (form)
3. Ticket System (create, view, reply)
4. News/Announcements (platform updates)

**Merged Pages**:
- ✅ Support + FAQ + Contact Support + Ticket System + News (merged into one Support page with sections)

**Split Pages**:
- ❌ None (grouped logically)

---

#### 5.2 FAQ
- **Purpose**: View frequently asked questions
- **Parent**: Support (FAQ section)
- **Child Pages**: None
- **Navigation Method**: Tap "FAQ" section
- **User Frequency**: Monthly (10%)
- **Business Importance**: Medium
- **UX Priority**: Medium
- **Future Scalability**: High (can add more FAQs)

**Sections**:
1. FAQ categories (General, Tasks, Withdrawal, Account)
2. Accordion list (question + answer)
3. Search (future)

**Merged Pages**:
- ✅ FAQ (merged into Support page)

**Split Pages**:
- ❌ None (well-scoped)

---

#### 5.3 Contact Support
- **Purpose**: Contact support team via form
- **Parent**: Support (Contact Support section)
- **Child Pages**: None
- **Navigation Method**: Tap "Contact Support" button
- **User Frequency**: Monthly (5%)
- **Business Importance**: Medium
- **UX Priority**: Medium
- **Future Scalability**: High (can add live chat)

**Sections**:
1. Form (title, category, description)
2. Submit button
3. Response time (24 hours)

**Merged Pages**:
- ✅ Contact Support (merged into Support page)

**Split Pages**:
- ❌ None (well-scoped)

---

#### 5.4 Ticket System
- **Purpose**: Create, view, reply to support tickets
- **Parent**: Support (Ticket System section)
- **Child Pages**: Ticket Detail
- **Navigation Method**: Tap "Ticket System" button
- **User Frequency**: Monthly (5%)
- **Business Importance**: Medium
- **UX Priority**: Medium
- **Future Scalability**: High (can add more ticket features)

**Sections**:
1. Ticket list (all tickets)
2. Create ticket button
3. Ticket status (pending, in progress, resolved, closed)

**Merged Pages**:
- ✅ Ticket System (merged into Support page)

**Split Pages**:
- ❌ None (well-scoped)

---

#### 5.5 News/Announcements
- **Purpose**: View platform updates, new features, events
- **Parent**: Support (News section) or Home (announcement banner)
- **Child Pages**: None
- **Navigation Method**: Tap "News" button or announcement banner
- **User Frequency**: Weekly (20%)
- **Business Importance**: Medium
- **UX Priority**: Low
- **Future Scalability**: High (can add more content types)

**Sections**:
1. Announcement list (title, date, content)
2. Mark as read
3. Push notifications (optional)

**Merged Pages**:
- ✅ News (merged into Support page)

**Split Pages**:
- ❌ None (well-scoped)

---

### Module 6: Settings Module

#### 6.1 Settings
- **Purpose**: Manage preferences, security, privacy
- **Parent**: Profile (Settings section)
- **Child Pages**: Notifications, Language, Currency, Security, Privacy
- **Navigation Method**: Tap "Settings" button
- **User Frequency**: Monthly (20%)
- **Business Importance**: Medium
- **UX Priority**: Medium
- **Future Scalability**: High (can add more settings)

**Sections**:
1. Notifications (on/off, by type)
2. Language (select language)
3. Currency (FC only, USD only, FC + USD)
4. Security (2FA, login alerts)
5. Privacy (profile visibility, leaderboard opt-out)

**Merged Pages**:
- ✅ Settings + Notifications + Language + Currency + Security + Privacy (merged into one Settings page with sections)

**Split Pages**:
- ❌ None (grouped logically)

---

#### 6.2 Notifications
- **Purpose**: Manage notification preferences
- **Parent**: Settings (Notifications section)
- **Child Pages**: None
- **Navigation Method**: Tap "Notifications" setting
- **User Frequency**: Monthly (15%)
- **Business Importance**: Medium
- **UX Priority**: Medium
- **Future Scalability**: High (can add more notification types)

**Sections**:
1. Notification types (daily bonus, missions, events, system, referral, achievement)
2. Toggle switches (on/off)
3. Sound/vibration (future)

**Merged Pages**:
- ✅ Notifications (merged into Settings page)

**Split Pages**:
- ❌ None (well-scoped)

---

#### 6.3 Language
- **Purpose**: Change app language
- **Parent**: Settings (Language section)
- **Child Pages**: None
- **Navigation Method**: Tap "Language" setting
- **User Frequency**: Rarely (5%)
- **Business Importance**: Low
- **UX Priority**: Low
- **Future Scalability**: High (can add more languages)

**Sections**:
1. Language list (English, Spanish, Portuguese, etc.)
2. Current language (selected)

**Merged Pages**:
- ✅ Language (merged into Settings page)

**Split Pages**:
- ❌ None (well-scoped)

---

#### 6.4 Currency
- **Purpose**: Change currency display (FC, USD, both)
- **Parent**: Settings (Currency section)
- **Child Pages**: None
- **Navigation Method**: Tap "Currency" setting
- **User Frequency**: Rarely (5%)
- **Business Importance**: Low
- **UX Priority**: Low
- **Future Scalability**: Medium (stable feature)

**Sections**:
1. Currency options (FC only, USD only, FC + USD)
2. Current currency (selected)

**Merged Pages**:
- ✅ Currency (merged into Settings page)

**Split Pages**:
- ❌ None (well-scoped)

---

#### 6.5 Security
- **Purpose**: Manage security settings (2FA, login alerts)
- **Parent**: Settings (Security section)
- **Child Pages**: None
- **Navigation Method**: Tap "Security" setting
- **User Frequency**: Rarely (5%)
- **Business Importance**: Medium
- **UX Priority**: Medium
- **Future Scalability**: Medium (stable feature)

**Sections**:
1. Two-factor authentication (2FA)
2. Login alerts (new device, new location)
3. Session management (future)

**Merged Pages**:
- ✅ Security (merged into Settings page)

**Split Pages**:
- ❌ None (well-scoped)

---

#### 6.6 Privacy
- **Purpose**: Manage privacy settings (profile visibility, data)
- **Parent**: Settings (Privacy section)
- **Child Pages**: None
- **Navigation Method**: Tap "Privacy" setting
- **User Frequency**: Rarely (5%)
- **Business Importance**: Medium
- **UX Priority**: Medium
- **Future Scalability**: Medium (stable feature)

**Sections**:
1. Profile visibility (public, private)
2. Leaderboard opt-out
3. Data export (GDPR)
4. Delete account (future)

**Merged Pages**:
- ✅ Privacy (merged into Settings page)

**Split Pages**:
- ❌ None (well-scoped)

---

### Module 7: Profile Module

#### 7.1 Profile
- **Purpose**: View user info, stats, access settings and support
- **Parent**: None (top-level, bottom nav)
- **Child Pages**: Settings, Support, Achievements, Leaderboard, Wallet
- **Navigation Method**: Bottom nav (Profile tab)
- **User Frequency**: Weekly (50%)
- **Business Importance**: High
- **UX Priority**: High
- **Future Scalability**: High (can add more profile features)

**Sections**:
1. User Info (avatar, name, username, level, rank)
2. Stats (total earned, tasks, referrals, streak)
3. Achievements (badge grid)
4. Leaderboard (rank)
5. Wallet (balance, withdrawal history)
6. Settings (notifications, language, currency, security, privacy)
7. Support (FAQ, Contact, Tickets, News)
8. Logout

**Merged Pages**:
- ✅ Profile + User Info + Stats + Achievements + Leaderboard + Wallet + Settings + Support (merged into one Profile page with sections)

**Split Pages**:
- ❌ None (grouped logically)

---

#### 7.2 Logout
- **Purpose**: Logout of account, switch Telegram account
- **Parent**: Profile (Logout button)
- **Child Pages**: None
- **Navigation Method**: Tap "Logout" button
- **User Frequency**: Rarely (5%)
- **Business Importance**: Low
- **UX Priority**: Medium
- **Future Scalability**: Low (stable feature)

**Sections**:
1. Confirmation dialog
2. Session clear
3. Return to Language Selection

**Merged Pages**:
- ✅ Logout (part of Profile page)

**Split Pages**:
- ❌ None (well-scoped)

---

### Module 8: Admin Module (Separate from User App)

#### 8.1 Admin Panel
- **Purpose**: Platform management, user management, task management
- **Parent**: None (separate admin app)
- **Child Pages**: User Management, Task Management, Event Management, Settlement Management, Withdrawal Management
- **Navigation Method**: Admin login (separate from user app)
- **User Frequency**: Daily (admin users only)
- **Business Importance**: Critical
- **UX Priority**: Low (admin only)
- **Future Scalability**: High (can add more admin features)

**Sections**:
1. Dashboard (overview metrics)
2. User Management (view, ban, verify)
3. Task Management (create, edit, delete)
4. Event Management (create, edit, delete)
5. Settlement Management (approve, reject)
6. Withdrawal Management (approve, reject)

**Merged Pages**:
- ✅ Admin Panel (all admin features in one page with sections)

**Split Pages**:
- ❌ None (admin only, can be complex)

---

#### 8.2 Moderation Panel
- **Purpose**: Content moderation, user reports, fraud detection
- **Parent**: Admin Panel (Moderation section)
- **Child Pages**: None
- **Navigation Method**: Admin login
- **User Frequency**: Daily (admin users only)
- **Business Importance**: Critical
- **UX Priority**: Low (admin only)
- **Future Scalability**: High (can add more moderation features)

**Sections**:
1. User Reports (view, action)
2. Task Reports (view, action)
3. Fraud Detection (alerts, flags)
4. User Bans (temporary, permanent)

**Merged Pages**:
- ✅ Moderation Panel (merged into Admin Panel)

**Split Pages**:
- ❌ None (admin only)

---

#### 8.3 Analytics
- **Purpose**: Platform analytics, revenue, user metrics
- **Parent**: Admin Panel (Analytics section)
- **Child Pages**: None
- **Navigation Method**: Admin login
- **User Frequency**: Daily (admin users only)
- **Business Importance**: Critical
- **UX Priority**: Low (admin only)
- **Future Scalability**: High (can add more analytics)

**Sections**:
1. User Metrics (DAU, MAU, retention)
2. Revenue Metrics (ad revenue, app install revenue)
3. Task Metrics (completion rate, abandonment rate)
4. Settlement Metrics (FC settled, USD paid out)
5. Support Metrics (tickets, response time)

**Merged Pages**:
- ✅ Analytics (merged into Admin Panel)

**Split Pages**:
- ❌ None (admin only)

---

#### 8.4 Fraud Detection
- **Purpose**: Detect and prevent fraud
- **Parent**: Admin Panel (Fraud Detection section)
- **Child Pages**: None
- **Navigation Method**: Admin login
- **User Frequency**: Daily (admin users only)
- **Business Importance**: Critical
- **UX Priority**: Low (admin only)
- **Future Scalability**: High (can add more fraud detection)

**Sections**:
1. Alerts (multiple accounts, VPN, bot)
2. Flags (unusual earning patterns)
3. Actions (investigate, ban, refund)

**Merged Pages**:
- ✅ Fraud Detection (merged into Admin Panel)

**Split Pages**:
- ❌ None (admin only)

---

#### 8.5 Security Center
- **Purpose**: Monitor security, respond to incidents
- **Parent**: Admin Panel (Security Center section)
- **Child Pages**: None
- **Navigation Method**: Admin login
- **User Frequency**: Daily (admin users only)
- **Business Importance**: Critical
- **UX Priority**: Low (admin only)
- **Future Scalability**: High (can add more security features)

**Sections**:
1. Security Incidents (log, severity, status)
2. User Bans (log, reason, duration)
3. System Health (server, database, CDN, WebSocket)
4. Backup & Recovery (daily backups, verification)

**Merged Pages**:
- ✅ Security Center (merged into Admin Panel)

**Split Pages**:
- ❌ None (admin only)

---

## PAGE CONSOLIDATION SUMMARY

### Pages Merged (Reducing from 33 to 15)

**Original 33 Pages** → **Consolidated 15 Pages**

1. **Home** (unchanged)
2. **Earn** (merged: Daily Bonus, Daily Check-in, Watch Ads, Complete Tasks, Install Apps, Weekly Missions, Monthly Missions, Referral, Events)
3. **Profile** (merged: User Info, Stats, Achievements, Leaderboard, Level Progress, Wallet, Settings, Support, Logout)
4. **Wallet** (merged: Balance Detail, Settlement History, Withdraw, Transaction History)
5. **Support** (merged: FAQ, Contact Support, Ticket System, News)
6. **Settings** (merged: Notifications, Language, Currency, Security, Privacy)
7. **Admin Panel** (merged: User Management, Task Management, Event Management, Settlement Management, Withdrawal Management, Moderation Panel, Analytics, Fraud Detection, Security Center)

**Flow Screens** (not counted in page total):
- Ad Queue, Task Detail, Ad Player, Completion Screen
- Task List, Task Execution
- App Offers List, Verification Screen
- Referral Dashboard
- Mission Detail, Mission Execution
- Event Detail, Event Execution
- Withdrawal Form
- Ticket Detail

**Total User-Facing Pages**: 6 (Home, Earn, Profile, Wallet, Support, Settings)
**Total Admin Pages**: 1 (Admin Panel)
**Total Flow Screens**: ~20 (temporary, part of flows)

---

## NAVIGATION FLOWS

### Primary Navigation (Bottom Tabs)

```
Home (Tab 1)
  ↓
Earn (Tab 2)
  ↓
Profile (Tab 3)
```

**Rationale**:
- 3 tabs max (Hick's Law)
- Clear hierarchy (Home → Earn → Profile)
- Always visible (no hidden navigation)
- Thumb-friendly (bottom of screen)

---

### Secondary Navigation (Within Tabs)

**Home Tab**:
- Balance Card → Wallet
- Primary Actions → Earn screens
- Available Now → Task Detail/Execution
- Recent Activity → Transaction History

**Earn Tab**:
- Daily Section → Daily Bonus, Daily Check-in
- Tasks Section → Watch Ads, Complete Tasks, Install Apps
- Missions Section → Weekly Missions, Monthly Missions
- Social Section → Referral
- Special Section → Events

**Profile Tab**:
- User Info → (none, read-only)
- Stats → (none, read-only)
- Achievements → Achievements screen
- Leaderboard → Leaderboard screen
- Wallet → Wallet screen
- Settings → Settings screen
- Support → Support screen
- Logout → Confirmation dialog

---

### Tertiary Navigation (Within Screens)

**Wallet**:
- Balance Card → Transaction History
- Withdraw Button → Withdraw form
- Settlement History → Settlement list
- Transaction History → Transaction list

**Support**:
- FAQ → FAQ accordion
- Contact Support → Ticket form
- Ticket System → Ticket list
- News → Announcement list

**Settings**:
- Notifications → Notification toggles
- Language → Language list
- Currency → Currency options
- Security → Security settings
- Privacy → Privacy settings

---

## UNNECESSARY PAGES REMOVED

### Pages Removed (Not Needed)

1. **Separate Daily Bonus Page** → Merged into Earn → Daily section
2. **Separate Daily Check-in Page** → Merged into Earn → Daily section
3. **Separate Watch Ads Page** → Part of Earn → Tasks section (flow screens remain)
4. **Separate Complete Tasks Page** → Part of Earn → Tasks section (flow screens remain)
5. **Separate Install Apps Page** → Part of Earn → Tasks section (flow screens remain)
6. **Separate Weekly Missions Page** → Part of Earn → Missions section
7. **Separate Monthly Missions Page** → Part of Earn → Missions section
8. **Separate Referral Page** → Part of Earn → Social section
9. **Separate Events Page** → Part of Earn → Special section
10. **Separate Achievements Page** → Part of Profile (section)
11. **Separate Leaderboard Page** → Part of Profile (section)
12. **Separate Level Progress Page** → Part of Profile (section)
13. **Separate Wallet Page** → Merged into Wallet (Balance Detail + Settlement + Withdraw + History)
14. **Separate Settlement Page** → Part of Wallet
15. **Separate Withdraw Page** → Part of Wallet
16. **Separate History Page** → Part of Wallet
17. **Separate Support Page** → Merged into Support (FAQ + Contact + Tickets + News)
18. **Separate FAQ Page** → Part of Support
19. **Separate Contact Support Page** → Part of Support
20. **Separate Ticket System Page** → Part of Support
21. **Separate News Page** → Part of Support
22. **Separate Settings Page** → Merged into Settings (Notifications + Language + Currency + Security + Privacy)
23. **Separate Notifications Page** → Part of Settings
24. **Separate Language Page** → Part of Settings
25. **Separate Currency Page** → Part of Settings
26. **Separate Security Page** → Part of Settings
27. **Separate Privacy Page** → Part of Settings
28. **Separate User Info Page** → Part of Profile
29. **Separate Stats Page** → Part of Profile
30. **Separate Logout Page** → Part of Profile (dialog)

**Result**: Reduced from 33 pages to 6 user-facing pages + 1 admin page

---

## PAGES MERGED

### Merge 1: Earn Module
**Before**: 9 separate pages (Daily Bonus, Daily Check-in, Watch Ads, Complete Tasks, Install Apps, Weekly Missions, Monthly Missions, Referral, Events)
**After**: 1 Earn page with 5 sections (Daily, Tasks, Missions, Social, Special)
**Rationale**: All earning methods in one place, reduces navigation, easier to discover

### Merge 2: Profile Module
**Before**: 8 separate pages (User Info, Stats, Achievements, Leaderboard, Level Progress, Wallet, Settings, Support)
**After**: 1 Profile page with 8 sections
**Rationale**: All user-related features in one place, reduces navigation, easier to discover

### Merge 3: Wallet Module
**Before**: 4 separate pages (Balance Detail, Settlement History, Withdraw, Transaction History)
**After**: 1 Wallet page with 4 sections
**Rationale**: All financial features in one place, reduces navigation, easier to discover

### Merge 4: Support Module
**Before**: 5 separate pages (FAQ, Contact Support, Ticket System, News, Support)
**After**: 1 Support page with 4 sections
**Rationale**: All support features in one place, reduces navigation, easier to discover

### Merge 5: Settings Module
**Before**: 6 separate pages (Settings, Notifications, Language, Currency, Security, Privacy)
**After**: 1 Settings page with 5 sections
**Rationale**: All settings in one place, reduces navigation, easier to discover

---

## PAGES SPLIT

### Split 1: Home (No Split Needed)
**Status**: Well-scoped, no split needed
**Sections**: Balance Card, Primary Actions, Available Now, Recent Activity

### Split 2: Earn (No Split Needed)
**Status**: Well-scoped with sections, no split needed
**Sections**: Daily, Tasks, Missions, Social, Special

### Split 3: Profile (No Split Needed)
**Status**: Well-scoped with sections, no split needed
**Sections**: User Info, Stats, Achievements, Leaderboard, Wallet, Settings, Support, Logout

### Split 4: Wallet (No Split Needed)
**Status**: Well-scoped with sections, no split needed
**Sections**: Balance, Pending Earnings, Next Settlement, Withdrawal Threshold, Quick Actions

### Split 5: Support (No Split Needed)
**Status**: Well-scoped with sections, no split needed
**Sections**: FAQ, Contact Support, Ticket System, News

### Split 6: Settings (No Split Needed)
**Status**: Well-scoped with sections, no split needed
**Sections**: Notifications, Language, Currency, Security, Privacy

---

## NAVIGATION PRIORITY

### Primary Navigation (Bottom Tabs)
1. **Home** (Tab 1) - Highest priority
2. **Earn** (Tab 2) - Highest priority
3. **Profile** (Tab 3) - High priority

### Secondary Navigation (Within Tabs)
**Home**:
1. Balance Card → Wallet (High priority)
2. Primary Actions → Earn screens (High priority)
3. Available Now → Task Detail (High priority)
4. Recent Activity → Transaction History (Medium priority)

**Earn**:
1. Daily Bonus (High priority)
2. Daily Check-in (High priority)
3. Watch Ads (High priority)
4. Complete Tasks (High priority)
5. Install Apps (Medium priority)
6. Weekly Missions (Medium priority)
7. Monthly Missions (Medium priority)
8. Referral (Medium priority)
9. Events (Low priority)

**Profile**:
1. Achievements (Medium priority)
2. Leaderboard (Medium priority)
3. Wallet (High priority)
4. Settings (Medium priority)
5. Support (Medium priority)
6. Logout (Low priority)

---

## SCALABILITY TO 10M+ USERS

### Modular Design
- Each module is independent (Core, Earning, Progression, Financial, Support, Settings, Admin)
- Can add new features to modules without affecting other modules
- Can disable modules for specific user segments (feature flags)

### Performance Optimization
- **Lazy loading**: Load screens only when needed
- **Caching**: Cache frequently accessed data (balance, tasks)
- **CDN**: Serve static assets via CDN
- **Pagination**: Load large lists in chunks (transactions, leaderboard)

### A/B Testing Ready
- Can test different navigation structures
- Can test different page layouts
- Can test different feature placements
- Can test different user flows

### Feature Flags
- Can enable/disable features per user segment
- Can roll out features gradually
- Can disable features if issues arise
- Can test features with small user groups

### Analytics Ready
- Track navigation paths
- Track page views
- Track drop-off points
- Track user flows
- Track feature usage

---

## ACCESSIBILITY

### Navigation
- **Bottom tabs**: Always visible, clear labels
- **Back button**: Always visible, clear purpose
- **No hidden gestures**: All navigation via tap
- **No circular navigation**: Linear, predictable

### Labels
- **Clear labels**: No jargon, no ambiguity
- **Consistent terminology**: Same terms everywhere
- **Descriptive labels**: Explain what will happen
- **No icon-only buttons**: Always have text label

### Keyboard Navigation
- **All features accessible**: Via keyboard
- **Logical tab order**: Top to bottom, left to right
- **Visible focus indicators**: Clear focus state
- **No keyboard traps**: Can always escape

### Screen Reader
- **Semantic structure**: Headings, landmarks, labels
- **ARIA labels**: All interactive elements
- **Live regions**: Dynamic content updates
- **Descriptive text**: Context, purpose, state

---

## CONCLUSION

This Information Architecture V2 is designed to:

1. **Minimize cognitive load**: 3 tabs, 5-7 items per screen, clear hierarchy
2. **Maximize usability**: Logical grouping, predictable navigation, clear labels
3. **Scale to 10M+ users**: Modular design, feature flags, A/B testing ready
4. **Maintain accessibility**: WCAG AA, keyboard navigation, screen reader
5. **Support all features**: 33 original pages consolidated to 6 user-facing pages

**Key Changes from V1**:
- Reduced from 33 pages to 6 user-facing pages
- Grouped related features into modules
- Simplified navigation (3 tabs, clear hierarchy)
- Merged redundant pages
- Removed unnecessary pages
- Improved scalability

**Next Steps**:
1. Review with stakeholders
2. Validate with users (usability testing)
3. Create visual designs for each page
4. Implement navigation structure
5. Test with real users
6. Iterate based on feedback

**This architecture is the foundation for all design and development work. Every screen, every feature, every navigation path must align with this structure.**

---

*Information Architecture V2*
*Created: 2026-07-18*
*Status: COMPLETE*
*Next Phase: Visual Design*