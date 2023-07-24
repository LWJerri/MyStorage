import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 3001,
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL ?? "http://0.0.0.0:3005",
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: { exclude: ["svelte-routing"] },
});
