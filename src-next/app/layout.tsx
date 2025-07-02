import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import { languageSwitcher, navActionButtons, navMenuItems } from "~next/app";

import { Header } from "@/components/header/header";
import { ThemeProvider } from "@/components/theme-provider";

import "../ui/styles/globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  description:
    "🚠 Relbox is a modern, open-source, privacy-first alternative to Google Drive, built with Next.js, TypeScript, Tauri, Rust, Lynx, Bun, and UploadThing. Store, share, and sync your files with powerful features, lightning-fast performance, and complete control over your data.",
  title: "Relbox",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          h-screen" flex flex-col items-center justify-center antialiased
        `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <Header
            actionButtons={navActionButtons}
            languageSwitcher={languageSwitcher}
            logoHref="/"
            logoText="Relbox"
            menuItems={navMenuItems}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
