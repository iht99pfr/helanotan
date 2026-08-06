"use client";

import Link from "next/link";
import { track, priceBucket } from "@/app/lib/track";
import type { TopDeal } from "@/app/lib/model-page";

const FUEL_LABELS: Record<string, string> = {
  Hybrid: "Hybrid", PHEV: "Laddhybrid", Diesel: "Diesel",
  Petrol: "Bensin", Electric: "El",
};

const kr = (n: number) => Math.round(n).toLocaleString("sv-SE");

/**
 * Client-side only so the outbound click can be counted — every figure it
 * renders was computed on the server and is already in the HTML.
 */
export default function TopDeals({ deals }: { deals: TopDeal[] }) {
  if (!deals.length) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {deals.map((d) => (
        <div
          key={d.id}
          className="border border-[var(--border)] rounded-lg p-4 bg-[var(--money-faint)] flex flex-col gap-2"
        >
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-medium text-[var(--foreground)]">
              {d.label} {d.year}
            </span>
            <span className="font-mono text-sm font-semibold text-[var(--money)] whitespace-nowrap">
              {d.pctUnder}% under
            </span>
          </div>
          <div className="font-mono text-2xl font-semibold text-[var(--foreground)]">
            {kr(d.price)} kr
          </div>
          <div className="text-sm text-[var(--muted)]">
            {[
              `${kr(d.mileage)} mil`,
              FUEL_LABELS[d.fuel],
              d.hp > 0 ? `${d.hp} hk` : null,
              d.seller === "dealer" ? "Handlare" : "Privat",
            ].filter(Boolean).join(" · ")}
          </div>
          <div className="text-sm text-[var(--muted)]">
            Prisestimat{" "}
            <span className="font-mono text-[var(--foreground)]">{kr(d.predicted)} kr</span>
            {" "}· {kr(Math.abs(d.residual))} kr lägre
          </div>
          <div className="flex gap-2 mt-auto pt-2">
            <a
              href={d.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                track("listing_click", {
                  model: d.modelKey, source: "home_deals", deal: "great",
                  price: priceBucket(d.price), year: d.year,
                })
              }
              className="flex-1 text-center text-sm font-medium py-2 rounded-lg bg-[var(--foreground)] text-white hover:opacity-90 transition"
            >
              Visa annonsen
            </a>
            <Link
              href={`/bilar/${d.slug}`}
              className="text-center text-sm py-2 px-3 rounded-lg border border-[var(--border)] hover:border-[var(--muted)] transition"
            >
              Om modellen
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
