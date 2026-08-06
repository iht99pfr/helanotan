"use client";

import { useEffect, useState } from "react";
import { COST_PROFILES, FUEL_PROFILES, FUEL_PRICES } from "@/app/lib/tco-costs";
import type { ModelConfigMap } from "@/app/lib/model-config";
import { getModelMeta } from "@/app/lib/model-config";

interface RegressionStats {
  r2: number;
  rmse: number;
  residual_se_log: number;
  log_transform: boolean;
  n_samples: number;
  features: string[];
}

interface ModelStats {
  total: number;
  active: number;
  lastScraped: string | null;
}

const FUEL_LABELS: Record<string, string> = {
  Hybrid: "Hybrid",
  PHEV: "Laddhybrid",
  Diesel: "Diesel",
  Petrol: "Bensin",
  Electric: "El",
};

function qualityLabel(r2: number) {
  if (r2 >= 0.95) return { text: "Utmärkt", cls: "bg-[var(--money-soft)] text-[var(--money)]" };
  if (r2 >= 0.9) return { text: "Mycket bra", cls: "bg-[var(--money-soft)] text-[var(--money)]" };
  if (r2 >= 0.8) return { text: "Bra", cls: "bg-amber-100 text-amber-700" };
  return { text: "Måttlig", cls: "bg-red-100 text-red-700" };
}

function formatBrackets(brackets: [number, number][]): string {
  return brackets
    .map(([upTo, cost]) => `${upTo >= 99 ? "13+" : `0–${upTo}`} år: ${cost.toLocaleString("sv-SE")} kr`)
    .join(" → ");
}

function formatDate(iso: string | null) {
  if (!iso) return "–";
  return new Date(iso).toLocaleDateString("sv-SE", { year: "numeric", month: "short", day: "numeric" });
}

