// ============================================
// Monetag Provider
// ============================================

import { ProviderConfig, AdRequest, AdResponse, VerificationResult } from '../types';
import { BaseAdProvider } from '../base/ad-provider';

export class MonetagProvider extends BaseAdProvider {
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

    await this.waitForMonetagSdk();

    return new Promise((resolve, reject) => {
      try {
        if (typeof (window as any).show_11548562 === 'function') {
          (window as any).show_11548562("pop");
          // Assuming a successful call means the ad is shown or will attempt to show.
          // Monetag SDK doesn't provide a direct callback for ad display success/failure in this context.
          // We'll consider it successful if the function call doesn't throw.
          resolve({
            adId: `monetag-${Date.now()}`,
            adUrl: 'https://monetag.com/pop',
            adType: 'pop',
            duration: 0, // Placeholder, actual duration unknown from client-side call
            rewardAmount: 0, // Placeholder, actual reward handled by backend postback
            currency: 'FC', // Assuming 'FC' as the project's currency
            metadata: {},
          });
        } else {
          reject(new Error("Monetag SDK function not found."));
        }
      } catch (error: unknown) {
        console.error("Monetag ad display error:", error);
        reject(new Error(`Failed to display Monetag ad: ${(error as Error).message}`));
      }
    });
  }

  private waitForMonetagSdk(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof (window as any).show_11548562 === 'function') {
        resolve();
        return;
      }

      const interval = setInterval(() => {
        if (typeof (window as any).show_11548562 === 'function') {
          clearInterval(interval);
          resolve();
        }
      }, 100);

      // Add a timeout to prevent infinite waiting
      setTimeout(() => {
        clearInterval(interval);
        if (typeof (window as any).show_11548562 !== 'function') {
          console.warn("Monetag SDK function did not become available within timeout.");
          resolve(); // Resolve anyway to not block the app, but log a warning
        }
      }, 5000); // 5 seconds timeout
    });
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
