import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";
import { createApp } from "../../src/app";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");

function parseEnvFile(filePath: string): Record<string, string> {
  if (!existsSync(filePath)) return {};

  const raw = readFileSync(filePath, "utf8");
  const values: Record<string, string> = {};

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

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

function sanitizeSchemaName(schemaName: string): string {
  return schemaName
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/^([^a-z_])/, "_$1")
    .slice(0, 63);
}

function withDirectNeonHost(url: string): string {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  if (parsed.hostname.includes("-pooler.")) {
    parsed.hostname = parsed.hostname.replace("-pooler.", ".");
  }

  return parsed.toString();
}

function withSchemaSearchPath(url: string, schemaName: string): string {
  if (!schemaName) return url;

  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  parsed.searchParams.set("options", `-csearch_path=${schemaName},public`);
  return parsed.toString();
}

function resolveRawDatabaseUrl(): string {
  if (process.env.SCHOOL_MIS_TEST_DATABASE_URL) {
    return process.env.SCHOOL_MIS_TEST_DATABASE_URL;
  }
  if (process.env.SCHOOL_MIS_E2E_DATABASE_URL) {
    return process.env.SCHOOL_MIS_E2E_DATABASE_URL;
  }
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  for (const filePath of [
    resolve(rootDir, ".env.local"),
    resolve(rootDir, ".env"),
    resolve(rootDir, "apps/web/.dev.vars"),
  ]) {
    const parsed = parseEnvFile(filePath);
    if (parsed.DATABASE_URL) return parsed.DATABASE_URL;
  }

  return "postgresql://school_user:school_password@localhost:5432/school_mis";
}

const TEST_DATABASE_SCHEMA = sanitizeSchemaName(
  process.env.SCHOOL_MIS_TEST_DB_SCHEMA ||
    process.env.SCHOOL_MIS_E2E_DB_SCHEMA ||
    "school_mis_e2e",
);
const TEST_DATABASE_URL = withSchemaSearchPath(
  withDirectNeonHost(resolveRawDatabaseUrl()),
  TEST_DATABASE_SCHEMA,
);

process.env.E2E_TEST = "1";
process.env.SCHOOL_MIS_E2E_DB_SCHEMA = TEST_DATABASE_SCHEMA;
process.env.SCHOOL_MIS_E2E_DATABASE_URL = TEST_DATABASE_URL;
process.env.DATABASE_URL = TEST_DATABASE_URL;

const app = createApp();

const testEnv = {
  NODE_ENV: "test",
  DATABASE_URL: TEST_DATABASE_URL,
  DATABASE: { connectionString: TEST_DATABASE_URL },
  BETTER_AUTH_SECRET:
    process.env.BETTER_AUTH_SECRET || "test-secret-min-32-chars-for-api-tests",
} as any;

function shouldUseSsl(connectionString: string): boolean {
  try {
    const host = new URL(connectionString).hostname.toLowerCase();
    return !(
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "::1" ||
      host === "host.docker.internal"
    );
  } catch {
    return false;
  }
}

const TEST_USER_ID = "00000000-0000-4000-8000-000000000001";

export async function apiRequest(
  path: string,
  init?: RequestInit & { auth?: boolean },
): Promise<Response> {
  const { auth = true, ...rest } = init ?? {};
  const headers = new Headers(rest.headers);
  if (auth && !headers.has("x-test-user-id")) {
    headers.set("x-test-user-id", TEST_USER_ID);
  }
  const req = new Request(`http://localhost${path}`, { ...rest, headers });
  return app.fetch(req, testEnv, undefined);
}

