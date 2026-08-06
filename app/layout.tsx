import type { Metadata } from "next";
import Script from "next/script";
import { getSiteStats, sv } from "@/app/lib/site-stats";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
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

// The optical-size axis is the point: headings at 36px want tighter, higher
// contrast letterforms than a 15px table caption does, and Fraunces adapts
// rather than scaling one drawing up. It is what makes the page read as
// published rather than as a dashboard.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
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
    "theme-color": "#f8f4ec",
  },
  // NOTE: deliberately no `alternates.canonical` here.
  //
  // In the App Router a canonical set on the root layout is inherited by every
  // descendant route that does not override it — which pointed 35 of the 45
  // URLs in our own sitemap at the homepage, telling Google not to index them.
  // The sitemap and the canonicals were in direct contradiction. Each route now
  // declares its own self-referencing canonical (see app/lib/canonical.ts).
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const stats = await getSiteStats();
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
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","vx69lib1k2");`,
          }}
        />
        {process.env.NEXT_PUBLIC_GOOGLE_ADS_ID && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}`}
            />
            <Script id="google-ads">
              {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}');`}
            </Script>
          </>
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
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}
      >
        <Nav />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>
        <footer className="border-t border-[var(--border)] px-4 sm:px-6 py-8 sm:py-10">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <img src="/logo-cropped.png" alt="" width={22} height={18} />
                  <span className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--foreground)]">Hela Notan</span>
                </div>
                <p className="text-xs text-[var(--muted)] mt-1 max-w-sm">
                  Se hela kostnaden för att äga en bil. Baserat på riktiga priser från Blocket.se.
                </p>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--muted)]">
                <a href="/" className="hover:text-[var(--foreground)] transition">Hem</a>
                <a href="/bilar" className="hover:text-[var(--foreground)] transition">Modeller</a>
                <a href="/tco" className="hover:text-[var(--foreground)] transition">Ägandekostnad</a>
                <a href="/toppen" className="hover:text-[var(--foreground)] transition">Toppen</a>
                <a href="/kopguide" className="hover:text-[var(--foreground)] transition">Köpguide</a>
                <a href="/bevaka" className="hover:text-[var(--foreground)] transition">Bevaka</a>
                <a href="/artiklar" className="hover:text-[var(--foreground)] transition">Artiklar</a>
                <a href="/metod" className="hover:text-[var(--foreground)] transition">Metod</a>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-4 border-t border-[var(--border)] text-xs text-[var(--muted)]">
              <span>
                Data från Blocket.se — {sv(stats.totalCars)} annonser analyserade,{" "}
                {sv(stats.activeCars)} till salu. Uppdaterad {stats.lastUpdatedLong}.
              </span>
              <span>Ett projekt av <a href="https://upnorth.ai" className="underline hover:text-[var(--foreground)] transition" target="_blank" rel="noopener noreferrer">Up North AI</a></span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
