import Link from "next/link";
import {
  articles,
  getFeaturedArticle,
  getArticlesByCategory,
} from "./data/articles";
import type { ArticleCategory } from "./data/types";
import { CATEGORY_DISPLAY } from "./data/types";
import ArticleCard from "./components/ArticleCard";
import ArticleHero from "./components/ArticleHero";

const CATEGORIES: ArticleCategory[] = [
  "Modellguider",
  "Jamforelser",
  "Marknadsanalyser",
  "Sa funkar det",
];

export default function ArtiklerPage() {
  const featured = getFeaturedArticle();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-14">
      {/* Header */}
      <div>
        <Link
          href="/"
          className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition"
        >
          &larr; Tillbaka
        </Link>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--foreground)] mt-4">
          Artiklar
        </h1>
        <p className="text-[var(--muted)] mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
          Datadriven analys av den svenska begagnatmarknaden. Baserat på riktiga
          priser från över 10&nbsp;000 Blocket-annonser.
        </p>
      </div>

      {/* Hero featured article */}
      <ArticleHero article={featured} />

      {/* Senaste artiklar — chronological feed */}
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
          Senaste
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {articles
            .filter((a) => a.slug !== featured.slug)
            .sort(
              (a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, 4)
            .map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
        </div>
      </section>

      {/* Category sections */}
      {CATEGORIES.map((cat) => {
        const catArticles = getArticlesByCategory(cat).filter(
          (a) => a.slug !== featured.slug
        );
        if (catArticles.length === 0) return null;
        return (
          <section key={cat} className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
              {CATEGORY_DISPLAY[cat]}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {catArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
