import { isTauri } from "@tauri-apps/api/core";

export const envVite = process.env.IS_VITE_ENV ?? "false";
export const envBun = process.env.IS_BUN_ENV ?? "false";
export const envTauri = String(isTauri());

export const isViteEnv = envVite === "true" || envTauri === "true";
export const isBunEnv = envBun === "true";
export const isTauriEnv = envTauri === "true";
