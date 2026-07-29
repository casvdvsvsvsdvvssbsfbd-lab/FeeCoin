// ============================================
// Base Ad Provider
// Abstract base for all ad network providers
// ============================================

import {
  ProviderConfig,
  AdRequest,
  AdResponse,
  VerificationResult,
  IntegrationError,
  RetryPolicy
} from '../types';
import { BaseProvider, IAdProvider } from './provider';

export abstract class BaseAdProvider extends BaseProvider implements IAdProvider {
  constructor(config: ProviderConfig) {
    super(config);
  }

  protected abstract createEmptyMetrics(): any;
  protected abstract createDefaultRetryPolicy(): RetryPolicy;
  abstract requestAd(request: AdRequest): Promise<AdResponse>;
  abstract verifyReward(adId: string, userId: string): Promise<VerificationResult>;
  abstract validateSignature(payload: string, signature: string): Promise<boolean>;

  async requestAdWithRetry(request: AdRequest): Promise<AdResponse> {
    return this.withRetry(async () => {
      const startTime = Date.now();
      
      try {
        const response = await this.requestAd(request);
        
        const latency = Date.now() - startTime;
        this.updateMetrics(true, latency);
        
        return response;
      } catch (error) {
        const latency = Date.now() - startTime;
        this.updateMetrics(false, latency);
        
        throw this.handleAdError(error);
      }
    });
  }

  async verifyRewardWithRetry(adId: string, userId: string): Promise<VerificationResult> {
    return this.withRetry(async () => {
      const startTime = Date.now();
      
      try {
        const result = await this.verifyReward(adId, userId);
        
        const latency = Date.now() - startTime;
        this.updateMetrics(result.isValid, latency);
        
        return result;
      } catch (error) {
        const latency = Date.now() - startTime;
        this.updateMetrics(false, latency);
        
        throw this.handleAdError(error);
      }
    });
  }

  protected handleAdError(error: any): IntegrationError {
    const code = this.extractErrorCode(error);
    const isRetryable = this.isRetryableAdError(code);
    
    return this.createIntegrationError(
      code,
      error.message || 'Ad request failed',
      isRetryable,
      { originalError: error }
    );
  }

  protected isRetryableAdError(code: string): boolean {
    const retryableErrors = [
      'TIMEOUT',
      'NETWORK_ERROR',
      'RATE_LIMIT',
      'HTTP_500',
      'HTTP_502',
      'HTTP_503',
      'HTTP_504'
    ];
    
    return retryableErrors.includes(code);
  }

  protected validateAdRequest(request: AdRequest): void {
    if (!request.userId) {
      throw new Error('User ID is required');
    }
    if (!request.adType) {
      throw new Error('Ad type is required');
    }
    if (!request.deviceId) {
      throw new Error('Device ID is required');
    }
    if (!request.countryCode) {
      throw new Error('Country code is required');
    }
  }

  protected generateAdSignature(
    userId: string,
    adId: string,
    timestamp: number,
    secret: string
  ): string {
    const data = `${userId}:${adId}:${timestamp}`;
    return btoa(data + ':' + secret);
  }

  protected verifyAdSignature(
    userId: string,
    adId: string,
    timestamp: number,
    signature: string,
    secret: string
  ): boolean {
    const expectedSignature = this.generateAdSignature(userId, adId, timestamp, secret);
    return signature === expectedSignature;
  }
}