import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Player, StakingContract, ReferralLog, Transaction, WithdrawalRequest } from '../types';
import { getOrCreatePlayer, getActiveStakings, updatePlayerBalance, getReferralLogs, getTransactions, createWithdrawalRequest } from '../lib/supabase';

interface GameState {
  feeBalance: number;
  stars: number;
  vipPass: boolean;
  miningActive: boolean;
  miningEndTime: number | null;
  claimedRewards: number[];
  completedTasks: string[];
  appStartTime: number;
}

interface PlayerState {
  player: Player | null;
  activeStakes: StakingContract[];
  loadingStakes: boolean;
  referralLogs: ReferralLog[];
  referralLink: string;
  transactions: Transaction[];
  loadingTx: boolean;
  coinBalance: number;
}

interface GameContextType extends GameState {
  updateBalance: (amount: number) => void;
  claimMiningRewards: () => void;
  startMining: () => void;
  claimDailyReward: (day: number) => void;
  canClaimDailyReward: (day: number) => boolean;
  completeTask: (taskId: string) => void;
  isTaskCompleted: (taskId: string) => boolean;
  player: Player | null;
  activeStakes: StakingContract[];
  loadingStakes: boolean;
  referralLogs: ReferralLog[];
  referralLink: string;
  transactions: Transaction[];
  loadingTx: boolean;
  coinBalance: number;
  stakeBalance: (amount: number) => Promise<void>;
  refreshPlayer: () => Promise<void>;
  copyReferralLink: () => Promise<void>;
  requestWithdrawal: (amount: number, method: WithdrawalRequest['method'], accountDetails: string) => Promise<void>;
  convertCoinsToUzs: (coins: number) => Promise<void>;
  convertCoinsToRub: (coins: number) => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('gameState');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        feeBalance: parsed.feeBalance || 153490751,
        stars: parsed.stars || 236,
        vipPass: parsed.vipPass || true,
        miningActive: parsed.miningActive || false,
        miningEndTime: parsed.miningEndTime || null,
        claimedRewards: parsed.claimedRewards || [1, 2],
        completedTasks: parsed.completedTasks || [],
        appStartTime: parsed.appStartTime || Date.now()
      };
    }
    return {
      feeBalance: 153490751,
      stars: 236,
      vipPass: true,
      miningActive: false,
      miningEndTime: null,
      claimedRewards: [1, 2],
      completedTasks: [],
      appStartTime: Date.now()
    };
  });

  const [playerState, setPlayerState] = useState<PlayerState>({
    player: null,
    activeStakes: [],
    loadingStakes: false,
    referralLogs: [],
    referralLink: '',
    transactions: [],
    loadingTx: false,
    coinBalance: 0
  });

  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(state));
  }, [state]);

  const refreshPlayer = async () => {
    // This will be called from App.tsx after getting Telegram user data
  };

  const copyReferralLink = async () => {
    if (!playerState.player) return;
    
const viteEnv = typeof import.meta !== 'undefined' ? (import.meta as any)?.env : undefined;
    const botUsername = viteEnv?.VITE_TELEGRAM_BOT_NAME || 'feecash_bot';
    const link = `https://t.me/${botUsername}?start=ref_${playerState.player.telegram_id}`;
    try {
      await navigator.clipboard.writeText(link);
      setPlayerState(prev => ({ ...prev, referralLink: link }));
    } catch (err) {
      console.error('Failed to copy referral link:', err);
    }
  };

  const requestWithdrawal = async (amount: number, method: WithdrawalRequest['method'], accountDetails: string) => {
    if (!playerState.player) {
      throw new Error('Player not found');
    }

    setPlayerState(prev => ({ ...prev, loadingTx: true }));
    
    try {
      await createWithdrawalRequest(playerState.player.id, amount, method, accountDetails);
      
      // Update player balance
      const newBalance = playerState.player.fee_balance - amount;
      await updatePlayerBalance(
        playerState.player.id,
        newBalance,
        playerState.player.pending_fee + amount,
        playerState.player.lifetime_earnings_fee
      );

      setPlayerState(prev => ({
        ...prev,
        player: prev.player ? { ...prev.player, fee_balance: newBalance, pending_fee: prev.player.pending_fee + amount } : null,
        loadingTx: false
      }));

      setState(prev => ({
        ...prev,
        feeBalance: newBalance
      }));
    } catch (err) {
      setPlayerState(prev => ({ ...prev, loadingTx: false }));
      throw err;
    }
  };

  const convertCoinsToUzs = async (coins: number) => {
    if (!playerState.player) throw new Error('Player not found');
    
    const feeAmount = coins * 10;
    await updatePlayerBalance(
      playerState.player.id,
      playerState.player.fee_balance + feeAmount,
      playerState.player.pending_fee,
      playerState.player.lifetime_earnings_fee + feeAmount
    );

    const newBalance = playerState.player.fee_balance + feeAmount;
    setPlayerState(prev => ({
      ...prev,
      player: prev.player ? { ...prev.player, fee_balance: newBalance, lifetime_earnings_fee: prev.player.lifetime_earnings_fee + feeAmount } : null,
      coinBalance: prev.coinBalance - coins
    }));

    setState(prev => ({
      ...prev,
      feeBalance: newBalance
    }));
  };

  const convertCoinsToRub = async (coins: number) => {
    if (!playerState.player) throw new Error('Player not found');
    
    const feeAmount = Math.floor(coins * 3.5);
    await updatePlayerBalance(
      playerState.player.id,
      playerState.player.fee_balance + feeAmount,
      playerState.player.pending_fee,
      playerState.player.lifetime_earnings_fee + feeAmount
    );

    const newBalance = playerState.player.fee_balance + feeAmount;
    setPlayerState(prev => ({
      ...prev,
      player: prev.player ? { ...prev.player, fee_balance: newBalance, lifetime_earnings_fee: prev.player.lifetime_earnings_fee + feeAmount } : null,
      coinBalance: prev.coinBalance - coins
    }));

    setState(prev => ({
      ...prev,
      feeBalance: newBalance
    }));
  };

  const updateBalance = (amount: number) => {
    setState(prev => ({ ...prev, feeBalance: prev.feeBalance + amount }));
  };

  const startMining = () => {
    const endTime = Date.now() + (24 * 60 * 60 * 1000);
    setState(prev => ({ 
      ...prev, 
      miningActive: true, 
      miningEndTime: endTime 
    }));
  };

  const claimMiningRewards = () => {
    if (!state.miningActive || !state.miningEndTime) return;
    
    const now = Date.now();
    if (now >= state.miningEndTime) {
      const reward = 500000;
      updateBalance(reward);
      setState(prev => ({ 
        ...prev, 
        miningActive: false, 
        miningEndTime: null 
      }));
    }
  };

  const canClaimDailyReward = (day: number): boolean => {
    return !state.claimedRewards.includes(day) && day === 3;
  };

  const claimDailyReward = (day: number) => {
    if (!canClaimDailyReward(day)) return;
    
    const rewards: { [key: number]: number } = {
      1: 100,
      2: 200,
      3: 500,
      4: 1000,
      5: 1500,
      6: 3000,
      7: 7000,
      8: 10050,
      9: 50000
    };

    const reward = rewards[day] || 0;
    updateBalance(reward);
    setState(prev => ({
      ...prev,
      claimedRewards: [...prev.claimedRewards, day]
    }));
  };

  const completeTask = (taskId: string) => {
    if (!state.completedTasks.includes(taskId)) {
      setState(prev => ({
        ...prev,
        completedTasks: [...prev.completedTasks, taskId]
      }));
    }
  };

  const isTaskCompleted = (taskId: string): boolean => {
    return state.completedTasks.includes(taskId);
  };

  const stakeBalance = async (amount: number) => {
    if (!playerState.player) {
      throw new Error('Player not found');
    }

    const newBalance = playerState.player.fee_balance - amount;
    await updatePlayerBalance(
      playerState.player.id,
      newBalance,
      playerState.player.pending_fee,
      playerState.player.lifetime_earnings_fee
    );

    setPlayerState(prev => ({
      ...prev,
      player: prev.player ? { ...prev.player, fee_balance: newBalance } : null
    }));

    setState(prev => ({
      ...prev,
      feeBalance: newBalance
    }));
  };

  return (
    <GameContext.Provider value={{
      ...state,
      updateBalance,
      claimMiningRewards,
      startMining,
      claimDailyReward,
      canClaimDailyReward,
      completeTask,
      isTaskCompleted,
      player: playerState.player,
      activeStakes: playerState.activeStakes,
      loadingStakes: playerState.loadingStakes,
      referralLogs: playerState.referralLogs,
      referralLink: playerState.referralLink,
      transactions: playerState.transactions,
      loadingTx: playerState.loadingTx,
      coinBalance: playerState.coinBalance,
      stakeBalance,
      refreshPlayer,
      copyReferralLink,
      requestWithdrawal,
      convertCoinsToUzs,
      convertCoinsToRub
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

export const usePlayer = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('usePlayer must be used within GameProvider');
  }
  return {
    player: context.player,
    activeStakes: context.activeStakes,
    loadingStakes: context.loadingStakes,
    referralLogs: context.referralLogs,
    referralLink: context.referralLink,
    transactions: context.transactions,
    loadingTx: context.loadingTx,
    coinBalance: context.coinBalance,
    stakeBalance: context.stakeBalance,
    refreshPlayer: context.refreshPlayer,
    copyReferralLink: context.copyReferralLink,
    requestWithdrawal: context.requestWithdrawal,
    convertCoinsToUzs: context.convertCoinsToUzs,
    convertCoinsToRub: context.convertCoinsToRub
  };
};
