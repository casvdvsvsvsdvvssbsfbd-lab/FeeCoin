'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigation } from '../../shared/hooks/use-navigation';

export const WelcomeScreen: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <div className="fixed inset-0 bg-[#0A0E14] flex flex-col items-center justify-center px-6">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00FF88]/5 via-transparent to-transparent pointer-events-none" />
      
      <motion.div
        className="flex-1 flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated Logo */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, -3, 3, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-28 h-28 rounded-[36px] bg-gradient-to-br from-[#00FF88] to-[#00BFFF] flex items-center justify-center shadow-[0_0_50px_rgba(0,255,136,0.3)] mb-8"
        >
          <span className="text-5xl font-black text-[#0A0E14]">F</span>
        </motion.div>

        <motion.h1
          className="text-4xl font-black text-white mb-3 text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Welcome to Fee
        </motion.h1>

        <motion.p
          className="text-base text-white/50 text-center max-w-xs leading-relaxed"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Turn your free time into real rewards. Watch, complete tasks, and earn FC tokens.
        </motion.p>

        {/* Feature highlights */}
        <motion.div
          className="flex flex-col gap-3 mt-10 w-full max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          {[
            { icon: '📺', text: 'Watch ads & earn' },
            { icon: '📋', text: 'Complete surveys' },
            { icon: '👥', text: 'Refer friends' },
            { icon: '🏆', text: 'Climb leaderboards' },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 glass-card p-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm text-white/70">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom */}
      <motion.div
        className="w-full pb-8 flex flex-col gap-3"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <button
          onClick={() => navigate('language')}
          className="w-full h-14 rounded-2xl bg-[#00FF88] text-[#0A0E14] font-bold text-base shadow-[0_0_30px_rgba(0,255,136,0.3)] hover:shadow-[0_0_40px_rgba(0,255,136,0.5)] transition-all duration-300 active:scale-95"
        >
          Get Started
        </button>

        <button
          onClick={() => navigate('language')}
          className="text-sm text-white/40 hover:text-white/60 transition-colors py-2"
        >
          I already have an account
        </button>
      </motion.div>
    </div>
  );
};