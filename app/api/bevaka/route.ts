import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, modelKey, fuelType, modelYear } = body as {
      email?: string;
      modelKey?: string;
      fuelType?: string;
      modelYear?: number;
    };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Ogiltig e-postadress" },
        { status: 400 }
      );
    }
    if (!modelKey || !fuelType || !modelYear) {
      return NextResponse.json(
        { error: "Välj märke, drivmedel och årsmodell" },
        { status: 400 }
      );
    }

    const sql = getDb();

    // Create table if not exists (idempotent)
    await sql`
      CREATE TABLE IF NOT EXISTS car_watchers (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        model_key TEXT NOT NULL,
        fuel_type TEXT NOT NULL,
        model_year INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(email, model_key, fuel_type, model_year)
      )
    `;

    await sql`
      INSERT INTO car_watchers (email, model_key, fuel_type, model_year)
      VALUES (${email}, ${modelKey}, ${fuelType}, ${modelYear})
      ON CONFLICT (email, model_key, fuel_type, model_year) DO NOTHING
    `;

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Något gick fel" }, { status: 500 });
  }
}
