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

let apiApp: any;

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      if (!apiApp) {
        const api = await import("@school/api");
        apiApp = api.default as any;
      }
      return apiApp.fetch(request);
    }

    return handler.fetch(request, {
      context: {},
    } as Parameters<typeof handler.fetch>[1]);
  },
};
