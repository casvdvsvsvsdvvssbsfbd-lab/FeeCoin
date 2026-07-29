// ============================================
// Callback Engine
// Universal callback handler for all providers
// ============================================

import { CallbackPayload, VerificationResult, WebhookConfig, IntegrationError } from '../types';

export interface CallbackHandler {
  handleCallback(payload: CallbackPayload): Promise<VerificationResult>;
}

export interface CallbackQueue {
  enqueue(payload: CallbackPayload): Promise<void>;
  process(): Promise<void>;
  size(): number;
}

export class CallbackEngine implements CallbackHandler {
  private webhookConfigs: Map<string, WebhookConfig> = new Map();
  private processedCallbacks: Set<string> = new Set();
  private callbackQueue: CallbackPayload[] = [];
  private isProcessing: boolean = false;

  constructor() {
    // Initialize with default webhook configs
    this.initializeDefaultConfigs();
  }

  /**
   * Register webhook configuration for a provider
   */
  registerWebhookConfig(providerId: string, config: WebhookConfig): void {
    this.webhookConfigs.set(providerId, config);
  }

  /**
   * Handle incoming callback from provider
   */
  async handleCallback(payload: CallbackPayload): Promise<VerificationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // 1. Validate provider
      const webhookConfig = this.webhookConfigs.get(payload.providerId);
      if (!webhookConfig) {
        return {
          isValid: false,
          isDuplicate: false,
          fraudScore: 1.0,
          errors: [`Unknown provider: ${payload.providerId}`],
          warnings: [],
          metadata: {}
        };
      }

      // 2. Validate timestamp (replay protection)
      const timestampValid = this.validateTimestamp(payload.timestamp, webhookConfig.timestampTolerance);
      if (!timestampValid) {
        errors.push(`Invalid timestamp: ${payload.timestamp}`);
      }

      // 3. Validate signature
      const signatureValid = await this.validateSignature(payload, webhookConfig);
      if (!signatureValid) {
        errors.push('Invalid signature');
      }

      // 4. Check for duplicates (idempotency)
      const callbackId = this.generateCallbackId(payload);
      const isDuplicate = this.processedCallbacks.has(callbackId);
      if (isDuplicate) {
        warnings.push('Duplicate callback detected');
      }

      // 5. Check replay window
      const withinReplayWindow = this.isWithinReplayWindow(payload.timestamp, webhookConfig.replayWindow);
      if (!withinReplayWindow) {
        errors.push(`Callback outside replay window: ${payload.timestamp}`);
      }

      // 6. Validate payload
      const payloadValid = this.validatePayload(payload);
      if (!payloadValid) {
        errors.push('Invalid payload structure');
      }

      // 7. Fraud detection
      const fraudScore = this.calculateFraudScore(payload);
      if (fraudScore > 0.7) {
        warnings.push(`High fraud score: ${fraudScore}`);
      }

      // 8. Mark as processed
      if (!isDuplicate && errors.length === 0) {
        this.processedCallbacks.add(callbackId);
        
        // Cleanup old callbacks (keep last 24 hours)
        this.cleanupOldCallbacks();
      }

      const isValid = errors.length === 0;

