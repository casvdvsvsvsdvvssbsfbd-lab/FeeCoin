# FEE - Supabase Architecture
## Complete Supabase Platform Architecture for 10 Million Users

---

## DOCUMENT PURPOSE

This document defines the **complete Supabase architecture** for Fee. It describes how Supabase services (Authentication, PostgreSQL, Storage, Realtime, Edge Functions, Cron Jobs) are used to build a scalable, secure, and maintainable platform for millions of users.

**This document is based on:**
- Fee Product DNA
- Fee Complete Product Blueprint
- Fee Complete User Flows
- Fee Information Architecture V2
- Fee Complete Feature Specification
- Fee System Architecture
- Fee Database Blueprint
- Fee Backend Blueprint
- Fee API Blueprint

**This document is used by:**
- Supabase architects (to design Supabase configuration)
- Backend developers (to implement Supabase integration)
- DevOps engineers (to deploy and scale Supabase)
- Security engineers (to secure Supabase)
- QA engineers (to test Supabase integration)

---

## ARCHITECTURE OVERVIEW

### Design Principles

**1. Supabase-First**
- Use Supabase as the primary backend platform
- Leverage Supabase managed services (PostgreSQL, Auth, Storage, Realtime)
- Minimize custom infrastructure
- Focus on business logic, not infrastructure

**2. Scalability**
- Design for 10M+ users
- Horizontal scaling via Supabase
- Database sharding (if needed)
- Multi-layer caching

**3. Security**
- Row Level Security (RLS) for data access
- Encryption at rest and in transit
- Audit logging
- Compliance (GDPR, SOC 2)

**4. Performance**
- < 100ms API response time
- < 2s page load time
- Real-time updates via WebSocket
- Multi-layer caching

**5. Maintainability**
- Clear separation of concerns
- Well-defined interfaces
- Comprehensive documentation
- Automated testing

---

## ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                           │
│              Telegram Mini App (React/Vue)                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE CLIENT                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  - Supabase JS Client                                  │  │
│  │  - Authentication                                      │  │
│  │  - Database Queries                                    │  │
│  │  - Storage Operations                                  │  │
│  │  - Realtime Subscriptions                             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS/WSS
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE PLATFORM                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              SUPABASE AUTHENTICATION                   │  │
│  │  - Telegram OAuth 2.0                                  │  │
│  │  - JWT Token Management                                │  │
│  │  - Session Management                                  │  │
│  │  - 2FA (Future)                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              SUPABASE POSTGRESQL                       │  │
│  │  - Primary Database                                    │  │
│  │  - Row Level Security (RLS)                            │  │
│  │  - Database Functions                                  │  │
│  │  - Database Triggers                                   │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              SUPABASE STORAGE                          │  │
│  │  - File Upload/Download                                │  │
│  │  - Image/Video Processing                              │  │
│  │  - CDN Integration                                     │  │
│  │  - Access Control                                      │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              SUPABASE REALTIME                         │  │
│  │  - WebSocket Connections                               │  │
│  │  - Real-time Subscriptions                             │  │
│  │  - Presence Tracking                                   │  │
│  │  - Broadcast Messages                                  │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              SUPABASE EDGE FUNCTIONS                   │  │
│  │  - Serverless Functions                                │  │
│  │  - API Endpoints                                       │  │
│  │  - Webhooks                                            │  │
│  │  - Scheduled Jobs (Deno Cron)                          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Telegram   │  │ Ad Networks  │  │    Payeer    │     │
│  │   Bot API    │  │ (AdMob, etc) │  │    API       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Email     │  │     SMS      │  │  Analytics   │     │
│  │  (SendGrid)  │  │  (Twilio)    │  │  (Mixpanel)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## SUPABASE AUTHENTICATION

### Purpose
Supabase Authentication handles user authentication, session management, and security. It provides a complete authentication solution with Telegram OAuth 2.0 integration.

### Benefits
- **Managed Service**: No need to build authentication from scratch
- **Telegram OAuth**: Native Telegram OAuth 2.0 support
- **JWT Tokens**: Secure, stateless authentication
- **Session Management**: Automatic session management
- **Email/Password**: Future social login support
- **2FA/MFA**: Future two-factor authentication support

