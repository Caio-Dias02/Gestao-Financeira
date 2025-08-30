import { Injectable, LoggerService, LogLevel } from '@nestjs/common';

interface LogContext {
  context?: string;
  requestId?: string;
  userId?: string;
  method?: string;
  url?: string;
  ip?: string;
  userAgent?: string;
  duration?: number;
  [key: string]: any;
}

@Injectable()
export class CustomLoggerService implements LoggerService {
  private readonly isProduction = process.env.NODE_ENV === 'production';
  private readonly logLevels: LogLevel[] = this.isProduction 
    ? ['error', 'warn', 'log'] 
    : ['error', 'warn', 'log', 'debug', 'verbose'];

  /**
   * Log de erro (sempre visível)
   */
  error(message: string, trace?: string, context?: string, extra?: LogContext) {
    if (this.shouldLog('error')) {
      this.printMessage('ERROR', message, context, { trace, ...extra });
    }
  }

  /**
   * Log de warning (produção + desenvolvimento)
   */
  warn(message: string, context?: string, extra?: LogContext) {
    if (this.shouldLog('warn')) {
      this.printMessage('WARN', message, context, extra);
    }
  }

  /**
   * Log informativo (produção + desenvolvimento)
   */
  log(message: string, context?: string, extra?: LogContext) {
    if (this.shouldLog('log')) {
      this.printMessage('INFO', message, context, extra);
    }
  }

  /**
   * Log de debug (apenas desenvolvimento)
   */
  debug(message: string, context?: string, extra?: LogContext) {
    if (this.shouldLog('debug')) {
      this.printMessage('DEBUG', message, context, extra);
    }
  }

  /**
   * Log verboso (apenas desenvolvimento com flag específica)
   */
  verbose(message: string, context?: string, extra?: LogContext) {
    if (this.shouldLog('verbose')) {
      this.printMessage('VERBOSE', message, context, extra);
    }
  }

  /**
   * Verifica se deve logar baseado no nível configurado
   */
  private shouldLog(level: LogLevel): boolean {
    return this.logLevels.includes(level);
  }

  /**
   * Imprime a mensagem formatada
   */
  private printMessage(
    level: string,
    message: string,
    context?: string,
    extra?: LogContext
  ) {
    const timestamp = new Date().toISOString();
    
    if (this.isProduction) {
      // Formato JSON estruturado para produção
      const logEntry = {
        timestamp,
        level,
        message,
        context: context || 'Application',
        ...extra,
      };
      
      console.log(JSON.stringify(logEntry));
    } else {
      // Formato colorido para desenvolvimento
      const colorizedLevel = this.colorizeLevel(level);
      const contextStr = context ? `[${context}]` : '[Application]';
      
      let logLine = `${timestamp} ${colorizedLevel} ${this.yellow(contextStr)} ${message}`;
      
      // Adicionar informações extras se existirem
      if (extra && Object.keys(extra).length > 0) {
        const extraStr = JSON.stringify(extra, null, 2);
        logLine += `\n${this.gray(extraStr)}`;
      }
      
      console.log(logLine);
    }
  }

  /**
   * Colorização para diferentes níveis (desenvolvimento)
   */
  private colorizeLevel(level: string): string {
    switch (level) {
      case 'ERROR':
        return this.red(`[${level}]`);
      case 'WARN':
        return this.yellow(`[${level}] `);
      case 'INFO':
        return this.green(`[${level}] `);
      case 'DEBUG':
        return this.blue(`[${level}]`);
      case 'VERBOSE':
        return this.magenta(`[${level}]`);
      default:
        return `[${level}]`;
    }
  }

  // Métodos de colorização (ANSI colors)
  private red(text: string): string {
    return `\x1b[31m${text}\x1b[0m`;
  }

  private green(text: string): string {
    return `\x1b[32m${text}\x1b[0m`;
  }

  private yellow(text: string): string {
    return `\x1b[33m${text}\x1b[0m`;
  }

  private blue(text: string): string {
    return `\x1b[34m${text}\x1b[0m`;
  }

  private magenta(text: string): string {
    return `\x1b[35m${text}\x1b[0m`;
  }

  private gray(text: string): string {
    return `\x1b[90m${text}\x1b[0m`;
  }

  /**
   * Método utilitário para logging de requisições HTTP
   */
  logHttpRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    extra?: LogContext
  ) {
    const message = `${method} ${url} - ${statusCode} - ${duration}ms`;
    const context = 'HTTP';
    
    if (statusCode >= 500) {
      this.error(message, undefined, context, extra);
    } else if (statusCode >= 400) {
      this.warn(message, context, extra);
    } else {
      this.log(message, context, extra);
    }
  }

  /**
   * Método utilitário para logging de operações de banco
   */
  logDatabaseOperation(
    operation: string,
    table: string,
    duration?: number,
    extra?: LogContext
  ) {
    const message = `${operation} on ${table}${duration ? ` (${duration}ms)` : ''}`;
    this.debug(message, 'Database', extra);
  }

  /**
   * Método utilitário para logging de autenticação
   */
  logAuthEvent(
    event: 'login_success' | 'login_failed' | 'logout' | 'token_refresh',
    userId?: string,
    extra?: LogContext
  ) {
    const message = `Auth event: ${event}`;
    const context = 'Auth';
    const logExtra = { userId, event, ...extra };

    if (event === 'login_failed') {
      this.warn(message, context, logExtra);
    } else {
      this.log(message, context, logExtra);
    }
  }
}