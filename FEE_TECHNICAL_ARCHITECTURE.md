# FEE - Technical Architecture
## Complete System Design & Technical Specifications

---

## ARCHITECTURE PHILOSOPHY

**Inspired by**: Telegram's scalability + Stripe's reliability + Notion's simplicity
**Principle**: Build for scale from day one, but keep it simple
**Pattern**: Microservices-ready monolith (start simple, scale when needed)

---

## SYSTEM OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                         USERS                               │
│                    (Telegram Mini App)                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                    CDN (Cloudflare)                         │
│              - Static assets                                 │
│              - API caching                                   │
│              - DDoS protection                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│              LOAD BALANCER (Railway/Render)                 │
│              - SSL termination                               │
│              - Rate limiting                                 │
│              - Request routing                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ↓               ↓               ↓
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Frontend   │ │    API       │ │   WebSocket  │
│  (Vercel)    │ │  (Railway)   │ │   Server     │
│              │ │              │ │  (Railway)   │
│ - React      │ │ - Node.js    │ │              │
│ - Tailwind   │ │ - Express    │ │ - Socket.io  │
│ - Vite       │ │ - REST/Graph │ │ - Real-time  │
└──────────────┘ └──────┬───────┘ └──────┬───────┘
                        │                │
                        └────────┬───────┘
                                 │
                                 ↓
                    ┌────────────────────┐
                    │   PostgreSQL       │
                    │   (Supabase)       │
                    │                    │
                    │ - Users            │
                    │ - Transactions     │
                    │ - Tasks            │
                    │ - Withdrawals      │
                    └────────────────────┘
                                 │
                                 ↓
                    ┌────────────────────┐
                    │      Redis         │
                    │   (Supabase)       │
                    │                    │
                    │ - Sessions         │
                    │ - Cache            │
                    │ - Rate limits      │
                    └────────────────────┘
                                 │
                                 ↓
                    ┌────────────────────┐
                    │   Integrations     │
                    │                    │
                    │ - Telegram Bot API │
                    │ - Ad Networks      │
                    │ - Payeer API       │
                    │ - AWS S3/R2        │
                    └────────────────────┘
