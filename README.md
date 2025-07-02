# 🚠 Relbox

Relbox is a modern, open-source, privacy-first alternative to Google Drive, built with Next.js, TypeScript, Tauri, Rust, Lynx, Bun, and UploadThing. Store, share, and sync your files with powerful features, lightning-fast performance, and complete control over your data.

## About Server Actions

- Server actions provide automatic validation, type safety, and API documentation
- Server code is never exposed to the client - only the function signatures
- Automatic OpenAPI documentation available at /api/docs (vite only at the moment)
- They can work alongside Tauri for enhanced functionality
- Functions automatically detect environment and use Tauri invoke when available
