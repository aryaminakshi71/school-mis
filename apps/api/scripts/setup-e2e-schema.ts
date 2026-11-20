/**
 * Prepare the integration-test schema.
 *
 * Creates `school_mis_e2e` (or SCHOOL_MIS_TEST_DB_SCHEMA) and clones every
 * table from `public` with LIKE ... INCLUDING ALL, then seeds a test admin.
 * This keeps the e2e schema in lock-step with the real schema without
 * re-running migrations.
 *
 * Usage: bun run scripts/setup-e2e-schema.ts
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

function parseEnvFile(filePath: string): Record<string, string> {
  if (!existsSync(filePath)) return {};
  const values: Record<string, string> = {};
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i <= 0) continue;
    const key = trimmed.slice(0, i).trim();
    let value = trimmed.slice(i + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
}

const env = parseEnvFile(resolve(rootDir, ".env"));
const rawUrl =
  process.env.SCHOOL_MIS_TEST_DATABASE_URL ||
  process.env.DATABASE_URL ||
  env.DATABASE_URL;

if (!rawUrl) {
  console.error("No DATABASE_URL found. Set it in .env or the environment.");
  process.exit(1);
}

const schema = (
  process.env.SCHOOL_MIS_TEST_DB_SCHEMA || "school_mis_e2e"
)
  .toLowerCase()
  .replace(/[^a-z0-9_]/g, "_")
  .replace(/^([^a-z_])/, "_$1")
  .slice(0, 63);

const url = new URL(rawUrl);
if (url.hostname.includes("-pooler.")) {
  url.hostname = url.hostname.replace("-pooler.", ".");
}

const sql = postgres(url.toString(), {
  max: 1,
  idle_timeout: 5,
  connect_timeout: 15,
  ssl: url.hostname.includes("neon.tech") ? "require" : false,
});

const TEST_USER_ID = "00000000-0000-4000-8000-000000000001";
const TEST_SCHOOL_ID = "00000000-0000-4000-8000-000000000002";

try {
  console.log(`Preparing schema "${schema}"…`);
  await sql.unsafe(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);

  const tables = await sql<{ table_name: string }[]>`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `;

  for (const { table_name } of tables) {
    await sql.unsafe(
      `CREATE TABLE IF NOT EXISTS "${schema}"."${table_name}" (LIKE public."${table_name}" INCLUDING ALL)`,
    );
  }
  console.log(`Cloned ${tables.length} tables.`);

  // Seed a school + admin user for authenticated tests.
  await sql.unsafe(`
    INSERT INTO "${schema}"."schools" ("id", "name", "code", "email", "phone", "address", "is_active")
    VALUES ('${TEST_SCHOOL_ID}', 'E2E Test School', 'E2E', 'e2e@school.test', '0000000000', 'Test', true)
    ON CONFLICT ("id") DO NOTHING
  `).catch(() => {
    // schools table may not exist in older schemas; ignore.
  });

  await sql.unsafe(`
    INSERT INTO "${schema}"."users"
      ("id", "email", "email_verified", "name", "role", "school_id", "is_active")
    VALUES
      ('${TEST_USER_ID}', 'e2e-admin@school.test', true, 'E2E Admin', 'school_admin', '${TEST_SCHOOL_ID}', true)
    ON CONFLICT ("id") DO NOTHING
  `);
  console.log(`Seeded test admin ${TEST_USER_ID}.`);
  console.log("Done.");
} catch (error) {
  console.error("Failed to prepare e2e schema:", error);
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}
