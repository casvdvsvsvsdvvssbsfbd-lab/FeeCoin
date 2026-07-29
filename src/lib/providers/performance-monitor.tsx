// ============================================
// Performance Monitor
// Production-ready performance tracking
// ============================================

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'fps' | 'percentage' | 'score';
  category: 'render' | 'network' | 'memory' | 'interaction' | 'bundle';
  timestamp: number;
  metadata?: Record<string, any>;
}

interface PerformanceContextType {
  metrics: PerformanceMetric[];
  isMonitoring: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  recordMetric: (metric: Omit<PerformanceMetric, 'id' | 'timestamp'>) => void;
  getMetricsByCategory: (category: PerformanceMetric['category']) => PerformanceMetric[];
  getAverageMetric: (name: string) => number | null;
  clearMetrics: () => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

interface PerformanceMonitorProps {
  children: ReactNode;
  storageKey?: string;
  maxMetrics?: number;
  enableWebVitals?: boolean;
  enableConsoleLog?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  children,
  storageKey = 'fee_performance',
  maxMetrics = 1000,
  enableWebVitals = true,
  enableConsoleLog = false,
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const recordMetric = useCallback(
    (metricData: Omit<PerformanceMetric, 'id' | 'timestamp'>) => {
      const metric: PerformanceMetric = {
        ...metricData,
        id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
      };

      setMetrics((prev) => {
        const updated = [metric, ...prev];
        if (updated.length > maxMetrics) {
          return updated.slice(0, maxMetrics);
        }
        return updated;
      });

      if (enableConsoleLog) {
        console.log('[Performance]', metric.name, metric.value, metric.unit);
      }
    },
    [maxMetrics, enableConsoleLog]
  );

  const getMetricsByCategory = useCallback(
    (category: PerformanceMetric['category']): PerformanceMetric[] => {
      return metrics.filter((m) => m.category === category);
    },
    [metrics]
  );

  const getAverageMetric = useCallback((name: string): number | null => {
    const filtered = metrics.filter((m) => m.name === name);
    if (filtered.length === 0) return null;

    const sum = filtered.reduce((acc, m) => acc + m.value, 0);
    return sum / filtered.length;
  }, [metrics]);

  const clearMetrics = useCallback(() => {
    setMetrics([]);
  }, []);

  // Web Vitals monitoring
  useEffect(() => {
    if (!enableWebVitals || typeof window === 'undefined') return;

    // Measure FCP (First Contentful Paint)
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            recordMetric({
              name: 'FCP',
              value: entry.startTime,
              unit: 'ms',
              category: 'render',
            });
          }
        }
      });

      observer.observe({ type: 'paint', buffered: true });

      // Measure LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        recordMetric({
          name: 'LCP',
          value: lastEntry.startTime,
          unit: 'ms',
          category: 'render',
        });
      });

      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // Measure FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          recordMetric({
            name: 'FID',
            value: (entry as any).processingStart - entry.startTime,
            unit: 'ms',
            category: 'interaction',
          });
        }
      });

      fidObserver.observe({ type: 'first-input', buffered: true });

      // Measure CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        recordMetric({
          name: 'CLS',
          value: clsValue,
          unit: 'score',
          category: 'render',
        });
      });

      clsObserver.observe({ type: 'layout-shift', buffered: true });

      return () => {
        observer.disconnect();
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    } catch {
      // Performance API not supported
    }
  }, [enableWebVitals, recordMetric]);

  // Memory monitoring
  useEffect(() => {
    if (!isMonitoring || typeof window === 'undefined') return;

    const interval = setInterval(() => {
      const memory = (navigator as any).memory;
      if (memory) {
        recordMetric({
          name: 'memory_used',
          value: memory.usedJSHeapSize / 1024 / 1024, // MB
          unit: 'bytes',
          category: 'memory',
        });

        recordMetric({
          name: 'memory_total',
          value: memory.totalJSHeapSize / 1024 / 1024, // MB
          unit: 'bytes',
          category: 'memory',
        });
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [isMonitoring, recordMetric]);

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    recordMetric({
      name: 'monitoring_started',
      value: Date.now(),
      unit: 'ms',
      category: 'render',
    });
  }, [recordMetric]);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    recordMetric({
      name: 'monitoring_stopped',
      value: Date.now(),
      unit: 'ms',
      category: 'render',
    });
  }, [recordMetric]);

  const value: PerformanceContextType = {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    recordMetric,
    getMetricsByCategory,
    getAverageMetric,
    clearMetrics,
  };

  return <PerformanceContext.Provider value={value}>{children}</PerformanceContext.Provider>;
};

export const usePerformance = (): PerformanceContextType => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceMonitor');
  }
  return context;
};

export const usePerformanceMetric = (name: string) => {
  const { getAverageMetric, recordMetric } = usePerformance();
  return {
    getAverage: () => getAverageMetric(name),
    record: (value: number, unit: PerformanceMetric['unit'], category: PerformanceMetric['category'], metadata?: Record<string, any>) =>
      recordMetric({ name, value, unit, category, metadata }),
  };
};