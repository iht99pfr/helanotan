import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { canonical } from "@/app/lib/canonical";
import { getModelPage, type ModelPage } from "@/app/lib/model-page";
import { getSiteStats, sv } from "@/app/lib/site-stats";
import { PAIRS, pairSlug, parsePair } from "@/app/lib/comparisons";

/**
 * Head-to-head pages for the comparisons buyers literally type.
 *
 * "xc60 eller rav4" has a thin Swedish SERP — US sites and content farms,
 * no data-driven answer — while the model pages here each answer one model
 * and never the choice between two. These pages are that answer. The pair
 * list is curated: only comparisons a real buyer faces, both models with
 * usable estimates, and few enough that every page carries real substance.
 */

export const revalidate = 3600;

export function generateStaticParams() {
  return PAIRS.map(([a, b]) => ({ par: pairSlug(a, b) }));
}

const kr = (n: number) => Math.round(n).toLocaleString("sv-SE");

export async function generateMetadata(
  { params }: { params: Promise<{ par: string }> },
): Promise<Metadata> {
  const { par } = await params;
  const pair = parsePair(par);
  if (!pair) return {};
  const [a, b] = await Promise.all([getModelPage(pair[0]), getModelPage(pair[1])]);
  if (!a || !b) return {};

  const title = `${a.label} eller ${b.label}? Priser och värdeminskning jämförda`;
  const description =
    `${a.label} tappar ${kr(Math.round((a.firstYearLoss ?? 0) / 12))} kr/mån, ` +
    `${b.label} ${kr(Math.round((b.firstYearLoss ?? 0) / 12))} kr/mån första året. ` +
    `Jämförelse på ${sv(a.count + b.count)} riktiga Blocket-annonser.`;

  return {
    title, description,
    alternates: canonical(`/jamfor/${par}`),
    openGraph: {
      title: `${title} | Hela Notan`, description,
      url: `https://helanotan.se/jamfor/${par}`,
      siteName: "Hela Notan", locale: "sv_SE", type: "article",
    },
  };
}

function CompareRow({ label, a, b, better }: {
  label: string; a: string; b: string; better?: 0 | 1 | null;
}) {
  return (
    <tr className="border-b border-[var(--border)]/60">
      <td className="py-2.5 pr-3 text-[var(--muted)]">{label}</td>
      <td className={`py-2.5 pr-3 text-right font-mono ${better === 0 ? "font-semibold text-[var(--money)]" : "text-[var(--foreground)]"}`}>{a}</td>
      <td className={`py-2.5 text-right font-mono ${better === 1 ? "font-semibold text-[var(--money)]" : "text-[var(--foreground)]"}`}>{b}</td>
    </tr>
  );
}

