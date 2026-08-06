import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { canonical } from "@/app/lib/canonical";
import { getModelIndex, getModelPage } from "@/app/lib/model-page";
import { getSiteStats, sv } from "@/app/lib/site-stats";
import DealList from "./DealList";

// Rebuilt hourly. The pipeline publishes roughly daily, so this is far more
// often than the data changes — but a stale price on a page whose whole claim
// is "riktiga priser från Blocket" is the one error worth spending on.
export const revalidate = 3600;

export async function generateStaticParams() {
  const models = await getModelIndex();
  return models.map((m) => ({ modell: m.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ modell: string }> },
): Promise<Metadata> {
  const { modell } = await params;
  const data = await getModelPage(modell);
  if (!data) return {};

  const loss = data.firstYearLoss
    ? ` Tappar ${sv(data.firstYearLoss)} kr första året.`
    : "";
  const description =
    `Vad tappar en ${data.label} i värde? ${sv(data.count)} annonser från ` +
    `Blocket analyserade.${loss} Medianpris per årsmodell, miltalseffekt och ` +
    `aktuella annonser under prisestimat.`;

  return {
    title: `${data.label} — värdeminskning och priser`,
    description,
    alternates: canonical(`/bilar/${data.slug}`),
    // A model with too few year rows renders a near-empty page; keep it
    // reachable for anyone who lands on it, but out of the index.
    robots: data.indexable ? undefined : { index: false, follow: true },
    openGraph: {
      title: `${data.label} — värdeminskning och priser | Hela Notan`,
      description,
      url: `https://helanotan.se/bilar/${data.slug}`,
      siteName: "Hela Notan",
      locale: "sv_SE",
      type: "article",
    },
  };
}

const kr = (n: number) => n.toLocaleString("sv-SE");

function Stat({ value, label, hint }: { value: string; label: string; hint?: string }) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
      <div className="text-2xl font-bold font-mono text-[var(--foreground)]">{value}</div>
      <div className="text-sm text-[var(--foreground)] mt-0.5">{label}</div>
      {hint && <div className="text-xs text-[var(--muted)] mt-1">{hint}</div>}
    </div>
  );
}

