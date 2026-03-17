import type { Metadata } from "next";
import Link from "next/link";
import { getAllNewsArticles } from "@/app/lib/nyheter";

export const metadata: Metadata = {
  title: "Nyheter — Hela Notan",
  description:
    "Nyheter och analyser om bilkostnader, värdeminskning och bilmarknad i Sverige.",
  openGraph: {
    title: "Nyheter — Hela Notan",
    description:
      "Nyheter och analyser om bilkostnader, värdeminskning och bilmarknad i Sverige.",
    url: "https://helanotan.se/nyheter",
    siteName: "Hela Notan",
  },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function NyheterPage() {
  const articles = getAllNewsArticles();

  if (articles.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-4">
          Nyheter
        </h1>
        <p className="text-[var(--muted)]">
          Nyheter kommer snart. Håll utkik!
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
        Nyheter
      </h1>
      <p className="text-[var(--muted)] mb-10">
        Nyheter och analyser om bilkostnader, värdeminskning och den svenska
        bilmarknaden.
      </p>

      <div className="space-y-6">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/nyheter/${article.slug}`}
            className="block bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 hover:border-[var(--muted)] transition group"
          >
            <time
              dateTime={article.date}
              className="text-xs text-[var(--muted)]"
            >
              {formatDate(article.date)}
            </time>
            <h2 className="text-lg font-bold text-[var(--foreground)] mt-1 group-hover:underline decoration-1 underline-offset-4">
              {article.title}
            </h2>
            <p className="text-[var(--muted)] text-sm mt-1.5 line-clamp-2">
              {article.description}
            </p>
            {article.tags.length > 0 && (
              <div className="flex gap-1.5 mt-3">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--border)] text-[var(--muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
