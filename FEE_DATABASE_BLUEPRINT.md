# FEE - Database Blueprint
## Complete Data Architecture for 10 Million Users

---

## DOCUMENT PURPOSE

This document defines the **complete data architecture** for Fee. It identifies every entity, their relationships, lifecycles, and data management strategies. This is the foundation for database design, data modeling, and data governance.

**This document is based on:**
- Fee Product DNA
- Fee Complete Product Blueprint
- Fee Complete User Flows
- Fee Information Architecture V2
- Fee Complete Feature Specification
- Fee System Architecture

**This document is used by:**
- Database architects (to design schema)
- Backend developers (to implement data access)
- Data engineers (to build data pipelines)
- Security engineers (to ensure data security)
- Compliance officers (to ensure GDPR compliance)

---

## ENTITY INVENTORY

### Total Entities: 45

**User Management (5)**:
1. Users
2. User Profiles
3. User Settings
4. User Preferences
5. User Sessions

**Financial Core (8)**:
6. Wallets
7. Transactions
8. Settlements
9. Withdraw Requests
10. Withdrawal History
11. FC Ledger
12. Balance Snapshots
13. Conversion Rates

**Earning System (10)**:
14. Tasks
15. Task Completions
16. Advertisements
17. Ad Watches
18. App Install Offers
19. App Install Completions
20. Daily Bonuses
21. Daily Check-ins
22. Streaks
23. Earning Limits

**Progression System (7)**:
24. Levels
25. Level Configuration
26. Ranks
27. Rank Configuration
28. Achievements
29. User Achievements
30. Leaderboard Snapshots

**Engagement System (5)**:
31. Missions
32. Mission Progress
33. Events
34. Event Progress
35. Referral Relationships

**Support System (4)**:
36. Support Tickets
37. Ticket Replies
38. FAQ
39. Announcements

**Admin & Security (6)**:
40. Admin Users
41. Admin Actions
42. Fraud Reports
43. Security Incidents
44. Audit Logs
45. Analytics Events

---

## ENTITY 1: USERS

### Purpose
The Users entity stores core user authentication and identification data. It is the central entity that connects all other entities.

### Ownership
- **Primary Owner**: Authentication Layer
- **Secondary Owners**: All modules (read access)

### Relationships
- **One-to-One**: User Profile, Wallet, User Settings, User Preferences
- **One-to-Many**: User Sessions, Transactions, Task Completions, Ad Watches, Notifications, Support Tickets, Admin Actions, Fraud Reports, Security Incidents, Audit Logs
- **Many-to-One**: Referral Relationships (referrer, referee)
- **Many-to-Many**: Achievements (through User Achievements)

### Lifecycle
- **Created**: When user first authenticates via Telegram OAuth
- **Updated**: When user updates profile, settings, preferences
- **Deleted**: Never deleted (GDPR anonymization instead)
- **Archived**: After 7 years of inactivity (GDPR compliance)

### Security
- **Encryption**: PII encrypted at rest (email, phone)
- **Access Control**: Users can only read their own data
- **Audit Logging**: All profile changes logged
- **Data Minimization**: Only essential data stored

### Future Scalability
- User segments (personalization)
- User behavior tracking
- User recommendations (AI-powered)
- User import/export (GDPR)
- User deletion (GDPR)

### Data Retention
- **Active users**: Indefinite
- **Inactive users**: 7 years (GDPR)
- **Deleted users**: Anonymized immediately, retained for 7 years (legal)

### Business Importance
- **Critical**: Core entity, connects all other entities
- **Revenue Impact**: Direct (user acquisition, retention)
- **Risk Impact**: High (data breaches, privacy violations)

---

## ENTITY 2: USER PROFILES

### Purpose
The User Profiles entity stores extended user information beyond authentication. It includes profile data, stats, progression, and preferences.

### Ownership
- **Primary Owner**: User Management Module
- **Secondary Owners**: All modules (read/write access to specific fields)

### Relationships
- **One-to-One**: Users (parent entity)
- **One-to-Many**: User Achievements, Mission Progress, Event Progress, Streaks
- **Many-to-One**: Levels, Ranks, Languages, Countries

### Lifecycle
- **Created**: When user first authenticates
- **Updated**: When user updates profile, earns FC, completes tasks
- **Deleted**: Never deleted (GDPR anonymization)
- **Archived**: After 7 years of inactivity

### Security
- **Encryption**: PII encrypted at rest (name, email, phone)
- **Access Control**: Users can read/update their own profile
- **Audit Logging**: All profile changes logged
- **Data Minimization**: Only essential data stored

### Future Scalability
- Profile customization (avatar, banner)
- Profile visibility (public, private)
- Profile sharing (share on Telegram)
- Profile analytics (views, engagement)

### Data Retention
- **Active users**: Indefinite
- **Inactive users**: 7 years (GDPR)
- **Deleted users**: Anonymized immediately, retained for 7 years (legal)

### Business Importance
- **Critical**: Core entity for personalization and engagement
- **Revenue Impact**: Direct (user engagement, retention)
- **Risk Impact**: High (data breaches, privacy violations)

---

## ENTITY 3: USER SETTINGS

### Purpose
The User Settings entity stores user preferences and settings. It includes notification preferences, language, currency, security, and privacy settings.

### Ownership
- **Primary Owner**: User Management Module
- **Secondary Owners**: Settings Module (read/write), Notification Center (read)

### Relationships
- **One-to-One**: Users (parent entity)
- **Many-to-One**: Languages

### Lifecycle
- **Created**: When user first authenticates
- **Updated**: When user changes settings
- **Deleted**: Never deleted (GDPR anonymization)
- **Archived**: After 7 years of inactivity

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Users can read/update their own settings
- **Audit Logging**: All setting changes logged
- **Data Minimization**: Only essential settings stored

### Future Scalability
- More settings (new features)
- Settings templates (preset configurations)
- Settings import/export (backup, restore)
- Settings sync (cross-device)

### Data Retention
- **Active users**: Indefinite
- **Inactive users**: 7 years (GDPR)
- **Deleted users**: Anonymized immediately, retained for 7 years (legal)

### Business Importance
- **High**: User experience and personalization
- **Revenue Impact**: Indirect (user satisfaction, retention)
- **Risk Impact**: Low (no sensitive data)

---

## ENTITY 4: USER PREFERENCES

### Purpose
The User Preferences entity stores user privacy preferences and opt-in/opt-out choices. It includes profile visibility, leaderboard opt-out, data export preferences, etc.

### Ownership
- **Primary Owner**: User Management Module
- **Secondary Owners**: Privacy Settings (read/write), Leaderboard (read)

### Relationships
- **One-to-One**: Users (parent entity)

### Lifecycle
- **Created**: When user first authenticates
- **Updated**: When user changes preferences
- **Deleted**: Never deleted (GDPR anonymization)
- **Archived**: After 7 years of inactivity

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Users can read/update their own preferences
- **Audit Logging**: All preference changes logged
- **Data Minimization**: Only essential preferences stored

### Future Scalability
- More preferences (new features)
- Preference templates (preset configurations)
- Preference import/export (backup, restore)
- Preference sync (cross-device)

### Data Retention
- **Active users**: Indefinite
- **Inactive users**: 7 years (GDPR)
- **Deleted users**: Anonymized immediately, retained for 7 years (legal)

### Business Importance
- **Medium**: Privacy compliance and user trust
- **Revenue Impact**: Indirect (user trust, retention)
- **Risk Impact**: Medium (GDPR compliance)

---

## ENTITY 5: USER SESSIONS

### Purpose
The User Sessions entity stores active user sessions. It tracks login time, device, IP address, and session status for security and session management.

### Ownership
- **Primary Owner**: Authentication Layer
- **Secondary Owners**: Security Module (read), User Management (read)

### Relationships
- **Many-to-One**: Users (parent entity)

### Lifecycle
- **Created**: When user logs in
- **Updated**: When user refreshes token
- **Deleted**: When user logs out or session expires
- **Archived**: After 30 days (security)

