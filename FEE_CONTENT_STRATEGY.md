# FEE - Content Strategy
## Complete Copy Framework & Messaging System

---

## CONTENT PHILOSOPHY

**Inspired by**: Stripe's clarity + Apple's simplicity + Telegram's directness
**Principle**: Every word serves a purpose. No fluff. No manipulation.
**Tone**: Professional, clear, respectful, premium

---

## BRAND VOICE

### Core Characteristics
- **Professional**: We're a platform, not a friend
- **Clear**: Simple words, no jargon
- **Respectful**: We assume user intelligence
- **Premium**: We don't use cheap tricks
- **Transparent**: We explain everything

### What We Sound Like
✅ "Your balance: 12,450 FC"
✅ "Withdrawals open on January 1st"
✅ "Complete tasks to earn FC"
✅ "Funds arrive in 1-3 business days"

### What We Don't Sound Like
❌ "Earn FREE money NOW!!!" (gaming tone)
❌ "Limited time!!!" (dark pattern)
❌ "You're almost there!" (manipulative)
❌ "Click here to cash out!!!" (spammy)

---

## COPY FRAMEWORK

### Word Choice Guidelines
**Use**:
- "Earn" (not "win" or "get")
- "Collect" (not "grab")
- "Withdraw" (not "cash out")
- "Settlement" (not "payday")
- "Balance" (not "wallet" or " stash")
- "Tasks" (not "offers" or "deals")
- "FC" (not "coins" or "points")

**Avoid**:
- Exclamation marks (use periods)
- ALL CAPS (except for FC)
- Emojis in serious contexts
- Urgency language ("now", "hurry", "limited")
- Gamification language ("level up", "streak", "bonus")

---

## COMPLETE COPY INVENTORY

### Authentication & Entry

#### Splash Screen
**Header**: None
**Body**: "Fee" (app name only)
**Subtitle**: None
**Loading**: None (just spinner)

**Why**: Minimal brand presence. No promises, no explanations. Just the name.

---

#### Language Selection
**Header**: "Select Language"
**Body**: List of languages
**Button**: "Continue"

**Why**: Clear, direct. No "Choose your preferred language" - just "Select Language."

---

#### Welcome / Onboarding

**Screen 1: "Earn FC"**
- Headline: "Earn FC for completing tasks"
- Body: "Watch ads, complete surveys, install apps, and refer friends to collect FC."
- Indicator: "1 of 3"

**Screen 2: "Collect & Wait"**
- Headline: "Your balance grows in real-time"
- Body: "FC is credited instantly. Withdrawals open during scheduled settlement periods."
- Indicator: "2 of 3"

**Screen 3: "Withdraw"**
- Headline: "Withdraw during settlement"
- Body: "When the next settlement opens, withdraw your FC via Payeer."
- Button: "Get Started"

**Why**: Educational, not promotional. Sets expectations without hype.

---

### Home Screen

#### Balance Card
**Label**: "Your Balance"
**Primary**: "[X,XXX] FC"
**Secondary**: "≈ $[X.XX] USD"
**Timestamp**: "Updated [X] min ago"

**Why**: Clear, factual. No "You have earned!" - just the number.

---

#### Primary Actions Grid

**Button 1: Watch Ads**
- Label: "Watch Ads"
- Subtitle: "Earn 10-50 FC per ad"

**Button 2: Complete Tasks**
- Label: "Complete Tasks"
- Subtitle: "Surveys, offers, and more"

**Button 3: Install Apps**
- Label: "Install Apps"
- Subtitle: "Try new apps, earn FC"

**Button 4: Refer Friends**
- Label: "Refer Friends"
- Subtitle: "Earn 500 FC per referral"

**Why**: Action-oriented. Clear reward expectations. No hype.

---

#### Available Now Section

**Header**: "Available Now"

**Task Card Examples**:
```
▸ Watch Video Ad
  Earn 50 FC · 30 seconds

▸ Complete Survey
  Earn 100 FC · 2 minutes

▸ Install App: GameX
  Earn 200 FC · Reach level 3

▸ Daily Bonus
  Earn 25 FC · Available now
```

