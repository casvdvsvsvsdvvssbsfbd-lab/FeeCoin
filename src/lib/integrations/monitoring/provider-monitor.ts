// ============================================
// Provider Monitor
// Monitors provider health, performance, and metrics
// ============================================

import { ProviderMetrics, ProviderHealthStatus, IntegrationError, MonitoringConfig } from '../types';

export interface ProviderAlert {
  providerId: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: Date;
  metrics: ProviderMetrics;
}

export interface ProviderReport {
  providerId: string;
  period: { start: Date; end: Date };
  totalRequests: number;
  successRate: number;
  avgLatency: number;
  totalRevenue: number;
  totalRewards: number;
  errorBreakdown: Record<string, number>;
}

export class ProviderMonitor {
  private metrics: Map<string, ProviderMetrics[]> = new Map();
  private alerts: ProviderAlert[] = [];
  private config: MonitoringConfig;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor(config: Partial<MonitoringConfig> = {}) {
    this.config = {
      metricsRetention: 7, // days
      alertThreshold: 0.1, // 10% error rate
      healthCheckInterval: 60, // seconds
      enableDetailedLogging: false,
      ...config
    };
  }

  /**
   * Start monitoring
   */
  start(): void {
    if (this.healthCheckInterval) {
      return;
    }

    // Run health checks periodically
    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks();
    }, this.config.healthCheckInterval * 1000);
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  /**
   * Record provider metrics
   */
  recordMetrics(providerId: string, metrics: ProviderMetrics): void {
    const providerMetrics = this.metrics.get(providerId) || [];
    providerMetrics.push(metrics);
    this.metrics.set(providerId, providerMetrics);

    // Check for alerts
    this.checkAlerts(providerId, metrics);

    // Cleanup old metrics
    this.cleanupOldMetrics(providerId);
  }

  /**
   * Get provider metrics
   */
  getMetrics(providerId: string, hours: number = 24): ProviderMetrics[] {
    const providerMetrics = this.metrics.get(providerId) || [];
    const cutoff = Date.now() - hours * 60 * 60 * 1000;
    
    return providerMetrics.filter(m => m.timestamp.getTime() > cutoff);
  }

  /**
   * Get provider health status
   */
  getHealthStatus(providerId: string): ProviderHealthStatus | null {
    const providerMetrics = this.metrics.get(providerId) || [];
    
    if (providerMetrics.length === 0) {
      return null;
    }

    const latestMetrics = providerMetrics[providerMetrics.length - 1];
    const recentMetrics = providerMetrics.slice(-10); // Last 10 metrics

    const avgLatency = recentMetrics.reduce((sum, m) => sum + m.avgLatency, 0) / recentMetrics.length;
    const errorRate = recentMetrics.reduce((sum, m) => sum + m.errorRate, 0) / recentMetrics.length;
    const consecutiveFailures = this.calculateConsecutiveFailures(recentMetrics);

    let status: 'healthy' | 'degraded' | 'down' = 'healthy';
    
    if (errorRate > 0.5 || consecutiveFailures > 5) {
      status = 'down';
    } else if (errorRate > 0.1 || consecutiveFailures > 2) {
      status = 'degraded';
    }

    return {
      providerId,
      status,
      lastCheck: new Date(),
      latency: avgLatency,
      errorRate,
      consecutiveFailures,
      lastError: this.getLastError(providerMetrics)
    };
  }

  /**
   * Get all alerts
   */
  getAlerts(providerId?: string, severity?: string): ProviderAlert[] {
    let alerts = this.alerts;

    if (providerId) {
      alerts = alerts.filter(a => a.providerId === providerId);
    }

    if (severity) {
      alerts = alerts.filter(a => a.severity === severity);
    }

    return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Generate provider report
   */
  generateReport(providerId: string, days: number = 7): ProviderReport | null {
    const providerMetrics = this.metrics.get(providerId) || [];
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const periodMetrics = providerMetrics.filter(m => m.timestamp.getTime() > cutoff);

    if (periodMetrics.length === 0) {
      return null;
    }

    const totalRequests = periodMetrics.reduce((sum, m) => sum + m.requests, 0);
    const totalSuccesses = periodMetrics.reduce((sum, m) => sum + m.successes, 0);
    const totalFailures = periodMetrics.reduce((sum, m) => sum + m.failures, 0);
    const avgLatency = periodMetrics.reduce((sum, m) => sum + m.avgLatency, 0) / periodMetrics.length;
    const totalRevenue = periodMetrics.reduce((sum, m) => sum + m.revenue, 0);
    const totalRewards = periodMetrics.reduce((sum, m) => sum + m.rewards, 0);

    // Error breakdown
    const errorBreakdown: Record<string, number> = {};
    periodMetrics.forEach(m => {
      // This would track specific error types in production
      errorBreakdown['unknown'] = (errorBreakdown['unknown'] || 0) + m.failures;
    });

    return {
      providerId,
      period: {
        start: new Date(cutoff),
        end: new Date()
      },
      totalRequests,
      successRate: totalRequests > 0 ? totalSuccesses / totalRequests : 0,
      avgLatency,
      totalRevenue,
      totalRewards,
      errorBreakdown
    };
  }

  /**
   * Record error
   */
  recordError(providerId: string, error: IntegrationError): void {
    const metrics = this.createMetricsSnapshot(providerId, false);
    this.recordMetrics(providerId, metrics);

    // Create alert for critical errors
    if (error.isRetryable && error.statusCode && error.statusCode >= 500) {
      this.alerts.push({
        providerId,
        severity: 'error',
        message: `Provider error: ${error.message}`,
        timestamp: new Date(),
        metrics
      });
    }
  }

  /**
   * Check alerts
   */
  private checkAlerts(providerId: string, metrics: ProviderMetrics): void {
    // High error rate alert
    if (metrics.errorRate > this.config.alertThreshold) {
      this.alerts.push({
        providerId,
        severity: metrics.errorRate > 0.3 ? 'critical' : 'warning',
        message: `High error rate: ${(metrics.errorRate * 100).toFixed(2)}%`,
        timestamp: new Date(),
        metrics
      });
    }

    // High latency alert
    if (metrics.avgLatency > 5000) {
      this.alerts.push({
        providerId,
        severity: 'warning',
        message: `High latency: ${metrics.avgLatency}ms`,
        timestamp: new Date(),
        metrics
      });
    }

    // Consecutive failures alert
    if (metrics.consecutiveFailures > 5) {
      this.alerts.push({
        providerId,
        severity: 'error',
        message: `Consecutive failures: ${metrics.consecutiveFailures}`,
        timestamp: new Date(),
        metrics
      });
    }
  }

  /**
   * Perform health checks
   */
  private async performHealthChecks(): Promise<void> {
    // This would check all registered providers
    // Placeholder implementation
  }

  /**
   * Calculate consecutive failures
   */
  private calculateConsecutiveFailures(metrics: ProviderMetrics[]): number {
    let consecutive = 0;
    
    for (let i = metrics.length - 1; i >= 0; i--) {
      if (metrics[i].failures > 0) {
        consecutive++;
      } else {
        break;
      }
    }

    return consecutive;
  }

  /**
   * Get last error message
   */
  private getLastError(metrics: ProviderMetrics[]): string | undefined {
    for (let i = metrics.length - 1; i >= 0; i--) {
      if (metrics[i].failures > 0) {
        return `Error rate: ${(metrics[i].errorRate * 100).toFixed(2)}%`;
      }
    }
    return undefined;
  }

  /**
   * Create metrics snapshot
   */
  private createMetricsSnapshot(providerId: string, success: boolean): ProviderMetrics {
    return {
      providerId,
      timestamp: new Date(),
      requests: 1,
      successes: success ? 1 : 0,
      failures: success ? 0 : 1,
      avgLatency: 0,
      errorRate: success ? 0 : 1,
      fillRate: 0,
      revenue: 0,
      rewards: 0,
      consecutiveFailures: success ? 0 : 1
    };
  }

  /**
   * Cleanup old metrics
   */
  private cleanupOldMetrics(providerId: string): void {
    const providerMetrics = this.metrics.get(providerId) || [];
    const cutoff = Date.now() - this.config.metricsRetention * 24 * 60 * 60 * 1000;
    
    const recentMetrics = providerMetrics.filter(m => m.timestamp.getTime() > cutoff);
    this.metrics.set(providerId, recentMetrics);
  }

  /**
   * Clear all data (for testing)
   */
  clear(): void {
    this.metrics.clear();
    this.alerts = [];
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get monitoring statistics
   */
  getStatistics(): {
    providersMonitored: number;
    totalAlerts: number;
    criticalAlerts: number;
    warningAlerts: number;
  } {
    const criticalAlerts = this.alerts.filter(a => a.severity === 'critical').length;
    const warningAlerts = this.alerts.filter(a => a.severity === 'warning').length;

    return {
      providersMonitored: this.metrics.size,
      totalAlerts: this.alerts.length,
      criticalAlerts,
      warningAlerts
    };
  }
}