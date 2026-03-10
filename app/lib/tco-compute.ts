import { computeOwnershipCosts, computeFuelCost } from "@/app/lib/tco-costs";
import type { FuelCostResult } from "@/app/lib/tco-costs";

export interface RegressionModel {
  intercept: number;
  coefficients: Record<string, number>;
  r2: number;
  rmse: number;
  residual_se_log: number;
  log_transform: boolean;
  n_samples: number;
  features: string[];
  medianHp: number;
  medianEquipment: number;
  typicalAwd: number;
}

export interface ScatterPoint {
  age: number;
  mileage: number;
  price: number;
  year: number;
  fuel: string;
}

export interface CurvePoint {
  age: number;
  predicted: number;
  lower: number;
  upper: number;
  mileage: number;
}

export interface ScenarioInputs {
  model: string;
  year: number;
  fuel: string;
  mileage: number;
  holdingYears: number;
  annualMileage: number;
}

export interface PredictionResult {
  buyPrice: number;
  sellPrice: number;
  valueLoss: number;
  monthlyDepreciation: number;
  annualDepreciation: number;
  costPerMil: number;
  confidence: number;
  totalCostWithFixed: number;
  monthlyTotal: number;
  insuranceTotal: number;
  serviceTotal: number;
  repairTotal: number;
  taxTotal: number;
  fuelCost: FuelCostResult;
  capitalCost: number;
}

export const FUEL_LABELS: Record<string, string> = {
  Hybrid: "Hybrid",
  PHEV: "Laddhybrid",
  Diesel: "Diesel",
  Petrol: "Bensin",
  Electric: "El",
};

/** Look up a prediction curve point by age, clamping predicted to >= 0 */
function curveAt(curve: CurvePoint[], age: number): CurvePoint | null {
  const point = curve.find((p) => p.age === age);
  if (!point) return null;
  return { ...point, predicted: Math.max(0, point.predicted) };
}

/** Get effective mileage coefficient including fuel interaction terms */
function getEffectiveMileageCoeff(reg: RegressionModel, fuel: string): number {
  let coeff = reg.coefficients.mileage_mil || 0;
  if (fuel === "PHEV") coeff += reg.coefficients.mileage_x_phev || 0;
  if (fuel === "Electric") coeff += reg.coefficients.mileage_x_electric || 0;
  return coeff;
}

export function computeTco(
  scenario: ScenarioInputs,
  reg: RegressionModel,
  curve: CurvePoint[] | undefined,
  electricShare?: number,
  interestRate?: number,
): PredictionResult | null {
  const currentAge = 2026 - scenario.year;
  const futureAge = currentAge + scenario.holdingYears;

  let buyPrice: number;
  let sellPrice: number;

  const buyPoint = curve && curveAt(curve, currentAge);
  const sellPoint = curve && curveAt(curve, futureAge);

  if (buyPoint && sellPoint) {
    const mileageCoeff = getEffectiveMileageCoeff(reg, scenario.fuel);
    const buyMileageDelta = scenario.mileage - buyPoint.mileage;
    if (reg.log_transform) {
      buyPrice = Math.max(0, Math.round(buyPoint.predicted * Math.exp(mileageCoeff * buyMileageDelta)));
    } else {
      buyPrice = Math.max(0, Math.round(buyPoint.predicted + mileageCoeff * buyMileageDelta));
    }
    sellPrice = Math.max(0, Math.round(sellPoint.predicted));
  } else {
    const futureMileage = scenario.mileage + scenario.annualMileage * scenario.holdingYears;

    let buyPred = reg.intercept;
    let sellPred = reg.intercept;
    for (const [key, coef] of Object.entries(reg.coefficients)) {
      const buyFeatures: Record<string, number> = {
        car_age_years: currentAge,
        mileage_mil: scenario.mileage,
        horsepower: reg.medianHp,
        equipment_count: reg.medianEquipment,
        is_hybrid: scenario.fuel === "Hybrid" ? 1 : 0,
        is_phev: scenario.fuel === "PHEV" ? 1 : 0,
        is_diesel: scenario.fuel === "Diesel" ? 1 : 0,
        is_electric: scenario.fuel === "Electric" ? 1 : 0,
        is_dealer: 0,
        is_awd: reg.typicalAwd,
        age_x_phev: scenario.fuel === "PHEV" ? currentAge : 0,
        age_x_electric: scenario.fuel === "Electric" ? currentAge : 0,
        mileage_x_phev: scenario.fuel === "PHEV" ? scenario.mileage : 0,
        mileage_x_electric: scenario.fuel === "Electric" ? scenario.mileage : 0,
        age_squared: currentAge * currentAge,
        mileage_squared: scenario.mileage * scenario.mileage,
      };
      buyPred += coef * (buyFeatures[key] || 0);

      const sellFeatures: Record<string, number> = {
        ...buyFeatures,
        car_age_years: futureAge,
        mileage_mil: futureMileage,
        age_x_phev: scenario.fuel === "PHEV" ? futureAge : 0,
        age_x_electric: scenario.fuel === "Electric" ? futureAge : 0,
        mileage_x_phev: scenario.fuel === "PHEV" ? futureMileage : 0,
        mileage_x_electric: scenario.fuel === "Electric" ? futureMileage : 0,
        age_squared: futureAge * futureAge,
        mileage_squared: futureMileage * futureMileage,
      };
      sellPred += coef * (sellFeatures[key] || 0);
    }
    if (reg.log_transform) {
      buyPred = Math.exp(buyPred);
      sellPred = Math.exp(sellPred);
    }
    buyPrice = Math.max(0, Math.round(buyPred));
    sellPrice = Math.max(0, Math.round(sellPred));
  }

  const valueLoss = Math.max(0, buyPrice - sellPrice);
  const months = scenario.holdingYears * 12;
  const totalMilesDriven = scenario.annualMileage * scenario.holdingYears;

  const costs = computeOwnershipCosts(scenario.model, scenario.fuel, currentAge, scenario.holdingYears);
  const insuranceTotal = costs.insurance;
  const serviceTotal = costs.service;
  const repairTotal = costs.repair;
  const taxTotal = costs.tax;
  const fuelCost = computeFuelCost(scenario.model, scenario.fuel, scenario.annualMileage, scenario.holdingYears, electricShare);

  const rate = interestRate ?? 0;
  const avgCapital = (buyPrice + sellPrice) / 2;
  const capitalCost = Math.round(avgCapital * (rate / 100) * scenario.holdingYears);

  const fixedCosts = insuranceTotal + serviceTotal + repairTotal + taxTotal + fuelCost.total + capitalCost;
  const totalCost = valueLoss + fixedCosts;

  return {
    buyPrice,
    sellPrice,
    valueLoss,
    monthlyDepreciation: Math.round(valueLoss / months),
    annualDepreciation: Math.round(valueLoss / scenario.holdingYears),
    costPerMil: totalMilesDriven > 0 ? Math.round(totalCost / totalMilesDriven) : 0,
    confidence: reg.residual_se_log,
    totalCostWithFixed: totalCost,
    monthlyTotal: Math.round(totalCost / months),
    insuranceTotal,
    serviceTotal,
    repairTotal,
    taxTotal,
    fuelCost,
    capitalCost,
  };
}

export function getMedianMileage(scatter: ScatterPoint[], year: number): number {
  const points = scatter.filter((p) => p.year === year);
  if (points.length < 3) return Math.max(0, (2026 - year) * 1500);
  const sorted = points.map((p) => p.mileage).sort((a, b) => a - b);
  return Math.round(sorted[Math.floor(sorted.length / 2)] / 100) * 100;
}
