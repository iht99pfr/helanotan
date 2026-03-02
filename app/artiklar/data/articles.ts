import type { ArticleMeta, ArticleCategory } from "./types";

export const articles: ArticleMeta[] = [
  {
    slug: "volvo-xc60-generationer",
    title: "Volvo XC60: Generationsbytet som förändrar allt",
    subtitle:
      "Varför en 2018:a kan kosta dubbelt så mycket som en 2017 — och om gen 1 är det smartare köpet.",
    category: "Modellguider",
    date: "2026-02-15",
    readingTime: 8,
    excerpt:
      "XC60:s generationsbyte skapar den skarpaste prisklyftan i vår data. Vi analyserar 2 062 annonser för att förstå vad du faktiskt får för pengarna.",
    seoTitle: "Volvo XC60 begagnad — Generation 1 vs 2, pris och värdeminskning",
    relatedSlugs: ["suv-jamforelse-300000", "premiumutrustning-aterforsakringsvarde"],
  },
  {
    slug: "tesla-model-y-prissattning",
    title: "Tesla Model Y: Bilen alla prissätter lika",
    subtitle:
      "Den enda bilen i vår data där handlare och privat kostar exakt lika mycket — och varför.",
    category: "Marknadsanalyser",
    date: "2026-02-17",
    readingTime: 7,
    excerpt:
      "Model Y är unik: noll procent handlarpremie, 91% säljs av handlare, och vår regressionsmodell förklarar bara 68% av prisvariationen. Vi förklarar varför.",
    seoTitle: "Tesla Model Y begagnad pris — värdeminskning och marknadsanalys",
    relatedSlugs: ["elbil-phev-hybrid-restvarde", "handlarpremie"],
  },
  {
    slug: "suv-jamforelse-300000",
    title: "Vad 300 000 kr köper: Sju SUV:ar i samma prisklass",
    subtitle:
      "En 3,5 år gammal XC40 eller en 8 år gammal X3? Vi jämför vad pengarna räcker till.",
    category: "Jamforelser",
    date: "2026-02-19",
    readingTime: 9,
    featured: true,
    excerpt:
      "300 000 kr är sweet spot för begagnade SUV:ar i Sverige. Vi jämför XC40, XC60, X3, GLC, RAV4, Tiguan och Model Y — ålder, mil, utrustning och framtida värdeminskning.",
    seoTitle: "Bästa begagnade SUV för 300 000 kr — 7 modeller jämförda",
    relatedSlugs: ["volvo-xc60-generationer", "toyota-rav4-generationer", "kia-niro-basta-vardet"],
  },
  {
    slug: "toyota-rav4-generationer",
    title: "Toyota RAV4: Tre generationer, tre helt olika bilar",
    subtitle:
      "Från bensindriven kompakt-SUV till hybridmaskin — och vad det gör med priserna.",
    category: "Modellguider",
    date: "2026-02-20",
    readingTime: 8,
    excerpt:
      "RAV4 spänner över tre generationer med dramatiska prisskillnader. Gen 5 hybrid dominerar — men är äldre generationer undervärderade fynd?",
    seoTitle: "Toyota RAV4 begagnad — generation 3, 4 och 5 jämförda",
    relatedSlugs: ["suv-jamforelse-300000", "elbil-phev-hybrid-restvarde"],
  },
  {
    slug: "handlarpremie",
    title: "Handlarpremien: Hur mycket mer betalar du hos en bilhandlare?",
    subtitle:
      "Från 0% för Tesla till nästan 100% för Tiguan — vi kvantifierar handlarpåslaget.",
    category: "Marknadsanalyser",
    date: "2026-02-22",
    readingTime: 7,
    excerpt:
      "Med data från ~10 000 annonser kvantifierar vi handlarpremien per modell. Spridningen är enorm — men de rena siffrorna är vilseledande.",
    seoTitle: "Handlare eller privat — hur stor är prisskillnaden på begagnad bil?",
    relatedSlugs: ["tesla-model-y-prissattning", "sa-prissatter-vi-bilar"],
  },
  {
    slug: "elbil-phev-hybrid-restvarde",
    title: "Elbil, PHEV eller hybrid — vilken drivlina håller värdet bäst?",
    subtitle:
      "Kia Niro som perfekt testfall: samma kaross, tre drivlinor, helt olika priskurvor.",
    category: "Jamforelser",
    date: "2026-02-24",
    readingTime: 8,
    excerpt:
      "Vi jämför elbil, PHEV och hybrid i samma modell med regressionsanalys. Resultaten utmanar antagandet att elbilar tappar mest.",
    seoTitle: "Elbil vs PHEV vs hybrid — värdeminskning och restvärde jämfört",
    relatedSlugs: ["kia-niro-basta-vardet", "tesla-model-y-prissattning"],
  },
  {
    slug: "vw-golf-20-ar",
    title: "VW Golf: Från 35 000 till 600 000 — 20 år av Sveriges mest sålda bil",
    subtitle:
      "Den mest kompletta priskurvan i vår data, med prisplatåer, generationshopp och GTI-premium.",
    category: "Modellguider",
    date: "2026-02-25",
    readingTime: 8,
    excerpt:
      "1 774 annonser, 20+ årsmodeller, och en priskurva som avslöjar var värdeminskningskurvorna planar ut. Plus: är Golf GTI och R värt premium-priset?",
    seoTitle: "VW Golf begagnad — pris per årsmodell, GTI, R och värdeminskning",
    relatedSlugs: ["suv-jamforelse-300000", "handlarpremie"],
  },
  {
    slug: "premiumutrustning-aterforsakringsvarde",
    title: "Premiumutrustning som faktiskt påverkar begagnatpriset",
    subtitle:
      "Panoramatak, ventilerade säten, HUD — vilka tillval ger avkastning vid försäljning?",
    category: "Sa funkar det",
    date: "2026-02-27",
    readingTime: 7,
    excerpt:
      "Med AI-extraherad utrustningsdata och regressionsanalys identifierar vi vilka tillval som faktiskt höjer andrahandsvärdet — och vilka som är bortkastade pengar.",
    seoTitle: "Extrautrustning som påverkar begagnatpriset — data från 10 000 annonser",
    relatedSlugs: ["sa-prissatter-vi-bilar", "volvo-xc60-generationer"],
  },
  {
    slug: "kia-niro-basta-vardet",
    title: "Kia Niro: Bästa värdet bland elektrifierade bilar?",
    subtitle:
      "20% billigare än Model Y, tre drivlinor och den mest förutsägbara prissättningen i segmentet.",
    category: "Modellguider",
    date: "2026-02-28",
    readingTime: 7,
    excerpt:
      "Niro undercuts alla rivaler prismässigt — elbil för 305 000 mot Model Y:s 382 000. Vi undersöker om märkesrabatten är berättigad.",
    seoTitle: "Kia Niro begagnad — bästa elbilen för pengarna?",
    relatedSlugs: ["elbil-phev-hybrid-restvarde", "suv-jamforelse-300000"],
  },
  {
    slug: "sa-prissatter-vi-bilar",
    title: "Så prissätter vi 10 000 begagnade bilar med maskininlärning",
    subtitle:
      "Bakom kulisserna: regression, deal-scoring och varför vissa bilar är omöjliga att prissätta.",
    category: "Sa funkar det",
    date: "2026-03-01",
    readingTime: 9,
    excerpt:
      "En teknisk genomgång av hur Hela Notan fungerar: regressionsmodeller, 15+ features, och hur vi hittar bilarna som är prissatta under marknadsvärde.",
    seoTitle: "Hur Hela Notan prissätter begagnade bilar — maskininlärning förklarat",
    relatedSlugs: ["premiumutrustning-aterforsakringsvarde", "handlarpremie"],
  },
];

export function getArticleBySlug(slug: string): ArticleMeta | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(cat: ArticleCategory): ArticleMeta[] {
  return articles.filter((a) => a.category === cat);
}

export function getFeaturedArticle(): ArticleMeta {
  return articles.find((a) => a.featured) || articles[0];
}

export function getRelatedArticles(slug: string): ArticleMeta[] {
  const article = getArticleBySlug(slug);
  if (!article) return [];
  return article.relatedSlugs
    .map((s) => getArticleBySlug(s))
    .filter(Boolean) as ArticleMeta[];
}
