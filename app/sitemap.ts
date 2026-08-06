import type { MetadataRoute } from "next";
import { articles } from "./artiklar/data/articles";
import { getModelIndex } from "./lib/model-page";

const baseUrl = "https://helanotan.se";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // The per-model pages are the site's only self-manufacturing traffic: each
  // one answers a query someone actually types ("xc60 värdeminskning") with
  // figures already in the HTML. Highest priority after the homepage.
  const modelPages = (await getModelIndex()).filter((m) => m.indexable).map((m) => ({
    url: `${baseUrl}/bilar/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));
  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/artiklar/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // The 27 auto-generated news posts are deliberately absent: they were 44% of
  // this sitemap and returned nothing, while pages that matter went uncrawled.
  // They carry noindex too — see app/nyheter/[slug]/page.tsx.

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/bilar`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...modelPages,
    {
      url: `${baseUrl}/tco`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/toppen`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kopguide`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bevaka`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/metod`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/saljtid`,
      lastModified: new Date(),
      changeFrequency: "monthly",
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
