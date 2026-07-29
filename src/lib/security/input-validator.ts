// ============================================
// Input Validator
// Production-grade input validation and sanitization
// Prevents injection attacks, XSS, SQL injection
// ============================================

export type ValidationType = 'string' | 'number' | 'boolean' | 'email' | 'url' | 'phone' | 'uuid' | 'date' | 'object' | 'array' | 'telegram_id' | 'amount' | 'wallet_address' | 'hex_color' | 'ip_address' | 'country_code' | 'language_code';

export interface ValidationRule {
  type: ValidationType;
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: string[];
  custom?: (value: any) => boolean | string;
  sanitize?: boolean;
  trim?: boolean;
  escapeHtml?: boolean;
  maxLength?: number;
  minLength?: number;
}

export interface ValidationSchema {
  [field: string]: ValidationRule;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  sanitized: Record<string, any>;
}

export interface InputValidatorConfig {
  strictMode: boolean;
  maxDepth: number;
  maxArrayLength: number;
  maxStringLength: number;
  allowedTags: string[];
  blockedPatterns: RegExp[];
}

const DEFAULT_CONFIG: InputValidatorConfig = {
  strictMode: true,
  maxDepth: 5,
  maxArrayLength: 1000,
  maxStringLength: 10000,
  allowedTags: [],
  blockedPatterns: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript\s*:/gi,
    /on\w+\s*=/gi,
    /data:\s*text\/html/gi,
    /vbscript\s*:/gi,
    /expression\s*\(/gi,
    /-moz-binding\s*:/gi,
    /<\s*\/?\s*script/gi,
    /<\s*\/?\s*iframe/gi,
    /<\s*\/?\s*object/gi,
    /<\s*\/?\s*embed/gi,
    /<\s*\/?\s*link/gi,
    /<\s*\/?\s*meta/gi,
    /<\s*\/?\s*style/gi,
    /<\s*\/?\s*form/gi,
    /<\s*\/?\s*input/gi,
    /<\s*\/?\s*textarea/gi,
    /<\s*\/?\s*select/gi,
    /<\s*\/?\s*button/gi,
  ],
};

export class InputValidator {
  private config: InputValidatorConfig;

