/**
 * Database Connection - Neon PostgreSQL
 *
 * Uses drizzle-orm with postgres-js for serverless/Neon compatibility.
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/school";

// Neon requires SSL connection
const connectionString = process.env.DATABASE_URL || "";

// Neon's PgBouncer pooler runs in transaction mode, which does not support
// prepared statements. Disable them when the URL points at a pooler, and keep
// the pool small so serverless instances don't exhaust connections.
const isPooler = connectionString.includes("-pooler.");

const client = postgres(connectionString, {
  max: isPooler ? 5 : 20,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: !isPooler,
  ssl: connectionString.includes("sslmode=require") ? "require" : false,
});

export const db = drizzle(client, { schema });

export { schema };
export type Database = typeof db;
