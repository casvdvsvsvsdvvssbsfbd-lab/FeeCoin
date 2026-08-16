-- ============================================
-- Add Coins Function
-- ============================================
-- This function atomically adds coins to user's wallet and creates transaction record

CREATE OR REPLACE FUNCTION add_coins(
  p_user_id UUID,
  p_amount INTEGER,
  p_source TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  -- Update existing wallet
  UPDATE wallets
  SET balance = balance + p_amount,
      total_earned = total_earned + p_amount,
      updated_at = NOW()
  WHERE user_id = p_user_id
  RETURNING balance INTO v_new_balance;
  
  -- If wallet doesn't exist, create it
  IF NOT FOUND THEN
    INSERT INTO wallets (user_id, balance, total_earned)
    VALUES (p_user_id, p_amount, p_amount)
    RETURNING balance INTO v_new_balance;
  END IF;
  
  -- Create transaction record
  INSERT INTO transactions (user_id, amount, type, source, status)
  VALUES (p_user_id, p_amount, 'credit', p_source, 'completed');
  
  RETURN v_new_balance;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION add_coins(UUID, INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION add_coins(UUID, INTEGER, TEXT) TO service_role;