### Security
- **Encryption**: Session tokens encrypted at rest
- **Access Control**: Users can read/revoke their own sessions
- **Audit Logging**: All session events logged (login, logout, refresh)
- **Data Minimization**: Only essential session data stored

### Future Scalability
- Session management (view, revoke sessions)
- Session analytics (login patterns, devices)
- Session security (suspicious activity detection)
- Session limits (max concurrent sessions)

### Data Retention
- **Active sessions**: 30 days
- **Expired sessions**: 30 days (security)
- **Deleted sessions**: 7 days (GDPR)

### Business Importance
- **High**: Security and user trust
- **Revenue Impact**: Indirect (security, trust)
- **Risk Impact**: High (account takeover, fraud)

---

## ENTITY 6: WALLETS

### Purpose
The Wallets entity stores user wallet information. It tracks FC balance, pending earnings, withdrawable balance, and settlement info.

### Ownership
- **Primary Owner**: FC Economy Module
- **Secondary Owners**: Wallet Module (read), Settlement Module (read/write), Withdraw Module (read/write)

### Relationships
- **One-to-One**: Users (parent entity)
- **One-to-Many**: Transactions, Settlements, Withdraw Requests

### Lifecycle
- **Created**: When user first authenticates
- **Updated**: When user earns/spends FC, settlement occurs, withdrawal processed
- **Deleted**: Never deleted (GDPR anonymization)
- **Archived**: After 7 years of inactivity

### Security
- **Encryption**: Balance encrypted at rest (AES-256)
- **Access Control**: Users can read their own wallet, admins can read all
- **Audit Logging**: All balance changes logged
- **Data Minimization**: Only essential wallet data stored

### Future Scalability
- Multiple currencies (USD, EUR, etc.)
- Wallet goals (set withdrawal goals)
- Wallet predictions (estimated next settlement)
- Wallet sharing (share balance on Telegram)

### Data Retention
- **Active users**: Indefinite
- **Inactive users**: 7 years (GDPR)
- **Deleted users**: Anonymized immediately, retained for 7 years (legal)

### Business Importance
- **Critical**: Core financial entity
- **Revenue Impact**: Direct (withdrawals, settlement)
- **Risk Impact**: High (fraud, errors)

---

## ENTITY 7: TRANSACTIONS

### Purpose
The Transactions entity stores all FC transactions. It tracks FC earned, FC spent, settlements, withdrawals, and adjustments. It provides a complete audit trail of all FC movements.

### Ownership
- **Primary Owner**: FC Economy Module
- **Secondary Owners**: Wallet Module (read), Settlement Module (read), Withdraw Module (read), Analytics Module (read)

### Relationships
- **Many-to-One**: Users (parent entity), Wallets
- **Many-to-One**: Task Completions, Ad Watches, App Install Completions, Daily Bonuses, Daily Check-ins, Referral Relationships, Missions, Events, Settlements, Withdraw Requests

### Lifecycle
- **Created**: When FC is earned or spent
- **Updated**: Never updated (immutable)
- **Deleted**: Never deleted (audit trail)
- **Archived**: After 7 years (GDPR)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Users can read their own transactions, admins can read all
- **Audit Logging**: All transactions logged (immutable)
- **Data Minimization**: Only essential transaction data stored

### Future Scalability
- Transaction categories (categorize transactions)
- Transaction tags (custom tags)
- Transaction notes (user notes)
- Transaction export (CSV, PDF)
- Transaction analytics (earnings over time)

### Data Retention
- **Active users**: Indefinite
- **Inactive users**: 7 years (GDPR)
- **Deleted users**: Anonymized immediately, retained for 7 years (legal)

### Business Importance
- **Critical**: Core financial entity, audit trail
- **Revenue Impact**: Direct (revenue tracking, fraud detection)
- **Risk Impact**: High (fraud, disputes, compliance)

---

## ENTITY 8: SETTLEMENTS

### Purpose
The Settlements entity stores settlement records. It tracks FC earned in a month, FC converted to USD, conversion rate, and settlement status.

### Ownership
- **Primary Owner**: Settlement Module
- **Secondary Owners**: Wallet Module (read), Withdraw Module (read), Admin Panel (read/write)

### Relationships
- **Many-to-One**: Users (parent entity), Wallets
- **One-to-Many**: Transactions (settlement transactions)

### Lifecycle
- **Created**: On 1st of month (automatic)
- **Updated**: When settlement is approved/rejected by admin
- **Deleted**: Never deleted (audit trail)
- **Archived**: After 7 years (GDPR)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Users can read their own settlements, admins can read/write all
- **Audit Logging**: All settlement actions logged
- **Data Minimization**: Only essential settlement data stored

### Future Scalability
- Settlement reports (monthly statement)
- Settlement analytics (FC settled, USD paid out)
- Settlement notifications (email, Telegram)
- Settlement disputes (user complaints)

### Data Retention
- **Active users**: Indefinite
- **Inactive users**: 7 years (GDPR)
- **Deleted users**: Anonymized immediately, retained for 7 years (legal)

### Business Importance
- **Critical**: Core financial entity, cash flow management
- **Revenue Impact**: Direct (withdrawals, cash flow)
- **Risk Impact**: High (fraud, disputes, compliance)

---

## ENTITY 9: WITHDRAW REQUESTS

### Purpose
The Withdraw Requests entity stores withdrawal requests. It tracks withdrawal amount, Payeer account, status, processing time, and fee.

### Ownership
- **Primary Owner**: Withdraw Module
- **Secondary Owners**: Wallet Module (read), Admin Panel (read/write), Notification Center (read)

### Relationships
- **Many-to-One**: Users (parent entity), Wallets
- **One-to-Many**: Withdrawal History, Transactions

### Lifecycle
- **Created**: When user submits withdrawal request
- **Updated**: When withdrawal is approved, processed, completed, or rejected
- **Deleted**: Never deleted (audit trail)
- **Archived**: After 7 years (GDPR)

### Security
- **Encryption**: Payeer account encrypted at rest
- **Access Control**: Users can read their own withdrawals, admins can read/write all
- **Audit Logging**: All withdrawal actions logged
- **Data Minimization**: Only essential withdrawal data stored

### Future Scalability
- More withdrawal methods (Visa, Mastercard, Bank Transfer)
- Withdrawal scheduling (schedule future withdrawals)
- Withdrawal limits (daily, weekly, monthly limits)
- Withdrawal analytics (withdrawal history, trends)

### Data Retention
- **Active users**: Indefinite
- **Inactive users**: 7 years (GDPR)
- **Deleted users**: Anonymized immediately, retained for 7 years (legal)

### Business Importance
- **Critical**: Core financial entity, user trust
- **Revenue Impact**: Direct (withdrawals, fees)
- **Risk Impact**: High (fraud, disputes, compliance)

---

## ENTITY 10: WITHDRAWAL HISTORY

### Purpose
The Withdrawal History entity stores historical withdrawal data. It tracks all withdrawals (pending, completed, rejected) for audit and compliance.

### Ownership
- **Primary Owner**: Withdraw Module
- **Secondary Owners**: Wallet Module (read), Admin Panel (read), Analytics Module (read)

### Relationships
- **Many-to-One**: Users (parent entity), Withdraw Requests

### Lifecycle
- **Created**: When withdrawal is completed or rejected
- **Updated**: Never updated (immutable)
- **Deleted**: Never deleted (audit trail)
- **Archived**: After 7 years (GDPR)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Users can read their own history, admins can read all
- **Audit Logging**: All withdrawals logged (immutable)
- **Data Minimization**: Only essential withdrawal data stored

### Future Scalability
- Withdrawal analytics (withdrawal trends)
- Withdrawal reports (CSV, PDF)
- Withdrawal disputes (user complaints)
- Withdrawal refunds (refund process)

### Data Retention
- **Active users**: Indefinite
- **Inactive users**: 7 years (GDPR)
- **Deleted users**: Anonymized immediately, retained for 7 years (legal)

