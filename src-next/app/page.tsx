import { ButtonWithIcon } from "@/components/button-wrapper";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-12">
        <div className="space-y-6 rounded-full text-center">
          <h1 className="text-5xl font-bold text-foreground">
            Welcome to Relbox
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-foreground">
            🚠 Relbox is a modern, open-source, privacy-first alternative to
            Google Drive, built with Next.js, TypeScript, Tauri, Rust, Lynx,
            Bun, and UploadThing. Store, share, and sync your files with
            powerful features, lightning-fast performance, and complete control
            over your data.
          </p>
          <div className="flex justify-center gap-4 rounded-full pt-8">
            <ButtonWithIcon
              className="px-8 py-4 text-lg font-bold"
              effect="shineHover"
              icon="chevronRight"
              size="lg"
            >
              Get Started
            </ButtonWithIcon>
          </div>
        </div>
      </main>
    </div>
  );
}
