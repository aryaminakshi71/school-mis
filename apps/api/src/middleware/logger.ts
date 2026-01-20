/**
 * Logger Middleware
 *
 * Simple request logging for development.
 */

import type { Context } from 'hono';

export async function loggerMiddleware(c: Context, next: () => Promise<void>) {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;
  console.log(`${c.req.method} ${c.req.url} - ${c.res.status} - ${duration}ms`);
}