export default function ModelDataPage() {
  const [modelConfig, setModelConfig] = useState<ModelConfigMap>({});
  const [regression, setRegression] = useState<Record<string, RegressionStats>>({});
  const [modelStats, setModelStats] = useState<Record<string, ModelStats>>({});
  const [lastModelUpdate, setLastModelUpdate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/aggregates").then((r) => r.json()),
      fetch("/api/model-stats").then((r) => r.json()),
    ]).then(([agg, stats]) => {
      setModelConfig(agg.modelConfig || {});
      setRegression(agg.regression || {});
      setModelStats(stats.stats || {});
      setLastModelUpdate(stats.lastModelUpdate);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse h-8 bg-[var(--border)] rounded w-1/3" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse h-48 bg-[var(--border)] rounded" />
        ))}
      </div>
    );
  }

  const models = Object.keys(modelConfig).sort((a, b) => {
    const la = modelConfig[a]?.label || a;
    const lb = modelConfig[b]?.label || b;
    return la.localeCompare(lb, "sv");
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">Modelldata</h1>
        <p className="text-[var(--muted)] text-sm mt-1">
          Input-data, precision och kostnadsantaganden per bilmodell. Senaste uppdatering: {formatDate(lastModelUpdate)}.
        </p>
      </div>

      {/* Overview table */}
      <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-[var(--card)] text-[var(--muted)]">
            <tr>
              <th className="px-3 py-2 text-left">Modell</th>
              <th className="px-3 py-2 text-right">R²</th>
              <th className="px-3 py-2 text-right">RMSE</th>
              <th className="px-3 py-2 text-right">Datapunkter</th>
              <th className="px-3 py-2 text-right">Aktiva</th>
              <th className="px-3 py-2 text-left">Drivmedel</th>
            </tr>
          </thead>
          <tbody>
            {models.map((key) => {
              const meta = getModelMeta(modelConfig, key);
              const reg = regression[key];
              const stats = modelStats[key];
              const quality = reg ? qualityLabel(reg.r2) : null;
              const fuelOptions = modelConfig[key]?.fuelOptions || [];
              return (
                <tr key={key} className="border-t border-[var(--border)] hover:bg-[var(--card)]/50">
                  <td className="px-3 py-2 font-medium text-[var(--foreground)]">
                    <a href={`#${key}`} className="hover:underline">{meta.label}</a>
                  </td>
                  <td className="px-3 py-2 text-right">
                    {reg && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono font-semibold ${quality!.cls}`}>
                        {(reg.r2 * 100).toFixed(1)}%
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-[var(--foreground)]">
                    {reg ? `${(reg.rmse / 1000).toFixed(0)}k kr` : "–"}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-[var(--foreground)]">
                    {stats?.total?.toLocaleString("sv-SE") || "–"}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-[var(--foreground)]">
                    {stats?.active?.toLocaleString("sv-SE") || "–"}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {fuelOptions.map((f: string) => (
                        <span key={f} className="text-xs px-1.5 py-0.5 rounded-full bg-[var(--card)] text-[var(--muted)] border border-[var(--border)]">
                          {FUEL_LABELS[f] || f}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Per-model detail cards */}
      {models.map((key) => {
        const meta = getModelMeta(modelConfig, key);
        const reg = regression[key];
        const stats = modelStats[key];
        const costs = COST_PROFILES[key];
        const fuels = FUEL_PROFILES[key];
        const quality = reg ? qualityLabel(reg.r2) : null;

        return (
          <section
            key={key}
            id={key}
            className={`bg-[var(--card)] border border-[var(--border)] border-l-4 ${meta.borderClass} rounded-lg p-5 space-y-4`}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--foreground)]">{meta.label}</h2>
              {quality && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${quality.cls}`}>
                  {quality.text}
                </span>
              )}
            </div>

            {/* Regression stats */}
            {reg && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-[var(--muted)] text-xs">R²-precision</span>
                  <p className="font-mono font-bold text-lg text-[var(--foreground)]">{(reg.r2 * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <span className="text-[var(--muted)] text-xs">RMSE</span>
                  <p className="font-mono font-semibold text-[var(--foreground)]">{(reg.rmse / 1000).toFixed(0)}k kr</p>
                </div>
                <div>
                  <span className="text-[var(--muted)] text-xs">Datapunkter (regression)</span>
                  <p className="font-mono font-semibold text-[var(--foreground)]">{reg.n_samples.toLocaleString("sv-SE")}</p>
                </div>
                <div>
                  <span className="text-[var(--muted)] text-xs">95% KI</span>
                  <p className="font-mono font-semibold text-[var(--foreground)]">
                    ±{((Math.exp(1.96 * reg.residual_se_log) - 1) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            )}

            {/* Car counts */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-[var(--muted)] text-xs">Bilar i databasen</span>
                  <p className="font-mono font-semibold text-[var(--foreground)]">{stats.total.toLocaleString("sv-SE")}</p>
                </div>
                <div>
                  <span className="text-[var(--muted)] text-xs">Till salu just nu</span>
                  <p className="font-mono font-semibold text-[var(--foreground)]">{stats.active.toLocaleString("sv-SE")}</p>
                </div>
                <div>
                  <span className="text-[var(--muted)] text-xs">Senast scrapead</span>
                  <p className="text-[var(--foreground)] text-sm">{formatDate(stats.lastScraped)}</p>
                </div>
              </div>
            )}

            {/* Cost assumptions */}
            {costs && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[var(--foreground)]">Kostnadsantaganden (TCO)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-[var(--muted)]">Service</span>
                      <p className="text-[var(--foreground)]">{formatBrackets(costs.service)}</p>
                    </div>
                    <div>
                      <span className="text-[var(--muted)]">Reparation</span>
                      <p className="text-[var(--foreground)]">{formatBrackets(costs.repair)}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-[var(--muted)]">Försäkring</span>
                      <p className="text-[var(--foreground)]">{formatBrackets(costs.insurance)}</p>
                    </div>
                    <div>
                      <span className="text-[var(--muted)]">Fordonsskatt (per år)</span>
                      <div className="flex flex-wrap gap-2 mt-0.5">
                        {Object.entries(costs.tax).map(([fuel, amount]) => (
                          <span key={fuel} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white border border-[var(--border)]">
                            <span className="text-[var(--muted)]">{FUEL_LABELS[fuel] || fuel}:</span>
                            <span className="font-mono text-[var(--foreground)]">{amount.toLocaleString("sv-SE")} kr</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Fuel consumption */}
            {fuels && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[var(--foreground)]">Bränsleförbrukning (verklig)</h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  {Object.entries(fuels).map(([fuel, profile]) => (
                    <div key={fuel} className="px-2.5 py-1.5 rounded-lg bg-white border border-[var(--border)] space-y-0.5">
                      <span className="font-medium text-[var(--foreground)]">{FUEL_LABELS[fuel] || fuel}</span>
                      <div className="text-[var(--muted)]">
                        {profile.fuelL100km && (
                          <span>{profile.fuelL100km} l/100km</span>
                        )}
                        {profile.elKWh100km && (
                          <span>{profile.fuelL100km ? " + " : ""}{profile.elKWh100km} kWh/100km</span>
                        )}
                        {profile.electricShare > 0 && profile.electricShare < 1 && (
                          <span> ({Math.round(profile.electricShare * 100)}% el)</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        );
      })}

      {/* Methodology footer */}
      <section className="bg-[var(--card)] p-5 border border-[var(--border)] rounded-lg text-sm text-[var(--muted)] space-y-2">
        <h2 className="text-[var(--foreground)] font-semibold">Om beräkningarna</h2>
        <p>
          Regressionsmodellen är log-transformerad multivariat med 15+ variabler: bilålder, miltal, hästkrafter,
          utrustningsantal, bränsletyp, säljartyp, drivlina, WLTP-räckvidd, generation, premiumutrustning
          samt interaktionstermer.
        </p>
        <p>
          Service- och reparationskostnader baseras på svenska marknadsuppskattningar per märke och ålder.
          Försäkring avser helförsäkring för nyare bilar och halvförsäkring för äldre.
          Bränslepriser: bensin {FUEL_PRICES.petrol} kr/l, diesel {FUEL_PRICES.diesel} kr/l, el {FUEL_PRICES.electricity} kr/kWh.
        </p>
      </section>
    </div>
  );
}
