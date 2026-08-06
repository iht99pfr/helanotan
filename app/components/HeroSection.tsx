"use client";

import { useModelSelection } from "./ModelSelectionContext";
import { getModelMeta } from "@/app/lib/model-config";

/**
 * The masthead of a ledger, not a landing page. Rules above and below, a
 * mono eyebrow like a document reference, and the headline set in the display
 * serif — the page should look like it was published, not deployed.
 */
export default function HeroSection({ totalCars, lastUpdated }: {
  totalCars?: number; lastUpdated?: string;
} = {}) {
  const { selectedModels, modelConfig, loading } = useModelSelection();

  const labels = [...selectedModels].map((k) => getModelMeta(modelConfig, k).label);
  const modelText = loading
    ? "populära bilmodeller"
    : labels.length <= 2
      ? labels.join(" och ")
      : labels.slice(0, -1).join(", ") + " och " + labels[labels.length - 1];

  return (
    <section className="py-8 sm:py-14 border-b border-[var(--border)]">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
        Begagnatpriser · Sverige
        {totalCars ? ` · ${totalCars.toLocaleString("sv-SE")} annonser` : ""}
        {lastUpdated ? ` · ${lastUpdated}` : ""}
      </p>
      <h1 className="mt-3 text-4xl sm:text-6xl font-semibold tracking-tight text-[var(--foreground)] max-w-3xl">
        Vad kostar bilen egentligen?
      </h1>
      <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed">
        Riktiga priser från Blocket. Se hur {modelText} tappar i värde över tid,
        miltal och bränsletyp — och vilka annonser som ligger under vad modellen
        säger att de borde kosta.
      </p>
    </section>
  );
}
