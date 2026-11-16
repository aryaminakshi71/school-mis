import { api } from "@school/auth";
import type { Role } from "@school/auth";
import type { Context, MiddlewareHandler, Next } from "hono";

/**
 * Extend Hono context with auth types
 */
declare module "hono" {
  interface ContextVariableMap {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      schoolId?: string;
      emailVerified: boolean;
    } | null;
    session: {
      id: string;
      expiresAt: Date;
    } | null;
  }
}

/**
 * Authentication middleware
 * Validates the session token and sets user context
 */
export const authMiddleware: MiddlewareHandler = async (
  c: Context,
  next: Next,
) => {
  // Get session from request
  const session = await api.getSession({
    headers: c.req.raw.headers,
  });

  if (session) {
    c.set("user", {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      schoolId: session.user.schoolId,
      emailVerified: session.user.emailVerified,
    });
    c.set("session", {
      id: session.session.id,
      expiresAt: new Date(session.session.expiresAt),
    });
  } else {
    c.set("user", null);
    c.set("session", null);
  }

  await next();
};

/**
 * Require authentication middleware
 * Returns 401 if user is not authenticated
 */
export const requireAuth: MiddlewareHandler = async (
  c: Context,
  next: Next,
) => {
  const user = c.get("user");

  if (!user) {
    return c.json({ error: "Unauthorized - Please login first" }, 401);
  }

  await next();
};

/**
 * Require specific role middleware
 * Returns 403 if user doesn't have the required role
 */
export function requireRole(...allowedRoles: Role[]): MiddlewareHandler {
  return async (c: Context, next: Next) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized - Please login first" }, 401);
    }

    if (!allowedRoles.includes(user.role as Role)) {
      return c.json(
        {
          error: "Forbidden - Insufficient permissions",
          required: allowedRoles,
          current: user.role,
        },
        403,
      );
    }

    await next();
  };
}

/**
 * Require any of the specified roles middleware
 */
export function requireAnyRole(...allowedRoles: Role[]): MiddlewareHandler {
  return async (c: Context, next: Next) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized - Please login first" }, 401);
    }

    const hasRole = allowedRoles.some((role) => role === user.role);
    if (!hasRole) {
      return c.json(
        {
          error: "Forbidden - Insufficient permissions",
          required: allowedRoles,
          current: user.role,
        },
        403,
      );
    }

    await next();
  };
}

/**
 * Require verified email middleware
 */
export const requireVerifiedEmail: MiddlewareHandler = async (
  c: Context,
  next: Next,
) => {
  const user = c.get("user");

  if (!user) {
    return c.json({ error: "Unauthorized - Please login first" }, 401);
  }

  if (!user.emailVerified) {
    return c.json(
      {
        error: "Email not verified - Please verify your email first",
        email: user.email,
      },
      403,
    );
  }

  await next();
};

/**
 * Optional auth middleware
 * Sets user context if available, but doesn't require it
 */
export const optionalAuth: MiddlewareHandler = async (
  c: Context,
  next: Next,
) => {
  try {
    const session = await api.getSession({
      headers: c.req.raw.headers,
    });

    if (session) {
      c.set("user", {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        schoolId: session.user.schoolId,
        emailVerified: session.user.emailVerified,
      });
      c.set("session", {
        id: session.session.id,
        expiresAt: new Date(session.session.expiresAt),
      });
    }
  } catch {
    // Silently fail - auth is optional
  }

  await next();
};
