import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, modelKeys } = body as { email?: string; modelKeys?: string[] };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Ogiltig e-postadress" }, { status: 400 });
    }
    if (!Array.isArray(modelKeys) || modelKeys.length === 0) {
      return NextResponse.json({ error: "Välj minst en modell" }, { status: 400 });
    }

    const sql = getDb();
    await sql`
      INSERT INTO deal_subscriptions (email, model_keys)
      VALUES (${email}, ${modelKeys})
      ON CONFLICT (email) DO UPDATE SET model_keys = ${modelKeys}
    `;

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Något gick fel" }, { status: 500 });
  }
}
