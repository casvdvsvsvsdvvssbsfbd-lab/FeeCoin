// ============================================
// Security Headers
// Production-grade HTTP security headers
// CSP, HSTS, X-Frame-Options, etc.
// ============================================

export interface ContentSecurityPolicy {
  'default-src': string[];
  'script-src': string[];
  'style-src': string[];
  'img-src': string[];
  'font-src': string[];
  'connect-src': string[];
  'frame-src': string[];
  'media-src': string[];
  'object-src': string[];
  'base-uri': string[];
  'form-action': string[];
  'frame-ancestors': string[];
  'worker-src': string[];
  'manifest-src': string[];
  'prefetch-src': string[];
  'report-uri': string[];
  'report-to': string[];
  'upgrade-insecure-requests': boolean;
  'block-all-mixed-content': boolean;
}

export interface SecurityHeadersConfig {
  contentSecurityPolicy: ContentSecurityPolicy;
  strictTransportSecurity: {
    maxAge: number;
    includeSubDomains: boolean;
    preload: boolean;
  };
  xFrameOptions: 'DENY' | 'SAMEORIGIN' | 'ALLOW-FROM';
  xContentTypeOptions: 'nosniff';
  referrerPolicy: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
  permissionsPolicy: Record<string, string[]>;
  crossOriginOpenerPolicy: 'same-origin' | 'same-origin-allow-popups' | 'unsafe-none';
  crossOriginEmbedderPolicy: 'require-corp' | 'unsafe-none' | 'credentialless';
  crossOriginResourcePolicy: 'same-origin' | 'same-site' | 'cross-origin';
  xDnsPrefetchControl: 'on' | 'off';
  xDownloadOptions: 'noopen';
  xPermittedCrossDomainPolicies: 'none' | 'master-only' | 'by-content-type' | 'all';
  expectCt: {
    enforce: boolean;
    maxAge: number;
    reportUri?: string;
  };
}

const DEFAULT_CSP: ContentSecurityPolicy = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://telegram.org'],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:', 'blob:'],
  'font-src': ["'self'", 'data:'],
  'connect-src': ["'self'", 'https://*.supabase.co', 'https://*.telegram.org', 'wss://*.supabase.co'],
  'frame-src': ["'self'", 'https://*.telegram.org'],
  'media-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'self'", 'https://*.telegram.org'],
  'worker-src': ["'self'", 'blob:'],
  'manifest-src': ["'self'"],
  'prefetch-src': ["'self'"],
  'report-uri': [],
  'report-to': [],
  'upgrade-insecure-requests': true,
  'block-all-mixed-content': true,
};

const DEFAULT_CONFIG: SecurityHeadersConfig = {
  contentSecurityPolicy: DEFAULT_CSP,
  strictTransportSecurity: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  xFrameOptions: 'DENY',
  xContentTypeOptions: 'nosniff',
  referrerPolicy: 'strict-origin-when-cross-origin',
  permissionsPolicy: {
    'accelerometer': [],
    'camera': [],
    'display-capture': [],
    'document-domain': [],
    'encrypted-media': [],
    'fullscreen': ["'self'"],
    'geolocation': [],
    'gyroscope': [],
    'magnetometer': [],
    'microphone': [],
    'midi': [],
    'payment': [],
    'picture-in-picture': ["'self'"],
    'publickey-credentials-get': [],
    'screen-wake-lock': [],
    'sync-xhr': [],
    'usb': [],
    'web-share': ["'self'"],
    'xr-spatial-tracking': [],
  },
  crossOriginOpenerPolicy: 'same-origin',
  crossOriginEmbedderPolicy: 'require-corp',
  crossOriginResourcePolicy: 'same-origin',
  xDnsPrefetchControl: 'off',
  xDownloadOptions: 'noopen',
  xPermittedCrossDomainPolicies: 'none',
  expectCt: {
    enforce: true,
    maxAge: 86400,
  },
};

export class SecurityHeaders {
  private config: SecurityHeadersConfig;

  constructor(config: Partial<SecurityHeadersConfig> = {}) {
    this.config = this.mergeConfig(DEFAULT_CONFIG, config);
  }

