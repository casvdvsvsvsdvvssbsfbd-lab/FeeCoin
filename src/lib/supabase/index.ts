// ============================================
// Supabase Database Functions
// Game-related database operations
// ============================================

import { supabase } from './client'
import type { Player, StakingContract, Transaction, WithdrawalRequest, ReferralLog } from '@/types'

export async function getOrCreatePlayer(telegramId: number, username: string, firstName: string): Promise<Player | null> {
  try {
    const { data: existing } = await (supabase as any)
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .maybeSingle()

    if (existing) {
      return existing as unknown as Player
    }

    const { data: newPlayer, error } = await (supabase as any)
      .from('users')
      .insert({
        telegram_id: String(telegramId),
        username,
        first_name: firstName,
      })
      .select()
      .single()

    if (error) throw error
    return newPlayer as unknown as Player
  } catch (error) {
    console.error('Error getting or creating player:', error)
    return null
  }
}

export async function getActiveStakings(playerId: string): Promise<StakingContract[]> {
  try {
    const { data, error } = await (supabase as any)
      .from('staking_contracts')
      .select('*')
      .eq('player_id', playerId)
      .in('status', ['active', 'locked'])

    if (error) throw error
    return (data || []) as unknown as StakingContract[]
  } catch (error) {
    console.error('Error fetching active stakes:', error)
    return []
  }
}

export async function updatePlayerBalance(
  playerId: string,
  newBalance: number,
  newPending: number,
  lifetimeEarnings: number
): Promise<void> {
  try {
    const { error } = await (supabase as any)
      .from('users')
      .update({
        fee_balance: newBalance,
        pending_fee: newPending,
        lifetime_earnings_fee: lifetimeEarnings,
      })
      .eq('id', playerId)

    if (error) throw error
  } catch (error) {
    console.error('Error updating player balance:', error)
    throw error
  }
}

export async function getReferralLogs(referrerId: string): Promise<ReferralLog[]> {
  try {
    const { data, error } = await (supabase as any)
      .from('referral_logs')
      .select('*')
      .eq('referrer_id', referrerId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []) as unknown as ReferralLog[]
  } catch (error) {
    console.error('Error fetching referral logs:', error)
    return []
  }
}

export async function getTransactions(playerId: string): Promise<Transaction[]> {
  try {
    const { data, error } = await (supabase as any)
      .from('transactions')
      .select('*')
      .eq('player_id', playerId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    return (data || []) as unknown as Transaction[]
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return []
  }
}

export async function createWithdrawalRequest(
  playerId: string,
  amount: number,
  method: WithdrawalRequest['method'],
  accountDetails: string
): Promise<void> {
  try {
    const { error } = await (supabase as any)
      .from('withdrawal_requests')
      .insert({
        player_id: playerId,
        amount_fee: amount,
        method,
        account_details: accountDetails,
        status: 'pending',
      })

    if (error) throw error
  } catch (error) {
    console.error('Error creating withdrawal request:', error)
    throw error
  }
}

export { supabase } from './client'