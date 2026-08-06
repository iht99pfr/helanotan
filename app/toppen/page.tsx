import type { Metadata } from "next";
import { canonical } from "@/app/lib/canonical";
import { getDb } from "@/app/lib/db";
import type { ModelConfigMap } from "@/app/lib/model-config";

export const metadata: Metadata = {
  alternates: canonical("/toppen"),
  title: "Värdeminskning-ligan — Vilka bilar behåller värdet bäst?",
  description:
    "Ranking av 15 populära bilmodeller efter värdebevarande. Se vilka bilar som tappar minst i värde efter 3 år — och vilka som tappar mest.",
  openGraph: {
    title: "Värdeminskning-ligan | Hela Notan",
    description:
      "Ranking av 15 populära bilmodeller efter värdebevarande. Se vilka bilar som tappar minst — och mest.",
  },
};

const FUEL_LABELS: Record<string, string> = {
  Hybrid: "Hybrid",
  PHEV: "Laddhybrid",
  Diesel: "Diesel",
  Petrol: "Bensin",
  Electric: "El",
};

interface RetentionPoint {
  age: number;
  retention: number;
}

interface RetentionData {
  newPrice: number;
  points: RetentionPoint[];
}

interface PredictionPoint {
  age: number;
  predicted: number;
  lower: number;
  upper: number;
}

interface RankedModel {
  modelKey: string;
  label: string;
  fuel: string;
  fuelLabel: string;
  retention3yr: number;
  newPrice: number;
  value3yr: number;
}

interface BestBuyModel {
  modelKey: string;
  label: string;
  fuel: string;
  fuelLabel: string;
  priceAt1: number;
  priceAt4: number;
  depreciationPerMonth: number;
}

function formatKr(value: number): string {
  return Math.round(value).toLocaleString("sv-SE") + " kr";
}

function findRetentionAt3(points: RetentionPoint[]): number | null {
  const exact = points.find((p) => p.age === 3);
  if (exact) return exact.retention;
  // Interpolate between nearest points
  const sorted = [...points].sort((a, b) => a.age - b.age);
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].age < 3 && sorted[i + 1].age > 3) {
      const ratio = (3 - sorted[i].age) / (sorted[i + 1].age - sorted[i].age);
      return sorted[i].retention + ratio * (sorted[i + 1].retention - sorted[i].retention);
    }
  }
  return null;
}

function findPredictedAtAge(
  curves: Record<string, PredictionPoint[]>,
  fuel: string,
  age: number
): number | null {
  const fuelCurve = curves[fuel] || curves["all"];
  if (!fuelCurve) return null;
  const point = fuelCurve.find((p) => p.age === age);
  return point ? point.predicted : null;
}

async function fetchAggregates() {
  const sql = getDb();
  const rows = await sql`SELECT data FROM web_cache WHERE key = 'aggregates'`;
  return rows[0]?.data || null;
}