export default async function JamforPage(
  { params }: { params: Promise<{ par: string }> },
) {
  const { par } = await params;
  const pair = parsePair(par);
  if (!pair) notFound();
  const [a, b] = await Promise.all([getModelPage(pair[0]), getModelPage(pair[1])]);
  const stats = await getSiteStats();
  if (!a || !b) notFound();

  const monthly = (m: ModelPage) =>
    m.firstYearLoss != null ? Math.round(m.firstYearLoss / 12) : null;
  const mA = monthly(a); const mB = monthly(b);
  const lowerLoss = mA != null && mB != null ? (mA <= mB ? 0 : 1) : null;
  const betterRet = a.retention3 != null && b.retention3 != null
    ? (a.retention3 >= b.retention3 ? 0 : 1) : null;

  return (
    <article className="space-y-8 max-w-3xl">
      <header className="space-y-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
          Jämförelse · {sv(a.count + b.count)} annonser
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
          {a.label} eller {b.label}?
        </h1>
        <p className="text-[var(--muted)]">
          Samma fråga, mätt i stället för tyckt: vad kostar de, vad tappar de,
          och vad är kvar när du säljer. Uppdaterad {stats.lastUpdatedLong}.
        </p>
        {mA != null && mB != null && mA !== mB && (
          <p className="text-[var(--foreground)]">
            <strong>{(mA < mB ? a : b).label}</strong> tappar minst i kronor:{" "}
            {kr(Math.min(mA, mB))} kr/mån mot {kr(Math.max(mA, mB))} kr/mån
            första året — en skillnad på{" "}
            <strong>{kr(Math.abs(mA - mB))} kr varje månad</strong>.
          </p>
        )}
      </header>

      <section className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-[var(--foreground)] text-left">
              <th className="py-2 pr-3 font-medium text-[var(--muted)]"></th>
              <th className="py-2 pr-3 font-semibold text-right text-[var(--foreground)]">{a.label}</th>
              <th className="py-2 font-semibold text-right text-[var(--foreground)]">{b.label}</th>
            </tr>
          </thead>
          <tbody>
            <CompareRow label={`Medianpris ${a.anchorYear ?? ""}`}
              a={a.anchorPrice != null ? `${kr(a.anchorPrice)} kr` : "—"}
              b={b.anchorPrice != null ? `${kr(b.anchorPrice)} kr` : "—"} />
            <CompareRow label="Tapp första året"
              a={a.firstYearLoss != null ? `${kr(a.firstYearLoss)} kr` : "—"}
              b={b.firstYearLoss != null ? `${kr(b.firstYearLoss)} kr` : "—"}
              better={lowerLoss} />
            <CompareRow label="Per månad, år 1"
              a={mA != null ? `${kr(mA)} kr` : "—"}
              b={mB != null ? `${kr(mB)} kr` : "—"}
              better={lowerLoss} />
            <CompareRow label="Kvar efter 3 år"
              a={a.retention3 != null ? `${a.retention3}%` : "—"}
              b={b.retention3 != null ? `${b.retention3}%` : "—"}
              better={betterRet} />
            <CompareRow label="Kvar efter 5 år"
              a={a.retention5 != null ? `${a.retention5}%` : "—"}
              b={b.retention5 != null ? `${b.retention5}%` : "—"} />
            <CompareRow label="Värdetapp per 1 000 mil"
              a={a.mileagePctPer1000 != null ? `−${a.mileagePctPer1000.toFixed(2)}%` : "—"}
              b={b.mileagePctPer1000 != null ? `−${b.mileagePctPer1000.toFixed(2)}%` : "—"} />
            <CompareRow label="Estimatets träffsäkerhet"
              a={a.uncertaintyPct != null ? `±${a.uncertaintyPct}%` : "—"}
              b={b.uncertaintyPct != null ? `±${b.uncertaintyPct}%` : "—"} />
            <CompareRow label="Underlag (annonser)"
              a={sv(a.count)} b={sv(b.count)} />
          </tbody>
        </table>
      </section>

      <section className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 text-sm text-[var(--muted)] space-y-2">
        <h2 className="text-[var(--foreground)] font-semibold">Läs siffrorna rätt</h2>
        <p>
          Kronor och procent svarar på olika frågor: en dyrare bil kan tappa
          fler kronor men mindre andel. Tabellen visar båda — jämför raden som
          matchar din fråga ("vad kostar det mig per månad?" är oftast den
          översta). Skick, utrustning och årsmodell flyttar enskilda bilar
          betydligt; använd modellsidornas värderingsverktyg för en specifik annons.
        </p>
      </section>

      <section className="flex flex-wrap gap-2 text-sm">
        <Link href={`/bilar/${a.slug}`} className="px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--muted)] transition">
          Allt om {a.label} →
        </Link>
        <Link href={`/bilar/${b.slug}`} className="px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--muted)] transition">
          Allt om {b.label} →
        </Link>
        <Link href="/tco" className="px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--muted)] transition">
          Räkna på total ägandekostnad
        </Link>
      </section>
    </article>
  );
}
