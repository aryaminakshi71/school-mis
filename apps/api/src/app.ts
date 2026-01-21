/**
 * API Application
 *
 * Hono app with oRPC integration for Node.js server.
 */

import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import type { AppContext } from "./context.js";
import { loggerMiddleware } from "./middleware/logger.js";
import { appRouter } from "./routers/index.js";

/**
 * Create Hono app with all routes
 */
export function createApp() {
  const app = new Hono();

  // Global middleware
  app.use(
    "*",
    cors({ origin: (origin: string | null) => origin, credentials: true }),
  );
  app.use("*", requestId());
  app.use("*", loggerMiddleware);

  // Health check (non-RPC)
  app.get("/api/health", (c: any) => {
    return c.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    });
  });

  // oRPC handler
  const rpcHandler = new RPCHandler(appRouter, {
    interceptors: [
      onError((error: unknown) => {
        console.error("[RPC Error]", error);
      }),
    ],
  });

  app.use("/api/rpc/*", async (c: any, next: any) => {
    const initialContext: AppContext = {
      env: process.env as unknown as AppContext["env"],
      headers: c.req.raw.headers,
      requestId: c.get("requestId") || crypto.randomUUID(),
      logger: c.get("logger"),
      db: {} as any,
    };

    const { matched, response } = await rpcHandler.handle(c.req.raw, {
      prefix: "/api/rpc",
      context: initialContext,
    });

    if (matched && response) {
      return c.newResponse(response.body, response);
    }

    await next();
  });

  return app;
}

// Default app instance
export const api = createApp();
