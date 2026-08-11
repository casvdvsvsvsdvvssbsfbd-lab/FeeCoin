-- ============================================
-- Fix Transactions Constraint Conflict
-- Version: 1.0.4
-- Description:
--   The `transactions` table had two conflicting CHECK constraints on `amount`:
--     - `valid_transaction_amount` CHECK (amount <> 0)   [from migration 00000]
--     - `check_amount_positive`   CHECK (amount > 0)     [added manually, NOT in any migration]
--
--   `check_amount_positive` blocks legitimate DEBIT transactions (negative amounts)
--   that the app's financial logic relies on (e.g. withdrawal_fee, staking_deposit).
--
--   This migration removes the conflicting `check_amount_positive` constraint so
--   the intended `amount <> 0` semantics (allowing both credits and debits) is restored.
-- ============================================

ALTER TABLE transactions
    DROP CONSTRAINT IF EXISTS check_amount_positive;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
