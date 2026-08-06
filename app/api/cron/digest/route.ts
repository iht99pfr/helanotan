import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";
import { dealEmail, emailConfigured, sendMail, watcherEmail, type DealLine } from "@/app/lib/email";
import {
  cleanFuel, dealOf, isAwdDrivetrain, predictPrice, premiumEquipCount,
  type RegressionModel,
} from "@/app/lib/predict";
import { percentUnder } from "@/app/lib/deal-format";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * The monthly watcher report and the deal alerts.
 *
 * Defaults to a dry run: it computes exactly what it would send and returns
 * it, without contacting anyone. Add ?send=1 to actually deliver. That is
 * deliberate — the promise on /bevaka went unkept for months, and the way to
 * fix that badly is to mail a stale draft to everyone who waited.
 */

const FUEL_KEY: Record<string, string> = {
  Hybrid: "Hybrid", PHEV: "PHEV", Diesel: "Diesel", Petrol: "Petrol", Electric: "Electric",
};

function authorised(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization");
  // Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`.
  return header === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!authorised(req)) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }
  const send = req.nextUrl.searchParams.get("send") === "1";

  try {
    const sql = getDb();
    const cacheRows = await sql`
      SELECT data - 'mileageCost' AS data FROM web_cache WHERE key = 'aggregates'`;
    const agg = cacheRows[0]?.data;
    if (!agg) return NextResponse.json({ error: "no aggregates" }, { status: 503 });

    const config: Record<string, { label: string }> = agg.modelConfig ?? {};
    const regression: Record<string, RegressionModel> = agg.regression ?? {};
    const curves = agg.predictionCurves ?? {};
    const currentYear = new Date().getFullYear();

    // ---- watcher reports -------------------------------------------------
    const watchers = await sql`
      SELECT email, model_key, fuel_type, model_year FROM car_watchers`;

    const watcherMails = [];
    for (const w of watchers) {
      const label = config[w.model_key]?.label ?? w.model_key;
      const fuelKey = FUEL_KEY[w.fuel_type] ?? w.fuel_type;
      const curve = curves[w.model_key]?.[fuelKey] ?? curves[w.model_key]?.all;
      if (!curve?.length) continue;
      const age = Math.max(0, currentYear - Number(w.model_year));
      const at = (a: number) =>
        curve.find((p: { age: number }) => p.age === a)?.predicted ?? null;
      const value = at(age);
      const next = at(age + 1);
      if (value == null) continue;
      const yearAhead = next ?? Math.round(value * 0.88);
      watcherMails.push(watcherEmail({
        email: w.email,
        label,
        modelYear: Number(w.model_year),
        value: Math.round(value),
        monthlyLoss: Math.max(0, Math.round((value - yearAhead) / 12)),
        yearAhead: Math.round(yearAhead),
      }));
    }

    // ---- deal alerts -----------------------------------------------------
    const subs = await sql`SELECT email, model_keys FROM deal_subscriptions`;
    const wanted = [...new Set(subs.flatMap((s) => s.model_keys as string[]))];

    const dealsByModel: Record<string, DealLine[]> = {};
    if (wanted.length) {
      const rows = await sql`
        SELECT listing_id, url, model_key, model_year, price_sek, mileage_mil,
               fuel_type, horsepower, drivetrain, seller_type, equipment_count,
               car_age_years, wltp_range_km, ai_generation, ai_notable_equipment
        FROM cars_enriched
        WHERE is_active AND model_key = ANY(${wanted})
          AND (exclusion_tags = '[]'::jsonb OR exclusion_tags IS NULL)
          AND model_year >= 2005 AND price_sek > 0 AND mileage_mil >= 0
          AND car_age_years IS NOT NULL
          AND scraped_at > NOW() - INTERVAL '8 days'`;
      for (const r of rows) {
        const reg = regression[r.model_key];
        if (!reg) continue;
        const price = Number(r.price_sek);
        const predicted = predictPrice(
          reg, Number(r.car_age_years) || 0, r.mileage_mil || 0, cleanFuel(r.fuel_type),
          r.horsepower || 0, r.equipment_count || 0,
          (r.seller_type || "").toLowerCase() === "dealer",
          isAwdDrivetrain(r.drivetrain || ""), r.wltp_range_km || 0,
          r.ai_generation || "", premiumEquipCount(r.ai_notable_equipment),
          reg.generations || [],
        );
        if (dealOf(price, predicted, reg) !== "great") continue;
        const pct = percentUnder(price, predicted);
        if (pct == null) continue;
        (dealsByModel[r.model_key] ??= []).push({
          label: config[r.model_key]?.label ?? r.model_key,
          year: r.model_year,
          price,
          mileage: r.mileage_mil || 0,
          pctUnder: pct,
          saving: Math.round(predicted - price),
          url: r.url || `https://www.blocket.se/mobility/item/${r.listing_id}`,
        });
      }
      for (const k of Object.keys(dealsByModel)) {
        dealsByModel[k].sort((a, b) => b.saving - a.saving);
      }
    }

    const dealMails = [];
    for (const s of subs) {
      const deals = (s.model_keys as string[]).flatMap((k) => dealsByModel[k] ?? [])
        .sort((a, b) => b.saving - a.saving).slice(0, 6);
      if (!deals.length) continue;
      dealMails.push(dealEmail({ email: s.email, deals }));
    }

    const all = [...watcherMails, ...dealMails];

    if (!send) {
      return NextResponse.json({
        dryRun: true,
        configured: emailConfigured(),
        watchers: watchers.length,
        subscribers: subs.length,
        wouldSend: all.length,
        preview: all.map((m) => ({ to: m.to, subject: m.subject })),
      });
    }

    if (!emailConfigured()) {
      return NextResponse.json(
        { error: "RESEND_API_KEY / EMAIL_FROM not configured" }, { status: 503 },
      );
    }

    const results = [];
    for (const m of all) {
      const r = await sendMail(m);
      results.push({ to: m.to, ok: r.ok, error: r.error });
    }
    return NextResponse.json({
      sent: results.filter((r) => r.ok).length,
      failed: results.filter((r) => !r.ok),
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" }, { status: 500 },
    );
  }
}
