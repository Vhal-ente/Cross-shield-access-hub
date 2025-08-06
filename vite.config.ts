// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";

// // https://vitejs.dev/config/
// export default defineConfig(({ mode }) => ({
//   base: "/Cross-shield-access-hub",

//   server: {
//     host: "::",
//     port: 8080,
//   },
//   plugins: [
//     react(),
//     // mode === 'development' && componentTagger(),
//   ].filter(Boolean),
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// }));

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

export default defineConfig(() => ({
  base: "/Cross-shield-access-hub/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    {
      name: "copy-index-to-404",
      closeBundle() {
        const indexPath = path.resolve("dist/index.html");
        const notFoundPath = path.resolve("dist/404.html");
        fs.copyFileSync(indexPath, notFoundPath);
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
