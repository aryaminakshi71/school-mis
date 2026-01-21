import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { devtools } from "@tanstack/devtools-vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";

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
    tanstackStart({
      srcDirectory: "src",
      start: { entry: "./start.tsx" },
      server: { entry: "./server.ts" },
    }),
    viteReact(),
  ],
  server: {
    port: 3007,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
