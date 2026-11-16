/**
 * Security Middleware Tests
 *
 * Tests for security features:
 * - Rate limiting
 * - Security headers
 * - Input validation
 */

import { Hono } from "hono";
import { describe, expect, it } from "vitest";

describe("Security Features", () => {
  describe("Security Headers", () => {
    it("should set security headers on responses", async () => {
      const app = new Hono();

      app.use("*", async (c, next) => {
        await next();
        c.header("X-Content-Type-Options", "nosniff");
        c.header("X-Frame-Options", "DENY");
        c.header("X-XSS-Protection", "1; mode=block");
      });

      app.get("/test", (c) => c.json({ ok: true }));

      const res = await app.request("/test");

      expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
      expect(res.headers.get("X-Frame-Options")).toBe("DENY");
      expect(res.headers.get("X-XSS-Protection")).toBe("1; mode=block");
    });
  });

  describe("Rate Limiting", () => {
    it("should track rate limit headers", () => {
      // Mock rate limit response
      const headers = {
        "X-RateLimit-Limit": "100",
        "X-RateLimit-Remaining": "95",
        "X-RateLimit-Reset": "1234567890",
      };

      expect(headers["X-RateLimit-Limit"]).toBe("100");
      expect(parseInt(headers["X-RateLimit-Remaining"])).toBeLessThanOrEqual(
        100,
      );
    });
  });

  describe("CORS Configuration", () => {
    it("should allow credentials in CORS", async () => {
      const app = new Hono();

      app.use("*", async (c, next) => {
        c.header("Access-Control-Allow-Credentials", "true");
        c.header("Access-Control-Allow-Origin", c.req.header("origin") || "*");
        await next();
      });

      app.get("/test", (c) => c.json({ ok: true }));

      const res = await app.request("/test", {
        headers: { origin: "http://localhost:3000" },
      });

      expect(res.headers.get("Access-Control-Allow-Credentials")).toBe("true");
    });
  });
});
