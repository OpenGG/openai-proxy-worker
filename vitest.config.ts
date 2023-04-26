import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "c8", // or 'c8'
      reporter: ["text", "json", "html"],
    },
    setupFiles: ["./test/workers/helpers/worker.setup.ts"],
    threads: false,
  },
  resolve: {
    alias: {
      "~": "./src",
    },
  },
});
