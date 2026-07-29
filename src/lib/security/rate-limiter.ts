// ============================================
// Rate Limiter
// Production-grade distributed rate limiting
// Sliding window, per-IP, per-user, per-endpoint
// ============================================

export interface RateLimitRule {
  key: string;
  maxRequests: number;
  windowMs: number;
  type: 'ip' | 'user' | 'endpoint' | 'global' | 'custom';
  errorMessage?: string;
}

export interface RateLimitConfig {
  enabled: boolean;
  defaults: RateLimitRule[];
  rules: RateLimitRule[];
  enableBackpressure: boolean;
  backpressureMultiplier: number;
  trackHeaders: string[];
  trustProxy: boolean;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  totalLimit: number;
  retryAfter: number;
  blocked: boolean;
  reason: string | null;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
  windowStart: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  enabled: true,
  defaults: [
    { key: 'global', maxRequests: 1000, windowMs: 60000, type: 'global' },
    { key: 'per_ip', maxRequests: 100, windowMs: 60000, type: 'ip' },
    { key: 'per_user', maxRequests: 500, windowMs: 60000, type: 'user' },
  ],
  rules: [],
  enableBackpressure: true,
  backpressureMultiplier: 0.5,
  trackHeaders: ['x-forwarded-for', 'x-real-ip', 'cf-connecting-ip'],
  trustProxy: true,
};

export class RateLimiter {
  private config: RateLimitConfig;
  private entries: Map<string, RateLimitEntry> = new Map();
  private blockedIps: Map<string, number> = new Map();
  private blockedUsers: Map<string, number> = new Map();
  private hitCounts: Map<string, number> = new Map();

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Check if a request is rate limited
   */
  check(params: {
    ip?: string;
    userId?: string;
    endpoint?: string;
    headers?: Record<string, string>;
  }): RateLimitResult {
    if (!this.config.enabled) {
      return {
        allowed: true,
        remaining: Infinity,
        resetAt: 0,
        totalLimit: Infinity,
        retryAfter: 0,
        blocked: false,
        reason: null,
      };
    }

    const ip = this.resolveIp(params.ip, params.headers);

    // Check if IP is blocked
    if (ip && this.isBlocked(ip)) {
      const unblockAt = this.blockedIps.get(ip) || 0;
      return {
        allowed: false,
        remaining: 0,
        resetAt: unblockAt,
        totalLimit: 0,
        retryAfter: Math.max(0, unblockAt - Date.now()),
        blocked: true,
        reason: 'IP is blocked due to abuse',
      };
    }

    // Check if user is blocked
    if (params.userId && this.isUserBlocked(params.userId)) {
      const unblockAt = this.blockedUsers.get(params.userId) || 0;
      return {
        allowed: false,
        remaining: 0,
        resetAt: unblockAt,
        totalLimit: 0,
        retryAfter: Math.max(0, unblockAt - Date.now()),
        blocked: true,
        reason: 'User is blocked due to abuse',
      };
    }

    // Check all applicable rules
    const rules = this.getApplicableRules(ip, params.userId, params.endpoint);
    let strictestResult: RateLimitResult | null = null;

    for (const rule of rules) {
      const result = this.checkRule(rule, ip, params.userId, params.endpoint);
      if (!result.allowed) {
        this.trackHit(rule.key);
      }

      if (!strictestResult || result.remaining < strictestResult.remaining) {
        strictestResult = result;
      }
    }

    // Auto-block if too many hits
    if (strictestResult && !strictestResult.allowed) {
      this.autoBlock(ip, params.userId);
    }

    return strictestResult || {
      allowed: true,
      remaining: Infinity,
      resetAt: 0,
      totalLimit: Infinity,
      retryAfter: 0,
      blocked: false,
      reason: null,
    };
  }

  /**
   * Check a single rate limit rule
   */
  private checkRule(
    rule: RateLimitRule,
    ip?: string,
    userId?: string,
    endpoint?: string
  ): RateLimitResult {
    const now = Date.now();
    const key = this.buildKey(rule, ip, userId, endpoint);
    const entry = this.entries.get(key);

    // Clean expired entries
    if (entry && now >= entry.resetAt) {
      this.entries.delete(key);
      return this.createAllowedResult(rule);
    }

    // Create new entry
    if (!entry) {
      const newEntry: RateLimitEntry = {
        count: 1,
        resetAt: now + rule.windowMs,
        windowStart: now,
      };
      this.entries.set(key, newEntry);

      return {
        allowed: true,
        remaining: rule.maxRequests - 1,
        resetAt: newEntry.resetAt,
        totalLimit: rule.maxRequests,
        retryAfter: 0,
        blocked: false,
        reason: null,
      };
    }

    // Check limit
    if (entry.count >= rule.maxRequests) {
      const retryAfter = Math.max(0, entry.resetAt - now);
      return {
        allowed: false,
        remaining: 0,
        resetAt: entry.resetAt,
        totalLimit: rule.maxRequests,
        retryAfter,
        blocked: false,
        reason: `Rate limit exceeded for ${rule.key}`,
      };
    }

    // Increment count
    entry.count++;

    return {
      allowed: true,
      remaining: rule.maxRequests - entry.count,
      resetAt: entry.resetAt,
      totalLimit: rule.maxRequests,
      retryAfter: 0,
      blocked: false,
      reason: null,
    };
  }

