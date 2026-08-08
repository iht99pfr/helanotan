/**
 * The regression the Python pipeline fitted, evaluated in TypeScript.
 *
 * The coefficients live in `web_cache.aggregates.regression` and are applied
 * identically here and in the pipeline; the feature list is frozen by a test
 * on the Python side. Kept in its own module because two very different
 * callers need it — the listings API and the per-model pages — and a second
 * copy would be a second chance to drift from the fitted model.
 */

export interface RegressionModel {
  intercept: number;
  coefficients: Record<string, number>;
  residual_se_log: number;
  /** Log-residual cutoffs marking the cheapest 5% and 20% of this model's
      listings. Absent on payloads published before the switch. */
  dealGreatCut?: number;
  dealGoodCut?: number;
  log_transform: boolean;
  medianHp: number;
  medianEquipment: number;
  typicalAwd: number;
  generations: string[];
}

export const PREMIUM_EQUIPMENT = new Set([
  "panorama_roof", "ventilated_seats", "heads_up_display", "jbl", "leather_seats",
  "harman_kardon", "bowers_wilkins", "air_suspension", "massage_seats",
]);

export function cleanFuel(raw: string): string {
  const f = (raw || "").toLowerCase();
  if (f.includes("laddhybrid") || f.includes("plug")) return "PHEV";
  if (f.includes("hybrid")) return "Hybrid";
  if (f.includes("diesel")) return "Diesel";
  if (f.includes("bensin")) return "Petrol";
  if (f.includes("el")) return "Electric";
  return "Other";
}

export function predictPrice(
  reg: RegressionModel, age: number, mileage: number, fuel: string,
  hp: number, equipmentCount: number, isDealer: boolean, isAwd: boolean,
  wltpRange: number, generation: string, premiumEquipCount: number,
  modelGenerations: string[],
): number {
  const isElectric = fuel === "Electric" ? 1 : 0;
  const isPhev = fuel === "PHEV" ? 1 : 0;

  // Classify generation: newest = reference, oldest = is_oldest_gen, middle = is_middle_gen
  let isOldestGen = 0;
  let isMiddleGen = 0;
  if (generation && modelGenerations.length >= 2) {
    const sorted = [...modelGenerations].sort();
    if (generation === sorted[0]) isOldestGen = 1;
    else if (sorted.length >= 3 && generation === sorted[1]) isMiddleGen = 1;
  }

  const features: Record<string, number> = {
    car_age_years: age,
    mileage_mil: mileage,
    horsepower: hp || reg.medianHp,
    equipment_count: equipmentCount || reg.medianEquipment,
    is_hybrid: fuel === "Hybrid" ? 1 : 0,
    is_phev: isPhev,
    is_diesel: fuel === "Diesel" ? 1 : 0,
    is_electric: isElectric,
    is_dealer: isDealer ? 1 : 0,
    is_awd: isAwd ? 1 : 0,
    wltp_range_km: wltpRange || 0,
    age_x_electric: age * isElectric,
    mileage_x_electric: mileage * isElectric,
    age_x_phev: age * isPhev,
    mileage_x_phev: mileage * isPhev,
    age_squared: age * age,
    mileage_squared: mileage * mileage,
    is_oldest_gen: isOldestGen,
    is_middle_gen: isMiddleGen,
    premium_equip_count: premiumEquipCount,
  };

  let predicted = reg.intercept;
  for (const [key, coef] of Object.entries(reg.coefficients)) {
    predicted += coef * (features[key] || 0);
  }
  // Log-transform: coefficients predict log(price), so exponentiate
  if (reg.log_transform) {
    predicted = Math.exp(predicted);
  }
  return Math.max(0, Math.round(predicted));
}

/**
 * Deal grade, scored in log space so the thresholds mean the same thing for a
 * 90 000 kr Golf and a 900 000 kr Defender. Must match the Python pipeline's
 * thresholds — there is a test pinning the two together.
 */
export function dealOf(
  price: number, predicted: number, reg: RegressionModel,
): "great" | "good" | null {
  if (!reg.log_transform || predicted <= 0 || price <= 0) return null;
  const resid = Math.log(price) - Math.log(predicted);

  // Percentiles of the model's own residuals, published by the pipeline. They
  // replace fixed multiples of the residual standard error, which only
  // correspond to a share of listings when the residuals are normal — measured
  // across the 17 models they are not, with excess kurtosis from 0.1 to 58.9.
  // That mismatch is why the site advertised "~7%" and "~23%" while actually
  // flagging 5.0% and 14.1%.
  if (reg.dealGreatCut != null && reg.dealGoodCut != null) {
    if (resid <= reg.dealGreatCut) return "great";
    if (resid <= reg.dealGoodCut) return "good";
    return null;
  }

  // Payload published before the switch; keep the old behaviour rather than
  // silently grading nothing.
  const logScore = resid / reg.residual_se_log;
  if (logScore <= -1.5) return "great";
  if (logScore <= -0.75) return "good";
  return null;
}

/**
 * Past this far below the estimate, the price is not a bargain — it is a fact
 * about the car that the listing did not mention.
 *
 * A 2010 Golf at 20 000 kr against a 60 714 kr estimate sits 6.6 residual
 * standard errors below the model. Nobody sells a sound car at a third of its
 * value; that is damage, a failed inspection, or a project. Showing it as
 * "67% under estimat" costs more credibility than the listing could ever
 * repay, and it is exactly what ranking by percentage surfaces first, because
 * proportional error is largest at the cheap end.
 *
 * Three standard errors is roughly one listing in a thousand under a normal
 * distribution, and the residuals here are heavier-tailed than that — so this
 * removes a handful of cars per model, not a category.
 */
export const IMPLAUSIBLE_SE = 3.0;

export function isCredibleDeal(
  price: number, predicted: number, reg: RegressionModel,
): boolean {
  if (!reg.log_transform || predicted <= 0 || price <= 0) return false;
  const logScore = (Math.log(price) - Math.log(predicted)) / reg.residual_se_log;
  return logScore > -IMPLAUSIBLE_SE;
}

/** Premium-equipment count from the AI-extracted list on a listing row. */
export function premiumEquipCount(raw: unknown): number {
  if (!Array.isArray(raw)) return 0;
  return raw.filter((e) => typeof e === "string" && PREMIUM_EQUIPMENT.has(e)).length;
}

export function isAwdDrivetrain(drivetrain: string): boolean {
  const d = (drivetrain || "").toLowerCase();
  return d.includes("awd") || d.includes("4wd") || d.includes("fyrhjuls");
}
