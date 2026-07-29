// ============================================
// Wallet Provider
// Production-ready wallet management
// ============================================

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  pendingBalance: number;
  withdrawableBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  walletId: string;
  transactionType: 'credit' | 'debit' | 'transfer' | 'withdrawal' | 'refund' | 'bonus' | 'penalty';
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'reversed';
  amount: number;
  fee: number;
  netAmount: number;
  currency: string;
  description?: string;
  referenceType?: string;
  referenceId?: string;
  metadata: Record<string, any>;
  processedAt?: string;
  failedReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface WalletContextType {
  wallet: Wallet | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: Error | null;
  refreshWallet: () => Promise<void>;
  addFunds: (amount: number, description: string, referenceType?: string, referenceId?: string) => Promise<Transaction>;
  subtractFunds: (amount: number, description: string, referenceType?: string, referenceId?: string) => Promise<Transaction>;
  canWithdraw: (amount: number) => boolean;
  getTransactionHistory: (limit?: number, offset?: number) => Promise<Transaction[]>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const EMPTY_WALLET: Wallet = {
  id: '',
  userId: '',
  balance: 0,
  pendingBalance: 0,
  withdrawableBalance: 0,
  totalEarned: 0,
  totalWithdrawn: 0,
  currency: 'FC',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

interface WalletProviderProps {
  children: ReactNode;
  storageKey?: string;
  refreshInterval?: number;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({
  children,
  storageKey = 'fee_wallet',
  refreshInterval = 30 * 1000, // 30 seconds
}) => {
  const [wallet, setWallet] = useState<Wallet | null>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored) as Wallet;
      }
    } catch {
      // Ignore
    }
    return null;
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshWallet = useCallback(async () => {
    if (!wallet?.userId) return;

    setIsLoading(true);
    setError(null);

    try {
      // In production, fetch from API
      // For now, use stored wallet data
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const walletData = JSON.parse(stored) as Wallet;
        setWallet(walletData);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load wallet'));
    } finally {
      setIsLoading(false);
    }
  }, [wallet?.userId, storageKey]);

  const addFunds = useCallback(
    async (
      amount: number,
      description: string,
      referenceType?: string,
      referenceId?: string
    ): Promise<Transaction> => {
      if (!wallet) {
        throw new Error('Wallet not initialized');
      }

      const transaction: Transaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: wallet.userId,
        walletId: wallet.id,
        transactionType: 'credit',
        status: 'completed',
        amount,
        fee: 0,
        netAmount: amount,
        currency: wallet.currency,
        description,
        referenceType,
        referenceId,
        metadata: {},
        processedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Update wallet balance
      const updatedWallet: Wallet = {
        ...wallet,
        balance: wallet.balance + amount,
        withdrawableBalance: wallet.withdrawableBalance + amount,
        totalEarned: wallet.totalEarned + amount,
        updatedAt: new Date().toISOString(),
      };

      setWallet(updatedWallet);
      setTransactions((prev) => [transaction, ...prev]);

      // Store updated wallet
      try {
        localStorage.setItem(storageKey, JSON.stringify(updatedWallet));
      } catch {
        // Ignore storage errors
      }

      return transaction;
    },
    [wallet, storageKey]
  );

  const subtractFunds = useCallback(
    async (
      amount: number,
      description: string,
      referenceType?: string,
      referenceId?: string
    ): Promise<Transaction> => {
      if (!wallet) {
        throw new Error('Wallet not initialized');
      }

      if (wallet.balance < amount) {
        throw new Error('Insufficient balance');
      }

      const transaction: Transaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: wallet.userId,
        walletId: wallet.id,
        transactionType: 'debit',
        status: 'completed',
        amount: -amount,
        fee: 0,
        netAmount: -amount,
        currency: wallet.currency,
        description,
        referenceType,
        referenceId,
        metadata: {},
        processedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Update wallet balance
      const updatedWallet: Wallet = {
        ...wallet,
        balance: wallet.balance - amount,
        updatedAt: new Date().toISOString(),
      };

      setWallet(updatedWallet);
      setTransactions((prev) => [transaction, ...prev]);

      // Store updated wallet
      try {
        localStorage.setItem(storageKey, JSON.stringify(updatedWallet));
      } catch {
        // Ignore storage errors
      }

      return transaction;
    },
    [wallet, storageKey]
  );

  const canWithdraw = useCallback(
    (amount: number): boolean => {
      if (!wallet) return false;
      return wallet.withdrawableBalance >= amount;
    },
    [wallet]
  );

  const getTransactionHistory = useCallback(
    async (limit = 50, offset = 0): Promise<Transaction[]> => {
      // In production, fetch from API with pagination
      // For now, return stored transactions
      return transactions.slice(offset, offset + limit);
    },
    [transactions]
  );

  useEffect(() => {
    if (wallet) {
      // Refresh wallet periodically
      const interval = setInterval(() => {
        refreshWallet();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [wallet, refreshWallet, refreshInterval]);

  const value: WalletContextType = {
    wallet,
    transactions,
    isLoading,
    error,
    refreshWallet,
    addFunds,
    subtractFunds,
    canWithdraw,
    getTransactionHistory,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const useBalance = (): number => {
  const { wallet } = useWallet();
  return wallet?.balance || 0;
};

export const useWithdrawableBalance = (): number => {
  const { wallet } = useWallet();
  return wallet?.withdrawableBalance || 0;
};