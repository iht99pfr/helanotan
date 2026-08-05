import { getDb } from "@/app/lib/db";
import {
  cleanFuel, dealOf, isAwdDrivetrain, predictPrice, premiumEquipCount,
  type RegressionModel,
} from "@/app/lib/predict";

/**
 * Everything a /bilar/[modell] page renders, assembled on the server.
 *
 * These pages exist because the site has no organic audience: one Google
 * referral in the last thirty days, against a homepage that ships megabytes of
 * JSON before a single number appears. A crawler that renders nothing sees
 * nothing to index. So every figure here is computed server-side and lands in
 * the HTML — no client fetch, no loading state, nothing to hydrate before the
 * page means something.
 */

export interface YearRow {
  year: number;
  age: number;
  count: number;
  median: number;
  /** Median price of the next-younger year minus this one, i.e. one year of loss. */
  lossFromYounger: number | null;
}

export interface DealRow {
  id: string;
  url: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  hp: number;
  seller: string;
  predicted: number;
  residual: number;
  deal: "great" | "good";
}

export interface ModelPage {
  key: string;
  slug: string;
  label: string;
  color: string;
  count: number;
  activeCount: number;
  avgPrice: number;
  avgMileage: number;
  yearRange: [number, number];
  /** Newest year with enough listings to anchor retention, and its median. */
  anchorYear: number | null;
  anchorPrice: number | null;
  years: YearRow[];
  retention3: number | null;
  retention5: number | null;
  /** Predicted value lost in the first year, in kronor and per month. */
  firstYearLoss: number | null;
  /** Percent of current value lost per 1 000 mil, from the fitted model. */
  mileagePctPer1000: number | null;
  /** Typical prediction error in kronor at the median price — plainer than R². */
  uncertaintyPct: number | null;
  sampleSize: number | null;
  fuelOptions: string[];
  deals: DealRow[];
  /** See ModelIndexEntry.indexable. */
  indexable: boolean;
}

export interface ModelIndexEntry {
  key: string;
  slug: string;
  label: string;
  color: string;
  count: number;
  activeCount: number;
  avgPrice: number;
  /**
   * Whether the page has enough to say to be worth indexing. A model with one
   * year of data renders one table row and no price estimate — thin content,
   * and Google judges quality partly site-wide, so a handful of near-empty
   * pages would tax the very pages this whole phase exists to rank.
   */
  indexable: boolean;
}

/** "Volvo XC40 Recharge" -> "volvo-xc40-recharge". */
export function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/å|ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const MIN_YEAR_COUNT = 5;
/** A page needs this many year rows before it says anything a buyer can use. */
const MIN_YEAR_ROWS_TO_INDEX = 4;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadAggregates(): Promise<any | null> {
  const sql = getDb();
  const rows = await sql`
    SELECT data - 'mileageCost' AS data FROM web_cache WHERE key = 'aggregates'`;
  return rows.length ? rows[0].data : null;
}

async function activeCounts(): Promise<Record<string, number>> {
  const sql = getDb();
  const rows = await sql`
    SELECT model_key, count(*)::int AS n
    FROM cars_enriched
    WHERE is_active AND model_key IS NOT NULL
      AND (exclusion_tags = '[]'::jsonb OR exclusion_tags IS NULL)
    GROUP BY model_key`;
  const out: Record<string, number> = {};
  for (const r of rows) out[r.model_key] = r.n;
  return out;
}

/** Every model that has a page, for the index, the sitemap and internal links. */
export async function getModelIndex(): Promise<ModelIndexEntry[]> {
  const agg = await loadAggregates();
  if (!agg?.modelConfig) return [];
  const active = await activeCounts();
  const entries: ModelIndexEntry[] = [];
  for (const [key, cfg] of Object.entries(agg.modelConfig) as [string, {
    label: string; color: string;
  }][]) {
    const summary = agg.summary?.[key];
    if (!summary?.count) continue;
    const byAge: { age: number; count: number }[] = agg.priceByAge?.[key] ?? [];
    const yearRows = byAge.filter((p) => p.age >= 0 && p.count >= MIN_YEAR_COUNT).length;
    entries.push({
      key,
      slug: slugify(cfg.label),
      label: cfg.label,
      color: cfg.color,
      count: summary.count,
      activeCount: active[key] ?? 0,
      avgPrice: Math.round(summary.avgPrice ?? 0),
      indexable: yearRows >= MIN_YEAR_ROWS_TO_INDEX,
    });
  }
  return entries.sort((a, b) => a.label.localeCompare(b.label, "sv"));
}

