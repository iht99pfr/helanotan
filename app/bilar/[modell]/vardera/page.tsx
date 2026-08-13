import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getValuation, parseValuationParams } from "@/app/lib/valuation";
import { sv } from "@/app/lib/site-stats";
import ShareValuation from "./ShareValuation";

/**
 * The intyg — a value document for one specific car, addressable by URL.
 *
 * Everything about this page is shaped by one scene: Sara at the dealer's
 * desk, phone in hand, a professional across the table. It must read as a
 * document she points at, not a website she scrolls: one screen, one large
 * number, the uncertainty in plain words, a provenance stamp — and no
 * interactive state to fumble while someone watches. Prepared the night
 * before with her partner, shown at the desk the day after; the URL carries
 * the whole car so the link IS the document.
 */

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ modell: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const kr = (n: number) => Math.round(n).toLocaleString("sv-SE");

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { modell } = await params;
  const input = parseValuationParams(await searchParams);
  if (!input) return { robots: { index: false, follow: true } };
  const val = await getValuation(modell, input);
  if (!val) return { robots: { index: false, follow: true } };

  const title = `${val.label} ${val.input.year} — värdering`;
  const description = val.refusal
    ? `Vi kan inte värdera denna ${val.label} med säkerhet — och säger det hellre än att gissa.`
    : `Prisestimat ${kr(val.estimate)} kr (±${kr(val.band)} kr) för ${val.label} ` +
      `${val.input.year}, ${sv(val.input.mileage)} mil. Baserat på ${sv(val.sampleSize)} Blocket-annonser.`;

  const og = new URLSearchParams({
    modell, ar: String(val.input.year), mil: String(val.input.mileage),
    drivmedel: val.input.fuel,
    ...(val.input.hp ? { hk: String(val.input.hp) } : {}),
    ...(val.input.price ? { pris: String(val.input.price) } : {}),
  });

  return {
    title,
    description,
    // Parameterized URL space — for sharing, not for ranking. Indexing
    // thousands of parameter permutations would be thin-content poison.
    robots: { index: false, follow: true },
    openGraph: {
      title: `${title} | Hela Notan`,
      description,
      images: [{ url: `/api/og/vardering?${og}`, width: 1200, height: 630 }],
      siteName: "Hela Notan",
      locale: "sv_SE",
    },
  };
}

/** A receipt row: label, dot leader, figure. */
function Row({ label, detail, value, money }: {
  label: string; detail?: string; value: string; money?: boolean;
}) {
  return (
    <div className="text-sm">
      <div className="flex items-baseline gap-2">
        <span className="text-[var(--foreground)]">{label}</span>
        <span className="flex-1 border-b border-dotted border-[var(--border)] translate-y-[-3px]" />
        <span className={`font-mono whitespace-nowrap ${money ? "text-[var(--money)]" : "text-[var(--foreground)]"}`}>
          {value}
        </span>
      </div>
      {detail && <div className="text-xs text-[var(--muted)] mt-0.5">{detail}</div>}
    </div>
  );
}

