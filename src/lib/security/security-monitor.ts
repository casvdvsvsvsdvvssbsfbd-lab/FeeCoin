// ============================================
// Security Monitor
// Production security event monitoring
// Track attacks, rate limits, failed logins, etc.
// ============================================

export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: 'info' | 'warning' | 'critical';
  timestamp: number;
  source: string;
  details: Record<string, any>;
  metadata?: Record<string, any>;
}

export type SecurityEventType =
  | 'security_event'
  | 'attack_attempt'
  | 'blocked_request'
  | 'rate_limit_hit'
  | 'failed_login'
  | 'invalid_telegram_auth'
  | 'webhook_failure'
  | 'jwt_failure'
  | 'encryption_failure'
  | 'csrf_attempt'
  | 'xss_attempt'
  | 'sql_injection_attempt'
  | 'bot_detected'
  | 'abuse_detected'
  | 'suspicious_activity'
  | 'api_abuse'
  | 'withdrawal_attempt'
  | 'session_hijack';

export interface SecurityAlert {
  id: string;
  type: SecurityEventType;
  severity: 'warning' | 'critical';
  message: string;
  timestamp: number;
  acknowledged: boolean;
  acknowledgedBy?: string;
  resolvedAt?: number;
}

export interface SecurityMonitorConfig {
  environment: string;
  alertThresholds: {
    critical: number;
    warning: number;
    info: boolean;
  };
  autoResolveAlerts: boolean;
  autoResolveTimeout: number;
  maxEventsInMemory: number;
}

const DEFAULT_CONFIG: SecurityMonitorConfig = {
  environment: 'development',
  alertThresholds: {
    critical: 90,
    warning: 50,
    info: true,
  },
  autoResolveAlerts: true,
  autoResolveTimeout: 3600000, // 1 hour
  maxEventsInMemory: 10000,
};

export class SecurityMonitor {
  private config: SecurityMonitorConfig;
  private events: SecurityEvent[] = [];
  private alerts: SecurityAlert[] = [];
  private eventCounts: Map<SecurityEventType, number> = new Map();
  private activeThreats: Map<string, number> = new Map();

  constructor(config: Partial<SecurityMonitorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Record a security event
   */
  recordEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): SecurityEvent {
    const fullEvent: SecurityEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: Date.now(),
    };

    this.events.push(fullEvent);
    this.eventCounts.set(event.type, (this.eventCounts.get(event.type) || 0) + 1);

    // Enforce max events
    if (this.events.length > this.config.maxEventsInMemory) {
      this.events.shift();
    }

    // Create alert for critical events
    if (event.severity === 'critical') {
      this.createAlert(fullEvent);
    }

    // Track active threats
    if (event.details?.userId) {
      const threatScore = this.activeThreats.get(event.details.userId) || 0;
      this.activeThreats.set(event.details.userId, threatScore + this.getSeverityScore(event.severity));
    }

