import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sql = getDb();
    // `mileageCost` is dropped in SQL rather than after the fetch. It was 582 KB
    // of a 628 KB payload — a field-for-field duplicate of `scatter`, since the
    // pipeline built it as a projection of the very same points. MileageChart
    // ignores it whenever `scatter` is passed, which the homepage always does,
    // so every byte of it was read from Neon, serialised, shipped and discarded.
    // The pipeline no longer emits it; this keeps the old cached rows honest
    // until the next statistics run overwrites them.
    const rows = await sql`
      SELECT data - 'mileageCost' AS data FROM web_cache WHERE key = 'aggregates'
    `;
    if (!rows.length) {
      return NextResponse.json({ error: "No data in web_cache" }, { status: 404 });
    }
    return NextResponse.json(rows[0].data, {
      headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
