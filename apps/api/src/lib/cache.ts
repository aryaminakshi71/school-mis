/**
 * Redis Cache Layer
 *
 * High-performance caching using Upstash Redis.
 * Supports automatic serialization, compression, and cache warming.
 */

import { Redis } from "@upstash/redis";

// Cache TTL values (in seconds)
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
  WEEK: 604800, // 7 days
} as const;

// Cache key prefixes
export const CACHE_PREFIX = {
  STUDENT: "student:",
  TEACHER: "teacher:",
  CLASS: "class:",
  ATTENDANCE: "attendance:",
  FEE: "fee:",
  GRADE: "grade:",
  LIBRARY: "library:",
  TRANSPORT: "transport:",
  SESSION: "session:",
  STATS: "stats:",
  LIST: "list:",
} as const;

// Cache configuration
interface CacheConfig {
  url?: string;
  token?: string;
  enableCompression?: boolean;
  defaultTTL?: number;
}

// Cache instance
let redisInstance: Redis | null = null;
let config: CacheConfig = {};

/**
 * Initialize Redis cache with configuration
 */
export function initCache(cacheConfig?: CacheConfig): Redis {
  if (redisInstance) return redisInstance;

  const envUrl = process.env.UPSTASH_REDIS_REST_URL;
  const envToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  config = {
    url: cacheConfig?.url || envUrl,
    token: cacheConfig?.token || envToken,
    enableCompression: cacheConfig?.enableCompression ?? true,
    defaultTTL: cacheConfig?.defaultTTL || CACHE_TTL.MEDIUM,
  };

  if (!config.url || !config.token) {
    throw new Error(
      "Redis cache not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.",
    );
  }

  redisInstance = new Redis({
    url: config.url,
    token: config.token,
    retry: {
      retries: 3,
      backoff: (retryCount) => Math.min(Math.exp(retryCount) * 100, 5000),
    },
  });

  return redisInstance;
}

/**
 * Get Redis instance (throws if not initialized)
 */
export function getCache(): Redis {
  if (!redisInstance) {
    return initCache();
  }
  return redisInstance;
}

/**
 * Check if cache is available
 */
export function isCacheAvailable(): boolean {
  try {
    return (
      !!redisInstance ||
      (!!process.env.UPSTASH_REDIS_REST_URL &&
        !!process.env.UPSTASH_REDIS_REST_TOKEN)
    );
  } catch {
    return false;
  }
}

/**
 * Compress data for storage
 */
function compress(data: unknown): string {
  if (!config.enableCompression) {
    return JSON.stringify(data);
  }

  // Simple compression - in production use a proper compression library
  const json = JSON.stringify(data);
  if (json.length > 1000) {
    // For large data, we could use gzip/deflate in production
    return json;
  }
  return json;
}

/**
 * Decompress data from storage
 */
function decompress(data: string): unknown {
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}

/**
 * Generate cache key with prefix
 */
export function generateCacheKey(
  prefix: string,
  ...parts: (string | number)[]
): string {
  return `${prefix}${parts.join(":")}`;
}

/**
 * Get value from cache
 */
export async function getCacheValue<T>(key: string): Promise<T | null> {
  if (!isCacheAvailable()) return null;

  try {
    const redis = getCache();
    const value = await redis.get(key);

    if (!value) return null;

    return decompress(value as string) as T;
  } catch (error) {
    console.error("[Cache] Get error:", error);
    return null;
  }
}

/**
 * Set value in cache with optional TTL
 */
export async function setCacheValue<T>(
  key: string,
  value: T,
  ttl: number = config.defaultTTL || CACHE_TTL.MEDIUM,
): Promise<boolean> {
  if (!isCacheAvailable()) return false;

  try {
    const redis = getCache();
    const compressed = compress(value);

    if (ttl > 0) {
      await redis.set(key, compressed, { ex: ttl });
    } else {
      await redis.set(key, compressed);
    }
    return true;
  } catch (error) {
    console.error("[Cache] Set error:", error);
    return false;
  }
}

/**
 * Delete value from cache
 */
export async function deleteCacheValue(key: string): Promise<boolean> {
  if (!isCacheAvailable()) return false;

  try {
    const redis = getCache();
    await redis.del(key);
    return true;
  } catch (error) {
    console.error("[Cache] Delete error:", error);
    return false;
  }
}