```

---

## FRONTEND ARCHITECTURE

### Technology Stack
**Framework**: React 18+ with TypeScript
**Build Tool**: Vite
**Styling**: Tailwind CSS
**State Management**: Zustand (lightweight, simple)
**Routing**: React Router v6
**Animations**: Framer Motion
**HTTP Client**: Axios
**Real-time**: Socket.io Client
**Forms**: React Hook Form + Zod validation
**Testing**: Vitest + React Testing Library

### Project Structure
```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   ├── layout/                # Layout components
│   │   ├── Header.tsx
│   │   ├── BottomNav.tsx
│   │   └── Container.tsx
│   ├── screens/               # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── StatsScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── ...
│   └── features/              # Feature-specific components
│       ├── balance/
│       ├── tasks/
│       ├── referrals/
│       └── withdrawals/
├── hooks/                     # Custom React hooks
│   ├── useAuth.ts
│   ├── useBalance.ts
│   ├── useTasks.ts
│   └── ...
├── stores/                    # Zustand stores
│   ├── authStore.ts
│   ├── balanceStore.ts
│   ├── taskStore.ts
│   └── ...
├── services/                  # API services
│   ├── api.ts
│   ├── auth.ts
│   ├── tasks.ts
│   └── ...
├── utils/                     # Utility functions
│   ├── formatters.ts
│   ├── validators.ts
│   └── ...
├── types/                     # TypeScript types
│   ├── user.ts
│   ├── task.ts
│   ├── transaction.ts
│   └── ...
├── assets/                    # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
├── App.tsx
├── main.tsx
└── index.css
```

### Key Frontend Patterns

#### Component Architecture
- **Atomic Design**: Atoms → Molecules → Organisms → Screens
- **Compound Components**: Complex UI built from simple components
- **Render Props**: For flexible, reusable logic
- **Custom Hooks**: Extract business logic from components

#### State Management
- **Zustand Stores**: Global state (auth, balance, tasks)
- **Local State**: Component-specific state (useState)
- **Server State**: React Query (caching, refetching, optimistic updates)
- **URL State**: React Router (search params, navigation)

#### Performance Optimization
- **Code Splitting**: Lazy load screens and heavy components
- **Memoization**: React.memo, useMemo, useCallback
- **Virtual Lists**: For long task lists and activity feeds
- **Image Optimization**: WebP, lazy loading, responsive images
- **Bundle Size**: Target < 200KB initial load

---

## BACKEND ARCHITECTURE

### Technology Stack
**Runtime**: Node.js 20+
**Framework**: Express.js
**Language**: TypeScript
**API**: REST + GraphQL (for complex queries)
**Real-time**: Socket.io
**Authentication**: Telegram OAuth 2.0
**Validation**: Zod
**Testing**: Jest + Supertest

### Project Structure
```
backend/
├── src/
│   ├── modules/               # Feature modules
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.repository.ts
│   │   │   ├── auth.types.ts
│   │   │   └── auth.middleware.ts
│   │   ├── users/
│   │   ├── tasks/
│   │   ├── transactions/
│   │   ├── withdrawals/
│   │   └── referrals/
│   ├── common/                # Shared code
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── types/
│   │   └── constants/
│   ├── integrations/          # Third-party integrations
│   │   ├── telegram/
│   │   ├── ad-networks/
│   │   ├── payeer/
│   │   └── s3/
│   ├── jobs/                  # Background jobs
│   │   ├── settlement.processor.ts
│   │   ├── withdrawal.processor.ts
│   │   └── task.verification.ts
│   ├── queues/                # Job queues
│   │   ├── bullmq.config.ts
│   │   └── queues.ts
│   ├── app.ts                 # Express app
│   └── server.ts              # Server entry point
├── tests/                     # Test files
├── migrations/                # Database migrations
├── seeds/                     # Seed data
├── package.json
└── tsconfig.json
```

### Key Backend Patterns

#### Layered Architecture
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic
- **Repositories**: Data access
- **Middleware**: Cross-cutting concerns (auth, logging, validation)

#### API Design
- **REST**: Standard CRUD operations
- **GraphQL**: Complex queries (user dashboard, stats)
- **Versioning**: URL-based (/api/v1/, /api/v2/)
- **Documentation**: OpenAPI/Swagger

#### Error Handling
- **Global Error Handler**: Catches all errors
- **Custom Error Classes**: AppError, ValidationError, NotFoundError
- **Error Codes**: Standardized error responses
- **Logging**: Structured logging with context

---

## DATABASE ARCHITECTURE

### Technology: PostgreSQL (Supabase)

### Schema Design

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id BIGINT UNIQUE NOT NULL,
  telegram_username VARCHAR(255),
  telegram_first_name VARCHAR(255),
  telegram_last_name VARCHAR(255),
  telegram_photo_url TEXT,
  balance INTEGER DEFAULT 0, -- FC
  total_earned INTEGER DEFAULT 0, -- FC
  total_withdrawn INTEGER DEFAULT 0, -- FC
  referral_code VARCHAR(50) UNIQUE,
  referred_by UUID REFERENCES users(id),
  language VARCHAR(10) DEFAULT 'en',
  currency_display VARCHAR(20) DEFAULT 'both', -- 'fc', 'usd', 'both'
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_active_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_created_at ON users(created_at);
```

