import * as Sentry from "@sentry/react";

let initialized = false;

export function initSentry() {
  if (initialized) return;

  const dsn =
    import.meta.env.VITE_PUBLIC_SENTRY_DSN || import.meta.env.SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment:
      import.meta.env.VITE_PUBLIC_SENTRY_ENV ||
      import.meta.env.SENTRY_ENVIRONMENT ||
      import.meta.env.MODE,
    release:
      import.meta.env.VITE_PUBLIC_SENTRY_RELEASE ||
      import.meta.env.SENTRY_RELEASE,
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
  });

  initialized = true;
}

// Export individual functions for convenience
export const captureException = Sentry.captureException;
export const captureMessage = Sentry.captureMessage;
export const addBreadcrumb = Sentry.addBreadcrumb;

export { Sentry };