### Business Importance
- **High**: Audit trail, compliance
- **Revenue Impact**: Indirect (analytics, reporting)
- **Risk Impact**: Medium (compliance, disputes)

---

## ENTITY 11: FC LEDGER

### Purpose
The FC Ledger entity stores double-entry bookkeeping for FC transactions. It ensures FC balance integrity and prevents fraud.

### Ownership
- **Primary Owner**: FC Economy Module
- **Secondary Owners**: Wallet Module (read), Settlement Module (read), Withdraw Module (read), Analytics Module (read)

### Relationships
- **Many-to-One**: Users (parent entity), Wallets, Transactions

### Lifecycle
- **Created**: When FC is earned or spent
- **Updated**: Never updated (immutable)
- **Deleted**: Never deleted (audit trail)
- **Archived**: After 7 years (GDPR)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Only FC Economy Module can write, admins can read
- **Audit Logging**: All ledger entries logged (immutable)
- **Data Minimization**: Only essential ledger data stored

### Future Scalability
- Ledger analytics (FC flow analysis)
- Ledger reports (CSV, PDF)
- Ledger disputes (fraud investigation)
- Ledger reconciliation (balance verification)

### Data Retention
- **Active users**: Indefinite
- **Inactive users**: 7 years (GDPR)
- **Deleted users**: Anonymized immediately, retained for 7 years (legal)

### Business Importance
- **Critical**: Financial integrity, fraud prevention
- **Revenue Impact**: Direct (fraud prevention, balance accuracy)
- **Risk Impact**: High (fraud, errors, compliance)

---

## ENTITY 12: BALANCE SNAPSHOTS

### Purpose
The Balance Snapshots entity stores daily balance snapshots for analytics and reporting. It tracks FC balance, USD balance, and pending earnings at a specific point in time.

### Ownership
- **Primary Owner**: FC Economy Module
- **Secondary Owners**: Analytics Module (read), Wallet Module (read)

### Relationships
- **Many-to-One**: Users (parent entity), Wallets

### Lifecycle
- **Created**: Daily (cron job)
- **Updated**: Never updated (immutable)
- **Deleted**: Never deleted (analytics)
- **Archived**: After 7 years (GDPR)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Only system can write, admins can read
- **Audit Logging**: All snapshots logged (immutable)
- **Data Minimization**: Only essential snapshot data stored

### Future Scalability
- Snapshot analytics (balance trends)
- Snapshot reports (CSV, PDF)
- Snapshot predictions (estimated next settlement)
- Snapshot goals (set withdrawal goals)

### Data Retention
- **Active users**: Indefinite
- **Inactive users**: 7 years (GDPR)
- **Deleted users**: Anonymized immediately, retained for 7 years (legal)

### Business Importance
- **Medium**: Analytics and reporting
- **Revenue Impact**: Indirect (analytics, insights)
- **Risk Impact**: Low (no sensitive data)

---

## ENTITY 13: CONVERSION RATES

### Purpose
The Conversion Rates entity stores FC to USD conversion rates over time. It tracks rate changes for settlement and withdrawal calculations.

### Ownership
- **Primary Owner**: Settlement Module
- **Secondary Owners**: Wallet Module (read), Withdraw Module (read), Admin Panel (read/write)

### Relationships
- **One-to-Many**: Settlements, Withdraw Requests

### Lifecycle
- **Created**: When conversion rate changes
- **Updated**: Never updated (immutable)
- **Deleted**: Never deleted (audit trail)
- **Archived**: After 7 years (GDPR)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Only admins can write, all authenticated users can read
- **Audit Logging**: All rate changes logged
- **Data Minimization**: Only essential rate data stored

### Future Scalability
- Multiple currencies (EUR, GBP, etc.)
- Rate predictions (forecasting)
- Rate analytics (rate trends)
- Rate notifications (rate change alerts)

### Data Retention
- **Active**: Indefinite
- **Archived**: After 7 years (GDPR)

### Business Importance
- **High**: Financial calculations, transparency
- **Revenue Impact**: Direct (settlement, withdrawal)
- **Risk Impact**: Medium (disputes, compliance)

---

## ENTITY 14: TASKS

### Purpose
The Tasks entity stores available tasks for users to complete. It includes task details, rewards, requirements, and availability.

### Ownership
- **Primary Owner**: Task Management System (Admin Panel)
- **Secondary Owners**: Complete Tasks Module (read), Analytics Module (read)

### Relationships
- **One-to-Many**: Task Completions
- **Many-to-One**: Task Categories, Advertisers (future)

### Lifecycle
- **Created**: When admin creates task
- **Updated**: When admin updates task
- **Deleted**: When admin deletes task (soft delete)
- **Archived**: After 1 year (if not completed)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Admins can read/write, users can read (available tasks only)
- **Audit Logging**: All task changes logged
- **Data Minimization**: Only essential task data stored

### Future Scalability
- Task categories (surveys, offers, quizzes)
- Task recommendations (AI-powered)
- Task favorites (save favorite tasks)
- Task history (view past tasks)
- Task ratings (user feedback)

### Data Retention
- **Active tasks**: Indefinite
- **Completed tasks**: 1 year (analytics)
- **Deleted tasks**: 30 days (GDPR)

### Business Importance
- **Critical**: Core earning mechanism
- **Revenue Impact**: Direct (task completion revenue)
- **Risk Impact**: Medium (fraud, disputes)

---

## ENTITY 15: TASK COMPLETIONS

### Purpose
The Task Completions entity stores task completion records. It tracks which user completed which task, when, and the reward earned.

### Ownership
- **Primary Owner**: Complete Tasks Module
- **Secondary Owners**: FC Economy Module (read), Mission Service (read), Analytics Module (read)

### Relationships
- **Many-to-One**: Users, Tasks, Wallets
- **One-to-Many**: Transactions

### Lifecycle
- **Created**: When user completes task
- **Updated**: Never updated (immutable)
- **Deleted**: Never deleted (audit trail)
- **Archived**: After 7 years (GDPR)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Users can read their own completions, admins can read all
- **Audit Logging**: All completions logged (immutable)
- **Data Minimization**: Only essential completion data stored

### Future Scalability
- Completion analytics (completion rates)
- Completion history (view past completions)
- Completion rewards (FC bonus, badge)
- Completion sharing (share on Telegram)

### Data Retention
- **Active users**: Indefinite
- **Inactive users**: 7 years (GDPR)
- **Deleted users**: Anonymized immediately, retained for 7 years (legal)

### Business Importance
- **Critical**: Core earning mechanism, audit trail
- **Revenue Impact**: Direct (task completion revenue)
- **Risk Impact**: High (fraud, disputes)

---

## ENTITY 16: ADVERTISEMENTS

### Purpose
The Advertisements entity stores available ads for users to watch. It includes ad details, rewards, duration, and availability.

### Ownership
- **Primary Owner**: Ad Network Integration
- **Secondary Owners**: Watch Ads Module (read), Analytics Module (read)

### Relationships
- **One-to-Many**: Ad Watches

### Lifecycle
- **Created**: When ad is added to queue
- **Updated**: When ad is updated (reward, duration)
- **Deleted**: When ad expires or is removed
- **Archived**: After 1 year (analytics)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Admins can read/write, users can read (available ads only)
- **Audit Logging**: All ad changes logged
- **Data Minimization**: Only essential ad data stored

### Future Scalability
- Ad categories (video, survey, banner)
- Ad targeting (user profile, behavior)
- Ad preferences (user can select categories)
- Ad analytics (completion rate, revenue)

### Data Retention
- **Active ads**: Indefinite
- **Expired ads**: 1 year (analytics)
- **Deleted ads**: 30 days (GDPR)

### Business Importance
- **High**: Revenue generation
- **Revenue Impact**: Direct (ad revenue)
- **Risk Impact**: Medium (inappropriate content, fraud)

---

## ENTITY 17: AD WATCHES

### Purpose
The Ad Watches entity stores ad watch records. It tracks which user watched which ad, when, and the reward earned.

### Ownership
- **Primary Owner**: Watch Ads Module
- **Secondary Owners**: FC Economy Module (read), Analytics Module (read)

