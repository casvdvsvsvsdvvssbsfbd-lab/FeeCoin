// ============================================
// Base Provider Interface
// All providers must implement this interface
// ============================================

import {
  ProviderConfig,
  ProviderMetrics,
  AdRequest,
  AdResponse,
  Offer,
  Survey,
  VerificationResult,
  ProviderHealthStatus,
  IntegrationError,
  RetryPolicy
} from '../types';

export interface IProvider {
  // Lifecycle
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
  healthCheck(): Promise<ProviderHealthStatus>;

  // Configuration
  getConfig(): ProviderConfig;
  updateConfig(config: Partial<ProviderConfig>): void;
  isEnabled(): boolean;

  // Metrics
  getMetrics(): ProviderMetrics;
  resetMetrics(): void;

  // Retry Policy
  getRetryPolicy(): RetryPolicy;
}

export interface IAdProvider extends IProvider {
  // Ad operations
  requestAd(request: AdRequest): Promise<AdResponse>;
  verifyReward(adId: string, userId: string): Promise<VerificationResult>;
  validateSignature(payload: string, signature: string): Promise<boolean>;
}

export interface IOfferwallProvider extends IProvider {
  // Offerwall operations
  fetchOffers(userId: string, countryCode: string, language: string): Promise<Offer[]>;
  startOffer(offerId: string, userId: string): Promise<{ redirectUrl: string }>;
  verifyCompletion(offerId: string, userId: string): Promise<VerificationResult>;
  registerRewardCallback(callback: (data: any) => Promise<void>): void;
}

export interface ISurveyProvider extends IProvider {
  // Survey operations
  fetchSurveys(userId: string, countryCode: string, language: string): Promise<Survey[]>;
  startSurvey(surveyId: string, userId: string): Promise<{ surveyUrl: string }>;
  completeSurvey(surveyId: string, userId: string, answers: any): Promise<VerificationResult>;
  checkQualification(surveyId: string, userId: string): Promise<boolean>;
}

export abstract class BaseProvider implements IProvider {
  protected config: ProviderConfig;
  protected metrics: ProviderMetrics;
  protected retryPolicy: RetryPolicy;
  protected isInitialized: boolean = false;

  constructor(config: ProviderConfig) {
    this.config = config;
    this.metrics = this.createEmptyMetrics();
    this.retryPolicy = this.createDefaultRetryPolicy();
  }

  // Abstract methods to be implemented by concrete providers
  protected abstract createEmptyMetrics(): ProviderMetrics;
  protected abstract createDefaultRetryPolicy(): RetryPolicy;

  // Lifecycle methods
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    // Validate configuration
    this.validateConfig();

    // Initialize provider-specific resources
    await this.onInitialize();

    this.isInitialized = true;
  }

  async shutdown(): Promise<void> {
    if (!this.isInitialized) {
      return;
    }

    // Cleanup provider-specific resources
    await this.onShutdown();

    this.isInitialized = false;
  }

  async healthCheck(): Promise<ProviderHealthStatus> {
    const startTime = Date.now();
    
    try {
      await this.onHealthCheck();
      
      const latency = Date.now() - startTime;
      this.updateHealthMetrics(true, latency);

      return {
        providerId: this.config.id,
        status: 'healthy',
        lastCheck: new Date(),
        latency,
        errorRate: this.metrics.errorRate,
        consecutiveFailures: 0,
        lastSuccess: new Date()
      };
    } catch (error) {
      const latency = Date.now() - startTime;
      this.updateHealthMetrics(false, latency);

      return {
        providerId: this.config.id,
        status: 'down',
        lastCheck: new Date(),
        latency,
        errorRate: this.metrics.errorRate,
        consecutiveFailures: this.metrics.consecutiveFailures + 1,
        lastError: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Configuration methods
  getConfig(): ProviderConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<ProviderConfig>): void {
    this.config = { ...this.config, ...config };
  }

  isEnabled(): boolean {
    return this.config.isEnabled;
  }

  // Metrics methods
  getMetrics(): ProviderMetrics {
    return { ...this.metrics };
  }

  resetMetrics(): void {
    this.metrics = this.createEmptyMetrics();
  }

  // Retry policy methods
  getRetryPolicy(): RetryPolicy {
    return { ...this.retryPolicy };
  }

  // Protected methods for subclasses
  protected validateConfig(): void {
    if (!this.config.id) {
      throw new Error('Provider ID is required');
    }
    if (!this.config.name) {
      throw new Error('Provider name is required');
    }
    if (!this.config.endpoint) {
      throw new Error('Provider endpoint is required');
    }
    if (!this.config.apiKey && !this.config.apiSecret) {
      throw new Error('Provider must have either apiKey or apiSecret');
    }
  }

  protected updateMetrics(success: boolean, latency: number): void {
    this.metrics.requests++;
    
    if (success) {
      this.metrics.successes++;
    } else {
      this.metrics.failures++;
    }

    // Update average latency
    const totalLatency = this.metrics.avgLatency * (this.metrics.requests - 1) + latency;
    this.metrics.avgLatency = totalLatency / this.metrics.requests;

    // Update error rate
    this.metrics.errorRate = this.metrics.failures / this.metrics.requests;
  }

  protected updateHealthMetrics(success: boolean, latency: number): void {
    this.updateMetrics(success, latency);
  }

  protected createIntegrationError(
    code: string,
    message: string,
    isRetryable: boolean,
    context: Record<string, any> = {}
  ): IntegrationError {
    return {
      providerId: this.config.id,
      code,
      message,
      isRetryable,
      timestamp: new Date(),
      context: {
        ...context,
        provider: this.config.name,
        endpoint: this.config.endpoint
      }
    };
  }

  // Hook methods for subclasses
  protected async onInitialize(): Promise<void> {
    // Override in subclass if needed
  }

  protected async onShutdown(): Promise<void> {
    // Override in subclass if needed
  }

  protected async onHealthCheck(): Promise<void> {
    // Override in subclass if needed
    // Default implementation: simple ping
    const response = await fetch(this.config.endpoint, {
      method: 'HEAD',
      signal: AbortSignal.timeout(this.config.timeout)
    });
    
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }
  }

  // Utility methods
  protected async withRetry<T>(
    operation: () => Promise<T>,
    retryPolicy?: RetryPolicy
  ): Promise<T> {
    const policy = retryPolicy || this.retryPolicy;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < policy.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');

        // Don't retry on last attempt
        if (attempt === policy.maxAttempts - 1) {
          break;
        }

        // Check if error is retryable
        const errorCode = this.extractErrorCode(error);
        if (!policy.retryableErrors.includes(errorCode)) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          policy.initialDelay * Math.pow(policy.backoffMultiplier, attempt),
          policy.maxDelay
        );

        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  protected extractErrorCode(error: any): string {
    if (error.code) return error.code;
    if (error.statusCode) return `HTTP_${error.statusCode}`;
    if (error.message) {
      // Extract common error codes from message
      if (error.message.includes('timeout')) return 'TIMEOUT';
      if (error.message.includes('network')) return 'NETWORK_ERROR';
      if (error.message.includes('rate limit')) return 'RATE_LIMIT';
      return 'UNKNOWN';
    }
    return 'UNKNOWN';
  }

  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected generateReferenceId(userId: string, action: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `${userId}-${action}-${timestamp}-${random}`;
  }

  protected validateTimestamp(timestamp: number, tolerance: number = 300): boolean {
    const now = Date.now();
    const diff = Math.abs(now - timestamp);
    return diff <= tolerance * 1000; // Convert seconds to milliseconds
  }
}