#### Transactions Table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'task_reward', 'referral_bonus', 'withdrawal', 'bonus'
  category VARCHAR(50), -- 'ad', 'task', 'app', 'referral'
  amount INTEGER NOT NULL, -- FC (positive for credit, negative for debit)
  balance_after INTEGER NOT NULL, -- FC balance after transaction
  description TEXT,
  metadata JSONB, -- Task ID, ad ID, referral ID, etc.
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_type ON transactions(type);
```

#### Tasks Table
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id VARCHAR(255) UNIQUE, -- Ad network task ID
  type VARCHAR(50) NOT NULL, -- 'ad', 'survey', 'app_install', 'daily'
  category VARCHAR(50) NOT NULL, -- 'ad', 'task', 'app'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  reward_amount INTEGER NOT NULL, -- FC
  reward_usd DECIMAL(10,2), -- USD equivalent
  requirements JSONB, -- {"min_age": 18, "watch_full_video": true}
  time_estimate INTEGER, -- seconds
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'paused', 'completed'
  available_from TIMESTAMP,
  available_until TIMESTAMP,
  max_completions INTEGER, -- Per user
  current_completions INTEGER DEFAULT 0,
  metadata JSONB, -- Ad URL, survey URL, app store URL, etc.
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_type ON tasks(type);
CREATE INDEX idx_tasks_available_from ON tasks(available_from);
```

#### User Tasks Table (Task Completions)
```sql
CREATE TABLE user_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'started', -- 'started', 'completed', 'failed', 'abandoned'
  progress JSONB, -- {"current_step": 2, "total_steps": 5}
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  reward_credited BOOLEAN DEFAULT false,
  metadata JSONB
);

CREATE INDEX idx_user_tasks_user_id ON user_tasks(user_id);
CREATE INDEX idx_user_tasks_task_id ON user_tasks(task_id);
CREATE INDEX idx_user_tasks_status ON user_tasks(status);
CREATE UNIQUE INDEX idx_user_tasks_unique ON user_tasks(user_id, task_id) 
  WHERE status != 'abandoned';
```

#### Withdrawals Table
```sql
CREATE TABLE withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- FC
  amount_usd DECIMAL(10,2) NOT NULL,
  fee INTEGER NOT NULL, -- FC
  fee_usd DECIMAL(10,2) NOT NULL,
  net_amount INTEGER NOT NULL, -- FC
  net_amount_usd DECIMAL(10,2) NOT NULL,
  payeer_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'cancelled'
  settlement_period VARCHAR(50) NOT NULL, -- '2025-01'
  processed_at TIMESTAMP,
  completed_at TIMESTAMP,
  failure_reason TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);
CREATE INDEX idx_withdrawals_settlement_period ON withdrawals(settlement_period);
CREATE INDEX idx_withdrawals_created_at ON withdrawals(created_at);
```

#### Referrals Table
```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referral_code VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'active', 'rewarded'
  referrer_reward_credited BOOLEAN DEFAULT false,
  referee_reward_credited BOOLEAN DEFAULT false,
  referrer_reward_amount INTEGER DEFAULT 500, -- FC
  referee_reward_amount INTEGER DEFAULT 500, -- FC
  referee_completed_first_task BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  rewarded_at TIMESTAMP
);

CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_referee_id ON referrals(referee_id);
CREATE INDEX idx_referrals_status ON referrals(status);
CREATE UNIQUE INDEX idx_referrals_unique ON referrals(referee_id) 
  WHERE referee_id IS NOT NULL;
```

#### Settlements Table
```sql
CREATE TABLE settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period VARCHAR(50) UNIQUE NOT NULL, -- '2025-01'
  opens_at TIMESTAMP NOT NULL,
  closes_at TIMESTAMP NOT NULL,
  total_withdrawn INTEGER DEFAULT 0, -- FC
  total_withdrawn_usd DECIMAL(10,2) DEFAULT 0,
  total_users INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'open', 'closed', 'processing', 'completed'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_settlements_period ON settlements(period);
CREATE INDEX idx_settlements_status ON settlements(status);
```

### Database Patterns

#### Connection Pooling
- **Pool Size**: 20 connections (production)
- **Idle Timeout**: 30 seconds
- **Connection Timeout**: 10 seconds

#### Query Optimization
- **Indexes**: On all foreign keys, frequently queried columns
- **Query Planning**: EXPLAIN ANALYZE for slow queries
- **Connection Pooling**: PgBouncer for high concurrency

#### Data Retention
- **Transactions**: Keep forever (for user transparency)
- **User Tasks**: Keep forever (for analytics)
- **Withdrawals**: Keep forever (for legal compliance)
- **Settlements**: Keep forever (for accounting)

