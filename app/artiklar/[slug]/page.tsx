import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  articles,
  getArticleBySlug,
  getRelatedArticles,
} from "../data/articles";
import { formatDate } from "../data/types";
import BackLink from "../components/BackLink";
import ArticleBody from "../components/ArticleBody";
import CategoryBadge from "../components/CategoryBadge";
import RelatedArticles from "../components/RelatedArticles";

/* Static content imports */
import VolvoXC60Generationer from "../data/content/volvo-xc60-generationer";
import TeslaModelYPrissattning from "../data/content/tesla-model-y-prissattning";
import SuvJamforelse300000 from "../data/content/suv-jamforelse-300000";
import ToyotaRav4Generationer from "../data/content/toyota-rav4-generationer";
import Handlarpremie from "../data/content/handlarpremie";
import ElbilPhevHybridRestvarde from "../data/content/elbil-phev-hybrid-restvarde";
import VwGolf20Ar from "../data/content/vw-golf-20-ar";
import PremiumutrustningAterforsakringsvarde from "../data/content/premiumutrustning-aterforsakringsvarde";
import KiaNiroBastaVardet from "../data/content/kia-niro-basta-vardet";
import SaPrissatterViBilar from "../data/content/sa-prissatter-vi-bilar";

const CONTENT: Record<string, React.ComponentType> = {
  "volvo-xc60-generationer": VolvoXC60Generationer,
  "tesla-model-y-prissattning": TeslaModelYPrissattning,
  "suv-jamforelse-300000": SuvJamforelse300000,
  "toyota-rav4-generationer": ToyotaRav4Generationer,
  handlarpremie: Handlarpremie,
  "elbil-phev-hybrid-restvarde": ElbilPhevHybridRestvarde,
  "vw-golf-20-ar": VwGolf20Ar,
  "premiumutrustning-aterforsakringsvarde":
    PremiumutrustningAterforsakringsvarde,
  "kia-niro-basta-vardet": KiaNiroBastaVardet,
  "sa-prissatter-vi-bilar": SaPrissatterViBilar,
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.seoTitle || article.title,
    description: article.excerpt,
    openGraph: {
      title: `${article.seoTitle || article.title} | Hela Notan`,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      locale: "sv_SE",
    },
    alternates: {
      canonical: `https://helanotan.se/artiklar/${slug}`,
    },
  };
}

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const Content = CONTENT[slug];
  if (!Content) notFound();

  const related = getRelatedArticles(slug);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <BackLink />

      {/* Article header */}
      <header className="max-w-prose mx-auto space-y-4">
        <CategoryBadge category={article.category} />
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--foreground)] leading-tight">
          {article.title}
        </h1>
        <p className="text-[var(--muted)] text-base sm:text-lg leading-relaxed">
          {article.subtitle}
        </p>
        <div className="flex gap-3 text-xs text-[var(--muted)]">
          <time dateTime={article.date}>{formatDate(article.date)}</time>
          <span>&middot;</span>
          <span>{article.readingTime} min läsning</span>
        </div>
      </header>

      {/* Article body */}
      <ArticleBody>
        <Content />
      </ArticleBody>

      {/* JSON-LD Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt,
            datePublished: article.date,
            author: {
              "@type": "Organization",
              name: "Hela Notan",
              url: "https://helanotan.se",
            },
            publisher: {
              "@type": "Organization",
              name: "Hela Notan",
              url: "https://helanotan.se",
            },
            mainEntityOfPage: `https://helanotan.se/artiklar/${slug}`,
            inLanguage: "sv",
          }),
        }}
      />

      {/* JSON-LD BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Hela Notan",
                item: "https://helanotan.se",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Artiklar",
                item: "https://helanotan.se/artiklar",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: article.title,
              },
            ],
          }),
        }}
      />

      {/* Related articles */}
      <div className="max-w-prose mx-auto">
        <RelatedArticles articles={related} />
      </div>
    </div>
  );
}
