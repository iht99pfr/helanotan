"use client";

import { getModelMeta } from "@/app/lib/model-config";
import type { ModelConfigMap } from "@/app/lib/model-config";

interface RegressionStats {
  r2: number;
  rmse: number;
  residual_se_log: number;
  log_transform: boolean;
  n_samples: number;
}

interface Summary {
  avgPrice?: number;
  count?: number;
}

interface Props {
  regression: Record<string, RegressionStats>;
  summary?: Record<string, Summary>;
  modelConfig: ModelConfigMap;
  selectedModels: Set<string>;
}

/**
 * These cards used to lead with R² and colour themselves by it, which inverted
 * the message they were trying to send. R² is the share of price variation the
 * model explains — a property of how varied the model's listings are, not of
 * how well it predicts one car. A VW Golf scored "Utmärkt" in green at 93% R²
 * while carrying a ±39% prediction interval; a Polestar 4 was flagged red at
 * 75% R² with a ±10% interval, i.e. four times more precise. The badge was
 * telling buyers the opposite of the truth.
 *
 * The number that answers "how much should I trust this?" is the prediction
 * interval, which the log fit gives directly as a proportion — so it converts
 * into kronor on an actual car. That is what leads now, and what the colour
 * follows.
 */
function intervalPct(stats: RegressionStats): number {
  return (Math.exp(1.96 * stats.residual_se_log) - 1) * 100;
}

function precisionColor(pct: number) {
  // Not green: precision is a quality scale, and green on this site
  // means kronor you keep. Ink for good, warm tones for worse.
  if (pct <= 15) return "text-[var(--foreground)]";
  if (pct <= 25) return "text-amber-800";
  return "text-red-700";
}

function precisionLabel(pct: number) {
  if (pct <= 15) return "Hög precision";
  if (pct <= 25) return "Medel";
  return "Låg precision";
}

const kr = (n: number) => Math.round(n).toLocaleString("sv-SE");

export default function StatsBadges({ regression, summary, modelConfig, selectedModels }: Props) {
  const filtered = Object.entries(regression).filter(([model]) => selectedModels.has(model));
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map(([model, stats]) => {
        const meta = getModelMeta(modelConfig, model);
        const pct = intervalPct(stats);
        const color = precisionColor(pct);
        const typical = summary?.[model]?.avgPrice;
        return (
          <div
            key={model}
            className={`bg-[var(--card)] border border-[var(--border)] border-l-4 ${meta.borderClass} rounded-lg p-4 hover:shadow-sm transition-shadow duration-200`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--muted)]">{meta.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full bg-white/60 ${color}`}>
                {precisionLabel(pct)}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold font-mono ${color}`}>
                ±{pct.toFixed(0)}%
              </span>
              <span className="text-xs text-[var(--muted)]">prisosäkerhet</span>
            </div>
            {typical ? (
              <p className="mt-1.5 text-sm text-[var(--foreground)]">
                På en bil för {kr(typical)} kr:{" "}
                <span className="font-mono font-semibold">±{kr((typical * pct) / 100)} kr</span>
              </p>
            ) : null}
            <p className="mt-1.5 text-xs text-[var(--muted)]">
              Byggd på {stats.n_samples.toLocaleString("sv-SE")} annonser. Enskilda
              bilar avviker mer — skick och servicehistorik syns inte i annonsen.
            </p>
          </div>
        );
      })}
    </div>
  );
}
