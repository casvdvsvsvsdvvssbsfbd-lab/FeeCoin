// ============================================
// Bot Detector
// Detect spam, bots, automation, rapid clicks
// Macro usage, replay attacks, request flooding
// ============================================

export interface BotDetectionResult {
  isBot: boolean;
  score: number;
  factors: {
    rapidClicking: boolean;
    automation: boolean;
    macro: boolean;
    browserAutomation: boolean;
    headless: boolean;
    knownBot: boolean;
    datacenter: boolean;
    suspiciousTiming: boolean;
    replayAttack: boolean;
    requestFlood: boolean;
  };
  confidence: number;
  details: string[];
}

export interface BotDetectorConfig {
  rapidClickThreshold: number;
  rapidClickWindow: number;
  maxRequestsPerSecond: number;
  maxRequestsPerMinute: number;
  suspiciousTimingDeviation: number;
  knownBotUserAgents: string[];
  knownBotIps: string[];
  datacenterIpRanges: string[];
  enableHeuristics: boolean;
  enableBehavioral: boolean;
}

const DEFAULT_CONFIG: BotDetectorConfig = {
  rapidClickThreshold: 5,
  rapidClickWindow: 1000,
  maxRequestsPerSecond: 10,
  maxRequestsPerMinute: 100,
  suspiciousTimingDeviation: 0.5,
  knownBotUserAgents: [
    'googlebot', 'bingbot', 'yandexbot', 'baiduspider',
    'facebookexternalhit', 'twitterbot', 'slackbot',
    'discordbot', 'telegrambot', 'whatsapp',
    'ahrefsbot', 'semrushbot', 'mj12bot',
    'dotbot', 'rogerbot', 'exabot',
  ],
  knownBotIps: [],
  datacenterIpRanges: [],
  enableHeuristics: true,
  enableBehavioral: true,
};

export class BotDetector {
  private config: BotDetectorConfig;
  private requestTimestamps: Map<string, number[]> = new Map();
  private clickTimestamps: Map<string, number[]> = new Map();
  private timingPatterns: Map<string, number[]> = new Map();

