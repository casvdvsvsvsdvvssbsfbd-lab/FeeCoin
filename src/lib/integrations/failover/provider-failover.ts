// ============================================
// Provider Failover
// ============================================

import { ProviderConfig, ProviderType, ProviderHealthStatus } from '../types';
import { IAdProvider, IOfferwallProvider, ISurveyProvider } from '../base/provider';
import { CircuitBreaker, CircuitState } from './circuit-breaker';

export interface FailoverConfig {
  maxRetries: number;
  retryDelay: number;
  enableCircuitBreaker: boolean;
  healthCheckBeforeFailover: boolean;
}

export class ProviderFailover {
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();
  private config: FailoverConfig;
  private providerManager: any; // Will be set by ProviderManager

  constructor(config: Partial<FailoverConfig> = {}) {
    this.config = {
      maxRetries: 3,
      retryDelay: 1000,
      enableCircuitBreaker: true,
      healthCheckBeforeFailover: true,
      ...config
    };
  }

  /**
   * Set provider manager reference
   */
  setProviderManager(providerManager: any): void {
    this.providerManager = providerManager;
  }

  /**
   * Execute operation with automatic failover
   */
  async executeWithFailover<T>(
    providerType: ProviderType,
    userId: string,
    operation: (provider: IAdProvider | IOfferwallProvider | ISurveyProvider) => Promise<T>,
    criteria?: Partial<any>
  ): Promise<T> {
    const providers = this.getAvailableProviders(providerType, userId, criteria);
    
    if (providers.length === 0) {
      throw new Error(`No available providers of type ${providerType}`);
    }

    let lastError: Error | null = null;

    for (const provider of providers) {
      try {
        // Check circuit breaker
        if (this.config.enableCircuitBreaker) {
          const breaker = this.getCircuitBreaker(provider.getConfig().id);
          
          if (breaker.isOpen()) {
            continue; // Skip this provider
          }
        }

        // Execute operation
        const result = await this.executeWithRetry(provider, operation);
        
        // Update success metrics
        this.providerManager?.updateUserHistory?.(userId, provider.getConfig().id, true, 0);
        
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        // Update failure metrics
        this.providerManager?.updateUserHistory?.(userId, provider.getConfig().id, false, 0);
        
        // Record failure in circuit breaker
        if (this.config.enableCircuitBreaker) {
          const breaker = this.getCircuitBreaker(provider.getConfig().id);
          // Manually trigger failure tracking
          const stats = breaker.getStatistics();
          if (stats.state === CircuitState.CLOSED) {
            // Circuit will handle this internally on next execute
          }
        }

        // Continue to next provider
        continue;
      }
    }

    throw lastError || new Error('All providers failed');
  }

  /**
   * Get available providers sorted by priority and health
   */
  private getAvailableProviders(
    providerType: ProviderType,
    userId: string,
    criteria?: Partial<any>
  ): (IAdProvider | IOfferwallProvider | ISurveyProvider)[] {
    const allProviders = this.providerManager?.getProvidersByType(providerType) || [];
    
    return allProviders
      .filter((p: IAdProvider | IOfferwallProvider | ISurveyProvider) => {
        const config = p.getConfig();
        return config.isEnabled;
      })
      .sort((a: IAdProvider | IOfferwallProvider | ISurveyProvider, b: IAdProvider | IOfferwallProvider | ISurveyProvider) => {
        const configA = a.getConfig();
        const configB = b.getConfig();
        
        // Sort by priority (higher first)
        return configB.priority - configA.priority;
      });
  }

  /**
   * Execute with retry logic
   */
  private async executeWithRetry<T>(
    p: IAdProvider | IOfferwallProvider | ISurveyProvider,
    operation: (provider: IAdProvider | IOfferwallProvider | ISurveyProvider) => Promise<T>
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
      try {
        return await operation(p);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        // Don't retry on last attempt
        if (attempt < this.config.maxRetries - 1) {
          await this.sleep(this.config.retryDelay * Math.pow(2, attempt));
        }
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }

  /**
   * Get or create circuit breaker for provider
   */
  private getCircuitBreaker(providerId: string): CircuitBreaker {
    if (!this.circuitBreakers.has(providerId)) {
      this.circuitBreakers.set(providerId, new CircuitBreaker());
    }
    return this.circuitBreakers.get(providerId)!;
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get circuit breaker for provider
   */
  getProviderCircuitBreaker(providerId: string): CircuitBreaker | undefined {
    return this.circuitBreakers.get(providerId);
  }

  /**
   * Reset all circuit breakers
   */
  resetAllCircuitBreakers(): void {
    this.circuitBreakers.forEach(breaker => breaker.reset());
  }

  /**
   * Get failover statistics
   */
  getStatistics(): {
    totalCircuitBreakers: number;
    openCircuits: number;
    closedCircuits: number;
    halfOpenCircuits: number;
  } {
    let open = 0;
    let closed = 0;
    let halfOpen = 0;

    this.circuitBreakers.forEach(breaker => {
      const state = breaker.getState();
      switch (state) {
        case CircuitState.OPEN:
          open++;
          break;
        case CircuitState.CLOSED:
          closed++;
          break;
        case CircuitState.HALF_OPEN:
          halfOpen++;
          break;
      }
    });

    return {
      totalCircuitBreakers: this.circuitBreakers.size,
      openCircuits: open,
      closedCircuits: closed,
      halfOpenCircuits: halfOpen
    };
  }
}