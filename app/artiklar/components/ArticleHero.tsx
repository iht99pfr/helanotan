import Link from "next/link";
import type { ArticleMeta } from "../data/types";
import { formatDate } from "../data/types";
import CategoryBadge from "./CategoryBadge";

export default function ArticleHero({ article }: { article: ArticleMeta }) {
  return (
    <Link
      href={`/artiklar/${article.slug}`}
      className="block bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 sm:p-10 hover:border-[var(--muted)] transition group"
    >
      <CategoryBadge category={article.category} />
      <h2 className="text-xl sm:text-3xl font-bold text-[var(--foreground)] mt-3 group-hover:underline decoration-1 underline-offset-4">
        {article.title}
      </h2>
      <p className="text-[var(--muted)] mt-2 text-sm sm:text-base max-w-2xl">
        {article.subtitle}
      </p>
      <div className="flex gap-3 mt-4 text-xs text-[var(--muted)]">
        <time dateTime={article.date}>{formatDate(article.date)}</time>
        <span>&middot;</span>
        <span>{article.readingTime} min läsning</span>
      </div>
    </Link>
  );
}
