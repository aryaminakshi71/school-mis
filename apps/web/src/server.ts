import api from "@school/api";
import { honoIntegration, withSentry } from "@sentry/cloudflare";
import handler from "@tanstack/react-start/server-entry";
import type { getRouter } from "./router";
import type { startInstance } from "./start";

interface AppContext {
  cloudflare?: {
    env: Record<string, string>;
    ctx: { waitUntil: (promise: Promise<void>) => void };
  };
}

declare module "@tanstack/react-start" {
  interface Register {
    ssr: true;
    router: ReturnType<typeof getRouter>;
    config: Awaited<ReturnType<typeof startInstance.getOptions>>;
    server: {
      requestContext: AppContext;
    };
  }
}

export default withSentry(
  (env: Record<string, unknown> = {}) => ({
    dsn: (env as any)?.SENTRY_DSN || (env as any)?.VITE_PUBLIC_SENTRY_DSN,
    environment:
      (env as any)?.SENTRY_ENVIRONMENT ||
      (env as any)?.NODE_ENV ||
      "development",
    release: (env as any)?.SENTRY_RELEASE,
    tracesSampleRate: (env as any)?.NODE_ENV === "production" ? 0.1 : 1.0,
    integrations: [honoIntegration()],
  }),
  {
    async fetch(
      request: Request,
      env: Record<string, unknown>,
      ctx: any,
    ): Promise<Response> {
      // @ts-expect-error Cloudflare runtime may not type `process.env`
      process.env = { ...process.env, ...env };

      const url = new URL(request.url);

      if (url.pathname.startsWith("/api")) {
        return api.fetch(request, env as any, ctx);
      }

      return handler.fetch(request, {
        context: {
          cloudflare: { env, ctx },
        },
      } as Parameters<typeof handler.fetch>[1]);
    },
  },
);
