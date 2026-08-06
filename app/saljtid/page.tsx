import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "@/app/lib/db";
import { canonical } from "@/app/lib/canonical";
import { getSiteStats, sv } from "@/app/lib/site-stats";

export const revalidate = 3600;

const TITLE = "Säljs en billig bil snabbare? Vi mätte det";
const DESCRIPTION =
  "Vi följde tolv tusen Blocket-annonser mellan två mätpunkter. Bilar som låg " +
  "under vårt prisestimat försvann snabbare än de som var rimligt prissatta — " +
  "och skillnaden är större än osäkerheten.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: canonical("/saljtid"),
  openGraph: {
    title: `${TITLE} | Hela Notan`,
    description: DESCRIPTION,
    url: "https://helanotan.se/saljtid",
    siteName: "Hela Notan",
    locale: "sv_SE",
    type: "article",
  },
};

interface Bucket {
  disappeared: number; observed: number; pct: number; lo: number; hi: number;
}
interface Window {
  start: string; end: string; days: number;
  buckets: Partial<Record<"under" | "fair" | "over", Bucket>>;
}
interface MarketTime {
  windows: Window[]; modelsUsed: number; scoreCutoff: number; caveat: string;
}

async function getMarketTime(): Promise<MarketTime | null> {
  const sql = getDb();
  const rows = await sql`
    SELECT data->'marketTime' AS mt FROM web_cache WHERE key = 'aggregates'`;
  return rows[0]?.mt ?? null;
}

const pc = (n: number) => n.toLocaleString("sv-SE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const LABELS: Record<string, { name: string; note: string; color: string }> = {
  under: { name: "Under prisestimat", note: "minst 0,75 SE under", color: "#1a5c3a" },
  fair: { name: "Rimligt pris", note: "nära estimatet", color: "#8a8272" },
  over: { name: "Över prisestimat", note: "minst 0,75 SE över", color: "#9a3b2f" },
};
const ORDER = ["under", "fair", "over"] as const;

/** A bar plus its confidence interval — the interval is the honest part. */
function Bar({ b, max }: { b: Bucket; max: number }) {
  const pct = (v: number) => `${(v / max) * 100}%`;
  return (
    <div className="relative h-7 bg-[var(--card)] rounded">
      <div className="absolute inset-y-0 left-0 rounded bg-[var(--foreground)]/85"
           style={{ width: pct(b.pct) }} />
      <div className="absolute inset-y-0 border-l border-r border-[var(--foreground)]/40"
           style={{ left: pct(b.lo), width: pct(b.hi - b.lo) }}
           title={`95% konfidensintervall: ${b.lo}–${b.hi} %`} />
    </div>
  );
}

