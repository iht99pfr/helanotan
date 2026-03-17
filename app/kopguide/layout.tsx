import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Köpguide — Vilken årsmodell ska jag köpa?",
  description:
    "Jämför värdeminskningskostnad per månad för olika årsmodeller. Hitta den sweet spot där du får mest bil för pengarna.",
  openGraph: {
    title: "Köpguide — Vilken årsmodell ska jag köpa? | Hela Notan",
    description:
      "Jämför värdeminskningskostnad per månad för olika årsmodeller. Hitta den sweet spot där du får mest bil för pengarna.",
  },
};

export default function KopguideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
          Vilken årsmodell ska jag köpa?
        </h1>
        <p className="text-[var(--muted)] text-sm sm:text-base mt-2">Laddar...</p>
      </div>
      <div className="animate-pulse space-y-4">
        <div className="h-10 w-48 bg-[var(--border)] rounded-lg" />
        <div className="h-64 bg-[var(--border)] rounded-lg" />
      </div>
    </div>
  }>{children}</Suspense>;
}
