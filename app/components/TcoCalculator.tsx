"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getFuelOptions } from "@/app/lib/model-config";
import type { ModelConfigMap } from "@/app/lib/model-config";
import { isPhev, FUEL_PRICES } from "@/app/lib/tco-costs";
import {
  computeTco,
  getMedianMileage,
  FUEL_LABELS,
} from "@/app/lib/tco-compute";
import type {
  RegressionModel,
  ScatterPoint,
  CurvePoint,
  ScenarioInputs,
} from "@/app/lib/tco-compute";

interface Props {
  regression: Record<string, RegressionModel>;
  tcoDefaults?: Record<string, unknown>; // legacy, no longer used
  modelConfig: ModelConfigMap;
  scatter: Record<string, ScatterPoint[]>;
  predictionCurves: Record<string, Record<string, CurvePoint[]>>;
}

export default function TcoCalculator({ regression, modelConfig, scatter, predictionCurves }: Props) {
  const searchParams = useSearchParams();
  const firstModel = Object.keys(regression)[0] || "RAV4";
  const firstFuel = getFuelOptions(modelConfig, firstModel)[0] || "Hybrid";

  const [scenario, setScenario] = useState<ScenarioInputs>(() => {
    const urlModel = searchParams.get("model");
    if (urlModel && regression[urlModel]) {
      const fuels = getFuelOptions(modelConfig, urlModel);
      const urlFuel = searchParams.get("fuel");
      return {
        model: urlModel,
        fuel: urlFuel && fuels.includes(urlFuel) ? urlFuel : fuels[0],
        year: Number(searchParams.get("year")) || 2022,
        mileage: Number(searchParams.get("mileage")) || 5000,
        holdingYears: Number(searchParams.get("keep")) || 3,
        annualMileage: Number(searchParams.get("driving")) || 1500,
      };
    }
    return {
      model: firstModel,
      year: 2022,
      fuel: firstFuel,
      mileage: 5000,
      holdingYears: 3,
      annualMileage: 1500,
    };
  });

  // Track whether URL specified mileage (skip auto-populate on mount)
  const hydratedFromUrl = useRef(!!searchParams.get("model"));

  // PHEV electric share slider (0-100, displayed as percentage)
  const [electricPct, setElectricPct] = useState(50);
  const showElSlider = isPhev(scenario.model, scenario.fuel);

  // Advanced settings
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [interestRate, setInterestRate] = useState(4.5);

  // Share state
  const [copied, setCopied] = useState(false);

  // Auto-populate mileage when model or year changes
  useEffect(() => {
    if (hydratedFromUrl.current) {
      hydratedFromUrl.current = false;
      return;
    }
    const points = scatter[scenario.model];
    if (points) {
      const median = getMedianMileage(points, scenario.year);
      setScenario((prev) => ({ ...prev, mileage: median }));
    }
  }, [scenario.model, scenario.year, scatter]);

  const result = useMemo(() => {
    const reg = regression[scenario.model];
    if (!reg) return null;

    // Get fuel-specific curve, falling back to 'all'
    const modelCurves = predictionCurves[scenario.model];
    const curve = modelCurves?.[scenario.fuel] || modelCurves?.["all"];

    return computeTco(scenario, reg, curve, showElSlider ? electricPct / 100 : undefined, interestRate);
  }, [scenario, regression, predictionCurves, electricPct, showElSlider, interestRate]);

  const update = (partial: Partial<ScenarioInputs>) => {
    setScenario((prev) => ({ ...prev, ...partial }));
  };

  const scatterCount = scatter[scenario.model]?.filter((p) => p.year === scenario.year).length || 0;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm sm:text-xs text-[var(--muted)] block mb-1">Modell</label>
            <select
              value={scenario.model}
              onChange={(e) => {
                const model = e.target.value;
                const fuels = getFuelOptions(modelConfig, model);
                update({ model, fuel: fuels[0] });
              }}
              className="w-full bg-white border border-[var(--border)] px-3 py-2.5 sm:py-2 text-sm text-[var(--foreground)]"
            >
              {Object.entries(modelConfig)
                .filter(([key]) => regression[key])
                .map(([key, meta]) => (
                  <option key={key} value={key}>{meta.label}</option>
                ))}
            </select>
          </div>
          <div>
            <label className="text-sm sm:text-xs text-[var(--muted)] block mb-1">Bränsle</label>
            <select
              value={scenario.fuel}
              onChange={(e) => update({ fuel: e.target.value })}
              className="w-full bg-white border border-[var(--border)] px-3 py-2.5 sm:py-2 text-sm text-[var(--foreground)]"
            >
              {getFuelOptions(modelConfig, scenario.model).map((f) => (
                <option key={f} value={f}>
                  {FUEL_LABELS[f] || f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm sm:text-xs text-[var(--muted)] block mb-1">Årsmodell</label>
            <select
              value={scenario.year}
              onChange={(e) => update({ year: Number(e.target.value) })}
              className="w-full bg-white border border-[var(--border)] px-3 py-2.5 sm:py-2 text-sm text-[var(--foreground)]"
            >
              {Array.from({ length: 12 }, (_, i) => 2025 - i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm sm:text-xs text-[var(--muted)] block mb-1">Nuvarande miltal</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={scenario.mileage}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "");
                update({ mileage: Number(v) });
              }}
              className="w-full bg-white border border-[var(--border)] px-3 py-2.5 sm:py-2 text-sm font-mono text-[var(--foreground)]"
            />
            {scatterCount > 0 && (
              <p className="text-[10px] text-[var(--muted)] mt-0.5">
                Median från {scatterCount} annonser
              </p>
            )}
          </div>
          <div>
            <label className="text-sm sm:text-xs text-[var(--muted)] block mb-1">Behålla i (år)</label>
            <select
              value={scenario.holdingYears}
              onChange={(e) => update({ holdingYears: Number(e.target.value) })}
              className="w-full bg-white border border-[var(--border)] px-3 py-2.5 sm:py-2 text-sm text-[var(--foreground)]"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((y) => (
                <option key={y} value={y}>{y} år</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm sm:text-xs text-[var(--muted)] block mb-1">Årlig körning (mil/år)</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={scenario.annualMileage}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "");
                update({ annualMileage: Number(v) });
              }}
              className="w-full bg-white border border-[var(--border)] px-3 py-2.5 sm:py-2 text-sm font-mono text-[var(--foreground)]"
            />
          </div>
        </div>

        {showElSlider && (
          <div className="pt-1">
            <label className="text-xs text-[var(--muted)] block mb-1">
              Andel eldrift — {electricPct}% el / {100 - electricPct}% bensin
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={electricPct}
              onChange={(e) => setElectricPct(Number(e.target.value))}
              className="w-full accent-[var(--foreground)]"
            />
            <div className="flex justify-between text-[10px] text-[var(--muted)]">
              <span>100% bensin</span>
              <span>100% el</span>
            </div>
          </div>
        )}

        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            {showAdvanced ? "▾" : "▸"} Avancerat
          </button>
          {showAdvanced && (
            <div className="mt-2 space-y-2">
              <div>
                <label className="text-xs text-[var(--muted)] block mb-1">
                  Kalkylränta (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.5}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="flex-1 accent-[var(--foreground)]"
                  />
                  <span className="text-xs font-mono text-[var(--foreground)] w-12 text-right">
                    {interestRate.toFixed(1)}%
                  </span>
                </div>
                <p className="text-[10px] text-[var(--muted)] mt-0.5">
                  Ränta på bundet kapital (billån eller alternativkostnad)
                </p>
              </div>
            </div>
          )}
        </div>

        {result && (
          <div className="pt-3 border-t border-[var(--border)] space-y-3">
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-[var(--muted)]">Uppskattat köppris</span>
              <span className="text-right font-mono font-semibold text-[var(--foreground)]">
                {result.buyPrice.toLocaleString("sv-SE")} kr
              </span>
              <span className="text-[var(--muted)]">Uppskattat säljpris</span>
              <span className="text-right font-mono text-[var(--foreground)]">
                {result.sellPrice.toLocaleString("sv-SE")} kr
              </span>
              <span className="text-[var(--muted)]">Värdeförlust</span>
              <span className="text-right font-mono text-red-600">
                −{result.valueLoss.toLocaleString("sv-SE")} kr
              </span>
            </div>

            <div className="text-xs text-[var(--muted)] space-y-1 pt-2 border-t border-[var(--border)]">
              <div className="flex justify-between">
                <span>Försäkring ({scenario.holdingYears} år)</span>
                <span className="font-mono text-[var(--foreground)]">{result.insuranceTotal.toLocaleString("sv-SE")} kr</span>
              </div>
              <div className="flex justify-between">
                <span>Service</span>
                <span className="font-mono text-[var(--foreground)]">{result.serviceTotal.toLocaleString("sv-SE")} kr</span>
              </div>
              <div className="flex justify-between">
                <span>Reparation &amp; underhåll</span>
                <span className="font-mono text-[var(--foreground)]">{result.repairTotal.toLocaleString("sv-SE")} kr</span>
              </div>
              <div className="flex justify-between">
                <span>Fordonsskatt</span>
                <span className="font-mono text-[var(--foreground)]">{result.taxTotal.toLocaleString("sv-SE")} kr</span>
              </div>
              <div className="flex justify-between">
                <span>Drivmedel ({result.fuelCost.label})</span>
                <span className="font-mono text-[var(--foreground)]">{result.fuelCost.total.toLocaleString("sv-SE")} kr</span>
              </div>
              {result.capitalCost > 0 && (
                <div className="flex justify-between">
                  <span>Kapitalkostnad ({interestRate.toFixed(1)}%)</span>
                  <span className="font-mono text-[var(--foreground)]">{result.capitalCost.toLocaleString("sv-SE")} kr</span>
                </div>
              )}
              <p className="text-[10px] text-[var(--muted)] pt-0.5">
                Bensin {FUEL_PRICES.petrol} kr/l, diesel {FUEL_PRICES.diesel} kr/l, el {FUEL_PRICES.electricity} kr/kWh
              </p>
            </div>

            <div className="bg-white/60 p-4 sm:p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">Månadskostnad (värdeförlust)</span>
                <span className="font-mono font-semibold text-[var(--foreground)]">
                  {result.monthlyDepreciation.toLocaleString("sv-SE")} kr/mån
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">Månadskostnad (totalt)</span>
                <span className="font-mono font-bold text-[var(--foreground)]">
                  {result.monthlyTotal.toLocaleString("sv-SE")} kr/mån
                </span>
              </div>
              <div className="flex justify-between text-xs text-[var(--muted)]">
                <span>Kostnad per mil</span>
                <span className="font-mono">{result.costPerMil.toLocaleString("sv-SE")} kr/mil</span>
              </div>
            </div>
            <p className="text-xs text-[var(--muted)]">
              Estimatet träffar typiskt inom ±{((Math.exp(result.confidence) - 1) * 100).toFixed(0)}% — två bilar av tre hamnar där
            </p>
          </div>
        )}

        {/* Share card */}
        {result && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 sm:p-6 max-w-2xl">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-[var(--foreground)]/5 flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--foreground)]"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--foreground)]">
                  Dela beräkningen
                </p>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Skicka till din partner, kompis eller spara för senare. Länken öppnar exakt samma beräkning.
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={async () => {
                      const params = new URLSearchParams({
                        model: scenario.model,
                        fuel: scenario.fuel,
                        year: String(scenario.year),
                        mileage: String(scenario.mileage),
                        keep: String(scenario.holdingYears),
                        driving: String(scenario.annualMileage),
                      });
                      const url = `https://helanotan.se/tco?${params.toString()}`;
                      const modelLabel = modelConfig[scenario.model]?.label || scenario.model;
                      const fuelLabel = FUEL_LABELS[scenario.fuel] || scenario.fuel;
                      const text = `Kolla vad det kostar att äga en ${modelLabel} ${fuelLabel} ${scenario.year} — ${result.monthlyTotal.toLocaleString("sv-SE")} kr/mån totalt`;
                      if (navigator.share) {
                        try {
                          await navigator.share({ text, url });
                        } catch {
                          // User cancelled
                        }
                      } else {
                        await navigator.clipboard.writeText(url);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2500);
                      }
                    }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      copied
                        ? "bg-[var(--money)] text-white"
                        : "bg-[var(--foreground)] text-white hover:opacity-90"
                    }`}
                  >
                    {copied ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                        Länk kopierad!
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                        Dela
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
