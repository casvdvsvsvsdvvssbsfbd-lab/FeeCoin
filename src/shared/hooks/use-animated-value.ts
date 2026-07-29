// ============================================
// Animated Value Hook
// Spring-based number animation with easing
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAnimatedValueOptions {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  easing?: 'easeOut' | 'easeInOut' | 'spring' | 'bounce' | 'smooth';
  decimals?: number;
  format?: boolean;
  onComplete?: () => void;
}

export function useAnimatedValue(options: UseAnimatedValueOptions) {
  const { from = 0, to, duration = 800, delay = 0, easing = 'smooth', decimals = 0, format = false, onComplete } = options;
  const [displayValue, setDisplayValue] = useState(from);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(from);

  const easeInOut = (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);
  const springEffect = (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  };
  const bounceEffect = (t: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    else if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    else if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    else return n1 * (t -= 2.625 / d1) * t + 0.984375;
  };
  const smooth = (t: number): number => t * t * (3 - 2 * t);

  const getEasing = (t: number): number => {
    switch (easing) {
      case 'easeOut': return easeOut(t);
      case 'easeInOut': return easeInOut(t);
      case 'spring': return springEffect(t);
      case 'bounce': return bounceEffect(t);
      case 'smooth': return smooth(t);
      default: return smooth(t);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const totalChange = to - startValueRef.current;
      if (totalChange === 0) return;

      startTimeRef.current = performance.now();

      const animate = (currentTime: number) => {
        if (!startTimeRef.current) return;
        const elapsed = currentTime - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = getEasing(progress);
        const current = startValueRef.current + totalChange * easedProgress;
        setDisplayValue(current);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayValue(to);
          onComplete?.();
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startValueRef.current = from;
    };
  }, [to, duration, delay, easing]);

  const formattedValue = format
    ? displayValue.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : displayValue.toFixed(decimals);

  return {
    value: displayValue,
    formatted: formattedValue,
    reset: useCallback(() => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setDisplayValue(from);
      startValueRef.current = from;
    }, [from]),
  };
}