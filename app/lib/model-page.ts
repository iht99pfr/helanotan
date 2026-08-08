import { getDb } from "@/app/lib/db";
import {
  cleanFuel, dealOf, isAwdDrivetrain, isCredibleDeal, predictPrice,
  premiumEquipCount, type RegressionModel,
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
  /** False when the band is too wide to be information — see MAX_USEFUL_UNCERTAINTY. */
  estimateUsable: boolean;
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
/**
 * Past this, a price estimate is not an estimate.
 *
 * The band must be narrower than the thing it is estimating. At ±25% two cars in three
 * already land inside a range spanning half again; beyond that the number
 * carries no information. Toyota Land Cruiser reached ±44% —
 * "450 221 kr, give or take 474 434 kr" — because 63 listings were asked to
 * cover seven generations from a 1989 diesel at 85 000 kr to a 2024 300-series
 * at 1 249 000 kr — the 95% band on that is ±105%, i.e. "450 221 kr, give or
 * take 474 434 kr", with a negative lower bound. That is a nameplate, not a
 * model, and no regression fixes
 * it. Until the registry splits them the way it already splits Golf from Golf
 * GTI and Golf R, such a model reports medians and no estimate.
 *
 * Measured as one standard deviation — "typically within", about two cars in
 * three. The badges on the homepage used 1.96 SE while the model pages used
 * one, so the same XC60 was ±22% on one page and ±11% on the other. One
 * measure now, everywhere.
 */
const MAX_USEFUL_UNCERTAINTY = 25;
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

/**
 * The prediction has to be plausible against the cars it is being compared
 * with, or the "deal" is the model failing rather than the market slipping.
 *
 * A 2014 XC60 mislabelled Hybrid was predicted at 204 000 kr against a cohort
 * median of 146 000 and shown at the top of the page as "103 684 kr under
 * estimat"; a 16-year-old car with 22 000 mil at 35 000 kr was called a
 * bargain for the same reason. Both are the log model extrapolating at the
 * cheap, old end of its data.
 *
 * The bound is the model's own 95% band rather than a number picked to make
 * one bad case disappear: if the estimate for a single car sits further above
 * what that model year actually sells for than the model's stated uncertainty
 * allows, the estimate is outside its own competence and says nothing about
 * the listing. It calibrates itself per model — tight for a Polestar 4 at
 * ±10%, looser for a Golf at ±39%.
 */
function cohortCeiling(reg: RegressionModel, cohortMedian: number): number {
  return cohortMedian * Math.exp(1.96 * reg.residual_se_log);
}

async function liveDeals(
  modelKey: string,
  reg: RegressionModel | undefined,
  medianByAge: Map<number, number>,
): Promise<DealRow[]> {
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
    if (!grade || !isCredibleDeal(price, predicted, reg)) continue;
    const cohort = medianByAge.get(Math.round(Number(r.car_age_years) || 0));
    if (cohort && predicted > cohortCeiling(reg, cohort)) continue;
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

export interface TopDeal extends DealRow {
  modelKey: string;
  label: string;
  slug: string;
  pctUnder: number;
}

/**
 * The best-priced live listings across every model, for the homepage.
 *
 * The homepage used to server-render nothing a buyer could act on: the charts
 * are client-only, and the first clickable car sat 4 530 px down on mobile
 * against an average scroll depth that reaches 5 005 px. Outbound clicks fired
 * in 2 of 121 sessions. This puts real cars, with real links, in the HTML near
 * the top — which serves the reader and the crawler with the same markup.
 */
export async function getTopDeals(limit = 6): Promise<TopDeal[]> {
  const agg = await loadAggregates();
  if (!agg?.regression) return [];

  const sql = getDb();
  const rows = await sql`
    SELECT listing_id, url, model_key, model_year, price_sek, mileage_mil,
           fuel_type, horsepower, drivetrain, seller_type, equipment_count,
           car_age_years, wltp_range_km, ai_generation, ai_notable_equipment
    FROM cars_enriched
    WHERE is_active AND model_key IS NOT NULL
      AND (exclusion_tags = '[]'::jsonb OR exclusion_tags IS NULL)
      AND model_year >= 2005 AND price_sek > 0 AND mileage_mil >= 0
      AND car_age_years IS NOT NULL`;

  // Cohort medians per model and age, so a prediction that has wandered
  // outside its own data cannot masquerade as a bargain — same guard the
  // model pages use.
  const cohorts = new Map<string, number>();
  // A model too thin to earn an indexable page is also too thin to tell a
  // seller they have underpriced. Polestar 3 fits 76 listings at R² 0.47 —
  // its estimate is not evidence, so it does not get to make the claim.
  const trusted = new Set<string>();
  for (const [key, points] of Object.entries(agg.priceByAge ?? {})) {
    let rows = 0;
    for (const p of points as { age: number; count: number; median: number }[]) {
      if (p.count >= MIN_YEAR_COUNT) {
        cohorts.set(`${key}:${p.age}`, p.median);
        if (p.age >= 0) rows++;
      }
    }
    const reg = agg.regression?.[key];
    const pct = reg?.residual_se_log != null
      ? (Math.exp(reg.residual_se_log) - 1) * 100 : Infinity;
    if (rows >= MIN_YEAR_ROWS_TO_INDEX && pct <= MAX_USEFUL_UNCERTAINTY) trusted.add(key);
  }

  const out: TopDeal[] = [];
  for (const r of rows) {
    const reg: RegressionModel | undefined = agg.regression[r.model_key];
    const cfg = agg.modelConfig?.[r.model_key];
    if (!reg || !cfg || !trusted.has(r.model_key)) continue;
    const price = Number(r.price_sek);
    const age = Number(r.car_age_years) || 0;
    const predicted = predictPrice(
      reg, age, r.mileage_mil || 0, cleanFuel(r.fuel_type), r.horsepower || 0,
      r.equipment_count || 0, (r.seller_type || "").toLowerCase() === "dealer",
      isAwdDrivetrain(r.drivetrain || ""), r.wltp_range_km || 0,
      r.ai_generation || "", premiumEquipCount(r.ai_notable_equipment),
      reg.generations || [],
    );
    if (dealOf(price, predicted, reg) !== "great") continue;
    if (!isCredibleDeal(price, predicted, reg)) continue;
    const cohort = cohorts.get(`${r.model_key}:${Math.round(age)}`);
    if (cohort && predicted > cohortCeiling(reg, cohort)) continue;
    const pct = Math.round((1 - price / predicted) * 100);
    if (pct <= 0) continue;
    out.push({
      id: r.listing_id,
      url: r.url || `https://www.blocket.se/mobility/item/${r.listing_id}`,
      modelKey: r.model_key,
      label: cfg.label,
      slug: slugify(cfg.label),
      year: r.model_year,
      price,
      mileage: r.mileage_mil || 0,
      fuel: cleanFuel(r.fuel_type),
      hp: r.horsepower || 0,
      seller: r.seller_type || "",
      predicted,
      residual: price - predicted,
      pctUnder: pct,
      deal: "great",
    });
  }

  // Rank by kronor saved, not by proportion.
  //
  // Percentage looks like the fairer measure and is the wrong one here: it
  // systematically surfaces the oldest, cheapest cars, which is exactly where
  // the model is weakest. Condition is unobserved and dominates at 300 000 km,
  // and the proportional mileage term stops discounting hard enough. Ranking
  // by percentage put a 2008 Land Cruiser and three cars from 2010 on the
  // homepage; ranking by kronor puts cars from the middle of the data, where
  // the estimate is worth something. The two-per-model cap below is what stops
  // the expensive models taking every slot.
  out.sort((a, b) => a.residual - b.residual);

  // At most two per model, so six cards describe six situations.
  const perModel = new Map<string, number>();
  const picked: TopDeal[] = [];
  for (const d of out) {
    const n = perModel.get(d.modelKey) ?? 0;
    if (n >= 2) continue;
    perModel.set(d.modelKey, n + 1);
    picked.push(d);
    if (picked.length >= limit) break;
  }
  return picked;
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

  // "Two cars in three land inside" is a claim about the middle two thirds, so
  // measure the middle two thirds: the 16th to 84th percentile of the observed
  // residuals. A standard deviation only says the same thing under a normal
  // distribution, and these are not normal — it was pulled upward by a handful
  // of extremes, making every model look vaguer than it is. Yaris reads 10%
  // rather than 15% on the identical data.
  const uncertaintyPct = reg?.typicalSpread != null
    ? Math.round(reg.typicalSpread * 100)
    : reg?.residual_se_log != null
      ? Math.round((Math.exp(reg.residual_se_log) - 1) * 100)
      : null;

  const medianByAge = new Map<number, number>(
    byAge.filter((p) => p.count >= MIN_YEAR_COUNT).map((p) => [p.age, p.median]),
  );
  const estimateUsable =
    uncertaintyPct != null && uncertaintyPct <= MAX_USEFUL_UNCERTAINTY;
  const [active, deals] = await Promise.all([
    activeCounts(),
    estimateUsable ? liveDeals(key, reg, medianByAge) : Promise.resolve([]),
  ]);

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
    estimateUsable,
    sampleSize: reg?.generations ? summary.count : null,
    fuelOptions: cfg.fuelOptions ?? [],
    deals,
    indexable: years.length >= MIN_YEAR_ROWS_TO_INDEX,
  };
}
