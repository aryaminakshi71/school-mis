import { ORPCError } from "@orpc/server";
import { db, organizations, users } from "@school/storage";
import { count } from "drizzle-orm";
/**
 * Metrics Router — real, DB-backed operational metrics.
 * Protected by ADMIN_TOKEN (x-admin-token header).
 */
import { z } from "zod";
import { pub } from "../procedures";

export const metricsRouter = {
  get: pub
    .route({
      method: "GET",
      path: "/metrics",
      summary: "Admin metrics",
      tags: ["Admin"],
    })
    .output(z.any())
    .handler(async ({ context }) => {
      const ctx = context as any;
      const token =
        ctx.request?.headers?.get?.("x-admin-token") ??
        ctx.headers?.get?.("x-admin-token") ??
        "";
      const env = ctx.env ?? process.env ?? {};
      if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
        throw new ORPCError("UNAUTHORIZED", { message: "Invalid admin token" });
      }

      const [tenantCount] = await db.select({ n: count() }).from(organizations);
      const [userCount] = await db.select({ n: count() }).from(users);

      return {
        app: "school-mis",
        version: "1.0.0",
        status: "ok",
        uptimeSeconds: Math.round(process.uptime()),
        tenants: tenantCount?.n ?? 0,
        users: userCount?.n ?? 0,
        activeSubscriptions: 0,
        mrr: 0,
        currency: "INR",
        timestamp: new Date().toISOString(),
      };
    }),
};
