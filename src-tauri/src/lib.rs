// https://tauri.app/develop/calling-rust

use std::path::Path;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct SystemInfo {
    arch: String,
    platform: String,
    os_version: String,
    memory_usage: MemoryUsage,
    uptime: f64,
}

#[derive(Serialize, Deserialize)]
struct MemoryUsage {
    total: u64,
    available: u64,
    used: u64,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn double_number(value: i32) -> i32 {
    value * 2
}

#[tauri::command(async)]
fn list_files(path: &str) -> Vec<String> {
    let path = Path::new(path);

    path.read_dir()
        .unwrap()
        .map(|entry| entry.unwrap().file_name().to_str().unwrap().to_owned())
        .collect::<Vec<String>>()
}

#[tauri::command]
fn get_system_info() -> SystemInfo {
    let arch = std::env::consts::ARCH.to_string();
    let platform = std::env::consts::OS.to_string();
    
    // Get OS version
    let os_version = match platform.as_str() {
        "windows" => {
            // On Windows, we try to get version info
            "Windows".to_string()
        }
        "macos" => {
            // On macOS, we try to get version info
            "macOS".to_string()
        }
        "linux" => {
            // On Linux, we try to read from /etc/os-release
            if let Ok(content) = std::fs::read_to_string("/etc/os-release") {
                for line in content.lines() {
                    if line.starts_with("PRETTY_NAME=") {
                        let version = line.trim_start_matches("PRETTY_NAME=").trim_matches('"');
                        return SystemInfo {
                            arch,
                            platform,
                            os_version: version.to_string(),
                            memory_usage: get_memory_usage(),
                            uptime: get_uptime(),
                        };
                    }
                }
            }
            "Linux".to_string()
        }
        _ => "Unknown".to_string(),
    };

    SystemInfo {
        arch,
        platform,
        os_version,
        memory_usage: get_memory_usage(),
        uptime: get_uptime(),
    }
}

#[tauri::command]
fn get_node_version() -> String {
    // Try to get Node.js version from environment or command
    if let Ok(output) = std::process::Command::new("node")
        .arg("--version")
        .output()
    {
        if output.status.success() {
            let version = String::from_utf8_lossy(&output.stdout).trim().to_string();
            return version;
        }
    }
    
    // Fallback: check if node is in PATH
    if let Ok(_) = std::process::Command::new("node").arg("--version").status() {
        return "Node.js (version unknown)".to_string();
    }
    
    "Node.js not available".to_string()
}

#[tauri::command]
fn get_bun_version() -> String {
    // Try to get Bun version from environment or command
    if let Ok(output) = std::process::Command::new("bun")
        .arg("--version")
        .output()
    {
        if output.status.success() {
            let version = String::from_utf8_lossy(&output.stdout).trim().to_string();
            return format!("Bun {}", version);
        }
    }
    
    // Fallback: check if bun is in PATH
    if let Ok(_) = std::process::Command::new("bun").arg("--version").status() {
        return "Bun (version unknown)".to_string();
    }
    
    "Bun not available".to_string()
}

fn get_memory_usage() -> MemoryUsage {
    // Try to read memory info from /proc/meminfo on Linux
    if let Ok(content) = std::fs::read_to_string("/proc/meminfo") {
        let mut total = 0;
        let mut available = 0;
        
        for line in content.lines() {
            if line.starts_with("MemTotal:") {
                if let Some(value) = line.split_whitespace().nth(1) {
                    if let Ok(val) = value.parse::<u64>() {
                        total = val * 1024; // Convert from KB to bytes
                    }
                }
            } else if line.starts_with("MemAvailable:") {
                if let Some(value) = line.split_whitespace().nth(1) {
                    if let Ok(val) = value.parse::<u64>() {
                        available = val * 1024; // Convert from KB to bytes
                    }
                }
            }
        }
        
        if total > 0 {
            return MemoryUsage {
                total,
                available,
                used: total - available,
            };
        }
    }
    
    // Fallback for other platforms or if /proc/meminfo is not available
    MemoryUsage {
        total: 0,
        available: 0,
        used: 0,
    }
}

fn get_uptime() -> f64 {
    // Get system uptime in seconds
    if let Ok(uptime_str) = std::fs::read_to_string("/proc/uptime") {
        if let Some(uptime_seconds) = uptime_str.split_whitespace().next() {
            if let Ok(uptime) = uptime_seconds.parse::<f64>() {
                return uptime;
            }
        }
    }
    0.0
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, list_files, double_number, get_system_info, get_node_version, get_bun_version]) // functions registration so tauri knows that these commands exist and allows them to be called from js
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
