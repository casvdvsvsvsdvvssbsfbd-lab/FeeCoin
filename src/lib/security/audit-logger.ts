// ============================================
// Audit Logger
// Immutable audit logging for security events
// All admin actions, withdrawals, config changes
// ============================================

export type AuditEventType =
  | 'admin_action'
  | 'withdrawal'
  | 'wallet_change'
  | 'provider_callback'
  | 'api_request'
  | 'permission_failure'
  | 'fraud_detection'
  | 'config_change'
  | 'user_action'
  | 'login'
  | 'logout'
  | 'session_revoked'
  | 'token_rotated'
  | 'encryption_key_rotated'
  | 'secret_changed'
  | 'rate_limit_hit'
  | 'blocked_request'
  | 'webhook_received'
  | 'security_alert';

export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AuditEvent {
  id: string;
  type: AuditEventType;
  severity: AuditSeverity;
  actor: {
    id: string;
    type: 'user' | 'admin' | 'system' | 'provider' | 'anonymous';
    ip?: string;
    userAgent?: string;
    sessionId?: string;
  };
  resource: {
    type: string;
    id: string;
    action: string;
  };
  context: {
    timestamp: string;
    environment: string;
    region?: string;
    requestId?: string;
    correlationId?: string;
  };
  changes?: Record<string, { from: any; to: any }>;
  metadata?: Record<string, any>;
  immutable: boolean;
  hash: string;
}

export interface AuditLogEntry {
  event: AuditEvent;
  signature: string;
  verified: boolean;
}

export interface AuditLoggerConfig {
  environment: string;
  enableImmutability: boolean;
  enableSigning: boolean;
  signingKey: string;
  maxRetentionDays: number;
  bufferSize: number;
  flushInterval: number;
}

const DEFAULT_CONFIG: AuditLoggerConfig = {
  environment: 'development',
  enableImmutability: true,
  enableSigning: true,
  signingKey: 'audit-signing-key',
  maxRetentionDays: 365,
  bufferSize: 100,
  flushInterval: 5000,
};

import { createHash, createHmac } from 'crypto';

export class AuditLogger {
  private config: AuditLoggerConfig;
  private buffer: AuditLogEntry[] = [];
  private eventCounter = 0;
  private previousHash = '0000000000000000000000000000000000000000000000000000000000000000';

  constructor(config: Partial<AuditLoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Log an audit event
   */
  async log(event: Omit<AuditEvent, 'id' | 'timestamp' | 'immutable' | 'hash'>): Promise<AuditLogEntry> {
    const fullEvent: AuditEvent = {
      ...event,
      id: this.generateEventId(),
      immutable: this.config.enableImmutability,
      hash: '',
      context: {
        ...event.context,
        timestamp: new Date().toISOString(),
        environment: this.config.environment,
      },
    };

    // Generate hash for immutability (blockchain-style chain)
    if (this.config.enableImmutability) {
      fullEvent.hash = this.calculateEventHash(fullEvent);
    }

    // Sign the event
    let signature = '';
    if (this.config.enableSigning) {
      signature = this.signEvent(fullEvent);
    }

    const entry: AuditLogEntry = {
      event: fullEvent,
      signature,
      verified: true,
    };

    // Buffer the event
    this.buffer.push(entry);

    // Flush if buffer is full
    if (this.buffer.length >= this.config.bufferSize) {
      await this.flush();
    }

    return entry;
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    this.eventCounter++;
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    const counter = this.eventCounter.toString(36);
    return `aud-${timestamp}-${random}-${counter}`;
  }

  /**
   * Calculate event hash (includes previous event hash for chain integrity)
   */
  private calculateEventHash(event: AuditEvent): string {
    const data = this.serializeEvent(event);
    const hashInput = `${this.previousHash}:${data}`;
    const hash = createHash('sha256').update(hashInput).digest('hex');
    this.previousHash = hash;
    return hash;
  }

  /**
   * Serialize event for hashing
   */
  private serializeEvent(event: Omit<AuditEvent, 'hash'>): string {
    return JSON.stringify({
      id: event.id,
      type: event.type,
      severity: event.severity,
      actor: event.actor,
      resource: event.resource,
      context: event.context,
      changes: event.changes,
      metadata: event.metadata,
      immutable: event.immutable,
    });
  }

  /**
   * Sign an event with HMAC
   */
  private signEvent(event: AuditEvent): string {
    const data = this.serializeEvent(event);
    const hmac = createHmac('sha256', this.config.signingKey);
    hmac.update(data);
    return hmac.digest('hex');
  }

  /**
   * Verify event signature
   */
  verifySignature(entry: AuditLogEntry): boolean {
    if (!this.config.enableSigning) return true;
    const expectedSignature = this.signEvent(entry.event);
    return entry.signature === expectedSignature;
  }

  /**
   * Flush buffered events to storage
   */
  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const events = [...this.buffer];
    this.buffer = [];

    try {
      // In production, this would write to database
      // await supabase.from('audit_logs').insert(events);
      
      // Log to console in development
      if (this.config.environment === 'development') {
        console.log(`[Audit] Flushed ${events.length} events`);
      }
    } catch (error) {
      console.error('[Audit] Failed to flush events:', error);
      // Re-buffer on failure
      this.buffer.unshift(...events);
    }
  }

