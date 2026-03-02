import { ImageResponse } from "next/og";
import { getArticleBySlug, articles } from "../data/articles";
import { CATEGORY_SINGULAR } from "../data/types";

export const alt = "Hela Notan artikel";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  const title = article?.title ?? "Artikel";
  const category = article ? CATEGORY_SINGULAR[article.category] : "";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          backgroundColor: "#f7f3ec",
          padding: "60px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {category && (
            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "#5c5651",
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              {category}
            </div>
          )}
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "#1e1c19",
              lineHeight: 1.15,
              maxWidth: 900,
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 22,
              color: "#5c5651",
            }}
          >
            {/* Receipt icon */}
            <svg width="32" height="32" viewBox="0 0 32 32">
              <path
                d="M6 2h20c1.1 0 2 .9 2 2v23l-3-2-3 2-3-2-3 2-3-2-3 2-3-2-3 2V4c0-1.1.9-2 2-2z"
                fill="#1e1c19"
              />
              <rect x="10" y="8" width="12" height="2" rx="1" fill="#f7f3ec" />
              <rect x="10" y="13" width="12" height="2" rx="1" fill="#f7f3ec" />
              <rect x="10" y="18" width="8" height="2" rx="1" fill="#f7f3ec" />
            </svg>
            <span style={{ fontWeight: 700, color: "#1e1c19" }}>Hela Notan</span>
            <span style={{ opacity: 0.4 }}>|</span>
            <span>helanotan.se</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
