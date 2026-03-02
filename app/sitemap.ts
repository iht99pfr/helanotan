import type { MetadataRoute } from "next";
import { articles } from "./artiklar/data/articles";

const baseUrl = "https://helanotan.se";

export default function sitemap(): MetadataRoute.Sitemap {
  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/artiklar/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/tco`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/artiklar`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...articlePages,
  ];
}
