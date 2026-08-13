"use client";

import { useState, useEffect, useMemo } from "react";
import { useModelSelection } from "./ModelSelectionContext";
import DataTable from "./DataTable";
import type { SortKey } from "./DataTable";
import DealAlertSignup from "./DealAlertSignup";
import { track } from "@/app/lib/track";

const FUEL_KEY_MAP: Record<string, string> = {
  Bensin: "Petrol",
  Hybrid: "Hybrid",
  Laddhybrid: "PHEV",
  Diesel: "Diesel",
  El: "Electric",
};

interface CarsResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cars: any[];
  total: number;
  page: number;
  pages: number;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 2004 }, (_, i) => CURRENT_YEAR - i);

export default function DataTableSection() {
  const { selectedModels, fuelFilter } = useModelSelection();
  const [data, setData] = useState<CarsResponse | null>(null);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("price");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [dealFilter, setDealFilter] = useState<string>(""); // "", "any", "great", "good"
  const [yearMin, setYearMin] = useState(0);
  const [yearMax, setYearMax] = useState(0);
  const [seller, setSeller] = useState(""); // "", "private", "dealer"
  const [priceMax, setPriceMax] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const limit = 30;

  const handleSort = (key: SortKey) => {
    track("table_sort", { column: key });
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "deal" ? "asc" : "asc");
    }
  };

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    const models = [...selectedModels].join(",");
    if (models) params.set("models", models);
    const fuelKey = FUEL_KEY_MAP[fuelFilter];
    if (fuelKey) params.set("fuel", fuelKey);
    // All sorting is server-side. Sorting a 30-row page client-side reorders
    // the wrong 30 rows out of several thousand.
    if (sortKey === "deal") {
      params.set("sort", "deal");
    } else {
      params.set("sortKey", sortKey);
      params.set("sortDir", sortDir);
    }
    if (dealFilter) params.set("deal", dealFilter);
    if (yearMin) params.set("yearMin", String(yearMin));
    if (yearMax) params.set("yearMax", String(yearMax));
    if (seller) params.set("seller", seller);
    if (priceMax) params.set("priceMax", String(priceMax));
    return params.toString();
  }, [page, selectedModels, fuelFilter, sortKey, dealFilter, yearMin, yearMax, seller, priceMax]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedModels, fuelFilter, dealFilter, yearMin, yearMax, seller, priceMax]);

  useEffect(() => {
    setData(null);
    fetch(`/api/cars?${queryString}`)
      .then((r) => r.json())
      .then(setData);
  }, [queryString]);

  if (!data) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-10 bg-[var(--border)] rounded" />
        ))}
      </div>
    );
  }

  const dealButtons: { key: string; label: string; color: string; activeColor: string }[] = [
    { key: "", label: "Alla", color: "bg-[var(--card)] text-[var(--muted)]", activeColor: "bg-[var(--foreground)] text-white" },
    { key: "any", label: "Alla fynd", color: "bg-[var(--card)] text-[var(--muted)]", activeColor: "bg-[var(--money)] text-white" },
    { key: "great", label: "Fyndpris", color: "bg-[var(--card)] text-[var(--muted)]", activeColor: "bg-[var(--money)] text-white" },
    { key: "good", label: "Bra pris", color: "bg-[var(--card)] text-[var(--muted)]", activeColor: "bg-[var(--money)]/80 text-white" },
  ];

  const activeFilterCount = [yearMin, yearMax, seller, priceMax].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        {dealButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => {
              setDealFilter(btn.key);
              track("deal_filter", { value: btn.key || "all", source: "table" });
              if (btn.key) {
                setSortKey("deal");
                setSortDir("asc");
              }
            }}
            className={`px-3 py-2.5 sm:py-1.5 rounded-full text-sm font-medium transition ${
              dealFilter === btn.key ? btn.activeColor : btn.color
            } border border-[var(--border)] hover:opacity-80`}
          >
            {btn.label}
          </button>
        ))}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-3 py-2.5 sm:py-1.5 rounded-full text-sm font-medium transition border border-[var(--border)] hover:opacity-80 ${
            showFilters || activeFilterCount > 0
              ? "bg-[var(--foreground)] text-white"
              : "bg-[var(--card)] text-[var(--muted)]"
          }`}
        >
          Filtrera{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </button>
      </div>

      {/* Expandable filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 items-end p-3 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          {/* Year range */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-[var(--muted)]">Årsmodell</label>
            <select
              value={yearMin || ""}
              onChange={(e) => setYearMin(Number(e.target.value) || 0)}
              className="bg-white border border-[var(--border)] px-2 py-1.5 text-sm rounded-lg"
            >
              <option value="">Från</option>
              {YEAR_OPTIONS.map((y) => (
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
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Seller type */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-[var(--muted)]">Säljare</label>
            <div className="flex gap-1">
              {[
                { key: "", label: "Alla" },
                { key: "private", label: "Privat" },
                { key: "dealer", label: "Handlare" },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSeller(s.key)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition border ${
                    seller === s.key
                      ? "bg-[var(--foreground)] text-white border-[var(--foreground)]"
                      : "bg-white text-[var(--muted)] border-[var(--border)]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Max price */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-[var(--muted)]">Max pris</label>
            <input
              type="number"
              placeholder="t.ex. 300000"
              value={priceMax || ""}
              onChange={(e) => setPriceMax(Number(e.target.value) || 0)}
              className="bg-white border border-[var(--border)] px-2 py-1.5 text-sm rounded-lg w-28"
            />
            {priceMax > 0 && <span className="text-xs text-[var(--muted)]">kr</span>}
          </div>

          {/* Clear filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={() => { setYearMin(0); setYearMax(0); setSeller(""); setPriceMax(0); }}
              className="text-xs text-red-500 hover:text-red-700 transition px-2 py-1.5"
            >
              Rensa filter
            </button>
          )}
        </div>
      )}

      <DealAlertSignup dealFilter={dealFilter} />

      {/* Mobile sort dropdown */}
      <div className="sm:hidden">
        <select
          aria-label="Sortera efter"
          value={`${sortKey}-${sortDir}`}
          onChange={(e) => {
            const [key, dir] = e.target.value.split("-") as [SortKey, "asc" | "desc"];
            setSortKey(key);
            setSortDir(dir);
          }}
          className="w-full bg-white border border-[var(--border)] px-3 py-2.5 text-sm text-[var(--muted)] rounded-lg"
        >
          <option value="price-asc">Pris (lägst först)</option>
          <option value="price-desc">Pris (högst först)</option>
          <option value="year-desc">Årsmodell (nyast)</option>
          <option value="year-asc">Årsmodell (äldst)</option>
          <option value="mileage-asc">Miltal (lägst)</option>
          <option value="deal-asc">Bästa fynd</option>
        </select>
      </div>

      <DataTable cars={data.cars} total={data.total} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />

      {/* Pagination */}
      {data.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-lg text-sm border border-[var(--border)] text-[var(--muted)] hover:border-[var(--muted)] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Föregående
          </button>
          <span className="text-sm text-[var(--muted)]">
            Sida {data.page} av {data.pages} ({data.total} bilar)
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
            disabled={page >= data.pages}
            className="px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-lg text-sm border border-[var(--border)] text-[var(--muted)] hover:border-[var(--muted)] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Nästa
          </button>
        </div>
      )}
    </div>
  );
}
