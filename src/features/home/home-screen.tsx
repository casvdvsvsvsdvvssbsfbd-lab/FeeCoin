'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigation } from '../../shared/hooks/use-navigation';
import { useAuthStore } from '../../lib/stores/auth-store';
import { useWalletStore } from '../../lib/stores/wallet-store';
import { useAppStore } from '../../lib/stores/app-store';
import { homeScreenDataService } from './services/home-data.service';
import { formatFC } from '../../lib/utils/format';

const EarnButton: React.FC = () => {
  const [isEarning, setIsEarning] = useState(false);
  const [earned, setEarned] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const user = useAuthStore((state) => state.user);
  const wallet = useWalletStore((state) => state);

  const handleEarn = async () => {
    if (isEarning || !user?.id) return;
    setIsEarning(true);
    setShowAnimation(true);

    try {
      const reward = await homeScreenDataService.trackAdView('banner', 'system', user.id);
      setEarned(reward);
    } catch (error) {
      console.error('Failed to earn:', error);
    }

    setTimeout(() => {
      setIsEarning(false);
      setShowAnimation(false);
    }, 1500);
  };

  return (
    <div className="relative flex items-center justify-center my-4">
      <motion.button
        onClick={handleEarn}
        whileTap={{ scale: 0.9 }}
        className={`
          w-40 h-40 rounded-full flex flex-col items-center justify-center
          bg-gradient-to-br from-[#00FF88] to-[#00d4aa]
          shadow-[0_0_60px_rgba(0,255,136,0.3)]
          ${isEarning ? 'animate-pulse' : ''}
          transition-all duration-300
        `}
      >
        <motion.span
          className="text-3xl font-black text-[#0A0E14]"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isEarning ? '✦' : '▶'}
        </motion.span>
        <span className="text-xs font-bold text-[#0A0E14]/70 mt-1">
          {isEarning ? 'EARNING...' : 'EARN'}
        </span>
      </motion.button>

      <AnimatePresence>
        {showAnimation && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -80 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute -top-4 text-xl font-black text-[#00FF88]"
          >
            +{formatFC(earned)} FC
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const HomeScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const user = useAuthStore((state) => state.profile);
  const wallet = useWalletStore((state) => state);
  const app = useAppStore((state) => state);
  const [recentRewards, setRecentRewards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      
      try {
        const data = await homeScreenDataService.loadHomeScreenData(user.id);
        setRecentRewards(data.recentRewards);
      } catch (error) {
        console.error('Failed to load home data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  const displayUser = {
    firstName: user?.first_name || 'User',
    lastName: user?.last_name || '',
    username: user?.username || 'user',
  };

  const displayWallet = {
    availableFC: wallet.balance,
    pendingFC: 0,
    energy: app.energy,
    maxEnergy: app.maxEnergy,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0E14]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E14] pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00FF88] to-[#00BFFF] flex items-center justify-center text-sm font-bold text-[#0A0E14]">
              {displayUser.firstName[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{displayUser.firstName} {displayUser.lastName}</p>
              <p className="text-xs text-white/40">@{displayUser.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
              <span className="text-sm">🔔</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
        {/* Balance Card */}
        <motion.div
          className="glass-card p-6 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Available Balance</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-[#f0b90b]">{formatFC(displayWallet.availableFC)}</span>
            <span className="text-sm font-bold text-[#f0b90b]/60">FC</span>
          </div>
          
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
            <div>
              <p className="text-[10px] text-white/40">Energy</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-20 h-1.5 rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#00FF88] to-[#00BFFF]"
                    initial={{ width: 0 }}
                    animate={{ width: `${displayWallet.energy}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-xs font-semibold text-white/70">{displayWallet.energy}%</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/40">Pending</p>
              <p className="text-xs font-semibold text-white/70">{formatFC(displayWallet.pendingFC)} FC</p>
            </div>
          </div>
        </motion.div>

        {/* Withdrawal Progress */}
        <motion.div
          className="glass-card p-4 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-white/40">Withdrawal Progress</p>
            <p className="text-xs font-semibold text-[#00FF88]">0%</p>
          </div>
          <div className="w-full h-2 rounded-full bg-white/5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#00FF88] to-[#f0b90b]"
            initial={{ width: 0 }}
            animate={{ width: `0%` }}
            transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
          />
        </div>
        <p className="text-[10px] text-white/30 mt-1">Withdrawal progress will appear here</p>
        </motion.div>

        {/* Earnings Row */}
        <motion.div
          className="flex gap-2 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { label: 'Today', value: 0, color: '#00FF88' },
            { label: 'Week', value: 0, color: '#00BFFF' },
            { label: 'Month', value: 0, color: '#f0b90b' },
          ].map((stat) => (
            <div key={stat.label} className="flex-1 glass-card p-3 text-center">
              <p className="text-[10px] text-white/40">{stat.label}</p>
              <p className="text-sm font-bold mt-1" style={{ color: stat.color }}>
                {formatFC(stat.value)}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Earn Button */}
        <EarnButton />

        {/* Quick Actions */}
        <motion.div
          className="flex gap-2 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[
            { icon: '🎁', label: 'Daily Bonus', color: '#00FF88' },
            { icon: '👥', label: 'Referral', color: '#00BFFF' },
            { icon: '🏆', label: 'Missions', color: '#f0b90b' },
          ].map((action) => (
            <div
              key={action.label}
              className="flex-1 glass-card p-3 flex flex-col items-center gap-2 cursor-pointer hover:bg-white/5 transition-all"
              onClick={() => action.label === 'Referral' ? navigate('referral') : action.label === 'Missions' ? navigate('missions') : {}}
            >
              <span className="text-xl">{action.icon}</span>
              <span className="text-[10px] font-semibold text-white/60">{action.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Recent Activity */}
        <div className="mb-4">
          <p className="section-title mb-3 px-1">Recent Activity</p>
          {recentRewards.length > 0 ? recentRewards.slice(0, 4).map((reward, i) => (
            <motion.div
              key={reward.id}
              className="glass-card p-3 mb-2 flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
            >
              <span className="text-lg">{reward.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{reward.description}</p>
                <p className="text-[10px] text-white/40">{reward.timestamp}</p>
              </div>
              <span className="text-xs font-bold text-[#00FF88]">+{formatFC(reward.amount)}</span>
            </motion.div>
          )) : (
            <div className="glass-card p-4 text-center text-white/40 text-xs">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
};