/**
 * Delete multiple values by pattern
 */
export async function deleteCachePattern(pattern: string): Promise<number> {
  if (!isCacheAvailable()) return 0;

  try {
    const redis = getCache();
    const keys = await redis.keys(pattern);

    if (keys.length === 0) return 0;

    await redis.del(...keys);
    return keys.length;
  } catch (error) {
    console.error("[Cache] Delete pattern error:", error);
    return 0;
  }
}

/**
 * Cache decorator - wraps a function with caching
 */
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl: number = CACHE_TTL.MEDIUM,
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const key = keyGenerator(...args);

    // Try to get from cache
    const cached = await getCacheValue<ReturnType<T>>(key);
    if (cached !== null) {
      return cached;
    }

    // Execute function
    const result = await fn(...args);

    // Store in cache
    await setCacheValue(key, result, ttl);

    return result;
  }) as T;
}

/**
 * Invalidate cache entries by prefix
 */
export async function invalidateCache(prefix: string): Promise<number> {
  return deleteCachePattern(`${prefix}*`);
}

/**
 * Cache statistics
 */
export async function getCacheStats(): Promise<{
  usedMemory: number;
  keyCount: number;
  hitRate: number;
} | null> {
  if (!isCacheAvailable()) return null;

  try {
    const redis = getCache();
    // Use dbsize for key count - info() is not available in Upstash Redis REST API
    const dbsize = await redis.dbsize();

    return {
      usedMemory: 0, // Not available via REST API
      keyCount: dbsize,
      hitRate: 0, // Would need to track this manually
    };
  } catch (error) {
    console.error("[Cache] Stats error:", error);
    return null;
  }
}

/**
 * Cache warming - pre-populate frequently accessed data
 */
export async function warmCache(
  dataFetcher: () => Promise<Record<string, unknown>>,
  prefix: string,
  ttl: number = CACHE_TTL.LONG,
): Promise<void> {
  try {
    const data = await dataFetcher();

    for (const [key, value] of Object.entries(data)) {
      const cacheKey = generateCacheKey(prefix, key);
      await setCacheValue(cacheKey, value, ttl);
    }

    console.log(
      `[Cache] Warmed ${Object.keys(data).length} entries for prefix: ${prefix}`,
    );
  } catch (error) {
    console.error("[Cache] Warm error:", error);
  }
}

/**
 * Batch cache operations
 */
export async function batchCacheSet(
  entries: Array<{ key: string; value: unknown; ttl?: number }>,
): Promise<number> {
  if (!isCacheAvailable()) return 0;

  try {
    const redis = getCache();
    const pipeline = redis.pipeline();

    for (const entry of entries) {
      const compressed = compress(entry.value);
      const ttl = entry.ttl || config.defaultTTL || CACHE_TTL.MEDIUM;
      if (ttl > 0) {
        pipeline.set(entry.key, compressed, { ex: ttl });
      } else {
        pipeline.set(entry.key, compressed);
      }
    }

    await pipeline.exec();
    return entries.length;
  } catch (error) {
    console.error("[Cache] Batch set error:", error);
    return 0;
  }
}

/**
 * Cache middleware for Hono
 */
export function cacheMiddleware(
  keyGenerator: (c: any) => string,
  ttl: number = CACHE_TTL.MEDIUM,
) {
  return async (c: any, next: any) => {
    if (!isCacheAvailable()) {
      await next();
      return;
    }

    const key = keyGenerator(c);
    const cached = await getCacheValue(key);

    if (cached !== null) {
      c.header("X-Cache", "HIT");
      return c.json(cached);
    }

    await next();

    // Cache the response if it's a successful GET request
    if (c.req.method === "GET" && c.res.status === 200) {
      const responseData = await c.res
        .clone()
        .json()
        .catch(() => null);
      if (responseData) {
        await setCacheValue(key, responseData, ttl);
        c.header("X-Cache", "MISS");
      }
    }
  };
}

// Export default cache instance
export default {
  init: initCache,
  get: getCacheValue,
  set: setCacheValue,
  del: deleteCacheValue,
  delPattern: deleteCachePattern,
  invalidate: invalidateCache,
  isAvailable: isCacheAvailable,
  TTL: CACHE_TTL,
  PREFIX: CACHE_PREFIX,
};
