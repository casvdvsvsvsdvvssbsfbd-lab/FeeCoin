// ============================================
// Integrations Index
// ============================================

// Types
export type {
  ProviderType,
  ProviderStatus,
  ProviderHealth,
  ProviderConfig,
  ProviderMetrics,
  AdRequest,
  AdResponse,
  Offer,
  Survey,
  CallbackPayload,
  VerificationResult,
  ProviderHealthStatus,
  RetryPolicy,
  ProviderSelectionCriteria,
  UserProviderHistory,
  IntegrationError,
  WebhookConfig,
  QueueConfig,
  MonitoringConfig
} from './types';

// Base classes
export { BaseProvider, type IProvider, type IAdProvider, type IOfferwallProvider, type ISurveyProvider } from './base/provider';
export { BaseAdProvider } from './base/ad-provider';
export { BaseOfferwallProvider } from './base/offerwall-provider';
export { BaseSurveyProvider } from './base/survey-provider';

// Provider Manager
export { ProviderManager, type ProviderScore } from './provider-manager';

// Callback Engine
export { CallbackEngine, type CallbackHandler, type CallbackQueue } from './callback/callback-engine';

// Monitoring
export { ProviderMonitor, type ProviderAlert, type ProviderReport } from './monitoring/provider-monitor';

// Failover
export { CircuitBreaker, CircuitState } from './failover/circuit-breaker';
export { ProviderFailover, type FailoverConfig } from './failover/provider-failover';

// Rate Limiter
export { RateLimiter, type RateLimitConfig, type RateLimitResult } from './rate-limiter';

// Queue
export { Queue, type QueueJob, type QueueProcessor } from './queue/queue';
export {
  RewardVerificationProcessor,
  CallbackRetryProcessor,
  ProviderSyncProcessor,
  StatisticsRefreshProcessor,
  LeaderboardRefreshProcessor,
  CleanupProcessor,
  AnalyticsAggregationProcessor
} from './queue/processors';

// Providers
export {
  AdsGramProvider,
  AdMobProvider,
  UnityAdsProvider,
  IronSourceProvider,
  AppLovinMAXProvider,
  MonetagProvider,
  OfferToroProvider,
  LootablyProvider,
  CPXResearchProvider,
  BitLabsProvider,
  PollfishProvider,
  InBrainProvider,
  AyetStudiosProvider,
  WannadsProvider,
  AdGateProvider,
  TimeWallProvider
} from './providers';