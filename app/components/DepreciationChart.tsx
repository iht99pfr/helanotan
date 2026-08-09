"use client";

import { useCallback, useMemo, useState } from "react";
import { track } from "@/app/lib/track";
import { dealName, underEstimateLabel } from "@/app/lib/deal-format";
import {
  ScatterChart,
  Scatter,
  ReferenceArea,
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
  /** 2.5th and 97.5th percentile of observed residuals, applied to predicted. */
  lower: number;
  upper: number;
  /** The inner half of listings. Absent on older cached payloads. */
  p25?: number;
  p75?: number;
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

/**
 * Mileage as a colour ramp, pale to dark.
 *
 * The vertical spread at a single age is the question the chart never answered
 * — a five-year-old Yaris runs from 130 000 to 400 000 kr. Colouring by
 * mileage answers part of it at a glance, and where it does not (a GR Yaris is
 * dear because of its engine, not its odometer) the absence of a pattern is
 * itself the finding. Model identity is traded away while this is on, which is
 * why it is a toggle rather than the default.
 */
// A cool ramp, because the page is warm cream and the money colour is green.
// The first attempt ran beige to brown, which left low-mileage cars invisible
// against the paper and the whole scale washed out at arm's length.
const MILEAGE_RAMP = ["#a9cbe8", "#5d97c9", "#2f6ba3", "#1d4470", "#101f38"];
const MILEAGE_STOPS = [1000, 5000, 10000, 20000];
const MILEAGE_LABELS = ["<1 000", "1–5 000", "5–10 000", "10–20 000", "20 000+"];

function mileageColor(mileage: number): string {
  let i = 0;
  while (i < MILEAGE_STOPS.length && mileage >= MILEAGE_STOPS[i]) i++;
  return MILEAGE_RAMP[i];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DealDot(props: any) {
  const { cx, cy, payload, fill, colorBy } = props;
  if (!cx || !cy) return null;
  if (colorBy === "mileage") {
    // No deal ring here. This mode exists to read mileage, and ringing a third
    // of the dots in green turned the ramp into background noise — the deal
    // filter directly below does that job when it is wanted. A thin paper-
    // coloured edge separates dots where they overlap instead.
    return (
      <circle cx={cx} cy={cy} r={4.5} fill={mileageColor(payload?.mileage ?? 0)}
        stroke="#f8f4ec" strokeWidth={0.75} fillOpacity={0.9}
        style={{ cursor: "pointer" }} />
    );
  }
  if (payload?.deal === "great") {
    return <circle cx={cx} cy={cy} r={6} fill="#1a5c3a" stroke="#f8f4ec" strokeWidth={1.5} style={{ cursor: "pointer" }} />;
  }
  if (payload?.deal === "good") {
    return <circle cx={cx} cy={cy} r={5} fill="#3f8a60" opacity={0.85} style={{ cursor: "pointer" }} />;
  }
  return <circle cx={cx} cy={cy} r={4} fill={fill} opacity={0.6} style={{ cursor: "pointer" }} />;
}

/**
 * Since the scatter and the curve share one chart, this receives two very
 * different shapes: a listing, and a point on a trend line. It used to assume
 * the first and read `d.price.toLocaleString()` unconditionally — so moving
 * the mouse over the curve threw "Cannot read properties of undefined" and
 * took the whole page down with it. Hovering a curve is now worth something
 * rather than fatal: it reports the estimate at that age.
 */
interface TooltipEntry {
  payload?: Partial<ScatterPoint> & Record<string, unknown>;
  dataKey?: string | number;
  name?: string | number;
  value?: unknown;
  color?: string;
}

function isListing(p: unknown): p is ScatterPoint {
  return !!p && typeof (p as ScatterPoint).price === "number"
    && typeof (p as ScatterPoint).year === "number";
}

const sek = (n: number) => Math.round(n).toLocaleString("sv-SE");

function CustomTooltip({ active, payload, label, modelConfig }: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: number | string;
  modelConfig?: ModelConfigMap;
}) {
  if (!active || !payload?.length) return null;

  const listing = payload.map((e) => e.payload as unknown).find(isListing);
  if (listing) {
    return (
      <div className="bg-white border border-[var(--border)] rounded-lg px-3 py-2 text-sm shadow-lg">
        <p className="font-semibold text-[var(--foreground)]">
          {listing.year} — {listing.fuel}
        </p>
        <p className="font-mono font-semibold">{sek(listing.price)} kr</p>
        <p className="text-[var(--muted)]">
          {sek(listing.mileage ?? 0)} mil{listing.hp ? ` · ${listing.hp} hk` : ""}
        </p>
        <p className="text-[var(--muted)] text-xs">
          {listing.seller === "dealer" ? "Handlare" : "Privat"}
        </p>
        {listing.predicted != null && (
          <>
            <hr className="my-1.5 border-[var(--border)]" />
            <p className="text-xs text-[var(--muted)]">
              Prisestimat: <span className="font-mono">{sek(listing.predicted)} kr</span>
            </p>
            {listing.residual != null && listing.residual < 0 && (
              <p className="text-xs font-semibold text-[var(--money)]">
                {underEstimateLabel(listing.price, listing.predicted) ?? "Under prisestimat"}
                {" · "}{sek(Math.abs(listing.residual))} kr
              </p>
            )}
            {listing.deal && (
              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                listing.deal === "great"
                  ? "bg-[var(--money-soft)] text-[var(--money)] font-semibold"
                  : "bg-[var(--money-faint)] text-[var(--money-mid)]"
              }`}>
                {dealName(listing.deal)}
              </span>
            )}
          </>
        )}
      </div>
    );
  }

  // A point on the curve: report each visible model's estimate at this age.
  const lines = payload.filter(
    (e) => typeof e.dataKey === "string"
      && !e.dataKey.includes("_range")
      && !e.dataKey.includes("_inner")
      && typeof e.value === "number",
  );
  if (!lines.length) return null;

  return (
    <div className="bg-white border border-[var(--border)] rounded-lg px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold text-[var(--foreground)]">Ålder: {label} år</p>
      {lines.map((e) => {
        const key = String(e.dataKey);
        return (
          <p key={key} className="text-[var(--muted)]">
            <span style={{ color: e.color }}>■</span>{" "}
            {modelConfig?.[key]?.label ?? displayName(key)}:{" "}
            <span className="font-mono text-[var(--foreground)]">
              {sek(e.value as number)} kr
            </span>
          </p>
        );
      })}
      <p className="text-[var(--muted)] text-xs mt-1">Prisestimat vid den åldern</p>
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
      // The bands are series too, and each carries a name. Filtering only
      // "_range" left "Yaris_inner" sitting in the legend as if it were a
      // model, once the inner band was added.
      const name = String(e.value);
      if (name.includes("_range") || name.includes("_inner") || seen.has(name)) return false;
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
/** Whole years across whatever range is on screen.
 *
 * Left to itself Recharts divides the zoomed range evenly and produces ticks
 * like "2.75" and "4.25". A car is not 2.75 years old in this data — age is
 * rounded to whole years before it ever reaches the chart — so fractional
 * labels invite a precision that does not exist. */
function ageTicks(from: number, to: number): number[] {
  const span = to - from;
  const step = span <= 4 ? 1 : span <= 8 ? 2 : 3;
  const out: number[] = [];
  for (let a = Math.ceil(from); a <= to; a += step) out.push(a);
  // Only add the endpoint if it will not sit on top of the previous tick.
  const end = Math.floor(to);
  if (out.length && end - out[out.length - 1] >= step / 2) out.push(end);
  return out.length ? out : [from, to];
}
const formatPriceK = (v: number) => v >= 1000000 ? `${(v / 1000000).toFixed(1).replace(".0", "")}M` : `${(v / 1000).toFixed(0)}k`;
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
  const [colorBy, setColorBy] = useState<"model" | "mileage">("model");

  // Zoom on the age axis.
  //
  // Dragging across the plot is the natural gesture with a mouse. On a phone
  // it is not: the chart lives inside a page that scrolls vertically, so a
  // drag that starts on the plot is a scroll to the browser and a selection to
  // us, and pinch fights the page zoom. The range buttons below do the same
  // job with a tap, which is why both exist.
  const [zoom, setZoom] = useState<{ from: number; to: number } | null>(null);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragTo, setDragTo] = useState<number | null>(null);

  const endDrag = useCallback(() => {
    if (dragFrom != null && dragTo != null) {
      const from = Math.min(dragFrom, dragTo);
      const to = Math.max(dragFrom, dragTo);
      // A click is a drag of zero width; do not zoom to nothing.
      if (to - from >= 0.5) {
        setZoom({ from: Math.floor(from), to: Math.ceil(to) });
        track("chart_zoom", { from: Math.floor(from), to: Math.ceil(to), how: "drag" });
      }
    }
    setDragFrom(null);
    setDragTo(null);
  }, [dragFrom, dragTo]);

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
            point[model] = Math.max(0, match.predicted);
            point[`${model}_range`] = [Math.max(0, match.lower), Math.max(0, match.upper)];
            if (match.p25 != null && match.p75 != null) {
              point[`${model}_inner`] = [Math.max(0, match.p25), Math.max(0, match.p75)];
            }
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
          if (match) point[model] = match.median;
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

  // One axis now serves both the dots and the curve, so it has to cover the
  // scatter as well. Cap at a high percentile rather than the maximum: a
  // single 2 M kr listing would otherwise flatten every curve on the chart.
  // Fit the axis to the data instead of always drawing 0–15 years.
  //
  // A Volvo XC40 has been on sale since 2018, so its listings stop at age 8 —
  // and the chart still drew out to 15, leaving nearly half the canvas empty
  // and squeezing every point into the left half. Zooming was being asked to
  // fix something the axis should never have done.
  const chartXMax = useMemo(() => {
    let max = 0;
    for (const points of Object.values(filteredScatter)) {
      for (const p of points) if (p.age > max) max = p.age;
    }
    for (const model of visibleModelsWithCurve) {
      for (const point of trendData) {
        const a = point.age;
        if (typeof a === "number" && typeof point[model] === "number" && a > max) max = a;
      }
    }
    return Math.min(15, Math.max(4, Math.ceil(max)));
  }, [filteredScatter, trendData, visibleModelsWithCurve]);

  const chartYMax = useMemo(() => {
    const prices: number[] = [];
    for (const points of Object.values(filteredScatter)) {
      for (const p of points) prices.push(p.price);
    }
    prices.sort((a, b) => a - b);
    const p98 = prices.length ? prices[Math.floor(prices.length * 0.98)] : 0;

    let curveMax = 0;
    for (const model of visibleModelsWithCurve) {
      for (const point of trendData) {
        const band = point[`${model}_range`];
        const upper = Array.isArray(band) ? band[1] : undefined;
        const val = typeof upper === "number" ? upper : point[model];
        if (typeof val === "number" && val > curveMax) curveMax = val;
      }
    }
    const max = Math.max(p98, curveMax) * 1.08;
    return Math.ceil(max / 50_000) * 50_000;
  }, [filteredScatter, trendData, visibleModelsWithCurve]);

  return (
    <div className="space-y-3">
      {/* One chart, not two.
       *
       * The scatter and the prediction curve described the same thing and sat
       * in separate frames on separate scales — one in kronor, one in
       * thousands — so the reader had to hold two pictures in mind to ask the
       * only question that matters: is this dot above or below the line? Now
       * the curve runs through the cloud it was fitted on. */}
      <div className="h-[420px] sm:h-[560px] [&_svg]:outline-none">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={trendData} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onMouseDown={(e: any) => {
            if (e?.activeLabel != null) setDragFrom(Number(e.activeLabel));
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onMouseMove={(e: any) => {
            if (dragFrom != null && e?.activeLabel != null) setDragTo(Number(e.activeLabel));
          }}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="age" type="number"
            ticks={zoom ? ageTicks(zoom.from, zoom.to) : ageTicks(0, chartXMax)}
            domain={zoom ? [zoom.from, zoom.to] : [0, chartXMax]}
            allowDataOverflow
            allowDuplicatedCategory={false}
            tick={{ fill: "var(--muted)", fontSize: 11 }}
            label={{ value: "Ålder (år)", position: "bottom", fill: "var(--muted)", fontSize: 10, offset: 5 }} />
          <YAxis dataKey="price" type="number" tick={{ fill: "var(--muted)", fontSize: 11 }}
            tickFormatter={formatPriceK} domain={[0, chartYMax]} allowDataOverflow width={38} />
          <Tooltip content={<CustomTooltip modelConfig={modelConfig} />} />
          <Legend verticalAlign="top" height={36} content={renderLegend(hiddenModels, onToggleModel)} />

          {/* Outer band: the 95% range, from percentiles of real residuals. */}
          {hasPredictions && modelsWithCurve.map((model) => (
            <Area key={`${model}_band`} dataKey={`${model}_range`} stroke="none"
              fill={COLORS[model]} fillOpacity={hiddenModels.has(model) ? 0 : 0.08}
              connectNulls type="monotone" legendType="none" isAnimationActive={false} />
          ))}
          {/* Inner band: where half of all listings sit. The 95% band is
              honest but so wide it says little; this is the useful one. */}
          {hasPredictions && modelsWithCurve.map((model) => (
            <Area key={`${model}_inner`} dataKey={`${model}_inner`} stroke="none"
              fill={COLORS[model]} fillOpacity={hiddenModels.has(model) ? 0 : 0.16}
              connectNulls type="monotone" legendType="none" isAnimationActive={false} />
          ))}

          {Object.entries(filteredScatter).map(([model, points]) => (
            points.length > 0 && !hiddenModels.has(model) && (
              <Scatter key={model} name={model} data={points} fill={COLORS[model]}
                shape={<DealDot fill={COLORS[model]} colorBy={colorBy} />} isAnimationActive={false}
                onClick={(data: { payload: ScatterPoint }) => onDotClick?.(model, data.payload)} />
            )
          ))}
          {/* Hidden models keep an empty series so the legend can bring them back. */}
          {Object.keys(filteredScatter).filter((m) => hiddenModels.has(m)).map((model) => (
            <Scatter key={model} name={model} data={[]} fill={COLORS[model]} r={4} />
          ))}

          {dragFrom != null && dragTo != null && (
            <ReferenceArea x1={Math.min(dragFrom, dragTo)} x2={Math.max(dragFrom, dragTo)}
              strokeOpacity={0} fill="var(--foreground)" fillOpacity={0.08} />
          )}

          {/* The curve last, so it draws on top of its own scatter. */}
          {modelsWithCurve.map((model) => (
            <Line key={model} type="monotone" dataKey={model} stroke={COLORS[model]}
              strokeWidth={2.5} dot={false} connectNulls legendType="none"
              hide={hiddenModels.has(model)} isAnimationActive={false} />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
      </div>

      {/* Age range: a tap does on a phone what a drag does with a mouse. */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-[var(--muted)]">Ålder:</span>
        {([
          { label: "Hela spannet", from: 0, to: chartXMax },
          { label: "0–3 år", from: 0, to: 3 },
          { label: "3–6 år", from: 3, to: 6 },
          { label: "6–10 år", from: 6, to: 10 },
        ] as const)
          .filter((r) => r.from < chartXMax)
          .map((r) => {
            const isAll = r.from === 0 && r.to === chartXMax;
            const active = isAll ? zoom === null : zoom?.from === r.from && zoom?.to === r.to;
            return (
              <button
                key={r.label}
                onClick={() => {
                  setZoom(isAll ? null : { from: r.from, to: Math.min(r.to, chartXMax) });
                  track("chart_zoom", { from: r.from, to: r.to, how: "button" });
                }}
                aria-pressed={active}
                className={`px-3 py-1.5 rounded-full border transition ${
                  active
                    ? "bg-[var(--foreground)] text-white border-[var(--foreground)]"
                    : "bg-white text-[var(--muted)] border-[var(--border)] hover:border-[var(--muted)]"
                }`}
              >
                {r.label}
              </button>
            );
          })}
        {zoom && (
          <span className="text-[var(--muted)] hidden sm:inline">
            — dra i diagrammet för att zooma fritt
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
        <button
          onClick={() => {
            const next = colorBy === "model" ? "mileage" : "model";
            setColorBy(next);
            track("chart_color_by", { value: next });
          }}
          aria-pressed={colorBy === "mileage"}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition ${
            colorBy === "mileage"
              ? "bg-[var(--foreground)] text-white border-[var(--foreground)]"
              : "bg-white text-[var(--muted)] border-[var(--border)] hover:border-[var(--muted)]"
          }`}
        >
          Färga efter miltal
        </button>
        {colorBy === "mileage" && (
          <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--muted)]">
            {MILEAGE_RAMP.map((c, i) => (
              <span key={c} className="inline-flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ background: c }} />
                {MILEAGE_LABELS[i]}
              </span>
            ))}
            <span className="opacity-80">mil</span>
          </span>
        )}
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
          under prisestimatet. Klicka på en punkt för att se bilen.
        </p>
      )}

      {!hasPredictions && (
        <p className="text-center py-2 text-[var(--muted)] text-sm">
          Ingen prediktionskurva tillgänglig för &ldquo;{fuelFilter}&rdquo;.
          Otillräckligt med datapunkter för detta bränsle.
        </p>
      )}

      {hasPredictions && visibleModelsWithCurve.length > 0 && (
        <p className="text-xs text-[var(--muted)] text-center">
          Linjen är prisestimatet. Det mörkare bandet är där hälften av
          annonserna ligger, det ljusare 95&nbsp;% av dem — båda räknade från
          faktiska avvikelser, inte från en antagen normalfördelning.
        </p>
      )}
    </div>
  );
}