export async function withTestSql(
  callback: (sql: ReturnType<typeof postgres>) => Promise<void>,
) {
  const sql = postgres(TEST_DATABASE_URL, {
    max: 1,
    idle_timeout: 5,
    connect_timeout: 10,
    ssl: shouldUseSsl(TEST_DATABASE_URL) ? "require" : false,
  });

  try {
    await sql.unsafe(`CREATE SCHEMA IF NOT EXISTS "${TEST_DATABASE_SCHEMA}"`);
    await sql.unsafe(`SET search_path TO "${TEST_DATABASE_SCHEMA}", public`);
    await callback(sql);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

export async function ensureSchoolSettingsInventoryFixture() {
  await withTestSql(async (sql) => {
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS "school_settings" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "school_name" text NOT NULL,
        "short_name" text NOT NULL,
        "school_address" text DEFAULT '',
        "phone_number" text DEFAULT '',
        "support_email" text DEFAULT '',
        "website_url" text DEFAULT '',
        "logo_url" text DEFAULT '',
        "primary_color" text DEFAULT '#047857',
        "secondary_color" text DEFAULT '#17332a',
        "receipt_footer" text DEFAULT '',
        "mobile_app_name" text DEFAULT 'School MIS',
        "updated_by" uuid,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS "inventory_items" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" text NOT NULL,
        "category" text NOT NULL,
        "quantity" integer DEFAULT 0 NOT NULL,
        "unit" text DEFAULT 'pcs' NOT NULL,
        "threshold" integer DEFAULT 0 NOT NULL,
        "price" numeric(10, 2) DEFAULT '0' NOT NULL,
        "status" varchar(30) DEFAULT 'in-stock' NOT NULL,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS "inventory_orders" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "supplier" text NOT NULL,
        "items" integer DEFAULT 0 NOT NULL,
        "amount" numeric(10, 2) DEFAULT '0' NOT NULL,
        "status" varchar(30) DEFAULT 'pending' NOT NULL,
        "date" date NOT NULL,
        "notes" text DEFAULT '',
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);
  });
}

export async function ensureAttendanceFixture() {
  await withTestSql(async (sql) => {
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS "sessions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" text NOT NULL,
        "start_date" date NOT NULL,
        "end_date" date NOT NULL,
        "is_active" boolean DEFAULT false,
        "status" varchar(20) DEFAULT 'active',
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS "classes" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" text NOT NULL,
        "section" text,
        "session_id" uuid,
        "class_teacher_id" uuid,
        "capacity" integer,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS "students" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "admission_number" text UNIQUE,
        "first_name" text NOT NULL,
        "last_name" text NOT NULL,
        "email" text,
        "phone" text,
        "date_of_birth" date,
        "gender" text,
        "address" text,
        "city" text,
        "state" text,
        "pincode" text,
        "aadhar_number" text,
        "blood_group" text,
        "photo" text,
        "class_id" uuid,
        "session_id" uuid,
        "transport_route_id" uuid,
        "father_name" text,
        "father_phone" text,
        "mother_name" text,
        "mother_phone" text,
        "guardian_name" text,
        "guardian_phone" text,
        "status" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS "attendance" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "student_id" uuid NOT NULL,
        "class_id" uuid NOT NULL,
        "session_id" uuid NOT NULL,
        "date" date NOT NULL,
        "status" varchar(20) NOT NULL,
        "check_in_time" time,
        "check_out_time" time,
        "remarks" text,
        "marked_by" uuid,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    const existingSessions = await sql.unsafe<[{ count: number }]>(
      `SELECT COUNT(*)::int AS count FROM "sessions"`,
    );
    if ((existingSessions[0]?.count ?? 0) === 0) {
      await sql.unsafe(`
        INSERT INTO "sessions" (
          "id", "name", "start_date", "end_date", "is_active", "status"
        ) VALUES (
          '11111111-1111-1111-1111-111111111111',
          '2025-2026',
          '2025-04-01',
          '2026-03-31',
          true,
          'active'
        )
      `);
    }

    const existingClasses = await sql.unsafe<[{ count: number }]>(
      `SELECT COUNT(*)::int AS count FROM "classes"`,
    );
    if ((existingClasses[0]?.count ?? 0) === 0) {
      await sql.unsafe(`
        INSERT INTO "classes" (
          "id", "name", "section", "session_id", "capacity"
        ) VALUES (
          '22222222-2222-2222-2222-222222222222',
          'Class 10',
          'A',
          '11111111-1111-1111-1111-111111111111',
          40
        )
      `);
    }

    const existingStudents = await sql.unsafe<[{ count: number }]>(
      `SELECT COUNT(*)::int AS count FROM "students"`,
    );
    if ((existingStudents[0]?.count ?? 0) === 0) {
      await sql.unsafe(`
        INSERT INTO "students" (
          "id",
          "admission_number",
          "first_name",
          "last_name",
          "email",
          "class_id",
          "session_id",
          "father_name",
          "father_phone"
        ) VALUES (
          '33333333-3333-3333-3333-333333333333',
          'ADM-ATT-001',
          'Attendance',
          'Student',
          'attendance.student@test.local',
          '22222222-2222-2222-2222-222222222222',
          '11111111-1111-1111-1111-111111111111',
          'Guardian Name',
          '+1-555-0199'
        )
      `);
    }
  });
}
