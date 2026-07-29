// ============================================
// Liquid Glass Component
// iOS 26 inspired glass morphism with adaptive blur
// ============================================

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface LiquidGlassProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy' | 'premium';
  blur?: number;
  opacity?: number;
  borderRadius?: number | string;
  glow?: boolean;
  glowColor?: string;
  hover?: boolean;
  tap?: boolean;
  animate?: boolean;
  padding?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const glassVariants = {
  light: { blur: 8, opacity: 0.3, bg: 'rgba(255,255,255,0.05)' },
  medium: { blur: 16, opacity: 0.4, bg: 'rgba(255,255,255,0.08)' },
  heavy: { blur: 24, opacity: 0.5, bg: 'rgba(255,255,255,0.12)' },
  premium: { blur: 32, opacity: 0.6, bg: 'rgba(255,255,255,0.15)' },
};

export const LiquidGlass: React.FC<LiquidGlassProps> = ({
  children,
  className = '',
  intensity = 'medium',
  blur,
  opacity,
  borderRadius = 20,
  glow = false,
  glowColor = 'rgba(59, 130, 246, 0.3)',
  hover = true,
  tap = true,
  animate = true,
  padding = true,
  style,
  onClick,
}) => {
  const config = glassVariants[intensity];
  const blurValue = blur ?? config.blur;
  const opacityValue = opacity ?? config.opacity;

  const glassStyle: React.CSSProperties = useMemo(() => ({
    background: `linear-gradient(135deg, ${config.bg}, rgba(255,255,255,0.02))`,
    backdropFilter: `blur(${blurValue}px) saturate(1.4)`,
    WebkitBackdropFilter: `blur(${blurValue}px) saturate(1.4)`,
    border: '1px solid rgba(255,255,255,0.08)',
    borderBottom: '1px solid rgba(255,255,255,0.12)',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    boxShadow: glow
      ? `0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 40px ${glowColor}`
      : `0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)`,
    borderRadius,
    ...style,
  }), [config.bg, blurValue, opacityValue, borderRadius, glow, glowColor, style]);

  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      className={`${padding ? 'p-5' : ''} ${className}`}
      style={glassStyle}
      onClick={onClick}
      initial={animate ? { opacity: 0, y: 10 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={animate ? { duration: 0.4, ease: [0.16, 1, 0.3, 1] } : undefined}
      whileHover={hover ? { scale: 1.01, y: -1, transition: { duration: 0.2 } } : undefined}
      whileTap={tap ? { scale: 0.98, transition: { duration: 0.1 } } : undefined}
    >
      {children}
    </Component>
  );
};

// Glass Card with light reflection effect
export const GlassCard: React.FC<LiquidGlassProps> = (props) => (
  <LiquidGlass intensity="medium" {...props}>
    <div className="relative">
      {/* Light reflection */}
      <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      {props.children}
    </div>
  </LiquidGlass>
);

// Premium glass with stronger effects
export const PremiumGlass: React.FC<LiquidGlassProps> = (props) => (
  <LiquidGlass intensity="premium" glow {...props} />
);

// Glass navigation bar
export const GlassNav: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <motion.nav
    className={`fixed bottom-0 left-0 right-0 z-50 ${className || ''}`}
    style={{
      background: 'linear-gradient(180deg, rgba(15,15,20,0.6) 0%, rgba(10,10,15,0.9) 100%)',
      backdropFilter: 'blur(32px) saturate(1.5)',
      WebkitBackdropFilter: 'blur(32px) saturate(1.5)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 -4px 32px rgba(0,0,0,0.2)',
    }}
    initial={{ y: 100 }}
    animate={{ y: 0 }}
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
  >
    {children}
  </motion.nav>
);

// Glass modal/sheet
export const GlassSheet: React.FC<{
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  height?: string;
}> = ({ children, isOpen, onClose, height = '60vh' }) => (
  <motion.div
    className="fixed inset-0 z-50 flex items-end justify-center"
    initial={false}
    animate={isOpen ? { opacity: 1 } : { opacity: 0, pointerEvents: 'none' }}
    transition={{ duration: 0.3 }}
  >
    {/* Backdrop */}
    <motion.div
      className="absolute inset-0 bg-black/40"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
    />
    {/* Sheet */}
    <motion.div
      className="relative w-full rounded-t-[24px]"
      style={{
        height,
        background: 'linear-gradient(180deg, rgba(20,20,30,0.95) 0%, rgba(10,10,15,0.98) 100%)',
        backdropFilter: 'blur(40px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(40px) saturate(1.5)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.3)',
      }}
      initial={{ y: '100%' }}
      animate={isOpen ? { y: 0 } : { y: '100%' }}
      transition={{ type: 'spring', stiffness: 400, damping: 35, mass: 0.8 }}
    >
      {/* Handle */}
      <div className="flex justify-center pt-3 pb-2">
        <div className="w-10 h-1 rounded-full bg-white/20" />
      </div>
      {children}
    </motion.div>
  </motion.div>
);