### Limitations
- **Customization**: Limited customization of authentication flow
- **Telegram Only**: Primary authentication method is Telegram
- **Session Storage**: Sessions stored in PostgreSQL (not Redis)
- **Rate Limiting**: Limited rate limiting controls

### Security
- **JWT Tokens**: Secure, signed tokens
- **HTTP-only Cookies**: Prevent XSS attacks
- **Secure Flag**: HTTPS only
- **Same-site Policy**: CSRF protection
- **Token Expiration**: 7 days (access), 30 days (refresh)
- **Audit Logging**: All authentication events logged

### Future Expansion
- **Social Login**: Google, Apple, Twitter (future)
- **2FA/MFA**: Two-factor authentication (future)
- **Passwordless**: Magic link authentication (future)
- **SSO**: Single sign-on (future)
- **Biometric**: Fingerprint, face ID (future)

### Implementation Strategy

**Telegram OAuth 2.0**:
```
1. Client: User clicks "Login with Telegram"
2. Client → Telegram: Open Telegram OAuth dialog
3. Telegram: User authenticates, grants permission
4. Telegram → Client: Return authentication token
5. Client → Supabase Auth: Sign in with Telegram token
6. Supabase Auth: Validate token, create/update user
7. Supabase Auth: Generate JWT tokens
8. Supabase Auth → Client: Return JWT tokens
```

**JWT Token Structure**:
```json
{
  "sub": "user_id",
  "iat": 1234567890,
  "exp": 1234567890 + (7 * 24 * 60 * 60),
  "role": "authenticated",
  "telegram_id": "123456789"
}
```

**Session Management**:
- **Access Token**: 7 days (stored in HTTP-only cookie)
- **Refresh Token**: 30 days (stored in HTTP-only cookie)
- **Session Table**: PostgreSQL table for session management
- **Auto Refresh**: Automatic token refresh before expiration

---

## SUPABASE POSTGRESQL

### Purpose
Supabase PostgreSQL is the primary database for Fee. It stores all user data, transactions, tasks, missions, events, and more. It provides a powerful, scalable, and secure database solution.

### Benefits
- **Managed Service**: No need to manage database infrastructure
- **Scalability**: Automatic scaling, read replicas
- **Security**: Row Level Security (RLS), encryption at rest
- **Performance**: Optimized queries, connection pooling
- **Extensions**: PostGIS, pg_stat_statements, etc.
- **Backups**: Automatic daily backups, point-in-time recovery

### Limitations
- **Database Size**: Limited by Supabase plan (up to 8TB on enterprise)
- **Connections**: Limited connections (max 200 on enterprise)
- **Custom Extensions**: Limited custom extensions
- **Vendor Lock-in**: Tied to Supabase platform

### Security
- **Encryption at Rest**: AES-256 encryption
- **Encryption in Transit**: TLS 1.3
- **Row Level Security (RLS)**: Fine-grained access control
- **Audit Logging**: All database changes logged
- **Access Control**: Role-based access control
- **Network Isolation**: Private network, no public access

### Future Expansion
- **Database Sharding**: Shard by user ID (if needed)
- **Read Replicas**: Add read replicas for scalability
- **Database Extensions**: Add custom extensions (if needed)
- **Data Warehouse**: Separate analytics database (if needed)
- **Multi-region**: Deploy to multiple regions (if needed)

### Implementation Strategy

**Database Schema**:
- Use 45 entities from Database Blueprint
- Implement RLS policies for all tables
- Use database functions for business logic
- Use database triggers for audit logging

**Row Level Security (RLS)**:
```sql
-- Users can only read their own data
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can only update their own data
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Admins can read all data
CREATE POLICY "Admins can read all data"
  ON users FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');
```

**Database Functions**:
```sql
-- Credit FC function
CREATE OR REPLACE FUNCTION credit_fc(
  p_user_id UUID,
  p_amount INTEGER,
  p_type TEXT,
  p_reference_id UUID
)
RETURNS VOID AS $$
BEGIN
  -- Update balance
  UPDATE wallets
  SET fc_balance = fc_balance + p_amount
  WHERE user_id = p_user_id;

  -- Create transaction
  INSERT INTO transactions (user_id, type, amount, reference_id)
  VALUES (p_user_id, p_type, p_amount, p_reference_id);
END;
$$ LANGUAGE plpgsql;
```

