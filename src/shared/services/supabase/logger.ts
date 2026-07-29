type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LoggerOptions {
  level?: LogLevel
  prefix?: string
  enabled?: boolean
}

class Logger {
  private level: LogLevel
  private prefix: string
  private enabled: boolean

  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  }

  constructor(options: LoggerOptions = {}) {
    this.level = options.level || 'info'
    this.prefix = options.prefix ? `[${options.prefix}]` : ''
    this.enabled = options.enabled ?? true
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.enabled) return false
    return this.levels[level] >= this.levels[this.level]
  }

  private formatMessage(level: LogLevel, message: string, data?: any): void {
    if (!this.shouldLog(level)) return

    const timestamp = new Date().toISOString()
    const logMessage = `${timestamp} ${this.prefix} [${level.toUpperCase()}] ${message}`

    switch (level) {
      case 'debug':
        console.debug(logMessage, data || '')
        break
      case 'info':
        console.info(logMessage, data || '')
        break
      case 'warn':
        console.warn(logMessage, data || '')
        break
      case 'error':
        console.error(logMessage, data || '')
        break
    }
  }

  debug(message: string, data?: any): void {
    this.formatMessage('debug', message, data)
  }

  info(message: string, data?: any): void {
    this.formatMessage('info', message, data)
  }

  warn(message: string, data?: any): void {
    this.formatMessage('warn', message, data)
  }

  error(message: string, error?: any): void {
    this.formatMessage('error', message, error)
  }

  setLevel(level: LogLevel): void {
    this.level = level
  }

  setPrefix(prefix: string): void {
    this.prefix = `[${prefix}]`
  }

  enable(): void {
    this.enabled = true
  }

  disable(): void {
    this.enabled = false
  }
}

export const logger = new Logger({ prefix: 'Supabase' })

export type { LoggerOptions, LogLevel }