### Relationships
- **Many-to-One**: Users, Advertisements, Wallets
- **One-to-Many**: Transactions

### Lifecycle
- **Created**: When user watches ad
- **Updated**: Never updated (immutable)
- **Deleted**: Never deleted (audit trail)
- **Archived**: After 7 years (GDPR)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Users can read their own ad watches, admins can read all
- **Audit Logging**: All ad watches logged (immutable)
- **Data Minimization**: Only essential ad watch data stored

### Future Scalability
- Ad watch analytics (completion rate, revenue)
- Ad watch history (view past ad watches)
- Ad watch rewards (FC bonus, badge)
- Ad watch sharing (share on Telegram)

### Data Retention
- **Active users**: Indefinite
- **Inactive users**: 7 years (GDPR)
- **Deleted users**: Anonymized immediately, retained for 7 years (legal)

### Business Importance
- **High**: Revenue generation, audit trail
- **Revenue Impact**: Direct (ad revenue)
- **Risk Impact**: High (fraud, disputes)

---

## ENTITY 18: APP INSTALL OFFERS

### Purpose
The App Install Offers entity stores available app install offers. It includes app details, rewards, requirements, and availability.

### Ownership
- **Primary Owner**: Ad Network Integration
- **Secondary Owners**: Install Apps Module (read), Analytics Module (read)

### Relationships
- **One-to-Many**: App Install Completions

### Lifecycle
- **Created**: When app offer is added
- **Updated**: When app offer is updated (reward, requirements)
- **Deleted**: When app offer expires or is removed
- **Archived**: After 1 year (analytics)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Admins can read/write, users can read (available offers only)
- **Audit Logging**: All offer changes logged
- **Data Minimization**: Only essential offer data stored

### Future Scalability
- App categories (games, productivity, social)
- App recommendations (AI-powered)
- App favorites (save favorite apps)
- App history (view past installs)
- App ratings (user feedback)

### Data Retention
- **Active offers**: Indefinite
- **Expired offers**: 1 year (analytics)
- **Deleted offers**: 30 days (GDPR)

### Business Importance
- **High**: Revenue generation
- **Revenue Impact**: Direct (app install revenue)
- **Risk Impact**: Medium (fraud, disputes)

---

## ENTITY 19: APP INSTALL COMPLETIONS

### Purpose
The App Install Completions entity stores app install completion records. It tracks which user installed which app, when, and the reward earned.

### Ownership
- **Primary Owner**: Install Apps Module
- **Secondary Owners**: FC Economy Module (read), Analytics Module (read)

### Relationships
- **Many-to-One**: Users, App Install Offers, Wallets
- **One-to-Many**: Transactions

### Lifecycle
- **Created**: When user completes app install
- **Updated**: Never updated (immutable)
- **Deleted**: Never deleted (audit trail)
- **Archived**: After 7 years (GDPR)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Users can read their own completions, admins can read all
- **Audit Logging**: All completions logged (immutable)
- **Data Minimization**: Only essential completion data stored

### Future Scalability
- Completion analytics (completion rates)
- Completion history (view past completions)
- Completion rewards (FC bonus, badge)
- Completion sharing (share on Telegram)

### Data Retention
- **Active users**: Indefinite
- **Inactive users**: 7 years (GDPR)
- **Deleted users**: Anonymized immediately, retained for 7 years (legal)

### Business Importance
- **High**: Revenue generation, audit trail
- **Revenue Impact**: Direct (app install revenue)
- **Risk Impact**: High (fraud, disputes)

---

## ENTITY 20: DAILY BONUSES

### Purpose
The Daily Bonuses entity stores daily bonus records. It tracks which user claimed which day's bonus, when, and the reward earned.

### Ownership
- **Primary Owner**: Daily Bonus Module
- **Secondary Owners**: FC Economy Module (read), Analytics Module (read)

### Relationships
- **Many-to-One**: Users, Wallets
- **One-to-Many**: Transactions

### Lifecycle
- **Created**: When user claims daily bonus
- **Updated**: Never updated (immutable)
- **Deleted**: Never deleted (audit trail)
- **Archived**: After 7 years (GDPR)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Users can read their own bonuses, admins can read all
- **Audit Logging**: All bonuses logged (immutable)
- **Data Minimization**: Only essential bonus data stored

### Future Scalability
- Bonus analytics (claim rates, streaks)
- Bonus history (view past bonuses)
- Bonus rewards (FC bonus, badge)
- Bonus sharing (share on Telegram)

### Data Retention
- **Active users**: Indefinite
- **Inactive users**: 7 years (GDPR)
- **Deleted users**: Anonymized immediately, retained for 7 years (legal)

### Business Importance
- **High**: User engagement, retention
- **Revenue Impact**: Indirect (engagement, retention)
- **Risk Impact**: Low (no fraud risk)

---

## ENTITY 21: DAILY CHECK-INS

### Purpose
The Daily Check-ins entity stores daily check-in records. It tracks which user checked in on which day, when, and the reward earned.

### Ownership
- **Primary Owner**: Daily Check-in Module
- **Secondary Owners**: FC Economy Module (read), Analytics Module (read)

### Relationships
- **Many-to-One**: Users, Wallets
- **One-to-Many**: Transactions

### Lifecycle
- **Created**: When user checks in
- **Updated**: Never updated (immutable)
- **Deleted**: Never deleted (audit trail)
- **Archived**: After 7 years (GDPR)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Users can read their own check-ins, admins can read all
- **Audit Logging**: All check-ins logged (immutable)
- **Data Minimization**: Only essential check-in data stored

### Future Scalability
- Check-in analytics (check-in rates, streaks)
- Check-in history (view past check-ins)
- Check-in rewards (FC bonus, badge)
- Check-in sharing (share on Telegram)

### Data Retention
- **Active users**: Indefinite
- **Inactive users**: 7 years (GDPR)
- **Deleted users**: Anonymized immediately, retained for 7 years (legal)

### Business Importance
- **High**: User engagement, retention
- **Revenue Impact**: Indirect (engagement, retention)
- **Risk Impact**: Low (no fraud risk)

---

## ENTITY 22: STREAKS

### Purpose
The Streaks entity stores user streak data. It tracks consecutive days of activity (daily bonus, daily check-in, or any activity).

### Ownership
- **Primary Owner**: Daily Bonus Module, Daily Check-in Module
- **Secondary Owners**: User Management (read), Analytics Module (read)

### Relationships
- **One-to-One**: Users (parent entity)
- **One-to-Many**: Daily Bonuses, Daily Check-ins

### Lifecycle
- **Created**: When user starts streak
- **Updated**: When user maintains or breaks streak
- **Deleted**: Never deleted (GDPR anonymization)
- **Archived**: After 7 years of inactivity

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Users can read their own streak, admins can read all
- **Audit Logging**: All streak changes logged
- **Data Minimization**: Only essential streak data stored

### Future Scalability
- Streak freeze (protect streak for 1 day)
- Streak multiplier (higher levels get higher multipliers)
- Streak recovery (pay FC to restore streak)
- Streak analytics (streak rates, retention)

### Data Retention
- **Active users**: Indefinite
- **Inactive users**: 7 years (GDPR)
- **Deleted users**: Anonymized immediately, retained for 7 years (legal)

### Business Importance
- **High**: User engagement, retention
- **Revenue Impact**: Indirect (engagement, retention)
- **Risk Impact**: Low (no fraud risk)

---

## ENTITY 23: EARNING LIMITS

### Purpose
The Earning Limits entity stores user earning limits. It tracks daily, weekly, monthly limits for ads, tasks, app installs, etc.

### Ownership
- **Primary Owner**: FC Economy Module
- **Secondary Owners**: Watch Ads Module (read), Complete Tasks Module (read), Install Apps Module (read)

### Relationships
- **Many-to-One**: Users