export default async function ToppenPage() {
  const aggregates = await fetchAggregates();

  if (!aggregates) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
          Värdeminskning-ligan
        </h1>
        <p className="text-[var(--muted)]">Data kunde inte laddas. Försök igen senare.</p>
      </div>
    );
  }

  const retention: Record<string, RetentionData> = aggregates.retention || {};
  const predictionCurves: Record<string, Record<string, PredictionPoint[]>> =
    aggregates.predictionCurves || {};
  const modelConfig: ModelConfigMap = aggregates.modelConfig || {};

  // Build ranked list: for each model, compute retention for each fuel variant
  const allModels: RankedModel[] = [];

  for (const [modelKey, retData] of Object.entries(retention)) {
    const meta = modelConfig[modelKey];
    if (!meta) continue;

    const fuelOptions = meta.fuelOptions || ["Petrol"];

    for (const fuel of fuelOptions) {
      // Try to get fuel-specific retention from predictionCurves
      const fuelCurve = predictionCurves[modelKey]?.[fuel];
      let retention3yr: number | null = null;

      if (fuelCurve) {
        const basePoint = fuelCurve.find((p) => p.age === 0) || fuelCurve[0];
        const age3Point = fuelCurve.find((p) => p.age === 3);
        if (basePoint && age3Point && basePoint.predicted > 0) {
          retention3yr = (age3Point.predicted / basePoint.predicted) * 100;
        }
      }

      // Fall back to aggregate retention
      if (retention3yr === null) {
        retention3yr = findRetentionAt3(retData.points);
      }

      if (retention3yr === null) continue;

      // Cap at 100%
      retention3yr = Math.min(100, retention3yr);

      // Filter out unrealistic retention values (data errors)
      if (retention3yr > 99 || retention3yr < 5) continue;

      const newPrice = retData.newPrice;
      const value3yr = newPrice * (retention3yr / 100);

      allModels.push({
        modelKey,
        label: meta.label,
        fuel,
        fuelLabel: FUEL_LABELS[fuel] || fuel,
        retention3yr,
        newPrice,
        value3yr,
      });
    }
  }

  // Sort by retention descending
  allModels.sort((a, b) => b.retention3yr - a.retention3yr);

  const topModels = allModels.slice(0, 10);
  const bottomModels = [...allModels].sort((a, b) => a.retention3yr - b.retention3yr).slice(0, 10);

  // Best buy: lowest depreciation per month (buy at age 1, sell at age 4)
  const bestBuys: BestBuyModel[] = [];

  for (const [modelKey, curves] of Object.entries(predictionCurves)) {
    const meta = modelConfig[modelKey];
    if (!meta) continue;

    const fuelOptions = meta.fuelOptions || ["Petrol"];

    for (const fuel of fuelOptions) {
      const priceAt1 = findPredictedAtAge(curves, fuel, 1);
      const priceAt4 = findPredictedAtAge(curves, fuel, 4);

      if (priceAt1 === null || priceAt4 === null || priceAt1 <= 0) continue;

      const depreciationPerMonth = (priceAt1 - priceAt4) / 36;

      if (depreciationPerMonth <= 0) continue;

      // Filter out unrealistically low depreciation (data errors from too few data points)
      if (depreciationPerMonth < 100) continue;

      bestBuys.push({
        modelKey,
        label: meta.label,
        fuel,
        fuelLabel: FUEL_LABELS[fuel] || fuel,
        priceAt1,
        priceAt4,
        depreciationPerMonth,
      });
    }
  }

  bestBuys.sort((a, b) => a.depreciationPerMonth - b.depreciationPerMonth);
  const topBuys = bestBuys.slice(0, 10);

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Hero */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
          Värdeminskning-ligan
        </h1>
        <p className="text-[var(--muted)] text-sm sm:text-base mt-2 max-w-2xl">
          Vilka bilar behåller värdet bäst — och vilka tappar mest? Rankingen baseras på
          regressionsmodeller tränade på verkliga Blocket-annonser och visar hur stor andel av
          nypriset som finns kvar efter 3 år.
        </p>
      </div>

      {/* Best value retention */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">
            Bäst värdebevarande
          </h2>
          <p className="text-[var(--muted)] text-sm mt-1">
            Modeller som behåller störst andel av nypriset efter 3 år.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
                <th className="py-3 pr-3 font-medium">#</th>
                <th className="py-3 pr-3 font-medium">Modell</th>
                <th className="py-3 pr-3 font-medium">Drivmedel</th>
                <th className="py-3 pr-3 font-medium text-right">Behåller efter 3 år</th>
                <th className="py-3 pr-3 font-medium text-right hidden sm:table-cell">Nypris (snitt)</th>
                <th className="py-3 font-medium text-right hidden sm:table-cell">Värde efter 3 år</th>
              </tr>
            </thead>
            <tbody>
              {topModels.map((m, i) => (
                <tr
                  key={`${m.modelKey}-${m.fuel}`}
                  className={`border-b border-[var(--border)] ${
                    i < 3 ? "bg-[var(--money-soft)]" : ""
                  }`}
                >
                  <td className="py-3 pr-3 font-mono text-[var(--muted)]">{i + 1}</td>
                  <td className="py-3 pr-3 font-medium text-[var(--foreground)]">{m.label}</td>
                  <td className="py-3 pr-3 text-[var(--muted)]">{m.fuelLabel}</td>
                  <td className="py-3 pr-3 text-right font-mono font-semibold text-[var(--money)]">
                    {m.retention3yr.toFixed(1)}%
                  </td>
                  <td className="py-3 pr-3 text-right font-mono text-[var(--muted)] hidden sm:table-cell">
                    {formatKr(m.newPrice)}
                  </td>
                  <td className="py-3 text-right font-mono text-[var(--muted)] hidden sm:table-cell">
                    {formatKr(m.value3yr)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <hr className="border-[var(--border)]" />

      {/* Worst value retention */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">Tappar mest</h2>
          <p className="text-[var(--muted)] text-sm mt-1">
            Modeller som tappar störst andel av värdet under de första 3 åren.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
                <th className="py-3 pr-3 font-medium">#</th>
                <th className="py-3 pr-3 font-medium">Modell</th>
                <th className="py-3 pr-3 font-medium">Drivmedel</th>
                <th className="py-3 pr-3 font-medium text-right">Behåller efter 3 år</th>
                <th className="py-3 pr-3 font-medium text-right hidden sm:table-cell">Nypris (snitt)</th>
                <th className="py-3 font-medium text-right hidden sm:table-cell">Värde efter 3 år</th>
              </tr>
            </thead>
            <tbody>
              {bottomModels.map((m, i) => (
                <tr
                  key={`${m.modelKey}-${m.fuel}`}
                  className={`border-b border-[var(--border)] ${
                    i < 3 ? "bg-red-50/60" : ""
                  }`}
                >
                  <td className="py-3 pr-3 font-mono text-[var(--muted)]">{i + 1}</td>
                  <td className="py-3 pr-3 font-medium text-[var(--foreground)]">{m.label}</td>
                  <td className="py-3 pr-3 text-[var(--muted)]">{m.fuelLabel}</td>
                  <td className="py-3 pr-3 text-right font-mono font-semibold text-red-700">
                    {m.retention3yr.toFixed(1)}%
                  </td>
                  <td className="py-3 pr-3 text-right font-mono text-[var(--muted)] hidden sm:table-cell">
                    {formatKr(m.newPrice)}
                  </td>
                  <td className="py-3 text-right font-mono text-[var(--muted)] hidden sm:table-cell">
                    {formatKr(m.value3yr)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <hr className="border-[var(--border)]" />

      {/* Best buy right now */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">
            Bästa köpet just nu
          </h2>
          <p className="text-[var(--muted)] text-sm mt-1">
            Modeller med lägst värdeminskning per månad vid köp av 1 år gammal bil och 3 års
            ägande. Enbart värdeminskningskostnad — exklusive driftskostnader.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
                <th className="py-3 pr-3 font-medium">#</th>
                <th className="py-3 pr-3 font-medium">Modell</th>
                <th className="py-3 pr-3 font-medium">Drivmedel</th>
                <th className="py-3 pr-3 font-medium text-right">Köppris (1 år)</th>
                <th className="py-3 pr-3 font-medium text-right hidden sm:table-cell">
                  Säljpris (4 år)
                </th>
                <th className="py-3 font-medium text-right">Kostnad/mån</th>
              </tr>
            </thead>
            <tbody>
              {topBuys.map((m, i) => (
                <tr
                  key={`${m.modelKey}-${m.fuel}`}
                  className={`border-b border-[var(--border)] ${
                    i < 3 ? "bg-[var(--money-soft)]" : ""
                  }`}
                >
                  <td className="py-3 pr-3 font-mono text-[var(--muted)]">{i + 1}</td>
                  <td className="py-3 pr-3 font-medium text-[var(--foreground)]">{m.label}</td>
                  <td className="py-3 pr-3 text-[var(--muted)]">{m.fuelLabel}</td>
                  <td className="py-3 pr-3 text-right font-mono text-[var(--muted)]">
                    {formatKr(m.priceAt1)}
                  </td>
                  <td className="py-3 pr-3 text-right font-mono text-[var(--muted)] hidden sm:table-cell">
                    {formatKr(m.priceAt4)}
                  </td>
                  <td className="py-3 text-right font-mono font-semibold text-[var(--foreground)]">
                    {formatKr(m.depreciationPerMonth)}/mån
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <hr className="border-[var(--border)]" />

      {/* Methodology */}
      <section className="bg-[var(--card)] p-5 sm:p-6 border border-[var(--border)] rounded-lg text-sm text-[var(--muted)] space-y-2 max-w-2xl">
        <h2 className="text-[var(--foreground)] font-semibold">Så räknar vi</h2>
        <p>
          Värdebevarande beräknas mot den yngsta årsmodell där underlaget räcker (oftast men inte alltid en nybil), baserat på
          prediktionskurvor från vår regressionsmodell tränad på verkliga Blocket-annonser.
          Varje modell och drivmedelstyp rankas separat.
        </p>
        <p>
          &ldquo;Bästa köpet&rdquo; visar värdeminskningskostnaden per månad vid köp av en 1 år
          gammal bil som ägs i 3 år. Driftskostnader (försäkring, skatt, service) ingår inte
          i denna beräkning — se{" "}
          <a href="/tco" className="underline hover:text-[var(--foreground)] transition">
            ägandekostnadsberäknaren
          </a>{" "}
          för en komplett bild.
        </p>
      </section>
    </div>
  );
}