**Why**: "Available Now" creates gentle urgency without "LIMITED TIME!!!" 

---

#### Recent Activity Section

**Header**: "Recent Activity"

**Activity Item Examples**:
```
✓ Watched Ad           +50 FC
  2 minutes ago

✓ Completed Survey     +100 FC
  1 hour ago

✓ Referral Bonus       +500 FC
  3 hours ago

✓ Daily Bonus          +25 FC
  1 day ago
```

**Why**: Simple, factual. Just the facts. No "Great job!" or "Keep it up!"

---

### Stats Screen

#### Header
**Title**: "Your Stats"

#### Earnings Overview
**Chart Title**: "Earnings (Last 30 Days)"
**Y-axis**: "FC"
**X-axis**: "Days"

#### Earnings by Category
**Chart Title**: "Earnings by Category"
**Legend**: "Ads | Tasks | Apps | Referrals"

#### Key Metrics
- "Total Earned: 12,450 FC (≈ $124.50 USD)"
- "Average per Day: 415 FC (≈ $4.15 USD)"
- "Task Completion Rate: 87%"
- "Projected at Next Settlement: 15,000 FC (≈ $150 USD)"

#### Time Period Selector
**Tabs**: "7D | 30D | 90D | All Time"

**Empty State**:
```
Your Stats

Complete tasks to see your earnings data.
Stats appear after your first task completion.
```

**Why**: Data-driven, professional. Like Revolut or a bank app.

---

### Profile Screen

#### User Info
- "Member since: January 2025"
- "Tasks completed: 47"

#### Withdrawal History
**Header**: "Withdrawal History"

**Item Example**:
```
December 1, 2024
10,000 FC · ≈ $100 USD
Status: Completed
Arrived: December 3, 2024
```

**Empty State**:
```
No withdrawals yet

Complete tasks to reach the 5,000 FC minimum.
Next settlement: January 1, 2025
```

#### Settings
- "Notifications"
  - Subtitle: "Receive notifications about settlements and new tasks"
- "Currency Display"
  - Subtitle: "How balances are displayed"
- "Language"
  - Subtitle: "English"

#### Support
- "FAQ"
- "Contact Support"
- "Terms of Service"
- "Privacy Policy"

#### Logout
**Button**: "Logout" (red text, no background)

**Why**: Clean, organized. Standard mobile app pattern.

---

### Task Flows

#### Watch Ads - Ad Player

**Ad Queue Screen**:
```
Available Ads

▸ Video Ad 1
  Earn 50 FC · 30 seconds

▸ Video Ad 2
  Earn 50 FC · 30 seconds
```

**Ad Player Screen**:
- Countdown: "15 seconds remaining"
- Progress bar: [████████░░] 80%

**Completion Screen**:
- "Ad Completed"
- "+50 FC"
- Button: "Claim"

**Error State**:
```
Ad Unavailable

This ad could not be loaded.
Try another task or check back later.
```

**Why**: Minimal, focused. No "Watch this amazing video!" - just the facts.

---

#### Complete Tasks - Task List

**Header**: "Complete Tasks"

**Filter Tabs**: "All | Surveys | Offers | Daily"

**Task Card Examples**:
```
▸ Shopping Habits Survey
  Earn 100 FC · 2 minutes

▸ Sign Up for ServiceX
  Earn 150 FC · 5 minutes

▸ Daily Check-in
  Earn 25 FC · Available now
```

**Task Detail Screen**:
- "Task Details"
- "Watch this 30-second video ad to earn FC."
- "Earn: 50 FC (≈ $0.50 USD)"
- "Requirements: Must watch entire video"
- "Takes about 30 seconds"
- Button: "Start"

**Why**: Clear expectations. No "Amazing opportunity!" - just what it is.

---

#### Install Apps - App Offers

**Header**: "Install Apps"

