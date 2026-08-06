import Link from "next/link";
import { ModelSelectionProvider } from "./components/ModelSelectionContext";
import { getSiteStats, sv } from "@/app/lib/site-stats";
import { getModelIndex } from "@/app/lib/model-page";
import ModelSelector from "./components/ModelSelector";
import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import ChartSection from "./components/ChartSection";
import DataTableSection from "./components/DataTableSection";

export default async function Home() {
  const [stats, models] = await Promise.all([getSiteStats(), getModelIndex()]);
  return (
    <ModelSelectionProvider>
      <div className="space-y-8 sm:space-y-12">
        {/* Hero */}
        <HeroSection totalCars={stats.totalCars} lastUpdated={stats.lastUpdatedLong} />

        {/* Model Selector */}
        <section>
          <h2 className="text-sm font-medium text-[var(--muted)] mb-3">Välj modeller att jämföra</h2>
          <ModelSelector />
        </section>

        {/* Summary stats + model accuracy */}
        <StatsSection />

        <hr className="border-[var(--border)]" />

        {/* Charts — shared legend filter state */}
        <ChartSection />

        <hr className="border-[var(--border)]" />

        {/* Data Explorer */}
        <section id="explorer" className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">Annonser</h2>
            <p className="text-[var(--muted)] text-sm mt-1">
              Visar annonser för valda modeller och bränsletyp.
            </p>
          </div>
          <DataTableSection />
        </section>

        <hr className="border-[var(--border)]" />

        {/* Per-model pages. Server-rendered links from the highest-authority
            page on the site — the charts above are client-only, so before this
            existed a crawler found almost nothing to follow. */}
        <section className="space-y-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">
              Värdeminskning per modell
            </h2>
            <p className="text-[var(--muted)] text-sm mt-1">
              Priser per årsmodell, tapp första året och aktuella annonser under
              prisestimat — en sida per modell.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {models.map((m) => (
              <Link
                key={m.key}
                href={`/bilar/${m.slug}`}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] text-sm hover:border-[var(--muted)] transition"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: m.color }}
                />
                {m.label}
              </Link>
            ))}
          </div>
        </section>

        <hr className="border-[var(--border)]" />

        {/* Methodology */}
        <section className="bg-[var(--card)] p-5 sm:p-6 border border-[var(--border)] rounded-lg text-sm text-[var(--muted)] space-y-2">
          <h2 className="text-[var(--foreground)] font-semibold">Metod</h2>
          <p>
            {sv(stats.totalCars)} annonser från Blocket.se analyserade, varav{" "}
            {sv(stats.activeCars)} till salu just nu. Senast uppdaterad{" "}
            {stats.lastUpdatedLong}. Annonser med priser under 20 000 kr eller
            årsmodeller före 2005 exkluderas.
          </p>
          <p>
            Värdeminskning modelleras med log-transformerad multivariat regression med 20
            variabler: bilålder, miltal, hästkrafter, utrustningsantal, bränsletyp
            (Hybrid/Laddhybrid/Diesel/El), säljartyp, drivlina, WLTP-räckvidd samt
            interaktionstermer mellan bränsletyp och ålder/miltal. Log-transformen
            ger en naturlig exponentiell avskrivningskurva där nya bilar tappar mer
            i värde än äldre.
          </p>
          <p>
            95% prediktionsintervall beräknas i log-rummet (±1,96 × SE) och
            transformeras tillbaka, vilket ger proportionella konfidensband.
            Ägandekostnadsberäknaren använder förberäknade prediktionskurvor
            för att fånga den icke-linjära värdeminskningen vid olika åldrar.
          </p>
        </section>
      </div>
    </ModelSelectionProvider>
  );
}
