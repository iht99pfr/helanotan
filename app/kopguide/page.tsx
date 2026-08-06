"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ShareBar from "@/app/components/ShareBar";
import type { ModelConfigMap } from "@/app/lib/model-config";
import { computeOwnershipCosts } from "@/app/lib/tco-costs";

const FUEL_LABELS: Record<string, string> = {
  Hybrid: "Hybrid",
  PHEV: "Laddhybrid",
  Diesel: "Diesel",
  Petrol: "Bensin",
  Electric: "El",
};

interface PredictionPoint {
  age: number;
  predicted: number;
  lower: number;
  upper: number;
}

interface AgeRow {
  age: number;
  year: number;
  price: number;
  depPerYear: number | null;
  costPerMonth: number | null;
  runningCostPerMonth: number | null;
  totalCostPerMonth: number | null;
  tag: string | null;
}

function formatKr(value: number): string {
  return Math.round(value).toLocaleString("sv-SE") + " kr";
}

const currentYear = new Date().getFullYear();

export default function KopguidePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [modelConfig, setModelConfig] = useState<ModelConfigMap | null>(null);
  const [predictionCurves, setPredictionCurves] = useState<
    Record<string, Record<string, PredictionPoint[]>> | null
  >(null);
  const [loading, setLoading] = useState(true);

  // Read initial selection from URL params
  const initialModel = searchParams.get("model") || "";
  const initialFuel = searchParams.get("fuel") || "";

  const [selectedModel, setSelectedModel] = useState(initialModel);
  const [selectedFuel, setSelectedFuel] = useState(initialFuel);

  useEffect(() => {
    fetch("/api/aggregates")
      .then((r) => r.json())
      .then((data) => {
        const config: ModelConfigMap = data.modelConfig || {};
        setModelConfig(config);
        setPredictionCurves(data.predictionCurves || {});

        // Set default model if none selected from URL
        const models = Object.keys(config);
        setSelectedModel((prev) => {
          if (prev && config[prev]) return prev;
          return models.length > 0 ? models[0] : "";
        });

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Derive fuel options and effective fuel from current model
  const fuelOptions = useMemo(() => {
    if (!modelConfig || !selectedModel) return [];
    return modelConfig[selectedModel]?.fuelOptions || [];
  }, [modelConfig, selectedModel]);

  // The displayed/used fuel — falls back if current selection is invalid
  const activeFuel = useMemo(() => {
    if (fuelOptions.includes(selectedFuel)) return selectedFuel;
    return fuelOptions.length > 0 ? fuelOptions[0] : "";
  }, [fuelOptions, selectedFuel]);

  // When model changes, reset fuel to first available if current is invalid
  const handleModelChange = useCallback(
    (model: string) => {
      setSelectedModel(model);
      const newFuelOptions = modelConfig?.[model]?.fuelOptions || [];
      if (!newFuelOptions.includes(selectedFuel)) {
        setSelectedFuel(newFuelOptions[0] || "");
      }
    },
    [modelConfig, selectedFuel]
  );

  // Update URL params
  useEffect(() => {
    if (selectedModel && activeFuel) {
      const params = new URLSearchParams();
      params.set("model", selectedModel);
      params.set("fuel", activeFuel);
      router.replace(`/kopguide?${params.toString()}`, { scroll: false });
    }
  }, [selectedModel, activeFuel, router]);

  // Compute rows
  const rows: AgeRow[] = useMemo(() => {
    if (!predictionCurves || !selectedModel || !activeFuel) return [];
    const curves = predictionCurves[selectedModel];
    if (!curves) return [];

    const fuelCurve = curves[activeFuel] || curves["all"];
    if (!fuelCurve) return [];

    const result: AgeRow[] = [];

    for (const point of fuelCurve) {
      if (point.age < 0 || point.age > 10) continue;

      const year = currentYear - point.age;
      const price = point.predicted;

      // Find predicted price 3 years later for cost/month
      const futurePoint = fuelCurve.find((p) => p.age === point.age + 3);
      let costPerMonth: number | null = null;
      let depPerYear: number | null = null;
      let runningCostPerMonth: number | null = null;
      let totalCostPerMonth: number | null = null;

      if (futurePoint && price > 0) {
        const totalDep = price - futurePoint.predicted;
        costPerMonth = totalDep / 36;
        depPerYear = totalDep / 3;

        // Running costs (service, repair, insurance, tax) for 3 years at this age
        const ownership = computeOwnershipCosts(selectedModel, activeFuel, point.age, 3);
        runningCostPerMonth = (ownership.service + ownership.repair + ownership.insurance + ownership.tax) / 36;
        totalCostPerMonth = costPerMonth + runningCostPerMonth;
      }

      result.push({
        age: point.age,
        year,
        price,
        depPerYear,
        costPerMonth,
        runningCostPerMonth,
        totalCostPerMonth,
        tag: null,
      });
    }

    // Assign tags
    if (result.length > 0) {
      // Newest as "Maximal komfort"
      const newest = result.find((r) => r.age === 0);
      if (newest) newest.tag = "Maximal komfort";

      // Best value: lowest total cost/month (depreciation + running) among rows with valid data
      const withCost = result.filter((r) => r.totalCostPerMonth !== null && r.totalCostPerMonth > 0);
      if (withCost.length > 0) {
        const best = withCost.reduce((a, b) =>
          (a.totalCostPerMonth ?? Infinity) < (b.totalCostPerMonth ?? Infinity) ? a : b
        );
        best.tag = "Bästa värdet";
      }

      // Budget pick: oldest with valid cost data
      const budgetCandidates = result.filter(
        (r) => r.totalCostPerMonth !== null && r.age >= 5
      );
      if (budgetCandidates.length > 0) {
        const oldest = budgetCandidates[budgetCandidates.length - 1];
        if (oldest.tag === null) oldest.tag = "Budgetval";
      }
    }

    return result;
  }, [predictionCurves, selectedModel, activeFuel]);

  const modelLabel = modelConfig?.[selectedModel]?.label || selectedModel;
  const fuelLabel = FUEL_LABELS[activeFuel] || activeFuel;

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://helanotan.se/kopguide?model=${selectedModel}&fuel=${activeFuel}`;
  const shareTitle = `${modelLabel} ${fuelLabel} — Vilken årsmodell ska jag köpa?`;

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Hero */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
          Vilken årsmodell ska jag köpa?
        </h1>
        <p className="text-[var(--muted)] text-sm sm:text-base mt-2 max-w-2xl">
          Välj en bilmodell och se hur värdeminskningskostnaden skiljer sig mellan årsmodeller.
          Hitta den sweet spot där du får mest bil för pengarna.
        </p>
      </div>

      {/* Selectors */}
      <section className="flex flex-col sm:flex-row gap-4">
        <div className="space-y-1.5">
          <label htmlFor="model-select" className="text-sm font-medium text-[var(--muted)]">
            Modell
          </label>
          {loading ? (
            <div className="h-10 w-48 bg-[var(--border)] rounded-lg animate-pulse" />
          ) : (
            <select
              id="model-select"
              value={selectedModel}
              onChange={(e) => handleModelChange(e.target.value)}
              className="block w-full sm:w-56 px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]/20"
            >
              {modelConfig &&
                Object.entries(modelConfig).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.label}
                  </option>
                ))}
            </select>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="fuel-select" className="text-sm font-medium text-[var(--muted)]">
            Drivmedel
          </label>
          {loading ? (
            <div className="h-10 w-40 bg-[var(--border)] rounded-lg animate-pulse" />
          ) : (
            <select
              id="fuel-select"
              value={activeFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              className="block w-full sm:w-44 px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]/20"
            >
              {fuelOptions.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {FUEL_LABELS[fuel] || fuel}
                </option>
              ))}
            </select>
          )}
        </div>
      </section>

      {/* Comparison table */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-[var(--border)] rounded-lg" />
        </div>
      ) : rows.length === 0 ? (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 text-center">
          <p className="text-[var(--muted)]">
            Ingen data tillgänglig för {modelLabel} {fuelLabel}. Prova en annan kombination.
          </p>
        </div>
      ) : (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">
              {modelLabel} {fuelLabel} — jämförelse per årsmodell
            </h2>
            <p className="text-[var(--muted)] text-sm mt-1">
              Kostnad per månad inkluderar värdeminskning, service, reparation, försäkring och skatt vid 3 års ägande.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
                  <th className="py-3 pr-3 font-medium">Årsmodell</th>
                  <th className="py-3 pr-3 font-medium text-right">Snitt-pris</th>
                  <th className="py-3 pr-3 font-medium text-right">Total/mån</th>
                  <th className="py-3 pr-3 font-medium text-right hidden sm:table-cell">
                    varav värdem.
                  </th>
                  <th className="py-3 pr-3 font-medium text-right hidden sm:table-cell">
                    varav drift
                  </th>
                  <th className="py-3 font-medium">Rekommendation</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.age}
                    className={`border-b border-[var(--border)] ${
                      row.tag === "Bästa värdet" ? "bg-[var(--money-soft)]" : ""
                    }`}
                  >
                    <td className="py-3 pr-3 font-medium text-[var(--foreground)]">
                      {row.year}{" "}
                      <span className="text-[var(--muted)] font-normal text-xs">
                        ({row.age === 0 ? "ny" : `${row.age} år`})
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-right font-mono text-[var(--muted)]">
                      {formatKr(row.price)}
                    </td>
                    <td className="py-3 pr-3 text-right font-mono font-semibold text-[var(--foreground)]">
                      {row.totalCostPerMonth !== null ? `${formatKr(row.totalCostPerMonth)}/mån` : "\u2014"}
                    </td>
                    <td className="py-3 pr-3 text-right font-mono text-[var(--muted)] hidden sm:table-cell">
                      {row.costPerMonth !== null ? formatKr(row.costPerMonth) : "\u2014"}
                    </td>
                    <td className="py-3 pr-3 text-right font-mono text-[var(--muted)] hidden sm:table-cell">
                      {row.runningCostPerMonth !== null ? formatKr(row.runningCostPerMonth) : "\u2014"}
                    </td>
                    <td className="py-3">
                      {row.tag && (
                        <span
                          className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                            row.tag === "Bästa värdet"
                              ? "bg-[var(--money-soft)] text-[var(--money)]"
                              : row.tag === "Maximal komfort"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {row.tag}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Share */}
          <div className="pt-2">
            <ShareBar
              url={shareUrl}
              title={shareTitle}
              description={`Se värdeminskningsjämförelse för ${modelLabel} ${fuelLabel} på Hela Notan`}
              eventPrefix="kopguide"
            />
          </div>
        </section>
      )}

      <hr className="border-[var(--border)]" />

      {/* Methodology */}
      <section className="bg-[var(--card)] p-5 sm:p-6 border border-[var(--border)] rounded-lg text-sm text-[var(--muted)] space-y-2 max-w-2xl">
        <h2 className="text-[var(--foreground)] font-semibold">Så fungerar guiden</h2>
        <p>
          Snitt-priset för varje årsmodell kommer från vår regressionsmodell tränad på
          verkliga Blocket-annonser. Total kostnad per månad beräknas som värdeminskning
          plus driftskostnader (service, reparation, försäkring och skatt) vid 3 års ägande,
          delat med 36 månader.
        </p>
        <p>
          Driftskostnaderna ökar med bilens ålder — service och reparationer blir dyrare
          medan försäkringspremien sjunker. Därför hamnar den bästa balansen ofta vid 3–5 års
          ålder, inte vid den äldsta bilen. För en ännu mer detaljerad kalkyl inklusive bränslekostnad — se{" "}
          <a href="/tco" className="underline hover:text-[var(--foreground)] transition">
            ägandekostnadsberäknaren
          </a>
          .
        </p>
      </section>
    </div>
  );
}
