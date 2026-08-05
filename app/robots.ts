import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        // Write endpoints only. The read-only data routes must stay crawlable:
        // the charts and tables hydrate from them client-side, and Googlebot
        // obeys robots.txt for subresource fetches during rendering. Blocking
        // /api/ wholesale meant the render pass saw permanent loading states,
        // so the site's entire dataset was invisible to search.
        "/api/bevaka",
        "/api/deal-alerts",
        // Internal working documents.
        "/version2",
      ],
    },
    sitemap: "https://helanotan.se/sitemap.xml",
  };
}
