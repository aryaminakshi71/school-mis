import { apiMonitoring, rateLimitConfigs } from "./api-monitoring";

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: any) => string;
  handler?: (req: any, res: any) => void;
}

export const createRateLimit = (options: RateLimitOptions) => {
  const {
    windowMs,
    maxRequests,
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    keyGenerator = (req) => req.ip || req.connection.remoteAddress || "unknown",
    handler,
  } = options;

  return (req: any, res: any, next: any) => {
    const key = keyGenerator(req);
    const config = {
      windowMs,
      maxRequests,
      skipSuccessfulRequests,
      skipFailedRequests,
    };

    if (!apiMonitoring.checkRateLimit(key, config)) {
      const error = new Error("Too many requests");
      (error as any).statusCode = 429;

      if (handler) {
        return handler(req, res);
      }

      return res.status(429).json({
        error: "Too many requests",
        message: "Rate limit exceeded. Please try again later.",
        retryAfter: Math.ceil(windowMs / 1000),
      });
    }

    // Track the request
    const startTime = Date.now();

    res.on("finish", () => {
      const responseTime = Date.now() - startTime;
      const userId = req.user?.id;

      apiMonitoring.trackRequest(
        req.path,
        req.method,
        res.statusCode,
        responseTime,
        userId,
      );
    });

    next();
  };
};

// Pre-configured rate limiters
export const rateLimiters = {
  // General API rate limiting
  api: createRateLimit(rateLimitConfigs.api),

  // Strict rate limiting for authentication
  auth: createRateLimit(rateLimitConfigs.auth),

  // Rate limiting for search endpoints
  search: createRateLimit(rateLimitConfigs.search),

  // Rate limiting for file uploads
  upload: createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10,
  }),

  // Rate limiting for reports generation
  reports: createRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 50,
  }),

  // Rate limiting for bulk operations
  bulk: createRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5,
  }),
};

// Custom key generators
export const keyGenerators = {
  // Rate limit by user ID
  byUserId: (req: any) => req.user?.id || req.ip,

  // Rate limit by IP address
  byIp: (req: any) => req.ip || req.connection.remoteAddress,

  // Rate limit by API key
  byApiKey: (req: any) => req.headers["x-api-key"] || req.ip,

  // Rate limit by organization
  byOrganization: (req: any) => req.user?.organizationId || req.ip,
};

// Rate limit error handler
export const rateLimitErrorHandler = (req: any, res: any) => {
  res.status(429).json({
    error: "Too many requests",
    message: "You have exceeded the rate limit. Please try again later.",
    retryAfter: Math.ceil(rateLimitConfigs.api.windowMs / 1000),
  });
};
