/**
 * Simple test server for school-mis API
 */
import { createApp } from "./src/app";

const PORT = 3015;

const app = createApp();

Bun.serve({
  port: PORT,
  fetch: (req) =>
    app.fetch(
      req,
      {
        DATABASE: { connectionString: "" },
        NODE_ENV: "development",
        BETTER_AUTH_SECRET: "test-secret-min-32-chars-here",
      } as any,
      undefined,
    ),
});

console.log(`school-mis API running on http://localhost:${PORT}`);
