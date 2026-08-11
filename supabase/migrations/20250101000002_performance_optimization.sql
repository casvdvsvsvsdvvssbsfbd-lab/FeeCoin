-- ============================================
-- Performance Optimization for 10M+ Users
-- Version: 1.0.2
-- Description: Additional indexes and performance optimizations
-- ============================================

-- ============================================
-- ADDITIONAL PERFORMANCE INDEXES
-- ============================================

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_users_telegram_id_active ON users(telegram_id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_users_email_active ON users(email) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_profiles_user_level ON profiles(user_id, level DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_user_rank ON profiles(user_id, rank);
CREATE INDEX IF NOT EXISTS idx_wallets_user_balance ON wallets(user_id, balance DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_type_status ON transactions(user_id, transaction_type, status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_created_type ON transactions(user_id, created_at DESC, transaction_type);
CREATE INDEX IF NOT EXISTS idx_fc_ledger_user_type_created ON fc_ledger(user_id, transaction_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_settlements_user_status ON settlements(user_id, status);
CREATE INDEX IF NOT EXISTS idx_settlements_cycle_status ON settlements(settlement_cycle_id, status);
CREATE INDEX IF NOT EXISTS idx_ad_views_user_watched ON ad_views(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ad_views_network_status ON ad_views(ad_network_id, is_completed);
CREATE INDEX IF NOT EXISTS idx_survey_history_user_completed ON survey_history(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_offerwall_history_user_completed ON offerwall_history(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_status ON referrals(referrer_id, status);
CREATE INDEX IF NOT EXISTS idx_referrals_referee_status ON referrals(referee_id, status);
CREATE INDEX IF NOT EXISTS idx_mission_progress_user_status ON mission_progress(user_id, status, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read_created ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_status_created ON support_tickets(user_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_device_sessions_user_status_expires ON device_sessions(user_id, status, expires_at);
CREATE INDEX IF NOT EXISTS idx_user_devices_user_last_seen ON user_devices(user_id, last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_created ON analytics_events(event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_event ON analytics_events(user_id, event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_logs_level_created ON system_logs(level, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_created ON audit_logs(action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_created ON audit_logs(resource_type, resource_id, created_at DESC);

-- Partial indexes for active records only
CREATE INDEX IF NOT EXISTS idx_users_active ON users(id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_profiles_public ON profiles(user_id) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_device_sessions_active ON device_sessions(user_id) WHERE status = 'active';

-- Expression indexes for JSONB queries
CREATE INDEX IF NOT EXISTS idx_transactions_metadata_gin ON transactions USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_fc_ledger_metadata_gin ON fc_ledger USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_mission_progress_progress_gin ON mission_progress USING GIN(progress);
CREATE INDEX IF NOT EXISTS idx_notifications_data_gin ON notifications USING GIN(data);
CREATE INDEX IF NOT EXISTS idx_admin_actions_metadata_gin ON admin_actions USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_fraud_detection_evidence_gin ON fraud_detection USING GIN(evidence);
CREATE INDEX IF NOT EXISTS idx_fraud_reports_evidence_gin ON fraud_reports USING GIN(evidence);

-- ============================================
-- VACUUM AND ANALYZE CONFIGURATION
-- ============================================

-- Autovacuum settings for high-traffic tables
ALTER TABLE transactions SET (
    autovacuum_vacuum_scale_factor = 0.01,
    autovacuum_analyze_scale_factor = 0.005,
    autovacuum_vacuum_threshold = 1000,
    autovacuum_analyze_threshold = 500
);

ALTER TABLE fc_ledger SET (
    autovacuum_vacuum_scale_factor = 0.01,
    autovacuum_analyze_scale_factor = 0.005,
    autovacuum_vacuum_threshold = 1000,
    autovacuum_analyze_threshold = 500
);

ALTER TABLE analytics_events SET (
    autovacuum_vacuum_scale_factor = 0.1,
    autovacuum_analyze_scale_factor = 0.05,
    autovacuum_vacuum_threshold = 10000,
    autovacuum_analyze_threshold = 5000
);

ALTER TABLE audit_logs SET (
    autovacuum_vacuum_scale_factor = 0.1,
    autovacuum_analyze_scale_factor = 0.05,
    autovacuum_vacuum_threshold = 10000,
    autovacuum_analyze_threshold = 5000
);

-- ============================================
-- STATISTICS UPDATE
-- ============================================

-- Update statistics for better query planning
ANALYZE users;
ANALYZE profiles;
ANALYZE wallets;
ANALYZE transactions;
ANALYZE fc_ledger;
ANALYZE settlements;
ANALYZE ad_views;
ANALYZE survey_history;
ANALYZE offerwall_history;
ANALYZE referrals;
ANALYZE mission_progress;
ANALYZE leaderboard_daily;
ANALYZE leaderboard_weekly;
ANALYZE leaderboard_monthly;
ANALYZE leaderboard_all_time;
ANALYZE notifications;
ANALYZE support_tickets;
ANALYZE analytics_events;
ANALYZE audit_logs;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Performance indexes and autovacuum tuning added
