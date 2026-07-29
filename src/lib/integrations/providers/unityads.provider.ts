// ============================================
// Unity Ads Provider
// ============================================

import { ProviderConfig, AdRequest, AdResponse, VerificationResult } from '../types';
import { BaseAdProvider } from '../base/ad-provider';

export class UnityAdsProvider extends BaseAdProvider {
  protected createEmptyMetrics() {
    return {
      providerId: this.config.id,
      timestamp: new Date(),
      requests: 0,
      successes: 0,
      failures: 0,
      avgLatency: 0,
      errorRate: 0,
      fillRate: 0,
      revenue: 0,
      rewards: 0,
      consecutiveFailures: 0
    };
  }

  protected createDefaultRetryPolicy() {
    return {
      maxAttempts: 3,
      initialDelay: 1000,
      maxDelay: 5000,
      backoffMultiplier: 2,
      retryableErrors: ['TIMEOUT', 'NETWORK_ERROR', 'RATE_LIMIT', 'HTTP_500', 'HTTP_502', 'HTTP_503', 'HTTP_504']
    };
  }

  async requestAd(request: AdRequest): Promise<AdResponse> {
    this.validateAdRequest(request);
    throw new Error('Unity Ads not implemented');
  }

  async verifyReward(adId: string, userId: string): Promise<VerificationResult> {
    return {
      isValid: false,
      isDuplicate: false,
      fraudScore: 0,
      errors: ['Not implemented'],
      warnings: [],
      metadata: {}
    };
  }

  async validateSignature(payload: string, signature: string): Promise<boolean> {
    return false;
  }

  async initialize(): Promise<void> {
    await super.initialize();
  }

  async shutdown(): Promise<void> {
    await super.shutdown();
  }
}