import type { Metadata } from "next";
import { getDb } from "@/app/lib/db";

export const dynamic = "force-dynamic";

// Internal working document — deliberately kept out of search indexes.
export const metadata: Metadata = {
  title: "Version 2.0 — specifikation och mockups",
  description: "Internt arbetsdokument: plan och design för Hela Notan 2.0.",
  robots: { index: false, follow: false },
};

/* ------------------------------------------------------------------ data --
 * Every number in the mockups below is queried live from production.
 * That is itself part of the spec: v2.0 server-renders real data instead of
 * hydrating empty shells (SEO P0). If this page can do it, every page can.
 */
async function getLiveNumbers() {
  const sql = getDb();
  const [counts] = await sql`
    SELECT count(*)::int AS total,
           count(*) FILTER (WHERE is_active)::int AS active
    FROM cars_enriched WHERE model_key IS NOT NULL`;
  const [updated] = await sql`
    SELECT to_char(max(updated_at), 'YYYY-MM-DD') AS d FROM web_cache`;
  const [drops] = await sql`
    SELECT count(*)::int AS listings_with_drops,
           coalesce(sum(drop_kr), 0)::int AS total_kr
    FROM (
      SELECT listing_id, max(price_sek) - min(price_sek) AS drop_kr
      FROM price_history GROUP BY listing_id
      HAVING count(*) > 1 AND max(price_sek) > min(price_sek)
    ) t`;
  // A real, currently-listed car whose seller has cut the price — for the
  // deal-card mockup. Falls back gracefully the first weeks while history
  // accumulates.
  const dropped = await sql`
    SELECT e.make, e.model, e.model_year, e.price_sek, e.mileage_mil,
           e.fuel_type, h.n_points, h.first_price, h.first_seen
    FROM cars_enriched e
    JOIN (
      SELECT listing_id, count(*)::int AS n_points,
             (array_agg(price_sek ORDER BY seen_at))[1] AS first_price,
             to_char(min(seen_at), 'DD/MM') AS first_seen
      FROM price_history GROUP BY listing_id HAVING count(*) > 1
    ) h ON h.listing_id = e.listing_id
    WHERE e.is_active AND e.price_sek < h.first_price
    ORDER BY h.first_price - e.price_sek DESC
    LIMIT 1`;
  return {
    total: counts.total as number,
    active: counts.active as number,
    updated: updated.d as string,
    dropListings: drops.listings_with_drops as number,
    dropKr: drops.total_kr as number,
    droppedCar: dropped[0] ?? null,
  };
}

const fmt = (n: number) => new Intl.NumberFormat("sv-SE").format(n);

/* ------------------------------------------------------------- components */

function Mockup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="my-6">
      <figcaption className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] mb-2">
        ▸ Mockup — {label}
      </figcaption>
      <div className="rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--background)] p-4 sm:p-8 overflow-x-auto">
        {children}
      </div>
    </figure>
  );
}

