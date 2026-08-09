import type { RegressionModel } from "@/app/lib/predict";

/**
 * Why does this car cost what it costs?
 *
 * The scatter shows a threefold price range at a single age — a five-year-old
 * Yaris from 130 000 to 400 000 kr — and the site never explained it. It does
 * not need new data to: the estimate is a sum of coefficients, so it already
 * knows how much of the difference it attributes to mileage, to power, to the
 * seller. This walks that sum and reports each step in kronor.
 *
 * The walk starts from a typical car of the same age — median power, median
 * equipment, the model's most common fuel, sold by a dealer, at the mileage
 * this model accumulates in that many years — and changes one attribute at a
 * time to match the listing. Because the fit is on log(price) the steps
 * compound rather than add, so each is measured at the point it is applied and
 * the parts total the whole exactly.
 */

export interface BreakdownStep {
  label: string;
  detail: string;
  /** Kronor this attribute adds or removes, at the point it is applied. */
  delta: number;
}

export interface Breakdown {
  /** A typical car of this age, before any of this listing's specifics. */
  base: number;
  steps: BreakdownStep[];
  /** Where the walk lands. Equals the model's estimate for this listing. */
  predicted: number;
}

export interface BreakdownInput {
  age: number;
  mileage: number;
  fuel: string;
  hp: number;
  seller: string;
  /**
   * The model's actual estimate for this listing, as published with the point.
   *
   * The walk below can only account for what the point carries — age, power,
   * mileage, fuel, seller. The fitted model also used equipment, generation,
   * drivetrain and WLTP range, which the scatter payload does not include, so
   * the walk lands somewhere near the estimate but not on it. On a 2024 XC40
   * the gap was 14 560 kr, and the modal showed both numbers under two
   * different names — "Predikterat pris" and "Prisestimat" — inviting the
   * reader to wonder which one was the answer. Given the true value, the
   * difference becomes a named row instead of a contradiction.
   */
  predicted?: number;
  equipmentCount?: number;
  premiumEquipCount?: number;
  isAwd?: boolean;
  wltpRange?: number;
}

const FUEL_LABELS: Record<string, string> = {
  Hybrid: "Hybrid", PHEV: "Laddhybrid", Diesel: "Diesel",
  Petrol: "Bensin", Electric: "El",
};

/** The log-price of a feature vector under this model. */
function logPrice(reg: RegressionModel, f: Record<string, number>): number {
  let v = reg.intercept;
  for (const [key, coef] of Object.entries(reg.coefficients)) {
    v += coef * (f[key] ?? 0);
  }
  return v;
}

function featuresFor(reg: RegressionModel, o: {
  age: number; mileage: number; fuel: string; hp: number;
  equipment: number; premium: number; isDealer: number; isAwd: number;
  wltp: number;
}): Record<string, number> {
  const isElectric = o.fuel === "Electric" ? 1 : 0;
  const isPhev = o.fuel === "PHEV" ? 1 : 0;
  return {
    car_age_years: o.age,
    mileage_mil: o.mileage,
    horsepower: o.hp,
    equipment_count: o.equipment,
    is_hybrid: o.fuel === "Hybrid" ? 1 : 0,
    is_phev: isPhev,
    is_diesel: o.fuel === "Diesel" ? 1 : 0,
    is_electric: isElectric,
    is_dealer: o.isDealer,
    is_awd: o.isAwd,
    wltp_range_km: o.wltp,
    age_x_electric: o.age * isElectric,
    mileage_x_electric: o.mileage * isElectric,
    age_x_phev: o.age * isPhev,
    mileage_x_phev: o.mileage * isPhev,
    age_squared: o.age * o.age,
    mileage_squared: o.mileage * o.mileage,
    // Generation is left at the reference level throughout: the scatter does
    // not carry it, and guessing would put kronor against a fact we lack.
    is_oldest_gen: 0,
    is_middle_gen: 0,
    premium_equip_count: o.premium,
  };
}