      return {
        isValid,
        isDuplicate,
        fraudScore,
        rewardAmount: payload.amount,
        currency: payload.currency,
        errors,
        warnings,
        metadata: {
          callbackId,
          timestamp: new Date(payload.timestamp).toISOString(),
          providerId: payload.providerId,
          eventType: payload.eventType,
          userId: payload.userId,
          referenceId: payload.referenceId
        }
      };
    } catch (error) {
      return {
        isValid: false,
        isDuplicate: false,
        fraudScore: 1.0,
        errors: [`Callback processing error: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings: [],
        metadata: { originalPayload: payload }
      };
    }
  }

  /**
   * Enqueue callback for async processing
   */
  async enqueue(payload: CallbackPayload): Promise<void> {
    this.callbackQueue.push(payload);
    
    // Start processing if not already running
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  /**
   * Process queued callbacks
   */
  private async processQueue(): Promise<void> {
    this.isProcessing = true;

    while (this.callbackQueue.length > 0) {
      const batch = this.callbackQueue.splice(0, 10); // Process in batches of 10
      
      await Promise.all(
        batch.map(payload => this.handleCallback(payload))
      );

      // Small delay between batches
      await this.sleep(100);
    }

    this.isProcessing = false;
  }

  /**
   * Get queue size
   */
  size(): number {
    return this.callbackQueue.length;
  }

  /**
   * Validate timestamp
   */
  private validateTimestamp(timestamp: number, tolerance: number): boolean {
    const now = Date.now();
    const diff = Math.abs(now - timestamp);
    return diff <= tolerance * 1000; // Convert seconds to milliseconds
  }

  /**
   * Validate signature
   */
  private async validateSignature(payload: CallbackPayload, config: WebhookConfig): Promise<boolean> {
    // In production, use proper HMAC verification
    // This is a simplified version
    const expectedSignature = this.generateSignature(payload, config.secret);
    return payload.signature === expectedSignature;
  }

  /**
   * Generate signature
   */
  private generateSignature(payload: CallbackPayload, secret: string): string {
    const data = `${payload.providerId}:${payload.userId}:${payload.referenceId}:${payload.timestamp}`;
    return btoa(data + ':' + secret);
  }

  /**
   * Generate unique callback ID
   */
  private generateCallbackId(payload: CallbackPayload): string {
    return `${payload.providerId}:${payload.referenceId}:${payload.timestamp}`;
  }

  /**
   * Check if within replay window
   */
  private isWithinReplayWindow(timestamp: number, replayWindow: number): boolean {
    const now = Date.now();
    const diff = now - timestamp;
    return diff >= 0 && diff <= replayWindow * 1000;
  }

  /**
   * Validate payload structure
   */
  private validatePayload(payload: CallbackPayload): boolean {
    return !!(
      payload.providerId &&
      payload.userId &&
      payload.referenceId &&
      payload.status &&
      payload.signature &&
      payload.timestamp
    );
  }

  /**
   * Calculate fraud score
   */
  private calculateFraudScore(payload: CallbackPayload): number {
    let score = 0;

    // Check for suspicious patterns
    if (!payload.metadata || Object.keys(payload.metadata).length === 0) {
      score += 0.2; // Missing metadata
    }

    // Check amount (unusually high amounts)
    if (payload.amount && payload.amount > 1000) {
      score += 0.3;
    }

    // Check timestamp (too old or in future)
    const now = Date.now();
    const timestampAge = now - payload.timestamp;
    if (timestampAge < 0) {
      score += 0.5; // Future timestamp
    } else if (timestampAge > 3600000) { // 1 hour
      score += 0.2;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Cleanup old callbacks
   */
  private cleanupOldCallbacks(): void {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    
    // Keep only recent callbacks
    const recentCallbacks = Array.from(this.processedCallbacks).filter(callbackId => {
      const timestamp = parseInt(callbackId.split(':')[2]);
      return timestamp > oneDayAgo;
    });

    this.processedCallbacks = new Set(recentCallbacks);
  }

  /**
   * Initialize default webhook configs
   */
  private initializeDefaultConfigs(): void {
    // Default configs for known providers
    const defaultConfigs: WebhookConfig[] = [
      {
        providerId: 'adsgram',
        secret: 'adsgram_secret',
        signatureHeader: 'X-Adsgram-Signature',
        timestampHeader: 'X-Adsgram-Timestamp',
        timestampTolerance: 300,
        replayWindow: 600
      },
      {
        providerId: 'monetag',
        secret: 'monetag_secret',
        signatureHeader: 'X-Monetag-Signature',
        timestampHeader: 'X-Monetag-Timestamp',
        timestampTolerance: 300,
        replayWindow: 600
      },
      {
        providerId: 'lootably',
        secret: 'lootably_secret',
        signatureHeader: 'X-Lootably-Signature',
        timestampHeader: 'X-Lootably-Timestamp',
        timestampTolerance: 300,
        replayWindow: 600
      }
    ];

    defaultConfigs.forEach(config => {
      this.webhookConfigs.set(config.providerId, config);
    });
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clear callback history (for testing)
   */
  clearHistory(): void {
    this.processedCallbacks.clear();
  }

  /**
   * Get callback statistics
   */
  getStatistics(): {
    processed: number;
    duplicates: number;
    queueSize: number;
  } {
    return {
      processed: this.processedCallbacks.size,
      duplicates: 0, // Would track separately in production
      queueSize: this.callbackQueue.length
    };
  }
}