import { ImageResponse } from "next/og";

export const alt = "Hela Notan — Vad kostar bilen egentligen?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#f7f3ec",
          padding: "60px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Receipt icon */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 32 32"
          style={{ marginBottom: 32 }}
        >
          <path
            d="M6 2h20c1.1 0 2 .9 2 2v23l-3-2-3 2-3-2-3 2-3-2-3 2-3-2-3 2V4c0-1.1.9-2 2-2z"
            fill="#1e1c19"
          />
          <rect x="10" y="8" width="12" height="2" rx="1" fill="#f7f3ec" />
          <rect x="10" y="13" width="12" height="2" rx="1" fill="#f7f3ec" />
          <rect x="10" y="18" width="8" height="2" rx="1" fill="#f7f3ec" />
        </svg>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#1e1c19",
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          Hela Notan
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#5c5651",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Vad kostar bilen egentligen? Jämför värdeminskning, försäkring,
          skatt och service baserat på riktiga Blocket-annonser.
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 40,
            fontSize: 18,
            color: "#5c5651",
          }}
        >
          <span>helanotan.se</span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span>Data från Blocket.se</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
