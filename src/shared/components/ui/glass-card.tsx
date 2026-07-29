'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  hover?: boolean;
  glow?: 'green' | 'blue' | 'gold' | 'none';
  padding?: 'sm' | 'md' | 'lg';
}

const paddingMap = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const glowStyles = {
  green: 'shadow-[0_0_20px_rgba(0,255,136,0.15)]',
  blue: 'shadow-[0_0_20px_rgba(0,191,255,0.15)]',
  gold: 'shadow-[0_0_20px_rgba(240,185,11,0.15)]',
  none: '',
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  style,
  onClick,
  hover = true,
  glow = 'none',
  padding = 'md',
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`
        glass-card
        ${paddingMap[padding]}
        ${glowStyles[glow]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={style}
    >
      {children}
    </motion.div>
  );
};