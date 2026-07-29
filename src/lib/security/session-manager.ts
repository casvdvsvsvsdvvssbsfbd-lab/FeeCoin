// ============================================
// Session Manager
// Device-based session management with remote logout
// Multiple session control, device tracking
// ============================================

import { createHash } from 'crypto';

export interface SessionDeviceInfo {
  deviceId: string;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  deviceName?: string;
  platform: string;
  browser: string;
  os: string;
  ip: string;
  country?: string;
  city?: string;
  timezone?: string;
  language: string;
  userAgent: string;
}

export interface Session {
  id: string;
  userId: string;
  deviceInfo: SessionDeviceInfo;
  status: 'active' | 'expired' | 'revoked' | 'suspended';
  createdAt: number;
  lastActivity: number;
  expiresAt: number;
  tokenFamily: string;
  isCurrent: boolean;
  metadata?: Record<string, any>;
}

export interface SessionConfig {
  maxSessionsPerUser: number;
  sessionTimeout: number;
  inactivityTimeout: number;
  allowMultipleDevices: boolean;
  revokeOnPasswordChange: boolean;
  trackDeviceChanges: boolean;
  notifyNewDevice: boolean;
  requireDeviceTrust: boolean;
}

const DEFAULT_CONFIG: SessionConfig = {
  maxSessionsPerUser: 5,
  sessionTimeout: 604800000, // 7 days
  inactivityTimeout: 86400000, // 24 hours
  allowMultipleDevices: true,
  revokeOnPasswordChange: true,
  trackDeviceChanges: true,
  notifyNewDevice: true,
  requireDeviceTrust: false,
};

export class SessionManager {
  private config: SessionConfig;
  private sessions: Map<string, Session> = new Map();
  private userSessions: Map<string, Set<string>> = new Map();
  private deviceFingerprints: Map<string, string> = new Map();

  constructor(config: Partial<SessionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Create a new session
   */
  createSession(params: {
    userId: string;
    deviceInfo: SessionDeviceInfo;
    tokenFamily: string;
  }): Session {
    const now = Date.now();

    // Enforce max sessions
    if (!this.config.allowMultipleDevices) {
      this.revokeAllUserSessions(params.userId);
    }

    const existingSessions = this.getUserSessions(params.userId).filter(
      s => s.status === 'active'
    );

    // Revoke oldest session if over limit
    if (existingSessions.length >= this.config.maxSessionsPerUser) {
      const oldestSession = existingSessions.sort(
        (a, b) => a.createdAt - b.createdAt
      )[0];
      this.revokeSession(oldestSession.id);
    }

    // Generate device fingerprint
    const deviceFingerprint = this.generateDeviceFingerprint(params.deviceInfo);
    this.deviceFingerprints.set(params.userId, deviceFingerprint);

    const session: Session = {
      id: this.generateSessionId(),
      userId: params.userId,
      deviceInfo: params.deviceInfo,
      status: 'active',
      createdAt: now,
      lastActivity: now,
      expiresAt: now + this.config.sessionTimeout,
      tokenFamily: params.tokenFamily,
      isCurrent: true,
    };

    // Store session
    this.sessions.set(session.id, session);

    // Track user sessions
    const userSessionIds = this.userSessions.get(params.userId) || new Set();
    userSessionIds.add(session.id);
    this.userSessions.set(params.userId, userSessionIds);

    return session;
  }

  /**
   * Validate a session
   */
  validateSession(sessionId: string): { valid: boolean; session: Session | null; error: string | null } {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return { valid: false, session: null, error: 'Session not found' };
    }

    if (session.status !== 'active') {
      return { valid: false, session, error: `Session ${session.status}` };
    }

    // Check expiry
    if (Date.now() > session.expiresAt) {
      session.status = 'expired';
      return { valid: false, session, error: 'Session expired' };
    }

    // Check inactivity
    if (this.config.inactivityTimeout > 0) {
      const inactiveDuration = Date.now() - session.lastActivity;
      if (inactiveDuration > this.config.inactivityTimeout) {
        session.status = 'expired';
        return { valid: false, session, error: 'Session inactive too long' };
      }
    }

    // Update last activity
    session.lastActivity = Date.now();

    return { valid: true, session, error: null };
  }

