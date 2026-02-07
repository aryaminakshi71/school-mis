/**
 * Database Client
 *
 * Creates and manages database connections optimized for Cloudflare Workers with Neon.
 * Supports Hyperdrive (Cloudflare Workers) or direct PostgreSQL connection.
 *
 * In Cloudflare Workers:
 * - Use env.DATABASE.connectionString (from Hyperdrive binding)
 * - Automatically uses Neon serverless driver optimized for edge runtime
 *
 * In local development:
 * - Use connectionString parameter or DATABASE_URL env var
 */

import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { neonConfig } from "@neondatabase/serverless";
import postgres from "postgres";
import * as schema from "@school/storage";

let dbInstance: ReturnType<typeof drizzleNeon> | ReturnType<typeof drizzlePostgres> | null = null;

/**
 * Get database connection
 * Supports Hyperdrive connection string from Cloudflare env or direct DATABASE_URL
 */
export function getDb(env?: { DATABASE?: { connectionString: string }; DATABASE_URL?: string }) {
  // Check for Hyperdrive connection string from Cloudflare env
  const connectionString =
    env?.DATABASE?.connectionString ||
    env?.DATABASE_URL ||
    process.env.DATABASE_URL ||
    "postgresql://postgres@localhost:5432/school_mis";

  // Determine if we're in local development
  const isLocal = connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1") ||
    process.env.NODE_ENV === "development";

  if (isLocal) {
    // Local development: Use postgres.js for TCP connections
    // Note: In Cloudflare Workers (workerd), we cannot reuse I/O objects across requests
    // so we must create a new connection for each request in local dev.
    const client = postgres(connectionString, {
      max: 1, // Single connection per request to avoid leaks if we can't close pool
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: false,
    });
    return drizzlePostgres(client, { schema });
  }

  if (!dbInstance) {
    // Production/Cloudflare: Use Neon Serverless (works with Hyperdrive connection strings)

    // drizzle-orm/neon-serverless accepts connection string directly
    dbInstance = drizzleNeon(connectionString, { schema });
  }
  return dbInstance;
}

export { schema };
