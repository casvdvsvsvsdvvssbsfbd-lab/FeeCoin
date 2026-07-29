// ============================================
// Base Offerwall Provider
// Abstract base for all offerwall providers
// ============================================

import {
  ProviderConfig,
  Offer,
  VerificationResult,
  IntegrationError,
  RetryPolicy
} from '../types';
import { BaseProvider, IOfferwallProvider } from './provider';

export abstract class BaseOfferwallProvider extends BaseProvider implements IOfferwallProvider {
  protected rewardCallback?: (data: any) => Promise<void>;

  constructor(config: ProviderConfig) {
    super(config);
  }

  // Abstract methods to be implemented by concrete offerwall providers
  protected abstract createEmptyMetrics(): any;
  protected abstract createDefaultRetryPolicy(): RetryPolicy;
  abstract fetchOffers(userId: string, countryCode: string, language: string): Promise<Offer[]>;
  abstract startOffer(offerId: string, userId: string): Promise<{ redirectUrl: string }>;
  abstract verifyCompletion(offerId: string, userId: string): Promise<VerificationResult>;

  // Callback registration
  registerRewardCallback(callback: (data: any) => Promise<void>): void {
    this.rewardCallback = callback;
  }

  // Common offerwall provider implementation
  async fetchOffersWithRetry(userId: string, countryCode: string, language: string): Promise<Offer[]> {
    return this.withRetry(async () => {
      const startTime = Date.now();
      
      try {
        const offers = await this.fetchOffers(userId, countryCode, language);
        
        const latency = Date.now() - startTime;
        this.updateMetrics(true, latency);
        
        return offers;
      } catch (error) {
        const latency = Date.now() - startTime;
        this.updateMetrics(false, latency);
        
        throw this.handleOfferwallError(error);
      }
    });
  }

  async startOfferWithRetry(offerId: string, userId: string): Promise<{ redirectUrl: string }> {
    return this.withRetry(async () => {
      const startTime = Date.now();
      
      try {
        const result = await this.startOffer(offerId, userId);
        
        const latency = Date.now() - startTime;
        this.updateMetrics(true, latency);
        
        return result;
      } catch (error) {
        const latency = Date.now() - startTime;
        this.updateMetrics(false, latency);
        
        throw this.handleOfferwallError(error);
      }
    });
  }

  async verifyCompletionWithRetry(offerId: string, userId: string): Promise<VerificationResult> {
    return this.withRetry(async () => {
      const startTime = Date.now();
      
      try {
        const result = await this.verifyCompletion(offerId, userId);
        
        const latency = Date.now() - startTime;
        this.updateMetrics(result.isValid, latency);
        
        // Trigger reward callback if verification successful
        if (result.isValid && result.rewardAmount && this.rewardCallback) {
          await this.rewardCallback({
            userId,
            offerId,
            amount: result.rewardAmount,
            currency: result.currency,
            providerId: this.config.id
          });
        }
        
        return result;
      } catch (error) {
        const latency = Date.now() - startTime;
        this.updateMetrics(false, latency);
        
        throw this.handleOfferwallError(error);
      }
    });
  }

  protected handleOfferwallError(error: any): IntegrationError {
    const code = this.extractErrorCode(error);
    const isRetryable = this.isRetryableOfferwallError(code);
    
    return this.createIntegrationError(
      code,
      error.message || 'Offerwall request failed',
      isRetryable,
      { originalError: error }
    );
  }

  protected isRetryableOfferwallError(code: string): boolean {
    const retryableErrors = [
      'TIMEOUT',
      'NETWORK_ERROR',
      'RATE_LIMIT',
      'HTTP_500',
      'HTTP_502',
      'HTTP_503',
      'HTTP_504',
      'NO_OFFERS_AVAILABLE'
    ];
    
    return retryableErrors.includes(code);
  }

  protected validateOfferRequest(offerId: string, userId: string): void {
    if (!userId) {
      throw new Error('User ID is required');
    }
    if (!offerId) {
      throw new Error('Offer ID is required');
    }
  }

  protected generateOfferReference(userId: string, offerId: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `offer-${userId}-${offerId}-${timestamp}-${random}`;
  }

  protected checkDuplicateOffer(userId: string, offerId: string): boolean {
    // This would check against database for duplicate offers
    // Placeholder implementation
    return false;
  }

  protected async notifyReward(data: {
    userId: string;
    offerId: string;
    amount: number;
    currency: string;
    providerId: string;
  }): Promise<void> {
    if (this.rewardCallback) {
      await this.rewardCallback(data);
    }
  }
}