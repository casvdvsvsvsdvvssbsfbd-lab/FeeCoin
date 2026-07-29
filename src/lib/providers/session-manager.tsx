// ============================================
// Session Manager
// Production-ready session management
// ============================================

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface Session {
  id: string;
  userId: string;
  deviceId: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  deviceName?: string;
  ipAddress: string;
  userAgent?: string;
  location: Record<string, any>;
  status: 'active' | 'expired' | 'revoked';
  lastActiveAt: string;
  expiresAt: string;
  createdAt: string;
}

interface SessionContextType {
  session: Session | null;
  sessions: Session[];
  isLoading: boolean;
  error: Error | null;
  createSession: (userId: string, deviceId: string) => Promise<Session>;
  updateSession: (sessionId: string, updates: Partial<Session>) => Promise<void>;
  revokeSession: (sessionId: string) => Promise<void>;
  revokeAllSessions: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isSessionValid: () => boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionManagerProps {
  children: ReactNode;
  storageKey?: string;
  sessionDuration?: number;
  refreshInterval?: number;
}

export const SessionManager: React.FC<SessionManagerProps> = ({
  children,
  storageKey = 'fee_session',
  sessionDuration = 7 * 24 * 60 * 60 * 1000, // 7 days
  refreshInterval = 5 * 60 * 1000, // 5 minutes
}) => {
  const [session, setSession] = useState<Session | null>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Session;
        if (new Date(parsed.expiresAt) > new Date()) {
          return parsed;
        }
      }
    } catch {
      // Ignore
    }
    return null;
  });

  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createSession = useCallback(
    async (userId: string, deviceId: string): Promise<Session> => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + sessionDuration);

      const newSession: Session = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        deviceId,
        deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        deviceName: navigator.userAgent,
        ipAddress: '127.0.0.1', // In production, get from API
        userAgent: navigator.userAgent,
        location: {},
        status: 'active',
        lastActiveAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        createdAt: now.toISOString(),
      };

      setSession(newSession);
      setSessions((prev) => [newSession, ...prev]);

      // Store session
      try {
        localStorage.setItem(storageKey, JSON.stringify(newSession));
      } catch {
        // Ignore storage errors
      }

      return newSession;
    },
    [sessionDuration, storageKey]
  );

  const updateSession = useCallback(async (sessionId: string, updates: Partial<Session>) => {
    setSession((prev) => {
      if (!prev || prev.id !== sessionId) return prev;

      const updated = { ...prev, ...updates, lastActiveAt: new Date().toISOString() };

      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }

      return updated;
    });
  }, [storageKey]);

  const revokeSession = useCallback(async (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: 'revoked' as const } : s))
    );

    if (session?.id === sessionId) {
      setSession(null);
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // Ignore
      }
    }
  }, [session, storageKey]);

  const revokeAllSessions = useCallback(async () => {
    setSessions((prev) => prev.map((s) => ({ ...s, status: 'revoked' as const })));
    setSession(null);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignore
    }
  }, [storageKey]);

  const refreshSession = useCallback(async () => {
    if (!session) return;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + sessionDuration);

    const updated = {
      ...session,
      lastActiveAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    setSession(updated);

    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  }, [session, sessionDuration, storageKey]);

  const isSessionValid = useCallback((): boolean => {
    if (!session) return false;
    return new Date(session.expiresAt) > new Date() && session.status === 'active';
  }, [session]);

  // Auto-refresh session
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      if (isSessionValid()) {
        refreshSession();
      } else {
        setSession(null);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [session, refreshSession, isSessionValid, refreshInterval]);

  const value: SessionContextType = {
    session,
    sessions,
    isLoading,
    error,
    createSession,
    updateSession,
    revokeSession,
    revokeAllSessions,
    refreshSession,
    isSessionValid,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionManager');
  }
  return context;
};

export const useCurrentSession = (): Session | null => {
  const { session } = useSession();
  return session;
};

export const useIsAuthenticated = (): boolean => {
  const { isSessionValid } = useSession();
  return isSessionValid();
};