**App Card Example**:
```
┌─────────────────────────────┐
│ [Icon] GameX                 │
│       by GameStudio          │
│                              │
│ Earn 200 FC · Reach level 3  │
│ Progress: 0/3                │
└─────────────────────────────┘
```

**Why**: Professional app store aesthetic. No "Try this AWESOME app!!!"

---

#### Refer Friends - Referral Dashboard

**Header**: "Refer Friends"

**Referral Code**:
- "Your Referral Code"
- "FEE-JOHN-2024"
- Button: "Copy"

**Referral Link**:
- "Your Referral Link"
- "https://t.me/FeeBot?start=FEE-JOHN-2024"
- Buttons: "Copy" | "Share"

**Your Referrals**:
- "Total Referrals: 3"
- "Total Earned: 1,500 FC"

**Rewards**:
- "Earn 500 FC for each friend who completes their first task"
- "Your friend also earns 500 FC"

**Why**: Clear, simple. No "Get RICH by referring!!!"

---

### Detail Screens

#### Balance Detail

**Header**: "Your Balance"

**Current Balance**:
- "12,450 FC"
- "≈ $124.50 USD"

**Pending Earnings**:
- "Tasks completed but not yet credited: +250 FC"
- "Will be credited within 24 hours"

**Next Settlement**:
- "Next settlement: January 1, 2025"
- "Withdrawal opens in 15 days"

**Withdrawal Threshold**:
- "Minimum withdrawal: 5,000 FC"
- "You can withdraw: Yes" or "You need 3,550 FC more"

**Transaction History**:
```
December 28, 2024
Watched Ad · +50 FC
Balance: 12,450 FC

December 27, 2024
Completed Survey · +100 FC
Balance: 12,400 FC

December 26, 2024
Referral Bonus · +500 FC
Balance: 12,300 FC
```

**Why**: Complete transparency. Every transaction visible. No hidden fees.

---

#### Withdrawal Flow

**Screen 1: Withdrawal Amount**
- Header: "Withdraw FC"
- "Available: 12,450 FC"
- "Minimum: 5,000 FC"
- Input: "10,000 FC" (pre-filled)
- "≈ $100.00 USD"
- "Withdrawal fee: 2% (200 FC)"
- "You will receive: 9,800 FC (≈ $98.00 USD)"
- Button: "Next"

**Screen 2: Payeer Account**
- Header: "Select Payeer Account"
- "Saved Accounts"
- Radio: "P1000000000 (ending in 0000)"
- "Add New Account"
- Input: "Payeer ID"
- Checkbox: "Save this account"
- Button: "Next"

**Screen 3: Confirmation**
- Header: "Confirm Withdrawal"
- "Amount: 10,000 FC"
- "Fee: 200 FC"
- "You receive: 9,800 FC (≈ $98.00 USD)"
- "To: P1000000000"
- "Withdrawals are processed within 1-3 business days."
- "This action cannot be undone."
- Button: "Confirm Withdrawal"

**Success Screen**:
- "Withdrawal Initiated"
- "You will receive $98.00 USD within 1-3 business days."
- "Next settlement: January 1, 2025"
- Button: "Done"

**Error States**:
- "You need 3,550 FC more to withdraw"
- "Please enter a valid Payeer ID"
- "Withdrawals open on January 1, 2025"

**Why**: Professional, like a bank. Clear fees, clear timeline, no surprises.

---

#### Settlement Info

**Header**: "How Settlement Works"

**Section 1: What is Settlement?**
- "Settlement is when we process withdrawals for all users."
- "It happens on the 1st of each month."

**Section 2: When is Next Settlement?**
- "Next settlement: January 1, 2025"
- "Withdrawal window: 48 hours (Jan 1-2)"

**Section 3: How Do I Withdraw?**
- "During the settlement window, open Fee and tap 'Withdraw'."
- "Select your Payeer account and confirm."

**Section 4: When Do I Receive Funds?**
- "Funds are sent within 1-3 business days after settlement closes."

