/**
 * Audit Logging Middleware
 *
 * Logs all non-GET requests for compliance and security.
 * Captures who did what, when, and from where.
 */

import { auditLogs } from "@school/storage";
import type { Context, MiddlewareHandler, Next } from "hono";
import { getDb } from "../lib/db";

/**
 * Audit log middleware
 * Logs all mutations (POST, PUT, PATCH, DELETE) with context
 */
export const auditLogMiddleware: MiddlewareHandler = async (
  c: Context,
  next: Next,
) => {
  const start = Date.now();

  await next();

  const method = c.req.method;

  // Only audit non-read operations
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return;
  }

  // Skip health checks and audit endpoints themselves
  const path = c.req.path;
  if (path === "/api/health" || path.startsWith("/api/audit/")) {
    return;
  }

  try {
    const db = getDb(c.env);
    const user = c.get("user");
    const session = c.get("session");

    // Get IP address
    const ip =
      c.req.header("cf-connecting-ip") ||
      c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
      c.req.header("x-real-ip") ||
      "unknown";

    // Get request body (if available and safe to log)
    let requestBody: Record<string, unknown> | null = null;
    const contentType = c.req.header("content-type") || "";

    // Only capture body for certain content types and exclude sensitive fields
    if (contentType.includes("application/json")) {
      try {
        const clonedReq = c.req.raw.clone();
        const bodyText = await clonedReq.text();
        const body = JSON.parse(bodyText);

        // Remove sensitive fields
        requestBody = sanitizeBody(body);
      } catch {
        // Ignore parsing errors
      }
    }

    // Calculate response time
    const responseTime = Date.now() - start;

    await db.insert(auditLogs).values({
      actorUserId: user?.id || null,
      actorEmail: user?.email || null,
      organizationId: user?.schoolId || null,
      action: `${method} ${path}`,
      requestMethod: method,
      requestPath: path,
      requestBody: requestBody,
      responseStatus: c.res.status,
      responseTime,
      ipAddress: ip,
      userAgent: c.req.header("user-agent") || null,
      sessionId: session?.id || null,
      metadata: {
        requestId: c.get("requestId") || crypto.randomUUID(),
        queryParams: Object.fromEntries(new URL(c.req.url).searchParams),
      },
    });
  } catch (err) {
    // Log error but don't fail the request
    console.error("[AuditLog] Failed to write audit log:", err);
  }
};

/**
 * Sanitize request body by removing sensitive fields
 */
function sanitizeBody(body: Record<string, unknown>): Record<string, unknown> {
  const sensitiveFields = [
    "password",
    "passwordHash",
    "token",
    "secret",
    "apiKey",
    "creditCard",
    "cvv",
    "ssn",
    "pan",
    "aadhar",
  ];

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(body)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = sensitiveFields.some((field) =>
      lowerKey.includes(field.toLowerCase()),
    );

    if (isSensitive) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeBody(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Create manual audit log entry
 * Use this for actions that need explicit audit logging
 */
export async function createAuditLog(
  c: Context,
  data: {
    action: string;
    resourceType?: string;
    resourceId?: string;
    details?: Record<string, unknown>;
    oldValues?: Record<string, unknown>;
    newValues?: Record<string, unknown>;
  },
): Promise<void> {
  try {
    const db = getDb(c.env);
    const user = c.get("user");
    const session = c.get("session");

    const ip =
      c.req.header("cf-connecting-ip") ||
      c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
      c.req.header("x-real-ip") ||
      "unknown";

    await db.insert(auditLogs).values({
      actorUserId: user?.id || null,
      actorEmail: user?.email || null,
      organizationId: user?.schoolId || null,
      action: data.action,
      requestMethod: "ACTION",
      requestPath: c.req.path,
      resourceType: data.resourceType || null,
      resourceId: data.resourceId || null,
      details: data.details || null,
      oldValues: data.oldValues || null,
      newValues: data.newValues || null,
      ipAddress: ip,
      userAgent: c.req.header("user-agent") || null,
      sessionId: session?.id || null,
      metadata: {
        requestId: c.get("requestId") || crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("[AuditLog] Failed to create manual audit log:", err);
  }
}
