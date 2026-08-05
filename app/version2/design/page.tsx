import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import { getDb } from "@/app/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "v2.0 — designprototyp",
  robots: { index: false, follow: false },
};

/* The v2.0 visual identity, prototyped as a full page.
 *
 * Concept: "Hela Notan" means the bill — so the design language is a ledger.
 * Serif display type for publication authority (Fraunces), every number in
 * tabular mono like a bank statement, ink-black body text at full contrast
 * (v1 renders all body copy grey), hairline rules instead of card borders,
 * and green reserved EXCLUSIVELY for money-to-be-saved. Nothing else is green.
 *
 * Rendered as a fixed overlay so the prototype fully replaces the v1 chrome
 * without touching the root layout.
 */

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz"],
});

/* ------------------------------------------------------------------ data */
async function getData() {
  const sql = getDb();
  const [counts] = await sql`
    SELECT count(*)::int AS total, count(*) FILTER (WHERE is_active)::int AS active
    FROM cars_enriched WHERE model_key IS NOT NULL`;
  const [updated] = await sql`
    SELECT to_char(max(updated_at), 'YYYY-MM-DD') AS d FROM web_cache`;
  const drops = await sql`
    SELECT * FROM (
      SELECT DISTINCT ON (e.model_key) e.make, e.model, e.model_year, e.price_sek,
             e.mileage_mil, e.fuel_type, h.first_price,
             h.first_price - e.price_sek AS drop_kr,
             (now()::date - h.min_seen::date)::int AS days
      FROM cars_enriched e
      JOIN (SELECT listing_id,
                   (array_agg(price_sek ORDER BY seen_at))[1] AS first_price,
                   min(seen_at) AS min_seen
            FROM price_history GROUP BY listing_id HAVING count(*) > 1) h
        ON h.listing_id = e.listing_id
      WHERE e.is_active AND e.price_sek < h.first_price
      ORDER BY e.model_key, h.first_price - e.price_sek DESC
    ) t ORDER BY drop_kr DESC LIMIT 3`;
  const ligan = await sql`
    SELECT model_key,
      percentile_cont(0.5) WITHIN GROUP (ORDER BY price_sek)
        FILTER (WHERE car_age_years <= 1.5)::int AS p_new,
      percentile_cont(0.5) WITHIN GROUP (ORDER BY price_sek)
        FILTER (WHERE car_age_years BETWEEN 3.5 AND 5.5)::int AS p_old,
      count(*) FILTER (WHERE car_age_years <= 1.5)::int AS n_new,
      count(*) FILTER (WHERE car_age_years BETWEEN 3.5 AND 5.5)::int AS n_old
    FROM cars_enriched
    WHERE exclusion_tags = '[]'::jsonb AND price_sek >= 20000
    GROUP BY 1`;
  const rows = ligan
    .filter((r) => r.p_new && r.p_old && r.n_new >= 25 && r.n_old >= 25)
    .map((r) => ({
      key: r.model_key as string,
      perMonth: Math.round((r.p_new - r.p_old) / 36 / 10) * 10,
      n: (r.n_new as number) + (r.n_old as number),
    }))
    .sort((a, b) => a.perMonth - b.perMonth);
  return {
    total: counts.total as number,
    active: counts.active as number,
    updated: updated.d as string,
    drops,
    best: rows.slice(0, 3),
    worst: rows[rows.length - 1],
  };
}

const fmt = (n: number) => new Intl.NumberFormat("sv-SE").format(n);
const LABELS: Record<string, string> = {
  YarisCross: "Toyota Yaris Cross", Yaris: "Toyota Yaris", Golf: "VW Golf",
  XC40: "Volvo XC40", Defender: "Land Rover Defender", GLC: "Mercedes GLC",
  Niro: "Kia Niro", XC60: "Volvo XC60", RAV4: "Toyota RAV4",
};