**Section 5: Minimum Withdrawal**
- "Minimum withdrawal: 5,000 FC (≈ $50 USD)"
- "No maximum withdrawal limit"

**Why**: Educational, transparent. Reduces support tickets.

---

### Settings & Support

#### Settings

**Header**: "Settings"

**Items**:
1. "Notifications"
   - Subtitle: "Receive notifications about settlements and new tasks"
   - Toggle: On/Off

2. "Currency Display"
   - Subtitle: "How balances are displayed"
   - Options: "FC Only | USD Only | FC + USD"

3. "Language"
   - Subtitle: "English"
   - Tap → Language Selection

4. "Account"
   - "Connected Telegram: @username"
   - Button: "Logout" (red)

**Why**: Standard, clean. No "Account Settings" - just "Settings."

---

#### FAQ

**Header**: "Frequently Asked Questions"

**Accordion Items**:
1. "What is FC?"
   - Answer: "FC (Fee Credits) is the internal currency of Fee. You earn FC by completing tasks like watching ads, completing surveys, installing apps, and referring friends."

2. "How do I earn FC?"
   - Answer: "You can earn FC by watching ads, completing tasks, installing apps, and referring friends. Each task shows how much FC you'll earn before you start."

3. "When can I withdraw?"
   - Answer: "Withdrawals open during settlement periods, which occur on the 1st of each month. The withdrawal window is 48 hours."

4. "What is the minimum withdrawal?"
   - Answer: "The minimum withdrawal is 5,000 FC (approximately $50 USD). There is no maximum withdrawal limit."

5. "How long does withdrawal take?"
   - Answer: "Withdrawals are processed within 1-3 business days after the settlement window closes. Funds are sent to your Payeer account."

6. "Is Fee legitimate?"
   - Answer: "Yes. Fee is a legitimate platform that has been operating since 2024. We process withdrawals on time and have a transparent settlement model."

7. "How do you make money?"
   - Answer: "We earn revenue from advertising. When you watch an ad or complete a survey, the advertiser pays us. We share a portion of that revenue with you as FC."

8. "Can I have multiple accounts?"
   - Answer: "No. Each Telegram account can only have one Fee account. Multiple accounts violate our Terms of Service and will result in account termination."

9. "What if I find a bug?"
   - Answer: "Please contact our support team at support@fee.app or via Telegram at @FeeSupport. We appreciate your help in making Fee better."

10. "How do I contact support?"
    - Answer: "You can contact support via the 'Contact Support' page in the app, or email us at support@fee.app, or message us on Telegram at @FeeSupport."

**Why**: Transparent, honest. Answers sensitive questions directly.

---

#### Terms of Service

**Header**: "Terms of Service"

**Sections**:
1. "Acceptance of Terms"
2. "FC System"
3. "Settlement and Withdrawal"
4. "Prohibited Activities"
5. "Account Termination"
6. "Limitation of Liability"
7. "Dispute Resolution"

**Last Updated**: "Last updated: January 1, 2025"

**Button**: "Accept" (if first time)

**Why**: Legal requirement. Clear, simple language.

---

#### Privacy Policy

**Header**: "Privacy Policy"

**Sections**:
1. "Data We Collect"
2. "How We Use Data"
3. "Data Sharing"
4. "Data Security"
5. "User Rights"
6. "Cookie Policy"

**Last Updated**: "Last updated: January 1, 2025"

**Why**: Legal requirement (GDPR). Builds trust.

---

#### Contact Support

**Header**: "Contact Support"

**Options**:
1. "FAQ"
   - Subtitle: "Check FAQ first"
   - Link → FAQ

2. "Send Message"
   - Textarea: "Describe your issue..."
   - Button: "Send"

3. "Email"
   - "support@fee.app"
   - Link → mailto:

4. "Telegram"
   - "@FeeSupport"
   - Link → Telegram chat

**Success State**:
```
Message Sent

We'll respond within 24 hours.
Thank you for contacting support.
```

**Why**: Multiple support channels. Clear expectations (24-hour response).