async function liveDeals(modelKey: string, reg: RegressionModel | undefined): Promise<DealRow[]> {
  if (!reg) return [];
  const sql = getDb();
  const rows = await sql`
    SELECT listing_id, url, model_year, price_sek, mileage_mil, fuel_type,
           horsepower, drivetrain, seller_type, equipment_count, car_age_years,
           wltp_range_km, ai_generation, ai_notable_equipment
    FROM cars_enriched
    WHERE is_active AND model_key = ${modelKey}
      AND (exclusion_tags = '[]'::jsonb OR exclusion_tags IS NULL)
      AND model_year >= 2005 AND price_sek > 0 AND mileage_mil >= 0
      AND car_age_years IS NOT NULL`;

  const scored: DealRow[] = [];
  for (const r of rows) {
    const fuel = cleanFuel(r.fuel_type);
    const price = Number(r.price_sek);
    const predicted = predictPrice(
      reg,
      Number(r.car_age_years) || 0,
      r.mileage_mil || 0,
      fuel,
      r.horsepower || 0,
      r.equipment_count || 0,
      (r.seller_type || "").toLowerCase() === "dealer",
      isAwdDrivetrain(r.drivetrain || ""),
      r.wltp_range_km || 0,
      r.ai_generation || "",
      premiumEquipCount(r.ai_notable_equipment),
      reg.generations || [],
    );
    const grade = dealOf(price, predicted, reg);
    if (!grade) continue;
    scored.push({
      id: r.listing_id,
      url: r.url || `https://www.blocket.se/mobility/item/${r.listing_id}`,
      year: r.model_year,
      price,
      mileage: r.mileage_mil || 0,
      fuel,
      hp: r.horsepower || 0,
      seller: r.seller_type || "",
      predicted,
      residual: price - predicted,
      deal: grade,
    });
  }
  // Biggest saving first — the reason anyone would scroll this far.
  scored.sort((a, b) => a.residual - b.residual);
  return scored.slice(0, 8);
}

export async function getModelPage(slug: string): Promise<ModelPage | null> {
  const agg = await loadAggregates();
  if (!agg?.modelConfig) return null;

  const entry = Object.entries(agg.modelConfig).find(
    ([, cfg]) => slugify((cfg as { label: string }).label) === slug,
  );
  if (!entry) return null;
  const [key, cfg] = entry as [string, { label: string; color: string; fuelOptions: string[] }];

  const summary = agg.summary?.[key];
  if (!summary?.count) return null;

  const reg: RegressionModel | undefined = agg.regression?.[key];
  const byAge: { age: number; count: number; median: number }[] = agg.priceByAge?.[key] ?? [];
  const curve: { age: number; predicted: number }[] = agg.predictionCurves?.[key]?.all ?? [];
  const currentYear = new Date().getFullYear();

  // Age -1 exists in the data (next model year, already for sale). It is real
  // but it is not something anyone shopping today can reason about, so the
  // table starts at a brand-new car.
  const usable = byAge
    .filter((p) => p.age >= 0 && p.count >= MIN_YEAR_COUNT)
    .sort((a, b) => a.age - b.age);

  const years: YearRow[] = usable.map((p, i) => {
    const younger = i > 0 ? usable[i - 1] : null;
    return {
      year: currentYear - p.age,
      age: p.age,
      count: p.count,
      median: Math.round(p.median),
      lossFromYounger: younger ? Math.round(younger.median - p.median) : null,
    };
  });

  const anchor = usable[0] ?? null;
  const retentionAt = (age: number): number | null => {
    if (!anchor) return null;
    const target = usable.find((p) => p.age === age);
    if (!target || anchor.median <= 0) return null;
    return Math.round((target.median / anchor.median) * 100);
  };

  const curveAt = (age: number) => curve.find((p) => p.age === age)?.predicted ?? null;
  const c0 = curveAt(0);
  const c1 = curveAt(1);
  const firstYearLoss = c0 != null && c1 != null ? Math.round(c0 - c1) : null;

  let mileagePctPer1000: number | null = null;
  if (reg?.coefficients?.mileage_mil != null) {
    mileagePctPer1000 = (1 - Math.exp(reg.coefficients.mileage_mil * 1000)) * 100;
  }

  // residual_se_log is a proportional error because the model is fitted on
  // log(price), so it converts straight into "give or take X%" — which means
  // something to a buyer in a way that R² does not.
  const uncertaintyPct = reg?.residual_se_log != null
    ? Math.round((Math.exp(reg.residual_se_log) - 1) * 100)
    : null;

  const [active, deals] = await Promise.all([activeCounts(), liveDeals(key, reg)]);

  return {
    key,
    slug,
    label: cfg.label,
    color: cfg.color,
    count: summary.count,
    activeCount: active[key] ?? 0,
    avgPrice: Math.round(summary.avgPrice ?? 0),
    avgMileage: Math.round(summary.avgMileage ?? 0),
    yearRange: summary.yearRange ?? [currentYear, currentYear],
    anchorYear: anchor ? currentYear - anchor.age : null,
    anchorPrice: anchor ? Math.round(anchor.median) : null,
    years,
    retention3: retentionAt(3),
    retention5: retentionAt(5),
    firstYearLoss,
    mileagePctPer1000,
    uncertaintyPct,
    sampleSize: reg?.generations ? summary.count : null,
    fuelOptions: cfg.fuelOptions ?? [],
    deals,
    indexable: years.length >= MIN_YEAR_ROWS_TO_INDEX,
  };
}
