import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sql = getDb();

    // Count total and active cars per model
    const rows = await sql`
      SELECT
        model_key,
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_active = TRUE OR is_active IS NULL) as active,
        MAX(scraped_at) as last_scraped
      FROM cars_enriched
      WHERE (exclusion_tags = '[]'::jsonb OR exclusion_tags IS NULL)
        AND model_year >= 2005
        AND mileage_mil >= 0
      GROUP BY model_key
      ORDER BY model_key
    `;

    // Get web_cache update time
    const cacheRows = await sql`SELECT updated_at FROM web_cache WHERE key = 'aggregates'`;
    const lastModelUpdate = cacheRows[0]?.updated_at || null;

    const stats: Record<string, { total: number; active: number; lastScraped: string | null }> = {};
    for (const r of rows) {
      stats[r.model_key] = {
        total: Number(r.total),
        active: Number(r.active),
        lastScraped: r.last_scraped,
      };
    }

    return NextResponse.json(
      { stats, lastModelUpdate },
      { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
