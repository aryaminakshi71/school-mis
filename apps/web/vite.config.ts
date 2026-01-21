import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { devtools } from "@tanstack/devtools-vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": "/Users/aryaminakshi/Developer/school-mis/apps/web/src",
    },
  },
  plugins: [
    viteTsConfigPaths({
      projects: [
        "/Users/aryaminakshi/Developer/school-mis/apps/web/tsconfig.json",
      ],
    }),
    devtools(),
    tailwindcss(),
    tanstackStart({
      srcDirectory: "src",
      start: { entry: "./start.tsx" },
      server: { entry: "./server.ts" },
    }),
    viteReact(),
  ],
  server: {
    port: 3007,
  },
  ssr: {
    noExternal: ["@school/api", "@school/storage", "drizzle-orm"],
  },
});