  constructor(config: Partial<BotDetectorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Detect if request is from a bot
   */
  detect(params: {
    userId?: string;
    ip: string;
    userAgent: string;
    timestamp?: number;
    headers?: Record<string, string>;
    endpoint?: string;
  }): BotDetectionResult {
    const factors = {
      rapidClicking: false,
      automation: false,
      macro: false,
      browserAutomation: false,
      headless: false,
      knownBot: false,
      datacenter: false,
      suspiciousTiming: false,
      replayAttack: false,
      requestFlood: false,
    };

    const details: string[] = [];
    let score = 0;

    // 1. Check known bot user agents
    const ua = (params.userAgent || '').toLowerCase();
    for (const botUa of this.config.knownBotUserAgents) {
      if (ua.includes(botUa)) {
        factors.knownBot = true;
        details.push(`Known bot user agent: ${botUa}`);
        score += 30;
        break;
      }
    }

    // 2. Check browser automation
    if (this.detectBrowserAutomation(params)) {
      factors.browserAutomation = true;
      details.push('Browser automation detected');
      score += 25;
    }

    // 3. Check headless browser
    if (this.detectHeadlessBrowser(params)) {
      factors.headless = true;
      details.push('Headless browser detected');
      score += 25;
    }

    // 4. Check rapid clicking
    if (this.detectRapidClicking(params)) {
      factors.rapidClicking = true;
      details.push('Rapid clicking detected');
      score += 20;
    }

    // 5. Check request flooding
    if (this.detectRequestFlood(params)) {
      factors.requestFlood = true;
      details.push('Request flooding detected');
      score += 30;
    }

    // 6. Check suspicious timing
    if (this.detectSuspiciousTiming(params)) {
      factors.suspiciousTiming = true;
      details.push('Suspicious timing pattern detected');
      score += 15;
    }

    // 7. Check macro/automation patterns
    if (this.detectAutomationPatterns(params)) {
      factors.automation = true;
      details.push('Automation pattern detected');
      score += 25;
    }

    // 8. Check datacenter IP
    if (this.isDatacenterIp(params.ip)) {
      factors.datacenter = true;
      details.push('Datacenter IP detected');
      score += 15;
    }

    // 9. Check known bot IPs
    if (this.config.knownBotIps.includes(params.ip)) {
      factors.knownBot = true;
      details.push('Known bot IP');
      score += 40;
    }

    // Normalize score
    score = Math.min(score, 100);

    return {
      isBot: score >= 50,
      score,
      factors,
      confidence: score / 100,
      details,
    };
  }

  /**
   * Detect browser automation tools
   */
  private detectBrowserAutomation(params: {
    userAgent: string;
    headers?: Record<string, string>;
  }): boolean {
    const ua = (params.userAgent || '').toLowerCase();
    const automationPatterns = [
      'selenium', 'webdriver', 'puppeteer', 'playwright',
      'phantomjs', 'headless', 'cypress', 'nightwatch',
      'protractor', 'chromium', 'chrome-headless',
      'electron', 'nwjs',
    ];

    // Check user agent for automation indicators
    for (const pattern of automationPatterns) {
      if (ua.includes(pattern)) return true;
    }

    // Check headers for automation indicators
    const headers = params.headers || {};
    const headerValues = Object.values(headers).join(' ').toLowerCase();
    for (const pattern of automationPatterns) {
      if (headerValues.includes(pattern)) return true;
    }

    return false;
  }

  /**
   * Detect headless browser
   */
  private detectHeadlessBrowser(params: {
    headers?: Record<string, string>;
  }): boolean {
    const headers = params.headers || {};

    // Headless Chrome detection
    if (headers['accept-language'] === undefined) return true;
    if (headers['sec-ch-ua'] === undefined) return true;
    if (headers['sec-ch-ua-mobile'] === undefined) return true;
    if (headers['sec-ch-ua-platform'] === undefined) return true;

    // Check for missing typical browser headers
    const requiredHeaders = ['user-agent', 'accept', 'accept-language'];
    const missing = requiredHeaders.filter(h => !headers[h]);
    if (missing.length >= 2) return true;

    return false;
  }

  /**
   * Detect rapid clicking
   */
  private detectRapidClicking(params: {
    userId?: string;
    ip: string;
  }): boolean {
    const key = params.userId || params.ip;
    const now = Date.now();

    // Get timestamps for this user/IP
    const clicks = this.clickTimestamps.get(key) || [];
    const recentClicks = clicks.filter(t => now - t < this.config.rapidClickWindow);

    // Add current timestamp
    recentClicks.push(now);
    this.clickTimestamps.set(key, recentClicks);

    // Check if exceeds threshold
    return recentClicks.length > this.config.rapidClickThreshold;
  }

  /**
   * Detect request flooding
   */
  private detectRequestFlood(params: {
    userId?: string;
    ip: string;
  }): boolean {
    const key = params.userId || params.ip;
    const now = Date.now();

    // Get timestamps
    const timestamps = this.requestTimestamps.get(key) || [];
    const recentTimestamps = timestamps.filter(t => now - t < 60000);

    // Add current timestamp
    recentTimestamps.push(now);
    this.requestTimestamps.set(key, recentTimestamps);

    // Check per-second limit
    const perSecond = recentTimestamps.filter(t => now - t < 1000).length;
    if (perSecond > this.config.maxRequestsPerSecond) return true;

    // Check per-minute limit
    if (recentTimestamps.length > this.config.maxRequestsPerMinute) return true;

    return false;
  }

  /**
   * Detect suspicious timing patterns
   */
  private detectSuspiciousTiming(params: {
    userId?: string;
    ip: string;
  }): boolean {
    const key = params.userId || params.ip;
    const now = Date.now();

    const timings = this.timingPatterns.get(key) || [];
    timings.push(now);
    this.timingPatterns.set(key, timings.slice(-20)); // Keep last 20

    if (timings.length < 5) return false;

    // Calculate intervals
    const intervals: number[] = [];
    for (let i = 1; i < timings.length; i++) {
      intervals.push(timings[i] - timings[i - 1]);
    }

    // Check for uniform intervals (bot-like)
    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const deviations = intervals.map(i => Math.abs(i - avg));
    const avgDeviation = deviations.reduce((a, b) => a + b, 0) / deviations.length;

    // Low deviation suggests automation
    return avgDeviation / avg < this.config.suspiciousTimingDeviation;
  }

  /**
   * Detect automation patterns
   */
  private detectAutomationPatterns(params: {
    headers?: Record<string, string>;
  }): boolean {
    const headers = params.headers || {};

    // Check for automation tool headers
    const automationHeaders = [
      'x-automation-tool', 'x-selenium', 'x-puppeteer',
      'x-playwright', 'x-cypress',
    ];

    for (const header of automationHeaders) {
      if (headers[header]) return true;
    }

    // Check for missing security headers that browsers always send
    if (headers['sec-fetch-site'] === undefined) {
      // Might be automation
    }

    return false;
  }

  /**
   * Check if IP is from a datacenter
   */
  private isDatacenterIp(ip: string): boolean {
    // In production, this would check against cloud provider IP ranges
    // AWS, GCP, Azure, DigitalOcean, etc.
    return this.config.datacenterIpRanges.some(range => ip.startsWith(range));
  }

  /**
   * Track replay attack detection
   */
  detectReplay(params: {
    requestHash: string;
    timestamp: number;
    windowMs: number;
  }): boolean {
    // Replay detection is handled by TelegramValidator
    return false;
  }

  /**
   * Get detection statistics
   */
  getStats(): {
    trackedUsers: number;
    trackedIps: number;
  } {
    return {
      trackedUsers: this.timingPatterns.size,
      trackedIps: this.requestTimestamps.size,
    };
  }

  /**
   * Cleanup old data
   */
  cleanup(): void {
    const now = Date.now();
    const maxAge = 3600000; // 1 hour

    for (const [key, timestamps] of this.requestTimestamps) {
      const filtered = timestamps.filter(t => now - t < maxAge);
      if (filtered.length === 0) {
        this.requestTimestamps.delete(key);
      } else {
        this.requestTimestamps.set(key, filtered);
      }
    }

    for (const [key, clicks] of this.clickTimestamps) {
      const filtered = clicks.filter(t => now - t < 10000); // 10 seconds
      if (filtered.length === 0) {
        this.clickTimestamps.delete(key);
      } else {
        this.clickTimestamps.set(key, filtered);
      }
    }
  }
}

// Singleton instance
export const botDetector = new BotDetector();