export default async function ModelPage(
  { params }: { params: Promise<{ modell: string }> },
) {
  const { modell } = await params;
  const [data, stats, index] = await Promise.all([
    getModelPage(modell),
    getSiteStats(),
    getModelIndex(),
  ]);
  if (!data) notFound();

  const others = index.filter((m) => m.key !== data.key).slice(0, 8);
  const monthlyFirstYear = data.firstYearLoss ? Math.round(data.firstYearLoss / 12) : null;

  return (
    <article className="space-y-10 max-w-4xl">
      <header className="space-y-3">
        <p className="text-sm text-[var(--muted)]">
          <Link href="/bilar" className="hover:text-[var(--foreground)] underline">
            Alla modeller
          </Link>
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
          {data.label} — värdeminskning och priser
        </h1>
        <p className="text-[var(--muted)]">
          Baserat på {sv(data.count)} annonser för {data.label} från Blocket.se,
          varav {sv(data.activeCount)} till salu just nu. Årsmodell{" "}
          {data.yearRange[0]}–{data.yearRange[1]}. Uppdaterad {stats.lastUpdatedLong}.
        </p>
      </header>

      {/* The numbers a buyer came for, in the HTML rather than behind a fetch. */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {data.anchorPrice != null && (
          <Stat
            value={`${kr(data.anchorPrice)} kr`}
            label={`Medianpris ${data.anchorYear}`}
            hint="Yngsta årsmodell med tillräckligt underlag"
          />
        )}
        {data.firstYearLoss != null && (
          <Stat
            value={`${kr(data.firstYearLoss)} kr`}
            label="Tapp första året"
            hint={monthlyFirstYear ? `≈ ${kr(monthlyFirstYear)} kr/mån` : undefined}
          />
        )}
        {data.retention3 != null && (
          <Stat
            value={`${data.retention3}%`}
            label="Kvar efter 3 år"
            hint={data.retention5 != null ? `${data.retention5}% efter 5 år` : undefined}
          />
        )}
        {data.mileagePctPer1000 != null && (
          <Stat
            value={`−${data.mileagePctPer1000.toFixed(2)}%`}
            label="Per 1 000 mil"
            hint="Av bilens aktuella värde"
          />
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">
          Pris per årsmodell
        </h2>
        <p className="text-[var(--muted)] text-sm">
          Medianpris för utannonserade {data.label} per årsmodell. Kolumnen till
          höger är skillnaden mot ett år yngre bil — alltså vad det året kostade.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
                <th className="py-2 pr-3 font-medium">Årsmodell</th>
                <th className="py-2 pr-3 font-medium text-right">Medianpris</th>
                <th className="py-2 pr-3 font-medium text-right">Ett år äldre kostar</th>
                <th className="py-2 font-medium text-right">Annonser</th>
              </tr>
            </thead>
            <tbody>
              {data.years.map((y) => (
                <tr key={y.year} className="border-b border-[var(--border)]/60">
                  <td className="py-2 pr-3 text-[var(--foreground)]">
                    {y.year}
                    <span className="text-[var(--muted)] text-xs ml-2">
                      {y.age === 0 ? "ny" : `${y.age} år`}
                    </span>
                  </td>
                  <td className="py-2 pr-3 text-right font-mono text-[var(--foreground)]">
                    {kr(y.median)} kr
                  </td>
                  <td className="py-2 pr-3 text-right font-mono text-[var(--muted)]">
                    {y.lossFromYounger == null
                      ? "—"
                      : y.lossFromYounger === 0
                        ? "0 kr"
                        : `−${kr(y.lossFromYounger)} kr`}
                  </td>
                  <td className="py-2 text-right font-mono text-[var(--muted)]">
                    {sv(y.count)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {data.deals.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">
            {data.label} under prisestimat just nu
          </h2>
          <p className="text-[var(--muted)] text-sm">
            Annonser vars begärda pris ligger under vad modellen förutsäger för
            den åldern, det miltalet, den bränsletypen och den utrustningen.
            Ett lågt pris kan ha en bra förklaring — läs annonsen.
          </p>
          <DealList deals={data.deals} modelKey={data.key} label={data.label} />
        </section>
      )}

      <section className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 text-sm text-[var(--muted)] space-y-2">
        <h2 className="text-[var(--foreground)] font-semibold">Så säkert är estimatet</h2>
        {data.estimateUsable && data.uncertaintyPct != null ? (
          <p>
            {/* R² told a buyer nothing. A proportional error does: the model is
                fitted on log(price), so residual_se_log converts directly into
                "give or take X%". One standard deviation — two cars in three. */}
            Prisestimatet för en {data.label} träffar typiskt inom{" "}
            <strong className="text-[var(--foreground)]">
              ±{data.uncertaintyPct}%
            </strong>{" "}
            av det begärda priset — två bilar av tre hamnar där
            {data.anchorPrice != null && (
              <>
                . På en bil för {kr(data.anchorPrice)} kr betyder det ungefär{" "}
                ±{kr(Math.round((data.anchorPrice * data.uncertaintyPct) / 100))} kr
              </>
            )}
            . Enskilda bilar avviker mer: skick, servicehistorik och utrustning
            som inte står i annonsen syns inte i modellen.
          </p>
        ) : data.uncertaintyPct != null ? (
          <p>
            {/* A nameplate spanning seven generations and a fifteenfold price
                range is not one model. Saying so is more useful than printing
                a number with a negative lower bound. */}
            Vi visar <strong className="text-[var(--foreground)]">inget
            prisestimat</strong> för {data.label}. Namnet rymmer för olika bilar
            — {data.yearRange[0]}–{data.yearRange[1]} och{" "}
            {sv(Math.round((data.avgPrice ?? 0) / 1000) * 1000)} kr i snitt över
            flera generationer — för att en gemensam prismodell ska betyda
            något. Osäkerheten hamnar på ±{data.uncertaintyPct}%, vilket är
            bredare än det den försöker mäta. Tabellen ovan är medianer av
            faktiska annonser och står på egna ben.
          </p>
        ) : (
          <p>
            Underlaget för {data.label} räcker inte till en egen prismodell —
            siffrorna ovan är medianer av faktiska annonser, inget estimat.
          </p>
        )}
        <p>
          Alla siffror kommer från {sv(stats.totalCars)} Blocket-annonser som
          samlats in och analyserats. Annonser under 20 000 kr och årsmodeller
          före 2005 exkluderas. <Link href="/metod" className="underline">
            Se underlaget per modell
          </Link>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[var(--foreground)]">Gå vidare</h2>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/tco" className="px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--muted)] transition">
            Räkna ut ägandekostnad för {data.label}
          </Link>
          <Link href="/kopguide" className="px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--muted)] transition">
            Vilken årsmodell ska jag köpa?
          </Link>
          <Link href="/toppen" className="px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--muted)] transition">
            Jämför med andra modeller
          </Link>
        </div>
      </section>

      <section className="space-y-3 border-t border-[var(--border)] pt-6">
        <h2 className="text-lg font-bold text-[var(--foreground)]">Andra modeller</h2>
        <div className="flex flex-wrap gap-2 text-sm">
          {others.map((m) => (
            <Link
              key={m.key}
              href={`/bilar/${m.slug}`}
              className="px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--muted)] transition"
            >
              {m.label}
            </Link>
          ))}
          <Link
            href="/bilar"
            className="px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--muted)] transition font-medium"
          >
            Alla modeller →
          </Link>
        </div>
      </section>
    </article>
  );
}
