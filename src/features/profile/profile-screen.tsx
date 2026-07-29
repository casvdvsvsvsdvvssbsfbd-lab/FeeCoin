'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigation } from '../../shared/hooks/use-navigation';
import { mockUser } from '../../shared/lib/mock-data';

export const ProfileScreen: React.FC = () => {
  const { navigate } = useNavigation();

  const menuItems = [
    { icon: '🌐', label: 'Language', value: 'English', action: () => navigate('language') },
    { icon: '📍', label: 'Country', value: 'United States', action: () => navigate('country') },
    { icon: '🎨', label: 'Theme', value: 'Dark', action: () => {} },
    { icon: '🔔', label: 'Notifications', value: 'On', action: () => navigate('notifications') },
    { icon: '👥', label: 'Referral', value: '', action: () => navigate('referral') },
    { icon: '🏆', label: 'Missions', value: '', action: () => navigate('missions') },
    { icon: '❓', label: 'Support', value: '', action: () => navigate('support') },
    { icon: '📄', label: 'FAQ', value: '', action: () => {} },
    { icon: '📜', label: 'Terms of Service', value: '', action: () => {} },
    { icon: '🔒', label: 'Privacy Policy', value: '', action: () => {} },
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
            {mockUser.firstName[0]}
          </div>
          <div className="flex-1">
            <p className="text-base font-bold text-white">{mockUser.firstName} {mockUser.lastName}</p>
            <p className="text-xs text-white/40">@{mockUser.username}</p>
            <div className="flex items-center gap-2 mt-2">
              {mockUser.isPremium && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0b90b]/20 text-[#f0b90b] font-semibold">
                  Premium
                </span>
              )}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50">ID: {mockUser.id}</span>
            </div>
          </div>
        </motion.div>

        {/* Menu */}
        <div className="space-y-1">
          {menuItems.map((item, i) => (
            <motion.button
              key={item.label}
              onClick={item.action}
              className="w-full glass-card p-3 flex items-center gap-3 text-left"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
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