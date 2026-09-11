import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

/**
 * Get rate limit key (IP or user ID)
 */
function getKey(req: Request, prefix: string): string {
  const ip = req.ip || 'unknown';
  const userId = req.user?.userId || 'anonymous';
  return `${prefix}:${userId}:${ip}`;
}

/**
 * Generic rate limiter middleware
 */
export function createRateLimiter(
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  maxRequests: number = 100
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = getKey(req, 'rate-limit');
    const now = Date.now();

    if (!store[key]) {
      store[key] = { count: 1, resetTime: now + windowMs };
      next();
      return;
    }

    if (now > store[key].resetTime) {
      store[key] = { count: 1, resetTime: now + windowMs };
      next();
      return;
    }

    store[key].count++;

    if (store[key].count > maxRequests) {
      const retryAfter = Math.ceil((store[key].resetTime - now) / 1000);
      res.set('Retry-After', retryAfter.toString());
      res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
        retryAfter,
      });
      return;
    }

    next();
  };
}

/**
 * Stricter rate limiter for auth endpoints
 */
export function authRateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const key = getKey(req, 'auth-rate-limit');
  const now = Date.now();
  const windowMs = parseInt(process.env.AUTH_RATE_LIMIT_WINDOW || '900000', 10);
  const maxRequests = parseInt(process.env.AUTH_RATE_LIMIT_MAX || '5', 10);

  if (!store[key]) {
    store[key] = { count: 1, resetTime: now + windowMs };
    next();
    return;
  }

  if (now > store[key].resetTime) {
    store[key] = { count: 1, resetTime: now + windowMs };
    next();
    return;
  }

  store[key].count++;

  if (store[key].count > maxRequests) {
    const retryAfter = Math.ceil((store[key].resetTime - now) / 1000);
    res.set('Retry-After', retryAfter.toString());
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again later.',
      retryAfter,
    });
    return;
  }

  next();
}

/**
 * Clear rate limit for a key (after successful login)
 */
export function clearRateLimit(req: Request, prefix: string = 'auth-rate-limit'): void {
  const key = getKey(req, prefix);
  delete store[key];
}

/**
 * Cleanup old entries periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
}, 60 * 1000); // Clean up every minute
