import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 3001,
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL ?? "http://localhost:3005",
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: { exclude: ["svelte-routing", "js-cookie"] },
});
