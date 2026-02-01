import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Reference the global ExtendedRequest interface
declare global {
  interface ExtendedRequest extends Express.Request {
    requestId?: string;
    _startTime?: number;
  }
}

// Rate limiter for general API endpoints (50 requests per minute)
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // 50 requests per window
  message: {
    error: 'Rate Limit Exceeded',
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: 60,
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    const requestId = (req as ExtendedRequest).requestId || 'unknown';
    console.warn(
      `⚠️  Rate limit exceeded for IP: ${req.ip}, Request ID: ${requestId}`
    );

    res.status(429).json({
      error: 'Rate Limit Exceeded',
      message: 'Too many requests from this IP, please try again later.',
      timestamp: new Date().toISOString(),
      requestId,
      retryAfter: 60,
    });
  },
  skip: (req: Request) => {
    // Skip rate limiting for health check endpoints
    return req.path.startsWith('/health') || req.path.startsWith('/api/health');
  },
});

// Stricter rate limiter for authentication endpoints (10 requests per minute)
export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per window
  message: {
    error: 'Rate Limit Exceeded',
    message: 'Too many authentication attempts, please try again later.',
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    const requestId = (req as ExtendedRequest).requestId || 'unknown';
    console.warn(
      `⚠️  Auth rate limit exceeded for IP: ${req.ip}, Request ID: ${requestId}`
    );

    res.status(429).json({
      error: 'Rate Limit Exceeded',
      message: 'Too many authentication attempts, please try again later.',
      timestamp: new Date().toISOString(),
      requestId,
      retryAfter: 60,
    });
  },
});

// More lenient rate limiter for proxy endpoints (100 requests per minute)
export const proxyRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per window
  message: {
    error: 'Rate Limit Exceeded',
    message: 'Too many proxy requests, please try again later.',
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    const requestId = (req as ExtendedRequest).requestId || 'unknown';
    console.warn(
      `⚠️  Proxy rate limit exceeded for IP: ${req.ip}, Request ID: ${requestId}`
    );

    res.status(429).json({
      error: 'Rate Limit Exceeded',
      message: 'Too many proxy requests, please try again later.',
      timestamp: new Date().toISOString(),
      requestId,
      retryAfter: 60,
    });
  },
});
