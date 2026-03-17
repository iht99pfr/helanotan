import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const newsDir = path.join(process.cwd(), "content", "nyheter", "sv");

export interface NewsArticle {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  content: string;
  image?: string;
  imageAlt?: string;
}

export interface NewsArticleWithHtml extends NewsArticle {
  contentHtml: string;
}

function ensureDirectory(): boolean {
  return fs.existsSync(newsDir);
}

export function getAllNewsSlugs(): string[] {
  if (!ensureDirectory()) return [];
  const files = fs.readdirSync(newsDir);
  return files
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
    .sort((a, b) => b.localeCompare(a));
}

export function getNewsArticle(slug: string): NewsArticle {
  const filePath = path.join(newsDir, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title ?? "",
    date: data.date ?? slug.slice(0, 10),
    description: data.description ?? "",
    tags: data.tags ?? [],
    content,
    image: data.image ?? undefined,
    imageAlt: data.imageAlt ?? undefined,
  };
}

export function getAllNewsArticles(): Omit<NewsArticle, "content">[] {
  const slugs = getAllNewsSlugs();
  return slugs.map((slug) => {
    const { content, ...meta } = getNewsArticle(slug);
    return meta;
  });
}

export async function getNewsArticleWithHtml(
  slug: string
): Promise<NewsArticleWithHtml> {
  const article = getNewsArticle(slug);
  const processed = await remark().use(html).process(article.content);
  return {
    ...article,
    contentHtml: processed.toString(),
  };
}
