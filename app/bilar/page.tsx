import type { Metadata } from "next";
import Link from "next/link";
import { canonical } from "@/app/lib/canonical";
import { getModelIndex } from "@/app/lib/model-page";
import { getSiteStats, sv } from "@/app/lib/site-stats";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Alla bilmodeller — värdeminskning och priser",
  description:
    "Värdeminskning, medianpriser per årsmodell och aktuella fynd för varje " +
    "bilmodell vi följer. Baserat på riktiga annonser från Blocket.se.",
  alternates: canonical("/bilar"),
  openGraph: {
    title: "Alla bilmodeller — värdeminskning och priser | Hela Notan",
    description:
      "Värdeminskning och priser per modell, baserat på riktiga Blocket-annonser.",
    url: "https://helanotan.se/bilar",
    siteName: "Hela Notan",
    locale: "sv_SE",
  },
};

export default async function BilarIndex() {
  const [models, stats] = await Promise.all([getModelIndex(), getSiteStats()]);

  return (
    <div className="space-y-8 max-w-4xl">
      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
          Alla bilmodeller
        </h1>
        <p className="text-[var(--muted)]">
          {sv(models.length)} modeller, {sv(stats.totalCars)} analyserade
          annonser från Blocket.se. Uppdaterad {stats.lastUpdatedLong}.
        </p>
      </header>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {models.map((m) => (
          <li key={m.key}>
            <Link
              href={`/bilar/${m.slug}`}
              className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border)] hover:border-[var(--muted)] transition"
            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: m.color }}
              />
              <span className="min-w-0">
                <span className="block font-medium text-[var(--foreground)]">
                  {m.label}
                </span>
                <span className="block text-xs text-[var(--muted)]">
                  {sv(m.count)} annonser · {sv(m.activeCount)} till salu ·
                  snittpris {m.avgPrice.toLocaleString("sv-SE")} kr
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
