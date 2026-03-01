"use client";

import { useMemo } from "react";
import { useModelSelection } from "./ModelSelectionContext";
import { getModelMeta } from "@/app/lib/model-config";

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
    const brand = parts[0]; // "BMW", "Volvo", "VW", etc.
    const shortName = parts.slice(1).join(" ") || key; // "X3", "XC60", "Golf GTI"
    if (!groups.has(brand)) groups.set(brand, []);
    groups.get(brand)!.push({ key, shortName, color: meta.color });
  }
  return groups;
}

export default function ModelSelector() {
  const { selectedModels, toggleModel, availableModels, modelConfig, loading } = useModelSelection();

  const brandGroups = useMemo(
    () => groupByBrand(availableModels, modelConfig),
    [availableModels, modelConfig],
  );

  if (loading) {
    return (
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="animate-pulse h-3 w-12 bg-[var(--border)] rounded" />
            <div className="flex gap-1.5">
              <div className="animate-pulse h-9 w-20 bg-[var(--border)] rounded-full" />
              <div className="animate-pulse h-9 w-20 bg-[var(--border)] rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3">
      {[...brandGroups.entries()].map(([brand, models]) => (
        <div key={brand}>
          <div className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wide mb-1.5">
            {brand}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {models.map(({ key, shortName, color }) => {
              const active = selectedModels.has(key);
              return (
                <button
                  key={key}
                  onClick={() => toggleModel(key)}
                  className={`
                    inline-flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-full text-sm
                    font-medium whitespace-nowrap transition-all
                    ${active
                      ? "bg-[var(--foreground)] text-white shadow-sm"
                      : "bg-white text-[var(--muted)] border border-[var(--border)] hover:border-[var(--foreground)]/30"
                    }
                  `}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
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
      ))}
    </div>
  );
}