---

### System Screens

#### Loading States

**Short Load (< 1 second)**:
- Spinner only
- No text

**Long Load (> 1 second)**:
- Spinner
- "Loading..."

**Context-Specific**:
- "Updating balance..."
- "Loading tasks..."
- "Processing..."

**Why**: Minimal, non-intrusive.

---

#### Error States

**Network Error**:
```
Connection Lost

Check your internet connection and try again.
```

**Task Failed**:
```
Task Unavailable

This task could not be completed.
Try another task or check back later.
```

**Server Error**:
```
Something Went Wrong

We're working on it. Please try again later.
```

**Buttons**: "Retry" | "Go Home"

**Why**: Clear, actionable. No technical jargon.

---

#### Empty States

**No Tasks**:
```
No Tasks Available

Check back soon for new opportunities.
```

**No Activity**:
```
No Activity Yet

Complete your first task to see your earnings history.
```

**No Referrals**:
```
No Referrals Yet

Share your code with friends to earn 500 FC each.
```

**No Withdrawals**:
```
No Withdrawals Yet

Complete tasks to reach the 5,000 FC minimum.
Next settlement: January 1, 2025
```

**Why**: Educational, guiding. Not just "empty" - tells users what to do.

---

#### Success Confirmations

**Task Completed**:
```
Task Completed

You earned 50 FC.
```

**Referral Shared**:
```
Referral Code Copied

Share it with friends to earn 500 FC each.
```

**Settings Saved**:
```
Settings Updated

Your preferences have been saved.
```

**Withdrawal Initiated**:
```
Withdrawal Initiated

You will receive $98.00 USD within 1-3 business days.
```

**Why**: Clear confirmation. No "Awesome!" or "Great job!"

---

## NOTIFICATION COPY

### Push Notifications (Telegram)

**Settlement Announcement** (7 days before):
```
Settlement Opens Soon

The next settlement window opens in 7 days (January 1-2).
You can withdraw your FC via Payeer during this period.
```

**Settlement Opening** (day of):
```
Settlement Open

The settlement window is now open.
You can withdraw your FC until January 2, 2025.
```

**Settlement Closing** (24 hours before):
```
Settlement Closing Soon

The withdrawal window closes in 24 hours.
Withdraw now if you haven't already.
```

**New Tasks Available**:
```
New Tasks Available

Check the "Available Now" section for new earning opportunities.
```

**Referral Completed**:
```
Referral Reward

Your friend @username completed their first task.
You earned 500 FC.
```

**Withdrawal Processed**:
```
Withdrawal Processed

Your withdrawal of $98.00 USD has been sent to your Payeer account.
Funds will arrive within 1-3 business days.
```

**Why**: Informative, not spammy. Respects user attention.

---

## ERROR MESSAGES

### Validation Errors

**Invalid Payeer ID**:
```
Invalid Payeer ID

Please enter a valid Payeer ID (e.g., P1000000000).
```

**Insufficient Balance**:
```
Insufficient Balance

You need 3,550 FC more to withdraw.
Minimum withdrawal: 5,000 FC.
```

**Task Already Completed**:
```
Already Completed

You've already completed this task.
Check "Available Now" for more opportunities.
```

**Network Error**:
```
Connection Lost

Check your internet connection and try again.
```

**Why**: Clear, actionable. Tells users what went wrong and how to fix it.

---

## MICROCOPY

### Buttons
- "Continue" (not "Next" or "Proceed")
- "Get Started" (not "Let's Go!" or "Start Now!")
- "Claim" (not "Claim Now!" or "Get Your Reward!")
- "Confirm" (not "Yes, Please!" or "Do It!")
- "Done" (not "OK" or "Got It!")
- "Back" (not "←" alone)
- "Retry" (not "Try Again!")
- "Go Home" (not "Exit" or "Leave")

### Labels
- "Your Balance" (not "My Balance" or "Balance")
- "Available Now" (not "Tasks" or "Offers")
- "Recent Activity" (not "History" or "Past Earnings")
- "Withdrawal History" (not "Past Withdrawals")
- "Next Settlement" (not "Next Payday")

