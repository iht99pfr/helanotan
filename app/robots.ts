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
        "/api/cron",
        "/api/unsubscribe",
        // NOTE: /nyheter and /fakta are deliberately NOT listed here. They
        // carry `noindex` in their metadata, and a Disallow would stop Google
        // fetching the page at all — so the noindex would never be read and
        // the URLs could linger in the index as bare links. Blocking and
        // de-indexing are opposites; pick de-indexing.
        // Internal working documents.
        "/version2",
      ],
    },
    sitemap: "https://helanotan.se/sitemap.xml",
  };
}