  /**
   * Revoke a session
   */
  revokeSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.status = 'revoked';
    session.isCurrent = false;

    return true;
  }

  /**
   * Revoke all sessions for a user
   */
  revokeAllUserSessions(userId: string): void {
    const sessionIds = this.userSessions.get(userId);
    if (!sessionIds) return;

    for (const sessionId of sessionIds) {
      const session = this.sessions.get(sessionId);
      if (session) {
        session.status = 'revoked';
        session.isCurrent = false;
      }
    }
  }

  /**
   * Revoke sessions except current
   */
  revokeOtherSessions(userId: string, currentSessionId: string): void {
    const sessionIds = this.userSessions.get(userId);
    if (!sessionIds) return;

    for (const sessionId of sessionIds) {
      if (sessionId !== currentSessionId) {
        this.revokeSession(sessionId);
      }
    }
  }

  /**
   * Get all sessions for a user
   */
  getUserSessions(userId: string): Session[] {
    const sessionIds = this.userSessions.get(userId);
    if (!sessionIds) return [];

    return Array.from(sessionIds)
      .map(id => this.sessions.get(id))
      .filter(Boolean) as Session[];
  }

  /**
   * Get active sessions for a user
   */
  getActiveSessions(userId: string): Session[] {
    return this.getUserSessions(userId).filter(s => s.status === 'active');
  }

  /**
   * Check if device is new for a user
   */
  isNewDevice(userId: string, deviceInfo: SessionDeviceInfo): boolean {
    const existingFingerprint = this.deviceFingerprints.get(userId);
    if (!existingFingerprint) return true;

    const newFingerprint = this.generateDeviceFingerprint(deviceInfo);
    return existingFingerprint !== newFingerprint;
  }

  /**
   * Generate a device fingerprint
   */
  private generateDeviceFingerprint(deviceInfo: SessionDeviceInfo): string {
    const components = [
      deviceInfo.deviceId,
      deviceInfo.platform,
      deviceInfo.os,
      deviceInfo.browser,
      deviceInfo.userAgent,
    ].filter(Boolean).join('|');

    return createHash('sha256').update(components).digest('hex');
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    return `sess-${timestamp}-${random}`;
  }

  /**
   * Update session activity
   */
  updateActivity(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActivity = Date.now();
    }
  }

  /**
   * Extend session expiry
   */
  extendSession(sessionId: string, extensionMs: number = this.config.sessionTimeout): boolean {
    const session = this.sessions.get(sessionId);
    if (!session || session.status !== 'active') return false;

    session.expiresAt = Date.now() + extensionMs;
    return true;
  }

  /**
   * Get session count for a user
   */
  getSessionCount(userId: string): number {
    return this.getActiveSessions(userId).length;
  }

  /**
   * Force logout specific session
   */
  forceLogout(userId: string, sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session || session.userId !== userId) return false;

    session.status = 'revoked';
    return true;
  }

  /**
   * Cleanup expired sessions
   */
  cleanupExpiredSessions(): number {
    let cleaned = 0;
    const now = Date.now();

    for (const [id, session] of this.sessions) {
      if (session.status === 'active' && now > session.expiresAt) {
        session.status = 'expired';
        cleaned++;
      }

      // Remove very old revoked sessions
      if (session.status === 'revoked' || session.status === 'expired') {
        if (now - session.lastActivity > this.config.sessionTimeout * 2) {
          this.sessions.delete(id);
          const userSessions = this.userSessions.get(session.userId);
          if (userSessions) {
            userSessions.delete(id);
            if (userSessions.size === 0) {
              this.userSessions.delete(session.userId);
            }
          }
          cleaned++;
        }
      }
    }

    return cleaned;
  }

  /**
   * Get session statistics
   */
  getStats(): {
    totalSessions: number;
    activeSessions: number;
    totalUsers: number;
    uniqueDevices: number;
  } {
    let activeSessions = 0;
    for (const session of this.sessions.values()) {
      if (session.status === 'active') activeSessions++;
    }

    return {
      totalSessions: this.sessions.size,
      activeSessions,
      totalUsers: this.userSessions.size,
      uniqueDevices: this.deviceFingerprints.size,
    };
  }
}

// Singleton instance
export const sessionManager = new SessionManager();