/**
 * Cloudflare KV Cache Utilities
 *
 * Utilities for caching data using Cloudflare KV
 */

export interface KVConfig {
  bindingName: string;
  namespaceId?: string;
}

export interface CacheEntry {
  key: string;
  value: unknown;
  expirationTtl?: number;
  metadata?: Record<string, unknown>;
}

export interface CacheOptions {
  ttl?: number;
  prefix?: string;
}

const DEFAULT_TTL = 3600; // 1 hour
const CACHE_PREFIX = 'school-mis:';

export class KVCache {
  private binding: KVNamespace | null = null;
  private config: KVConfig;

  constructor(config: KVConfig) {
    this.config = config;
  }

  private getBinding(): KVNamespace {
    if (
      !this.binding &&
      typeof process !== 'undefined' &&
      (process.env as Record<string, string>)[`KV_${config.bindingName}`]
    ) {
      // In production, this would be resolved by the Cloudflare runtime
      this.binding = (process.env as Record<string, unknown>)[
        `KV_${config.bindingName}`
      ] as unknown as KVNamespace;
    }
    // Return a mock for development
    return {
      get: async () => null,
      put: async () => {},
      delete: async () => {},
      list: async () => ({ list_complete: true, keys: [] }),
    } as unknown as KVNamespace;
  }

  private buildKey(key: string, prefix?: string): string {
    return `${CACHE_PREFIX}${prefix || ''}${key}`;
  }

  async get<T = unknown>(key: string, options?: CacheOptions): Promise<T | null> {
    const binding = this.getBinding();
    const fullKey = this.buildKey(key, options?.prefix);

    try {
      const value = await binding.get(fullKey);
      if (!value) return null;

      const parsed = JSON.parse(value as string);
      return parsed as T;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, options?: CacheOptions): Promise<void> {
    const binding = this.getBinding();
    const fullKey = this.buildKey(key, options?.prefix);
    const ttl = options?.ttl || DEFAULT_TTL;

    try {
      await binding.put(fullKey, JSON.stringify(value), { expirationTtl: ttl });
    } catch (error) {
      console.error('KV cache set error:', error);
    }
  }

  async delete(key: string, options?: CacheOptions): Promise<void> {
    const binding = this.getBinding();
    const fullKey = this.buildKey(key, options?.prefix);

    try {
      await binding.delete(fullKey);
    } catch (error) {
      console.error('KV cache delete error:', error);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const binding = this.getBinding();
    const prefix = this.buildKey(pattern);

    try {
      const { keys } = await binding.list({ prefix });
      for (const key of keys) {
        await binding.delete(key.name);
      }
    } catch (error) {
      console.error('KV cache invalidate error:', error);
    }
  }

  async invalidateAll(): Promise<void> {
    await this.invalidatePattern('');
  }
}

export function createKVCache(config: KVConfig): KVCache {
  return new KVCache(config);
}

export const kvCache = createKVCache({
  bindingName: 'SCHOOL_CACHE',
});

export async function cacheWithInvalidation<T>(
  cache: KVCache,
  key: string,
  fetcher: () => Promise<T>,
  options?: CacheOptions
): Promise<T> {
  const cached = await cache.get<T>(key, options);
  if (cached) return cached;

  const data = await fetcher();
  await cache.set(key, data, options);
  return data;
}

export const CACHE_KEYS = {
  STUDENTS: (id?: string) => (id ? `students:${id}` : 'students:all'),
  CLASSES: (id?: string) => (id ? `classes:${id}` : 'classes:all'),
  TEACHERS: (id?: string) => (id ? `teachers:${id}` : 'teachers:all'),
  SESSIONS: (id?: string) => (id ? `sessions:${id}` : 'sessions:all'),
  FEES: (id?: string) => (id ? `fees:${id}` : 'fees:all'),
  ATTENDANCE: (date: string, classId?: string) => `attendance:${date}:${classId || 'all'}`,
  TIMETABLE: (classId: string, day: number) => `timetable:${classId}:${day}`,
  EXAM_SCHEDULE: (classId: string) => `exam-schedule:${classId}`,
  REPORT_CARDS: (studentId: string) => `report-cards:${studentId}`,
  TRANSPORT: (routeId?: string) => `transport:${routeId || 'routes'}`,
  LIBRARY: (bookId?: string) => `library:${bookId || 'books'}`,
  HEALTH: (studentId: string) => `health:${studentId}`,
  HOLIDAYS: (sessionId: string) => `holidays:${sessionId}`,
  BIRTHDAYS: (month: number) => `birthdays:${month}`,
} as const;
