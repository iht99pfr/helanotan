import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";
import { getDb } from "@/app/lib/db";
import { computeTco, FUEL_LABELS } from "@/app/lib/tco-compute";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const model = searchParams.get("model") || "";
  const fuel = searchParams.get("fuel") || "";
  const year = Number(searchParams.get("year")) || 2022;
  const mileage = Number(searchParams.get("mileage")) || 5000;
  const keep = Number(searchParams.get("keep")) || 3;
  const driving = Number(searchParams.get("driving")) || 1500;

  // Fetch data
  const sql = getDb();
  const rows = await sql`SELECT data FROM web_cache WHERE key = 'aggregates'`;
  const aggregates = rows[0]?.data;

  const reg = aggregates?.regression?.[model];
  const modelLabel = aggregates?.modelConfig?.[model]?.label || model;
  const fuelLabel = FUEL_LABELS[fuel] || fuel;
  const curve = aggregates?.predictionCurves?.[model]?.[fuel] || aggregates?.predictionCurves?.[model]?.["all"];

  // Compute TCO
  const result = reg
    ? computeTco({ model, fuel, year, mileage, holdingYears: keep, annualMileage: driving }, reg, curve, undefined, 4.5)
    : null;

  // Load logo
  const logoData = await readFile(join(process.cwd(), "public/logo-cropped.png"));
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

  const monthlyText = result ? `${result.monthlyTotal.toLocaleString("sv-SE")} kr/mån` : "—";
  const depText = result ? `Värdeförlust: ${result.valueLoss.toLocaleString("sv-SE")} kr` : "";
  const costPerMilText = result ? `${result.costPerMil} kr/mil` : "";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#f7f3ec",
          padding: "60px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top: logo + brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <img src={logoBase64} width={48} height={38} />
          <span style={{ fontSize: 28, fontWeight: 700, color: "#1e1c19" }}>Hela Notan</span>
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          <div style={{ display: "flex", fontSize: 24, color: "#5c5651", marginBottom: 8 }}>Ägandekostnad</div>
          <div style={{ display: "flex", fontSize: 52, fontWeight: 700, color: "#1e1c19", lineHeight: 1.1, marginBottom: 16 }}>
            {`${modelLabel} ${fuelLabel} ${year}`}
          </div>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700, color: "#1e1c19", marginBottom: 24 }}>
            {monthlyText}
          </div>
          <div style={{ display: "flex", gap: 32, fontSize: 22, color: "#5c5651" }}>
            {depText && <span>{depText}</span>}
            {costPerMilText && <span style={{ opacity: 0.4 }}>|</span>}
            {costPerMilText && <span>{costPerMilText}</span>}
            {keep && <span style={{ opacity: 0.4 }}>|</span>}
            {keep && <span>{keep} år</span>}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, color: "#5c5651" }}>
          <span>helanotan.se/tco</span>
          <span>Data från Blocket.se</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