const sv = (n: number) => Math.round(n).toLocaleString("sv-SE");

export function priceBreakdown(
  reg: RegressionModel | undefined,
  car: BreakdownInput,
): Breakdown | null {
  if (!reg?.log_transform || !reg.coefficients) return null;

  const annual = reg.annualMileage ?? 1500;
  const refFuel = reg.dominantFuel ?? "Petrol";
  const ref = {
    age: car.age,
    mileage: Math.round(annual * car.age),
    fuel: refFuel,
    hp: reg.medianHp,
    equipment: reg.medianEquipment,
    premium: reg.medianPremiumEquip ?? 0,
    isDealer: 1,
    isAwd: reg.typicalAwd ?? 0,
    wltp: 0,
  };

  const base = Math.exp(logPrice(reg, featuresFor(reg, ref)));
  const steps: BreakdownStep[] = [];
  const state = { ...ref };
  // Each step is priced where it lands, so the parts add up to the total.
  const apply = (label: string, detail: string, mutate: () => void) => {
    const before = Math.exp(logPrice(reg, featuresFor(reg, state)));
    mutate();
    const after = Math.exp(logPrice(reg, featuresFor(reg, state)));
    const delta = after - before;
    // Differences too small to deserve a line still move the total, so they
    // are not dropped — they fall through to the reconciling row below.
    if (Math.abs(delta) >= 1000) steps.push({ label, detail, delta });
  };

  if (car.fuel && car.fuel !== refFuel && FUEL_LABELS[car.fuel]) {
    apply("Bränsle", `${FUEL_LABELS[car.fuel]} i stället för ${FUEL_LABELS[refFuel] ?? refFuel}`,
      () => { state.fuel = car.fuel; });
  }
  if (car.hp > 0 && Math.abs(car.hp - reg.medianHp) >= 5) {
    const diff = car.hp - reg.medianHp;
    apply("Motorstyrka", `${car.hp} hk — ${diff > 0 ? "+" : "−"}${Math.abs(diff)} mot ${reg.medianHp} hk för modellen`,
      () => { state.hp = car.hp; });
  }
  if (Number.isFinite(car.mileage)) {
    const diff = car.mileage - ref.mileage;
    apply("Miltal", `${sv(car.mileage)} mil — ${diff > 0 ? "+" : "−"}${sv(Math.abs(diff))} mot ${sv(ref.mileage)} normalt vid ${car.age} år`,
      () => { state.mileage = car.mileage; });
  }
  if (car.isAwd != null && Number(car.isAwd) !== ref.isAwd) {
    apply("Drivning", car.isAwd ? "Fyrhjulsdrift" : "Tvåhjulsdrift",
      () => { state.isAwd = car.isAwd ? 1 : 0; });
  }
  if (car.premiumEquipCount != null && car.premiumEquipCount !== ref.premium) {
    apply("Premiumutrustning", `${car.premiumEquipCount} poster mot ${ref.premium} normalt`,
      () => { state.premium = car.premiumEquipCount!; });
  }
  if (car.seller) {
    const isDealer = car.seller === "dealer" ? 1 : 0;
    if (isDealer !== ref.isDealer) {
      apply("Säljare", isDealer ? "Handlare" : "Privatperson",
        () => { state.isDealer = isDealer; });
    }
  }

  // The published estimate is the truth; the walk explains as much of it as
  // the point's fields allow.
  const walked = Math.exp(logPrice(reg, featuresFor(reg, state)));
  const predicted = car.predicted ?? walked;

  const leftover = predicted - base - steps.reduce((sum, s) => sum + s.delta, 0);
  if (Math.abs(leftover) >= 500) {
    steps.push({
      label: "Utrustning och skick",
      detail: "utrustningsnivå, generation och drivning enligt annonsen",
      delta: leftover,
    });
  }

  return { base: Math.round(base), steps, predicted: Math.round(predicted) };
}