  /**
   * Convenience method for logging admin actions
   */
  async logAdminAction(params: {
    adminId: string;
    action: string;
    resourceType: string;
    resourceId: string;
    changes?: Record<string, { from: any; to: any }>;
    metadata?: Record<string, any>;
  }): Promise<AuditLogEntry> {
    return this.log({
      type: 'admin_action',
      severity: 'info',
      actor: { id: params.adminId, type: 'admin' },
      resource: { type: params.resourceType, id: params.resourceId, action: params.action },
      context: { timestamp: new Date().toISOString(), environment: this.config.environment },
      changes: params.changes,
      metadata: params.metadata,
    });
  }

  /**
   * Convenience method for logging withdrawals
   */
  async logWithdrawal(params: {
    userId: string;
    withdrawalId: string;
    amount: number;
    status: string;
    fraudScore?: number;
    riskLevel?: string;
    metadata?: Record<string, any>;
  }): Promise<AuditLogEntry> {
    return this.log({
      type: 'withdrawal',
      severity: params.status === 'rejected' ? 'warning' : 'info',
      actor: { id: params.userId, type: 'user' },
      resource: { type: 'withdrawal', id: params.withdrawalId, action: params.status },
      context: { timestamp: new Date().toISOString(), environment: this.config.environment },
      metadata: { amount: params.amount, fraudScore: params.fraudScore, riskLevel: params.riskLevel, ...params.metadata },
    });
  }

  /**
   * Convenience method for logging fraud detections
   */
  async logFraudDetection(params: {
    userId: string;
    detectionType: string;
    score: number;
    action: string;
    details: Record<string, any>;
  }): Promise<AuditLogEntry> {
    return this.log({
      type: 'fraud_detection',
      severity: 'critical',
      actor: { id: params.userId, type: 'user' },
      resource: { type: 'fraud_detection', id: params.detectionType, action: params.action },
      context: { timestamp: new Date().toISOString(), environment: this.config.environment },
      metadata: { score: params.score, details: params.details },
    });
  }

  /**
   * Convenience method for logging security alerts
   */
  async logSecurityAlert(params: {
    type: string;
    severity: AuditSeverity;
    message: string;
    details: Record<string, any>;
    actor?: { id: string; type: 'user' | 'admin' | 'system' };
  }): Promise<AuditLogEntry> {
    return this.log({
      type: 'security_alert',
      severity: params.severity,
      actor: params.actor || { id: 'system', type: 'system' },
      resource: { type: 'security', id: params.type, action: 'alert' },
      context: { timestamp: new Date().toISOString(), environment: this.config.environment },
      metadata: { message: params.message, ...params.details },
    });
  }

  /**
   * Get audit buffer statistics
   */
  getStats(): { bufferSize: number; totalEvents: number; lastHash: string } {
    return {
      bufferSize: this.buffer.length,
      totalEvents: this.eventCounter,
      lastHash: this.previousHash,
    };
  }

  /**
   * Verify the integrity of the audit chain
   */
  verifyChain(events: AuditEvent[]): { valid: boolean; brokenAt?: number } {
    let previousHash = '0000000000000000000000000000000000000000000000000000000000000000';

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const expectedHash = event.hash;
      
      // Temporarily set previous hash to calculate
      const tempHash = this.previousHash;
      this.previousHash = previousHash;
      const calculatedHash = this.calculateEventHash(event);
      this.previousHash = tempHash;

      if (calculatedHash !== expectedHash) {
        return { valid: false, brokenAt: i };
      }

      previousHash = expectedHash;
    }

    return { valid: true };
  }
}

// Singleton instance
export const auditLogger = new AuditLogger();