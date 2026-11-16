// Cloudflare Worker entry point for School MIS API
import { api } from "../apps/api/src/app";

// Export the fetch handler for Cloudflare Workers
export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    // Set environment variables from the Workers env
    Object.assign(process.env, env);

    // Handle the request using Hono
    return api.fetch(request, env, ctx);
  },
};
