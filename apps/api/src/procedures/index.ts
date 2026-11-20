/**
 * Procedures
 *
 * Composable procedure builders with middleware for authentication and organization scoping.
 */

import { os, ORPCError } from "@orpc/server";
import type { AppContext } from "../context.js";

/**
 * Base procedure with initial context (env, headers, requestId, logger)
 */
export const base = os.$context<AppContext>();

/**
 * Public procedure - no auth required
 */
export const pub = base;

/**
 * Authenticated procedure - requires login
 */
export const authed = base.use(async ({ context, next }) => {
  if (!context.headers) {
    throw new ORPCError("UNAUTHORIZED", {
      message: "Missing headers",
    });
  }

  // Prefer the user set by the Hono auth middleware; fall back to headers.
  const ctxUser = (context as any).user;
  const userId = ctxUser?.id ?? context.headers.get("x-user-id");
  const userEmail = ctxUser?.email ?? context.headers.get("x-user-email");
  const userName = ctxUser?.name ?? context.headers.get("x-user-name");

  if (!userId) {
    throw new ORPCError("UNAUTHORIZED", {
      message: "Authentication required",
    });
  }

  return next({
    context: {
      ...context,
      user: {
        id: userId,
        email: userEmail || "",
        name: userName || "",
        role: ctxUser?.role,
        schoolId: ctxUser?.schoolId,
      },
    },
  });
});

/**
 * Organization-scoped procedure - requires org membership
 */
export const orgAuthed = authed.use(async ({ context, next }) => {
  const orgSlug = context.headers.get("x-organization-slug");
  const orgId =
    context.headers.get("x-organization-id") ||
    (context as any).user?.schoolId;

  if (!orgSlug && !orgId) {
    throw new ORPCError("BAD_REQUEST", {
      message:
        "Organization identifier required (x-organization-slug or x-organization-id header)",
    });
  }

  // Organization context would be loaded from database here
  // For now, we'll use a placeholder
  const organization = {
    id: orgId || "school-1",
    name: "School",
    slug: orgSlug || "default",
    plan: "basic",
  };

  const member = {
    id: "member-1",
    role: "owner" as const,
  };

  return next({
    context: {
      ...context,
      organization,
      member,
    },
  });
});

/**
 * Require specific role(s)
 */
export function requireRole(...roles: Array<"owner" | "admin" | "member">) {
  return orgAuthed.use(async ({ context, next }) => {
    if (!roles.includes(context.member.role)) {
      throw new ORPCError("FORBIDDEN", {
        message: `Required role: ${roles.join(" or ")}`,
      });
    }
    return next({ context });
  });
}

export const adminOnly = requireRole("admin", "owner");
export const ownerOnly = requireRole("owner");
