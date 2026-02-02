import handler from "@tanstack/react-start/server-entry";
import api from "@school/api";
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

export default {
  async fetch(
    request: Request,
    env: Record<string, unknown>,
    ctx: any
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api")) {
      return api.fetch(request, env as any, ctx);
    }

    return handler.fetch(request, {
      context: {},
    } as Parameters<typeof handler.fetch>[1]);
  },
};
