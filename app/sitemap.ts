import type { MetadataRoute } from "next";
import { articles } from "./artiklar/data/articles";
import { getAllNewsSlugs, getNewsArticle } from "./lib/nyheter";

const baseUrl = "https://helanotan.se";

export default function sitemap(): MetadataRoute.Sitemap {
  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/artiklar/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const newsSlugs = getAllNewsSlugs();
  const newsPages = newsSlugs.map((slug) => {
    const article = getNewsArticle(slug);
    return {
      url: `${baseUrl}/nyheter/${slug}`,
      lastModified: new Date(article.date),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    };
  });

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
    {
      url: `${baseUrl}/nyheter`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...articlePages,
    ...newsPages,
  ];
}
