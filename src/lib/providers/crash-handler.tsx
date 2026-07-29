// ============================================
// Crash Handler
// Production-ready error handling and crash reporting
// ============================================

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface CrashReport {
  id: string;
  error: Error;
  errorInfo?: any;
  userId?: string;
  deviceInfo: Record<string, any>;
  appState: Record<string, any>;
  timestamp: number;
  isReported: boolean;
}

interface CrashContextType {
  hasError: boolean;
  error: Error | null;
  crashReports: CrashReport[];
  captureError: (error: Error, errorInfo?: any) => void;
  clearError: () => void;
  reportCrash: (report: CrashReport) => Promise<void>;
  getCrashReports: () => CrashReport[];
}

const CrashContext = createContext<CrashContextType | undefined>(undefined);

interface CrashHandlerProps {
  children: ReactNode;
  storageKey?: string;
  maxReports?: number;
  enableAutoReport?: boolean;
  onError?: (error: Error, errorInfo?: any) => void;
}

export const CrashHandler: React.FC<CrashHandlerProps> = ({
  children,
  storageKey = 'fee_crash_reports',
  maxReports = 10,
  enableAutoReport = true,
  onError,
}) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [crashReports, setCrashReports] = useState<CrashReport[]>([]);

  const getDeviceInfo = useCallback((): Record<string, any> => {
    if (typeof window === 'undefined') {
      return {};
    }

    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      deviceMemory: (navigator as any).deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
      connection: (navigator as any).connection?.effectiveType,
    };
  }, []);

  const getAppState = useCallback((): Record<string, any> => {
    if (typeof window === 'undefined') {
      return {};
    }

    return {
      url: window.location.href,
      timestamp: Date.now(),
      localStorage: typeof localStorage !== 'undefined' ? Object.keys(localStorage) : [],
      sessionStorage: typeof sessionStorage !== 'undefined' ? Object.keys(sessionStorage) : [],
    };
  }, []);

  const captureError = useCallback(
    (error: Error, errorInfo?: any) => {
      setHasError(true);
      setError(error);

      const crashReport: CrashReport = {
        id: `crash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        error,
        errorInfo,
        userId: localStorage.getItem('fee_user_id') || undefined,
        deviceInfo: getDeviceInfo(),
        appState: getAppState(),
        timestamp: Date.now(),
        isReported: false,
      };

      setCrashReports((prev) => {
        const updated = [crashReport, ...prev];
        if (updated.length > maxReports) {
          return updated.slice(0, maxReports);
        }
        return updated;
      });

      // Call custom error handler
      if (onError) {
        onError(error, errorInfo);
      }

      // Log error
      console.error('[CrashHandler]', error, errorInfo);

      // Auto-report if enabled
      if (enableAutoReport) {
        reportCrash(crashReport);
      }
    },
    [getDeviceInfo, getAppState, maxReports, enableAutoReport, onError]
  );

  const clearError = useCallback(() => {
    setHasError(false);
    setError(null);
  }, []);

  const reportCrash = useCallback(async (report: CrashReport): Promise<void> => {
    try {
      // In production, send to crash reporting service
      // await sendToCrashReportingService(report);
      
      console.log('[CrashHandler] Reporting crash:', report.id);

      // Mark as reported
      setCrashReports((prev) =>
        prev.map((r) => (r.id === report.id ? { ...r, isReported: true } : r))
      );
    } catch (err) {
      console.error('[CrashHandler] Failed to report crash:', err);
    }
  }, []);

  const getCrashReports = useCallback((): CrashReport[] => {
    return crashReports;
  }, [crashReports]);

  // Global error handler
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      captureError(event.error || new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      captureError(error, {
        promise: event.promise,
        reason: event.reason,
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [captureError]);

  const value: CrashContextType = {
    hasError,
    error,
    crashReports,
    captureError,
    clearError,
    reportCrash,
    getCrashReports,
  };

  return <CrashContext.Provider value={value}>{children}</CrashContext.Provider>;
};

export const useCrashHandler = (): CrashContextType => {
  const context = useContext(CrashContext);
  if (!context) {
    throw new Error('useCrashHandler must be used within a CrashHandler');
  }
  return context;
};

export const useErrorHandler = () => {
  const { captureError, clearError, hasError, error } = useCrashHandler();
  return { captureError, clearError, hasError, error };
};