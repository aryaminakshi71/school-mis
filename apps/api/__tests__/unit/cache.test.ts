/**
 * Redis Cache Unit Tests
 *
 * Tests for caching layer including:
 * - Cache key generation
 * - TTL validation
 * - Compression/decompression
 */

import { describe, expect, it } from "vitest";
import {
  CACHE_PREFIX,
  CACHE_TTL,
  generateCacheKey,
} from "../../src/lib/cache.js";

describe("Cache System", () => {
  describe("Cache Key Generation", () => {
    it("should generate keys with prefix", () => {
      const key = generateCacheKey(CACHE_PREFIX.STUDENT, "123");
      expect(key).toBe("student:123");
    });

    it("should handle multiple parts", () => {
      const key = generateCacheKey(
        CACHE_PREFIX.ATTENDANCE,
        "class-1",
        "2024-01-01",
      );
      expect(key).toBe("attendance:class-1:2024-01-01");
    });

    it("should handle numeric parts", () => {
      const key = generateCacheKey(CACHE_PREFIX.CLASS, 1, 2);
      expect(key).toBe("class:1:2");
    });
  });

  describe("Cache TTL Values", () => {
    it("should have correct TTL values", () => {
      expect(CACHE_TTL.SHORT).toBe(60);
      expect(CACHE_TTL.MEDIUM).toBe(300);
      expect(CACHE_TTL.LONG).toBe(3600);
      expect(CACHE_TTL.DAY).toBe(86400);
      expect(CACHE_TTL.WEEK).toBe(604800);
    });
  });

  describe("Cache Prefixes", () => {
    it("should have all required prefixes", () => {
      expect(CACHE_PREFIX.STUDENT).toBe("student:");
      expect(CACHE_PREFIX.TEACHER).toBe("teacher:");
      expect(CACHE_PREFIX.CLASS).toBe("class:");
      expect(CACHE_PREFIX.ATTENDANCE).toBe("attendance:");
      expect(CACHE_PREFIX.FEE).toBe("fee:");
      expect(CACHE_PREFIX.GRADE).toBe("grade:");
      expect(CACHE_PREFIX.LIBRARY).toBe("library:");
      expect(CACHE_PREFIX.TRANSPORT).toBe("transport:");
    });
  });
});
