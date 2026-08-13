import { getDb } from "@/app/lib/db";
import {
  cleanFuel, dealOf, predictPrice, type RegressionModel,
} from "@/app/lib/predict";
import { priceBreakdown, type Breakdown } from "@/app/lib/price-breakdown";
import { slugify } from "@/app/lib/model-page";

/**
 * The verdict on one specific car — the bridge between researching a model and
 * standing in front of an actual ad.
 *
 * Four agents arrived at this independently: the journey audit found that the
 * site convinces a buyer a fair price is knowable and then cannot state the
 * fair price of the car in front of her; the blank-slate product agent picked
 * "the second opinion" as the one thing worth building on this data; the
 * share analysis found the per-candidate verdict is the highest-volume share
 * moment of the whole purchase; and the monetization review found it is the
 * only thing no Swedish incumbent gives away. This module is that verdict,
 * computed server-side so the page carrying it is a static, screenshot-stable
 * document rather than an app state.
 */

export interface ValuationInput {
  year: number;
  mileage: number;
  /** Swedish fuel label as entered ("Hybrid", "Laddhybrid", "Bensin"…). */
  fuel: string;
  hp?: number;
  /** Asking price, if the user has an ad in hand. */
  price?: number;
  seller?: "dealer" | "private";
}

export interface Valuation {
  modelKey: string;
  label: string;
  slug: string;
  input: Required<Pick<ValuationInput, "year" | "mileage" | "fuel">> &
    Pick<ValuationInput, "hp" | "price" | "seller">;
  age: number;
  estimate: number;
  /** ± kronor for the middle two thirds — same measure as everywhere else. */
  band: number;
  bandPct: number;
  breakdown: Breakdown | null;
  /** Only when an asking price was given. */
  residual: number | null;
  deal: "great" | "good" | null;
  sampleSize: number;
  updated: string;
  /**
   * Refusals, stated on letterhead. `no-estimate`: the model's data is too
   * spread for any estimate (Land Cruiser). `outside-data`: this particular
   * car sits outside what the model has seen (age beyond listings, estimate
   * far from its year's actual market) — the honest answer is "we cannot
   * price this confidently", which is itself protection against anchoring.
   */
  refusal: "no-estimate" | "outside-data" | null;
  cohortMedian: number | null;
}

const MAX_USEFUL_UNCERTAINTY = 25;

export async function getValuation(
  modelSlug: string, input: ValuationInput,
): Promise<Valuation | null> {
  const sql = getDb();
  const rows = await sql`
    SELECT data - 'mileageCost' AS data, to_char(updated_at, 'YYYY-MM-DD') AS d
    FROM web_cache WHERE key = 'aggregates'`;
  const agg = rows[0]?.data;
  if (!agg?.modelConfig) return null;

  const entry = Object.entries(agg.modelConfig).find(
    ([, cfg]) => slugify((cfg as { label: string }).label) === modelSlug,
  );
  if (!entry) return null;
  const [modelKey, cfg] = entry as [string, { label: string }];

  const reg: RegressionModel | undefined = agg.regression?.[modelKey];
  const summary = agg.summary?.[modelKey];
  const byAge: { age: number; count: number; median: number }[] =
    agg.priceByAge?.[modelKey] ?? [];

  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - input.year);
  const fuelInternal = cleanFuel(input.fuel);
  const seller = input.seller ?? "dealer";

  const bandPct = reg?.typicalSpread != null
    ? reg.typicalSpread * 100
    : reg?.residual_se_log != null
      ? (Math.exp(reg.residual_se_log) - 1) * 100
      : null;

  const base: Omit<Valuation, "estimate" | "band" | "breakdown" | "residual" | "deal" | "refusal"> = {
    modelKey,
    label: cfg.label,
    slug: modelSlug,
    input: { year: input.year, mileage: input.mileage, fuel: input.fuel,
             hp: input.hp, price: input.price, seller: input.seller },
    age,
    bandPct: bandPct != null ? Math.round(bandPct) : 0,
    sampleSize: summary?.count ?? 0,
    updated: rows[0]?.d ?? "",
    cohortMedian: null,
  };

  // A model whose spread exceeds the threshold gets no estimate anywhere on
  // the site; this page must not be the back door around that.
  if (!reg || bandPct == null || bandPct > MAX_USEFUL_UNCERTAINTY) {
    return { ...base, estimate: 0, band: 0, breakdown: null,
             residual: null, deal: null, refusal: "no-estimate" };
  }

  // Unknown attributes sit at the model's medians (predictPrice treats 0 as
  // "use the median" for hp and equipment), so the estimate describes a
  // typically equipped car of this spec rather than a stripped one.
  const estimate = predictPrice(
    reg, age, input.mileage, fuelInternal,
    input.hp ?? 0, 0, seller === "dealer",
    (reg.typicalAwd ?? 0) >= 1, 0, "",
    reg.medianPremiumEquip ?? 0,
    reg.generations ?? [],
  );

  // The estimate must be plausible against that model year's actual market —
  // the same self-calibrating ceiling the deal lists use. Also refuse ages the
  // model has never seen listings for.
  const cohort = byAge.find((p) => p.age === age && p.count >= 5) ?? null;
  const maxSeenAge = Math.max(...byAge.filter((p) => p.count >= 5).map((p) => p.age), 0);
  const ceiling = cohort
    ? cohort.median * Math.exp(1.96 * reg.residual_se_log)
    : null;
  const floor = cohort
    ? cohort.median / Math.exp(1.96 * reg.residual_se_log)
    : null;
  const outside =
    age > maxSeenAge + 1 ||
    (ceiling != null && estimate > ceiling) ||
    (floor != null && estimate < floor);

  if (outside || estimate <= 0) {
    return { ...base, cohortMedian: cohort?.median ?? null,
             estimate: 0, band: 0, breakdown: null,
             residual: null, deal: null, refusal: "outside-data" };
  }

  const breakdown = priceBreakdown(reg, {
    age, mileage: input.mileage, fuel: fuelInternal,
    hp: input.hp ?? 0, seller, predicted: estimate,
  });

  const residual = input.price != null && input.price > 0
    ? input.price - estimate
    : null;
  const deal = input.price != null && input.price > 0
    ? dealOf(input.price, estimate, reg)
    : null;

  return {
    ...base,
    cohortMedian: cohort?.median ?? null,
    estimate,
    band: Math.round((estimate * bandPct) / 100),
    breakdown,
    residual,
    deal,
    refusal: null,
  };
}

/** Parse and clamp the intyg URL parameters. Returns null if unusable. */
export function parseValuationParams(
  sp: Record<string, string | string[] | undefined>,
): ValuationInput | null {
  const num = (v: string | string[] | undefined): number | undefined => {
    const n = Number(Array.isArray(v) ? v[0] : v);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };
  const str = (v: string | string[] | undefined): string | undefined =>
    Array.isArray(v) ? v[0] : v;

  const year = num(sp.ar);
  const mileage = num(sp.mil);
  const fuel = str(sp.drivmedel);
  if (!year || year < 1990 || year > new Date().getFullYear() + 1) return null;
  if (mileage == null || mileage > 100_000) return null;
  if (!fuel) return null;

  const sellerRaw = str(sp.saljare);
  return {
    year, mileage: Math.round(mileage), fuel,
    hp: num(sp.hk),
    price: num(sp.pris),
    seller: sellerRaw === "privat" ? "private" : sellerRaw === "handlare" ? "dealer" : undefined,
  };
}
