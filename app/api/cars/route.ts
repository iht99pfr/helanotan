import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";
import {
  cleanFuel, dealOf, isAwdDrivetrain, predictPrice, premiumEquipCount,
  type RegressionModel,
} from "@/app/lib/predict";

export const dynamic = "force-dynamic";

// Cache regression data in module scope (refreshed per cold start)
let regressionCache: Record<string, RegressionModel> | null = null;
let regressionCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getRegression(sql: ReturnType<typeof getDb>): Promise<Record<string, RegressionModel>> {
  if (regressionCache && Date.now() - regressionCacheTime < CACHE_TTL) {
    return regressionCache;
  }
  const rows = await sql`SELECT data FROM web_cache WHERE key = 'aggregates'`;
  if (rows.length && rows[0].data?.regression) {
    regressionCache = rows[0].data.regression;
    regressionCacheTime = Date.now();
    return regressionCache!;
  }
  return {};
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "30")));
    const offset = (page - 1) * limit;
    const modelsParam = searchParams.get("models");
    const fuelParam = searchParams.get("fuel");
    const sortParam = searchParams.get("sort"); // "deal" for deal sorting
    // Sorting must happen in SQL. It previously did not: the query was
    // hardcoded ORDER BY price_sek DESC and the client re-sorted whichever 30
    // rows came back — so page 1 was always the 30 most expensive cars of
    // several thousand, under a header reading "Pris ↑", with no deals on it.
    // All four sortable columns are numeric, so one CASE expression multiplied
    // by the direction covers every combination without interpolating SQL.
    const sortKey = ["price", "year", "mileage", "hp"].includes(
      searchParams.get("sortKey") || "",
    )
      ? (searchParams.get("sortKey") as string)
      : "price";
    const sortMul = searchParams.get("sortDir") === "desc" ? -1 : 1;
    const dealFilter = searchParams.get("deal"); // "great", "good", or "any" (good+great)
    const yearMin = parseInt(searchParams.get("yearMin") || "0") || 0;
    const yearMax = parseInt(searchParams.get("yearMax") || "0") || 0;
    const sellerParam = searchParams.get("seller"); // "private" or "dealer"
    const priceMax = parseInt(searchParams.get("priceMax") || "0") || 0;

    const sql = getDb();

    const modelKeys = modelsParam ? modelsParam.split(",").filter(Boolean) : [];
    const hasModels = modelKeys.length > 0;

    // Fuel filter booleans — handle hybrid/laddhybrid overlap with NOT LIKE
    const isHybrid = fuelParam === "Hybrid";
    const isPHEV = fuelParam === "PHEV";
    const isDiesel = fuelParam === "Diesel";
    const isPetrol = fuelParam === "Petrol";
    const isElectric = fuelParam === "Electric";
    const hasFuel = isHybrid || isPHEV || isDiesel || isPetrol || isElectric;
    const hasYearMin = yearMin > 0;
    const hasYearMax = yearMax > 0;
    const hasSeller = sellerParam === "private" || sellerParam === "dealer";
    const hasPriceMax = priceMax > 0;

    // Fetch regression coefficients for deal scoring
    const regression = await getRegression(sql);

    const isDealSort = sortParam === "deal";
    const hasDealFilter = dealFilter === "great" || dealFilter === "good" || dealFilter === "any";
    // Need all rows when deal sorting or filtering (deal fields computed in JS, not SQL)
    const needAllRows = isDealSort || hasDealFilter;

    // When sorting/filtering by deal, fetch all rows so we can compute deals, filter, sort, then paginate.
    // For normal queries, use SQL pagination (LIMIT/OFFSET).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rows: any[];
    if (needAllRows) {
      rows = await sql`
        SELECT listing_id, url, make, model, model_key, model_year, price_sek, mileage_mil,
               fuel_type, horsepower, gearbox, drivetrain, color, seller_type,
               equipment_count, car_age_years, wltp_range_km, ai_generation, ai_notable_equipment
        FROM cars_enriched
        WHERE (exclusion_tags = '[]'::jsonb OR exclusion_tags IS NULL)
          AND model_year >= 2005
          AND mileage_mil >= 0
          AND (is_active = TRUE OR is_active IS NULL)
          AND (${!hasModels} OR model_key = ANY(${modelKeys}))
          AND (${!hasFuel} OR (
            (${isHybrid} AND LOWER(fuel_type) LIKE '%hybrid%' AND LOWER(fuel_type) NOT LIKE '%laddhybrid%' AND LOWER(fuel_type) NOT LIKE '%plug%')
            OR (${isPHEV} AND (LOWER(fuel_type) LIKE '%laddhybrid%' OR LOWER(fuel_type) LIKE '%plug%'))
            OR (${isDiesel} AND LOWER(fuel_type) LIKE '%diesel%')
            OR (${isPetrol} AND LOWER(fuel_type) LIKE '%bensin%')
            OR (${isElectric} AND LOWER(fuel_type) = 'el')
          ))
          AND (${!hasYearMin} OR model_year >= ${yearMin})
          AND (${!hasYearMax} OR model_year <= ${yearMax})
          AND (${!hasSeller} OR LOWER(seller_type) = ${sellerParam || ""})
          AND (${!hasPriceMax} OR price_sek <= ${priceMax})
        ORDER BY price_sek ASC
      `;
    } else {
      rows = await sql`
        SELECT listing_id, url, make, model, model_key, model_year, price_sek, mileage_mil,
               fuel_type, horsepower, gearbox, drivetrain, color, seller_type,
               equipment_count, car_age_years, wltp_range_km, ai_generation, ai_notable_equipment
        FROM cars_enriched
        WHERE (exclusion_tags = '[]'::jsonb OR exclusion_tags IS NULL)
          AND model_year >= 2005
          AND mileage_mil >= 0
          AND (is_active = TRUE OR is_active IS NULL)
          AND (${!hasModels} OR model_key = ANY(${modelKeys}))
          AND (${!hasFuel} OR (
            (${isHybrid} AND LOWER(fuel_type) LIKE '%hybrid%' AND LOWER(fuel_type) NOT LIKE '%laddhybrid%' AND LOWER(fuel_type) NOT LIKE '%plug%')
            OR (${isPHEV} AND (LOWER(fuel_type) LIKE '%laddhybrid%' OR LOWER(fuel_type) LIKE '%plug%'))
            OR (${isDiesel} AND LOWER(fuel_type) LIKE '%diesel%')
            OR (${isPetrol} AND LOWER(fuel_type) LIKE '%bensin%')
            OR (${isElectric} AND LOWER(fuel_type) = 'el')
          ))
          AND (${!hasYearMin} OR model_year >= ${yearMin})
          AND (${!hasYearMax} OR model_year <= ${yearMax})
          AND (${!hasSeller} OR LOWER(seller_type) = ${sellerParam || ""})
          AND (${!hasPriceMax} OR price_sek <= ${priceMax})
        ORDER BY (CASE ${sortKey}
                    WHEN 'price'   THEN price_sek
                    WHEN 'year'    THEN model_year
                    WHEN 'mileage' THEN mileage_mil
                    WHEN 'hp'      THEN horsepower
                    ELSE price_sek
                  END) * ${sortMul} ASC NULLS LAST,
                 price_sek ASC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    const total = needAllRows ? rows.length : Number(
      (await sql`
        SELECT COUNT(*) as total FROM cars_enriched
        WHERE (exclusion_tags = '[]'::jsonb OR exclusion_tags IS NULL)
          AND model_year >= 2005
          AND mileage_mil >= 0
          AND (is_active = TRUE OR is_active IS NULL)
          AND (${!hasModels} OR model_key = ANY(${modelKeys}))
          AND (${!hasFuel} OR (
            (${isHybrid} AND LOWER(fuel_type) LIKE '%hybrid%' AND LOWER(fuel_type) NOT LIKE '%laddhybrid%' AND LOWER(fuel_type) NOT LIKE '%plug%')
            OR (${isPHEV} AND (LOWER(fuel_type) LIKE '%laddhybrid%' OR LOWER(fuel_type) LIKE '%plug%'))
            OR (${isDiesel} AND LOWER(fuel_type) LIKE '%diesel%')
            OR (${isPetrol} AND LOWER(fuel_type) LIKE '%bensin%')
            OR (${isElectric} AND LOWER(fuel_type) = 'el')
          ))
          AND (${!hasYearMin} OR model_year >= ${yearMin})
          AND (${!hasYearMax} OR model_year <= ${yearMax})
          AND (${!hasSeller} OR LOWER(seller_type) = ${sellerParam || ""})
          AND (${!hasPriceMax} OR price_sek <= ${priceMax})
      `)[0].total
    );

    function mapRow(r: (typeof rows)[number]) {
      const fuel = cleanFuel(r.fuel_type);
      const modelKey = r.model_key || "";
      const age = Number(r.car_age_years) || 0;
      const mileage = r.mileage_mil || 0;
      const hp = r.horsepower || 0;
      const equipmentCount = r.equipment_count || 0;
      const price = r.price_sek;
      const isDealer = (r.seller_type || "").toLowerCase() === "dealer";
      const drivetrain = r.drivetrain || "";
      const isAwd = isAwdDrivetrain(drivetrain);
      const wltpRange = r.wltp_range_km || 0;
      const generation = r.ai_generation || "";
      const premiumCount = premiumEquipCount(r.ai_notable_equipment);

      const reg = regression[modelKey];
      let predicted: number | null = null;
      let residual: number | null = null;
      let deal: string | null = null;

      if (reg) {
        predicted = predictPrice(
          reg, age, mileage, fuel, hp, equipmentCount, isDealer, isAwd,
          wltpRange, generation, premiumCount, reg.generations || [],
        );
        residual = price - predicted;
        deal = dealOf(price, predicted, reg);
      }

      return {
        id: r.listing_id,
        url: r.url || `https://www.blocket.se/mobility/item/${r.listing_id}`,
        make: r.make,
        model: r.model,
        modelKey,
        year: r.model_year,
        age,
        price,
        mileage,
        fuel,
        hp,
        gearbox: r.gearbox || "",
        drivetrain,
        color: r.color || "",
        seller: r.seller_type || "",
        equipmentCount,
        predicted,
        residual,
        deal,
      };
    }

    let cars = rows.map(mapRow);

    // Apply deal filter (computed in JS since deal is not a DB column)
    if (hasDealFilter) {
      if (dealFilter === "great") {
        cars = cars.filter((c) => c.deal === "great");
      } else if (dealFilter === "good") {
        cars = cars.filter((c) => c.deal === "good");
      } else {
        // "any" = good + great
        cars = cars.filter((c) => c.deal === "good" || c.deal === "great");
      }
    }

    // For deal sort or deal filter: sort globally, then paginate in memory
    if (needAllRows) {
      const dealRank = (d: string | null) => d === "great" ? 0 : d === "good" ? 1 : 2;
      cars.sort((a, b) => {
        const rankDiff = dealRank(a.deal) - dealRank(b.deal);
        if (rankDiff !== 0) return rankDiff;
        return (a.residual ?? 0) - (b.residual ?? 0);
      });
      const filteredTotal = cars.length;
      cars = cars.slice(offset, offset + limit);
      return NextResponse.json(
        { cars, total: filteredTotal, page, pages: Math.ceil(filteredTotal / limit), limit },
        { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" } }
      );
    }

    return NextResponse.json(
      { cars, total, page, pages: Math.ceil(total / limit), limit },
      { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" } }
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
