/**
 * Database Client
 *
 * Creates and manages database connections for API requests.
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@school/storage";

let pool: Pool | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

function getPool(): Pool {
  const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://postgres@localhost:5432/school_mis";

  if (!pool) {
    pool = new Pool({
      connectionString,
      max: 20,                    // Max connections
      idleTimeoutMillis: 30000,   // 30 seconds
      connectionTimeoutMillis: 2000, // 2 seconds
    });
  }

  return pool;
}

export function getDb(): ReturnType<typeof drizzle> {
  if (!dbInstance) {
    const pool = getPool();
    dbInstance = drizzle(pool, { schema });
  }
  return dbInstance;
}

export function getPoolClient(): Pool {
  return getPool();
}

export { schema };
