"use client";

import { track, priceBucket } from "@/app/lib/track";
import { priceBreakdown } from "@/app/lib/price-breakdown";
import type { RegressionModel } from "@/app/lib/predict";

interface ScatterPoint {
  /** Blocket listing id. Present only for ads that are still live. */
  id?: string;
  age: number;
  price: number;
  mileage: number;
  year: number;
  fuel: string;
  hp: number;
  seller: string;
  predicted?: number;
  deal?: "good" | "great";
}

const FUEL_LABELS: Record<string, string> = {
  Hybrid: "Hybrid",
  PHEV: "Laddhybrid",
  Diesel: "Diesel",
  Petrol: "Bensin",
  Electric: "El",
};

const displayName = (key: string) => key.replace(/([a-z0-9])([A-Z])/g, "$1 $2");

interface Props {
  point: ScatterPoint | null;
  modelKey: string;
  modelLabel: string;
  regression?: RegressionModel;
  onClose: () => void;
}

const kr = (n: number) => Math.round(n).toLocaleString("sv-SE");

export default function CarDetailModal({ point, modelKey, modelLabel, regression, onClose }: Props) {
  if (!point) return null;

  // Why this car costs what it costs. The estimate is a sum of coefficients,
  // so the model already knows — it was simply never asked.
  // price - predicted, computed here rather than shipped for every point.
  const residual = point.predicted != null ? point.price - point.predicted : null;

  const breakdown = priceBreakdown(regression, {
    age: point.age, mileage: point.mileage, fuel: point.fuel,
    hp: point.hp, seller: point.seller, predicted: point.predicted,
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-lg border border-[var(--border)] max-w-sm w-full p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-[var(--foreground)]">{modelLabel}</h3>
            <p className="text-sm text-[var(--muted)]">{point.year} &middot; {FUEL_LABELS[point.fuel] || point.fuel}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--muted)] hover:text-[var(--foreground)] transition p-1"
          >
            <svg width={20} height={20} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-[var(--muted)]">Pris</span>
            <p className="font-mono font-semibold text-[var(--foreground)]">{point.price.toLocaleString("sv-SE")} kr</p>
          </div>
          <div>
            <span className="text-[var(--muted)]">Miltal</span>
            <p className="font-mono text-[var(--foreground)]">{point.mileage.toLocaleString("sv-SE")} mil</p>
          </div>
          <div>
            <span className="text-[var(--muted)]">Hästkrafter</span>
            <p className="font-mono text-[var(--foreground)]">{point.hp} hk</p>
          </div>
          <div>
            <span className="text-[var(--muted)]">Säljare</span>
            <p className="text-[var(--foreground)]">{point.seller === "dealer" ? "Handlare" : "Privat"}</p>
          </div>
          <div>
            <span className="text-[var(--muted)]">Ålder</span>
            <p className="font-mono text-[var(--foreground)]">
              {point.age.toLocaleString("sv-SE", { maximumFractionDigits: 1 })} år
            </p>
          </div>
        </div>

        {/* One estimate, named once.
         *
         * This block used to head "Predikterat pris" while the breakdown below
         * ended in "Prisestimat", with different numbers under each — the same
         * quantity given two names and two values. There is one estimate; what
         * changes is whether the seller is asking more or less than it. */}
        {point.predicted != null && (
          <div className="bg-[var(--card)] rounded-lg p-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)]">Prisestimat</span>
              <span className="font-mono text-[var(--foreground)]">
                {kr(point.predicted)} kr
              </span>
            </div>
            {residual != null && Math.abs(residual) >= 500 && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">
                  Begärt pris ligger
                </span>
                <span className={`font-mono font-semibold ${
                  residual < 0 ? "text-[var(--money)]" : "text-[var(--foreground)]"
                }`}>
                  {kr(Math.abs(residual))} kr {residual < 0 ? "under" : "över"}
                </span>
              </div>
            )}
            {point.deal && (
              <div className="pt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  point.deal === "great"
                    ? "bg-[var(--money-soft)] text-[var(--money)]"
                    : "bg-[var(--money-faint)] text-[var(--money-mid)]"
                }`}>
                  {point.deal === "great" ? "Fyndpris" : "Bra pris"}
                </span>
              </div>
            )}
          </div>
        )}

        {breakdown && breakdown.steps.length > 0 && (
          <div data-testid="price-breakdown"
               data-base={breakdown.base}
               data-predicted={breakdown.predicted}
               className="border-t border-[var(--border)] pt-3 space-y-1.5">
            <p className="text-xs font-semibold text-[var(--foreground)]">
              Varför modellen räknar så här
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)]">
                Typisk {modelLabel}, {point.age} år
              </span>
              <span className="font-mono text-[var(--foreground)]">{kr(breakdown.base)} kr</span>
            </div>
            {breakdown.steps.map((s) => (
              <div key={s.label} data-delta={Math.round(s.delta)}
                   className="flex justify-between gap-3 text-sm">
                <span className="text-[var(--muted)] min-w-0">
                  {s.label}
                  <span className="block text-xs opacity-80">{s.detail}</span>
                </span>
                <span className={`font-mono whitespace-nowrap ${
                  s.delta > 0 ? "text-[var(--foreground)]" : "text-[var(--money)]"
                }`}>
                  {s.delta > 0 ? "+" : "−"}{kr(Math.abs(s.delta))} kr
                </span>
              </div>
            ))}
            <div className="flex justify-between text-sm border-t border-[var(--border)] pt-1.5">
              <span className="text-[var(--foreground)] font-medium">Summa prisestimat</span>
              <span className="font-mono font-semibold text-[var(--foreground)]">
                {kr(breakdown.predicted)} kr
              </span>
            </div>
          </div>
        )}

        {/* One action. The cart that used to sit above this was localStorage
            with no reminder and no way back — it competed for attention with
            the only thing that matters here, which is reaching the car. */}
        <div>
          {/* A dot that says "171 504 kr under predikterat" used to lead only
              to a Blocket search for the model and year — the strongest moment
              in the product dead-ended, and outbound clicks fired in 2 of 121
              sessions. Live ads now link to the car itself. */}
          <a
            href={
              point.id
                ? `https://www.blocket.se/mobility/item/${point.id}`
                : `https://www.blocket.se/annonser/hela_sverige/fordon/bilar?q=${encodeURIComponent(modelLabel)}&cg=1020&mys=${point.year}&mye=${point.year}`
            }
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              track("listing_click", {
                model: modelKey,
                source: point.id ? "scatter_dot" : "scatter_dot_search",
                deal: point.deal ?? "none",
                price: priceBucket(point.price),
                year: point.year,
              })
            }
            className={`block w-full py-2.5 rounded-lg text-sm font-medium text-center transition ${
              point.id
                ? "bg-[var(--foreground)] text-white hover:opacity-90"
                : "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--card)]"
            }`}
          >
            {point.id ? "Visa annonsen på Blocket" : "Sök liknande på Blocket"}
          </a>
        </div>
      </div>
    </div>
  );
}
