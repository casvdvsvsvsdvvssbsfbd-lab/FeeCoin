'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigation } from '../../shared/hooks/use-navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { profileDataService, type UserStats } from './services/profile-data.service';
import { formatFC } from '@/lib/utils/format';

export const ProfileScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const authLoading = useAuthStore((s) => s.isLoading);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = user?.id || user?.user_id || '';

  const load = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await profileDataService.hydrateProfile(userId);
    if (data) {
      setStats(data.stats);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (!authLoading) {
      load();
    }
  }, [authLoading, userId, load]);

  const firstName = profile?.first_name || user?.firstName || user?.username || 'User';
  const lastName = profile?.last_name || user?.lastName || '';
  const username = profile?.username || user?.username || 'user';
  const isPremium = user?.isPremium || profile?.is_premium || false;
  const displayId = user?.telegramId || user?.id || profile?.user_id || '';

  const menuItems = [
    { icon: '🌐', label: 'Language', value: profile?.language_code ? (profile.language_code === 'uz' ? 'O\'zbekcha' : profile.language_code === 'ru' ? 'Русский' : 'English') : 'English', action: () => navigate('language') },
    { icon: '📍', label: 'Country', value: profile?.country_code || 'US', action: () => navigate('country') },
    { icon: '🎨', label: 'Theme', value: 'Dark', action: () => {} },
    { icon: '🔔', label: 'Notifications', value: 'On', action: () => navigate('notifications') },
    { icon: '👥', label: 'Referral', value: '', action: () => navigate('referral') },
    { icon: '🏆', label: 'Missions', value: '', action: () => navigate('missions') },
    { icon: '❓', label: 'Support', value: '', action: () => navigate('support') },
    { icon: '📄', label: 'FAQ', value: '', action: () => {} },
    { icon: '📜', label: 'Terms of Service', value: '', action: () => {} },
    { icon: '🔒', label: 'Privacy Policy', value: '', action: () => {} },
  ];

  const statCards = [
    { label: 'Total Earned', value: formatFC(stats?.totalEarned || 0), color: '#00FF88' },
    { label: 'Tasks', value: String(stats?.tasksCompleted || 0), color: '#00BFFF' },
    { label: 'Referrals', value: String(stats?.referralsCount || 0), color: '#f0b90b' },
    { label: 'Level', value: String(stats?.level || 1), color: '#FF3366' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0E14] pb-24">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-black text-white">Profile</h1>
      </div>

      <div className="px-4 space-y-4">
        {/* Profile Card */}
        <motion.div
          className="glass-card p-5 flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00FF88] to-[#00BFFF] flex items-center justify-center text-2xl font-bold text-[#0A0E14]">
            {(firstName || 'U')[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-base font-bold text-white">{firstName} {lastName}</p>
            <p className="text-xs text-white/40">@{username}</p>
            <div className="flex items-center gap-2 mt-2">
              {isPremium && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0b90b]/20 text-[#f0b90b] font-semibold">
                  Premium
                </span>
              )}
              {displayId && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50">ID: {displayId}</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              className="glass-card p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.05 }}
            >
              <p className="text-[10px] text-white/40">{s.label}</p>
              <p className="text-lg font-black mt-1" style={{ color: s.color }}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {loading && (
          <div className="glass-card p-4 flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-white/40">Ma'lumot yuklanmoqda...</p>
          </div>
        )}

        {/* Menu */}
        <div className="space-y-1">
          {menuItems.map((item, i) => (
            <motion.button
              key={item.label}
              onClick={item.action}
              className="w-full glass-card p-3 flex items-center gap-3 text-left"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.03 }}
            >
              <span className="text-base">{item.icon}</span>
              <span className="flex-1 text-sm font-medium text-white/80">{item.label}</span>
              {item.value && (
                <span className="text-xs text-white/40">{item.value}</span>
              )}
              <svg className="w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          ))}
        </div>

        {/* Version & Logout */}
        <div className="pt-4 pb-8">
          <p className="text-center text-[10px] text-white/20 mb-4">Version 1.0.0</p>
          <button className="w-full py-3 rounded-2xl bg-[#FF3366]/10 text-[#FF3366] text-sm font-semibold active:scale-95 transition-all">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};
