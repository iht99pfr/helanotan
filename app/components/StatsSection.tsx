"use client";

import { useModelSelection } from "./ModelSelectionContext";
import StatsCards from "./StatsCards";
import StatsBadges from "./StatsBadges";

export default function StatsSection() {
  const { selectedModels, modelConfig, loading: ctxLoading, aggregates: data } =
    useModelSelection();

  if (!data || ctxLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <section>
        <StatsCards summary={data.summary} modelConfig={modelConfig} selectedModels={selectedModels} />
      </section>
      <section className="space-y-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">Hur säkert är prisestimatet?</h2>
          <p className="text-[var(--muted)] text-sm mt-1">
            Hur nära modellen brukar hamna, i procent och i kronor. Bygger på
            ålder, miltal, bränsletyp, hästkrafter, utrustning, drivlina och
            säljartyp.
          </p>
        </div>
        <StatsBadges regression={data.regression} summary={data.summary} modelConfig={modelConfig} selectedModels={selectedModels} />
      </section>
    </>
  );
}
