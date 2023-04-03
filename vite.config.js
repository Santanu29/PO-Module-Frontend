import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// });
export default defineConfig({
  plugins: [react()],
  // root: path.resolve(__dirname, 'src'),
  build: {
    outDir: "./build",
  },
  resolve: {
    alias: {
      "~bootstrap": path.resolve(__dirname, "node_modules/bootstrap"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom", // add jsdom
    setupFiles: "./src/tests/setupTests.ts", // setup includes
    coverage: {
      // config coverage
      reporter: ["text", "html"], // generate coverage reports
      exclude: [
        // dont test the following files
        "node_modules/",
        "src/tests/setupTests.ts",
      ],
    },
  },
});