/* ------------------------------------------------------------------ page */
export default async function DesignPrototype() {
  const d = await getData();

  const ink = "#171512";
  const paper = "#f8f4ec";
  const paperDeep = "#f1ebdf";
  const rule = "#d9d2c4";
  const money = "#1a5c3a";

  return (
    <div
      className={`${fraunces.variable} fixed inset-0 z-[100] overflow-y-auto overscroll-contain`}
      style={{ background: paper, color: ink }}
    >
      {/* prototype banner */}
      <a
        href="/version2"
        className="fixed bottom-4 right-4 z-[110] rounded-full px-4 py-2 text-xs font-mono shadow-lg"
        style={{ background: ink, color: paper }}
      >
        Designprototyp · till specen →
      </a>

      {/* ------------------------------------------------------- nav */}
      <header className="border-b" style={{ borderColor: rule }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <span
            className="text-2xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Hela&nbsp;Notan
          </span>
          <nav className="hidden md:flex items-center gap-7 text-[15px]">
            {["Hitta bil", "Modeller", "Vad kostar den?", "Ligan", "Jämför"].map(
              (l, i) => (
                <span
                  key={l}
                  className={i === 0 ? "font-semibold border-b-2 pb-0.5" : ""}
                  style={i === 0 ? { borderColor: ink } : undefined}
                >
                  {l}
                </span>
              ),
            )}
          </nav>
          <span
            className="font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 border rounded-sm"
            style={{ borderColor: money, color: money }}
          >
            Uppdaterad {d.updated}
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* ------------------------------------------------------ hero */}
        <section className="pt-14 sm:pt-20 pb-10 grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-start">
          <div>
            <h1
              className="text-[44px] sm:text-[64px] leading-[1.03] font-medium"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Priset är inte
              <br />
              <em className="font-light">kostnaden.</em>
            </h1>
            <p className="mt-6 text-lg max-w-md leading-relaxed">
              Vi räknar ut vad en begagnad bil faktiskt kostar per månad —
              värdeminskning, skatt, försäkring, service och drivmedel.
              Uträkningen är öppen.
            </p>

            {/* receipt-style proof strip */}
            <div
              className="mt-8 max-w-md font-mono text-[13px] leading-7 py-3"
              style={{ borderTop: `1px dashed ${ink}`, borderBottom: `1px dashed ${ink}` }}
            >
              <div className="flex justify-between"><span>ANALYSERADE ANNONSER</span><span>{fmt(d.total)}</span></div>
              <div className="flex justify-between"><span>TILL SALU JUST NU</span><span>{fmt(d.active)}</span></div>
              <div className="flex justify-between"><span>MODELLER PÅ DJUPET</span><span>18</span></div>
              <div className="flex justify-between font-bold"><span>SENAST UPPDATERAD</span><span>{d.updated}</span></div>
            </div>
          </div>

          {/* budget entry */}
          <div
            className="rounded-lg p-6 sm:p-7 border shadow-sm"
            style={{ background: paperDeep, borderColor: rule }}
          >
            <p
              className="text-2xl font-medium"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Vad får jag för pengarna?
            </p>
            <label className="block mt-5 text-sm font-medium">Min budget</label>
            <div
              className="mt-2 flex items-baseline gap-2 border-b-2 pb-2"
              style={{ borderColor: ink }}
            >
              <span className="font-mono text-3xl tabular-nums">300 000</span>
              <span className="text-sm" style={{ color: "#6b6459" }}>kr</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Alla", "SUV", "Kombi", "Småbil", "Elbil"].map((s, i) => (
                <span
                  key={s}
                  className="rounded-full px-4 py-1.5 text-sm border"
                  style={
                    i === 1
                      ? { background: ink, color: paper, borderColor: ink }
                      : { borderColor: rule }
                  }
                >
                  {s}
                </span>
              ))}
            </div>
            <div
              className="mt-6 rounded-md text-center py-3.5 font-semibold text-[15px]"
              style={{ background: ink, color: paper }}
            >
              Visa vad jag får →
            </div>
            <p className="mt-3 text-xs" style={{ color: "#6b6459" }}>
              Rankat efter total månadskostnad, inte pris.
            </p>
          </div>
        </section>

        {/* --------------------------------------------- price drops */}
        <section className="py-12 border-t" style={{ borderColor: rule }}>
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <h2
              className="text-3xl font-medium"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Säljare som sänkt priset
            </h2>
            <span className="font-mono text-xs uppercase tracking-wider" style={{ color: "#6b6459" }}>
              Riktiga annonser · syns inte ens på Blocket
            </span>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-5">
            {d.drops.map((c) => (
              <article
                key={`${c.make}${c.model_year}${c.price_sek}`}
                className="rounded-lg border p-5 flex flex-col"
                style={{ background: "#fff", borderColor: rule }}
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h3 className="font-semibold text-[17px] leading-tight">
                      {c.make} {c.model} {c.model_year}
                    </h3>
                    <p className="text-sm mt-0.5" style={{ color: "#6b6459" }}>
                      {fmt(c.mileage_mil)} mil · {c.fuel_type}
                    </p>
                  </div>
                </div>

                {/* the ledger: struck first price, current price, saving */}
                <div className="mt-4 font-mono text-sm tabular-nums leading-7">
                  <div className="flex justify-between" style={{ color: "#6b6459" }}>
                    <span>Begärt {c.days} dgr sedan</span>
                    <s>{fmt(c.first_price)} kr</s>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Begärt nu</span>
                    <span>{fmt(c.price_sek)} kr</span>
                  </div>
                  <div
                    className="flex justify-between font-bold border-t mt-1 pt-1"
                    style={{ color: money, borderColor: rule }}
                  >
                    <span>Sänkt</span>
                    <span>−{fmt(c.drop_kr)} kr</span>
                  </div>
                </div>

                <p className="mt-3 text-xs leading-relaxed" style={{ color: "#6b6459" }}>
                  {c.days} dagar på Blocket. Ett sänkt pris som ligger kvar är
                  en motiverad säljare — kontrollera alltid skick och historik.
                </p>
                <div
                  className="mt-4 rounded-md text-center py-2.5 text-sm font-semibold border"
                  style={{ borderColor: ink }}
                >
                  Visa på Blocket ↗
                </div>
              </article>
            ))}

            {d.drops.length < 3 && (
              <article
                className="rounded-lg border border-dashed p-5 flex flex-col justify-center text-center"
                style={{ borderColor: rule, color: "#6b6459" }}
              >
                <p className="font-mono text-3xl tabular-nums">+{fmt(83 - d.drops.length)}</p>
                <p className="text-sm mt-2">
                  fler prissänkningar registrerade — fylls på för varje
                  veckouppdatering
                </p>
              </article>
            )}
          </div>
        </section>

        {/* ------------------------------------------------- the ligan */}
        <section className="py-12 border-t" style={{ borderColor: rule }}>
          <h2
            className="text-3xl font-medium"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Vad kostar de att äga?
          </h2>
          <p className="mt-2 max-w-lg">
            Värdeminskning i kronor per månad — köpt ny, såld efter fyra år.
            Median av riktiga begärda priser, inte en tumregel.
          </p>

          <div className="mt-6 max-w-2xl font-mono text-sm tabular-nums">
            {d.best.map((r, i) => (
              <div
                key={r.key}
                className="flex items-center gap-4 py-3 border-b"
                style={{ borderColor: rule }}
              >
                <span className="w-5" style={{ color: "#6b6459" }}>{i + 1}.</span>
                <span className="flex-1 font-sans font-medium">
                  {LABELS[r.key] ?? r.key}
                </span>
                <span className="text-xs" style={{ color: "#6b6459" }}>
                  n={fmt(r.n)}
                </span>
                <span className="w-32 text-right font-bold" style={{ color: money }}>
                  {fmt(r.perMonth)} kr/mån
                </span>
              </div>
            ))}
            {d.worst && (
              <div className="flex items-center gap-4 py-3" >
                <span className="w-5" style={{ color: "#6b6459" }}>…</span>
                <span className="flex-1 font-sans font-medium">
                  {LABELS[d.worst.key] ?? d.worst.key}
                </span>
                <span className="text-xs" style={{ color: "#6b6459" }}>
                  n={fmt(d.worst.n)}
                </span>
                <span className="w-32 text-right font-bold">
                  {fmt(d.worst.perMonth)} kr/mån
                </span>
              </div>
            )}
          </div>
          <p className="mt-4 font-mono text-xs" style={{ color: "#6b6459" }}>
            Hela ligan → · Så räknar vi →
          </p>
        </section>

        {/* -------------------------------------------------- honesty */}
        <section className="py-12 border-t" style={{ borderColor: rule }}>
          <div className="grid md:grid-cols-2 gap-8 items-start max-w-4xl">
            <div>
              <h2
                className="text-3xl font-medium"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Hur fel kan vi ha?
              </h2>
              <p className="mt-3 leading-relaxed">
                Varje uppskattning visas med sitt osäkerhetsintervall — i
                kronor, inte statistik. Det är skillnaden mellan oss och en
                tumregel: vi berättar när underlaget är tunt.
              </p>
            </div>
            <div
              className="rounded-lg border p-5 font-mono text-sm tabular-nums leading-7"
              style={{ background: "#fff", borderColor: rule }}
            >
              <p className="font-sans font-semibold text-base">
                Toyota RAV4 2022 · 8 000 mil
              </p>
              <div className="flex justify-between mt-2">
                <span style={{ color: "#6b6459" }}>Sannolikt pris</span>
                <span className="font-bold">340–435 tkr</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#6b6459" }}>Underlag</span>
                <span>1 675 annonser</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#6b6459" }}>Precision</span>
                <span>±14 %</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------- footer */}
      <footer className="border-t mt-8" style={{ borderColor: rule, background: paperDeep }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 grid sm:grid-cols-3 gap-8 text-sm">
          <div>
            <p className="text-xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
              Hela Notan
            </p>
            <p className="mt-2 leading-relaxed" style={{ color: "#6b6459" }}>
              18 modeller på djupet i stället för 15 000 ytligt. Byggt på{" "}
              {fmt(d.total)} annonser från Blocket. All metodik öppen.
            </p>
          </div>
          <div className="font-mono text-xs leading-6" style={{ color: "#6b6459" }}>
            HITTA BIL · MODELLER · VAD KOSTAR DEN
            <br />
            LIGAN · JÄMFÖR · ARTIKLAR
            <br />
            SÅ RÄKNAR VI · OM OSS
          </div>
          <div className="font-mono text-xs leading-6 sm:text-right" style={{ color: "#6b6459" }}>
            DATA FRÅN BLOCKET.SE
            <br />
            UPPDATERAD {d.updated}
            <br />
            ETT PROJEKT AV UP NORTH AI
          </div>
        </div>
      </footer>
    </div>
  );
}
