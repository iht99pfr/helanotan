"use client";

import { useMemo, useState } from "react";
import { track } from "@/app/lib/track";
import { dealName, underEstimateLabel } from "@/app/lib/deal-format";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  Area,
  ComposedChart,
} from "recharts";
import { getColorsMap } from "@/app/lib/model-config";
import type { ModelConfigMap } from "@/app/lib/model-config";

interface ScatterPoint {
  /** Blocket listing id — present only for ads still live. Lets a dot link
      to the actual car rather than to a search for its model and year. */
  id?: string;
  age: number;
  price: number;
  mileage: number;
  year: number;
  fuel: string;
  hp: number;
  seller: string;
  predicted?: number;
  residual?: number;
  deal?: "good" | "great";
}

interface MedianPoint {
  age: number;
  median: number;
  count: number;
}

interface PredictionPoint {
  age: number;
  predicted: number;
  lower: number;
  upper: number;
}

interface Props {
  scatter: Record<string, ScatterPoint[]>;
  medians: Record<string, MedianPoint[]>;
  predictionCurves?: Record<string, Record<string, PredictionPoint[]>>;
  hiddenModels: Set<string>;
  onToggleModel: (model: string) => void;
  modelConfig: ModelConfigMap;
  fuelFilter: string;
  maxAgePerModel?: Record<string, number>;
  onDotClick?: (modelKey: string, point: ScatterPoint) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DealDot(props: any) {
  const { cx, cy, payload, fill } = props;
  if (!cx || !cy) return null;
  if (payload?.deal === "great") {
    return <circle cx={cx} cy={cy} r={6} fill="#1a5c3a" stroke="#f8f4ec" strokeWidth={1.5} style={{ cursor: "pointer" }} />;
  }
  if (payload?.deal === "good") {
    return <circle cx={cx} cy={cy} r={5} fill="#3f8a60" opacity={0.85} style={{ cursor: "pointer" }} />;
  }
  return <circle cx={cx} cy={cy} r={4} fill={fill} opacity={0.6} style={{ cursor: "pointer" }} />;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: ScatterPoint }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-[var(--border)] rounded-lg px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold text-[var(--foreground)]">{d.year} — {d.fuel}</p>
      <p className="font-mono font-semibold">{d.price.toLocaleString("sv-SE")} kr</p>
      <p className="text-[var(--muted)]">{d.mileage.toLocaleString("sv-SE")} mil · {d.hp} hk</p>
      <p className="text-[var(--muted)] text-xs">{d.seller === "dealer" ? "Handlare" : "Privat"}</p>
      {d.predicted != null && (
        <>
          <hr className="my-1.5 border-[var(--border)]" />
          <p className="text-xs text-[var(--muted)]">
            Predikterat: <span className="font-mono">{d.predicted.toLocaleString("sv-SE")} kr</span>
          </p>
          {d.residual != null && d.residual < 0 && (
            <p className="text-xs font-semibold text-[var(--money)]">
              {underEstimateLabel(d.price, d.predicted) ?? "Under prisestimat"} ·{" "}
              {Math.abs(d.residual).toLocaleString("sv-SE")} kr
            </p>
          )}
          {d.deal && (
            <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
              d.deal === "great"
                ? "bg-[var(--money-soft)] text-[var(--money)] font-semibold"
                : "bg-[var(--money-faint)] text-[var(--money-mid)]"
            }`}>
              {dealName(d.deal)}
            </span>
          )}
        </>
      )}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderLegend(hiddenModels: Set<string>, onToggle: (model: string) => void) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (props: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const seen = new Set<string>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = (props.payload || []).filter((e: any) => {
      if (String(e.value).includes("_range") || seen.has(e.value)) return false;
      seen.add(e.value);
      return true;
    });
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {items.map((entry: any, index: number) => {
          const isHidden = hiddenModels.has(entry.value);
          return (
            <span
              key={`legend-${index}`}
              onClick={() => onToggle(entry.value)}
              style={{
                cursor: "pointer",
                opacity: isHidden ? 0.35 : 1,
                textDecoration: isHidden ? "line-through" : "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                userSelect: "none",
              }}
            >
              <svg width={10} height={10}>
                <circle cx={5} cy={5} r={5} fill={entry.color} />
              </svg>
              <span style={{ color: "var(--muted)", fontSize: 14 }}>{displayName(entry.value)}</span>
            </span>
          );
        })}
      </div>
    );
  };
}

const FUEL_MAP: Record<string, string> = { Alla: "All", Bensin: "Petrol", Laddhybrid: "PHEV" };
const AGE_TICKS = [0, 3, 6, 9, 12, 15];
const formatPriceK = (v: number) => v >= 1000000 ? `${(v / 1000000).toFixed(1).replace(".0", "")}M` : `${(v / 1000).toFixed(0)}k`;
const formatTkr = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1).replace(".0", "")}M` : `${v.toFixed(0)}k`;
const displayName = (key: string) => key.replace(/([a-z0-9])([A-Z])/g, "$1 $2");

export default function DepreciationChart({ scatter, medians, predictionCurves, hiddenModels, onToggleModel, modelConfig, fuelFilter, maxAgePerModel, onDotClick }: Props) {
  const COLORS = getColorsMap(modelConfig);

  const internalFuel = FUEL_MAP[fuelFilter] || fuelFilter;

  // This legend used to be two inert <span>s wearing the site's filter
  // costume: a coloured dot plus the exact words that ARE buttons in the
  // listings table below. Dead clicks fired in 14.9% of sessions with zero
  // rage clicks — people tapped once, nothing happened, and they left. Now
  // the affordance is real.
  const [dealFilter, setDealFilter] = useState<"all" | "great" | "good">("all");

  // Everything below used to run in the component body on every render: a
  // filter, a copy and a comparator sort over ~5 000 points, plus a rebuild of
  // the trend series. React re-renders this component on every fuel pill,
  // model pill, legend tap and year change — and ChartSection renders the
  // mileage chart from the same data — so a single click paid for it twice.
  // That is the bulk of an INP of 1800 ms against an LCP of 0.97 s.
  const filteredScatter = useMemo(() => {
    const dealOrder = { undefined: 0, good: 1, great: 2 };
    const out: Record<string, ScatterPoint[]> = {};
    for (const [model, points] of Object.entries(scatter)) {
      const filtered = points.filter(
        (p) =>
          p.age <= 15 &&
          (internalFuel === "All" || p.fuel === internalFuel) &&
          (dealFilter === "all" ||
            (dealFilter === "great" ? p.deal === "great" : p.deal != null))
      );
      // Sort so deals render on top (SVG paint order)
      out[model] = filtered.sort(
        (a, b) => (dealOrder[a.deal as keyof typeof dealOrder] ?? 0) - (dealOrder[b.deal as keyof typeof dealOrder] ?? 0)
      );
    }
    return out;
  }, [scatter, internalFuel, dealFilter]);

  const { trendData, modelsWithCurve } = useMemo(() => {
    const models = Object.keys(medians);
    const hasPredictions = predictionCurves && Object.keys(predictionCurves).length > 0;
    const curveModels: string[] = [];
    let data: Record<string, number | number[]>[];

    if (hasPredictions) {
      const curveKey = internalFuel === "All" ? "all" : internalFuel;
      const allAges = new Set<number>();
      for (const model of models) {
        const curve = predictionCurves[model]?.[curveKey];
        if (curve) {
          curveModels.push(model);
          curve.forEach((p) => allAges.add(p.age));
        }
      }
      data = [...allAges].sort((a, b) => a - b).filter((a) => a <= 15).map((age) => {
        const point: Record<string, number | number[]> = { age };
        for (const model of curveModels) {
          // Don't extrapolate beyond the oldest actual data point
          const modelMax = maxAgePerModel?.[model];
          if (modelMax != null && age > modelMax) continue;
          const curve = predictionCurves[model]?.[curveKey];
          const match = curve?.find((p) => p.age === age);
          if (match) {
            point[model] = Math.max(0, match.predicted) / 1000;
            point[`${model}_range`] = [Math.max(0, match.lower) / 1000, Math.max(0, match.upper) / 1000];
          }
        }
        return point;
      });
    } else {
      const allAges = new Set<number>();
      Object.values(medians).forEach((pts) => pts.forEach((p) => allAges.add(p.age)));
      data = [...allAges].sort((a, b) => a - b).map((age) => {
        const point: Record<string, number | number[]> = { age };
        for (const model of models) {
          const match = medians[model].find((p) => p.age === age);
          if (match) point[model] = match.median / 1000;
        }
        return point;
      });
      curveModels.push(...models);
    }

    // Enforce monotonic decrease on prediction trend data
    for (const model of curveModels) {
      let prevVal = Infinity;
      for (const point of data) {
        const val = point[model];
        if (typeof val === "number") {
          if (val > prevVal) point[model] = prevVal;
          else prevVal = val;
        }
      }
    }

    return { trendData: data, modelsWithCurve: curveModels };
  }, [medians, predictionCurves, internalFuel, maxAgePerModel]);

  const hasPredictions = !!predictionCurves && Object.keys(predictionCurves).length > 0;
  const visibleModelsWithCurve = modelsWithCurve.filter((m) => !hiddenModels.has(m));

  // Cap trend Y-axis to prediction values + 30% (not confidence bands)
  const trendYMax = useMemo(() => {
    let max = 0;
    for (const model of modelsWithCurve) {
      for (const point of trendData) {
        const val = point[model];
        if (typeof val === "number" && val > max) max = val;
      }
    }
    return Math.ceil((max * 1.3) / 50) * 50; // Round up to nearest 50k
  }, [trendData, modelsWithCurve]);

  return (
    <div className="space-y-2">
      <div className="h-[350px] sm:h-[500px] [&_svg]:outline-none">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="age" type="number" name="Age"
            label={{ value: "Ålder (år)", position: "bottom", fill: "var(--muted)", fontSize: 10, offset: 5 }}
            ticks={AGE_TICKS} tick={{ fill: "var(--muted)", fontSize: 11 }} domain={[0, 15]} />
          <YAxis dataKey="price" type="number" name="Price"
            tick={{ fill: "var(--muted)", fontSize: 11 }}
            tickFormatter={formatPriceK} domain={[0, "auto"]} width={35} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} content={renderLegend(hiddenModels, onToggleModel)} />
          {Object.entries(filteredScatter).map(([model, points]) => (
            points.length > 0 && !hiddenModels.has(model) && (
              <Scatter key={model} name={model} data={points} fill={COLORS[model]}
                shape={<DealDot fill={COLORS[model]} />}
                onClick={(data: { payload: ScatterPoint }) => onDotClick?.(model, data.payload)} />
            )
          ))}
          {/* Invisible scatters for hidden models so they still appear in the legend */}
          {Object.keys(filteredScatter).filter((m) => hiddenModels.has(m)).map((model) => (
            <Scatter key={model} name={model} data={[]} fill={COLORS[model]} r={4} />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap justify-center gap-2 text-xs">
        {([
          { key: "all", label: "Alla annonser", dot: null, r: 0 },
          { key: "great", label: "Fyndpris", dot: "#1a5c3a", r: 6 },
          { key: "good", label: "Bra pris", dot: "#3f8a60", r: 5 },
        ] as const).map(({ key, label, dot, r }) => (
          <button
            key={key}
            onClick={() => {
              setDealFilter(key);
              track("deal_filter", { value: key, source: "chart" });
            }}
            aria-pressed={dealFilter === key}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition ${
              dealFilter === key
                ? "bg-[var(--foreground)] text-white border-[var(--foreground)]"
                : "bg-white text-[var(--muted)] border-[var(--border)] hover:border-[var(--muted)]"
            }`}
          >
            {dot && (
              <svg width={r * 2} height={r * 2}>
                <circle cx={r} cy={r} r={r} fill={dot} />
              </svg>
            )}
            {label}
          </button>
        ))}
      </div>
      {dealFilter !== "all" && (
        <p className="text-xs text-[var(--muted)] text-center">
          Visar {Object.values(filteredScatter).reduce((n, p) => n + p.length, 0)} annonser
          under predikterat pris. Klicka på en punkt för att se bilen.
        </p>
      )}

      {modelsWithCurve.length > 0 ? (
        <div className="h-[280px] sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={trendData} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="age" type="number" ticks={AGE_TICKS} domain={[0, 15]}
              tick={{ fill: "var(--muted)", fontSize: 11 }}
              label={{ value: "Ålder (år)", position: "bottom", fill: "var(--muted)", fontSize: 10, offset: 5 }} />
            <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }}
              tickFormatter={formatTkr} domain={[0, trendYMax]} allowDataOverflow
              width={35} />
            <Tooltip
              contentStyle={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 8 }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any, name: any) => {
                if (typeof name === "string" && name.includes("_range")) return null;
                return [`${Number(value || 0).toFixed(0)}k kr`, displayName(String(name))];
              }}
              labelFormatter={(label: any) => `Ålder: ${label} år`}
            />
            <Legend verticalAlign="top" height={36} content={renderLegend(hiddenModels, onToggleModel)} />
            {hasPredictions && modelsWithCurve.map((model) => (
              <Area key={`${model}_band`} dataKey={`${model}_range`} stroke="none"
                fill={COLORS[model]} fillOpacity={hiddenModels.has(model) ? 0 : 0.1}
                connectNulls type="monotone" legendType="none" />
            ))}
            {modelsWithCurve.map((model) => (
              <Line key={model} type="monotone" dataKey={model} stroke={COLORS[model]}
                strokeWidth={2.5} dot={{ r: 3, fill: COLORS[model] }} connectNulls
                hide={hiddenModels.has(model)} />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-8 text-[var(--muted)] text-sm">
          Ingen prediktionskurva tillgänglig för &ldquo;{fuelFilter}&rdquo;.
          Otillräckligt med datapunkter för detta bränsle.
        </div>
      )}

      {hasPredictions && visibleModelsWithCurve.length > 0 && (
        <p className="text-xs text-[var(--muted)] text-center">
          Skuggade band visar 95% prediktionsintervall från multivariat regression
          (justerat för bränsletyp, miltal, hk, utrustning, drivlina)
        </p>
      )}
    </div>
  );
}
