'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigation } from '../../shared/hooks/use-navigation';

export const PermissionsScreen: React.FC = () => {
  const { navigate } = useNavigation();

  const permissions = [
    { icon: '🔔', title: 'Notifications', desc: 'Get notified about rewards, missions, and friends joining' },
    { icon: '📍', title: 'Location', desc: 'To show region-specific offers and content' },
    { icon: '📱', title: 'App Tracking', desc: 'To verify ad completions and prevent fraud' },
  ];

  return (
    <div className="fixed inset-0 bg-[#0A0E14] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-[#00FF88] to-[#00BFFF] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,255,136,0.3)]">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-2xl font-black text-white mb-2">One Last Step</h1>
          <p className="text-sm text-white/50 max-w-xs mx-auto">
            Allow permissions to get the best experience
          </p>
        </motion.div>

        <motion.div
          className="w-full space-y-3 max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {permissions.map((perm, i) => (
            <motion.div
              key={perm.title}
              className="glass-card p-4 flex items-center gap-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <span className="text-xl">{perm.icon}</span>
              <div>
                <p className="text-sm font-semibold text-white">{perm.title}</p>
                <p className="text-xs text-white/50">{perm.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="px-6 pb-8"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <button
          onClick={() => navigate('home')}
          className="w-full h-14 rounded-2xl bg-[#00FF88] text-[#0A0E14] font-bold text-base shadow-[0_0_30px_rgba(0,255,136,0.3)] active:scale-95 transition-all"
        >
          Continue to App
        </button>
        <button
          onClick={() => navigate('home')}
          className="w-full text-center text-xs text-white/30 py-3 mt-2"
        >
          Skip for now
        </button>
      </motion.div>
    </div>
  );
};