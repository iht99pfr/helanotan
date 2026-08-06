"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { useModelSelection } from "./ModelSelectionContext";
import CarDetailModal from "./CarDetailModal";
import { track } from "@/app/lib/track";

const DepreciationChart = dynamic(() => import("./DepreciationChart"), { ssr: false });
const RetentionChart = dynamic(() => import("./RetentionChart"), { ssr: false });
const MileageChart = dynamic(() => import("./MileageChart"), { ssr: false });

const FUEL_FILTERS = ["Alla", "Hybrid", "Laddhybrid", "Diesel", "Bensin"] as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface SelectedDot { modelKey: string; point: any; }

const CURRENT_YEAR = new Date().getFullYear();

export default function ChartSection() {
  const { selectedModels, modelConfig, fuelFilter, setFuelFilter, aggregates } =
    useModelSelection();
  const [hiddenModels, setHiddenModels] = useState<Set<string>>(new Set());
  const [selectedDot, setSelectedDot] = useState<SelectedDot | null>(null);
  const [yearMin, setYearMin] = useState(0);
  const [yearMax, setYearMax] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [scatter, setScatter] = useState<any>(null);

  // Scatter is fetched per model and accumulated, so toggling a model on and
  // off again costs one request rather than one per toggle. Fetching all
  // eighteen up front meant 2.3 MB parsed to draw three.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scatterCache = useRef<Record<string, any>>({});
  const modelsKey = useMemo(() => [...selectedModels].sort().join(","), [selectedModels]);

  useEffect(() => {
    const wanted = modelsKey ? modelsKey.split(",") : [];
    const missing = wanted.filter((m) => !(m in scatterCache.current));
    if (!missing.length) {
      setScatter({ ...scatterCache.current });
      return;
    }
    let cancelled = false;
    fetch(`/api/scatter?models=${encodeURIComponent(missing.join(","))}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        // Record every requested model, even one the payload has no points
        // for, so a model with no data is not re-requested on every render.
        for (const m of missing) scatterCache.current[m] = data?.[m] ?? [];
        setScatter({ ...scatterCache.current });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [modelsKey]);

  const toggleModel = useCallback((model: string) => {
    setHiddenModels((prev) => {
      const next = new Set(prev);
      if (next.has(model)) next.delete(model);
      else next.add(model);
      return next;
    });
  }, []);

  // Filter data to only selected models
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredScatter = useMemo<any>(() => {
    if (!scatter) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filtered: any = {};
    for (const key of Object.keys(scatter)) {
      if (selectedModels.has(key)) filtered[key] = scatter[key];
    }
    return filtered;
  }, [scatter, selectedModels]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredAggregates = useMemo<any>(() => {
    if (!aggregates) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filterRecord = (obj: Record<string, any>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const out: Record<string, any> = {};
      for (const key of Object.keys(obj)) {
        if (selectedModels.has(key)) out[key] = obj[key];
      }
      return out;
    };
    return {
      ...aggregates,
      priceByAge: filterRecord(aggregates.priceByAge || {}),
      retention: filterRecord(aggregates.retention || {}),
      predictionCurves: filterRecord(aggregates.predictionCurves || {}),
    };
  }, [aggregates, selectedModels]);

  // Compute max age with actual data per model (don't extrapolate beyond data)
  const maxAgePerModel = useMemo<Record<string, number>>(() => {
    if (!filteredScatter) return {};
    const result: Record<string, number> = {};
    for (const [model, points] of Object.entries(filteredScatter)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ages = (points as any[]).map((p: any) => p.age as number);
      if (ages.length > 0) result[model] = Math.max(...ages);
    }
    return result;
  }, [filteredScatter]);

  if (!filteredAggregates || !filteredScatter) {
    return (
      <div className="space-y-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-4">
            <div className="animate-pulse h-6 bg-[var(--border)] rounded w-1/4" />
            <div className="animate-pulse h-[400px] bg-[var(--border)] rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Shared fuel filter */}
      <div className="flex flex-wrap gap-2 mb-2">
        {FUEL_FILTERS.map((fuel) => (
          <button
            key={fuel}
            onClick={() => {
              setFuelFilter(fuel);
              track("fuel_filter", { fuel });
            }}
            className={`px-3 py-2.5 sm:py-1.5 rounded-lg text-sm transition ${
              fuelFilter === fuel
                ? "bg-[var(--foreground)] text-white"
                : "bg-white text-[var(--muted)] border border-[var(--border)] hover:border-[var(--muted)]"
            }`}
          >
            {fuel === "Alla" ? "Alla bränslen" : fuel}
          </button>
        ))}
      </div>

      {/* Depreciation by Age */}
      <section id="depreciation" className="space-y-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">Pris per ålder</h2>
          <p className="text-[var(--muted)] text-sm mt-1">
            Varje punkt är en verklig annons. Trendlinjer visar predikterat pris
            med 95% konfidensband.
          </p>
        </div>
        <DepreciationChart
          scatter={filteredScatter}
          medians={filteredAggregates.priceByAge}
          predictionCurves={filteredAggregates.predictionCurves}
          modelConfig={modelConfig}
          hiddenModels={hiddenModels}
          onToggleModel={toggleModel}
          fuelFilter={fuelFilter}
          maxAgePerModel={maxAgePerModel}
          onDotClick={(modelKey, point) => setSelectedDot({ modelKey, point })}
        />
      </section>

      {/* Value Retention */}
      <section className="space-y-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">Restvärde</h2>
          <p className="text-[var(--muted)] text-sm mt-1">
            Andel av priset för den yngsta årsmodell vi har tillräckligt underlag för. För de flesta modeller är det en nybil, men inte för alla — se Metod.
            Det skuggade bandet visar var hälften av annonserna ligger — inte
            osäkerhet i kurvan, utan spridning mellan enskilda bilar.
          </p>
        </div>
        <RetentionChart
          retention={filteredAggregates.retention}
          predictionCurves={filteredAggregates.predictionCurves}
          modelConfig={modelConfig}
          hiddenModels={hiddenModels}
          onToggleModel={toggleModel}
          fuelFilter={fuelFilter}
          maxAgePerModel={maxAgePerModel}
        />
      </section>

      {/* Mileage Impact */}
      <section id="mileage" className="space-y-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">Miltalseffekt</h2>
          <p className="text-[var(--muted)] text-sm mt-1">
            Hur miltal korrelerar med begärt pris för respektive modell.
          </p>
        </div>
        {/* Mileage cost badges per model */}
        {filteredAggregates.regression && (
          <div className="flex flex-wrap gap-3">
            {Object.keys(filteredAggregates.regression)
              .filter((m) => selectedModels.has(m))
              .map((model) => {
                const reg = filteredAggregates.regression[model];
                if (!reg?.coefficients) return null;
                const c = reg.coefficients;
                let coeff = c.mileage_mil || 0;
                // Add fuel interaction term based on current filter
                const fuelMap: Record<string, string> = { Laddhybrid: "mileage_x_phev", El: "mileage_x_electric" };
                const interKey = fuelMap[fuelFilter];
                if (interKey && c[interKey]) coeff += c[interKey];
                const pctPer1000 = (1 - Math.exp(coeff * 1000)) * 100;
                const cfg = modelConfig[model];
                const label = cfg?.label?.split(" ").pop() || model;
                // These badges carry a coloured dot, a border and rounded
                // corners — the exact costume the fuel filters two sections
                // above wear. They were plain divs, so tapping one did
                // nothing. Rather than restyle them into blandness, give them
                // the behaviour their appearance already promised: the same
                // show/hide toggle as the chart legends.
                const isHidden = hiddenModels.has(model);
                return (
                  <button
                    key={model}
                    onClick={() => {
                      toggleModel(model);
                      track("model_visibility", { model, visible: isHidden, source: "mileage_badge" });
                    }}
                    aria-pressed={!isHidden}
                    title={isHidden ? `Visa ${label} i diagrammet` : `Dölj ${label} i diagrammet`}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition ${
                      isHidden ? "opacity-40 line-through" : "hover:bg-[var(--card)]"
                    }`}
                    style={{ borderColor: cfg?.color || "#888" }}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cfg?.color || "#888" }}
                    />
                    <span className="text-[var(--muted)]">{label}</span>
                    <span className="font-mono font-semibold text-[var(--foreground)]">
                      −{pctPer1000.toFixed(2)}%
                    </span>
                    <span className="text-[var(--muted)] text-xs"><span className="hidden sm:inline">av aktuellt värde </span>/ 1 000 mil</span>
                  </button>
                );
              })}
          </div>
        )}
        {/* Year filter for mileage chart */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[var(--muted)]">Årsmodell:</span>
          <select
            value={yearMin || ""}
            onChange={(e) => setYearMin(Number(e.target.value) || 0)}
            className="bg-white border border-[var(--border)] px-2 py-1.5 text-sm rounded-lg"
          >
            <option value="">Från</option>
            {Array.from({ length: CURRENT_YEAR - 2004 }, (_, i) => CURRENT_YEAR - i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <span className="text-[var(--muted)] text-xs">–</span>
          <select
            value={yearMax || ""}
            onChange={(e) => setYearMax(Number(e.target.value) || 0)}
            className="bg-white border border-[var(--border)] px-2 py-1.5 text-sm rounded-lg"
          >
            <option value="">Till</option>
            {Array.from({ length: CURRENT_YEAR - 2004 }, (_, i) => CURRENT_YEAR - i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          {(yearMin > 0 || yearMax > 0) && (
            <button
              onClick={() => { setYearMin(0); setYearMax(0); }}
              className="text-xs text-red-500 hover:text-red-700 transition px-1"
            >
              Rensa
            </button>
          )}
        </div>
        <MileageChart
          scatter={filteredScatter}
          modelConfig={modelConfig}
          hiddenModels={hiddenModels}
          onToggleModel={toggleModel}
          fuelFilter={fuelFilter}
          yearMin={yearMin}
          yearMax={yearMax}
          onDotClick={(modelKey, point) => setSelectedDot({ modelKey, point })}
        />
      </section>

      {/* Car detail modal for scatter dot clicks */}
      {selectedDot && (
        <CarDetailModal
          point={selectedDot.point}
          modelKey={selectedDot.modelKey}
          modelLabel={modelConfig[selectedDot.modelKey]?.label || selectedDot.modelKey}
          onClose={() => setSelectedDot(null)}
        />
      )}
    </>
  );
}
