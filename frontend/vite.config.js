import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [tailwindcss(), svelte()],
    resolve: {
      conditions: ["browser"],
    },
    server: {
      port: 5173,
      proxy: {
        "/api/students": {
          target: env.VITE_STUDENT_SERVICE_URL || "http://localhost:8081",
          changeOrigin: true,
        },
        "/api/theses": {
          target: env.VITE_THESIS_SERVICE_URL || "http://localhost:8082",
          changeOrigin: true,
        },
        "/api/registrations": {
          target: env.VITE_REGISTRATION_SERVICE_URL || "http://localhost:8083",
          changeOrigin: true,
        },
        "/api/reports": {
          target: env.VITE_REPORT_SERVICE_URL || "http://localhost:8084",
          changeOrigin: true,
        },
      },
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./src/test/setup.js"],
    },
  };
});