---

## API ARCHITECTURE

### REST API Design

#### Base URL
```
Production: https://api.fee.app/v1
Staging: https://api-staging.fee.app/v1
```

#### Authentication
- **Method**: Telegram OAuth 2.0
- **Header**: `Authorization: Bearer <telegram_token>`
- **Validation**: Verify Telegram hash on every request

#### Response Format
```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {
    "timestamp": "2025-01-01T00:00:00Z",
    "request_id": "uuid"
  }
}
```

#### Error Format
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": {
      "field": "email",
      "reason": "Email is required"
    }
  },
  "meta": {
    "timestamp": "2025-01-01T00:00:00Z",
    "request_id": "uuid"
  }
}
```

### Core API Endpoints

#### Authentication
```
POST /auth/telegram
  - Validates Telegram authentication
  - Returns JWT token
  - Creates user if not exists

GET /auth/me
  - Returns current user info
  - Requires authentication
```

#### Balance
```
GET /balance
  - Returns current balance (FC + USD)
  - Returns pending earnings
  - Returns next settlement date

GET /balance/transactions
  - Returns transaction history
  - Pagination: ?page=1&limit=20
  - Filters: ?type=task_reward&start_date=2025-01-01
```

#### Tasks
```
GET /tasks/available
  - Returns available tasks for user
  - Filters: ?category=ad,survey&type=daily
  - Sorted by reward amount

GET /tasks/:id
  - Returns task details
  - Includes user progress if started

POST /tasks/:id/start
  - Starts task for user
  - Returns task flow data

POST /tasks/:id/complete
  - Completes task
  - Credits FC to user
  - Returns updated balance
```

#### Withdrawals
```
GET /withdrawals
  - Returns withdrawal history
  - Pagination: ?page=1&limit=20

POST /withdrawals
  - Creates withdrawal request
  - Validates balance and settlement period
  - Returns withdrawal details

GET /withdrawals/:id
  - Returns withdrawal status
```

#### Referrals
```
GET /referrals
  - Returns referral code and link
  - Returns referral list

POST /referrals/share
  - Logs share action
  - Returns success

GET /referrals/stats
  - Returns referral statistics
  - Total referrals, total earned
```

#### Stats
```
GET /stats/overview
  - Returns earnings overview
  - Time period: ?period=30d

GET /stats/categories
  - Returns earnings by category
  - Time period: ?period=30d

GET /stats/metrics
  - Returns key metrics
  - Completion rate, average earnings, etc.
```

### Rate Limiting
- **Authentication**: 10 requests/minute
- **Balance**: 100 requests/minute
- **Tasks**: 50 requests/minute
- **Withdrawals**: 5 requests/minute
- **General**: 100 requests/minute

### Caching Strategy
- **Balance**: Cache for 30 seconds (Redis)
- **Tasks**: Cache for 5 minutes (Redis)
- **Stats**: Cache for 1 hour (Redis)
- **Static Data**: Cache for 24 hours (CDN)

---

## WEBSOCKET ARCHITECTURE

### Technology: Socket.io

### Events

#### Client → Server
```typescript
// Subscribe to balance updates
socket.emit('subscribe:balance', { userId: 'uuid' });

// Unsubscribe from balance updates
socket.emit('unsubscribe:balance', { userId: 'uuid' });

// Task progress update
socket.emit('task:progress', { taskId: 'uuid', progress: 50 });
```

#### Server → Client
```typescript
// Balance updated
socket.on('balance:updated', (data) => {
  { userId: 'uuid', balance: 12500, pendingEarnings: 250 }
});

// New task available
socket.on('task:available', (data) => {
  { taskId: 'uuid', title: 'New Survey', reward: 100 }
});

