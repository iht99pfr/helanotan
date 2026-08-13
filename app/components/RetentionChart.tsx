"use client";

import React from "react";
import {
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
} from "recharts";
import { getColorsMap } from "@/app/lib/model-config";
import type { ModelConfigMap } from "@/app/lib/model-config";

interface RetentionPoint { age: number; retention: number; }
interface PredictionPoint { age: number; predicted: number; lower: number; upper: number; p25?: number; p75?: number; }

interface Props {
  retention: Record<string, { newPrice: number; points: RetentionPoint[] }>;
  predictionCurves?: Record<string, Record<string, PredictionPoint[]>>;
  hiddenModels: Set<string>;
  onToggleModel: (model: string) => void;
  modelConfig: ModelConfigMap;
  fuelFilter: string;
  maxAgePerModel?: Record<string, number>;
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
const displayName = (key: string) => key.replace(/([a-z0-9])([A-Z])/g, "$1 $2");

export default function RetentionChart({ retention, predictionCurves, hiddenModels, onToggleModel, modelConfig, fuelFilter, maxAgePerModel }: Props) {
  const COLORS = getColorsMap(modelConfig);
  const hasPredictions = predictionCurves && Object.keys(predictionCurves).length > 0;
  const internalFuel = FUEL_MAP[fuelFilter] || fuelFilter;
  const curveKey = internalFuel === "All" ? "all" : internalFuel;

  // When a specific fuel is selected, derive retention from prediction curves
  const useFuelCurves = curveKey !== "all" && hasPredictions;

  const allAges = new Set<number>();
  if (useFuelCurves) {
    // Collect ages from per-fuel prediction curves
    for (const model of Object.keys(retention)) {
      const curve = predictionCurves![model]?.[curveKey];
      if (curve) curve.forEach((p) => allAges.add(p.age));
    }
  } else {
    Object.values(retention).forEach((r) => r.points.forEach((p) => allAges.add(p.age)));
  }
  const sortedAges = [...allAges].sort((a, b) => a - b).filter((a) => a <= 15);

  const data = sortedAges.map((age) => {
    const point: Record<string, number | number[]> = { age };
    for (const [model, r] of Object.entries(retention)) {
      // Don't extrapolate beyond the oldest actual data point
      const modelMax = maxAgePerModel?.[model];
      if (modelMax != null && age > modelMax) continue;
      if (useFuelCurves) {
        // Derive retention from fuel-specific prediction curve
        const curve = predictionCurves![model]?.[curveKey];
        if (curve) {
          const basePoint = curve.find((p) => p.age === 0) || curve[0];
          const agePoint = curve.find((p) => p.age === age);
          if (basePoint && agePoint && basePoint.predicted > 0) {
            const retPct = Math.min(100, (agePoint.predicted / basePoint.predicted) * 100);
            point[model] = Math.round(retPct * 10) / 10;
            const lo = agePoint.p25 ?? agePoint.lower;
            const hi = agePoint.p75 ?? agePoint.upper;
            point[`${model}_range`] = [
              Math.round(Math.max(0, (lo / basePoint.predicted) * 100) * 10) / 10,
              Math.round(Math.max(0, (hi / basePoint.predicted) * 100) * 10) / 10,
            ];
          }
        }
      } else {
        const match = r.points.find((p) => p.age === age);
        if (match) point[model] = Math.min(match.retention, 100);
        if (hasPredictions) {
          const curve = predictionCurves![model]?.["all"];
          const predMatch = curve?.find((p) => p.age === age);
          if (predMatch && r.newPrice > 0) {
            const lo = predMatch.p25 ?? predMatch.lower;
            const hi = predMatch.p75 ?? predMatch.upper;
            point[`${model}_range`] = [
              Math.round(Math.max(0, (lo / r.newPrice) * 100) * 10) / 10,
              Math.round(Math.max(0, (hi / r.newPrice) * 100) * 10) / 10,
            ];
          }
        }
      }
    }
    return point;
  });

  // Enforce monotonic decrease on retention values
  const models = Object.keys(retention);
  for (const model of models) {
    let prevVal = 101;
    for (const point of data) {
      const val = point[model];
      if (typeof val === "number") {
        if (val > prevVal) {
          point[model] = prevVal;
        } else {
          prevVal = val;
        }
      }
    }
  }

  return (
    <div className="h-[300px] sm:h-[450px]">
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis dataKey="age" type="number" ticks={AGE_TICKS} domain={[0, 15]}
          tick={{ fill: "var(--muted)", fontSize: 11 }}
          label={{ value: "Ålder (år)", position: "bottom", fill: "var(--muted)", fontSize: 10, offset: 5 }} />
        <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} domain={[0, 100]}
          ticks={[0, 25, 50, 75, 100]} allowDataOverflow
          tickFormatter={(v: number) => `${v}%`}
          width={40} />
        <Tooltip
          contentStyle={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 8 }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: any, name: any) => {
            if (typeof name === "string" && name.includes("_range")) return null;
            return [`${Number(value || 0).toFixed(1)}%`, displayName(String(name))];
          }}
          labelFormatter={(label: any) => `Ålder: ${label} år`}
        />
        <Legend verticalAlign="top" height={36} content={renderLegend(hiddenModels, onToggleModel)} />
        <ReferenceLine y={50} stroke="var(--muted)" strokeDasharray="6 4"
          label={{ value: "50%", fill: "var(--muted)", position: "right" }} />
        {hasPredictions && models.map((model) => (
          <Area key={`${model}_band`} dataKey={`${model}_range`} stroke="none"
            fill={COLORS[model]} fillOpacity={hiddenModels.has(model) ? 0 : 0.1}
            connectNulls type="monotone" legendType="none" />
        ))}
        {models.map((model) => (
          <Line key={model} type="monotone" dataKey={model} stroke={COLORS[model]}
            strokeWidth={2.5} dot={{ r: 3, fill: COLORS[model] }} connectNulls
            hide={hiddenModels.has(model)} />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
    </div>
  );
}
