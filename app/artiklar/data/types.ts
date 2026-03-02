export type ArticleCategory =
  | "Modellguider"
  | "Jamforelser"
  | "Marknadsanalyser"
  | "Sa funkar det";

export interface ArticleMeta {
  slug: string;
  title: string;
  subtitle: string;
  category: ArticleCategory;
  date: string; // ISO date
  readingTime: number; // minutes
  excerpt: string;
  featured?: boolean;
  relatedSlugs: string[];
  seoTitle?: string;
}

export const CATEGORY_DISPLAY: Record<ArticleCategory, string> = {
  Modellguider: "Modellguider",
  Jamforelser: "Jämförelser",
  Marknadsanalyser: "Marknadsanalyser",
  "Sa funkar det": "Så funkar det",
};

export const CATEGORY_SINGULAR: Record<ArticleCategory, string> = {
  Modellguider: "Modellguide",
  Jamforelser: "Jämförelse",
  Marknadsanalyser: "Marknadsanalys",
  "Sa funkar det": "Så funkar det",
};

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
