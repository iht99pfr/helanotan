"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useModelSelection } from "./ModelSelectionContext";
import { getModelMeta } from "@/app/lib/model-config";

/* ─── Inline SVG brand logos (monochrome, 24×24 viewBox) ─── */

function BmwLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="0.75" />
      <line x1="12" y1="1.5" x2="12" y2="22.5" stroke="currentColor" strokeWidth="0.75" />
      <line x1="1.5" y1="12" x2="22.5" y2="12" stroke="currentColor" strokeWidth="0.75" />
      <path d="M12 4.5 A7.5 7.5 0 0 1 19.5 12 L12 12 Z" fill="currentColor" opacity="0.15" />
      <path d="M12 19.5 A7.5 7.5 0 0 1 4.5 12 L12 12 Z" fill="currentColor" opacity="0.15" />
    </svg>
  );
}

function MercedesLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="1.5" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="12" x2="2.9" y2="17.25" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="12" x2="21.1" y2="17.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function VwLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 7 L9.5 17 L12 11 L14.5 17 L19 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M7.5 7 L12 17 L16.5 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function VolvoLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="13" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="17.01" y1="7.99" x2="21" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19" y1="4" x2="21" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="21" y1="4" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ToyotaLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="12" rx="10.5" ry="7" stroke="currentColor" strokeWidth="1.3" />
      <ellipse cx="12" cy="12" rx="4.5" ry="9" stroke="currentColor" strokeWidth="1.3" />
      <ellipse cx="12" cy="12" rx="6.5" ry="3.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function TeslaLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22 L12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 4.5 C3 4.5 6 7 12 7 C18 7 21 4.5 21 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M4 3 L4.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 3 L19.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function KiaLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="12" y="16" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="700" fontFamily="system-ui, sans-serif" letterSpacing="1">KIA</text>
    </svg>
  );
}

function ChevronDown({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

/* ─── Constants ─── */

const BRAND_LOGOS: Record<string, React.FC<{ className?: string }>> = {
  BMW: BmwLogo,
  Mercedes: MercedesLogo,
  VW: VwLogo,
  Volvo: VolvoLogo,
  Toyota: ToyotaLogo,
  Tesla: TeslaLogo,
  Kia: KiaLogo,
};

const BRAND_ORDER = ["BMW", "Mercedes", "VW", "Kia", "Toyota", "Volvo", "Tesla"];

/* ─── Types & helpers ─── */

interface GroupedModel {
  key: string;
  shortName: string;
  color: string;
}

function groupByBrand(
  availableModels: string[],
  modelConfig: Record<string, { label: string; color: string; borderClass: string; fuelOptions: string[] }>,
) {
  const groups = new Map<string, GroupedModel[]>();
  for (const key of availableModels) {
    const meta = getModelMeta(modelConfig, key);
    const parts = meta.label.split(" ");
    const brand = parts[0];
    const shortName = parts.slice(1).join(" ") || key;
    if (!groups.has(brand)) groups.set(brand, []);
    groups.get(brand)!.push({ key, shortName, color: meta.color });
  }
  return groups;
}

/* ─── Component ─── */

export default function ModelSelector() {
  const { selectedModels, toggleModel, availableModels, modelConfig, loading } = useModelSelection();

  const brandGroups = useMemo(
    () => groupByBrand(availableModels, modelConfig),
    [availableModels, modelConfig],
  );

  // Expand/collapse state
  const [openBrands, setOpenBrands] = useState<Set<string>>(new Set());
  const [hasInitialized, setHasInitialized] = useState(false);

  // Auto-expand brands that have selected models on first load
  useEffect(() => {
    if (!loading && !hasInitialized && brandGroups.size > 0) {
      const initial = new Set<string>();
      for (const [brand, models] of brandGroups) {
        if (models.some((m) => selectedModels.has(m.key))) {
          initial.add(brand);
        }
      }
      setOpenBrands(initial);
      setHasInitialized(true);
    }
  }, [loading, brandGroups, selectedModels, hasInitialized]);

  const toggleBrand = useCallback((brand: string) => {
    setOpenBrands((prev) => {
      const next = new Set(prev);
      if (next.has(brand)) next.delete(brand);
      else next.add(brand);
      return next;
    });
  }, []);

  if (loading) {
    return (
      <div className="max-w-xl rounded-xl border border-[var(--border)] bg-white overflow-hidden">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 px-4 min-h-[48px] border-b border-[var(--border)] last:border-b-0">
            <div className="animate-pulse w-5 h-5 bg-[var(--border)] rounded-full" />
            <div className="animate-pulse h-4 bg-[var(--border)] rounded" style={{ width: `${60 + i * 15}px` }} />
            <div className="ml-auto animate-pulse w-12 h-5 bg-[var(--border)] rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-xl rounded-xl border border-[var(--border)] bg-white overflow-hidden">
      {BRAND_ORDER.map((brand) => {
        const models = brandGroups.get(brand);
        if (!models) return null;

        const isOpen = openBrands.has(brand);
        const selectedInBrand = models.filter((m) => selectedModels.has(m.key));
        const selectedCount = selectedInBrand.length;
        const Logo = BRAND_LOGOS[brand];

        return (
          <div key={brand} className="border-b border-[var(--border)] last:border-b-0">
            {/* Brand header row */}
            <button
              onClick={() => toggleBrand(brand)}
              className="w-full flex items-center gap-3 px-4 min-h-[52px] hover:bg-[var(--card)] transition-colors duration-150 cursor-pointer"
            >
              {Logo && <Logo className="w-5 h-5 text-[var(--foreground)] shrink-0" />}
              <span className="text-sm font-semibold text-[var(--foreground)]">{brand}</span>

              <div className="ml-auto flex items-center gap-2">
                {/* Color dot previews when collapsed */}
                {!isOpen && selectedCount > 0 && (
                  <div className="flex gap-1">
                    {selectedInBrand.map((m) => (
                      <span
                        key={m.key}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: m.color }}
                      />
                    ))}
                  </div>
                )}

                {/* Count badge */}
                {selectedCount > 0 && (
                  <span className="text-xs text-[var(--muted)] bg-[var(--card)] px-2 py-0.5 rounded-full tabular-nums">
                    {selectedCount} av {models.length}
                  </span>
                )}

                {/* Chevron */}
                <ChevronDown
                  className={`w-4 h-4 text-[var(--muted)] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
              </div>
            </button>

            {/* Animated expand/collapse */}
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-in-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden min-h-0">
                <div className="px-4 pb-3 pt-1 flex flex-wrap gap-2">
                  {models.map(({ key, shortName, color }) => {
                    const active = selectedModels.has(key);
                    return (
                      <button
                        key={key}
                        onClick={() => toggleModel(key)}
                        className={`
                          inline-flex items-center gap-1.5 px-3.5 py-2.5 sm:py-2 rounded-full text-sm
                          font-medium whitespace-nowrap transition-all duration-150
                          active:scale-95
                          ${active
                            ? "bg-[var(--foreground)] text-white shadow-sm"
                            : "bg-white text-[var(--muted)] border border-[var(--border)] hover:border-[var(--foreground)]/30"
                          }
                        `}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 transition-opacity"
                          style={{
                            backgroundColor: color,
                            opacity: active ? 1 : 0.4,
                          }}
                        />
                        {shortName}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
