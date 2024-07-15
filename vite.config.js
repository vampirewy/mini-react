/// <reference types="vitest" />

import { defineConfig } from "vite";

export default defineConfig({
  test: {
    environment: "happy-dom",
  },
  esbuild: {
    jsxInject: `import React from './core/React.js'`,
  },
});
