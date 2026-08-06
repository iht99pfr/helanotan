"use client";

import { useState, useMemo } from "react";
import { track, priceBucket } from "@/app/lib/track";
import { dealBadge, type Deal } from "@/app/lib/deal-format";

interface Car {
  id: string;
  url: string;
  make: string;
  model: string;
  modelKey?: string;
  year: number;
  age: number;
  price: number;
  mileage: number;
  fuel: string;
  hp: number;
  seller: string;
  color: string;
  drivetrain: string;
  equipmentCount: number;
  predicted: number | null;
  residual: number | null;
  deal: string | null;
}

interface Props {
  cars: Car[];
  total: number;
  sortKey: SortKey;
  sortDir: "asc" | "desc";
  onSort: (key: SortKey) => void;
}

export type SortKey = "price" | "year" | "mileage" | "hp" | "deal";

/** The north-star event: someone left here holding a specific car. */
function trackListingClick(car: Car, source: "table_row" | "table_card") {
  track("listing_click", {
    model: car.modelKey ?? `${car.make} ${car.model}`,
    source,
    deal: car.deal ?? "none",
    price: priceBucket(car.price),
    year: car.year,
  });
}

const FUEL_LABELS: Record<string, string> = {
  Hybrid: "Hybrid",
  PHEV: "Laddhybrid",
  Diesel: "Diesel",
  Petrol: "Bensin",
  Electric: "El",
};

export default function DataTable({ cars, total, sortKey, sortDir, onSort }: Props) {
  // Rows arrive already sorted by the database. Re-sorting here would only
  // reorder the current page — which is what made every column header a lie.
  const sorted = cars;

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <span className="text-[var(--muted)] ml-1">↕</span>;
    return <span className="text-[var(--foreground)] ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <span className="text-[var(--muted)] text-sm self-center">
          {total.toLocaleString("sv-SE")} bilar
        </span>
      </div>

      {/* Mobile card view */}
      <div className="sm:hidden space-y-2">
        {sorted.map((car) => (
          <div
            key={car.id}
            className={`relative p-3 border border-[var(--border)] rounded-lg transition ${
              car.deal === "great" ? "bg-green-50/60" : car.deal === "good" ? "bg-green-50/30" : ""
            }`}
          >
            <a
              href={car.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackListingClick(car, "table_card")}
              className="block active:bg-[var(--card)]"
            >
            <div className="flex justify-between items-start pr-8">
              <span className="font-medium text-sm text-[var(--foreground)]">{car.make} {car.model}</span>
              <span className="font-mono font-semibold text-sm text-[var(--foreground)]">
                {car.price.toLocaleString("sv-SE")} kr
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-[var(--muted)]">
              <span>{car.year}</span>
              <span>·</span>
              <span>{car.mileage.toLocaleString("sv-SE")} mil</span>
              <span>·</span>
              <span>{car.hp} hk</span>
              <span
                className={`px-1.5 py-0.5 rounded-full ${
                  car.fuel === "Hybrid"
                    ? "bg-green-100 text-green-700"
                    : car.fuel === "PHEV"
                    ? "bg-blue-100 text-blue-700"
                    : car.fuel === "Diesel"
                    ? "bg-amber-100 text-amber-700"
                    : car.fuel === "Electric"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-stone-100 text-stone-600"
                }`}
              >
                {FUEL_LABELS[car.fuel] || car.fuel}
              </span>
            </div>
            {(() => {
              const badge = dealBadge(car.price, car.predicted, car.residual, car.deal as Deal);
              if (!badge) return null;
              return (
                <div className="mt-1.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    car.deal === "great"
                      ? "bg-green-100 text-green-700"
                      : "bg-green-50 text-green-800"
                  }`}>
                    {badge.headline}
                    {badge.detail && <span className="font-normal"> · −{badge.detail}</span>}
                  </span>
                </div>
              );
            })()}
            </a>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden sm:block overflow-x-auto border border-[var(--border)] rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-[var(--card)] text-[var(--muted)]">
            <tr>
              <th className="px-3 py-2 text-left">Märke / Modell</th>
              <th
                className="px-3 py-2 text-right cursor-pointer hover:text-[var(--foreground)]"
                onClick={() => onSort("year")}
              >
                Årsmodell <SortIcon col="year" />
              </th>
              <th
                className="px-3 py-2 text-right cursor-pointer hover:text-[var(--foreground)]"
                onClick={() => onSort("price")}
              >
                Pris <SortIcon col="price" />
              </th>
              <th
                className="px-3 py-2 text-right cursor-pointer hover:text-[var(--foreground)]"
                onClick={() => onSort("deal")}
              >
                Fynd <SortIcon col="deal" />
              </th>
              <th
                className="px-3 py-2 text-right cursor-pointer hover:text-[var(--foreground)]"
                onClick={() => onSort("mileage")}
              >
                Miltal <SortIcon col="mileage" />
              </th>
              <th className="px-3 py-2 text-left">Bränsle</th>
              <th
                className="px-3 py-2 text-right cursor-pointer hover:text-[var(--foreground)]"
                onClick={() => onSort("hp")}
              >
                HK <SortIcon col="hp" />
              </th>
              <th className="px-3 py-2 text-left hidden sm:table-cell">Säljare</th>
              <th className="px-3 py-2 text-center">Länk</th>
              <th className="px-3 py-2 text-center w-10"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((car) => (
              <tr
                key={car.id}
                className={`border-t border-[var(--border)] hover:bg-[var(--card)]/50 transition ${
                  car.deal === "great" ? "bg-green-50/60" : car.deal === "good" ? "bg-green-50/30" : ""
                }`}
              >
                <td className="px-3 py-2 font-medium text-[var(--foreground)]">
                  {car.make} {car.model}
                </td>
                <td className="px-3 py-2 text-right font-mono text-[var(--foreground)]">{car.year}</td>
                <td className="px-3 py-2 text-right font-mono font-semibold text-[var(--foreground)]">
                  {car.price.toLocaleString("sv-SE")} kr
                </td>
                <td className="px-3 py-2 text-right">
                  {(() => {
                    const badge = dealBadge(car.price, car.predicted, car.residual, car.deal as Deal);
                    if (!badge) return null;
                    return (
                      <span
                        title={badge.detail ? `${badge.detail} under prisestimatet` : undefined}
                        className={`inline-block text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                          car.deal === "great"
                            ? "bg-green-100 text-green-700 font-semibold"
                            : "bg-green-50 text-green-800"
                        }`}
                      >
                        {badge.headline}
                      </span>
                    );
                  })()}
                </td>
                <td className="px-3 py-2 text-right font-mono text-[var(--foreground)]">
                  {car.mileage.toLocaleString("sv-SE")} mil
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      car.fuel === "Hybrid"
                        ? "bg-green-100 text-green-700"
                        : car.fuel === "PHEV"
                        ? "bg-blue-100 text-blue-700"
                        : car.fuel === "Diesel"
                        ? "bg-amber-100 text-amber-700"
                        : car.fuel === "Electric"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {FUEL_LABELS[car.fuel] || car.fuel}
                  </span>
                </td>
                <td className="px-3 py-2 text-right font-mono text-[var(--foreground)]">{car.hp}</td>
                <td className="px-3 py-2 text-xs text-[var(--muted)] hidden sm:table-cell">
                  {car.seller === "dealer" ? "Handlare" : "Privat"}
                </td>
                <td className="px-3 py-2 text-center">
                  <a
                    href={car.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackListingClick(car, "table_row")}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Blocket
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