### Lifecycle
- **Created**: When user first authenticates
- **Updated**: When user earns FC (limits decremented)
- **Deleted**: Never deleted (GDPR anonymization)
- **Archived**: After 7 years of inactivity

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Users can read their own limits, admins can read/write all
- **Audit Logging**: All limit changes logged
- **Data Minimization**: Only essential limit data stored

### Future Scalability
- More limits (new earning methods)
- Limit resets (daily, weekly, monthly)
- Limit bonuses (premium users get higher limits)
- Limit analytics (limit usage, engagement)

### Data Retention
- **Active users**: Indefinite
- **Inactive users**: 7 years (GDPR)
- **Deleted users**: Anonymized immediately, retained for 7 years (legal)

### Business Importance
- **High**: Fraud prevention, revenue protection
- **Revenue Impact**: Direct (prevent abuse, protect revenue)
- **Risk Impact**: High (fraud, abuse)

---

## ENTITY 24: LEVELS

### Purpose
The Levels entity stores level configuration. It defines level thresholds, benefits, and rewards for each level (1-100).

### Ownership
- **Primary Owner**: Admin Panel
- **Secondary Owners**: Level System Module (read), User Management (read)

### Relationships
- **One-to-Many**: User Profiles (users at this level)

### Lifecycle
- **Created**: When admin configures levels
- **Updated**: When admin updates level configuration
- **Deleted**: Never deleted (historical data)
- **Archived**: Never archived

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Only admins can read/write
- **Audit Logging**: All level changes logged
- **Data Minimization**: Only essential level data stored

### Future Scalability
- More levels (100-200)
- Level benefits (exclusive tasks, premium ads)
- Level rewards (FC bonus, badge, title)
- Level missions (exclusive tasks)

### Data Retention
- **Active**: Indefinite
- **Archived**: Never

### Business Importance
- **High**: User engagement, progression
- **Revenue Impact**: Indirect (engagement, retention)
- **Risk Impact**: Low (no sensitive data)

---

## ENTITY 25: LEVEL CONFIGURATION

### Purpose
The Level Configuration entity stores level-specific configuration. It includes FC thresholds, benefits, multipliers, and rewards for each level.

### Ownership
- **Primary Owner**: Admin Panel
- **Secondary Owners**: Level System Module (read)

### Relationships
- **Many-to-One**: Levels

### Lifecycle
- **Created**: When admin configures levels
- **Updated**: When admin updates level configuration
- **Deleted**: Never deleted (historical data)
- **Archived**: Never archived

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Only admins can read/write
- **Audit Logging**: All configuration changes logged
- **Data Minimization**: Only essential configuration data stored

### Future Scalability
- More configuration options (new benefits)
- Configuration templates (preset configurations)
- Configuration import/export (backup, restore)
- Configuration versioning (track changes)

### Data Retention
- **Active**: Indefinite
- **Archived**: Never

### Business Importance
- **High**: User engagement, progression
- **Revenue Impact**: Indirect (engagement, retention)
- **Risk Impact**: Low (no sensitive data)

---

## ENTITY 26: RANKS

### Purpose
The Ranks entity stores rank configuration. It defines rank thresholds, benefits, and rewards for each rank (Bronze, Silver, Gold, Platinum, Diamond, Legend).

### Ownership
- **Primary Owner**: Admin Panel
- **Secondary Owners**: Rank System Module (read), User Management (read)

### Relationships
- **One-to-Many**: User Profiles (users at this rank)

### Lifecycle
- **Created**: When admin configures ranks
- **Updated**: When admin updates rank configuration
- **Deleted**: Never deleted (historical data)
- **Archived**: Never archived

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Only admins can read/write
- **Audit Logging**: All rank changes logged
- **Data Minimization**: Only essential rank data stored

### Future Scalability
- More ranks (Legend+, Elite, Master)
- Rank benefits (priority support, faster settlement)
- Rank rewards (FC bonus, badge, title)
- Rank missions (exclusive tasks)

### Data Retention
- **Active**: Indefinite
- **Archived**: Never

### Business Importance
- **High**: User engagement, status
- **Revenue Impact**: Indirect (engagement, retention)
- **Risk Impact**: Low (no sensitive data)

---

## ENTITY 27: RANK CONFIGURATION

### Purpose
The Rank Configuration entity stores rank-specific configuration. It includes FC thresholds, benefits, multipliers, and rewards for each rank.

### Ownership
- **Primary Owner**: Admin Panel
- **Secondary Owners**: Rank System Module (read)

### Relationships
- **Many-to-One**: Ranks

### Lifecycle
- **Created**: When admin configures ranks
- **Updated**: When admin updates rank configuration
- **Deleted**: Never deleted (historical data)
- **Archived**: Never archived

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Only admins can read/write
- **Audit Logging**: All configuration changes logged
- **Data Minimization**: Only essential configuration data stored

### Future Scalability
- More configuration options (new benefits)
- Configuration templates (preset configurations)
- Configuration import/export (backup, restore)
- Configuration versioning (track changes)

### Data Retention
- **Active**: Indefinite
- **Archived**: Never

### Business Importance
- **High**: User engagement, status
- **Revenue Impact**: Indirect (engagement, retention)
- **Risk Impact**: Low (no sensitive data)

---

## ENTITY 28: ACHIEVEMENTS

### Purpose
The Achievements entity stores achievement definitions. It includes achievement criteria, rewards, categories, and availability.

### Ownership
- **Primary Owner**: Admin Panel
- **Secondary Owners**: Achievement System Module (read), User Management (read)

### Relationships
- **One-to-Many**: User Achievements

### Lifecycle
- **Created**: When admin creates achievement
- **Updated**: When admin updates achievement
- **Deleted**: When admin deletes achievement (soft delete)
- **Archived**: After 1 year (if not earned)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Admins can read/write, users can read (available achievements)
- **Audit Logging**: All achievement changes logged
- **Data Minimization**: Only essential achievement data stored

### Future Scalability
- More achievements (new milestones)
- Achievement categories (Earning, Streak, Referral, Level, Special)
- Achievement rewards (FC bonus, badge, title)
- Achievement leaderboard (top achievements)

### Data Retention
- **Active achievements**: Indefinite
- **Deleted achievements**: 30 days (GDPR)

### Business Importance
- **Medium**: User engagement, gamification
- **Revenue Impact**: Indirect (engagement, retention)
- **Risk Impact**: Low (no sensitive data)

---

## ENTITY 29: USER ACHIEVEMENTS

### Purpose
The User Achievements entity stores user achievement records. It tracks which user earned which achievement, when, and the reward received.

### Ownership
- **Primary Owner**: Achievement System Module
- **Secondary Owners**: User Management (read), Analytics Module (read)

### Relationships
- **Many-to-One**: Users, Achievements
- **One-to-Many**: Transactions (achievement rewards)

### Lifecycle
- **Created**: When user earns achievement
- **Updated**: Never updated (immutable)
- **Deleted**: Never deleted (audit trail)
- **Archived**: After 7 years (GDPR)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Users can read their own achievements, admins can read all
- **Audit Logging**: All achievements logged (immutable)
- **Data Minimization**: Only essential achievement data stored

### Future Scalability
- Achievement analytics (completion rates)
- Achievement history (view past achievements)
- Achievement sharing (share on Telegram)
- Achievement leaderboard (top achievements)

### Data Retention
- **Active users**: Indefinite
- **Inactive users**: 7 years (GDPR)
- **Deleted users**: Anonymized immediately, retained for 7 years (legal)

### Business Importance
- **Medium**: User engagement, gamification
- **Revenue Impact**: Indirect (engagement, retention)
- **Risk Impact**: Low (no sensitive data)

---

## ENTITY 30: LEADERBOARD SNAPSHOTS

### Purpose
The Leaderboard Snapshots entity stores leaderboard snapshots. It tracks top users by FC, level, referrals, streak at a specific point in time.

### Ownership
- **Primary Owner**: Leaderboard Module
- **Secondary Owners**: Analytics Module (read), User Management (read)

### Relationships
- **Many-to-One**: Users

