import Link from "next/link";
import { ModelSelectionProvider } from "./components/ModelSelectionContext";
import { getSiteStats, sv } from "@/app/lib/site-stats";
import { getModelIndex, getTopDeals } from "@/app/lib/model-page";
import ModelSelector from "./components/ModelSelector";
import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import ChartSection from "./components/ChartSection";
import DataTableSection from "./components/DataTableSection";
import TopDeals from "./components/TopDeals";

// Scoring every live listing is too much work to repeat per request, and the
// answer only changes when the pipeline publishes.
export const revalidate = 1800;

/**
 * Order follows what the analytics showed, not what the site had grown into.
 *
 * The old page opened with a model selector — a control, before any reason to
 * use one — then three charts, and only at 4 530 px on mobile the first car a
 * reader could click. The average session reaches 5 005 px and stops. Outbound
 * clicks fired in 2 of 121 sessions, and the links to the per-model pages sat
 * at 8 297 px, where a crawler finds them and a person never does.
 *
 * So: real cars first, in server-rendered HTML. Then the models. Then the
 * exploration tools for the minority who want them. Every section above the
 * charts is readable with JavaScript switched off.
 */
export default async function Home() {
  const [stats, models, deals] = await Promise.all([
    getSiteStats(),
    getModelIndex(),
    getTopDeals(6),
  ]);

  return (
    <ModelSelectionProvider>
      <div className="space-y-10 sm:space-y-14">
        <HeroSection totalCars={stats.totalCars} lastUpdated={stats.lastUpdatedLong} />

        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] -mt-6">
          Inga annonser · Ingen inloggning · Vi säljer inget — data från
          Blocket.se, uppdaterad {stats.lastUpdated}
        </p>

        <section className="space-y-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] mb-1">Not 01</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--foreground)]">
              Värdeminskning per modell
            </h2>
            <p className="text-[var(--muted)] text-sm mt-1 max-w-2xl">
              Priser per årsmodell, vad första året kostar och aktuella fynd —
              en sida per modell.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {models.map((m) => (
              <Link
                key={m.key}
                href={`/bilar/${m.slug}`}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] text-sm hover:border-[var(--muted)] transition"
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                {m.label}
              </Link>
            ))}
          </div>
        </section>

        {deals.length > 0 && (
          <section className="space-y-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] mb-1">Not 02</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--foreground)]">
                Under prisestimat just nu
              </h2>
              <p className="text-[var(--muted)] text-sm mt-1 max-w-2xl">
                Annonser vars begärda pris ligger tydligt under vad modellen
                förutsäger för den åldern, det miltalet och den utrustningen.
                Ett lågt pris kan ha en bra förklaring — läs annonsen.
              </p>
            </div>
            <TopDeals deals={deals} />
            <p className="text-sm">
              <Link href="/#explorer" className="underline hover:text-[var(--muted)] transition">
                Se alla {sv(stats.activeCars)} annonser
              </Link>
            </p>
          </section>
        )}

        <hr className="border-[var(--border)]" />

        <section className="space-y-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] mb-1">Not 03</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--foreground)]">
              Jämför modeller
            </h2>
            <p className="text-[var(--muted)] text-sm mt-1 max-w-2xl">
              Välj vilka modeller du funderar på, så ritas kurvorna och
              annonserna om efter dem.
            </p>
          </div>
          <ModelSelector />
        </section>

        <StatsSection />

        <hr className="border-[var(--border)]" />

        <ChartSection />

        <hr className="border-[var(--border)]" />

        <section id="explorer" className="space-y-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--foreground)]">Annonser</h2>
            <p className="text-[var(--muted)] text-sm mt-1">
              Alla annonser för valda modeller och bränsletyp.
            </p>
          </div>
          <DataTableSection />
        </section>

        <hr className="border-[var(--border)]" />

        <section className="bg-[var(--card)] p-5 sm:p-6 border border-[var(--border)] rounded-lg text-sm space-y-2">
          <h2 className="text-[var(--foreground)] font-semibold">Metod</h2>
          <p className="text-[var(--muted)]">
            {sv(stats.totalCars)} annonser från Blocket.se analyserade, varav{" "}
            {sv(stats.activeCars)} till salu just nu. Senast uppdaterad{" "}
            {stats.lastUpdatedLong}. Annonser med priser under 20 000 kr eller
            årsmodeller före 2005 exkluderas.
          </p>
          <p className="text-[var(--muted)]">
            Värdeminskning modelleras med log-transformerad multivariat regression med 20
            variabler: bilålder, miltal, hästkrafter, utrustningsantal, bränsletyp,
            säljartyp, drivlina, WLTP-räckvidd samt interaktionstermer mellan
            bränsletyp och ålder eller miltal. Log-transformen ger en naturlig
            exponentiell avskrivningskurva där nya bilar tappar mer i värde än äldre.
          </p>
          <p className="text-[var(--muted)]">
            Osäkerhetsbanden räknas från faktiska avvikelser i materialet, inte
            från en antagen normalfördelning.{" "}
            <Link href="/metod" className="underline">Se underlaget per modell</Link>{" "}
            eller{" "}
            <Link href="/saljtid" className="underline">
              hur snabbt underprissatta bilar försvinner
            </Link>.
          </p>
        </section>
      </div>
    </ModelSelectionProvider>
  );
}