export default async function ValueringPage({ params, searchParams }: Props) {
  const { modell } = await params;
  const input = parseValuationParams(await searchParams);
  const val = input ? await getValuation(modell, input) : null;
  if (!val) notFound();

  const fuelShown = val.input.fuel;
  const specLine = [
    `${val.input.year}`,
    fuelShown,
    `${sv(val.input.mileage)} mil`,
    val.input.hp ? `${val.input.hp} hk` : null,
    val.input.seller === "private" ? "privatsäljare" : val.input.seller === "dealer" ? "handlare" : null,
  ].filter(Boolean).join(" · ");

  return (
    <div className="max-w-md mx-auto">
      <article className="border border-[var(--border)] rounded-lg bg-[var(--card)] p-6 space-y-5">
        <header>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
            Värdering · helanotan.se
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
            {val.label}
          </h1>
          <p className="text-sm text-[var(--muted)]">{specLine}</p>
        </header>

        {val.refusal ? (
          <section className="space-y-2 border-t border-b border-[var(--border)] py-5">
            {/* A refusal on letterhead. Saying "we cannot price this
                confidently" is itself protection against anchoring — and no
                competitor dares say it. */}
            <p className="text-xl font-semibold text-[var(--foreground)]">
              Vi kan inte värdera den här bilen med säkerhet.
            </p>
            <p className="text-sm text-[var(--muted)]">
              {val.refusal === "no-estimate" ? (
                <>
                  {val.label} rymmer för olika bilar över åren för att ett
                  gemensamt prisestimat ska betyda något. Vi visar hellre
                  medianpriser per årsmodell än gissar.
                </>
              ) : (
                <>
                  Den här kombinationen av ålder och spec ligger utanför vad
                  våra {sv(val.sampleSize)} annonser täcker
                  {val.cohortMedian ? (
                    <>
                      {" "}— medianen för årsmodellen är {kr(val.cohortMedian)} kr,
                      men just denna spec kan vi inte skatta ärligt
                    </>
                  ) : null}
                  . Hellre inget svar än ett påhittat.
                </>
              )}
            </p>
            <Link href={`/bilar/${val.slug}`} className="inline-block text-sm underline">
              Se medianpriser per årsmodell →
            </Link>
          </section>
        ) : (
          <>
            <section className="border-t border-b border-[var(--border)] py-5">
              <p className="text-sm text-[var(--muted)]">Prisestimat</p>
              <p className="font-mono text-4xl font-semibold text-[var(--foreground)] mt-1">
                {kr(val.estimate)} kr
              </p>
              <p className="text-sm text-[var(--muted)] mt-2">
                ±{kr(val.band)} kr — två bilar av tre hamnar inom det spannet.
                Skick och servicehistorik syns inte i en annons.
              </p>
              {val.input.price != null && val.residual != null && (
                <div className="mt-4 flex items-baseline justify-between gap-3">
                  <span className="text-sm text-[var(--foreground)]">
                    Begärt pris {kr(val.input.price)} kr
                  </span>
                  <span className={`font-mono text-sm font-semibold ${
                    val.residual < 0 ? "text-[var(--money)]" : "text-[var(--foreground)]"
                  }`}>
                    {kr(Math.abs(val.residual))} kr {val.residual < 0 ? "under" : "över"}
                  </span>
                </div>
              )}
              {val.deal && (
                <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-semibold ${
                  val.deal === "great"
                    ? "bg-[var(--money-soft)] text-[var(--money)]"
                    : "bg-[var(--money-faint)] text-[var(--money-mid)]"
                }`}>
                  {val.deal === "great" ? "Fyndpris" : "Bra pris"}
                </span>
              )}
            </section>

            {val.breakdown && val.breakdown.steps.length > 0 && (
              <section className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Så räknar modellen
                </p>
                <Row
                  label={`Typisk ${val.label}, ${val.age} år`}
                  value={`${kr(val.breakdown.base)} kr`}
                />
                {val.breakdown.steps.map((s) => (
                  <Row key={s.label} label={s.label} detail={s.detail}
                    value={`${s.delta > 0 ? "+" : "−"}${kr(Math.abs(s.delta))} kr`}
                    money={s.delta < 0} />
                ))}
                <div className="flex items-baseline gap-2 border-t border-[var(--border)] pt-2 text-sm">
                  <span className="font-medium text-[var(--foreground)]">Summa</span>
                  <span className="flex-1" />
                  <span className="font-mono font-semibold text-[var(--foreground)]">
                    {kr(val.breakdown.predicted)} kr
                  </span>
                </div>
              </section>
            )}
          </>
        )}

        <footer className="text-xs text-[var(--muted)] font-mono">
          Baserat på {sv(val.sampleSize)} Blocket-annonser · Uppdaterad {val.updated}
          <br />Oberoende — vi säljer inget och köper inget.
        </footer>
      </article>

      <div className="mt-4 flex items-center justify-between gap-3">
        <ShareValuation
          label={val.label}
          year={val.input.year}
          estimate={val.refusal ? null : val.estimate}
        />
        <Link href={`/bilar/${val.slug}`} className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] underline">
          Om {val.label} →
        </Link>
      </div>
    </div>
  );
}
