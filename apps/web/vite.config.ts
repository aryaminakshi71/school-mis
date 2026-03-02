import path from "path";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, loadEnv } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  // Capture PORT from shell BEFORE loadEnv (which might load PORT from .env)
  const shellPort = process.env.PORT;
  const isE2E = process.env.E2E_TEST === "1";
  // Load env from root (../../)
  const env = loadEnv(mode, path.resolve(__dirname, "../../"), "");
  // PORT from shell environment takes highest priority
  const port = shellPort || env.PORT || "3000";
  const devtoolsPort = Number.isFinite(Number(port))
    ? Number(port) + 10000
    : 42069;
  process.env = { ...process.env, ...env };

  return {
    // Vite equivalent of Next.js transpilePackages for monorepo workspace packages
    optimizeDeps: {
      // Exclude workspace packages so they are compiled as source
      exclude: ["@school/env", "@school/api", "@school/storage"],
    },
    build: {
      target: "esnext",
      minify: "esbuild",
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        external: [
          // Externalize Cloudflare-specific modules
          "cloudflare:workers",
          "@scalar/hono-api-reference",
        ],
      },
    },
    environments: {
      client: {
        build: {
          rollupOptions: {
            output: {
              manualChunks: (id: string) => {
                if (!id.includes("node_modules")) return;
                if (id.includes("/react/") || id.includes("react-dom"))
                  return "vendor-react";
                if (id.includes("@tanstack/")) return "vendor-tanstack";
                if (id.includes("@radix-ui/")) return "vendor-radix";
                if (
                  id.includes("react-hook-form") ||
                  id.includes("@hookform/resolvers")
                )
                  return "vendor-forms";
                if (id.includes("lucide-react")) return "vendor-icons";
                if (
                  id.includes("recharts") ||
                  id.includes("d3-") ||
                  id.includes("xlsx")
                )
                  return "vendor-charts";
                if (id.includes("posthog-js") || id.includes("@sentry/"))
                  return "vendor-analytics";
                if (id.includes("/zod/")) return "vendor-zod";
              },
            },
          },
        },
      },
    },
    server: {
      port: Number(port),
      host: isE2E ? "127.0.0.1" : true,
      strictPort: true,
    },
    plugins: [
      viteTsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      ...(process.env.SKIP_CLOUDFLARE !== "true"
        ? [
            cloudflare({
              viteEnvironment: { name: "ssr" },
              persistState: true,
            }),
          ]
        : []),
      !isE2E &&
        devtools({
          eventBusConfig: {
            port: devtoolsPort,
          },
        }),
      tailwindcss(),
      tanstackStart({
        srcDirectory: "src",
        start: { entry: "./start.tsx" },
        server: { entry: "./server.ts" },
      }),
      viteReact(),
      // Bundle analyzer (only in production builds when ANALYZE=true)
      process.env.ANALYZE === "true" &&
        visualizer({
          filename: "./dist/stats.html",
          open: true,
          gzipSize: true,
          brotliSize: true,
          template: "treemap",
        }),
    ].filter(Boolean),
  };
});
