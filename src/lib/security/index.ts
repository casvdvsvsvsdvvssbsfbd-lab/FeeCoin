// ============================================
// Security Module Index
// Centralized exports for all security services
// ============================================

export { TelegramValidator, telegramValidator, createTelegramValidator } from './telegram-validator';
export type { ValidatedTelegramData, ValidationResult, TelegramValidatorConfig } from './telegram-validator';

export { JwtManager, jwtManager, createJwtManager } from './jwt-manager';
export type { JwtPayload, RefreshTokenPayload, TokenPair, TokenValidationResult, JwtManagerConfig } from './jwt-manager';

export { EncryptionService, encryptionService, createEncryptionService } from './encryption.service';
export type { EncryptionKey, EncryptedData, EncryptionServiceConfig } from './encryption.service';

export { SecretManager, secretManager, createSecretManager } from './secret-manager';
export type { SecretEntry, SecretCategory, SecretManagerConfig } from './secret-manager';

export { InputValidator, inputValidator } from './input-validator';
export type { ValidationRule, ValidationSchema, ValidationResult as InputValidationResult, InputValidatorConfig } from './input-validator';

export { RateLimiter, rateLimiter } from './rate-limiter';
export type { RateLimitConfig, RateLimitResult, RateLimitRule } from './rate-limiter';

export { CsrfProtection, csrfProtection } from './csrf-protection';
export type { CsrfConfig, CsrfTokenData } from './csrf-protection';

export { SecurityHeaders, securityHeaders } from './security-headers';
export type { SecurityHeadersConfig, ContentSecurityPolicy } from './security-headers';

export { AuditLogger, auditLogger } from './audit-logger';
export type { AuditEvent, AuditLogEntry, AuditLoggerConfig } from './audit-logger';

export { BotDetector, botDetector } from './bot-detector';
export type { BotDetectionResult, BotDetectorConfig } from './bot-detector';

export { AbuseDetector, abuseDetector } from './abuse-detector';
export type { AbuseDetectionResult, AbusePattern, AbuseDetectorConfig } from './abuse-detector';

export { WithdrawalGuard, withdrawalGuard } from './withdrawal-guard';
export type { WithdrawalGuardResult, WithdrawalGuardConfig, WithdrawalVerification } from './withdrawal-guard';

export { WebhookGuard, webhookGuard } from './webhook-guard';
export type { WebhookGuardResult, WebhookGuardConfig, WebhookVerification } from './webhook-guard';

export { SecurityMonitor, securityMonitor } from './security-monitor';
export type { SecurityEvent, SecurityMonitorConfig, SecurityAlert } from './security-monitor';

export { SessionManager, sessionManager } from './session-manager';
export type { Session, SessionConfig, SessionDeviceInfo } from './session-manager';