'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigation } from '../../shared/hooks/use-navigation';

export const SplashScreen: React.FC = () => {
  const { navigate } = useNavigation();

useEffect(() => {
    const timer = setTimeout(() => navigate('welcome'), 2500);
    // Hard fallback: if the normal navigation somehow doesn't fire (e.g. a
    // stale/blocked store), force the app off the splash screen so it never
    // sits on it forever.
    const safety = setTimeout(() => navigate('welcome'), 5000);
    return () => {
      clearTimeout(timer);
      clearTimeout(safety);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0A0E14] z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center"
      >
        {/* Animated Fee Logo */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-24 h-24 mx-auto mb-6 rounded-[32px] bg-gradient-to-br from-[#00FF88] to-[#00BFFF] flex items-center justify-center shadow-[0_0_40px_rgba(0,255,136,0.3)]"
        >
          <span className="text-4xl font-black text-[#0A0E14]">F</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-3xl font-black text-white mb-2"
        >
          Fee
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-sm text-white/40 font-medium tracking-widest uppercase"
        >
          Watch . Earn . Repeat
        </motion.p>
      </motion.div>

      {/* Animated loading dots */}
      <motion.div
        className="absolute bottom-12 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-[#00FF88]"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </motion.div>
    </div>
  );
};