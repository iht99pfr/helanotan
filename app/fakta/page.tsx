import type { Metadata } from "next";
import { getDb } from "@/app/lib/db";
import ShareBar from "@/app/components/ShareBar";

export const metadata: Metadata = {
  title: "Kostar mer än du tror — Hela Notan",
  description:
    "Insikter och fakta om bilkostnader i Sverige baserat på analys av tusentals Blocket-annonser.",
  openGraph: {
    title: "Kostar mer än du tror — Hela Notan",
    description:
      "Insikter och fakta om bilkostnader i Sverige baserat på tusentals Blocket-annonser.",
    url: "https://helanotan.se/fakta",
    siteName: "Hela Notan",
  },
};

function formatKr(n: number): string {
  return Math.round(n).toLocaleString("sv-SE");
}

interface StatCard {
  title: string;
  value: string;
  description: string;
  color: "red" | "green" | "blue" | "amber";
}

export default async function FaktaPage() {
  const sql = getDb();

  // Fetch interesting stats
  const [totalResult] = await sql`
    SELECT COUNT(*) as total FROM cars_enriched
    WHERE (exclusion_tags = '[]'::jsonb OR exclusion_tags IS NULL)
      AND model_year >= 2005
      AND (is_active = TRUE OR is_active IS NULL)
  `;

  const [avgPriceResult] = await sql`
    SELECT AVG(price_sek) as avg_price FROM cars_enriched
    WHERE (exclusion_tags = '[]'::jsonb OR exclusion_tags IS NULL)
      AND model_year >= 2005
      AND (is_active = TRUE OR is_active IS NULL)
      AND price_sek >= 20000
  `;

  // Most expensive model on average
  const [priciest] = await sql`
    SELECT model_key, AVG(price_sek) as avg_price, COUNT(*) as cnt
    FROM cars_enriched
    WHERE (exclusion_tags = '[]'::jsonb OR exclusion_tags IS NULL)
      AND model_year >= 2020
      AND (is_active = TRUE OR is_active IS NULL)
      AND price_sek >= 20000
    GROUP BY model_key
    HAVING COUNT(*) >= 5
    ORDER BY avg_price DESC
    LIMIT 1
  `;

  // Cheapest model on average
  const [cheapest] = await sql`
    SELECT model_key, AVG(price_sek) as avg_price, COUNT(*) as cnt
    FROM cars_enriched
    WHERE (exclusion_tags = '[]'::jsonb OR exclusion_tags IS NULL)
      AND model_year >= 2020
      AND (is_active = TRUE OR is_active IS NULL)
      AND price_sek >= 20000
    GROUP BY model_key
    HAVING COUNT(*) >= 5
    ORDER BY avg_price ASC
    LIMIT 1
  `;

  // Biggest price drop: 1-year-old vs new
  const firstYearDrop = await sql`
    SELECT model_key,
      AVG(CASE WHEN model_year = 2026 THEN price_sek END) as new_price,
      AVG(CASE WHEN model_year = 2025 THEN price_sek END) as one_year_price,
      COUNT(*) as cnt
    FROM cars_enriched
    WHERE (exclusion_tags = '[]'::jsonb OR exclusion_tags IS NULL)
      AND model_year IN (2025, 2026)
      AND (is_active = TRUE OR is_active IS NULL)
      AND price_sek >= 20000
    GROUP BY model_key
    HAVING COUNT(CASE WHEN model_year = 2026 THEN 1 END) >= 3
       AND COUNT(CASE WHEN model_year = 2025 THEN 1 END) >= 3
    ORDER BY (AVG(CASE WHEN model_year = 2026 THEN price_sek END) - AVG(CASE WHEN model_year = 2025 THEN price_sek END)) DESC
    LIMIT 1
  `;

  // Dealer premium
  const [dealerPremium] = await sql`
    SELECT
      AVG(CASE WHEN seller_type = 'Dealer' THEN price_sek END) as dealer_avg,
      AVG(CASE WHEN seller_type != 'Dealer' THEN price_sek END) as private_avg
    FROM cars_enriched
    WHERE (exclusion_tags = '[]'::jsonb OR exclusion_tags IS NULL)
      AND model_year >= 2018
      AND (is_active = TRUE OR is_active IS NULL)
      AND price_sek >= 20000
  `;

  // EV vs Petrol average price
  const evVsPetrol = await sql`
    SELECT
      AVG(CASE WHEN LOWER(fuel_type) = 'el' THEN price_sek END) as ev_avg,
      AVG(CASE WHEN LOWER(fuel_type) LIKE '%bensin%' THEN price_sek END) as petrol_avg
    FROM cars_enriched
    WHERE (exclusion_tags = '[]'::jsonb OR exclusion_tags IS NULL)
      AND model_year >= 2020
      AND (is_active = TRUE OR is_active IS NULL)
      AND price_sek >= 20000
  `;

  const totalCars = Number(totalResult?.total || 0);
  const avgPrice = Number(avgPriceResult?.avg_price || 0);
  const dealerAvg = Number(dealerPremium?.dealer_avg || 0);
  const privateAvg = Number(dealerPremium?.private_avg || 0);
  const dealerPremiumPct =
    privateAvg > 0 ? ((dealerAvg - privateAvg) / privateAvg) * 100 : 0;

  const biggestDrop = firstYearDrop[0];
  const dropAmount = biggestDrop
    ? Number(biggestDrop.new_price) - Number(biggestDrop.one_year_price)
    : 0;

  const evAvg = Number(evVsPetrol[0]?.ev_avg || 0);
  const petrolAvg = Number(evVsPetrol[0]?.petrol_avg || 0);

  const colorClasses = {
    red: "border-red-200 bg-red-50",
    green: "border-green-200 bg-green-50",
    blue: "border-blue-200 bg-blue-50",
    amber: "border-amber-200 bg-amber-50",
  };

  const valueClasses = {
    red: "text-red-700",
    green: "text-green-700",
    blue: "text-blue-700",
    amber: "text-amber-700",
  };

  const stats: StatCard[] = [
    {
      title: "Bilar analyserade",
      value: formatKr(totalCars).replace(" kr", ""),
      description: `Just nu analyserar vi ${formatKr(totalCars).replace(" kr", "")} aktiva Blocket-annonser för att beräkna verkliga marknadspriser.`,
      color: "blue",
    },
    {
      title: "Snittpris begagnad bil",
      value: `${formatKr(avgPrice)} kr`,
      description: "Genomsnittspriset för alla modeller vi spårar (2005 och nyare).",
      color: "blue",
    },
    {
      title: "Handlarpremien",
      value: `+${dealerPremiumPct.toFixed(0)}%`,
      description: `En bil hos handlare kostar i snitt ${dealerPremiumPct.toFixed(0)}% mer än samma bil privat. Det är ${formatKr(dealerAvg - privateAvg)} kr extra.`,
      color: "amber",
    },
  ];

  if (biggestDrop && dropAmount > 0) {
    stats.push({
      title: `${biggestDrop.model_key}: första årets tapp`,
      value: `−${formatKr(dropAmount)} kr`,
      description: `En ny ${biggestDrop.model_key} tappar i snitt ${formatKr(dropAmount)} kr det första året. Det är ${formatKr(dropAmount / 12)} kr per månad bara i värdeminskning.`,
      color: "red",
    });
  }

  if (priciest) {
    stats.push({
      title: "Dyraste modellen (snitt)",
      value: `${priciest.model_key}`,
      description: `${priciest.model_key} har det högsta snittpriset bland 2020+ modeller: ${formatKr(Number(priciest.avg_price))} kr.`,
      color: "red",
    });
  }

  if (cheapest) {
    stats.push({
      title: "Billigaste modellen (snitt)",
      value: `${cheapest.model_key}`,
      description: `${cheapest.model_key} är billigast i snitt bland 2020+ modeller: ${formatKr(Number(cheapest.avg_price))} kr.`,
      color: "green",
    });
  }

  if (evAvg > 0 && petrolAvg > 0) {
    const diff = evAvg - petrolAvg;
    stats.push({
      title: "Elbil vs bensin",
      value: `+${formatKr(diff)} kr`,
      description: `En elbil kostar i snitt ${formatKr(diff)} kr mer än en bensinbil (2020+ modeller). Men driftskostnaden är lägre — kolla vår TCO-kalkylator.`,
      color: "amber",
    });
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex items-start justify-between mb-2">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Kostar mer än du tror
        </h1>
        <ShareBar
          url="https://helanotan.se/fakta"
          title="Kostar mer än du tror — bilkostnader i Sverige"
          description={`Vi analyserade ${formatKr(totalCars).replace(" kr", "")} bilar på Blocket. Handlarpremien är ${dealerPremiumPct.toFixed(0)}%.`}
          eventPrefix="fakta"
        />
      </div>
      <p className="text-[var(--muted)] mb-10">
        Insikter baserade på analys av {formatKr(totalCars).replace(" kr", "")}{" "}
        Blocket-annonser. Uppdateras löpande.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`border rounded-lg p-5 ${colorClasses[stat.color]}`}
          >
            <div className="text-xs font-medium text-[var(--muted)] mb-1">
              {stat.title}
            </div>
            <div
              className={`text-2xl font-bold mb-2 ${valueClasses[stat.color]}`}
            >
              {stat.value}
            </div>
            <p className="text-sm text-[var(--muted)]">{stat.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-[var(--card)] border border-[var(--border)] rounded-lg p-5">
        <h2 className="text-sm font-semibold text-[var(--foreground)] mb-2">
          Vill du veta mer?
        </h2>
        <p className="text-sm text-[var(--muted)] mb-3">
          Använd våra verktyg för att analysera din egen bil:
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href="/tco"
            className="text-sm px-4 py-2 bg-[var(--foreground)] text-white rounded-lg hover:opacity-90 transition"
          >
            TCO-kalkylator
          </a>
          <a
            href="/toppen"
            className="text-sm px-4 py-2 border border-[var(--border)] rounded-lg hover:border-[var(--muted)] transition"
          >
            Värdeminskning-ligan
          </a>
          <a
            href="/kopguide"
            className="text-sm px-4 py-2 border border-[var(--border)] rounded-lg hover:border-[var(--muted)] transition"
          >
            Köpguide
          </a>
          <a
            href="/bevaka"
            className="text-sm px-4 py-2 border border-[var(--border)] rounded-lg hover:border-[var(--muted)] transition"
          >
            Bevaka din bil
          </a>
        </div>
      </div>
    </main>
  );
}
