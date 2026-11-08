import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Tycoon Pro", template: "%s · Tycoon Pro" },
  description: "Les demandes d'intervention de Tycoon pour les artisans partenaires.",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export const viewport: Viewport = { themeColor: "#111827", width: "device-width", initialScale: 1 };

export default function Racine({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-dvh antialiased">
        <header className="bg-ink text-white">
          <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="rounded-md bg-white px-2 py-1">
                <Image src="/brand/tycoon-logo.png" alt="Tycoon" width={640} height={209} className="h-5 w-auto" priority />
              </span>
              <span className="text-sm font-semibold tracking-wide text-brand">Pro</span>
            </Link>
          </div>
          <div className="h-1 bg-brand" />
        </header>
        <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