  /**
   * Merge user config with defaults
   */
  private mergeConfig(base: SecurityHeadersConfig, override: Partial<SecurityHeadersConfig>): SecurityHeadersConfig {
    return {
      ...base,
      ...override,
      contentSecurityPolicy: {
        ...base.contentSecurityPolicy,
        ...override.contentSecurityPolicy,
      },
      strictTransportSecurity: {
        ...base.strictTransportSecurity,
        ...override.strictTransportSecurity,
      },
      permissionsPolicy: {
        ...base.permissionsPolicy,
        ...override.permissionsPolicy,
      },
      expectCt: {
        ...base.expectCt,
        ...override.expectCt,
      },
    };
  }

  /**
   * Generate Content-Security-Policy string
   */
  private buildCspString(): string {
    const csp = this.config.contentSecurityPolicy;
    const directives: string[] = [];

    for (const [key, value] of Object.entries(csp)) {
      if (key === 'upgrade-insecure-requests' && value) {
        directives.push('upgrade-insecure-requests');
        continue;
      }
      if (key === 'block-all-mixed-content' && value) {
        directives.push('block-all-mixed-content');
        continue;
      }
      if (key === 'report-to' || key === 'report-uri') continue;
      if (Array.isArray(value) && value.length > 0) {
        directives.push(`${key} ${value.join(' ')}`);
      }
    }

    // Add report-uri
    if (csp['report-uri'].length > 0) {
      directives.push(`report-uri ${csp['report-uri'].join(' ')}`);
    }

    return directives.join('; ');
  }

  /**
   * Generate Permissions-Policy string
   */
  private buildPermissionsPolicyString(): string {
    const policy = this.config.permissionsPolicy;
    const directives: string[] = [];

    for (const [feature, origins] of Object.entries(policy)) {
      if (origins.length === 0) {
        directives.push(`${feature}=()`);
      } else {
        directives.push(`${feature}=(${origins.join(' ')})`);
      }
    }

    return directives.join(', ');
  }

  /**
   * Get all security headers as record
   */
  getAllHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Security-Policy': this.buildCspString(),
      'Strict-Transport-Security': this.buildHstsString(),
      'X-Frame-Options': this.config.xFrameOptions,
      'X-Content-Type-Options': this.config.xContentTypeOptions,
      'Referrer-Policy': this.config.referrerPolicy,
      'Permissions-Policy': this.buildPermissionsPolicyString(),
      'Cross-Origin-Opener-Policy': this.config.crossOriginOpenerPolicy,
      'Cross-Origin-Embedder-Policy': this.config.crossOriginEmbedderPolicy,
      'Cross-Origin-Resource-Policy': this.config.crossOriginResourcePolicy,
      'X-DNS-Prefetch-Control': this.config.xDnsPrefetchControl,
      'X-Download-Options': this.config.xDownloadOptions,
      'X-Permitted-Cross-Domain-Policies': this.config.xPermittedCrossDomainPolicies,
      'Expect-CT': this.buildExpectCtString(),
    };

    // Remove X-Powered-By (added by default by many frameworks)
    return headers;
  }

  /**
   * Build HSTS string
   */
  private buildHstsString(): string {
    const hsts = this.config.strictTransportSecurity;
    let value = `max-age=${hsts.maxAge}`;
    if (hsts.includeSubDomains) value += '; includeSubDomains';
    if (hsts.preload) value += '; preload';
    return value;
  }

  /**
   * Build Expect-CT string
   */
  private buildExpectCtString(): string {
    const ect = this.config.expectCt;
    let value = `max-age=${ect.maxAge}`;
    if (ect.enforce) value += ', enforce';
    if (ect.reportUri) value += `, report-uri="${ect.reportUri}"`;
    return value;
  }

  /**
   * Get Next.js compatible headers config
   */
  getNextHeaders(): Array<{ key: string; value: string }> {
    const headers = this.getAllHeaders();
    return Object.entries(headers).map(([key, value]) => ({ key, value }));
  }

  /**
   * Update config at runtime
   */
  updateConfig(config: Partial<SecurityHeadersConfig>): void {
    this.config = this.mergeConfig(this.config, config);
  }

  /**
   * Get current config
   */
  getConfig(): Readonly<SecurityHeadersConfig> {
    return { ...this.config };
  }
}

// Singleton instance
export const securityHeaders = new SecurityHeaders();