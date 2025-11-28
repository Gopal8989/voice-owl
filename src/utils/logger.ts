/**
 * Logger Utility for Better Logging
 */
import { Request } from 'express';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

interface LogContext {
  requestId?: string;
  userId?: string;
  [key: string]: unknown;
}

class Logger {
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const errorDetails = error ? `: ${error.message}${error.stack ? `\n${error.stack}` : ''}` : '';
    console.error(this.formatMessage(LogLevel.ERROR, `${message}${errorDetails}`, context));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, context));
  }

  info(message: string, context?: LogContext): void {
    console.log(this.formatMessage(LogLevel.INFO, message, context));
  }

  debug(message: string, context?: LogContext): void {
    const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
    if (isDevelopment) {
      console.log(this.formatMessage(LogLevel.DEBUG, message, context));
    }
  }

  request(req: Request, message: string, context?: LogContext): void {
    const requestId = (req as Request & { requestId?: string }).requestId;
    this.info(message, {
      ...context,
      requestId,
      method: req.method,
      path: req.path,
      ip: req.ip,
    });
  }
}

export const logger = new Logger();