// Referral completed
socket.on('referral:completed', (data) => {
  { referrerId: 'uuid', refereeName: '@username', reward: 500 }
});
```

### Connection Management
- **Reconnection**: Auto-reconnect with exponential backoff
- **Heartbeat**: Ping/pong every 30 seconds
- **Rooms**: User-specific rooms for targeted updates
- **Scaling**: Redis adapter for multi-server support

---

## INTEGRATIONS ARCHITECTURE

### Telegram Bot API
**Purpose**: User authentication, notifications, deep linking
**SDK**: node-telegram-bot-api
**Key Features**:
- OAuth 2.0 authentication
- Webhook for updates
- Send notifications
- Deep link handling

**Webhook Endpoint**:
```
POST /webhooks/telegram
  - Verifies Telegram signature
  - Processes updates
  - Returns 200 OK
```

### Ad Networks (Abstracted)
**Purpose**: Serve ads, track completions, credit rewards
**Architecture**: Adapter pattern (easy to swap networks)

**Interface**:
```typescript
interface AdNetwork {
  getAvailableAds(userId: string): Promise<Ad[]>;
  getAdById(adId: string): Promise<Ad>;
  trackImpression(adId: string, userId: string): Promise<void>;
  trackCompletion(adId: string, userId: string): Promise<void>;
}
```

**Implementations**:
- AdNetworkA (primary)
- AdNetworkB (backup)
- AdNetworkC (future)

**Fallback**: If primary network fails, use backup

### Payeer API
**Purpose**: Process withdrawals
**SDK**: Custom HTTP client
**Key Features**:
- Create withdrawal
- Check status
- Get exchange rates

**API Endpoints**:
```
POST /payeer/withdraw
  - Creates withdrawal
  - Returns transaction ID

GET /payeer/status/:id
  - Checks withdrawal status

GET /payeer/rates
  - Gets current FC-to-USD rate
