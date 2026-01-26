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

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      // Proxy API requests to the API server running on port 3000
      const apiUrl = new URL(request.url);
      apiUrl.hostname = "localhost";
      apiUrl.port = "3000";
      
      try {
        const response = await fetch(apiUrl.toString(), {
          method: request.method,
          headers: request.headers,
          body: request.body,
        });
        return response;
      } catch (error) {
        console.error("API proxy error:", error);
        return new Response(
          JSON.stringify({ error: "API server unavailable" }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    return handler.fetch(request, {
      context: {},
    } as Parameters<typeof handler.fetch>[1]);
  },
};
