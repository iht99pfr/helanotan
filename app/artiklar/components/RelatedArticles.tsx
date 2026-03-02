import type { ArticleMeta } from "../data/types";
import ArticleCard from "./ArticleCard";

export default function RelatedArticles({
  articles,
}: {
  articles: ArticleMeta[];
}) {
  if (articles.length === 0) return null;
  return (
    <section className="mt-12 pt-8 border-t border-[var(--border)] space-y-4">
      <h2 className="text-lg font-bold text-[var(--foreground)]">
        Relaterade artiklar
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {articles.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </section>
  );
}
