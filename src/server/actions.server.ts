import { z } from "zod";

import { isBunEnv, isTauriEnv, isViteEnv } from "@/utils/env";

// Type definitions for Tauri system info
interface TauriSystemInfo {
  arch: string;
  memory_usage: {
    available: number;
    total: number;
    used: number;
  };
  os_version: string;
  platform: string;
  uptime: number;
}

// Validation schemas
const GreetSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
});

const DoubleNumberSchema = z.object({
  value: z.number().min(-1000).max(1000),
});

const TestEndpointSchema = z.object({
  endpoint: z.string().url("Must be a valid URL"),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
});

const ListFilesSchema = z.object({
  path: z.string().min(1, "Path is required"),
});

// Core Functions
export async function greet(data: z.infer<typeof GreetSchema>) {
  try {
    if (isTauriEnv) {
      // Use Tauri invoke when available
      // https://tauri.app/develop/calling-rust
      const { invoke } = await import("@tauri-apps/api/core");
      const message = await invoke("greet", { name: data.name });
      return {
        message,
        source: "tauri-invoke",
        timestamp: new Date().toISOString(),
      };
    }
    // Fallback to server action implementation
    return {
      message: `Hello, ${data.name}! Welcome to Relbox with Server Actions!`,
      source: "server-action",
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      source: "error",
      timestamp: new Date().toISOString(),
    };
  }
}

// Attach validation schema
greet.schema = GreetSchema;

export async function doubleNumber(data: z.infer<typeof DoubleNumberSchema>) {
  try {
    if (isTauriEnv) {
      // Use Tauri invoke when available
      const { invoke } = await import("@tauri-apps/api/core");
      const result = await invoke("double_number", { value: data.value });
      return {
        doubled: result,
        original: data.value,
        source: "tauri-invoke",
        timestamp: new Date().toISOString(),
      };
    }
    // Fallback to server action implementation
    const result = data.value * 2;
    return {
      doubled: result,
      original: data.value,
      source: "server-action",
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      source: "error",
      timestamp: new Date().toISOString(),
    };
  }
}

// Attach validation schema
doubleNumber.schema = DoubleNumberSchema;

// API Testing Function
export async function testEndpoint(data: z.infer<typeof TestEndpointSchema>) {
  try {
    const response = await fetch(data.endpoint, {
      headers: {
        "Content-Type": "application/json",
      },
      method: data.method,
    });

    const responseData = await response.json();

    return {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
      success: true,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      success: false,
      timestamp: new Date().toISOString(),
    };
  }
}

// Attach validation schema
testEndpoint.schema = TestEndpointSchema;

// File System Functions
export async function listFiles(data: z.infer<typeof ListFilesSchema>) {
  try {
    if (isTauriEnv) {
      // Use Tauri invoke when available
      const { invoke } = await import("@tauri-apps/api/core");
      const files = await invoke<string[]>("list_files", { path: data.path });
      return {
        count: Array.isArray(files) ? files.length : 0,
        files: Array.isArray(files) ? files : [],
        path: data.path,
        source: "tauri-invoke",
        success: true,
        timestamp: new Date().toISOString(),
      };
    }
    // Fallback to server action implementation
    const mockFiles = [
      "document.txt",
      "image.jpg",
      "data.json",
      "script.js",
      "style.css",
    ];

    return {
      count: mockFiles.length,
      files: mockFiles,
      path: data.path,
      source: "server-action",
      success: true,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      source: "error",
      success: false,
      timestamp: new Date().toISOString(),
    };
  }
}

// Attach validation schema
listFiles.schema = ListFilesSchema;

export async function getSystemInfo() {
  try {
    if (isTauriEnv) {
      // Use Tauri invoke when available
      const { invoke } = await import("@tauri-apps/api/core");
      const { homeDir } = await import("@tauri-apps/api/path");
      const systemInfo = await invoke<TauriSystemInfo>("get_system_info");
      const nodeVersion = await invoke<string>("get_node_version");
      const bunVersion = await invoke<string>("get_bun_version");
      const homeDirectory = await homeDir();

      return {
        // System Information
        arch: systemInfo.arch,
        bunVersion: bunVersion,
        environment: "tauri",
        homeDir: homeDirectory,
        // Environment Information
        isBunEnv,
        isTauriEnv,
        isViteEnv,
        language:
          typeof navigator !== "undefined" ? navigator.language : "Unknown",
        memoryUsage: {
          external: 0,
          heapTotal: systemInfo.memory_usage.total,
          heapUsed: systemInfo.memory_usage.used,
          rss: systemInfo.memory_usage.available,
        },
        nodeEnv:
          typeof process !== "undefined"
            ? process.env.NODE_ENV || "development"
            : "browser",

        nodeVersion: nodeVersion,
        platform: systemInfo.platform,
        source: "tauri-invoke",
        timestamp: new Date().toISOString(),
        uptime: systemInfo.uptime,
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
      };
    }

    // Check if we're in a Node.js environment
    if (typeof process !== "undefined" && process.version) {
      return {
        // System Information
        arch: process.arch,
        bunVersion: "Bun not available in Node.js environment",
        environment: "node",
        homeDir: process.env.HOME || process.env.USERPROFILE || "/home/user",
        // Environment Information
        isBunEnv,
        isTauriEnv,
        isViteEnv,
        language: "Unknown",
        memoryUsage: process.memoryUsage(),

        nodeEnv: process.env.NODE_ENV || "development",
        nodeVersion: process.version,
        platform: process.platform,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        userAgent: "Node.js Environment",
      };
    }

    // Fallback for browser/Bun environment
    return {
      // System Information
      arch: "Browser",
      // Environment Information
      environment: isBunEnv ? "browser-bun" : "browser-vite",
      homeDir: "Browser Environment - No Home Directory",
      isBunEnv,
      isTauriEnv,
      isViteEnv,
      language:
        typeof navigator !== "undefined" ? navigator.language : "Unknown",
      memoryUsage: {
        external: 0,
        heapTotal: 0,
        heapUsed: 0,
        rss: 0,
      },

      nodeEnv: "browser",
      nodeVersion: "Browser",
      platform:
        typeof navigator !== "undefined" ? navigator.platform : "Unknown",
      timestamp: new Date().toISOString(),
      uptime: 0,
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
    };
  } catch (error) {
    return {
      environment: "unknown",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
}
