/**
 * Metrics Router — real, DB-backed operational metrics.
 * Protected by ADMIN_TOKEN (x-admin-token header).
 */
import { z } from 'zod'
import { count, eq } from 'drizzle-orm'
import { ORPCError } from '@orpc/server'
import { db, schema } from '@school/storage/db'
import { pub } from '../procedures'

const PLAN_PRICES: Record<string, number> = { free: 0, starter: 29, growth: 79, pro: 149, enterprise: 499 }

export const metricsRouter = {
  get: pub
    .route({ method: 'GET', path: '/metrics', summary: 'Admin metrics', tags: ['Admin'] })
    .output(z.any())
    .handler(async ({ context }) => {
      const ctx = context as any
      const token = ctx.request?.headers?.get?.('x-admin-token') ?? ''
      const env = ctx.env ?? process.env ?? {}
      if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
        throw new ORPCError('UNAUTHORIZED', { message: 'Invalid admin token' })
      }
      const [tenants] = await db.select({ n: count() }).from(schema.organizations)
      const [users] = await db.select({ n: count() }).from(schema.users)
      let activeSubscriptions = 0
      let mrr = 0
      try {
        const subs = await db.select().from((schema as any).billingSubscriptions).where(eq((schema as any).billingSubscriptions.status, 'active'))
        activeSubscriptions = subs.length
        mrr = subs.reduce((acc: number, s: any) => acc + (PLAN_PRICES[s.plan] ?? 0), 0)
      } catch {/* no billing table */}
      return {
        app: 'school-mis', version: '1.0.0', status: 'ok',
        uptimeSeconds: Math.round(process.uptime()),
        tenants: tenants?.n ?? 0, users: users?.n ?? 0,
        activeSubscriptions, mrr, currency: 'USD',
        timestamp: new Date().toISOString(),
      }
    }),
}
