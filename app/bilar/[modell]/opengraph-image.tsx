import { ImageResponse } from "next/og";
import { getModelIndex, getModelPage } from "@/app/lib/model-page";

export const alt = "Värdeminskning och priser";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getModelIndex().then((models) => models.map((m) => ({ modell: m.slug })));
}

/**
 * The model page's share card. These URLs are what get pasted into Messenger
 * threads and forum posts; without an image they render as a bare grey link
 * and the fifteen-second glance fails. A mini-receipt: the model, the one
 * number that carries the page, the sample size, the date.
 */

const paper = "#f8f4ec";
const ink = "#171512";
const muted = "#6b6459";
const rule = "#d9d2c4";

const kr = (n: number) => Math.round(n).toLocaleString("sv-SE");

export default async function Image({ params }: { params: Promise<{ modell: string }> }) {
  const { modell } = await params;
  const data = await getModelPage(modell);

  return new ImageResponse(
    (
      <div style={{
        display: "flex", flexDirection: "column", width: "100%", height: "100%",
        background: paper, color: ink, padding: 64,
      }}>
        <div style={{ display: "flex", fontSize: 22, color: muted,
                      textTransform: "uppercase", letterSpacing: 4 }}>
          Begagnatpriser · helanotan.se
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700 }}>
            {data?.label ?? "Hela Notan"}
          </div>

          {data?.firstYearLoss != null ? (
            <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginTop: 32 }}>
              <span style={{ fontSize: 80, fontWeight: 700 }}>
                −{kr(data.firstYearLoss)} kr
              </span>
              <span style={{ fontSize: 30, color: muted }}>första året</span>
            </div>
          ) : data?.anchorPrice != null ? (
            <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginTop: 32 }}>
              <span style={{ fontSize: 80, fontWeight: 700 }}>
                {kr(data.anchorPrice)} kr
              </span>
              <span style={{ fontSize: 30, color: muted }}>median {data.anchorYear}</span>
            </div>
          ) : null}

          {data && (
            <div style={{ display: "flex", gap: 28, fontSize: 28, color: muted, marginTop: 24 }}>
              {data.retention3 != null && <span>{`${data.retention3}% kvar efter 3 år`}</span>}
              {data.anchorPrice != null && data.firstYearLoss != null && (
                <span>{`Median ${kr(data.anchorPrice)} kr`}</span>
              )}
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between",
                      borderTop: `2px solid ${rule}`, paddingTop: 24,
                      fontSize: 22, color: muted }}>
          <span>{data ? `${kr(data.count)} Blocket-annonser analyserade` : ""}</span>
          <span>helanotan.se</span>
        </div>
      </div>
    ),
    size,
  );
}
