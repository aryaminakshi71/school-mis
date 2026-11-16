import { addBreadcrumb, captureMessage } from "./sentry";

interface APIMetrics {
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
  userId?: string;
  error?: string;
}

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

// Helper function for adding breadcrumbs
function logBreadcrumb(
  message: string,
  category: string,
  level: "info" | "warning" | "error" = "info",
) {
  addBreadcrumb({
    message,
    category,
    level,
  });
}

// Helper to capture message with context
function captureMessageWithContext(
  message: string,
  level: "info" | "warning" | "error",
  context: Record<string, any>,
) {
  captureMessage(message, {
    level,
    extra: context,
  });
}

class APIMonitoringService {
  private metrics: APIMetrics[] = [];
  private rateLimiters = new Map<
    string,
    { requests: number[]; config: RateLimitConfig }
  >();

  constructor() {
    // Clean up old metrics every 5 minutes
    setInterval(
      () => {
        this.cleanupOldMetrics();
      },
      5 * 60 * 1000,
    );
  }

  // Track API request
  trackRequest(
    endpoint: string,
    method: string,
    statusCode: number,
    responseTime: number,
    userId?: string,
    error?: string,
  ) {
    const metric: APIMetrics = {
      endpoint,
      method,
      statusCode,
      responseTime,
      timestamp: new Date(),
      userId,
      error,
    };

    this.metrics.push(metric);

    // Add breadcrumb for monitoring
    logBreadcrumb(
      `API ${method} ${endpoint}`,
      "api",
      statusCode >= 400 ? "error" : "info",
    );

    // Report errors to Sentry
    if (statusCode >= 500) {
      captureMessageWithContext(
        `Server error: ${method} ${endpoint} (${statusCode})`,
        "error",
        {
          endpoint,
          method,
          statusCode,
          responseTime,
          userId,
        },
      );
    } else if (statusCode >= 400) {
      captureMessageWithContext(
        `Client error: ${method} ${endpoint} (${statusCode})`,
        "warning",
        {
          endpoint,
          method,
          statusCode,
          responseTime,
          userId,
        },
      );
    }

    // Check for performance issues
    if (responseTime > 5000) {
      captureMessage(
        `Slow API response: ${method} ${endpoint} (${responseTime}ms)`,
        {
          level: "warning",
          extra: {
            endpoint,
            method,
            responseTime,
            userId,
          },
        },
      );
    }
  }

  // Rate limiting
  checkRateLimit(identifier: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const windowStart = now - config.windowMs;

    if (!this.rateLimiters.has(identifier)) {
      this.rateLimiters.set(identifier, { requests: [], config });
    }

    const limiter = this.rateLimiters.get(identifier)!;

    // Clean old requests
    limiter.requests = limiter.requests.filter((time) => time > windowStart);

    // Check if limit exceeded
    if (limiter.requests.length >= config.maxRequests) {
      return false;
    }

    // Add current request
    limiter.requests.push(now);
    return true;
  }

  // Get API metrics
  getMetrics(timeRangeMs: number = 60 * 60 * 1000): {
    totalRequests: number;
    errorRate: number;
    avgResponseTime: number;
    requestsByEndpoint: Record<string, number>;
    statusCodeDistribution: Record<number, number>;
  } {
    const now = Date.now();
    const cutoff = now - timeRangeMs;

    const recentMetrics = this.metrics.filter(
      (m) => m.timestamp.getTime() > cutoff,
    );

    const totalRequests = recentMetrics.length;
    const errors = recentMetrics.filter((m) => m.statusCode >= 400).length;
    const errorRate = totalRequests > 0 ? (errors / totalRequests) * 100 : 0;

    const totalResponseTime = recentMetrics.reduce(
      (sum, m) => sum + m.responseTime,
      0,
    );
    const avgResponseTime =
      totalRequests > 0 ? totalResponseTime / totalRequests : 0;

    const requestsByEndpoint: Record<string, number> = {};
    const statusCodeDistribution: Record<number, number> = {};

    recentMetrics.forEach((metric) => {
      requestsByEndpoint[metric.endpoint] =
        (requestsByEndpoint[metric.endpoint] || 0) + 1;
      statusCodeDistribution[metric.statusCode] =
        (statusCodeDistribution[metric.statusCode] || 0) + 1;
    });

    return {
      totalRequests,
      errorRate,
      avgResponseTime,
      requestsByEndpoint,
      statusCodeDistribution,
    };
  }

  // Get slow endpoints
  getSlowEndpoints(
    thresholdMs: number = 2000,
    timeRangeMs: number = 60 * 60 * 1000,
  ) {
    const now = Date.now();
    const cutoff = now - timeRangeMs;

    const slowRequests = this.metrics
      .filter(
        (m) => m.timestamp.getTime() > cutoff && m.responseTime > thresholdMs,
      )
      .sort((a, b) => b.responseTime - a.responseTime);

    const endpointStats: Record<
      string,
      { count: number; avgTime: number; maxTime: number }
    > = {};

    slowRequests.forEach((req) => {
      if (!endpointStats[req.endpoint]) {
        endpointStats[req.endpoint] = { count: 0, avgTime: 0, maxTime: 0 };
      }
      const stats = endpointStats[req.endpoint];
      stats.count++;
      stats.maxTime = Math.max(stats.maxTime, req.responseTime);
    });

    // Calculate averages
    Object.values(endpointStats).forEach((stats) => {
      const endpointRequests = slowRequests.filter(
        (r) =>
          r.endpoint ===
          Object.keys(endpointStats).find((k) => endpointStats[k] === stats),
      );
      stats.avgTime =
        endpointRequests.reduce((sum, r) => sum + r.responseTime, 0) /
        stats.count;
    });

    return Object.entries(endpointStats)
      .map(([endpoint, stats]) => ({ endpoint, ...stats }))
      .sort((a, b) => b.avgTime - a.avgTime);
  }

  private cleanupOldMetrics() {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000; // Keep last 24 hours
    this.metrics = this.metrics.filter((m) => m.timestamp.getTime() > cutoff);
  }
}

export const apiMonitoring = new APIMonitoringService();

// Rate limiting configurations
export const rateLimitConfigs = {
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000,
  },
  auth: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
  },
  search: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
  },
} as const;
