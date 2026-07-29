// ============================================
// Webhook Guard
// Secure every provider callback
// Signature verification, timestamp, replay prevention
// IP whitelist, secret verification
// ============================================

import { createHmac, timingSafeEqual } from 'crypto';

export interface WebhookVerification {
  signatureValid: boolean;
  timestampValid: boolean;
  replayPrevented: boolean;
  ipWhitelisted: boolean;
  secretValid: boolean;
}

export interface WebhookGuardResult {
  allowed: boolean;
  verifications: WebhookVerification;
  rejectReason: string | null;
  details: string[];
}

export interface WebhookGuardConfig {
  maxTimestampAge: number;
  replayWindow: number;
  enableIpWhitelist: boolean;
  enableSignatureVerification: boolean;
  enableTimestampCheck: boolean;
  enableReplayPrevention: boolean;
  enableSecretVerification: boolean;
  ipWhitelist: string[];
}

const DEFAULT_CONFIG: WebhookGuardConfig = {
  maxTimestampAge: 300,
  replayWindow: 600,
  enableIpWhitelist: false,
  enableSignatureVerification: true,
  enableTimestampCheck: true,
  enableReplayPrevention: true,
  enableSecretVerification: true,
  ipWhitelist: [],
};

export class WebhookGuard {
  private config: WebhookGuardConfig;
  private processedCallbacks: Set<string> = new Set();
  private providerSecrets: Map<string, string> = new Map();

  constructor(config: Partial<WebhookGuardConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Register provider secret
   */
  registerProviderSecret(providerId: string, secret: string): void {
    this.providerSecrets.set(providerId, secret);
  }

  /**
   * Verify incoming webhook
   */
  verify(params: {
    providerId: string;
    signature: string;
    timestamp: number;
    payload: string;
    ip: string;
    secret?: string;
  }): WebhookGuardResult {
    const verifications: WebhookVerification = {
      signatureValid: false,
      timestampValid: false,
      replayPrevented: false,
      ipWhitelisted: false,
      secretValid: false,
    };

    const details: string[] = [];

    // 1. Signature verification
    if (this.config.enableSignatureVerification) {
      const providerSecret = params.secret || this.providerSecrets.get(params.providerId);
      if (providerSecret) {
        verifications.signatureValid = this.verifySignature(
          params.payload,
          params.signature,
          providerSecret
        );
        if (!verifications.signatureValid) {
          details.push('Invalid webhook signature');
        }
      }
    } else {
      verifications.signatureValid = true;
    }

    // 2. Timestamp verification
    if (this.config.enableTimestampCheck) {
      const now = Math.floor(Date.now() / 1000);
      const age = Math.abs(now - params.timestamp);
      verifications.timestampValid = age <= this.config.maxTimestampAge;
      if (!verifications.timestampValid) {
        details.push(`Timestamp expired: ${age}s old (max: ${this.config.maxTimestampAge}s)`);
      }
    } else {
      verifications.timestampValid = true;
    }

    // 3. Replay prevention
    if (this.config.enableReplayPrevention) {
      const callbackId = `${params.providerId}:${params.timestamp}:${params.signature}`;
      verifications.replayPrevented = !this.processedCallbacks.has(callbackId);
      if (!verifications.replayPrevented) {
        details.push('Duplicate webhook detected - replay attack');
      } else {
        this.processedCallbacks.add(callbackId);
        // Cleanup old entries
        if (this.processedCallbacks.size > 10000) {
          this.cleanupProcessedCallbacks();
        }
      }
    } else {
      verifications.replayPrevented = true;
    }

    // 4. IP whitelist check
    if (this.config.enableIpWhitelist) {
      verifications.ipWhitelisted = this.config.ipWhitelist.includes(params.ip);
      if (!verifications.ipWhitelisted) {
        details.push(`IP not whitelisted: ${params.ip}`);
      }
    } else {
      verifications.ipWhitelisted = true;
    }

    // 5. Secret verification
    if (this.config.enableSecretVerification) {
      const expectedSecret = this.providerSecrets.get(params.providerId);
      if (expectedSecret) {
        const secretBuffer = Buffer.from(params.secret || '');
        const expectedBuffer = Buffer.from(expectedSecret);
        if (secretBuffer.length === expectedBuffer.length) {
          verifications.secretValid = timingSafeEqual(secretBuffer, expectedBuffer);
        }
        if (!verifications.secretValid) {
          details.push('Invalid webhook secret');
        }
      } else {
        verifications.secretValid = true;
      }
    } else {
      verifications.secretValid = true;
    }

    const allowed = verifications.signatureValid && verifications.timestampValid && 
                    verifications.replayPrevented && verifications.ipWhitelisted && 
                    verifications.secretValid;

    return {
      allowed,
      verifications,
      rejectReason: allowed ? null : 'Webhook verification failed',
      details,
    };
  }

  /**
   * Verify webhook signature using HMAC-SHA256
   */
  private verifySignature(payload: string, signature: string, secret: string): boolean {
    try {
      const hmac = createHmac('sha256', secret);
      hmac.update(payload);
      const expectedSignature = hmac.digest('hex');
      
      const sigBuffer = Buffer.from(signature, 'hex');
      const expectedBuffer = Buffer.from(expectedSignature, 'hex');

      if (sigBuffer.length !== expectedBuffer.length) return false;
      return timingSafeEqual(sigBuffer, expectedBuffer);
    } catch {
      return false;
    }
  }

  /**
   * Cleanup old processed callbacks
   */
  private cleanupProcessedCallbacks(): void {
    const now = Math.floor(Date.now() / 1000);
    const window = this.config.replayWindow;
    const entriesToKeep = Array.from(this.processedCallbacks).filter(entry => {
      const timestamp = parseInt(entry.split(':')[1], 10);
      return now - timestamp < window;
    });
    this.processedCallbacks = new Set(entriesToKeep);
  }

  /**
   * Clear processed callbacks
   */
  clearProcessedCallbacks(): void {
    this.processedCallbacks.clear();
  }

  /**
   * Get stats
   */
  getStats(): { registeredProviders: number; processedCallbacks: number } {
    return {
      registeredProviders: this.providerSecrets.size,
      processedCallbacks: this.processedCallbacks.size,
    };
  }

  /**
   * Update config at runtime
   */
  updateConfig(config: Partial<WebhookGuardConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Singleton instance
export const webhookGuard = new WebhookGuard();