**Database Triggers**:
```sql
-- Audit trigger for transactions
CREATE TRIGGER transactions_audit
  AFTER INSERT OR UPDATE OR DELETE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION audit_log();
```

---

## SUPABASE STORAGE

### Purpose
Supabase Storage manages file storage (images, videos, documents). It provides secure, scalable storage for user-generated content and platform assets.

### Benefits
- **Managed Service**: No need to manage file storage infrastructure
- **Scalability**: Automatic scaling, unlimited storage
- **CDN Integration**: Built-in CDN for fast file delivery
- **Access Control**: Row Level Security for files
- **Image Processing**: Automatic image resizing, optimization
- **Video Processing**: Automatic video transcoding (future)

### Limitations
- **File Size**: Limited by Supabase plan (max 50GB per file)
- **File Types**: Limited file type support
- **Custom Processing**: Limited custom file processing
- **Vendor Lock-in**: Tied to Supabase platform

### Security
- **Encryption at Rest**: AES-256 encryption
- **Encryption in Transit**: TLS 1.3
- **Access Control**: Row Level Security (RLS)
- **Signed URLs**: Temporary, secure file access
- **Audit Logging**: All file operations logged
- **Virus Scanning**: Automatic virus scanning (future)

### Future Expansion
- **More File Types**: Audio, archives, etc.
- **File Processing**: Image resizing, video transcoding
- **File Versioning**: Version control for files
- **File Sharing**: Share files with other users
- **File Analytics**: Storage usage, bandwidth

### Implementation Strategy

**Storage Buckets**:
- **avatars**: User profile pictures (public)
- **uploads**: User uploaded files (private)
- **assets**: Platform assets (public)

**Row Level Security (RLS)**:
```sql
-- Users can upload their own avatar
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid() = owner_id
  );

-- Users can read their own avatar
CREATE POLICY "Users can read own avatar"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'avatars' AND
    auth.uid() = owner_id
  );

-- Public can read avatars
CREATE POLICY "Public can read avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');
```

**File Upload Flow**:
```
1. Client: Request upload URL from backend
2. Backend → Supabase Storage: Generate signed URL
3. Supabase Storage → Backend: Return signed URL
4. Backend → Client: Return signed URL
5. Client → Supabase Storage: Upload file (signed URL)
6. Supabase Storage: Store file, return public URL
7. Client: Update user profile with avatar URL
```

---

## SUPABASE REALTIME

### Purpose
Supabase Realtime provides real-time updates via WebSocket. It enables live updates for balance, progress, notifications, and more.

### Benefits
- **Managed Service**: No need to manage WebSocket infrastructure
- **Scalability**: Automatic scaling, unlimited connections
- **Presence**: Track user presence (online/offline)
- **Broadcast**: Send messages to all connected clients
- **PostgreSQL Changes**: Subscribe to database changes
- **Easy Integration**: Simple client SDK

### Limitations
- **Message Size**: Limited message size (max 1MB)
- **Connection Limits**: Limited connections (max 1000 on enterprise)
- **Custom Logic**: Limited custom logic
- **Vendor Lock-in**: Tied to Supabase platform

### Security
- **Authentication**: JWT token validation
- **Authorization**: Row Level Security (RLS)
- **Encryption**: TLS 1.3 (WSS)
- **Access Control**: Channel-level access control
- **Audit Logging**: All real-time events logged

### Future Expansion
- **More Channels**: More real-time channels
- **Custom Logic**: Custom real-time logic
- **Message Queue**: Message queue for offline users
- **Push Notifications**: Integration with push notifications
- **Live Chat**: Real-time chat support

### Implementation Strategy

**Realtime Channels**:
- **balance**: Balance updates (user-specific)
- **progress**: Mission/event progress (user-specific)
- **notifications**: Notifications (user-specific)
- **leaderboard**: Leaderboard updates (global)

**Realtime Subscription**:
```javascript
// Subscribe to balance updates
const channel = supabase
  .channel('balance')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'wallets',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    // Update balance in real-time
    updateBalance(payload.new.fc_balance);
  })
  .subscribe();
```

