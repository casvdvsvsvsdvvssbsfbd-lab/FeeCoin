'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { mockWallet, mockTransactions, formatFC } from '../../shared/lib/mock-data';

export const WalletScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'history' | 'withdrawals'>('history');

  return (
    <div className="min-h-screen bg-[#0A0E14] pb-24">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-black text-white">Wallet</h1>
      </div>

      <div className="px-4 space-y-4">
        {/* Balance Card */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs text-white/40 uppercase tracking-wider">Available Balance</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-black text-[#f0b90b]">{formatFC(mockWallet.availableFC)}</span>
            <span className="text-sm font-bold text-[#f0b90b]/60">FC</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/5">
            <div>
              <p className="text-[10px] text-white/40">Pending</p>
              <p className="text-sm font-bold text-white/80">{formatFC(mockWallet.pendingFC)} FC</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/40">Total Earned</p>
              <p className="text-sm font-bold text-[#00FF88]">{formatFC(mockWallet.totalEarned)} FC</p>
            </div>
          </div>
        </motion.div>

        {/* Withdrawal Progress */}
        <motion.div
          className="glass-card p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-white/40">Withdrawal Progress</p>
            <p className="text-xs font-bold text-[#00FF88]">{mockWallet.withdrawProgress}%</p>
          </div>
          <div className="w-full h-2 rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#00FF88] to-[#f0b90b]"
              initial={{ width: 0 }}
              animate={{ width: `${mockWallet.withdrawProgress}%` }}
              transition={{ duration: 1.5, delay: 0.3 }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-[10px] text-white/30">Est. unlock: {mockWallet.estimatedUnlockDate}</p>
            <p className="text-[10px] text-white/30">Total withdrawn: {formatFC(mockWallet.totalWithdrawn)} FC</p>
          </div>
        </motion.div>

        {/* Withdraw Button */}
        <motion.button
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#00FF88] to-[#00d4aa] text-[#0A0E14] font-bold text-sm shadow-[0_0_20px_rgba(0,255,136,0.2)] active:scale-95 transition-all"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Withdraw Funds
        </motion.button>

        {/* Tabs */}
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('history')}
            className={`filter-tab ${activeTab === 'history' ? 'active' : ''}`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`filter-tab ${activeTab === 'withdrawals' ? 'active' : ''}`}
          >
            Withdrawals
          </button>
        </div>

        {/* Transactions */}
        <div className="space-y-2">
          {mockTransactions.map((tx, i) => (
            <motion.div
              key={tx.id}
              className="glass-card p-3 flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.03 }}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
                tx.type === 'reward' ? 'bg-[#00FF88]/10' :
                tx.type === 'withdrawal' ? 'bg-[#FF3366]/10' :
                tx.type === 'referral' ? 'bg-[#00BFFF]/10' : 'bg-[#f0b90b]/10'
              }`}>
                {tx.type === 'reward' ? '📺' : tx.type === 'withdrawal' ? '💳' : tx.type === 'referral' ? '👥' : '🎁'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{tx.description}</p>
                <p className="text-[10px] text-white/40">{tx.timestamp}</p>
              </div>
              <div className="text-right">
                <p className={`text-xs font-bold ${
                  tx.type === 'withdrawal' ? 'text-[#FF3366]' : 'text-[#00FF88]'
                }`}>
                  {tx.type === 'withdrawal' ? '-' : '+'}{formatFC(tx.amount)}
                </p>
                <p className={`text-[10px] ${
                  tx.status === 'completed' ? 'text-[#00FF88]' : 
                  tx.status === 'pending' ? 'text-[#f0b90b]' : 'text-[#FF3366]'
                }`}>{tx.status}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};