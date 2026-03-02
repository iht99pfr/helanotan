import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import Nav from "./components/Nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://helanotan.se";
const siteName = "Hela Notan";
const siteDescription =
  "Se hela kostnaden för att äga en bil. Jämför värdeminskning, försäkring, skatt och service för populära bilmodeller baserat på riktiga Blocket-annonser.";

export const metadata: Metadata = {
  title: {
    default: "Hela Notan — Vad kostar det egentligen?",
    template: "%s | Hela Notan",
  },
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Hela Notan — Vad kostar det egentligen?",
    description: siteDescription,
    url: siteUrl,
    siteName,
    locale: "sv_SE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hela Notan — Vad kostar det egentligen?",
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "theme-color": "#f7f3ec",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <head>
        {process.env.NEXT_PUBLIC_UMAMI_URL && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            defer
            src={`${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js`}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: siteName,
              url: siteUrl,
              description: siteDescription,
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              inLanguage: "sv",
              creator: {
                "@type": "Organization",
                name: "Up North AI",
                url: "https://www.upnorth.ai",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Nav />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>
        <footer className="border-t border-[var(--border)] px-4 sm:px-6 py-8 sm:py-10">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-base font-bold text-[var(--foreground)]">Hela Notan</span>
                <p className="text-xs text-[var(--muted)] mt-1 max-w-sm">
                  Se hela kostnaden för att äga en bil. Baserat på riktiga priser från Blocket.se.
                </p>
              </div>
              <div className="flex gap-6 text-sm text-[var(--muted)]">
                <a href="/" className="hover:text-[var(--foreground)] transition">Hem</a>
                <a href="/tco" className="hover:text-[var(--foreground)] transition">Ägandekostnad</a>
                <a href="/artiklar" className="hover:text-[var(--foreground)] transition">Artiklar</a>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-4 border-t border-[var(--border)] text-xs text-[var(--muted)]">
              <span>Data från Blocket.se — Uppdaterad feb 2026</span>
              <span>Ett projekt av <a href="https://upnorth.ai" className="underline hover:text-[var(--foreground)] transition" target="_blank" rel="noopener noreferrer">Up North AI</a></span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