    return fullEvent;
  }

  /**
   * Get severity score
   */
  private getSeverityScore(severity: string): number {
    switch (severity) {
      case 'critical': return 30;
      case 'warning': return 10;
      case 'info': return 1;
      default: return 0;
    }
  }

  /**
   * Convenience method for recording attack attempts
   */
  recordAttackAttempt(params: {
    type: string;
    source: string;
    ip: string;
    userId?: string;
    details: Record<string, any>;
  }): SecurityEvent {
    return this.recordEvent({
      type: 'attack_attempt',
      severity: 'critical',
      source: params.source,
      details: { ...params.details, ip: params.ip, userId: params.userId, attackType: params.type },
    });
  }

  /**
   * Convenience method for recording blocked requests
   */
  recordBlockedRequest(params: {
    reason: string;
    source: string;
    ip: string;
    userId?: string;
    endpoint?: string;
  }): SecurityEvent {
    return this.recordEvent({
      type: 'blocked_request',
      severity: 'warning',
      source: params.source,
      details: { reason: params.reason, ip: params.ip, userId: params.userId, endpoint: params.endpoint },
    });
  }

  /**
   * Convenience method for recording JWT failures
   */
  recordJwtFailure(params: {
    reason: string;
    source: string;
    userId?: string;
    token?: string;
  }): SecurityEvent {
    return this.recordEvent({
      type: 'jwt_failure',
      severity: 'warning',
      source: params.source,
      details: { reason: params.reason, userId: params.userId },
    });
  }

  /**
   * Convenience method for recording webhook failures
   */
  recordWebhookFailure(params: {
    providerId: string;
    reason: string;
    ip: string;
  }): SecurityEvent {
    return this.recordEvent({
      type: 'webhook_failure',
      severity: 'warning',
      source: params.providerId,
      details: { providerId: params.providerId, reason: params.reason, ip: params.ip },
    });
  }

  /**
   * Create an alert from a security event
   */
  private createAlert(event: SecurityEvent): void {
    const alert: SecurityAlert = {
      id: this.generateAlertId(),
      type: event.type,
      severity: event.severity as 'warning' | 'critical',
      message: this.generateAlertMessage(event),
      timestamp: Date.now(),
      acknowledged: false,
    };

    this.alerts.push(alert);

    // Auto-resolve if configured
    if (this.config.autoResolveAlerts) {
      setTimeout(() => {
        const existingAlert = this.alerts.find(a => a.id === alert.id);
        if (existingAlert && !existingAlert.acknowledged) {
          existingAlert.resolvedAt = Date.now();
        }
      }, this.config.autoResolveTimeout);
    }
  }

  /**
   * Generate alert message from event
   */
  private generateAlertMessage(event: SecurityEvent): string {
    const typeLabels: Record<string, string> = {
      attack_attempt: 'Attack attempt detected',
      blocked_request: 'Request blocked',
      rate_limit_hit: 'Rate limit exceeded',
      failed_login: 'Failed login attempt',
      invalid_telegram_auth: 'Invalid Telegram authentication',
      webhook_failure: 'Webhook verification failed',
      jwt_failure: 'JWT validation failed',
      encryption_failure: 'Encryption failure detected',
      csrf_attempt: 'CSRF attack attempt',
      xss_attempt: 'XSS attack attempt',
      sql_injection_attempt: 'SQL injection attempt',
      bot_detected: 'Bot activity detected',
      abuse_detected: 'Abuse detected',
      suspicious_activity: 'Suspicious activity detected',
      api_abuse: 'API abuse detected',
      session_hijack: 'Session hijack attempt',
    };

    return typeLabels[event.type] || `Security event: ${event.type}`;
  }

  /**
   * Generate event ID
   */
  private generateEventId(): string {
    return `evt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
  }

  /**
   * Generate alert ID
   */
  private generateAlertId(): string {
    return `alert-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
  }

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert(alertId: string, userId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert) return false;
    alert.acknowledged = true;
    alert.acknowledgedBy = userId;
    return true;
  }

  /**
   * Get active threats (users with high threat scores)
   */
  getActiveThreats(): Array<{ userId: string; score: number }> {
    return Array.from(this.activeThreats.entries())
      .filter(([_, score]) => score > 50)
      .map(([userId, score]) => ({ userId, score }))
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Get event counts by type
   */
  getEventCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    this.eventCounts.forEach((count, type) => {
      counts[type] = count;
    });
    return counts;
  }

  /**
   * Get dashboard overview
   */
  getDashboard(): {
    totalEvents: number;
    activeAlerts: number;
    activeThreats: number;
    eventBreakdown: Record<string, number>;
    recentEvents: SecurityEvent[];
    recentAlerts: SecurityAlert[];
  } {
    return {
      totalEvents: this.events.length,
      activeAlerts: this.alerts.filter(a => !a.acknowledged && !a.resolvedAt).length,
      activeThreats: this.activeThreats.size,
      eventBreakdown: this.getEventCounts(),
      recentEvents: this.events.slice(-50).reverse(),
      recentAlerts: this.alerts.slice(-20).reverse(),
    };
  }

  /**
   * Get security stats
   */
  getStats(): {
    totalEvents: number;
    totalAlerts: number;
    criticalAlerts: number;
    warningAlerts: number;
    uniqueThreats: number;
  } {
    return {
      totalEvents: this.events.length,
      totalAlerts: this.alerts.length,
      criticalAlerts: this.alerts.filter(a => a.severity === 'critical').length,
      warningAlerts: this.alerts.filter(a => a.severity === 'warning').length,
      uniqueThreats: this.activeThreats.size,
    };
  }

  /**
   * Reset all data
   */
  reset(): void {
    this.events = [];
    this.alerts = [];
    this.eventCounts.clear();
    this.activeThreats.clear();
  }
}

// Singleton instance
export const securityMonitor = new SecurityMonitor();