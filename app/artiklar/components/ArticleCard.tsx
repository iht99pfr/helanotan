import Link from "next/link";
import type { ArticleMeta } from "../data/types";
import { formatDate } from "../data/types";
import CategoryBadge from "./CategoryBadge";

export default function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <Link
      href={`/artiklar/${article.slug}`}
      className="block bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 hover:border-[var(--muted)] transition group"
    >
      <div className="flex items-center gap-2 mb-2">
        <CategoryBadge category={article.category} />
        <span className="text-xs text-[var(--muted)]">
          {article.readingTime} min
        </span>
      </div>
      <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)] group-hover:underline decoration-1 underline-offset-4">
        {article.title}
      </h3>
      <p className="text-[var(--muted)] text-sm mt-1.5 line-clamp-2">
        {article.subtitle}
      </p>
      <div className="text-xs text-[var(--muted)] mt-3">
        <time dateTime={article.date}>{formatDate(article.date)}</time>
      </div>
    </Link>
  );
}