  constructor(config: Partial<InputValidatorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Validate data against a schema
   */
  validate(data: Record<string, any>, schema: ValidationSchema): ValidationResult {
    const errors: Record<string, string> = {};
    const sanitized: Record<string, any> = {};

    for (const [field, rule] of Object.entries(schema)) {
      const value = data[field];

      // Check required
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors[field] = `${field} is required`;
        continue;
      }

      // Skip if not required and empty
      if (value === undefined || value === null || value === '') {
        sanitized[field] = rule.type === 'string' ? '' : value;
        continue;
      }

      // Validate type and sanitize
      const result = this.validateValue(value, rule, field);
      if (!result.valid) {
        errors[field] = result.error!;
      } else {
        sanitized[field] = result.sanitized;
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
      sanitized,
    };
  }

  /**
   * Validate a single value
   */
  private validateValue(
    value: any,
    rule: ValidationRule,
    field: string
  ): { valid: boolean; error?: string; sanitized: any } {
    // Check blocked patterns
    if (typeof value === 'string') {
      for (const pattern of this.config.blockedPatterns) {
        if (pattern.test(value)) {
          return { valid: false, error: `${field} contains blocked content`, sanitized: value };
        }
      }
    }

    switch (rule.type) {
      case 'string':
        return this.validateString(value, rule, field);
      case 'number':
      case 'amount':
        return this.validateNumber(value, rule, field);
      case 'boolean':
        return this.validateBoolean(value, field);
      case 'email':
        return this.validateEmail(value, field);
      case 'url':
        return this.validateUrl(value, field);
      case 'phone':
        return this.validatePhone(value, field);
      case 'uuid':
        return this.validateUuid(value, field);
      case 'date':
        return this.validateDate(value, field);
      case 'telegram_id':
        return this.validateTelegramId(value, field);
      case 'wallet_address':
        return this.validateWalletAddress(value, field);
      case 'ip_address':
        return this.validateIpAddress(value, field);
      case 'country_code':
        return this.validateCountryCode(value, field);
      case 'language_code':
        return this.validateLanguageCode(value, field);
      case 'object':
        return this.validateObject(value, rule, field);
      case 'array':
        return this.validateArray(value, rule, field);
      default:
        return { valid: true, sanitized: value };
    }
  }

  /**
   * Validate string
   */
  private validateString(
    value: any,
    rule: ValidationRule,
    field: string
  ): { valid: boolean; error?: string; sanitized: any } {
    if (typeof value !== 'string') {
      return { valid: false, error: `${field} must be a string`, sanitized: value };
    }

    let sanitized = value;

    // Trim
    if (rule.trim !== false) {
      sanitized = sanitized.trim();
    }

    // Check min length
    if (rule.minLength !== undefined && sanitized.length < rule.minLength) {
      return { valid: false, error: `${field} must be at least ${rule.minLength} characters`, sanitized };
    }

    // Check max length
    const maxLen = rule.maxLength || this.config.maxStringLength;
    if (sanitized.length > maxLen) {
      return { valid: false, error: `${field} exceeds maximum length of ${maxLen}`, sanitized };
    }

    // Check pattern
    if (rule.pattern && !rule.pattern.test(sanitized)) {
      return { valid: false, error: `${field} has invalid format`, sanitized };
    }

    // Check enum
    if (rule.enum && !rule.enum.includes(sanitized)) {
      return { valid: false, error: `${field} must be one of: ${rule.enum.join(', ')}`, sanitized };
    }

    // Escape HTML
    if (rule.escapeHtml !== false) {
      sanitized = this.escapeHtml(sanitized);
    }

    // Custom validation
    if (rule.custom) {
      const result = rule.custom(sanitized);
      if (typeof result === 'string') {
        return { valid: false, error: result, sanitized };
      }
      if (!result) {
        return { valid: false, error: `${field} failed custom validation`, sanitized };
      }
    }

    return { valid: true, sanitized };
  }

  /**
   * Validate number
   */
  private validateNumber(
    value: any,
    rule: ValidationRule,
    field: string
  ): { valid: boolean; error?: string; sanitized: any } {
    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (typeof num !== 'number' || isNaN(num)) {
      return { valid: false, error: `${field} must be a number`, sanitized: value };
    }

    if (rule.min !== undefined && num < rule.min) {
      return { valid: false, error: `${field} must be at least ${rule.min}`, sanitized: value };
    }

    if (rule.max !== undefined && num > rule.max) {
      return { valid: false, error: `${field} must be at most ${rule.max}`, sanitized: value };
    }

    return { valid: true, sanitized: num };
  }

  /**
   * Validate boolean
   */
  private validateBoolean(
    value: any,
    field: string
  ): { valid: boolean; error?: string; sanitized: any } {
    if (typeof value === 'boolean') {
      return { valid: true, sanitized: value };
    }
    if (value === 'true' || value === '1') {
      return { valid: true, sanitized: true };
    }
    if (value === 'false' || value === '0') {
      return { valid: true, sanitized: false };
    }
    return { valid: false, error: `${field} must be a boolean`, sanitized: value };
  }

  /**
   * Validate email
   */
  private validateEmail(
    value: any,
    field: string
  ): { valid: boolean; error?: string; sanitized: any } {
    if (typeof value !== 'string') {
      return { valid: false, error: `${field} must be a string`, sanitized: value };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitized = value.trim().toLowerCase();

    if (!emailRegex.test(sanitized)) {
      return { valid: false, error: `${field} is not a valid email`, sanitized: value };
    }

    if (sanitized.length > 254) {
      return { valid: false, error: `${field} is too long`, sanitized: value };
    }

    return { valid: true, sanitized };
  }

  /**
   * Validate URL
   */
  private validateUrl(
    value: any,
    field: string
  ): { valid: boolean; error?: string; sanitized: any } {
    if (typeof value !== 'string') {
      return { valid: false, error: `${field} must be a string`, sanitized: value };
    }

    let sanitized = value.trim();

    try {
      const url = new URL(sanitized);
      if (!['http:', 'https:', 'tg:'].includes(url.protocol)) {
        return { valid: false, error: `${field} has invalid protocol`, sanitized: value };
      }
      sanitized = url.toString();
    } catch {
      return { valid: false, error: `${field} is not a valid URL`, sanitized: value };
    }

    return { valid: true, sanitized };
  }

  /**
   * Validate phone number
   */
  private validatePhone(
    value: any,
    field: string
  ): { valid: boolean; error?: string; sanitized: any } {
    if (typeof value !== 'string') {
      return { valid: false, error: `${field} must be a string`, sanitized: value };
    }

    const sanitized = value.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^\+?[1-9]\d{6,14}$/;

    if (!phoneRegex.test(sanitized)) {
      return { valid: false, error: `${field} is not a valid phone number`, sanitized: value };
    }

    return { valid: true, sanitized };
  }

  /**
   * Validate UUID
   */
  private validateUuid(
    value: any,
    field: string
  ): { valid: boolean; error?: string; sanitized: any } {
    if (typeof value !== 'string') {
      return { valid: false, error: `${field} must be a string`, sanitized: value };
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value.trim())) {
      return { valid: false, error: `${field} is not a valid UUID`, sanitized: value };
    }

    return { valid: true, sanitized: value.trim().toLowerCase() };
  }

  /**
   * Validate date
   */
  private validateDate(
    value: any,
    field: string
  ): { valid: boolean; error?: string; sanitized: any } {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return { valid: false, error: `${field} is not a valid date`, sanitized: value };
    }
    return { valid: true, sanitized: date.toISOString() };
  }

