#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) return {};
  const raw = readFileSync(filePath, "utf8");
  const values = {};

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx <= 0) continue;
    const key = trimmed.slice(0, idx).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
    let value = trimmed.slice(idx + 1).trim();
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

function isLocalDatabase(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "::1" ||
      host === "host.docker.internal"
    );
  } catch {
    return false;
  }
}

function withSslModeRequire(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  if (isLocalDatabase(url)) return url;

  const sslmode = parsed.searchParams.get("sslmode");
  if (!sslmode) {
    parsed.searchParams.set("sslmode", "require");
    return parsed.toString();
  }
  if (sslmode === "disable") {
    parsed.searchParams.set("sslmode", "require");
    return parsed.toString();
  }
  return url;
}

function sanitizeSchemaName(schemaName) {
  const sanitized = (schemaName || "")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/^([^a-z_])/, "_$1");

  return sanitized.slice(0, 63);
}

function withDirectNeonHost(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  const host = parsed.hostname;
  if (!host.includes("-pooler.")) return url;

  parsed.hostname = host.replace("-pooler.", ".");
  return parsed.toString();
}

function withSchemaSearchPath(url, schemaName) {
  if (!schemaName) return url;

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  // Use no-space format because libpq URL parsing can treat '+' literally.
  const searchPathOption = `-csearch_path=${schemaName},public`;
  parsed.searchParams.set("options", searchPathOption);
  return parsed.toString();
}

function resolveDatabaseUrl() {
  if (process.env.SCHOOL_MIS_E2E_DATABASE_URL) {
    return process.env.SCHOOL_MIS_E2E_DATABASE_URL;
  }
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const envCandidates = [
    resolve(rootDir, ".env.local"),
    resolve(rootDir, ".env"),
    resolve(rootDir, "apps/web/.dev.vars"),
  ];

  for (const filePath of envCandidates) {
    const parsed = parseEnvFile(filePath);
    if (parsed.DATABASE_URL) {
      return parsed.DATABASE_URL;
    }
  }

  return "";
}

function runStep(label, command, args, env, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const result = spawnSync(command, args, {
      cwd: rootDir,
      stdio: "inherit",
      env,
    });
    if (result.status === 0) return;
    if (attempt < maxAttempts) {
      console.warn(
        `[e2e-db] ${label} failed on attempt ${attempt}/${maxAttempts}, retrying...`,
      );
    }
  }
  throw new Error(`[e2e-db] ${label} failed after ${maxAttempts} attempts`);
}

function quoteIdentifier(identifier) {
  return `"${String(identifier).replaceAll('"', '""')}"`;
}

function loadMigrationFiles() {
  const migrationsDir = resolve(rootDir, "packages/storage/migrations");
  return readdirSync(migrationsDir)
    .filter((entry) => entry.endsWith(".sql"))
    .sort()
    .map((entry) => resolve(migrationsDir, entry));
}

function buildSchemaBootstrapSql(schemaName) {
  const schemaIdentifier = quoteIdentifier(schemaName);
  const migrationSql = loadMigrationFiles()
    .map((filePath) =>
      readFileSync(filePath, "utf8").replaceAll(
        `"public".`,
        `${schemaIdentifier}.`,
      ),
    )
    .join("\n\n");

  return [
    `DROP SCHEMA IF EXISTS ${schemaIdentifier} CASCADE;`,
    `CREATE SCHEMA ${schemaIdentifier};`,
    `SET search_path TO ${schemaIdentifier}, public;`,
    migrationSql,
  ].join("\n\n");
}

function runPsqlStep(label, databaseUrl, script, env) {
  const result = spawnSync("psql", [databaseUrl, "-v", "ON_ERROR_STOP=1"], {
    cwd: rootDir,
    stdio: ["pipe", "inherit", "inherit"],
    env,
    input: script,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error(`[e2e-db] ${label} failed`);
  }
}

function main() {
  const rawUrl = resolveDatabaseUrl();
  if (!rawUrl) {
    throw new Error(
      "[e2e-db] DATABASE_URL not found. Set SCHOOL_MIS_E2E_DATABASE_URL or DATABASE_URL.",
    );
  }

  const schemaName = sanitizeSchemaName(
    process.env.SCHOOL_MIS_E2E_DB_SCHEMA || "",
  );
  const databaseUrl = withSchemaSearchPath(
    withDirectNeonHost(withSslModeRequire(rawUrl)),
    schemaName,
  );
  if (args.has("--print-url")) {
    // Print only the resolved URL for shell command-substitution use.
    console.log(databaseUrl);
    return;
  }
  const host = (() => {
    try {
      return new URL(databaseUrl).hostname;
    } catch {
      return "unknown";
    }
  })();

  const env = {
    ...process.env,
    DATABASE_URL: databaseUrl,
    SCHOOL_MIS_E2E_DATABASE_URL: databaseUrl,
  };

  console.log(`[e2e-db] Preparing database at host: ${host}`);
  if (schemaName) {
    console.log(`[e2e-db] Using isolated schema: ${schemaName}`);
  }
  const strategy = (process.env.SCHOOL_MIS_E2E_DB_STRATEGY || "push")
    .trim()
    .toLowerCase();
  if (strategy === "skip") {
    console.log(
      "[e2e-db] Schema sync skipped (SCHOOL_MIS_E2E_DB_STRATEGY=skip)",
    );
  } else if (schemaName) {
    console.log(
      `[e2e-db] Rebuilding schema ${schemaName} from checked-in SQL migrations`,
    );
    runPsqlStep(
      "schema bootstrap",
      databaseUrl,
      buildSchemaBootstrapSql(schemaName),
      env,
    );
  } else {
    const schemaScript = strategy === "migrate" ? "db:migrate" : "db:push";
    runStep(
      "schema sync",
      "bun",
      ["run", "--cwd", "packages/storage", schemaScript],
      env,
    );
  }

  const shouldSeed = process.env.SCHOOL_MIS_E2E_DB_SEED !== "0";
  if (shouldSeed) {
    runStep(
      "seed",
      "bun",
      ["run", "--cwd", "packages/storage", "db:seed"],
      env,
    );
  } else {
    console.log("[e2e-db] Seed skipped (SCHOOL_MIS_E2E_DB_SEED=0)");
  }
}

main();
