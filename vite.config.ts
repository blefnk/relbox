import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(() => {
  // https://vite.dev/config
  // https://tauri.app/start

  return {
    clearScreen: false,

    define: {
      global: "globalThis",
      "process.env.IS_BUN_ENV": JSON.stringify("false"),
      "process.env.IS_TAURI_ENV": JSON.stringify("false"),
      "process.env.IS_VITE_ENV": JSON.stringify("true"),
    },

    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./shared"),
        "~": path.resolve(__dirname, "./src"),
        "~lynx": path.resolve(__dirname, "./src-lynx"),
        "~next": path.resolve(__dirname, "./src-next"),
        "~tauri": path.resolve(__dirname, "./src-tauri"),
        "~vsce": path.resolve(__dirname, "./src-vsce"),
        "~wxt": path.resolve(__dirname, "./src-wxt"),
      },
    },

    server: {
      hmr: host
        ? {
            host,
            port: 1421,
            protocol: "ws",
          }
        : undefined,
      host: host || false,
      port: 1420,
      strictPort: true,
      watch: { ignored: ["**/src-tauri/**"] },
    },
  };
});