  /**
   * Validate Telegram ID
   */
  private validateTelegramId(
    value: any,
    field: string
  ): { valid: boolean; error?: string; sanitized: any } {
    const num = typeof value === 'string' ? parseInt(value, 10) : value;
    if (typeof num !== 'number' || isNaN(num) || num <= 0) {
      return { valid: false, error: `${field} is not a valid Telegram ID`, sanitized: value };
    }
    return { valid: true, sanitized: num };
  }

  /**
   * Validate wallet address
   */
  private validateWalletAddress(
    value: any,
    field: string
  ): { valid: boolean; error?: string; sanitized: any } {
    if (typeof value !== 'string') {
      return { valid: false, error: `${field} must be a string`, sanitized: value };
    }

    const sanitized = value.trim();
    // Support common wallet formats
    const walletRegex = /^(0x[a-fA-F0-9]{40}|[13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-zA-HJ-NP-Z0-9]{25,39}|T[A-Za-z1-9]{33})$/;

    if (!walletRegex.test(sanitized)) {
      return { valid: false, error: `${field} is not a valid wallet address`, sanitized: value };
    }

    return { valid: true, sanitized };
  }

  /**
   * Validate IP address
   */
  private validateIpAddress(
    value: any,
    field: string
  ): { valid: boolean; error?: string; sanitized: any } {
    if (typeof value !== 'string') {
      return { valid: false, error: `${field} must be a string`, sanitized: value };
    }

    const sanitized = value.trim();
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;

    if (!ipv4Regex.test(sanitized) && !ipv6Regex.test(sanitized)) {
      return { valid: false, error: `${field} is not a valid IP address`, sanitized: value };
    }

    // Validate IPv4 octets
    if (ipv4Regex.test(sanitized)) {
      const octets = sanitized.split('.').map(Number);
      if (octets.some(o => o < 0 || o > 255)) {
        return { valid: false, error: `${field} has invalid IP octets`, sanitized: value };
      }
    }

    return { valid: true, sanitized };
  }

  /**
   * Validate country code
   */
  private validateCountryCode(
    value: any,
    field: string
  ): { valid: boolean; error?: string; sanitized: any } {
    if (typeof value !== 'string') {
      return { valid: false, error: `${field} must be a string`, sanitized: value };
    }

    const sanitized = value.trim().toUpperCase();
    const countryRegex = /^[A-Z]{2}$/;

    if (!countryRegex.test(sanitized)) {
      return { valid: false, error: `${field} is not a valid country code`, sanitized: value };
    }

    return { valid: true, sanitized };
  }