### Placeholders
- "Describe your issue..." (not "Type here...")
- "Search tasks..." (not "Find something...")

### Time References
- "2 minutes ago" (not "2m ago" or "Just now")
- "1 hour ago" (not "1h ago")
- "1 day ago" (not "1d ago")
- "January 1, 2025" (not "01/01/25" or "Next month")

---

## CONTENT HIERARCHY

### H1 (Page Titles)
- "Your Balance"
- "Complete Tasks"
- "Refer Friends"
- "Your Stats"
- "Contact Support"

### H2 (Section Headers)
- "Available Now"
- "Recent Activity"
- "Withdrawal History"
- "Transaction History"

### H3 (Subsection Headers)
- "Current Balance"
- "Pending Earnings"
- "Next Settlement"
- "Saved Accounts"

### Body Text
- Task descriptions
- Explanations
- Error messages
- Empty state copy

### Captions
- Timestamps ("2 minutes ago")
- Subtitles ("Earn 10-50 FC per ad")
- Labels ("Your Balance")

---

## ACCESSIBILITY COPY

### ARIA Labels
- "Home tab" (not just "Home")
- "Stats tab" (not just "Stats")
- "Profile tab" (not just "Profile")
- "Back button" (not just "←")
- "Close button" (not just "X")

### Screen Reader Text
- Balance updates: "Your balance is now 12,450 FC"
- New tasks: "3 new tasks available"
- Success: "Task completed. You earned 50 FC"

---

## LOCALIZATION NOTES

### Languages (Priority Order)
1. English (primary)
2. Spanish
3. Portuguese
4. Arabic
5. Russian
6. Hindi
7. Chinese (Simplified)
8. Indonesian
9. Turkish
10. French

