// ============================================
// Integration Layer Types
// Pure TypeScript - No UI dependencies
// ============================================

export type ProviderType = 'ad_network' | 'offerwall' | 'survey';
export type ProviderStatus = 'active' | 'inactive' | 'error' | 'maintenance';
export type ProviderHealth = 'healthy' | 'degraded' | 'down';

export interface ProviderConfig {
  id: string;
  name: string;
  type: ProviderType;
  apiKey?: string;
  apiSecret?: string;
  endpoint: string;
  webhookUrl?: string;
  isEnabled: boolean;
  priority: number;
  countries: string[];
  languages: string[];
  settings: Record<string, any>;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface ProviderMetrics {
  providerId: string;
  timestamp: Date;
  requests: number;
  successes: number;
  failures: number;
  avgLatency: number;
  errorRate: number;
  fillRate: number;
  revenue: number;
  rewards: number;
  consecutiveFailures: number;
}

export interface AdRequest {
  userId: string;
  adType: string;
  placement: string;
  deviceId: string;
  ipAddress: string;
  userAgent: string;
  countryCode: string;
  language: string;
  sessionId: string;
}

export interface AdResponse {
  adId: string;
  adUrl: string;
  adType: string;
  duration: number;
  rewardAmount: number;
  currency: string;
  metadata: Record<string, any>;
}

export interface Offer {
  offerId: string;
  offerName: string;
  offerDescription: string;
  offerType: string;
  rewardAmount: number;
  currency: string;
  estimatedTime: number;
  requirements: string[];
  imageUrl?: string;
  metadata: Record<string, any>;
}

export interface Survey {
  surveyId: string;
  title: string;
  description: string;
  rewardAmount: number;
  currency: string;
  estimatedTime: number;
  difficulty: string;
  qualificationQuestions?: any[];
  countryCode: string;
  language: string;
  metadata: Record<string, any>;
}

export interface CallbackPayload {
  providerId: string;
  eventType: string;
  userId: string;
  referenceId: string;
  amount?: number;
  currency?: string;
  status: string;
  signature: string;
  timestamp: number;
  metadata: Record<string, any>;
}

export interface VerificationResult {
  isValid: boolean;
  isDuplicate: boolean;
  fraudScore: number;
  rewardAmount?: number;
  currency?: string;
  errors: string[];
  warnings: string[];
  metadata: Record<string, any>;
}

export interface ProviderHealthStatus {
  providerId: string;
  status: ProviderHealth;
  lastCheck: Date;
  latency: number;
  errorRate: number;
  consecutiveFailures: number;
  lastError?: string;
  lastSuccess?: Date;
}

export interface RetryPolicy {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors: string[];
}

export interface ProviderSelectionCriteria {
  userId: string;
  countryCode: string;
  language: string;
  providerType: ProviderType;
  userHistory: UserProviderHistory[];
  availableProviders: ProviderConfig[];
}

export interface UserProviderHistory {
  providerId: string;
  lastUsed: Date;
  successCount: number;
  failureCount: number;
  totalEarnings: number;
}

export interface IntegrationError {
  providerId: string;
  code: string;
  message: string;
  statusCode?: number;
  isRetryable: boolean;
  timestamp: Date;
  context: Record<string, any>;
}

export interface WebhookConfig {
  providerId: string;
  secret: string;
  signatureHeader: string;
  timestampHeader: string;
  timestampTolerance: number; // seconds
  replayWindow: number; // seconds
}

export interface QueueConfig {
  maxSize: number;
  batchSize: number;
  processingInterval: number;
  retryDelay: number;
  deadLetterQueue: boolean;
}

export interface MonitoringConfig {
  metricsRetention: number; // days
  alertThreshold: number;
  healthCheckInterval: number; // seconds
  enableDetailedLogging: boolean;
}