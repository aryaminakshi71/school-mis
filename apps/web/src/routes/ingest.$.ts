import { createFileRoute } from "@tanstack/react-router";

const DEFAULT_POSTHOG_HOST = "https://us.i.posthog.com";

export const Route = createFileRoute("/ingest/$")({
  server: {
    handlers: {
      ANY: async ({ request }) => {
        const url = new URL(request.url);
        const configuredHost =
          import.meta.env.VITE_PUBLIC_POSTHOG_HOST || DEFAULT_POSTHOG_HOST;

        const base = configuredHost.startsWith("http")
          ? configuredHost
          : `https://${configuredHost}`;

        const upstreamPath = url.pathname.replace(/^\/ingest/, "") || "/";
        const upstreamUrl = new URL(`${upstreamPath}${url.search}`, base);

        const headers = new Headers(request.headers);
        headers.delete("host");
        headers.delete("cookie");

        return fetch(upstreamUrl.toString(), {
          method: request.method,
          headers,
          body: request.body,
          redirect: "manual",
        });
      },
    },
  },
});
