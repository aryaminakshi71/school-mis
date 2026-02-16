/**
 * Sentry Helpers (Cloudflare Workers)
 *
 * Worker entrypoints should initialize Sentry via `@sentry/cloudflare`'s `withSentry(...)`.
 * This module avoids Node-only SDKs and provides safe capture helpers for app code.
 */

import * as Sentry from "@sentry/cloudflare";

function isEnabled(): boolean {
  try {
    return !!Sentry.getClient?.();
  } catch {
    return false;
  }
}

export function initSentry() {
  // no-op: initialized in the Worker entrypoint via withSentry(...)
}

export function captureException(
  error: Error | unknown,
  context?: {
    user?: { id: string; email?: string };
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
  },
) {
  if (!isEnabled()) {
    console.error("[Error]", error);
    return;
  }

  Sentry.withScope((scope) => {
    if (context?.user) scope.setUser(context.user);
    if (context?.tags) {
      for (const [key, value] of Object.entries(context.tags)) {
        scope.setTag(key, value);
      }
    }
    if (context?.extra) {
      for (const [key, value] of Object.entries(context.extra)) {
        scope.setExtra(key, value);
      }
    }
    Sentry.captureException(error);
  });
}

export function captureMessage(
  message: string,
  level: "info" | "warning" | "error" = "info",
  context?: {
    user?: { id: string; email?: string };
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
  },
) {
  if (!isEnabled()) {
    console.log(`[${level.toUpperCase()}]`, message);
    return;
  }

  Sentry.withScope((scope) => {
    scope.setLevel(level);
    if (context?.user) scope.setUser(context.user);
    if (context?.tags) {
      for (const [key, value] of Object.entries(context.tags)) {
        scope.setTag(key, value);
      }
    }
    if (context?.extra) {
      for (const [key, value] of Object.entries(context.extra)) {
        scope.setExtra(key, value);
      }
    }
    Sentry.captureMessage(message);
  });
}

export function setUser(
  user: { id: string; email?: string; name?: string } | null,
) {
  if (!isEnabled()) return;
  Sentry.setUser(user);
}

export async function flush(timeout = 2000) {
  if (!isEnabled()) return;
  await Sentry.flush(timeout);
}

export { Sentry };
