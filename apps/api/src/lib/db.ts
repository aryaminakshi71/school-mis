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

import * as schema from "@school/storage";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import postgres from "postgres";

type NeonDb = ReturnType<typeof drizzleNeon>;
let dbInstance: NeonDb | null = null;
let currentConnectionString: string | null = null;

function getConnectionHost(connectionString: string): string {
  try {
    return new URL(connectionString).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function isLocalHost(host: string): boolean {
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host === "host.docker.internal"
  );
}

function shouldUseSsl(connectionString: string, host: string): boolean {
  if (connectionString.includes("sslmode=disable")) return false;
  if (connectionString.includes("sslmode=require")) return true;
  return host.length > 0 && !isLocalHost(host);
}

function resolveE2ESchemaName(): string {
  const candidate = process.env.SCHOOL_MIS_E2E_DB_SCHEMA || "";
  if (process.env.E2E_TEST !== "1" || !candidate) return "";
  return candidate
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/^([^a-z_])/, "_$1")
    .slice(0, 63);
}

function isNeonConnectionError(error: unknown): boolean {
  if (!error) return false;
  const message =
    error instanceof Error ? error.message : JSON.stringify(error);
  return (
    message.includes("internal error") ||
    message.includes("connection") ||
    message.includes("socket") ||
    message.includes("WebSocket")
  );
}

export function resetDbConnection(): void {
  dbInstance = null;
  currentConnectionString = null;
}

export async function runWithRetry<T>(
  operation: (db: NeonDb) => Promise<T>,
  db: NeonDb,
  connectionString: string,
  maxRetries = 3,
): Promise<T> {
  let lastError: unknown;
  let currentDb = db;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation(currentDb);
    } catch (error) {
      lastError = error;
      if (isNeonConnectionError(error) && attempt < maxRetries - 1) {
        resetDbConnection();
        dbInstance = drizzleNeon(connectionString, { schema });
        currentConnectionString = connectionString;
        currentDb = dbInstance;
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export function getDb(env?: {
  DATABASE?: { connectionString: string };
  DATABASE_URL?: string;
}) {
  const e2eSchema = resolveE2ESchemaName();
  const e2eConnectionString =
    process.env.E2E_TEST === "1"
      ? process.env.SCHOOL_MIS_E2E_DATABASE_URL
      : undefined;
  const connectionString =
    e2eConnectionString ||
    env?.DATABASE?.connectionString ||
    env?.DATABASE_URL ||
    process.env.DATABASE_URL ||
    "postgresql://postgres@localhost:5432/school_mis";
  const host = getConnectionHost(connectionString);
  const isLocal = isLocalHost(host);
  const useSsl = shouldUseSsl(connectionString, host);

  if (isLocal || process.env.E2E_TEST === "1") {
    const client = postgres(connectionString, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: useSsl ? "require" : false,
    });
    if (e2eSchema) {
      void client.unsafe(`SET search_path TO "${e2eSchema}", public`);
    }
    return drizzlePostgres(client, { schema });
  }

  if (!dbInstance || currentConnectionString !== connectionString) {
    dbInstance = drizzleNeon(connectionString, { schema });
    currentConnectionString = connectionString;
  }

  return dbInstance;
}

export { schema };