### Lifecycle
- **Created**: Daily (cron job) or real-time (WebSocket)
- **Updated**: Never updated (immutable)
- **Deleted**: Never deleted (analytics)
- **Archived**: After 7 years (GDPR)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: All authenticated users can read
- **Audit Logging**: All snapshots logged (immutable)
- **Data Minimization**: Only essential leaderboard data stored

### Future Scalability
- More leaderboard categories (tasks completed, achievements)
- Leaderboard filters (by country, by level)
- Leaderboard history (past leaderboards)
- Leaderboard rewards (exclusive badges for top 10)

### Data Retention
- **Active**: Indefinite
- **Archived**: After 7 years (GDPR)

### Business Importance
- **Medium**: User engagement, competition
- **Revenue Impact**: Indirect (engagement, retention)
- **Risk Impact**: Low (no sensitive data)

---

## ENTITY 31: MISSIONS

### Purpose
The Missions entity stores mission definitions. It includes mission details, requirements, rewards, and availability for weekly and monthly missions.

### Ownership
- **Primary Owner**: Admin Panel
- **Secondary Owners**: Missions Module (read), Analytics Module (read)

### Relationships
- **One-to-Many**: Mission Progress

### Lifecycle
- **Created**: When admin creates mission
- **Updated**: When admin updates mission
- **Deleted**: When admin deletes mission (soft delete)
- **Archived**: After 1 year (if not completed)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Admins can read/write, users can read (available missions)
- **Audit Logging**: All mission changes logged
- **Data Minimization**: Only essential mission data stored

### Future Scalability
- More mission types (referrals, app installs, events)
- Mission recommendations (AI-powered)
- Mission favorites (save favorite missions)
- Mission history (view past missions)

### Data Retention
- **Active missions**: Indefinite
- **Completed missions**: 1 year (analytics)
- **Deleted missions**: 30 days (GDPR)

### Business Importance
- **High**: User engagement, long-term goals
- **Revenue Impact**: Indirect (engagement, retention)
- **Risk Impact**: Low (no sensitive data)

---

## ENTITY 32: MISSION PROGRESS

### Purpose
The Mission Progress entity stores user mission progress. It tracks which user is on which mission, progress, and completion status.

### Ownership
- **Primary Owner**: Missions Module
- **Secondary Owners**: User Management (read), Analytics Module (read)

### Relationships
- **Many-to-One**: Users, Missions
- **One-to-Many**: Transactions (mission rewards)

### Lifecycle
- **Created**: When user starts mission
- **Updated**: When user makes progress or completes mission
- **Deleted**: Never deleted (GDPR anonymization)
- **Archived**: After 7 years (GDPR)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Users can read their own progress, admins can read all
- **Audit Logging**: All progress changes logged
- **Data Minimization**: Only essential progress data stored

### Future Scalability
- Progress analytics (completion rates)
- Progress history (view past progress)
- Progress rewards (FC bonus, badge)
- Progress sharing (share on Telegram)

### Data Retention
- **Active users**: Indefinite
- **Inactive users**: 7 years (GDPR)
- **Deleted users**: Anonymized immediately, retained for 7 years (legal)

### Business Importance
- **High**: User engagement, long-term goals
- **Revenue Impact**: Indirect (engagement, retention)
- **Risk Impact**: Low (no sensitive data)

---

## ENTITY 33: EVENTS

### Purpose
The Events entity stores event definitions. It includes event details, requirements, rewards, duration, and availability for seasonal and temporary events.

### Ownership
- **Primary Owner**: Admin Panel
- **Secondary Owners**: Events Module (read), Analytics Module (read)

### Relationships
- **One-to-Many**: Event Progress

### Lifecycle
- **Created**: When admin creates event
- **Updated**: When admin updates event
- **Deleted**: When admin deletes event (soft delete)
- **Archived**: After 1 year (if not completed)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Admins can read/write, users can read (active events)
- **Audit Logging**: All event changes logged
- **Data Minimization**: Only essential event data stored

### Future Scalability
- More event types (weekend boost, holiday event, summer campaign)
- Event recommendations (AI-powered)
- Event history (view past events)
- Event leaderboard (top event completions)

### Data Retention
- **Active events**: Indefinite
- **Completed events**: 1 year (analytics)
- **Deleted events**: 30 days (GDPR)

### Business Importance
- **Medium**: User engagement, seasonal campaigns
- **Revenue Impact**: Indirect (engagement, retention)
- **Risk Impact**: Low (no sensitive data)

---

## ENTITY 34: EVENT PROGRESS

### Purpose
The Event Progress entity stores user event progress. It tracks which user is on which event, progress, and completion status.

### Ownership
- **Primary Owner**: Events Module
- **Secondary Owners**: User Management (read), Analytics Module (read)

### Relationships
- **Many-to-One**: Users, Events
- **One-to-Many**: Transactions (event rewards)

### Lifecycle
- **Created**: When user starts event
- **Updated**: When user makes progress or completes event
- **Deleted**: Never deleted (GDPR anonymization)
- **Archived**: After 7 years (GDPR)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Users can read their own progress, admins can read all
- **Audit Logging**: All progress changes logged
- **Data Minimization**: Only essential progress data stored

### Future Scalability
- Progress analytics (completion rates)
- Progress history (view past progress)
- Progress rewards (FC bonus, badge)
- Progress sharing (share on Telegram)

### Data Retention
- **Active users**: Indefinite
- **Inactive users**: 7 years (GDPR)
- **Deleted users**: Anonymized immediately, retained for 7 years (legal)

### Business Importance
- **Medium**: User engagement, seasonal campaigns
- **Revenue Impact**: Indirect (engagement, retention)
- **Risk Impact**: Low (no sensitive data)

---

## ENTITY 35: REFERRAL RELATIONSHIPS

### Purpose
The Referral Relationships entity stores referral data. It tracks who referred whom, referral status, and rewards.

### Ownership
- **Primary Owner**: Referral Module
- **Secondary Owners**: User Management (read), FC Economy Module (read), Analytics Module (read)

### Relationships
- **Many-to-One**: Users (referrer), Users (referee)

### Lifecycle
- **Created**: When user shares referral link and friend joins
- **Updated**: When friend completes first task (status changes to "completed")
- **Deleted**: Never deleted (GDPR anonymization)
- **Archived**: After 7 years (GDPR)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Users can read their own referrals, admins can read all
- **Audit Logging**: All referral events logged
- **Data Minimization**: Only essential referral data stored

### Future Scalability
- Multi-level referrals (2nd level, 3rd level)
- Referral bonuses (special rewards for top referrers)
- Referral leaderboard (top referrers)
- Referral analytics (conversion rate, ROI)

### Data Retention
- **Active users**: Indefinite
- **Inactive users**: 7 years (GDPR)
- **Deleted users**: Anonymized immediately, retained for 7 years (legal)

### Business Importance
- **High**: Viral growth, user acquisition
- **Revenue Impact**: Direct (user acquisition, CAC)
- **Risk Impact**: Medium (fraud, spam)

---

## ENTITY 36: SUPPORT TICKETS

### Purpose
The Support Tickets entity stores user support tickets. It tracks ticket details, status, and conversation history.

### Ownership
- **Primary Owner**: Ticket Support Module
- **Secondary Owners**: User Management (read), Admin Panel (read/write), Notification Center (read)

### Relationships
- **Many-to-One**: Users
- **One-to-Many**: Ticket Replies

### Lifecycle
- **Created**: When user creates ticket
- **Updated**: When ticket status changes or new reply is added
- **Deleted**: Never deleted (GDPR anonymization)
- **Archived**: After 7 years (GDPR)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Users can read/write their own tickets, admins can read/write all
- **Audit Logging**: All ticket events logged
- **Data Minimization**: Only essential ticket data stored

### Future Scalability
- Ticket priority (urgent, high, normal, low)
- Ticket assignment (assign to support agent)
- Ticket analytics (response time, resolution rate)
- Ticket satisfaction (rate support)

### Data Retention
- **Active tickets**: Indefinite
- **Closed tickets**: 7 years (GDPR)
- **Deleted tickets**: Anonymized immediately, retained for 7 years (legal)