**Realtime Flow**:
```
1. FC Economy Service: User earns FC
2. FC Economy Service → PostgreSQL: Update wallet balance
3. Supabase Realtime: Detect database change
4. Supabase Realtime → Client: Push balance update
5. Client: Update UI in real-time
```

---

## SUPABASE EDGE FUNCTIONS

### Purpose
Supabase Edge Functions provide serverless functions for custom business logic, API endpoints, webhooks, and scheduled jobs. They run on Deno runtime at the edge (close to users).

### Benefits
- **Serverless**: No need to manage server infrastructure
- **Scalability**: Automatic scaling, unlimited functions
- **Edge Runtime**: Low latency (close to users)
- **Deno Runtime**: Modern, secure runtime
- **Easy Deployment**: Deploy via Supabase CLI
- **Integration**: Native integration with Supabase services

### Limitations
- **Execution Time**: Limited execution time (max 30 seconds)
- **Memory**: Limited memory (max 512MB)
- **Cold Start**: Cold start latency (100-500ms)
- **Vendor Lock-in**: Tied to Supabase platform

### Security
- **Authentication**: JWT token validation
- **Authorization**: Row Level Security (RLS)
- **Encryption**: TLS 1.3 (HTTPS)
- **Access Control**: Function-level access control
- **Audit Logging**: All function calls logged
- **Secrets**: Environment variables for secrets

### Future Expansion
- **More Functions**: More edge functions for new features
- **Custom Logic**: Custom business logic
- **Webhooks**: Webhook handlers for external services
- **Scheduled Jobs**: Cron jobs for scheduled tasks
- **API Gateway**: API gateway for external clients

### Implementation Strategy

**Edge Functions**:
- **auth-telegram**: Telegram OAuth 2.0 handler
- **tasks-complete**: Task completion handler
- **ads-watch**: Ad watch handler
- **withdrawals-create**: Withdrawal creation handler
- **settlements-process**: Settlement processing handler
- **webhooks-telegram**: Telegram webhook handler
- **webhooks-payeer**: Payeer webhook handler

**Edge Function Example**:
```typescript
// tasks-complete
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // Validate JWT token
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  })

  // Get user from token
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Get task ID from request
  const { task_id } = await req.json()

  // Validate task completion
  const { data: task } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', task_id)
    .single()

  if (!task) {
    return new Response('Task not found', { status: 404 })
  }

  // Credit FC
  await supabase.rpc('credit_fc', {
    p_user_id: user.id,
    p_amount: task.reward,
    p_type: 'task_completion',
    p_reference_id: task_id
  })

  // Return success
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

**Edge Function Deployment**:
```bash
# Deploy edge function
supabase functions deploy tasks-complete

# Set environment variables
supabase secrets set SUPABASE_URL=https://xxx.supabase.co
supabase secrets set SUPABASE_ANON_KEY=xxx
```

---

## SUPABASE CRON JOBS

### Purpose
Supabase Cron Jobs (via pg_cron extension) handle scheduled tasks like settlement, daily bonus reset, leaderboard updates, etc. They run directly in PostgreSQL.

### Benefits
- **Managed Service**: No need to manage cron infrastructure
- **PostgreSQL Integration**: Direct database access
- **Reliability**: Reliable, fault-tolerant execution
- **Scheduling**: Flexible scheduling (cron expressions)
- **Monitoring**: Built-in monitoring and logging

### Limitations
- **Execution Time**: Limited execution time (max 1 hour)
- **Frequency**: Limited frequency (min 1 minute)
- **Custom Logic**: Limited custom logic
- **Vendor Lock-in**: Tied to Supabase platform

### Security
- **Authentication**: Database authentication
- **Authorization**: Role-based access control
- **Encryption**: TLS 1.3 (in transit)
- **Access Control**: Function-level access control
- **Audit Logging**: All job executions logged

### Future Expansion
- **More Jobs**: More scheduled jobs for new features
- **Custom Logic**: Custom business logic
- **Job Dependencies**: Job chaining and dependencies
- **Job Monitoring**: Job monitoring and alerting
- **Job Retry**: Job retry and error handling

### Implementation Strategy

**Cron Jobs**:
- **settlement**: Monthly settlement (1st of month, 00:00 UTC)
- **daily_bonus_reset**: Daily bonus reset (00:00 UTC)
- **leaderboard_update**: Leaderboard update (every 5 minutes)
- **balance_snapshot**: Daily balance snapshot (00:00 UTC)
- **cleanup_expired_sessions**: Cleanup expired sessions (every hour)

**Cron Job Example**:
```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Settlement job (1st of month, 00:00 UTC)
SELECT cron.schedule(
  'settlement',
  '0 0 1 * *',
  $$
  SELECT process_settlement();
  $$
);

