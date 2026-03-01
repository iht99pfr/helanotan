import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hela Notan — Vad kostar det egentligen?",
  description:
    "Se hela kostnaden för att äga en bil. Jämför värdeminskning, försäkring, skatt och service för populära bilmodeller baserat på riktiga Blocket-annonser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
            <a href="#" className="text-xl font-bold tracking-tight shrink-0 text-[var(--foreground)]">
              Hela Notan
            </a>
            <div className="relative flex-1 min-w-0">
              <div className="flex gap-1 sm:gap-5 text-sm text-[var(--muted)] overflow-x-auto scrollbar-hide">
                <a href="#depreciation" className="hover:text-[var(--foreground)] transition whitespace-nowrap px-2 py-2 sm:px-0 sm:py-0">
                  Värdeminskning
                </a>
                <a href="#mileage" className="hover:text-[var(--foreground)] transition whitespace-nowrap px-2 py-2 sm:px-0 sm:py-0">
                  Miltal
                </a>
                <a href="/tco" className="hover:text-[var(--foreground)] transition whitespace-nowrap px-2 py-2 sm:px-0 sm:py-0">
                  Ägandekostnad
                </a>
                <a href="#explorer" className="hover:text-[var(--foreground)] transition whitespace-nowrap px-2 py-2 sm:px-0 sm:py-0">
                  Alla bilar
                </a>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[var(--background)]/90 to-transparent pointer-events-none sm:hidden" />
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>
        <footer className="border-t border-[var(--border)] px-4 sm:px-6 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--muted)]">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-[var(--foreground)]">Hela Notan</span>
              <span>Ett projekt av <a href="https://upnorth.ai" className="underline hover:text-[var(--foreground)] transition" target="_blank" rel="noopener noreferrer">Up North AI</a></span>
            </div>
            <div className="flex gap-4">
              <span>Data från Blocket.se — Uppdaterad feb 2026</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
