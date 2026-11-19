/**
 * SchoolAI API server entry (Bun)
 *
 * Loads .env and serves the Hono app with the real environment.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { createApp } from "./app";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Bun/Node 20+: load the root .env without an external dependency.
try {
  process.loadEnvFile(path.resolve(__dirname, "../../../.env"));
} catch {
  // .env optional in production (secrets come from the platform)
}

// The API has its own port so it can run alongside the web dev server,
// which owns PORT. Falls back to 3016 to match .env / .env.example.
const PORT = Number(process.env.API_PORT ?? process.env.PORT ?? 3016);
const app = createApp();

const server = Bun.serve({
  port: PORT,
  fetch: (req) => app.fetch(req, process.env as any, undefined),
});

console.log(`SchoolAI API running on http://localhost:${server.port}`);
