/**
 * Database Client
 *
 * Creates and manages database connections for API requests.
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@school/storage";

let pool: Pool | null = null;

export function getDb(context: { env?: Record<string, any> }): typeof schema {
  const connectionString =
    context?.env?.DATABASE_URL ||
    process.env.DATABASE_URL ||
    "postgresql://postgres@localhost:5432/school_mis";

  if (!pool) {
    pool = new Pool({ connectionString });
  }

  return drizzle(pool, { schema }) as unknown as typeof schema;
}

export { schema };
