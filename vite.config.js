import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsxInject: `import React from './core/React.js'`,
  },
});