### Business Importance
- **Medium**: User support, satisfaction
- **Revenue Impact**: Indirect (user satisfaction, retention)
- **Risk Impact**: Low (no sensitive data)

---

## ENTITY 37: TICKET REPLIES

### Purpose
The Ticket Replies entity stores ticket reply records. It tracks replies from users and support agents.

### Ownership
- **Primary Owner**: Ticket Support Module
- **Secondary Owners**: User Management (read), Admin Panel (read/write), Notification Center (read)

### Relationships
- **Many-to-One**: Support Tickets, Users (sender)

### Lifecycle
- **Created**: When user or support agent replies
- **Updated**: Never updated (immutable)
- **Deleted**: Never deleted (GDPR anonymization)
- **Archived**: After 7 years (GDPR)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Users can read their own ticket replies, admins can read all
- **Audit Logging**: All replies logged (immutable)
- **Data Minimization**: Only essential reply data stored

### Future Scalability
- Reply attachments (upload images, files)
- Reply templates (canned responses)
- Reply analytics (response time, resolution rate)
- Reply satisfaction (rate support)

### Data Retention
- **Active tickets**: Indefinite
- **Closed tickets**: 7 years (GDPR)
- **Deleted tickets**: Anonymized immediately, retained for 7 years (legal)

### Business Importance
- **Medium**: User support, satisfaction
- **Revenue Impact**: Indirect (user satisfaction, retention)
- **Risk Impact**: Low (no sensitive data)

---

## ENTITY 38: FAQ

### Purpose
The FAQ entity stores frequently asked questions and answers. It provides self-service support for users.

### Ownership
- **Primary Owner**: Admin Panel
- **Secondary Owners**: Support Module (read), Analytics Module (read)

### Relationships
- **One-to-Many**: FAQ Categories

### Lifecycle
- **Created**: When admin creates FAQ
- **Updated**: When admin updates FAQ
- **Deleted**: When admin deletes FAQ (soft delete)
- **Archived**: Never archived

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Admins can read/write, all users can read
- **Audit Logging**: All FAQ changes logged
- **Data Minimization**: Only essential FAQ data stored

### Future Scalability
- FAQ categories (more categories)
- FAQ search (search by keyword)
- FAQ ratings (user feedback)
- FAQ suggestions (suggest FAQ based on user behavior)

### Data Retention
- **Active FAQ**: Indefinite
- **Deleted FAQ**: 30 days (GDPR)

### Business Importance
- **Medium**: User support, self-service
- **Revenue Impact**: Indirect (support cost reduction)
- **Risk Impact**: Low (no sensitive data)

---

## ENTITY 39: ANNOUNCEMENTS

### Purpose
The Announcements entity stores platform announcements. It includes announcement details, date, and read status.

### Ownership
- **Primary Owner**: Admin Panel
- **Secondary Owners**: Support Module (read), Notification Center (read), Analytics Module (read)

### Relationships
- **Many-to-One**: Users (read status)

### Lifecycle
- **Created**: When admin creates announcement
- **Updated**: When admin updates announcement
- **Deleted**: When admin deletes announcement (soft delete)
- **Archived**: After 1 year

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Admins can read/write, all users can read
- **Audit Logging**: All announcement changes logged
- **Data Minimization**: Only essential announcement data stored

### Future Scalability
- Announcement categories (updates, events, news)
- Announcement search (search by keyword)
- Announcement filters (by date, category)
- Announcement sharing (share on Telegram)

### Data Retention
- **Active announcements**: Indefinite
- **Read announcements**: 1 year (analytics)
- **Deleted announcements**: 30 days (GDPR)

### Business Importance
- **Medium**: User communication, engagement
- **Revenue Impact**: Indirect (engagement, retention)
- **Risk Impact**: Low (no sensitive data)

---

## ENTITY 40: ADMIN USERS

### Purpose
The Admin Users entity stores admin user data. It includes admin credentials, roles, permissions, and access control.

### Ownership
- **Primary Owner**: Authentication Layer
- **Secondary Owners**: Admin Panel (read), Security Module (read)

### Relationships
- **One-to-Many**: Admin Actions, Fraud Reports, Security Incidents

### Lifecycle
- **Created**: When admin is created
- **Updated**: When admin updates profile, roles, permissions
- **Deleted**: Never deleted (GDPR anonymization)
- **Archived**: After 7 years of inactivity

### Security
- **Encryption**: Password encrypted (bcrypt), PII encrypted at rest
- **Access Control**: Role-based access control (RBAC)
- **Audit Logging**: All admin actions logged
- **Data Minimization**: Only essential admin data stored

### Future Scalability
- More roles (admin, moderator, support, analyst)
- More permissions (granular permissions)
- Admin collaboration (multiple admins, comments)
- Admin API (programmatic access)

### Data Retention
- **Active admins**: Indefinite
- **Inactive admins**: 7 years (GDPR)
- **Deleted admins**: Anonymized immediately, retained for 7 years (legal)

### Business Importance
- **Critical**: Platform security, operations
- **Revenue Impact**: Indirect (operations, security)
- **Risk Impact**: High (admin abuse, security breaches)

---

## ENTITY 41: ADMIN ACTIONS

### Purpose
The Admin Actions entity stores admin action records. It tracks all actions performed by admins (bans, approvals, deletions, etc.).

### Ownership
- **Primary Owner**: Admin Panel
- **Secondary Owners**: Security Module (read), Analytics Module (read), Logging Module (read)

### Relationships
- **Many-to-One**: Admin Users, Users (target)

### Lifecycle
- **Created**: When admin performs action
- **Updated**: Never updated (immutable)
- **Deleted**: Never deleted (audit trail)
- **Archived**: After 7 years (GDPR)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Only admins can read
- **Audit Logging**: All admin actions logged (immutable)
- **Data Minimization**: Only essential action data stored

### Future Scalability
- Action analytics (admin activity)
- Action reports (CSV, PDF)
- Action alerts (unusual actions)
- Action automation (auto-actions)

### Data Retention
- **Active**: Indefinite
- **Archived**: After 7 years (GDPR)

### Business Importance
- **Critical**: Audit trail, compliance, security
- **Revenue Impact**: Indirect (operations, security)
- **Risk Impact**: High (admin abuse, compliance)

---

## ENTITY 42: FRAUD REPORTS

### Purpose
The Fraud Reports entity stores fraud detection records. It tracks suspected fraud, investigation results, and actions taken.

### Ownership
- **Primary Owner**: Fraud Detection Module
- **Secondary Owners**: Admin Panel (read/write), Security Module (read), Analytics Module (read)

### Relationships
- **Many-to-One**: Users (suspected), Admin Users (investigator)

### Lifecycle
- **Created**: When fraud is detected
- **Updated**: When fraud is investigated and actioned
- **Deleted**: Never deleted (audit trail)
- **Archived**: After 7 years (GDPR)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Only admins can read/write
- **Audit Logging**: All fraud reports logged (immutable)
- **Data Minimization**: Only essential fraud data stored

### Future Scalability
- Fraud analytics (fraud trends, patterns)
- Fraud reports (CSV, PDF)
- Fraud prevention (automatic bans)
- Fraud appeals (user appeals)

### Data Retention
- **Active**: Indefinite
- **Archived**: After 7 years (GDPR)

### Business Importance
- **Critical**: Fraud prevention, platform integrity
- **Revenue Impact**: Direct (fraud prevention)
- **Risk Impact**: High (fraud, compliance)

---

## ENTITY 43: SECURITY INCIDENTS

### Purpose
The Security Incidents entity stores security incident records. It tracks security breaches, attacks, vulnerabilities, and responses.

### Ownership
- **Primary Owner**: Security Module
- **Secondary Owners**: Admin Panel (read/write), Logging Module (read), Analytics Module (read)

### Relationships
- **Many-to-One**: Admin Users (responder)

