"use client";

import { track, priceBucket } from "@/app/lib/track";
import type { DealRow } from "@/app/lib/model-page";

const FUEL_LABELS: Record<string, string> = {
  Hybrid: "Hybrid", PHEV: "Laddhybrid", Diesel: "Diesel",
  Petrol: "Bensin", Electric: "El",
};

const kr = (n: number) => n.toLocaleString("sv-SE");

/**
 * The list is a client component purely so the outbound click can be counted.
 * Everything it renders is already in the server-sent HTML above it.
 */
export default function DealList({ deals, modelKey, label }: {
  deals: DealRow[]; modelKey: string; label: string;
}) {
  return (
    <ul className="space-y-2">
      {deals.map((d) => (
        <li key={d.id}>
          <a
            href={d.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              track("listing_click", {
                model: modelKey,
                source: "model_page",
                deal: d.deal,
                price: priceBucket(d.price),
                year: d.year,
              })
            }
            className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 p-3 rounded-lg border transition hover:border-[var(--muted)] ${
              d.deal === "great"
                ? "border-[var(--money)]/30 bg-[var(--money-soft)]"
                : "border-[var(--border)] bg-[var(--money-faint)]"
            }`}
          >
            <span className="font-medium text-[var(--foreground)]">
              {label} {d.year}
            </span>
            <span className="font-mono font-semibold text-[var(--foreground)]">
              {kr(d.price)} kr
            </span>
            {/* Skip the parts we do not actually know rather than printing
                "0 hk" or the internal "Other" bucket at a reader. */}
            <span className="text-sm text-[var(--muted)]">
              {[
                `${kr(d.mileage)} mil`,
                FUEL_LABELS[d.fuel],
                d.hp > 0 ? `${d.hp} hk` : null,
                d.seller === "dealer" ? "Handlare" : "Privat",
              ]
                .filter(Boolean)
                .join(" · ")}
            </span>
            <span className="ml-auto text-sm font-mono font-semibold text-[var(--money)]">
              {kr(Math.abs(d.residual))} kr under estimat
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
