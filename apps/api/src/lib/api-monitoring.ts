// API Monitoring and Rate Limiting Configuration

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface ApiMonitoring {
  checkRateLimit(key: string, config: RateLimitConfig): boolean;
  trackRequest(
    path: string,
    method: string,
    statusCode: number,
    responseTime: number,
    userId?: string,
  ): void;
}

// In-memory rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimitConfigs: Record<string, RateLimitConfig> = {
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },
  search: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
  },
};

export const apiMonitoring: ApiMonitoring = {
  checkRateLimit(key: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const windowKey = `${key}:${Math.floor(now / config.windowMs)}`;

    const current = rateLimitStore.get(windowKey) || {
      count: 0,
      resetTime: now + config.windowMs,
    };

    if (now > current.resetTime) {
      current.count = 0;
      current.resetTime = now + config.windowMs;
    }

    if (current.count >= config.maxRequests) {
      return false;
    }

    current.count++;
    rateLimitStore.set(windowKey, current);

    // Clean up old entries periodically
    if (Math.random() < 0.01) {
      // 1% chance to clean up
      for (const [k, v] of rateLimitStore.entries()) {
        if (now > v.resetTime) {
          rateLimitStore.delete(k);
        }
      }
    }

    return true;
  },

  trackRequest(
    path: string,
    method: string,
    statusCode: number,
    responseTime: number,
    userId?: string,
  ): void {
    // In a real implementation, this would send metrics to monitoring service
    // For now, just log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `API Request: ${method} ${path} - ${statusCode} - ${responseTime}ms${userId ? ` - User: ${userId}` : ""}`,
      );
    }
  },
};
