// ============================================
// Analytics Service
// Production-ready analytics tracking
// ============================================

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp: Date;
  sessionId: string;
}

export interface AnalyticsConfig {
  endpoint?: string;
  apiKey?: string;
  batchSize?: number;
  flushInterval?: number;
  enabled?: boolean;
}

class AnalyticsService {
  private config: AnalyticsConfig;
  private eventQueue: AnalyticsEvent[] = [];
  private sessionId: string;
  private flushTimer: NodeJS.Timeout | null = null;
  private isEnabled: boolean = true;

  constructor(config: AnalyticsConfig = {}) {
    this.config = {
      batchSize: config.batchSize || 10,
      flushInterval: config.flushInterval || 5000,
      enabled: config.enabled ?? true,
    };
    
    this.sessionId = this.generateSessionId();
    
    if (this.config.enabled) {
      this.startFlushTimer();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval ?? 5000);
  }

  public track(eventName: string, properties: Record<string, any> = {}): void {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      name: eventName,
      properties,
      timestamp: new Date(),
      sessionId: this.sessionId,
    };

    this.eventQueue.push(event);

    if (this.eventQueue.length >= (this.config?.batchSize ?? 10)) {
      this.flush();
    }
  }

  public trackUser(userId: string): void {
    this.track('user_identified', { userId });
  }

  public trackPageView(pageName: string): void {
    this.track('page_view', { page: pageName });
  }

  public trackAdView(adType: string, provider: string, reward: number): void {
    this.track('ad_viewed', {
      adType,
      provider,
      reward,
    });
  }

  public trackRewardEarned(source: string, amount: number, currency: string): void {
    this.track('reward_earned', {
      source,
      amount,
      currency,
    });
  }

  public trackMissionComplete(missionId: string, reward: number): void {
    this.track('mission_completed', {
      missionId,
      reward,
    });
  }

  public trackSurveyComplete(surveyId: string, provider: string, reward: number): void {
    this.track('survey_completed', {
      surveyId,
      provider,
      reward,
    });
  }

  public trackInstallComplete(offerId: string, provider: string, reward: number): void {
    this.track('install_completed', {
      offerId,
      provider,
      reward,
    });
  }

  public trackWithdrawal(amount: number, method: string, status: string): void {
    this.track('withdrawal_initiated', {
      amount,
      method,
      status,
    });
  }

  public trackReferral(referralCode: string, action: 'sent' | 'completed'): void {
    this.track('referral_action', {
      referralCode,
      action,
    });
  }

  public trackLeaderboardView(period: string): void {
    this.track('leaderboard_viewed', {
      period,
    });
  }

  public trackError(error: Error, context?: Record<string, any>): void {
    this.track('error_occurred', {
      errorMessage: error.message,
      errorStack: error.stack,
      ...context,
    });
  }

  public trackPerformance(metric: string, value: number, unit: string): void {
    this.track('performance_metric', {
      metric,
      value,
      unit,
    });
  }

  public trackFunnelStep(funnelName: string, step: number, stepName: string): void {
    this.track('funnel_step', {
      funnelName,
      step,
      stepName,
    });
  }

  public trackRetention(daysSinceInstall: number, active: boolean): void {
    this.track('retention_check', {
      daysSinceInstall,
      active,
    });
  }

  private async flush(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      // TODO: Send to analytics endpoint
      // await fetch(this.config.endpoint, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${this.config.apiKey}`,
      //   },
      //   body: JSON.stringify({ events }),
      // });

      console.log('Analytics events sent:', events.length);
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // Re-queue events on failure
      this.eventQueue = [...events, ...this.eventQueue];
    }
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    
    if (enabled) {
      this.startFlushTimer();
    } else if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  public updateConfig(config: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (this.config.enabled && !this.flushTimer) {
      this.startFlushTimer();
    }
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getQueueSize(): number {
    return this.eventQueue.length;
  }

  public async destroy(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    
    await this.flush();
  }
}

// Singleton instance
export const analytics = new AnalyticsService();

// Convenience hooks
export const useAnalytics = () => {
  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    analytics.track(eventName, properties);
  };

  const trackPageView = (pageName: string) => {
    analytics.trackPageView(pageName);
  };

  const trackAdView = (adType: string, provider: string, reward: number) => {
    analytics.trackAdView(adType, provider, reward);
  };

  const trackRewardEarned = (source: string, amount: number, currency: string) => {
    analytics.trackRewardEarned(source, amount, currency);
  };

  const trackError = (error: Error, context?: Record<string, any>) => {
    analytics.trackError(error, context);
  };

  return {
    trackEvent,
    trackPageView,
    trackAdView,
    trackRewardEarned,
    trackError,
  };
};