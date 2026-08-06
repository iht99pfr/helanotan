"use client";

import { useState, useEffect, useCallback } from "react";
import ShareBar from "@/app/components/ShareBar";
import { track } from "@/app/lib/track";

interface ModelConfig {
  label: string;
  color: string;
  fuelOptions: string[];
}

interface PredictionPoint {
  age: number;
  predicted: number;
}

interface AggregatesData {
  modelConfig: Record<string, ModelConfig>;
  predictionCurves: Record<string, Record<string, PredictionPoint[]>>;
}

const FUEL_LABELS: Record<string, string> = {
  Petrol: "Bensin",
  Diesel: "Diesel",
  Hybrid: "Hybrid",
  PHEV: "Laddhybrid",
  Electric: "Elbil",
};

function formatKr(n: number): string {
  return Math.round(n).toLocaleString("sv-SE") + " kr";
}

export default function BevakaPage() {
  const [data, setData] = useState<AggregatesData | null>(null);
  const [modelKey, setModelKey] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [modelYear, setModelYear] = useState(2022);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  useEffect(() => {
    fetch("/api/aggregates")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        const firstKey = Object.keys(d.modelConfig)[0];
        if (firstKey) {
          setModelKey(firstKey);
          setFuelType(d.modelConfig[firstKey].fuelOptions[0] || "");
        }
      });
  }, []);

  const updateModel = useCallback(
    (key: string) => {
      setModelKey(key);
      if (data) {
        setFuelType(data.modelConfig[key]?.fuelOptions[0] || "");
      }
    },
    [data]
  );

  const currentAge = 2026 - modelYear;

  // Get prediction curve for selected model+fuel
  const curve =
    data?.predictionCurves?.[modelKey]?.[fuelType] ||
    data?.predictionCurves?.[modelKey]?.["all"] ||
    [];

  const currentPoint = curve.find((p) => p.age === currentAge);
  const nextYearPoint = curve.find((p) => p.age === currentAge + 1);
  const threeYearPoint = curve.find(
    (p) => p.age === Math.min(currentAge + 3, 15)
  );

  const currentValue = currentPoint?.predicted || 0;
  const nextYearValue = nextYearPoint?.predicted || 0;
  const threeYearValue = threeYearPoint?.predicted || 0;

  const yearlyLoss = currentValue - nextYearValue;
  const monthlyLoss = yearlyLoss / 12;
  const threeYearLoss = currentValue - threeYearValue;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/bevaka", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, modelKey, fuelType, modelYear }),
      });
      if (res.ok) {
        setStatus("success");
        track("watch_submit", { model: modelKey, year: modelYear, fuel: fuelType });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (!data) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-[var(--muted)]">Laddar...</p>
      </main>
    );
  }

  const models = Object.entries(data.modelConfig).sort((a, b) =>
    a[1].label.localeCompare(b[1].label)
  );

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
        Bevaka din bil
      </h1>
      <p className="text-[var(--muted)] mb-8">
        Välj din bil nedan och se vad den tappar i värde. Registrera dig för att
        få månatliga uppdateringar om din bils värdeminskning.
      </p>

      {/* Car selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1">
            Modell
          </label>
          <select
            value={modelKey}
            onChange={(e) => updateModel(e.target.value)}
            className="w-full bg-white border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)]"
          >
            {models.map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1">
            Drivmedel
          </label>
          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            className="w-full bg-white border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)]"
          >
            {(data.modelConfig[modelKey]?.fuelOptions || []).map((f) => (
              <option key={f} value={f}>
                {FUEL_LABELS[f] || f}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1">
            Årsmodell
          </label>
          <select
            value={modelYear}
            onChange={(e) => setModelYear(Number(e.target.value))}
            className="w-full bg-white border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)]"
          >
            {Array.from({ length: 16 }, (_, i) => 2026 - i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Value overview */}
      {currentValue > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
              <div className="text-xs text-[var(--muted)]">Uppskattat värde</div>
              <div className="text-xl font-bold text-[var(--foreground)] mt-1">
                {formatKr(currentValue)}
              </div>
            </div>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
              <div className="text-xs text-[var(--muted)]">Tappar per månad</div>
              <div className="text-xl font-bold text-red-600 mt-1">
                −{formatKr(monthlyLoss)}
              </div>
            </div>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
              <div className="text-xs text-[var(--muted)]">Tappar nästa år</div>
              <div className="text-xl font-bold text-red-600 mt-1">
                −{formatKr(yearlyLoss)}
              </div>
            </div>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
              <div className="text-xs text-[var(--muted)]">Tappar på 3 år</div>
              <div className="text-xl font-bold text-red-600 mt-1">
                −{formatKr(threeYearLoss)}
              </div>
            </div>
          </div>

          {/* Depreciation timeline */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 mb-8">
            <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">
              Värdeminskning över tid
            </h2>
            <div className="space-y-2">
              {curve
                .filter((p) => p.age >= currentAge && p.age <= currentAge + 5)
                .map((p) => {
                  const loss = currentValue - p.predicted;
                  const pct =
                    currentValue > 0 ? (p.predicted / currentValue) * 100 : 0;
                  return (
                    <div key={p.age} className="flex items-center gap-3">
                      <span className="text-xs text-[var(--muted)] w-12 shrink-0">
                        {p.age === currentAge ? "Idag" : `Om ${p.age - currentAge} år`}
                      </span>
                      <div className="flex-1 h-6 bg-[var(--border)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--foreground)] rounded-full transition-all"
                          style={{ width: `${Math.max(pct, 5)}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-[var(--foreground)] w-20 text-right">
                        {formatKr(p.predicted)}
                      </span>
                      {loss > 0 && (
                        <span className="text-xs text-red-600 w-20 text-right">
                          −{formatKr(loss)}
                        </span>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="mb-8">
            <ShareBar
              url={`https://helanotan.se/bevaka?model=${modelKey}&fuel=${fuelType}&year=${modelYear}`}
              title={`Min ${data.modelConfig[modelKey]?.label} ${modelYear} tappar ${formatKr(monthlyLoss)} per månad`}
              description={`Se vad din bil tappar i värde på helanotan.se`}
              eventPrefix="bevaka"
            />
          </div>

          {/* Email signup */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5">
            {/* This said "vi skickar ett mejl varje månad". Nothing has ever
                been sent — there is no mail library and no scheduler — and the
                people who signed up have been waiting since. Say what is
                actually true until delivery exists. */}
            <h2 className="text-sm font-semibold text-[var(--foreground)] mb-1">
              Ställ dig i kö för månadsrapport på din{" "}
              {data.modelConfig[modelKey]?.label} {modelYear}
            </h2>
            <p className="text-xs text-[var(--muted)] mb-4">
              Månadsrapporten är under uppbyggnad och skickas inte än. Lämnar du
              din adress hör vi av oss när den första rapporten går ut — inget
              annat mejl däremellan.
            </p>

            {status === "success" ? (
              <div className="flex items-center gap-2 text-sm text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg px-4 py-3">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Tack! Du står i kön och hör av oss när rapporten är igång.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="email"
                  placeholder="din@email.se"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-white border border-[var(--border)] px-3 py-2 text-sm rounded-lg"
                />
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="px-5 py-2 bg-[var(--foreground)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50 whitespace-nowrap"
                >
                  {status === "submitting" ? "..." : "Bevaka"}
                </button>
                {status === "error" && (
                  <p className="text-xs text-red-600 self-center">
                    Något gick fel, försök igen.
                  </p>
                )}
              </form>
            )}
          </div>
        </>
      ) : (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-8 text-center">
          <p className="text-[var(--muted)]">
            Ingen data tillgänglig för denna kombination. Prova en annan
            årsmodell eller drivmedel.
          </p>
        </div>
      )}

      <p className="text-xs text-[var(--muted)] mt-6">
        Värdena baseras på analys av tusentals Blocket-annonser och vår
        regressionsmodell. Faktiskt värde beror på skick, utrustning och
        miltal.
      </p>
    </main>
  );
}
