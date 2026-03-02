import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { type UserConfig, defineConfig } from "vitest/config";

const plugins = [react(), tsconfigPaths()] as unknown as UserConfig["plugins"];

export default defineConfig({
  plugins,
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/e2e/**", "**/node_modules/**", "**/dist/**", "**/build/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/test/", "**/*.d.ts", "e2e/**", "dist/**"],
    },
  },
});
