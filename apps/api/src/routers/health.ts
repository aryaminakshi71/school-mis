/**
 * Health Router
 *
 * Comprehensive health check endpoint with database and service checks.
 */

import { z } from "zod";
import { pub } from "../procedures";
import { getDb } from "../lib/db";
import { getQueryStats, getSlowQueries } from "../lib/db-performance";

const startTime = Date.now();

export const healthRouter = {
  check: pub
    .route({
      method: "GET",
      path: "/health",
      summary: "Health check",
      tags: ["System"],
    })
    .output(
      z.object({
        status: z.enum(["ok", "error", "degraded"]),
        timestamp: z.string(),
        version: z.string(),
        services: z.object({
          database: z.object({
            status: z.enum(["healthy", "unhealthy", "unknown"]),
            responseTime: z.number().optional(),
            error: z.string().optional(),
          }),
          cache: z.object({
            status: z.enum(["healthy", "unhealthy", "unknown"]),
            responseTime: z.number().optional(),
            error: z.string().optional(),
          }).optional(),
        }),
        uptime: z.number().optional(),
        performance: z.object({
          avgQueryTime: z.number().optional(),
          slowQueries: z.number().optional(),
          errorRate: z.number().optional(),
        }).optional(),
      }),
    )
    .handler(async ({ context }) => {
      // Define type for health check results
      type HealthCheckResult = {
        status: "healthy" | "unhealthy" | "unknown";
        responseTime?: number;
        error?: string;
      };

      const checks: {
        database: HealthCheckResult;
        cache: HealthCheckResult;
      } = {
        database: { status: "unknown", responseTime: 0 },
        cache: { status: "unknown", responseTime: 0 },
      };

      // Check database
      try {
        const dbStart = Date.now();
        const connectionString =
          (context.env as any)?.DATABASE?.connectionString ||
          (context.env as any)?.DATABASE_URL ||
          process.env.DATABASE_URL;

        if (connectionString) {
          const db = getDb(context.env);
          await db.execute("SELECT 1");
          checks.database = {
            status: "healthy",
            responseTime: Date.now() - dbStart,
          };
        } else {
          checks.database = {
            status: "unhealthy",
            error: "Database connection string not configured",
          };
        }
      } catch (error) {
        checks.database = {
          status: "unhealthy",
          error: error instanceof Error ? error.message : "Unknown error",
          responseTime: 0,
        };
      }

      // Check cache (if Redis is configured)
      try {
        const cacheStart = Date.now();
        const redisUrl = (context.env as any)?.REDIS_URL || process.env.REDIS_URL;
        if (redisUrl) {
          checks.cache = {
            status: "healthy",
            responseTime: Date.now() - cacheStart,
          };
        } else {
          checks.cache = {
            status: "unknown",
            error: "Redis not configured",
          };
        }
      } catch (error) {
        checks.cache = {
          status: "unhealthy",
          error: error instanceof Error ? error.message : "Unknown error",
          responseTime: 0,
        };
      }

      // Determine overall status
      const overallStatus =
        checks.database.status === "healthy" &&
          (checks.cache?.status === "healthy" || checks.cache?.status === "unknown")
          ? "ok"
          : checks.database.status === "unhealthy"
            ? "error"
            : "degraded";

      return {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        services: {
          database: {
            status: checks.database.status,
            responseTime: checks.database.responseTime,
            ...(checks.database.error && { error: checks.database.error }),
          },
          ...(checks.cache && {
            cache: {
              status: checks.cache.status,
              ...(checks.cache.responseTime && {
                responseTime: checks.cache.responseTime,
              }),
              ...(checks.cache.error && { error: checks.cache.error }),
            },
          }),
        },
        uptime: Math.floor((Date.now() - startTime) / 1000),
        performance: (() => {
          const stats = getQueryStats();
          const slowQueries = getSlowQueries(1000);
          return {
            avgQueryTime: stats.avgDuration,
            slowQueries: slowQueries.length,
            errorRate: stats.errorRate,
          };
        })(),
      };
    }),
};
