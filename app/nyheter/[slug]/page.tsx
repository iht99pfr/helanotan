import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllNewsSlugs,
  getNewsArticleWithHtml,
  getNewsArticle,
} from "@/app/lib/nyheter";
import ShareBar from "@/app/components/ShareBar";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = getNewsArticle(slug);
    return {
      title: `${article.title} — Hela Notan`,
      description: article.description,
      openGraph: {
        title: article.title,
        description: article.description,
        url: `https://helanotan.se/nyheter/${slug}`,
        siteName: "Hela Notan",
        type: "article",
        publishedTime: article.date,
      },
    };
  } catch {
    return { title: "Artikel — Hela Notan" };
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function NyheterArticlePage({ params }: Props) {
  const { slug } = await params;

  let article;
  try {
    article = await getNewsArticleWithHtml(slug);
  } catch {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    publisher: {
      "@type": "Organization",
      name: "Hela Notan",
      url: "https://helanotan.se",
    },
    mainEntityOfPage: `https://helanotan.se/nyheter/${slug}`,
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/nyheter"
        className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition mb-8 inline-flex items-center gap-1"
      >
        ← Alla nyheter
      </Link>

      <article className="mt-6">
        <time
          dateTime={article.date}
          className="text-xs text-[var(--muted)]"
        >
          {formatDate(article.date)}
        </time>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mt-2 mb-4">
          {article.title}
        </h1>
        <div className="mb-8">
          <ShareBar
            url={`https://helanotan.se/nyheter/${slug}`}
            title={article.title}
            description={article.description}
            eventPrefix="nyhet"
          />
        </div>

        <div
          className="
            max-w-prose
            text-[var(--foreground)] text-base sm:text-lg leading-relaxed
            [&>h2]:text-[var(--foreground)] [&>h2]:text-xl [&>h2]:sm:text-2xl [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-4
            [&>h3]:text-[var(--foreground)] [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mt-8 [&>h3]:mb-3
            [&>p]:mb-5 [&>p]:text-[var(--muted)]
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-5 [&>ul]:space-y-1 [&>ul]:text-[var(--muted)]
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-5 [&>ol]:space-y-1 [&>ol]:text-[var(--muted)]
            [&>blockquote]:border-l-4 [&>blockquote]:border-[var(--border)] [&>blockquote]:pl-5 [&>blockquote]:italic [&>blockquote]:my-6 [&>blockquote]:text-[var(--muted)]
            [&_a]:text-[var(--foreground)] [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-[var(--border)] hover:[&_a]:decoration-[var(--foreground)]
            [&_strong]:text-[var(--foreground)] [&_strong]:font-semibold
          "
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />
      </article>
    </main>
  );
}
