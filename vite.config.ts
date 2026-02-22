import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const parsedPort = Number(env.VITE_PORT);
  const serverPort = Number.isFinite(parsedPort) ? parsedPort : 5173;

  return {
    plugins: [vue(), vueDevTools()],
    envPrefix: ["VITE_", "PUBLIC_"],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      port: serverPort,
    },
    test: {
      environment: "happy-dom",
      setupFiles: ["src/test-setup.ts"],
    },
  };
});
