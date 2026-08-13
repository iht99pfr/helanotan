import type { Metadata } from "next";
import Link from "next/link";
import { canonical } from "@/app/lib/canonical";
import { getDb } from "@/app/lib/db";
import { getModelIndex } from "@/app/lib/model-page";
import { getSiteStats, sv } from "@/app/lib/site-stats";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Press — citerbara tabeller och data",
  description:
    "Fritt att citera med källa. Värdeminskning per modell, handlarpremier och " +
    "marknadsdata från tiotusentals analyserade Blocket-annonser.",
  alternates: canonical("/press"),
};

/**
 * Ammunition for the multiplier, not a page for the buyer.
 *
 * Journalists want a table they can lift, an extreme number for the headline,
 * a stated method, and a same-day contact. Everything here is derived
 * statistics — the work product, freely quotable — never raw listing data.
 */

const kr = (n: number) => Math.round(n).toLocaleString("sv-SE");

interface PressRow {
  label: string;
  firstYearLoss: number | null;
  retention3: number | null;
  dealerPct: number | null;
  n: number;
}

async function pressData(): Promise<PressRow[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT data - 'mileageCost' AS data FROM web_cache WHERE key = 'aggregates'`;
  const agg = rows[0]?.data;
  if (!agg) return [];
  const out: PressRow[] = [];
  for (const [key, cfg] of Object.entries(agg.modelConfig ?? {}) as [string, { label: string }][]) {
    const reg = agg.regression?.[key];
    const curve = agg.predictionCurves?.[key]?.all;
    const summary = agg.summary?.[key];
    if (!summary?.count || summary.count < 200) continue;
    const at = (a: number) => curve?.find((p: { age: number }) => p.age === a)?.predicted ?? null;
    const c0 = at(0); const c1 = at(1); const c3 = at(3);
    const spread = reg?.typicalSpread != null ? reg.typicalSpread * 100 : 99;
    const dealer = reg?.coefficients?.is_dealer;
    const dealerPct = dealer != null && summary.count >= 500
      ? (Math.exp(dealer) - 1) * 100 : null;
    out.push({
      label: cfg.label,
      firstYearLoss: spread <= 25 && c0 != null && c1 != null ? Math.round(c0 - c1) : null,
      retention3: spread <= 25 && c0 != null && c3 != null ? Math.round((c3 / c0) * 100) : null,
      dealerPct: dealerPct != null && dealerPct > -20 && dealerPct < 25
        ? Math.round(dealerPct * 10) / 10 : null,
      n: summary.count,
    });
  }
  return out.sort((a, b) => (b.firstYearLoss ?? 0) - (a.firstYearLoss ?? 0));
}

export default async function PressPage() {
  const [rows, stats, models] = await Promise.all([
    pressData(), getSiteStats(), getModelIndex(),
  ]);

  return (
    <article className="space-y-8 max-w-3xl">
      <header className="space-y-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
          Pressmaterial · uppdaterat {stats.lastUpdated}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
          Data för publicering
        </h1>
        <p className="text-[var(--muted)]">
          Tabellerna nedan är fria att citera och återpublicera med källan{" "}
          <strong className="text-[var(--foreground)]">Hela Notan (helanotan.se)</strong>.
          Underlaget är {sv(stats.totalCars)} Blocket-annonser, analyserade med
          öppet redovisad metod — <Link href="/metod" className="underline">se hur vi räknar</Link>.
          Skräddarsydda uttag per modell, årsmodell eller drivmedel:{" "}
          <a href="mailto:press@helanotan.se" className="underline">press@helanotan.se</a>,
          svar samma dag.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">
          Värdeminskning per modell
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-[var(--foreground)] text-left text-[var(--muted)]">
                <th className="py-2 pr-3 font-medium">Modell</th>
                <th className="py-2 pr-3 font-medium text-right">Tapp första året</th>
                <th className="py-2 pr-3 font-medium text-right">Kvar efter 3 år</th>
                <th className="py-2 pr-3 font-medium text-right">Handlarpremie</th>
                <th className="py-2 font-medium text-right">Underlag</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-[var(--border)]/60">
                  <td className="py-2 pr-3 text-[var(--foreground)]">{r.label}</td>
                  <td className="py-2 pr-3 text-right font-mono text-[var(--foreground)]">
                    {r.firstYearLoss != null ? `−${kr(r.firstYearLoss)} kr` : "—"}
                  </td>
                  <td className="py-2 pr-3 text-right font-mono text-[var(--foreground)]">
                    {r.retention3 != null ? `${r.retention3}%` : "—"}
                  </td>
                  <td className="py-2 pr-3 text-right font-mono text-[var(--foreground)]">
                    {r.dealerPct != null ? `${r.dealerPct > 0 ? "+" : ""}${r.dealerPct.toLocaleString("sv-SE")}%` : "—"}
                  </td>
                  <td className="py-2 text-right font-mono text-[var(--muted)]">{sv(r.n)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[var(--muted)]">
          "—" betyder att underlaget är för spretigt för ett ärligt estimat —
          vi publicerar hellre inget än en gissning. Handlarpremie = hur mycket
          mer handlare begär än privatsäljare för likvärdig bil, allt annat lika.
        </p>
      </section>

      <section className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 text-sm space-y-2">
        <h2 className="text-[var(--foreground)] font-semibold">Uppmätta resultat att citera</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-[var(--muted)]">
          <li>
            Annonser prissatta under vårt estimat försvinner snabbare från
            Blocket: 31,9% på 17 dagar mot 27,5% för rimligt prissatta —{" "}
            <Link href="/saljtid" className="underline">hela mätningen</Link>.
          </li>
          <li>
            Handlarpremien är störst på småbilar och nära noll på elbilar —
            garantin kostar, men inte på en Tesla.
          </li>
          <li>
            {sv(stats.totalCars)} annonser analyserade sedan februari 2026;
            uppdateras varje vecka. {models.length} modeller följs.
          </li>
        </ul>
      </section>

      <p className="text-xs text-[var(--muted)]">
        Hela Notan är ett oberoende projekt utan annonser, konton eller
        försäljning. Vi publicerar härledd statistik — aldrig rådata från
        enskilda annonser.
      </p>
    </article>
  );
}