```

### AWS S3 / Cloudflare R2
**Purpose**: Store ad creatives, user avatars
**SDK**: AWS SDK v3
**Key Features**:
- Upload files
- Generate signed URLs
- CDN distribution

---

## AUTHENTICATION & SECURITY

### Telegram OAuth 2.0 Flow
```
1. User opens Fee via Telegram bot link
2. Telegram sends initData to Mini App
3. Frontend sends initData to backend
4. Backend validates Telegram hash
5. Backend creates/updates user
6. Backend returns JWT token
7. Frontend stores JWT in memory (not localStorage)
8. Frontend sends JWT in Authorization header
```

### JWT Token
- **Algorithm**: HS256
- **Expiration**: 7 days
- **Refresh**: Auto-refresh before expiration
- **Storage**: In-memory (not localStorage for security)

### Security Measures
- **HTTPS Only**: No HTTP in production
- **CORS**: Whitelist Telegram domains
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Zod schemas on all inputs
- **SQL Injection**: Parameterized queries (Prisma)
- **XSS Protection**: React auto-escapes, CSP headers
- **CSRF Protection**: SameSite cookies, CSRF tokens

### Fraud Prevention
- **IP Tracking**: Log IP addresses, detect multiple accounts
- **Device Fingerprinting**: Browser fingerprint (optional)
- **Behavior Analysis**: Detect impossible task completion speeds
- **Velocity Limits**: Max 1 withdrawal per settlement period
- **Manual Review**: Flag large withdrawals (> 100,000 FC)

---

## BACKGROUND JOBS

### Technology: BullMQ (Redis-based queue)

### Job Types

#### Settlement Processor
**Schedule**: 1st of each month, 00:00 UTC
**Duration**: 2-4 hours
**Process**:
1. Close previous settlement period
2. Calculate total withdrawals
3. Process pending withdrawals via Payeer
4. Update withdrawal statuses
5. Send notifications to users
6. Generate settlement report

#### Withdrawal Processor
**Schedule**: Every 5 minutes during settlement period
**Duration**: 1-2 minutes per batch
**Process**:
1. Fetch pending withdrawals
2. Validate user balances
3. Process via Payeer API
4. Update withdrawal status
5. Send notification to user

#### Task Verification
**Schedule**: Every 1 minute
**Duration**: 30 seconds
**Process**:
1. Check completed tasks
2. Verify with ad networks
3. Credit FC to user
4. Update transaction history
5. Send WebSocket notification

#### Daily Bonus Reset
**Schedule**: Every day at 00:00 UTC
**Duration**: 1 minute
**Process**:
1. Reset daily bonus for all users
2. Enable daily bonus task
3. Send notification to active users

---

## MONITORING & OBSERVABILITY

### Error Tracking: Sentry
- **Frontend**: Capture React errors, API errors
- **Backend**: Capture Express errors, job failures
- **Context**: User ID, request ID, environment
- **Alerts**: Slack notification for critical errors

### Performance Monitoring: Datadog
- **APM**: Track API response times
- **Database**: Query performance, connection pool
- **Infrastructure**: CPU, memory, disk usage
- **Alerts**: Slack notification for performance degradation

### Logging: Structured JSON Logs
- **Library**: Pino (fast JSON logger)
- **Format**: JSON with timestamp, level, message, context
- **Storage**: CloudWatch / Datadog
- **Retention**: 30 days

### Analytics: Mixpanel / Amplitude
- **Events**: Task completions, withdrawals, referrals
- **User Properties**: Balance, total earned, tasks completed
- **Funnels**: Onboarding, task completion, withdrawal
- **Cohorts**: User segments (casual, active, power users)

### Uptime Monitoring: UptimeRobot / Pingdom
- **Endpoints**: /health, /api/v1/health
- **Frequency**: Every 1 minute
- **Alerts**: SMS, email, Slack for downtime

---

## DEPLOYMENT ARCHITECTURE

### Frontend (Vercel)
- **Build**: `npm run build` (Vite)
- **Deploy**: Auto-deploy on push to main
- **Preview**: Auto-deploy on pull requests
- **CDN**: Vercel Edge Network
- **Environment Variables**: Vercel dashboard

### Backend (Railway / Render)
- **Build**: `npm run build` (TypeScript)
- **Deploy**: Auto-deploy on push to main
- **Preview**: Auto-deploy on pull requests
- **Scaling**: Auto-scale based on CPU/memory
- **Environment Variables**: Railway/Render dashboard

### Database (Supabase)
- **Hosting**: Supabase Cloud
- **Backups**: Daily automated backups
- **Scaling**: Auto-scale based on connections
- **Monitoring**: Supabase dashboard

### Redis (Supabase)
- **Hosting**: Supabase Cloud
- **Usage**: Caching, sessions, job queues
- **Monitoring**: Supabase dashboard

### CDN (Cloudflare)
- **Purpose**: Static assets, API caching, DDoS protection
- **Cache**: 24 hours for static assets
- **Rules**: Cache API responses based on endpoint

---

## DEVELOPMENT WORKFLOW

### Version Control: Git
- **Branching**: GitFlow (main, develop, feature/*, hotfix/*)
- **Commits**: Conventional commits (feat, fix, docs, etc.)
- **Pull Requests**: Required, 1 approval minimum
- **CI/CD**: GitHub Actions

### CI/CD Pipeline
```
1. Push to GitHub
2. Run tests (frontend + backend)
3. Lint code (ESLint, Prettier)
4. Build application
5. Deploy to staging
6. Run E2E tests
7. Deploy to production (if main branch)
```

### Environments
- **Development**: Local (Docker Compose)
- **Staging**: Railway (auto-deploy from develop)
- **Production**: Railway + Vercel (auto-deploy from main)

### Secrets Management
- **Tool**: Doppler /.env files (development)
- **Access**: Role-based (developers, admins)
- **Rotation**: Every 90 days

---

## TESTING STRATEGY

### Frontend Testing
- **Unit Tests**: Vitest + React Testing Library (80% coverage)
- **Integration Tests**: Vitest + Testing Library
- **E2E Tests**: Playwright (critical flows)
- **Visual Regression**: Percy / Chromatic

### Backend Testing
- **Unit Tests**: Jest (80% coverage)
- **Integration Tests**: Supertest + test database
- **E2E Tests**: Playwright (API flows)
- **Load Tests**: k6 (API performance)

### Test Coverage
- **Frontend**: 80% (critical paths 100%)
- **Backend**: 80% (critical paths 100%)
- **E2E**: All critical user flows

---

## SCALABILITY PLAN

### Phase 1: MVP (0-10K users)
- **Architecture**: Monolith (frontend + backend together)
- **Database**: Single PostgreSQL instance
- **Cache**: Single Redis instance
- **Hosting**: Railway (backend) + Vercel (frontend)
- **Cost**: $100-200/month

### Phase 2: Growth (10K-100K users)
- **Architecture**: Separate frontend and backend
- **Database**: PostgreSQL with read replicas
- **Cache**: Redis cluster
- **Hosting**: Railway (backend) + Vercel (frontend)
- **CDN**: Cloudflare
- **Cost**: $500-1000/month

### Phase 3: Scale (100K-1M users)
- **Architecture**: Microservices (auth, tasks, withdrawals)
- **Database**: PostgreSQL with sharding
- **Cache**: Redis cluster with Sentinel
- **Queue**: BullMQ with multiple workers
- **Hosting**: Kubernetes (EKS / GKE)
- **CDN**: Cloudflare
- **Cost**: $2000-5000/month

---

## DISASTER RECOVERY

### Backup Strategy
- **Database**: Daily automated backups (Supabase)
- **Files**: S3 versioning enabled
- **Code**: GitHub (multiple branches)
- **Secrets**: Doppler (encrypted, backed up)

### Recovery Time Objectives (RTO)
- **Database**: 1 hour (restore from backup)
- **Application**: 15 minutes (redeploy)
- **Full System**: 2 hours

### Recovery Point Objectives (RPO)
- **Database**: 24 hours (daily backups)
- **Transactions**: Real-time (WAL archiving)

### Incident Response
1. **Detection**: Sentry alerts, uptime monitoring
2. **Response**: On-call engineer notified (Slack)
3. **Mitigation**: Rollback deployment, disable feature
4. **Resolution**: Fix issue, deploy fix
5. **Post-mortem**: Document incident, update runbooks

---

## TECHNICAL DEBT MANAGEMENT

### Code Quality
- **Linting**: ESLint + Prettier
- **Type Safety**: TypeScript strict mode
- **Code Reviews**: Required for all PRs
- **Documentation**: README, inline comments

### Refactoring Schedule
- **Monthly**: Tech debt review
- **Quarterly**: Refactoring sprint
- **Annually**: Architecture review

### Deprecation Policy
- **Announce**: 3 months before deprecation
- **Migration Guide**: Clear instructions
- **Support**: Maintain old version for 6 months

---

## OPEN TECHNICAL QUESTIONS

### Architecture
1. Should we use GraphQL or stick with REST? (REST for MVP, GraphQL later)
2. Should we use Prisma or raw SQL? (Prisma for type safety)
3. Should we use BullMQ or AWS SQS? (BullMQ for simplicity)
4. Should we use Vercel or self-host frontend? (Vercel for MVP)

### Performance
1. Should we use WebSockets or polling for balance updates? (WebSockets)
2. Should we cache task data? (Yes, 5-minute cache)
3. Should we use CDN for API responses? (Yes, for static data)

### Security
1. Should we implement 2FA? (No, Telegram auth is sufficient)
2. Should we encrypt sensitive data? (Yes, PII encryption)
3. Should we use WAF? (Yes, Cloudflare WAF)

---

## CONCLUSION

Fee's technical architecture is designed to be scalable, reliable, and maintainable. We start simple (monolith) and scale to microservices when needed. Every decision prioritizes user experience, security, and long-term maintainability.

**Our technical promise**:
- Reliable: 99.9% uptime
- Fast: < 200ms API response time
- Secure: Industry-standard security practices
- Scalable: Handle 1M+ users without rewrites
- Maintainable: Clean code, good documentation

---

*Technical Architecture Version 1.0*
*Created: 2026-07-18*
*Status: Ready for Implementation*
*Next Step: Visual Design System*