/**
 * Redis-based Rate Limiting Middleware
 *
 * Uses Upstash Redis for distributed rate limiting.
 * Falls back to in-memory if Redis not configured.
 *
 * Important: This must NOT build the limiter at module-load time, because Cloudflare
 * Workers bindings are only available at request time (`c.env`).
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { Context, Next } from "hono";
import { RateLimitError } from "../lib/errors";

type LimiterType = "api" | "auth" | "strict";

interface RateLimitOptions {
  windowSeconds: number;
  maxRequests: number;
  keyGenerator?: (c: Context) => string;
  limiterType?: LimiterType;
}

const defaultLimiters: Record<
  LimiterType,
  { windowSeconds: number; maxRequests: number }
> = {
  api: { windowSeconds: 60, maxRequests: 100 },
  auth: { windowSeconds: 60, maxRequests: 10 },
  strict: { windowSeconds: 60, maxRequests: 5 },
};

let cachedCredentialsKey: string | null = null;
let cachedLimiters: Partial<Record<LimiterType, Ratelimit>> = {};

function getUpstashCredentials(
  c: Context,
): { url: string; token: string } | null {
  const env = (c as any).env as Record<string, unknown> | undefined;
  const redisRateLimitEnabled =
    (env?.ENABLE_REDIS_RATE_LIMIT as string | undefined) === "true" ||
    // eslint-disable-next-line no-process-env
    process.env.ENABLE_REDIS_RATE_LIMIT === "true";
  if (!redisRateLimitEnabled) return null;

  const isE2E =
    (env?.E2E_TEST as string | undefined) === "1" ||
    // eslint-disable-next-line no-process-env
    process.env.E2E_TEST === "1";
  if (isE2E) return null;

  const url =
    (env?.UPSTASH_REDIS_REST_URL as string | undefined) ||
    // eslint-disable-next-line no-process-env
    process.env.UPSTASH_REDIS_REST_URL ||
    "";
  const token =
    (env?.UPSTASH_REDIS_REST_TOKEN as string | undefined) ||
    // eslint-disable-next-line no-process-env
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    "";

  if (!url || !token) return null;
  return { url, token };
}

function getLimiter(c: Context, type: LimiterType): Ratelimit | null {
  const creds = getUpstashCredentials(c);
  if (!creds) return null;

  const key = `${creds.url}|${creds.token}`;
  if (cachedCredentialsKey !== key) {
    cachedCredentialsKey = key;
    cachedLimiters = {};
  }

  const existing = cachedLimiters[type];
  if (existing) return existing;

  const config = defaultLimiters[type];
  const redis = new Redis({ url: creds.url, token: creds.token });
  const limiter = new Ratelimit({
    redis: redis as any,
    limiter: Ratelimit.slidingWindow(
      config.maxRequests,
      `${config.windowSeconds} s`,
    ),
    analytics: true,
    prefix: `ratelimit:${type}`,
  });

  cachedLimiters[type] = limiter;
  return limiter;
}

const inMemoryStore = new Map<string, { count: number; resetAt: number }>();

export function rateLimitRedis(options: Partial<RateLimitOptions> = {}) {
  const opts: RateLimitOptions = {
    windowSeconds: 60,
    maxRequests: 100,
    keyGenerator: (c) => {
      const ip =
        c.req.header("x-forwarded-for") ||
        c.req.header("x-real-ip") ||
        "unknown";
      const userId = c.get("user")?.id;
      return userId ? `user:${userId}` : `ip:${ip}`;
    },
    limiterType: "api",
    ...options,
  };

  return async (c: Context, next: Next) => {
    // Skip rate limiting for health endpoints
    if (c.req.path === "/api/health" || c.req.path === "/health") {
      await next();
      return;
    }

    const key = opts.keyGenerator!(c);
    const type = opts.limiterType ?? "api";

    const limiter = getLimiter(c, type);
    if (limiter) {
      try {
        const result = await limiter.limit(key);

        if (!result.success) {
          const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
          throw new RateLimitError(
            `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
            retryAfter,
          );
        }

        c.header("X-RateLimit-Limit", result.limit.toString());
        c.header("X-RateLimit-Remaining", result.remaining.toString());
        c.header("X-RateLimit-Reset", result.reset.toString());
      } catch (err) {
        if (err instanceof RateLimitError) throw err;
        // Fail open if Redis fails
        console.error("Rate limit error (fail open):", err);
      }

      await next();
      return;
    }

    // Fallback to in-memory
    const now = Date.now();
    const windowMs = opts.windowSeconds * 1000;
    const record = inMemoryStore.get(key);

    if (!record || record.resetAt < now) {
      inMemoryStore.set(key, { count: 1, resetAt: now + windowMs });
      await next();
      return;
    }

    if (record.count >= opts.maxRequests) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000);
      throw new RateLimitError(
        `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
        retryAfter,
      );
    }

    record.count++;
    await next();
  };
}
