import { ImageResponse } from "next/og";
import { getValuation, parseValuationParams } from "@/app/lib/valuation";

export const dynamic = "force-dynamic";

/**
 * The share card for one car's valuation. A partner with fifteen seconds and
 * no context must be able to answer "does that one look right?" from this
 * image alone — a number, its source, its date, and nothing asked of them.
 * Ledger palette, not the stale #f7f3ec that predates the identity.
 */

const paper = "#f8f4ec";
const ink = "#171512";
const muted = "#6b6459";
const rule = "#d9d2c4";
const money = "#1a5c3a";

const kr = (n: number) => Math.round(n).toLocaleString("sv-SE");

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const modell = searchParams.get("modell") ?? "";
  const input = parseValuationParams(Object.fromEntries(searchParams.entries()));
  const val = input ? await getValuation(modell, input) : null;

  if (!val) {
    return new ImageResponse(
      (<div style={{ display: "flex", width: "100%", height: "100%",
                     background: paper, alignItems: "center", justifyContent: "center",
                     fontSize: 48, color: ink }}>Hela Notan</div>),
      { width: 1200, height: 630 },
    );
  }

  const spec = [
    String(val.input.year), val.input.fuel, `${kr(val.input.mileage)} mil`,
    val.input.hp ? `${val.input.hp} hk` : null,
  ].filter(Boolean).join(" · ");

  return new ImageResponse(
    (
      <div style={{
        display: "flex", flexDirection: "column", width: "100%", height: "100%",
        background: paper, color: ink, padding: 64,
      }}>
        <div style={{ display: "flex", fontSize: 22, color: muted,
                      textTransform: "uppercase", letterSpacing: 4 }}>
          Värdering · helanotan.se
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          <div style={{ display: "flex", fontSize: 54, fontWeight: 700 }}>
            {val.label}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: muted, marginTop: 6 }}>
            {spec}
          </div>

          {val.refusal ? (
            <div style={{ display: "flex", fontSize: 44, fontWeight: 700, marginTop: 40 }}>
              Kan inte värderas med säkerhet
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginTop: 40 }}>
                <span style={{ fontSize: 88, fontWeight: 700 }}>{kr(val.estimate)} kr</span>
                <span style={{ fontSize: 30, color: muted }}>±{kr(val.band)} kr</span>
              </div>
              {val.residual != null && (
                <div style={{ display: "flex", fontSize: 34, marginTop: 16,
                              color: val.residual < 0 ? money : ink, fontWeight: 600 }}>
                  {`Begärt pris ${kr(Math.abs(val.residual))} kr ${val.residual < 0 ? "under" : "över"} estimatet`}
                </div>
              )}
            </>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between",
                      borderTop: `2px solid ${rule}`, paddingTop: 24,
                      fontSize: 22, color: muted }}>
          <span>{`Baserat på ${kr(val.sampleSize)} Blocket-annonser`}</span>
          <span>{`Uppdaterad ${val.updated}`}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
