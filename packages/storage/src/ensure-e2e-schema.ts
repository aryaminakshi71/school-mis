import postgres from "postgres";

function sanitizeSchemaName(schemaName: string): string {
  return schemaName
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/^([^a-z_])/, "_$1")
    .slice(0, 63);
}

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

const connectionString =
  process.env.SCHOOL_MIS_E2E_DATABASE_URL || process.env.DATABASE_URL || "";
const schemaName = sanitizeSchemaName(
  process.env.SCHOOL_MIS_E2E_DB_SCHEMA || "",
);

if (!connectionString || !schemaName) {
  process.exit(0);
}

const host = getConnectionHost(connectionString);
const useSsl = shouldUseSsl(connectionString, host);

const sql = postgres(connectionString, {
  max: 1,
  idle_timeout: 5,
  connect_timeout: 10,
  ssl: useSsl ? "require" : false,
});

try {
  await sql.unsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
  console.log(`[e2e-db] ensured schema: ${schemaName}`);
} finally {
  await sql.end({ timeout: 5 });
}