### Lifecycle
- **Created**: When security incident is detected
- **Updated**: When incident is investigated and resolved
- **Deleted**: Never deleted (audit trail)
- **Archived**: After 7 years (GDPR)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Only admins can read/write
- **Audit Logging**: All security incidents logged (immutable)
- **Data Minimization**: Only essential incident data stored

### Future Scalability
- Incident analytics (incident trends, patterns)
- Incident reports (CSV, PDF)
- Incident automation (auto-response)
- Incident training (admin training)

### Data Retention
- **Active**: Indefinite
- **Archived**: After 7 years (GDPR)

### Business Importance
- **Critical**: Platform security, user trust
- **Revenue Impact**: Indirect (security, trust)
- **Risk Impact**: High (security breaches, compliance)

---

## ENTITY 44: AUDIT LOGS

### Purpose
The Audit Logs entity stores audit trail for all system events. It tracks user actions, admin actions, system events, and security events.

### Ownership
- **Primary Owner**: Logging Module
- **Secondary Owners**: All modules (write), Admin Panel (read), Security Module (read), Analytics Module (read)

### Relationships
- **Many-to-One**: Users, Admin Users

### Lifecycle
- **Created**: When event occurs
- **Updated**: Never updated (immutable)
- **Deleted**: Never deleted (compliance)
- **Archived**: After 7 years (GDPR)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Only admins can read
- **Audit Logging**: All events logged (immutable)
- **Data Minimization**: Only essential event data stored

### Future Scalability
- Log analytics (event trends, patterns)
- Log reports (CSV, PDF)
- Log alerts (real-time alerts)
- Log automation (auto-response)

### Data Retention
- **Hot**: 30 days
- **Warm**: 1 year
- **Cold**: 7 years (GDPR)

### Business Importance
- **Critical**: Compliance, security, debugging
- **Revenue Impact**: Indirect (compliance, security)
- **Risk Impact**: High (compliance, security)

---

## ENTITY 45: ANALYTICS EVENTS

### Purpose
The Analytics Events entity stores analytics events. It tracks user actions, system events, and business metrics for analytics and reporting.

### Ownership
- **Primary Owner**: Analytics Module
- **Secondary Owners**: All modules (write), Admin Panel (read)

### Relationships
- **Many-to-One**: Users

### Lifecycle
- **Created**: When event occurs
- **Updated**: Never updated (immutable)
- **Deleted**: Never deleted (analytics)
- **Archived**: After 7 years (GDPR)

### Security
- **Encryption**: No encryption needed (no sensitive data)
- **Access Control**: Only admins can read
- **Audit Logging**: All events logged (immutable)
- **Data Minimization**: Only essential event data stored

### Future Scalability
- More events (new features)
- Event analytics (user behavior, trends)
- Event reports (CSV, PDF)
- Event predictions (AI-powered insights)

### Data Retention
- **Hot**: 30 days
- **Warm**: 1 year
- **Cold**: 7 years (GDPR)

### Business Importance
- **High**: Business intelligence, decision making
- **Revenue Impact**: Indirect (insights, optimization)
- **Risk Impact**: Low (no sensitive data)

---

## ENTITY RELATIONSHIPS SUMMARY

### Core Relationships
- **Users** → **User Profiles** (1:1)
- **Users** → **Wallets** (1:1)
- **Users** → **User Settings** (1:1)
- **Users** → **User Preferences** (1:1)
- **Users** → **User Sessions** (1:Many)
- **Users** → **Transactions** (1:Many)
- **Users** → **Task Completions** (1:Many)
- **Users** → **Ad Watches** (1:Many)
- **Users** → **App Install Completions** (1:Many)
- **Users** → **Daily Bonuses** (1:Many)
- **Users** → **Daily Check-ins** (1:Many)
- **Users** → **Streaks** (1:1)
- **Users** → **Mission Progress** (1:Many)
- **Users** → **Event Progress** (1:Many)
- **Users** → **Referral Relationships** (1:Many, as referrer)
- **Users** → **Referral Relationships** (1:Many, as referee)
- **Users** → **Support Tickets** (1:Many)
- **Users** → **User Achievements** (1:Many)
- **Users** → **Fraud Reports** (1:Many, as suspected)
- **Users** → **Security Incidents** (1:Many)
- **Users** → **Audit Logs** (1:Many)
- **Users** → **Analytics Events** (1:Many)

### Financial Relationships
- **Wallets** → **Transactions** (1:Many)
- **Wallets** → **Settlements** (1:Many)
- **Wallets** → **Withdraw Requests** (1:Many)
- **Settlements** → **Transactions** (1:Many)
- **Withdraw Requests** → **Withdrawal History** (1:Many)
- **Withdraw Requests** → **Transactions** (1:Many)

### Earning Relationships
- **Tasks** → **Task Completions** (1:Many)
- **Task Completions** → **Transactions** (1:Many)
- **Advertisements** → **Ad Watches** (1:Many)
- **Ad Watches** → **Transactions** (1:Many)
- **App Install Offers** → **App Install Completions** (1:Many)
- **App Install Completions** → **Transactions** (1:Many)
- **Daily Bonuses** → **Transactions** (1:Many)
- **Daily Check-ins** → **Transactions** (1:Many)

### Progression Relationships
- **Levels** → **User Profiles** (1:Many)
- **Ranks** → **User Profiles** (1:Many)
- **Achievements** → **User Achievements** (1:Many)
- **User Achievements** → **Transactions** (1:Many, for rewards)
- **Missions** → **Mission Progress** (1:Many)
- **Mission Progress** → **Transactions** (1:Many, for rewards)
- **Events** → **Event Progress** (1:Many)
- **Event Progress** → **Transactions** (1:Many, for rewards)

### Support Relationships
- **Support Tickets** → **Ticket Replies** (1:Many)
- **Users** → **Support Tickets** (1:Many)

### Admin Relationships
- **Admin Users** → **Admin Actions** (1:Many)
- **Admin Users** → **Fraud Reports** (1:Many, as investigator)
- **Admin Users** → **Security Incidents** (1:Many, as responder)

---

## DATA GOVERNANCE

### Data Ownership
- **User Data**: Owned by users (GDPR)
- **Financial Data**: Owned by Fee (audit trail)
- **Analytics Data**: Owned by Fee (business intelligence)
- **Admin Data**: Owned by Fee (operations)

### Data Privacy
- **PII Encryption**: All PII encrypted at rest
- **Data Minimization**: Only essential data stored
- **User Consent**: Explicit consent for data collection
- **Right to Deletion**: Users can request deletion (GDPR)
- **Right to Export**: Users can export data (GDPR)

### Data Security
- **Encryption at Rest**: AES-256
- **Encryption in Transit**: TLS 1.3
- **Access Control**: Role-based access control (RBAC)
- **Audit Logging**: All actions logged
- **Regular Audits**: Quarterly security audits

### Data Retention
- **Active Users**: Indefinite
- **Inactive Users**: 7 years (GDPR)
- **Deleted Users**: Anonymized immediately, retained for 7 years (legal)
- **Audit Logs**: 7 years (compliance)
- **Analytics Data**: 7 years (GDPR)

### Data Backup
- **Frequency**: Daily backups
- **Retention**: 30 days
- **Verification**: Weekly backup verification
- **Recovery**: Monthly recovery testing

---

## CONCLUSION

This Database Blueprint defines the **complete data architecture** for Fee. It identifies 45 entities, their relationships, lifecycles, and data management strategies.

**Key Principles Applied**:
- **Scalability**: Designed for 10M+ users
- **Security**: Encryption, access control, audit logging
- **Privacy**: GDPR compliance, data minimization
- **Integrity**: Immutable audit trail, double-entry bookkeeping
- **Performance**: Optimized for read/write patterns

**Next Steps**:
1. Review with database architect
2. Create detailed schema design
3. Define indexes and constraints
4. Design data migration strategy
5. Implement database layer
6. Test with real data
7. Monitor and optimize

**This blueprint is the foundation for all data work. Every entity, every relationship, every data flow must align with this architecture.**

---

*Database Blueprint V1*
*Created: 2026-07-18*
*Status: COMPLETE*
*Next Phase: Technical Design*