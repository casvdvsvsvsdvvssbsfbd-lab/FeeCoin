-- ============================================
-- Add Levels and Ranks Tables
-- Version: 1.0.1
-- Description: Add missing level and rank configuration tables
-- ============================================

-- ============================================
-- TABLE: LEVELS
-- ============================================

CREATE TABLE IF NOT EXISTS levels (
    level INTEGER PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    xp_required INTEGER NOT NULL,
    rewards JSONB DEFAULT '{}'::jsonb,
    benefits JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_level CHECK (level >= 1 AND level <= 100),
    CONSTRAINT valid_xp_required CHECK (xp_required >= 0)
);

-- ============================================
-- TABLE: RANKS
-- ============================================

CREATE TABLE IF NOT EXISTS ranks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    min_fc DECIMAL(20, 2) NOT NULL,
    max_fc DECIMAL(20, 2) NOT NULL,
    benefits JSONB DEFAULT '{}'::jsonb,
    icon_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_min_fc CHECK (min_fc >= 0),
    CONSTRAINT valid_max_fc CHECK (max_fc > min_fc)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_levels_level ON levels(level);
CREATE INDEX IF NOT EXISTS idx_ranks_name ON ranks(name);
CREATE INDEX IF NOT EXISTS idx_ranks_min_fc ON ranks(min_fc);

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER update_levels_updated_at BEFORE UPDATE ON levels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ranks_updated_at BEFORE UPDATE ON ranks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranks ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Levels: All authenticated users can read
CREATE POLICY "Authenticated users can view levels" ON levels
    FOR SELECT TO authenticated USING (true);

-- Ranks: All authenticated users can read
CREATE POLICY "Authenticated users can view ranks" ON ranks
    FOR SELECT TO authenticated USING (true);

-- ============================================
-- GRANTS
-- ============================================

GRANT SELECT ON levels TO authenticated;
GRANT SELECT ON ranks TO authenticated;
GRANT ALL ON levels TO service_role;
GRANT ALL ON ranks TO service_role;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE levels IS 'Level configuration (1-100)';
COMMENT ON TABLE ranks IS 'Rank configuration (Bronze to Legend)';

-- ============================================
-- MIGRATION COMPLETE
-- ============================================