/**
 * Rate Limiting Middleware for Scaling
 */
import { Request, Response, NextFunction } from 'express';
import { RateLimitError } from '../utils/errors';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    // Clean up old entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  private getKey(req: Request): string {
    // Use IP address as key (in production, consider user ID if authenticated)
    return req.ip || req.socket.remoteAddress || 'unknown';
  }

  private cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach((key) => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });
  }

  middleware() {
    return (req: Request, _res: Response, next: NextFunction): void => {
      const key = this.getKey(req);
      const now = Date.now();

      if (!this.store[key] || this.store[key].resetTime < now) {
        // Reset window
        this.store[key] = {
          count: 1,
          resetTime: now + this.windowMs,
        };
        return next();
      }

      if (this.store[key].count >= this.maxRequests) {
        const resetTime = new Date(this.store[key].resetTime).toISOString();
        return next(
          new RateLimitError(
            `Rate limit exceeded. Maximum ${this.maxRequests} requests per ${this.windowMs / 1000} seconds. Reset at ${resetTime}`
          )
        );
      }

      this.store[key].count += 1;
      next();
    };
  }
}

// Create rate limiter instances
export const apiRateLimiter = new RateLimiter(60000, 100); // 100 requests per minute
export const transcriptionRateLimiter = new RateLimiter(60000, 10); // 10 transcriptions per minute

