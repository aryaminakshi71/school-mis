/**
 * SchoolAI API server entry (Bun)
 *
 * Loads .env and serves the Hono app with the real environment.
 */

import { fileURLToPath } from "node:url";
import path from "node:path";
import { createApp } from "./app";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Bun/Node 20+: load the root .env without an external dependency.
try {
  process.loadEnvFile(path.resolve(__dirname, "../../../.env"));
} catch {
  // .env optional in production (secrets come from the platform)
}

const PORT = Number(process.env.PORT ?? 3015);
const app = createApp();

const server = Bun.serve({
  port: PORT,
  fetch: (req) => app.fetch(req, process.env as any, undefined),
});

console.log(`SchoolAI API running on http://localhost:${server.port}`);
