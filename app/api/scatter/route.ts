import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";

export const dynamic = "force-dynamic";

// A model key is a bare identifier from the pipeline registry ("XC40Recharge",
// "X3M"). Anything else is not a key we could serve, so reject it rather than
// pass it down as a filter value.
const KEY_RE = /^[A-Za-z0-9]+$/;

export async function GET(request: Request) {
  try {
    const sql = getDb();

    // The homepage asks for the three models it is actually drawing. Shipping
    // all eighteen meant 2.3 MB over the wire and ~16 000 points parsed on the
    // main thread so that ~5 000 could be rendered — the bulk of an INP of
    // 1800 ms. Callers that omit the parameter still get everything.
    const raw = new URL(request.url).searchParams.get("models");
    const models = raw
      ? [...new Set(raw.split(",").map((m) => m.trim()).filter((m) => KEY_RE.test(m)))]
      : null;

    const rows = models?.length
      ? await sql`
          SELECT COALESCE(jsonb_object_agg(entry.key, entry.value), '{}'::jsonb) AS data
          FROM web_cache, jsonb_each(web_cache.data) AS entry
          WHERE web_cache.key = 'scatter' AND entry.key = ANY(${models})
        `
      : await sql`SELECT data FROM web_cache WHERE key = 'scatter'`;

    if (!rows.length || rows[0].data == null) {
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
