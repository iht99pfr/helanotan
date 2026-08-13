"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { track } from "@/app/lib/track";

/**
 * "Vad är den värd?" — the door that was missing.
 *
 * The site's flow was Helanotan → Blocket, but a buyer's hunt runs the other
 * way: she has a Blocket ad open and wants a verdict on it. Her only route
 * used to be finding her car's dot among thousands in a scatter. These are
 * the fields she can copy from any ad in fifteen seconds; submitting builds
 * the intyg URL, so the result is addressable and shareable by construction.
 */
export default function ValuationForm({ slug, fuelOptions, defaultYear, medianHp }: {
  slug: string;
  fuelOptions: string[];
  defaultYear: number;
  medianHp: number;
}) {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(defaultYear);
  const [mileage, setMileage] = useState("");
  const [fuel, setFuel] = useState(fuelOptions[0] ?? "Bensin");
  const [hp, setHp] = useState("");
  const [price, setPrice] = useState("");

  const FUEL_LABELS: Record<string, string> = {
    Hybrid: "Hybrid", PHEV: "Laddhybrid", Diesel: "Diesel",
    Petrol: "Bensin", Electric: "El",
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const mil = Number(mileage.replace(/\s/g, ""));
    if (!Number.isFinite(mil) || mil < 0) return;
    const params = new URLSearchParams({
      ar: String(year),
      mil: String(Math.round(mil)),
      drivmedel: FUEL_LABELS[fuel] ?? fuel,
    });
    const hkN = Number(hp);
    if (Number.isFinite(hkN) && hkN > 0) params.set("hk", String(hkN));
    const prisN = Number(price.replace(/\s/g, ""));
    if (Number.isFinite(prisN) && prisN > 0) params.set("pris", String(prisN));
    track("valuation_submit", { model: slug, year, has_price: prisN > 0 });
    router.push(`/bilar/${slug}/vardera?${params}`);
  }

  const field = "bg-white border border-[var(--border)] px-3 py-2 text-sm rounded-lg w-full";

  return (
    <form onSubmit={submit} className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
      <label className="block">
        <span className="text-xs text-[var(--muted)]">Årsmodell</span>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className={field}>
          {Array.from({ length: currentYear - 2004 + 1 }, (_, i) => currentYear - i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-xs text-[var(--muted)]">Miltal (mil)</span>
        <input inputMode="numeric" placeholder="6 800" value={mileage}
          onChange={(e) => setMileage(e.target.value)} required className={field} />
      </label>
      <label className="block">
        <span className="text-xs text-[var(--muted)]">Drivmedel</span>
        <select value={fuel} onChange={(e) => setFuel(e.target.value)} className={field}>
          {fuelOptions.map((f) => (
            <option key={f} value={f}>{FUEL_LABELS[f] ?? f}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-xs text-[var(--muted)]">Hästkrafter</span>
        <input inputMode="numeric" placeholder={`${medianHp}`} value={hp}
          onChange={(e) => setHp(e.target.value)} className={field} />
      </label>
      <label className="block">
        <span className="text-xs text-[var(--muted)]">Begärt pris (kr)</span>
        <input inputMode="numeric" placeholder="valfritt" value={price}
          onChange={(e) => setPrice(e.target.value)} className={field} />
      </label>
      <button type="submit"
        className="col-span-2 sm:col-span-5 sm:w-auto sm:justify-self-start px-5 py-2.5 rounded-lg bg-[var(--foreground)] text-white text-sm font-medium hover:opacity-90 transition">
        Värdera bilen
      </button>
    </form>
  );
}