export default async function SaljtidPage() {
  const [mt, stats] = await Promise.all([getMarketTime(), getSiteStats()]);

  if (!mt?.windows?.length) {
    return (
      <div className="max-w-2xl space-y-4">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">{TITLE}</h1>
        <p className="text-[var(--muted)]">
          Underlaget saknas just nu. Kom tillbaka efter nästa datauppdatering.
        </p>
      </div>
    );
  }

  // Lead with the longest window: the same effect, measured with more room to show.
  const main = [...mt.windows].sort((a, b) => b.days - a.days)[0];
  const under = main.buckets.under;
  const fair = main.buckets.fair;
  const gap = under && fair ? Math.round((under.pct - fair.pct) * 10) / 10 : null;
  const relative = under && fair ? Math.round((under.pct / fair.pct - 1) * 100) : null;
  // Listings alive at the start of the widest window. Summing across windows
  // would count anything that survived the first one twice.
  const observed = Math.max(...mt.windows.map(
    (w) => ORDER.reduce((m, k) => m + (w.buckets[k]?.observed ?? 0), 0)));

  return (
    <article className="space-y-10 max-w-3xl">
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">{TITLE}</h1>
        <p className="text-lg text-[var(--muted)]">
          Alla vet att en billig bil går snabbare. Nästan ingen har mätt hur
          mycket. Vi följde {sv(observed)} annonser mellan två mätpunkter och
          räknade vilka som var borta.
        </p>
      </header>

      {gap != null && under && fair && (
        <section className="border-l-4 border-[var(--foreground)] pl-5 py-1 space-y-2">
          <p className="text-2xl font-bold text-[var(--foreground)]">
            {pc(under.pct)}% mot {pc(fair.pct)}%
          </p>
          <p className="text-[var(--muted)]">
            På {main.days} dagar hade {pc(under.pct)}% av annonserna under
            prisestimatet försvunnit, mot {pc(fair.pct)}% av de rimligt
            prissatta. En skillnad på {pc(gap)} procentenheter — {relative}% fler.
          </p>
        </section>
      )}

      {mt.windows.map((w) => {
        const max = Math.max(...ORDER.map((k) => w.buckets[k]?.hi ?? 0)) * 1.05;
        return (
          <section key={w.start} className="space-y-3">
            <h2 className="text-xl font-bold text-[var(--foreground)]">
              {w.days} dagar: {w.start} → {w.end}
            </h2>
            <div className="space-y-3">
              {ORDER.map((k) => {
                const b = w.buckets[k];
                if (!b) return null;
                return (
                  <div key={k} className="grid sm:grid-cols-[190px_1fr_auto] gap-x-4 gap-y-1 items-center">
                    <div>
                      <div className="text-sm font-medium text-[var(--foreground)]">
                        {LABELS[k].name}
                      </div>
                      <div className="text-xs text-[var(--muted)]">{LABELS[k].note}</div>
                    </div>
                    <Bar b={b} max={max} />
                    <div className="text-sm font-mono text-[var(--foreground)] whitespace-nowrap">
                      {pc(b.pct)}%{" "}
                      <span className="text-[var(--muted)] text-xs">
                        [{pc(b.lo)}–{pc(b.hi)}] · n={sv(b.observed)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <section className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 space-y-3 text-sm text-[var(--muted)]">
        <h2 className="text-[var(--foreground)] font-semibold">
          Vad vi faktiskt mätte — och vad vi inte kan mäta
        </h2>
        <p>
          <strong className="text-[var(--foreground)]">Vi kan inte säga hur
          många dagar en bil tar att sälja.</strong> Vi ser när en annons
          försvinner, inte när den försvann. Insamlingen sker i svepningar, och
          en bil som såldes dagen efter en svepning registreras först vid nästa.
          Att räkna dagar på det vore att hitta på.
        </p>
        <p>
          Det som däremot går att jämföra är två grupper <em>inom samma
          fönster</em>. Båda mäts vid samma tidpunkter och har samma
          osäkerhet, så felen tar ut varandra och skillnaden mellan dem är
          verklig. Klamrarna i diagrammet är 95% konfidensintervall — för det
          längre fönstret överlappar de inte, vilket är vad som gör resultatet
          värt att publicera.
        </p>
        <p>
          <strong className="text-[var(--foreground)]">{mt.caveat}</strong>{" "}
          Säljaren kan ha ångrat sig, annonsen kan ha gått ut, bilen kan ha
          lagts upp på nytt. Det gäller lika för alla tre grupperna.
        </p>
        <p>
          Prisestimatet kommer från en regression per modell över {sv(stats.totalCars)}{" "}
          Blocket-annonser, som tar hänsyn till ålder, miltal, bränsletyp,
          hästkrafter, utrustning, drivlina och säljartyp. {mt.modelsUsed} modeller
          hade tillräckligt underlag. Uppdaterad {stats.lastUpdatedLong}.{" "}
          <Link href="/metod" className="underline">Se underlaget</Link>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[var(--foreground)]">
          Vad det betyder om du ska köpa
        </h2>
        <p className="text-[var(--muted)]">
          En bil som ligger tydligt under estimatet är statistiskt sett borta
          tidigare. Hittar du en är det inte läge att sova på saken — men ett
          lågt pris kan också ha en förklaring som inte syns i annonsen. Läs
          den, och titta på bilen.
        </p>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/bilar" className="px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--muted)] transition">
            Se bilar under prisestimat per modell
          </Link>
          <Link href="/#explorer" className="px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--muted)] transition">
            Alla annonser
          </Link>
        </div>
      </section>
    </article>
  );
}
