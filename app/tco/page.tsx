import { Suspense } from "react";
import type { Metadata } from "next";
import { getDb } from "@/app/lib/db";
import TcoCalculator from "@/app/components/TcoCalculator";

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const model = params.model;
  if (!model) return {};

  const fuel = params.fuel || "";
  const year = params.year || "";
  const fuelLabel = { Hybrid: "Hybrid", PHEV: "Laddhybrid", Diesel: "Diesel", Petrol: "Bensin", Electric: "El" }[fuel] || fuel;
  const title = `${model} ${fuelLabel} ${year} — Ägandekostnad`;

  const ogParams = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) ogParams.set(k, v);
  }

  return {
    title,
    openGraph: {
      title: `${title} | Hela Notan`,
      images: [{ url: `/api/og/tco?${ogParams.toString()}`, width: 1200, height: 630 }],
    },
  };
}

async function fetchData() {
  const sql = getDb();
  const [aggRows, scatterRows] = await Promise.all([
    sql`SELECT data FROM web_cache WHERE key = 'aggregates'`,
    sql`SELECT data FROM web_cache WHERE key = 'scatter'`,
  ]);
  return {
    aggregates: aggRows[0]?.data || null,
    scatter: scatterRows[0]?.data || {},
  };
}

export default async function TcoPage() {
  const { aggregates, scatter } = await fetchData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
          Ägandekostnadsberäknare
        </h1>
        <p className="text-[var(--muted)] text-sm sm:text-base mt-2">
          Beräkna den totala ägandekostnaden för en bil. Prediktioner baseras på
          vår regressionsmodell tränad på verkliga Blocket-annonser.
        </p>
      </div>

      {!aggregates ? (
        <div className="animate-pulse space-y-4 max-w-2xl">
          <div className="h-64 bg-[var(--border)] rounded-lg" />
          <div className="h-48 bg-[var(--border)] rounded-lg" />
        </div>
      ) : (
        <Suspense fallback={
          <div className="animate-pulse space-y-4 max-w-2xl">
            <div className="h-64 bg-[var(--border)] rounded-lg" />
            <div className="h-48 bg-[var(--border)] rounded-lg" />
          </div>
        }>
          <TcoCalculator
            regression={aggregates.regression}
            tcoDefaults={aggregates.tcoDefaults}
            modelConfig={aggregates.modelConfig || {}}
            scatter={scatter}
            predictionCurves={aggregates.predictionCurves || {}}
          />
        </Suspense>
      )}

      <div className="bg-[var(--card)] p-5 sm:p-6 border border-[var(--border)] rounded-lg text-sm text-[var(--muted)] space-y-2 max-w-2xl">
        <h2 className="text-[var(--foreground)] font-semibold">Så fungerar beräkningen</h2>
        <p>
          Köp- och säljpris predikteras med multivariat regression baserad på
          {" "}bilålder, miltal, bränsle, hästkrafter, utrustning, drivlina och säljartyp.
          Miltalet föreslås automatiskt baserat på medianen bland verkliga annonser
          för vald modell och årsmodell.
        </p>
        <p>
          Driftskostnader (försäkring, service, reparation, skatt) varierar med
          bilens ålder och modell. Service är normalt inkluderat de första 3 åren,
          och reparationskostnader ökar med bilens ålder — mer för premiumbilar.
          95% konfidensintervall beräknas från regressionens residualfel.
        </p>
      </div>
    </div>
  );
}
