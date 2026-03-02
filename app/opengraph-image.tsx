import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const alt = "Hela Notan — Vad kostar bilen egentligen?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), "public/logo-cropped.png"));
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

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
        {/* Logo */}
        <img
          src={logoBase64}
          width={120}
          height={96}
          style={{ marginBottom: 32 }}
        />
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
