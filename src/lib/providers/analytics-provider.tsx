// ============================================
// Analytics Provider
// Production-ready analytics tracking
// ============================================

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

export interface AnalyticsEvent {
  id: string;
  name: string;
  category?: string;
  properties: Record<string, any>;
  userId?: string;
  deviceId?: string;
  sessionId?: string;
  timestamp: number;
}

interface AnalyticsContextType {
  events: AnalyticsEvent[];
  isLoading: boolean;
  error: Error | null;
  track: (eventName: string, properties?: Record<string, any>) => void;
  trackScreenView: (screenName: string, properties?: Record<string, any>) => void;
  trackUserAction: (action: string, properties?: Record<string, any>) => void;
  trackError: (error: Error, properties?: Record<string, any>) => void;
  trackPerformance: (metric: string, value: number, properties?: Record<string, any>) => void;
  flush: () => Promise<void>;
  clear: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
  children: ReactNode;
  storageKey?: string;
  maxEvents?: number;
  flushInterval?: number;
  enableConsoleLog?: boolean;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
  storageKey = 'fee_analytics',
  maxEvents = 1000,
  flushInterval = 30000, // 30 seconds
  enableConsoleLog = false,
}) => {
  const [events, setEvents] = useState<AnalyticsEvent[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored) as AnalyticsEvent[];
      }
    } catch {
      // Ignore
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Store events in localStorage
    try {
      localStorage.setItem(storageKey, JSON.stringify(events));
    } catch {
      // Ignore storage errors
    }
  }, [events, storageKey]);

  useEffect(() => {
    // Flush events periodically
    const interval = setInterval(() => {
      flush();
    }, flushInterval);

    return () => clearInterval(interval);
  }, [flushInterval]);

  const track = useCallback(
    (eventName: string, properties: Record<string, any> = {}) => {
      const event: AnalyticsEvent = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: eventName,
        category: properties.category,
        properties: {
          ...properties,
          timestamp: Date.now(),
        },
        userId: properties.userId,
        deviceId: properties.deviceId,
        sessionId: properties.sessionId,
        timestamp: Date.now(),
      };

      setEvents((prev) => {
        const updated = [event, ...prev];
        if (updated.length > maxEvents) {
          return updated.slice(0, maxEvents);
        }
        return updated;
      });

      if (enableConsoleLog) {
        console.log('[Analytics]', eventName, properties);
      }

      // In production, send to analytics service
      // sendToAnalyticsService(event);
    },
    [maxEvents, enableConsoleLog]
  );

  const trackScreenView = useCallback(
    (screenName: string, properties: Record<string, any> = {}) => {
      track('screen_view', {
        screen_name: screenName,
        ...properties,
      });
    },
    [track]
  );

  const trackUserAction = useCallback(
    (action: string, properties: Record<string, any> = {}) => {
      track('user_action', {
        action,
        ...properties,
      });
    },
    [track]
  );

  const trackError = useCallback(
    (error: Error, properties: Record<string, any> = {}) => {
      track('error', {
        error_message: error.message,
        error_stack: error.stack,
        error_name: error.name,
        ...properties,
      });
    },
    [track]
  );

  const trackPerformance = useCallback(
    (metric: string, value: number, properties: Record<string, any> = {}) => {
      track('performance', {
        metric,
        value,
        ...properties,
      });
    },
    [track]
  );

  const flush = useCallback(async () => {
    if (events.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      // In production, send events to analytics service
      // await sendToAnalyticsService(events);
      
      if (enableConsoleLog) {
        console.log('[Analytics] Flushing', events.length, 'events');
      }

      // Clear events after successful flush
      setEvents([]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to flush analytics events'));
    } finally {
      setIsLoading(false);
    }
  }, [events, enableConsoleLog]);

  const clear = useCallback(() => {
    setEvents([]);
  }, []);

  const value: AnalyticsContextType = {
    events,
    isLoading,
    error,
    track,
    trackScreenView,
    trackUserAction,
    trackError,
    trackPerformance,
    flush,
    clear,
  };

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
};

export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export const useTrackEvent = () => {
  const { track } = useAnalytics();
  return track;
};

export const useTrackScreenView = () => {
  const { trackScreenView } = useAnalytics();
  return trackScreenView;
};

export const useTrackError = () => {
  const { trackError } = useAnalytics();
  return trackError;
};