### Translation Guidelines
- Maintain professional tone in all languages
- Avoid idioms and cultural references
- Use simple, direct language
- Test with native speakers
- Keep FC as "FC" (don't translate)

---

## CONTENT GOVERNANCE

### Who Writes What
- **Product Team**: Feature copy, error messages, empty states
- **Legal Team**: Terms of Service, Privacy Policy
- **Support Team**: FAQ answers, support responses
- **Marketing Team**: Notification copy, onboarding (reviewed by Product)

### Review Process
1. Product writes copy
2. Legal reviews (if applicable)
3. UX reviews for clarity
4. Native speaker reviews (for localization)
5. Final approval by CPO

### Update Frequency
- **Real-time**: Error messages, success confirmations
- **Weekly**: FAQ answers, support responses
- **Monthly**: Notification templates
- **Quarterly**: Terms of Service, Privacy Policy
- **Annually**: Full content audit

---

## COPY TESTING

### A/B Tests (Future)
- Headline variations: "Earn FC" vs "Collect FC"
- CTA variations: "Get Started" vs "Start Earning"
- Empty state variations: Different guidance text

### Metrics
- Task completion rate (affected by copy clarity)
- Support ticket volume (affected by FAQ copy)
- User retention (affected by onboarding copy)
- Withdrawal rate (affected by settlement copy)

---

## CONTENT ANTI-PATTERNS

### ❌ Avoid
- Exclamation marks (except in success states, sparingly)
- ALL CAPS (except FC)
- Emojis in serious contexts
- Urgency language ("now", "hurry", "limited")
- Gamification language ("level up", "streak", "bonus")
- Manipulative language ("you're almost there", "don't miss out")
- Technical jargon (CPM, CPA, CPI - never shown to users)
- Fine print (all terms in plain language)

### ✅ Embrace
- Periods (not exclamation marks)
- Simple words (not complex vocabulary)
- Clear numbers (not "a few" or "several")
- Direct statements (not questions)
- Transparency (explain everything)
- Respect (assume intelligence)

---

## EXAMPLE SCREENS WITH COPY

### Home Screen (Complete)
```
┌─────────────────────────────────────┐
│ ≡ Fee                      ⚙️      │
├─────────────────────────────────────┤
│ ┌─────────────────────────────┐    │
│ │ Your Balance                │    │
│ │ 12,450 FC                   │    │
│ │ ≈ $124.50 USD               │    │
│ │ Updated 2 min ago           │    │
│ └─────────────────────────────┘    │
│                                     │
│ Earn FC                             │
│ ┌──────────┐ ┌──────────┐         │
│ │ Watch Ads│ │ Complete │         │
│ │10-50 FC  │ │ Tasks    │         │
│ ├──────────┤ ├──────────┤         │
│ │ Install  │ │ Refer    │         │
│ │ Apps     │ │ Friends  │         │
│ └──────────┘ └──────────┘         │
│                                     │
│ Available Now                       │
│ ▸ Watch Video Ad                    │
│   Earn 50 FC · 30 seconds          │
│ ▸ Complete Survey                   │
│   Earn 100 FC · 2 minutes          │
│ ▸ Install App: GameX                │
│   Earn 200 FC · Reach level 3      │
│                                     │
│ Recent Activity                     │
│ ✓ Watched Ad               +50 FC  │
│   2 minutes ago                     │
│ ✓ Completed Survey         +100 FC │
│   1 hour ago                        │
│ ✓ Referral Bonus           +500 FC │
│   3 hours ago                       │
├─────────────────────────────────────┤
│ 🏠 Home    📊 Stats    👤 Profile  │
└─────────────────────────────────────┘
```

### Withdrawal Flow (Complete)
```
Screen 1:
┌─────────────────────────────────────┐
│ ← Withdraw FC                       │
├─────────────────────────────────────┤
│ Available: 12,450 FC                │
│ Minimum: 5,000 FC                   │
│                                     │
│ Amount                              │
│ [10,000 FC              ]           │
│ ≈ $100.00 USD                       │
│                                     │
│ Withdrawal fee: 2% (200 FC)         │
│ You will receive: 9,800 FC          │
│ (≈ $98.00 USD)                      │
│                                     │
│ [Next]                              │
└─────────────────────────────────────┘

Screen 2:
┌─────────────────────────────────────┐
│ ← Select Payeer Account             │
├─────────────────────────────────────┤
│ Saved Accounts                      │
│ ○ P1000000000 (ending in 0000)      │
│                                     │
│ Add New Account                     │
│ [P1000000000               ]        │
│ ☑ Save this account                 │
│                                     │
│ [Next]                              │
└─────────────────────────────────────┘

Screen 3:
┌─────────────────────────────────────┐
│ ← Confirm Withdrawal                │
├─────────────────────────────────────┤
│ Amount: 10,000 FC                   │
│ Fee: 200 FC                         │
│ You receive: 9,800 FC               │
│ (≈ $98.00 USD)                      │
│                                     │
│ To: P1000000000                     │
│                                     │
│ Withdrawals are processed within    │
│ 1-3 business days.                  │
│ This action cannot be undone.       │
│                                     │
│ [Confirm Withdrawal]                │
└─────────────────────────────────────┘

Success:
┌─────────────────────────────────────┐
│ ✓ Withdrawal Initiated              │
├─────────────────────────────────────┤
│ You will receive $98.00 USD         │
│ within 1-3 business days.           │
│                                     │
│ Next settlement: January 1, 2025    │
│                                     │
│ [Done]                              │
└─────────────────────────────────────┘
```

---

## CONCLUSION

Fee's content strategy is built on transparency, clarity, and respect. Every word serves a purpose. No hype, no manipulation, no fine print. Users understand exactly what they're earning, when they can withdraw, and how the platform works.

**Our content promise**:
- Clear: No jargon, no confusion
- Honest: No hidden terms, no surprises
- Respectful: We assume user intelligence
- Professional: We're a platform, not a friend

---

*Content Strategy Version 1.0*
*Created: 2026-07-18*
*Status: Ready for Visual Design*
*Next Step: Design System*