  /**
   * Validate language code
   */
  private validateLanguageCode(
    value: any,
    field: string
  ): { valid: boolean; error?: string; sanitized: any } {
    if (typeof value !== 'string') {
      return { valid: false, error: `${field} must be a string`, sanitized: value };
    }

    const sanitized = value.trim().toLowerCase();
    const langRegex = /^[a-z]{2}(-[A-Z]{2})?$/;

    if (!langRegex.test(sanitized)) {
      return { valid: false, error: `${field} is not a valid language code`, sanitized: value };
    }

    return { valid: true, sanitized };
  }

  /**
   * Validate object
   */
  private validateObject(
    value: any,
    rule: ValidationRule,
    field: string
  ): { valid: boolean; error?: string; sanitized: any } {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return { valid: false, error: `${field} must be an object`, sanitized: value };
    }

    const keys = Object.keys(value);
    if (rule.min !== undefined && keys.length < rule.min) {
      return { valid: false, error: `${field} must have at least ${rule.min} properties`, sanitized: value };
    }
    if (rule.max !== undefined && keys.length > rule.max) {
      return { valid: false, error: `${field} must have at most ${rule.max} properties`, sanitized: value };
    }

    return { valid: true, sanitized: value };
  }

  /**
   * Validate array
   */
  private validateArray(
    value: any,
    rule: ValidationRule,
    field: string
  ): { valid: boolean; error?: string; sanitized: any } {
    if (!Array.isArray(value)) {
      return { valid: false, error: `${field} must be an array`, sanitized: value };
    }

    if (rule.min !== undefined && value.length < rule.min) {
      return { valid: false, error: `${field} must have at least ${rule.min} items`, sanitized: value };
    }
    if (rule.max !== undefined && value.length > rule.max) {
      return { valid: false, error: `${field} must have at most ${rule.max} items`, sanitized: value };
    }

    if (value.length > this.config.maxArrayLength) {
      return { valid: false, error: `${field} exceeds maximum array length`, sanitized: value };
    }

    return { valid: true, sanitized: value };
  }

  /**
   * Escape HTML entities
   */
  escapeHtml(str: string): string {
    const htmlEntities: Record<string, string> = {
      '&': '&',
      '<': '<',
      '>': '>',
      '"': '"',
      "'": '&#x27;',
      '/': '&#x2F;',
    };
    return str.replace(/[&<>"'/]/g, char => htmlEntities[char] || char);
  }

  /**
   * Sanitize SQL input (basic prevention)
   */
  sanitizeSql(input: string): string {
    return input
      .replace(/'/g, "''")
      .replace(/\\/g, '\\\\')
      .replace(/\0/g, '')
      .replace(/\b/g, '')
      .replace(/\x1a/g, '');
  }

  /**
   * Sanitize URL
   */
  sanitizeUrl(url: string): string {
    try {
      const parsed = new URL(url);
      // Only allow http, https, tg protocols
      if (!['http:', 'https:', 'tg:'].includes(parsed.protocol)) {
        return '';
      }
      return parsed.toString();
    } catch {
      return '';
    }
  }

  /**
   * Strip HTML tags
   */
  stripHtml(str: string): string {
    return str.replace(/<[^>]*>/g, '');
  }

  /**
   * Normalize whitespace
   */
  normalizeWhitespace(str: string): string {
    return str.replace(/\s+/g, ' ').trim();
  }

  /**
   * Validate a single field value
   */
  validateField(value: any, rule: ValidationRule): { valid: boolean; error?: string; sanitized: any } {
    return this.validateValue(value, rule, 'field');
  }

  /**
   * Get current config
   */
  getConfig(): Readonly<InputValidatorConfig> {
    return { ...this.config };
  }
}

// Singleton instance
export const inputValidator = new InputValidator();