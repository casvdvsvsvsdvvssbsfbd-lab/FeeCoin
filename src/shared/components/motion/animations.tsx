// ============================================
// Premium Motion Design System
// Apple/Linear/Telegram inspired animations
// ============================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue, useSpring, useTransform, Variants } from 'framer-motion';

// ============================================
// Animation Variants
// ============================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

export const springUp: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25, mass: 0.8 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.15 } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export const bounceIn: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 12, mass: 0.5 },
  },
};

export const pulseGlow: Variants = {
  initial: { boxShadow: '0 0 0 rgba(59,130,246,0)' },
  animate: {
    boxShadow: ['0 0 0 rgba(59,130,246,0)', '0 0 20px rgba(59,130,246,0.3)', '0 0 0 rgba(59,130,246,0)'],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
};

// ============================================
// Animated Components
// ============================================

// Animated counter with spring physics
export const AnimatedCounter: React.FC<{
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  format?: boolean;
  onComplete?: () => void;
}> = ({ value, duration = 800, decimals = 0, prefix = '', suffix = '', className = '', format = true, onComplete }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const rafRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const startValueRef = useRef(0);

  useEffect(() => {
    startValueRef.current = displayValue;
    startTimeRef.current = performance.now();

    const animate = (time: number) => {
      if (!startTimeRef.current) return;
      const elapsed = time - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValueRef.current + (value - startValueRef.current) * eased;
      setDisplayValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
        onComplete?.();
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, duration]);

  const formatted = format
    ? displayValue.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : displayValue.toFixed(decimals);

  return <span className={className}>{prefix}{formatted}{suffix}</span>;
};

// FC Coin animation (flying coins)
export const FlyingCoins: React.FC<{
  count?: number;
  active: boolean;
  onComplete?: () => void;
}> = ({ count = 8, active, onComplete }) => {
  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: count }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={{
                x: '50%',
                y: '50%',
                opacity: 1,
                scale: 0,
              }}
              animate={{
                x: `${30 + Math.random() * 40}%`,
                y: `${10 + Math.random() * 30}%`,
                opacity: 0,
                scale: [0, 1.5, 1, 0],
                rotate: [0, 180, 360],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.8 + Math.random() * 0.4,
                delay: i * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              onAnimationComplete={i === count - 1 ? onComplete : undefined}
            >
              {['🪙', '✨', '💎', '⭐', '🌟', '💫', '⚡', '🔥'][i % 8]}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

// Confetti celebration
export const Confetti: React.FC<{
  active: boolean;
  onComplete?: () => void;
}> = ({ active, onComplete }) => {
  const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444', '#6366F1', '#14B8A6'];

  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-sm"
              style={{ backgroundColor: colors[i % colors.length] }}
              initial={{
                x: '50%',
                y: '50%',
                opacity: 1,
                rotate: 0,
              }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${100 + Math.random() * 20}%`,
                opacity: [1, 1, 0],
                rotate: Math.random() * 720,
                scale: [1, 0.5, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.5 + Math.random() * 1,
                delay: Math.random() * 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              onAnimationComplete={i === 39 ? onComplete : undefined}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

// Level up animation
export const LevelUpAnimation: React.FC<{
  level: number;
  active: boolean;
  onComplete?: () => void;
}> = ({ level, active, onComplete }) => (
  <AnimatePresence>
    {active && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="text-center"
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          onAnimationComplete={onComplete}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1.1, 1.2, 1] }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            🎉
          </motion.div>
          <motion.h2
            className="text-4xl font-bold text-white mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Level {level}!
          </motion.h2>
          <motion.p
            className="text-lg text-blue-400"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Amazing progress!
          </motion.p>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Energy bar animation
export const EnergyBar: React.FC<{
  current: number;
  max: number;
  className?: string;
}> = ({ current, max, className = '' }) => {
  const percentage = (current / max) * 100;
  const color = percentage > 50 ? 'from-blue-400 to-cyan-400' : percentage > 20 ? 'from-yellow-400 to-orange-400' : 'from-red-400 to-pink-400';

  return (
    <div className={`relative h-3 bg-gray-800/50 rounded-full overflow-hidden ${className}`}>
      <motion.div
        className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="absolute inset-y-0 left-0 w-20 rounded-full bg-white/20 blur-sm"
        animate={{ x: ['-100%', '400%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

// XP progress bar
export const XPBar: React.FC<{
  current: number;
  max: number;
  className?: string;
}> = ({ current, max, className = '' }) => {
  const percentage = (current / max) * 100;

  return (
    <div className={`relative h-2 bg-gray-800/50 rounded-full overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="absolute inset-y-0 left-0 w-16 rounded-full bg-white/20 blur-sm"
        animate={{ x: ['-100%', '500%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

// Rank badge with glow
export const RankBadge: React.FC<{
  rank: string;
  level: number;
  className?: string;
}> = ({ rank, level, className = '' }) => {
  const rankColors: Record<string, string> = {
    Bronze: 'from-amber-600 to-amber-400',
    Silver: 'from-gray-400 to-gray-200',
    Gold: 'from-yellow-500 to-yellow-300',
    Platinum: 'from-cyan-500 to-blue-400',
    Diamond: 'from-blue-500 to-purple-500',
  };

  const color = rankColors[rank] || 'from-gray-500 to-gray-400';

  return (
    <motion.div
      className={`relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${color} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-white/20 blur-sm"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="text-xs font-bold text-white relative z-10">{rank}</span>
      <span className="text-[10px] text-white/80 relative z-10">Lv.{level}</span>
    </motion.div>
  );
};

// Notification toast with slide animation
export const NotificationToast: React.FC<{
  message: string;
  type?: 'success' | 'error' | 'info' | 'reward';
  active: boolean;
  onDismiss?: () => void;
}> = ({ message, type = 'info', active, onDismiss }) => {
  const icons: Record<string, string> = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    reward: '🎁',
  };

  const colors: Record<string, string> = {
    success: 'border-green-500/30 bg-green-500/10',
    error: 'border-red-500/30 bg-red-500/10',
    info: 'border-blue-500/30 bg-blue-500/10',
    reward: 'border-yellow-500/30 bg-yellow-500/10',
  };

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className={`fixed top-4 left-4 right-4 z-50 p-4 rounded-2xl border backdrop-blur-xl ${colors[type]}`}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={onDismiss}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{icons[type]}</span>
            <span className="text-sm text-white flex-1">{message}</span>
            <button className="text-white/50 text-xs" onClick={onDismiss}>✕</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Pull to refresh
export const PullToRefresh: React.FC<{
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}> = ({ onRefresh, children }) => {
  const [refreshing, setRefreshing] = useState(false);
  const pullDistance = useMotionValue(0);
  const springPull = useSpring(pullDistance, { stiffness: 300, damping: 30 });
  const rotate = useTransform(pullDistance, [0, 100], [0, 360]);

  const handleTouchEnd = async () => {
    if (pullDistance.get() > 80 && !refreshing) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
    pullDistance.set(0);
  };

  return (
    <div
      className="relative overflow-hidden"
      onTouchMove={(e) => {
        const touch = e.touches[0];
        const y = touch.clientY;
        if (y > 0 && y < 150) pullDistance.set(y * 0.5);
      }}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 z-10"
        style={{ top: useTransform(springPull, [0, 100], [-40, 10]) }}
      >
        <motion.div
          className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full"
          style={{ rotate }}
          animate={refreshing ? { rotate: 360 } : {}}
          transition={refreshing ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
        />
      </motion.div>
      {children}
    </div>
  );
};

// Page transition wrapper
export const PageTransition: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

// Stagger list
export const StaggerList: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <motion.div
    className={className}
    variants={staggerContainer}
    initial="hidden"
    animate="visible"
  >
    {React.Children.map(children, (child) => (
      <motion.div variants={staggerItem}>
        {child}
      </motion.div>
    ))}
  </motion.div>
);

// Floating element (for home screen life)
export const FloatingElement: React.FC<{
  children: React.ReactNode;
  amplitude?: number;
  duration?: number;
  delay?: number;
  className?: string;
}> = ({ children, amplitude = 5, duration = 3, delay = 0, className = '' }) => (
  <motion.div
    className={className}
    animate={{
      y: [-amplitude, amplitude, -amplitude],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
      delay,
    }}
  >
    {children}
  </motion.div>
);

// Gradient shift (for backgrounds)
export const GradientShift: React.FC<{
  colors?: string[];
  duration?: number;
  className?: string;
}> = ({ colors = ['#1a1a2e', '#16213e', '#0f3460', '#1a1a2e'], duration = 10, className = '' }) => (
  <motion.div
    className={`absolute inset-0 ${className}`}
    style={{
      background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[3]})`,
      backgroundSize: '400% 400%',
    }}
    animate={{
      backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'linear',
    }}
  />
);

// Button press animation
export const AnimatedButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
  disabled?: boolean;
  loading?: boolean;
}> = ({ children, onClick, className = '', variant = 'primary', disabled, loading }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20',
    secondary: 'bg-white/10 text-white border border-white/10',
    ghost: 'text-white/70 hover:text-white',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10 text-white',
  };

  return (
    <motion.button
      className={`relative overflow-hidden px-5 py-3 rounded-2xl font-medium text-sm ${variants[variant]} ${disabled ? 'opacity-50' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled ? { scale: 1.02, y: -1 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
    >
      {loading && (
        <motion.div
          className="absolute inset-0 bg-white/10"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
      {children}
    </motion.button>
  );
};

// Skeleton loader with shimmer
export const Skeleton: React.FC<{
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: number;
}> = ({ className = '', width, height = 20, borderRadius = 12 }) => (
  <motion.div
    className={`relative overflow-hidden bg-white/5 ${className}`}
    style={{ width, height, borderRadius }}
    initial={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
      animate={{ x: ['-100%', '100%'] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
    />
  </motion.div>
);

// Empty state
export const EmptyState: React.FC<{
  icon: string;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}> = ({ icon, title, description, action }) => (
  <motion.div
    className="flex flex-col items-center justify-center py-16 px-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
  >
    <motion.span
      className="text-5xl mb-4"
      animate={{ y: [-3, 3, -3], scale: [1, 1.05, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {icon}
    </motion.span>
    <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
    <p className="text-sm text-gray-400 text-center mb-4">{description}</p>
    {action && (
      <motion.button
        className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-medium text-white"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={action.onClick}
      >
        {action.label}
      </motion.button>
    )}
  </motion.div>
);

// Success state
export const SuccessState: React.FC<{
  title: string;
  description: string;
  onContinue?: () => void;
}> = ({ title, description, onContinue }) => (
  <motion.div
    className="flex flex-col items-center justify-center py-16 px-6"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
  >
    <motion.div
      className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4"
      initial={{ scale: 0 }}
      animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
    >
      <span className="text-3xl">✓</span>
    </motion.div>
    <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
    <p className="text-sm text-gray-400 text-center mb-6">{description}</p>
    {onContinue && (
      <motion.button
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-sm font-medium text-white"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onContinue}
      >
        Continue
      </motion.button>
    )}
  </motion.div>
);

// Error state
export const ErrorState: React.FC<{
  title?: string;
  description?: string;
  onRetry?: () => void;
}> = ({ title = 'Something went wrong', description = 'Please try again', onRetry }) => (
  <motion.div
    className="flex flex-col items-center justify-center py-16 px-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <motion.span
      className="text-5xl mb-4"
      animate={{ rotate: [0, -5, 5, -5, 0] }}
      transition={{ duration: 0.5 }}
    >
      😕
    </motion.span>
    <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
    <p className="text-sm text-gray-400 text-center mb-4">{description}</p>
    {onRetry && (
      <motion.button
        className="px-5 py-2.5 bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onRetry}
      >
        Try Again
      </motion.button>
    )}
  </motion.div>
);