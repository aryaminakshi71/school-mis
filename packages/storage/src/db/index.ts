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

const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: "require", // Neon requires SSL
});

export const db = drizzle(client, { schema });

export { schema };
export type Database = typeof db;