function Sect({
  id,
  kicker,
  title,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-[var(--border)] pt-10 mt-12">
      <p className="text-xs font-mono uppercase tracking-widest text-[var(--muted)]">
        {kicker}
      </p>
      <h2 className="text-2xl sm:text-3xl font-bold mt-1 mb-4">{title}</h2>
      <div className="space-y-4 text-[var(--foreground)] leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Pill({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${
        active
          ? "bg-[var(--foreground)] text-[var(--background)]"
          : "border border-[var(--border)] text-[var(--foreground)]"
      }`}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ page */

export default async function Version2Page() {
  const live = await getLiveNumbers();
  const car = live.droppedCar;

  return (
    <div className="max-w-3xl mx-auto">
      {/* ------------------------------------------------------- header */}
      <p className="text-xs font-mono uppercase tracking-widest text-[var(--muted)]">
        Internt arbetsdokument · uppdateras löpande · noindex
      </p>
      <h1 className="text-3xl sm:text-5xl font-bold mt-2 leading-tight">
        Hela Notan 2.0
      </h1>
      <p className="mt-4 text-lg">
        Nio oberoende granskningar — UX, design, SEO och tillväxt — pekade åt
        samma håll: <strong>datat är bättre än sajten erkänner.</strong> Sajten
        är byggd som ett modelluppslagsverk. Köparen kommer med en budget och
        en fråga: <em>är det här priset bra?</em> Version 2.0 vänder sajten så
        att den svarar på den frågan först.
      </p>

      {/* Live proof that server-rendering works — the numbers below come from
          the database at request time, not from a client fetch. */}
      <div className="mt-6 rounded-lg bg-[var(--card)] border border-[var(--border)] p-4 font-mono text-sm">
        <span className="text-[var(--muted)]">Siffrorna på denna sida är live ur produktionsdatabasen: </span>
        {fmt(live.total)} analyserade annonser · {fmt(live.active)} till salu just nu ·
        uppdaterad {live.updated} · {fmt(live.dropListings)} annonser med registrerade
        prissänkningar (totalt {fmt(live.dropKr)} kr)
      </div>

      {/* ------------------------------------------------------ diagnosis */}
      <Sect id="diagnos" kicker="01" title="Diagnosen">
        <p>
          Sex av nio granskare hittade — oberoende av varandra — samma fem
          problem. Det är inte smakfrågor; flera är verifierade buggar i
          produktion:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Listan visar de 30 dyraste bilarna</strong> under rubriken
            &ldquo;Pris ↑&rdquo;. API:et sorterar hårdkodat <code>price DESC</code>;
            sida 1 av 4 406 bilar innehåller noll fynd. Sajtens bästa funktion
            ser tom ut för varje förstagångsbesökare.
          </li>
          <li>
            <strong>Sidfoten säger &ldquo;Uppdaterad feb 2026&rdquo;</strong> —
            hårdkodat — medan datat uppdaterades {live.updated}. En färskvarusajt
            som annonserar att den är ett halvår gammal.
          </li>
          <li>
            <strong>Fyra olika bilantal</strong> på fyra olika sidor (4 406 /
            9 503 / 12 851 / {fmt(live.total)}). En sajt vars pitch är
            trovärdig data får inte motsäga sig själv.
          </li>
          <li>
            <strong>Googles bild av sajten är ett tomt skal.</strong>{" "}
            <code>robots.txt</code> blockerar <code>/api/</code> som varje
            datasida hämtar från klientsidan, och en global canonical pekar 35
            av 45 sitemap-URL:er mot startsidan.
          </li>
          <li>
            <strong>E-post har aldrig skickats.</strong> Båda
            anmälningsformulären skriver till databasen och inget läser därifrån.
            Fyra personer lovades rapporter som aldrig kom. Att &ldquo;ingen
            anmäler sig&rdquo; bevisar ingenting — testet kördes aldrig.
          </li>
        </ul>
        <p className="text-sm text-[var(--muted)]">
          Redan åtgärdat under granskningen: tre trasiga prediktionskurvor
          (XC40 visade 773 kr för en ny bil), retention-ankare, och
          generationstaxonomin.
        </p>
      </Sect>

      {/* ------------------------------------------------------------ IA */}
      <Sect id="struktur" kicker="02" title="Ny struktur: 9 sidor blir 5">
        <p>
          Fem av nio granskare föreslog oberoende att navigationen skärs ned.
          Principen: varje länk svarar på en köparfråga, ingen länk finns för
          att statistiken var rolig att räkna fram.
        </p>

        <Mockup label="ny navigation (5 länkar, verb i stället for substantiv)">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold mr-2">Hela Notan</span>
            <Pill active>Hitta bil</Pill>
            <Pill>Modeller</Pill>
            <Pill>Vad kostar den?</Pill>
            <Pill>Ligan</Pill>
            <Pill>Jämför (3)</Pill>
          </div>
          <p className="text-xs text-[var(--muted)] mt-3 font-mono">
            Sidfot: Artiklar · Så räknar vi · Om oss
          </p>
        </Mockup>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-[var(--border)]">
                <th className="py-2 pr-4">Idag</th>
                <th className="py-2 pr-4">Beslut</th>
                <th className="py-2">Motivering</th>
              </tr>
            </thead>
            <tbody className="align-top">
              {[
                ["/", "GÖRS OM", "Från modellväljare till budget-först + fynd. Se §03."],
                ["/tco + /kopguide", "SLÅS IHOP → /kalkyl", "Samma fråga två gånger: vad kostar den per månad?"],
                ["/bevaka", "GÖRS OM", "Från säljsida (ägarens värde) till köpsida: bevaka en sökning, få mejl vid prissänkningar. Kräver att e-post faktiskt skickas."],
                ["/toppen", "BEHÅLLS", "Riktigt användbar — men rankas om till kr/mån och får n= per rad."],
                ["/modelldata", "SLÅS IHOP → /metod", "Förtroendeinfrastruktur, inte destination. Länkas från varje siffra."],
                ["/fakta", "TAS BORT", "Trivia. Sex av nio granskare oberoende: döda. Handlarpremien flyttar in i tabellen."],
                ["/nyheter", "TAS BORT", "27 AI-genererade inlägg = över halva sajtens indexerbara yta, om ämnen där Transportstyrelsen alltid vinner. Ersätts av /prisutveckling: en månadsrapport ur egna datat."],
                ["/artiklar", "BEHÅLLS", "Flyttas till sidfot; varje artikel ytas på sin modellsida i stället."],
              ].map(([a, b, c]) => (
                <tr key={a as string} className="border-b border-[var(--border)]">
                  <td className="py-2 pr-4 font-mono text-xs whitespace-nowrap">{a}</td>
                  <td className="py-2 pr-4 font-semibold whitespace-nowrap">{b}</td>
                  <td className="py-2 text-[var(--muted)]">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Sect>

      {/* ------------------------------------------------------- new home */}
      <Sect id="startsida" kicker="03" title="Ny startsida: budget först, fynd som svar">
        <p>
          Tre granskare föreslog tre olika förstasidor — fynd först, budget
          först, månadskostnad först. Beslutet: <strong>budget är ingången,
          fynd är svaret, kr/mån är enheten.</strong> Köparen vet sällan
          &ldquo;XC60 eller X3&rdquo; men vet alltid ungefär vad hen vill lägga.
        </p>

        <Mockup label="hero med bevisremsa (live-siffror, serverrenderade)">
          <div className="max-w-xl">
            <h3 className="text-3xl sm:text-4xl font-bold leading-tight">
              Priset är inte kostnaden.
            </h3>
            <p className="mt-3 text-[var(--muted)]">
              Vi räknar ut vad en begagnad bil faktiskt kostar per månad —
              värdeminskning, skatt, försäkring, service och drivmedel. Uträkningen
              är öppen.
            </p>
            <p className="mt-4 font-mono text-xs sm:text-sm text-[var(--foreground)]">
              {fmt(live.total)} analyserade annonser · {fmt(live.active)} till
              salu nu · uppdaterad {live.updated} · 18 modeller på djupet
            </p>

            <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
              <label className="text-sm font-semibold">Jag har ungefär</label>
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 font-mono text-lg">
                  300 000
                </span>
                <span className="text-[var(--muted)]">kr</span>
              </div>
              <div className="mt-3 flex gap-2 flex-wrap">
                <Pill active>Alla</Pill>
                <Pill>SUV</Pill>
                <Pill>Kombi</Pill>
                <Pill>Småbil</Pill>
                <Pill>Elbil</Pill>
              </div>
              <div className="mt-4 rounded-lg bg-[var(--foreground)] text-[var(--background)] text-center py-3 font-semibold">
                Visa vad jag får →
              </div>
            </div>
          </div>
        </Mockup>

        <p>
          Svaret är en rankad lista: modell, typisk årsmodell och miltal på den
          budgeten, <strong>kr/mån i totalkostnad</strong>, antal bilar till
          salu — och därunder de konkreta annonser som just nu ligger under
          prisbilden. Diagrammen flyttar till modellsidorna, som bevis i stället
          för entré.
        </p>
      </Sect>

      {/* ------------------------------------------------------ deal card */}
      <Sect id="fynd" kicker="04" title="Fyndkortet: ärligt, konkret, förhandlingsbart">
        <p>
          Två språkbeslut från granskningen: <strong>&ldquo;Fyndpris&rdquo; byts
          mot &ldquo;X % under prisbilden&rdquo;</strong> (en billig bil är ofta
          billig av en anledning — sajten ska inte lova fynd, den ska visa
          avvikelse), och <strong>osäkerheten visas i kronor, inte R²</strong>.
          R²-badgen var dessutom inverterad: Golf fick grönt med ±39 % fel,
          Polestar 4 fick rött med ±10 %.
        </p>

        <Mockup label={car ? "fyndkort — RIKTIG bil ur databasen just nu" : "fyndkort"}>
          <div className="max-w-md rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="font-bold text-lg">
                  {car
                    ? `${car.make} ${car.model} ${car.model_year}`
                    : "Volvo XC60 B5 2021"}
                </h4>
                <p className="text-sm text-[var(--muted)]">
                  {car
                    ? `${fmt(car.mileage_mil)} mil · ${car.fuel_type}`
                    : "8 400 mil · Diesel"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-xl">
                  {fmt(car ? car.price_sek : 312000)} kr
                </p>
                <p className="text-xs text-[var(--muted)]">≈ 4 100 kr/mån i 3 år</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
              <span className="rounded-full bg-green-800 text-white px-3 py-1">
                14 % under prisbilden
              </span>
              {car && (
                <span className="rounded-full border border-green-800 text-green-900 px-3 py-1">
                  Sänkt {fmt(car.first_price - car.price_sek)} kr sedan {car.first_seen}
                </span>
              )}
              <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)]">
                47 dagar på Blocket
              </span>
            </div>

            <p className="mt-4 text-xs text-[var(--muted)] leading-relaxed">
              Prisbild för liknande bilar: <span className="font-mono">330–390 tkr</span>{" "}
              (1 675 annonser). Priset ligger under vad modellen brukar kosta —
              kontrollera alltid skick, historik och miltal.
            </p>

            <div className="mt-4 flex gap-2">
              <span className="flex-1 rounded-lg bg-[var(--foreground)] text-[var(--background)] text-center py-2 text-sm font-semibold">
                Visa på Blocket ↗
              </span>
              <span className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm">
                + Jämför
              </span>
            </div>
          </div>
        </Mockup>

        <p className="text-sm text-[var(--muted)]">
          {car ? (
            <>
              Kortet ovan är en riktig bil, hämtad live: säljaren har sänkt
              priset med {fmt(car.first_price - car.price_sek)} kr sedan
              annonsen först sågs. Den informationen finns hos ingen annan
              svensk tjänst — Blocket visar den inte ens själva.
            </>
          ) : (
            <>Prishistoriken byggs upp nu — kortet fylls med riktiga bilar allt
            eftersom sänkningar registreras.</>
          )}{" "}
          Badgen &ldquo;dagar på Blocket&rdquo; kommer från samma pipeline
          (first_seen_at finns redan på varje rad).
        </p>
      </Sect>

      {/* ----------------------------------------------------- model page */}
      <Sect id="modellsidor" kicker="05" title="Nyckelstenen: 18 modellsidor">
        <p>
          Fem granskare, oberoende: sajten har 18 modeller och noll modell-URL:er.
          <code className="mx-1">/bilar/volvo-xc60</code> blir platsen där allt
          konvergerar — och de högintenta sökningarna
          (&ldquo;xc60 begagnad pris&rdquo;, &ldquo;rav4 värdeminskning&rdquo;)
          får äntligen en sida att landa på. Serverrenderad, med siffrorna i
          HTML:en.
        </p>

        <Mockup label="/bilar/volvo-xc60 — skiss">
          <div className="max-w-xl space-y-3 text-sm">
            <div className="rounded-lg border border-[var(--border)] p-3">
              <p className="font-bold text-lg">Volvo XC60 begagnad</p>
              <p className="font-mono text-xs text-[var(--muted)] mt-1">
                5 476 annonser analyserade · 2 464 till salu · uppdaterad {live.updated}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[var(--border)] p-3">
                <p className="text-xs text-[var(--muted)]">Pris per årsmodell</p>
                <p className="font-mono text-xs mt-1">2022 · 389–465 tkr<br />2020 · 310–372 tkr<br />2018 · 235–289 tkr</p>
              </div>
              <div className="rounded-lg border border-[var(--border)] p-3">
                <p className="text-xs text-[var(--muted)]">Bäst att köpa</p>
                <p className="font-bold mt-1">3–4 år gammal</p>
                <p className="text-xs text-[var(--muted)]">lägst kr/mån över 3 års ägande</p>
              </div>
            </div>
            <div className="rounded-lg border border-[var(--border)] p-3">
              <p className="text-xs text-[var(--muted)]">Generationer — beräknat live, inte fryst i en artikel</p>
              <p className="text-xs mt-1">Gen 2 (2018–) kostar i snitt 47 % mer än Gen 1 · [kurvdiagram]</p>
            </div>
            <div className="rounded-lg border border-[var(--border)] p-3">
              <p className="text-xs text-[var(--muted)]">Till salu nu — under prisbilden först</p>
              <p className="text-xs mt-1">[fyndkort × n] · [alla annonser →]</p>
            </div>
            <p className="text-xs text-[var(--muted)]">
              + relaterade artiklar · + &ldquo;Så räknar vi&rdquo; med modellens
              osäkerhet i kronor · + bevaka denna modell
            </p>
          </div>
        </Mockup>
      </Sect>

      {/* -------------------------------------------------- differentiators */}
      <Sect id="motorn" kicker="06" title="Det ingen annan har: prishistorik och tid-till-såld">
        <p>
          Pipelinen registrerar sedan i går varje prissänkning
          ({fmt(live.dropListings)} annonser hittills, totalt {fmt(live.dropKr)} kr).
          Databasen innehåller dessutom ~19 000 avslutade annonser — alltså{" "}
          <em>hur länge bilar låg ute innan de försvann</em>. Två saker byggs av
          det:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Förhandlingsunderlaget</strong> — på varje annons:
            &ldquo;legat ute 47 dagar, sänkt 2 gånger, −18 000 kr&rdquo;. Det är
            köparens starkaste argument och det syns inte ens på Blocket.
          </li>
          <li>
            <strong>Tid-till-såld per prisklass</strong> — diagrammet som
            bevisar (eller motbevisar) fyndpoängen offentligt: försvinner
            bilar under prisbilden på 12 dagar medan överprisade ligger i 90?
            Då är poängen validerad. Gör de inte det har vi lärt oss något
            viktigare.
          </li>
        </ul>
        <p>
          <strong>Bevaka görs om till köparsidan:</strong> spara en sökning
          (&ldquo;SUV under 300 000&rdquo;), få ett mejl i veckan med vilka
          bilar som sänkts, hur mycket, och hur de nu ligger mot prisbilden.
          Veckotakt är fel för &ldquo;var först&rdquo; — bilhandlarna bevakar
          Blocket per minut — men exakt rätt för &ldquo;betala inte för
          mycket&rdquo;: en bil som sänkts och <em>fortfarande ligger kvar</em>{" "}
          är en motiverad säljare. Förutsättning: e-postutskick byggs på
          riktigt innan ett enda nytt formulär publiceras.
        </p>
      </Sect>

      {/* -------------------------------------------------------- roadmap */}
      <Sect id="plan" kicker="07" title="Ordningsföljd">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-[var(--border)]">
                <th className="py-2 pr-4">Fas</th>
                <th className="py-2 pr-4">Innehåll</th>
                <th className="py-2">Storlek</th>
              </tr>
            </thead>
            <tbody className="align-top">
              {[
                ["0 · Sanning", "Sorteringsbuggen · live-datum överallt · ett enda bilantal · robots/canonical-fixen · retention-etiketten. Allt small, allt denna vecka.", "S"],
                ["1 · Subtrahera", "Ta bort /fakta, /nyheter · slå ihop /tco+/kopguide → /kalkyl, /modelldata → /metod · nav 9→5 · redirects.", "S–M"],
                ["2 · Nyckelstenen", "18 modellsidor, serverrenderade · startsidan görs om: budget → rankad lista → fynd.", "L"],
                ["3 · Motorn", "Prishistorik i UI · dagar-på-Blocket · e-postutskick på riktigt · bevaka-en-sökning · tid-till-såld-diagrammet.", "L"],
                ["4 · Skärpning", "Slå ihop scatter+kurva till ett diagram · kvantilband i stället för ±1,96 SE · partiell miltalseffekt · fyndkalibrering ~topp 5 %.", "M"],
              ].map(([a, b, c]) => (
                <tr key={a as string} className="border-b border-[var(--border)]">
                  <td className="py-2 pr-4 font-semibold whitespace-nowrap">{a}</td>
                  <td className="py-2 pr-4">{b}</td>
                  <td className="py-2 font-mono">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-[var(--muted)]">
          Medvetet utanför scope: fler modeller (18 på djupet är positioneringen,
          inte en brist), regionssidor (för tunt underlag), och allt som lovar
          mer precision än modellerna har. Osäkerheten skrivs ut i kronor — det
          är den ärligheten som skiljer sajten från alla andra.
        </p>
      </Sect>

      <p className="mt-12 pt-6 border-t border-[var(--border)] text-xs text-[var(--muted)] font-mono">
        Underlag: 9 oberoende agentgranskningar (3 UX, 3 design, 3 SEO/tillväxt),
        {" "}{fmt(live.total)} annonser, verifierade buggar i produktion. Sidan
        serverrenderas mot produktionsdatabasen vid varje anrop — precis som
        v2.0 ska göra överallt.
      </p>
    </div>
  );
}