-- Daily bonus reset (00:00 UTC)
SELECT cron.schedule(
  'daily_bonus_reset',
  '0 0 * * *',
  $$
  SELECT reset_daily_bonus();
  $$
);

-- Leaderboard update (every 5 minutes)
SELECT cron.schedule(
  'leaderboard_update',
  '*/5 * * * *',
  $$
  SELECT update_leaderboard();
  $$
);
```

**Cron Job Function**:
```sql
-- Settlement function
CREATE OR REPLACE FUNCTION process_settlement()
RETURNS VOID AS $$
DECLARE
  user_record RECORD;
  fc_earned INTEGER;
  usd_amount DECIMAL;
BEGIN
  -- Loop through all users
  FOR user_record IN SELECT id FROM users LOOP
    -- Get FC earned last month
    SELECT COALESCE(SUM(amount), 0) INTO fc_earned
    FROM transactions
    WHERE user_id = user_record.id
      AND type = 'fc_earned'
      AND created_at >= date_trunc('month', NOW() - INTERVAL '1 month')
      AND created_at < date_trunc('month', NOW());

    -- Convert FC to USD
    usd_amount := fc_earned * 0.01;

    -- Create settlement
    INSERT INTO settlements (user_id, fc_amount, usd_amount, status)
    VALUES (user_record.id, fc_earned, usd_amount, 'completed');

    -- Update wallet
    UPDATE wallets
    SET withdrawable_balance = withdrawable_balance + usd_amount
    WHERE user_id = user_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

---

## ROW LEVEL SECURITY (RLS)

### Purpose
Row Level Security (RLS) provides fine-grained access control at the database row level. It ensures users can only access their own data, and admins can access all data.

### Benefits
- **Fine-Grained Access Control**: Control access at row level
- **Centralized Security**: Security logic in database
- **Automatic Enforcement**: Enforced by database, not application
- **Audit Logging**: All access logged by database
- **Performance**: Efficient, database-level enforcement

### Limitations
- **Complexity**: Complex policies can be hard to maintain
- **Performance**: Can impact query performance
- **Debugging**: Hard to debug policy issues
- **Vendor Lock-in**: Tied to PostgreSQL/Supabase

### Security
- **Authentication**: JWT token validation
- **Authorization**: Role-based access control
- **Encryption**: Transparent to application
- **Access Control**: Row-level access control
- **Audit Logging**: All access logged by database

### Future Expansion
- **More Policies**: More RLS policies for new features
- **Custom Logic**: Custom security logic
- **Policy Testing**: Automated policy testing
- **Policy Monitoring**: Policy monitoring and alerting
- **Policy Optimization**: Policy optimization for performance

### Implementation Strategy

**RLS Policies for All Tables**:

**Users Table**:
```sql
-- Users can read own data
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update own data
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Admins can read all data
CREATE POLICY "Admins can read all data"
  ON users FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Admins can update all data
CREATE POLICY "Admins can update all data"
  ON users FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');
```

**Wallets Table**:
```sql
-- Users can read own wallet
CREATE POLICY "Users can read own wallet"
  ON wallets FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update own wallet (limited fields)
CREATE POLICY "Users can update own wallet"
  ON wallets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    -- Users can only update certain fields
    (NEW.fc_balance = OLD.fc_balance OR
     NEW.pending_earnings = OLD.pending_earnings)
  );

-- Admins can read all wallets
CREATE POLICY "Admins can read all wallets"
  ON wallets FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Admins can update all wallets
CREATE POLICY "Admins can update all wallets"
  ON wallets FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');
```

**Transactions Table**:
```sql
-- Users can read own transactions
CREATE POLICY "Users can read own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Only system can insert transactions
CREATE POLICY "System can insert transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Admins can read all transactions
CREATE POLICY "Admins can read all transactions"
  ON transactions FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');
```

