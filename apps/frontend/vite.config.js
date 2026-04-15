import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  plugins: [tailwindcss(), svelte()],
  server: {
    port: 3001,
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL ?? "http://0.0.0.0:3005",
        changeOrigin: true,
      },
    },
  },
});
