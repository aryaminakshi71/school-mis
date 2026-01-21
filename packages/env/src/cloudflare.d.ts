/**
 * Cloudflare Workers Types
 *
 * Type definitions for Cloudflare Workers bindings.
 */

export interface Env {
  DATABASE: any;
  NODE_ENV: string;
  VITE_PUBLIC_SITE_URL: string;
  BETTER_AUTH_SECRET: string;
  CACHE: KVNamespace;
  BUCKET: R2Bucket;
}