**Tasks Table**:
```sql
-- All authenticated users can read available tasks
CREATE POLICY "Users can read available tasks"
  ON tasks FOR SELECT
  USING (auth.role() = 'authenticated' AND status = 'active');

-- Only admins can insert/update/delete tasks
CREATE POLICY "Admins can manage tasks"
  ON tasks FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

---

## BACKUPS

### Purpose
Supabase Backups provide automatic database backups and point-in-time recovery. They ensure data durability and disaster recovery.

### Benefits
- **Automatic Backups**: Daily automated backups
- **Point-in-Time Recovery**: Restore to any point in time
- **Backup Retention**: 7-30 days retention (depending on plan)
- **Backup Encryption**: Backups encrypted at rest
- **Easy Restoration**: One-click restoration

### Limitations
- **Retention Period**: Limited retention (max 30 days on enterprise)
- **Backup Frequency**: Limited frequency (max daily on enterprise)
- **Restore Time**: Restore time can be slow (minutes to hours)
- **Vendor Lock-in**: Tied to Supabase platform

### Security
- **Encryption at Rest**: AES-256 encryption
- **Encryption in Transit**: TLS 1.3
- **Access Control**: Only admins can restore backups
- **Audit Logging**: All backup/restore operations logged
- **Geographic Redundancy**: Backups stored in multiple regions

### Future Expansion
- **Longer Retention**: Longer backup retention (1 year+)
- **More Frequent Backups**: Hourly backups (if needed)
- **Cross-Region Backups**: Backups in multiple regions
- **Backup Analytics**: Backup analytics and monitoring
- **Disaster Recovery**: Automated disaster recovery

### Implementation Strategy

**Backup Configuration**:
- **Daily Backups**: Automatic daily backups at 00:00 UTC
- **Retention**: 30 days retention (enterprise plan)
- **Encryption**: AES-256 encryption
- **Geographic Redundancy**: Backups stored in multiple regions

**Backup Restoration**:
```
1. Admin: Request backup restoration
2. Supabase: Validate request
3. Supabase: Restore database from backup
4. Supabase: Verify restoration
5. Supabase: Notify admin
6. Admin: Verify restoration
```

**Backup Monitoring**:
- Monitor backup success/failure
- Monitor backup size
- Monitor restore time
- Alert on backup failures

---

## SECURITY

### Purpose
Supabase Security provides comprehensive security features to protect the platform from threats. It includes authentication, authorization, encryption, audit logging, and compliance.

### Benefits
- **Managed Security**: Supabase handles security infrastructure
- **Compliance**: SOC 2, GDPR, HIPAA (enterprise)
- **Encryption**: Encryption at rest and in transit
- **Access Control**: Row Level Security (RLS)
- **Audit Logging**: Comprehensive audit logging
- **Monitoring**: Security monitoring and alerting

### Limitations
- **Customization**: Limited customization of security features
- **Compliance**: Limited compliance certifications (check Supabase docs)
- **Vendor Lock-in**: Tied to Supabase platform
- **Cost**: Security features can be expensive (enterprise)

### Security Features

**Authentication**:
- Telegram OAuth 2.0
- JWT tokens
- Session management
- 2FA/MFA (future)

**Authorization**:
- Row Level Security (RLS)
- Role-based access control (RBAC)
- Policy-based access control

**Encryption**:
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Column-level encryption (future)

**Audit Logging**:
- All authentication events
- All authorization events
- All database changes
- All file operations

**Monitoring**:
- Security monitoring
- Anomaly detection
- Alerting

### Future Expansion
- **More Authentication**: More social login providers
- **2FA/MFA**: Two-factor authentication
- **SSO**: Single sign-on
- **Advanced RLS**: More complex RLS policies
- **Security Analytics**: Security analytics and reporting

---

## MONITORING

### Purpose
Supabase Monitoring provides comprehensive monitoring of database performance, API usage, and platform health. It ensures the platform is performant and reliable.

### Benefits
- **Managed Monitoring**: No need to set up monitoring infrastructure
- **Database Monitoring**: Query performance, connections, storage
- **API Monitoring**: API usage, errors, latency
- **Realtime Monitoring**: Connection count, message throughput
- **Alerts**: Automated alerts for issues
- **Dashboards**: Built-in dashboards

### Limitations
- **Custom Metrics**: Limited custom metrics
- **Retention**: Limited retention (max 30 days on enterprise)
- **Custom Dashboards**: Limited custom dashboards
- **Vendor Lock-in**: Tied to Supabase platform

### Security
- **Access Control**: Only admins can access monitoring
- **Authentication**: Admin authentication required
- **Audit Logging**: All monitoring access logged
- **Data Privacy**: No PII in monitoring data

### Future Expansion
- **More Metrics**: More custom metrics
- **Custom Dashboards**: Custom monitoring dashboards
- **Advanced Alerts**: More advanced alerting
- **Predictive Analytics**: Predictive analytics for issues
- **Integration**: Integration with external monitoring tools

### Implementation Strategy

**Monitoring Metrics**:
- **Database**: Query performance, connections, storage, replication lag
- **API**: Requests per second, error rate, latency
- **Realtime**: Connection count, message throughput, latency
- **Storage**: File uploads, downloads, bandwidth

**Monitoring Dashboards**:
- **Database Dashboard**: Query performance, connections, storage
- **API Dashboard**: Requests, errors, latency
- **Realtime Dashboard**: Connections, messages, latency
- **Storage Dashboard**: Uploads, downloads, bandwidth

**Monitoring Alerts**:
- Database connection pool exhausted
- API error rate > 1%
- API latency > 1s (p95)
- Realtime connection count > 1000
- Storage bandwidth > 1GB/s

---

## ENVIRONMENT VARIABLES

### Purpose
Environment variables store configuration settings for Supabase integration. They include API keys, database URLs, and other sensitive information.

### Benefits
- **Security**: Keep secrets out of code
- **Flexibility**: Easy to change configuration
- **Environment-Specific**: Different values per environment
- **Supabase Integration**: Native integration with Supabase

### Limitations
- **Number of Variables**: Limited number of variables (max 100 on enterprise)
- **Size Limit**: Limited size per variable (max 4KB)
- **Vendor Lock-in**: Tied to Supabase platform

### Security
- **Encryption**: Environment variables encrypted at rest
- **Access Control**: Only admins can access variables
- **Audit Logging**: All variable access logged
- **Rotation**: Regular secret rotation

### Environment Variables

**Supabase Configuration**:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Telegram Configuration**:
```
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_WEBHOOK_SECRET=xxx
```

**External Services**:
```
PAYEER_API_KEY=xxx
PAYEER_API_SECRET=xxx
SENDGRID_API_KEY=xxx
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
MIXPANEL_API_KEY=xxx
```

**Application Configuration**:
```
NODE_ENV=production
LOG_LEVEL=info
CACHE_TTL=3600
RATE_LIMIT_MAX=100
```

### Environment Variable Management

**Development**:
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Staging**:
```bash
# .env.staging
NEXT_PUBLIC_SUPABASE_URL=https://xxx-staging.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Production**:
```bash
# .env.production
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Supabase Secrets**:
```bash
# Set secrets via Supabase CLI
supabase secrets set TELEGRAM_BOT_TOKEN=xxx
supabase secrets set PAYEER_API_KEY=xxx
supabase secrets set SENDGRID_API_KEY=xxx
```

---

## FUTURE SCALING

### Scaling Strategy

**Database Scaling**:
- **Read Replicas**: Add read replicas for read-heavy workloads
- **Database Sharding**: Shard by user ID (if needed)
- **Connection Pooling**: Use connection pooling (PgBouncer)
- **Query Optimization**: Optimize slow queries
- **Indexing**: Add indexes for frequently queried fields

**Storage Scaling**:
- **CDN**: Use CDN for file delivery
- **Image Optimization**: Automatic image resizing, optimization
- **Video Transcoding**: Automatic video transcoding (future)
- **Storage Tiering**: Hot, warm, cold storage tiers

**Realtime Scaling**:
- **Connection Limits**: Increase connection limits (enterprise plan)
- **Channel Optimization**: Optimize channel subscriptions
- **Message Batching**: Batch messages for efficiency
- **Load Balancing**: Load balance across multiple regions

**Edge Functions Scaling**:
- **Function Optimization**: Optimize function performance
- **Cold Start Reduction**: Reduce cold start latency
- **Caching**: Cache function results
- **Load Balancing**: Load balance across multiple regions

### Scaling Targets

**Users**:
- **Current**: 10,000 users
- **Target**: 10,000,000 users
- **Scale Factor**: 1000x

**Requests**:
- **Current**: 1,000 requests per second
- **Target**: 100,000 requests per second
- **Scale Factor**: 100x

**Database**:
- **Current**: 10GB database
- **Target**: 10TB database
- **Scale Factor**: 1000x

**Storage**:
- **Current**: 100GB storage
- **Target**: 100TB storage
- **Scale Factor**: 1000x

### Scaling Best Practices

**Database**:
- Use read replicas for read-heavy workloads
- Use connection pooling (PgBouncer)
- Optimize slow queries
- Add indexes for frequently queried fields
- Use database sharding (if needed)

**Storage**:
- Use CDN for file delivery
- Optimize images (resize, compress)
- Use storage tiering (hot, warm, cold)
- Monitor storage usage

**Realtime**:
- Optimize channel subscriptions
- Batch messages for efficiency
- Use load balancing (multiple regions)
- Monitor connection count

**Edge Functions**:
- Optimize function performance
- Reduce cold start latency
- Cache function results
- Use load balancing (multiple regions)

---

## SUPABASE INTEGRATION WITH FEE

### Integration Points

**Authentication**:
- Telegram OAuth 2.0 via Supabase Auth
- JWT token management via Supabase Auth
- Session management via Supabase Auth

**Database**:
- All 45 entities stored in Supabase PostgreSQL
- Row Level Security (RLS) for all tables
- Database functions for business logic
- Database triggers for audit logging

**Storage**:
- User avatars stored in Supabase Storage
- User uploads stored in Supabase Storage
- Platform assets stored in Supabase Storage

**Realtime**:
- Balance updates via Supabase Realtime
- Progress updates via Supabase Realtime
- Notifications via Supabase Realtime
- Leaderboard updates via Supabase Realtime

**Edge Functions**:
- API endpoints via Supabase Edge Functions
- Webhooks via Supabase Edge Functions
- Scheduled jobs via Supabase Cron Jobs

### Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                           │
│              Telegram Mini App (React/Vue)                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE CLIENT                          │
│  - Supabase JS Client                                        │
│  - Authentication                                            │
│  - Database Queries                                          │
│  - Storage Operations                                        │
│  - Realtime Subscriptions                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE PLATFORM                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Supabase Auth (Telegram OAuth, JWT)                  │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Supabase PostgreSQL (45 entities, RLS)               │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Supabase Storage (avatars, uploads, assets)          │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Supabase Realtime (balance, progress, notifications) │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Supabase Edge Functions (API, webhooks, jobs)        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
│  - Telegram Bot API                                          │
│  - Ad Networks (AdMob, etc)                                  │
│  - Payeer API                                                │
│  - Email Service (SendGrid)                                  │
│  - SMS Service (Twilio)                                      │
│  - Analytics (Mixpanel)                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## CONCLUSION

This Supabase Architecture defines the **complete Supabase integration** for Fee. It leverages Supabase managed services (Authentication, PostgreSQL, Storage, Realtime, Edge Functions, Cron Jobs) to build a scalable, secure, and maintainable platform for millions of users.

**Key Principles Applied**:
- **Supabase-First**: Use Supabase as the primary backend platform
- **Scalable**: Design for 10M+ users
- **Secure**: Row Level Security, encryption, audit logging
- **Performant**: < 100ms response time, real-time updates
- **Maintainable**: Clear integration points, well-defined interfaces

**Next Steps**:
1. Review with Supabase architects
2. Create Supabase project configuration
3. Implement database schema with RLS
4. Implement authentication (Telegram OAuth)
5. Implement storage buckets
6. Implement realtime subscriptions
7. Implement edge functions
8. Implement cron jobs
9. Deploy to staging environment
10. Test with real users
11. Deploy to production

**This architecture is the foundation for all Supabase work. Every Supabase feature, every integration, every security policy must align with this architecture.**

---

*Supabase Architecture V1*
*Created: 2026-07-18*
*Status: COMPLETE*
*Next Phase: Technical Design*