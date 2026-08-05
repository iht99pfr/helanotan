"use client";

import { useState, useMemo } from "react";
import { useCart, tableItemId, type CartItemFromTable } from "./CartContext";
import { track, priceBucket } from "@/app/lib/track";

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

function SaveButton({ car }: { car: Car }) {
  const { addItem, removeItem, isInCart } = useCart();
  const cartId = tableItemId(car.id);
  const inCart = isInCart(cartId);

  function toggle() {
    if (inCart) {
      removeItem(cartId);
    } else {
      const item: CartItemFromTable = {
        cartId,
        source: "table",
        modelKey: car.modelKey || "",
        modelLabel: `${car.make} ${car.model}`,
        blocketId: car.id,
        url: car.url,
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        mileage: car.mileage,
        fuel: car.fuel,
        hp: car.hp,
        seller: car.seller,
        predicted: car.predicted ?? undefined,
        residual: car.residual ?? undefined,
        deal: car.deal,
        addedAt: Date.now(),
      };
      addItem(item);
    }
  }

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }}
      className={`p-1 rounded transition ${inCart ? "text-amber-500" : "text-[var(--muted)] hover:text-amber-400"}`}
      title={inCart ? "Ta bort ur köpkorg" : "Spara i köpkorg"}
    >
      <svg width={18} height={18} viewBox="0 0 24 24" fill={inCart ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
      </svg>
    </button>
  );
}

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
            <div className="absolute top-2 right-2 z-10">
              <SaveButton car={car} />
            </div>
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
            {car.deal && (
              <div className="mt-1.5">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  car.deal === "great"
                    ? "bg-green-100 text-green-700"
                    : "bg-green-50 text-green-800"
                }`}>
                  {car.deal === "great" ? "Fyndpris" : "Bra pris"} −{Math.abs(car.residual!).toLocaleString("sv-SE")} kr
                </span>
              </div>
            )}
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
                  {car.deal === "great" && (
                    <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold whitespace-nowrap">
                      −{Math.abs(car.residual!).toLocaleString("sv-SE")} kr
                    </span>
                  )}
                  {car.deal === "good" && (
                    <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-800 whitespace-nowrap">
                      −{Math.abs(car.residual!).toLocaleString("sv-SE")} kr
                    </span>
                  )}
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
                <td className="px-3 py-2 text-center">
                  <SaveButton car={car} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