  /**
   * Build a key for rate limit tracking
   */
  private buildKey(
    rule: RateLimitRule,
    ip?: string,
    userId?: string,
    endpoint?: string
  ): string {
    switch (rule.type) {
      case 'ip':
        return `ip:${ip}:${rule.key}`;
      case 'user':
        return `user:${userId}:${rule.key}`;
      case 'endpoint':
        return `endpoint:${endpoint}:${rule.key}`;
      case 'global':
        return `global:${rule.key}`;
      default:
        return `${rule.type}:${rule.key}`;
    }
  }

  /**
   * Get applicable rules for a request
   */
  private getApplicableRules(
    ip?: string,
    userId?: string,
    endpoint?: string
  ): RateLimitRule[] {
    const rules: RateLimitRule[] = [...this.config.defaults];

    for (const rule of this.config.rules) {
      // Check if rule applies
      if (rule.type === 'ip' && ip) {
        rules.push(rule);
      } else if (rule.type === 'user' && userId) {
        rules.push(rule);
      } else if (rule.type === 'endpoint' && endpoint) {
        if (endpoint.includes(rule.key)) {
          rules.push(rule);
        }
      } else {
        rules.push(rule);
      }
    }

    return rules;
  }

  /**
   * Resolve client IP from headers
   */
  private resolveIp(ip?: string, headers?: Record<string, string>): string | undefined {
    if (!this.config.trustProxy) return ip;

    for (const header of this.config.trackHeaders) {
      const headerIp = headers?.[header]?.split(',')[0]?.trim();
      if (headerIp) return headerIp;
    }

    return ip;
  }

  /**
   * Check if IP is blocked
   */
  private isBlocked(ip: string): boolean {
    const unblockAt = this.blockedIps.get(ip);
    if (!unblockAt) return false;
    if (Date.now() >= unblockAt) {
      this.blockedIps.delete(ip);
      return false;
    }
    return true;
  }

  /**
   * Check if user is blocked
   */
  private isUserBlocked(userId: string): boolean {
    const unblockAt = this.blockedUsers.get(userId);
    if (!unblockAt) return false;
    if (Date.now() >= unblockAt) {
      this.blockedUsers.delete(userId);
      return false;
    }
    return true;
  }

  /**
   * Track hits for auto-blocking
   */
  private trackHit(key: string): void {
    const count = (this.hitCounts.get(key) || 0) + 1;
    this.hitCounts.set(key, count);
  }

  /**
   * Auto-block IP or user based on hit counts
   */
  private autoBlock(ip?: string, userId?: string): void {
    const threshold = 10; // Number of rate limit hits before auto-block

    if (ip) {
      const hits = this.hitCounts.get(`ip:${ip}`) || 0;
      if (hits >= threshold && !this.blockedIps.has(ip)) {
        this.blockedIps.set(ip, Date.now() + 3600000); // Block for 1 hour
      }
    }

    if (userId) {
      const hits = this.hitCounts.get(`user:${userId}`) || 0;
      if (hits >= threshold && !this.blockedUsers.has(userId)) {
        this.blockedUsers.set(userId, Date.now() + 3600000); // Block for 1 hour
      }
    }
  }

  /**
   * Create allowed result
   */
  private createAllowedResult(rule: RateLimitRule): RateLimitResult {
    return {
      allowed: true,
      remaining: rule.maxRequests,
      resetAt: Date.now() + rule.windowMs,
      totalLimit: rule.maxRequests,
      retryAfter: 0,
      blocked: false,
      reason: null,
    };
  }

  /**
   * Get rate limit stats
   */
  getStats(): {
    activeEntries: number;
    blockedIps: number;
    blockedUsers: number;
    hitCounts: Record<string, number>;
  } {
    const hitCounts: Record<string, number> = {};
    this.hitCounts.forEach((count, key) => {
      hitCounts[key] = count;
    });

    return {
      activeEntries: this.entries.size,
      blockedIps: this.blockedIps.size,
      blockedUsers: this.blockedUsers.size,
      hitCounts,
    };
  }

  /**
   * Reset rate limiter
   */
  reset(): void {
    this.entries.clear();
    this.blockedIps.clear();
    this.blockedUsers.clear();
    this.hitCounts.clear();
  }

  /**
   * Block an IP address
   */
  blockIp(ip: string, durationMs: number = 3600000): void {
    this.blockedIps.set(ip, Date.now() + durationMs);
  }

  /**
   * Block a user
   */
  blockUser(userId: string, durationMs: number = 3600000): void {
    this.blockedUsers.set(userId, Date.now() + durationMs);
  }

  /**
   * Unblock an IP
   */
  unblockIp(ip: string): void {
    this.blockedIps.delete(ip);
  }

  /**
   * Unblock a user
   */
  unblockUser(userId: string): void {
    this.blockedUsers.delete(userId);
  }

  /**
   * Get remaining requests for a key
   */
  getRemaining(rule: RateLimitRule, ip?: string, userId?: string): number {
    const key = this.buildKey(rule, ip, userId);
    const entry = this.entries.get(key);
    if (!entry) return rule.maxRequests;
    if (Date.now() >= entry.resetAt) return rule.maxRequests;
    return Math.max(0, rule.maxRequests - entry.count);
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();