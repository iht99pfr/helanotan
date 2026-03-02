export default function SaPrissatterViBilar() {
  return (
    <>
      <p>
        Varje begagnad bil har ett marknadspris. Inte det pris som säljaren
        sätter &mdash; utan det pris som marknaden faktiskt betalar för en bil
        med just den kombinationen av ålder, miltal, drivlina och utrustning.
        Problemet är att det priset aldrig syns i annonsen. Det vi ser är
        säljarens förhoppning, inte marknadens dom.
      </p>
      <p>
        Hela Notan beräknar det priset. Vi samlar in tusentals
        begagnatannonser från Blocket.se, matar dem genom en
        regressionsmodell med 18 variabler, och räknar ut vad varje bil
        &rdquo;borde&rdquo; kosta &mdash; givet allt vi vet om den. Bilar
        som ligger långt under det beräknade priset flaggar vi som fynd.
        Bilar som ligger över? De kanske inte är överprissatta, men du bör
        veta att du betalar mer än genomsnittet.
      </p>
      <p>
        Det här är berättelsen om hur det fungerar. Inga marknadsföringsfloskler.
        Bara data, matematik och de begränsningar vi lever med.
      </p>

      <h2>10 000 annonser in, struktur ut</h2>
      <p>
        Allt börjar med data. Vår scraper genomsöker Blocket.se efter annonser
        för de 15 bilmodeller vi bevakar &mdash; från Volvo XC60 till VW Golf R
        &mdash; och sparar ned varje annons i en rådatabas. Pris, årsmodell,
        miltal, drivlina, hästkrafter, säljartyp och hela annonstexten.
      </p>
      <p>
        Just nu har vi drygt 10&nbsp;000 aktiva annonser i systemet. Men rådata
        från Blocket är stökig. Årsmodeller kan vara felaktiga, miltal saknas
        ibland, och annonstexterna varierar från mekaniskt exakta specifikationer
        till &rdquo;fin bil, inga problem&rdquo;. Så nästa steg är filtrering
        och anrikning.
      </p>
      <p>
        Vi exkluderar annonser under 20&nbsp;000&nbsp;kr (oftast skrotbilar
        eller felregistreringar) och årsmodeller före 2005 (för få datapunkter
        för att modellen ska ge meningsfulla resultat). Det som blir kvar går
        vidare till anrikningssteget.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Datapipelinen i siffror
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Modeller</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">15</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Totalt antal annonser</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">~10 000+</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Basvariabler</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">15</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">AI-anrikade variabler</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">3</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Interaktionstermer</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">2</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Uppdateringsfrekvens</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Dagligen</div>
          </div>
        </div>
      </div>

      <h2>AI:n som läser annonser</h2>
      <p>
        Det här är steget som gör störst skillnad, och det är det svåraste att
        förklara utan att det låter som magi. Problemet: två identiska
        RAV4 Hybrid 2021 med samma miltal kan skilja 40&nbsp;000&nbsp;kr i pris.
        Varför? För att den ena har panoramaglastak, head-up display och
        läderklädsel &mdash; och den andra har basutförande.
      </p>
      <p>
        Blocket har inga strukturerade fält för utrustning. Allt ligger
        inbakat i fritext. Så vi använder en AI-modell (ett stort
        språkmodell, ja) för att läsa varje annonstext och extrahera
        utrustningsdetaljer: panoramatak, ventilerade säten, head-up display,
        adaptiv farthållare, och ett tjugotal andra features som påverkar
        andrahandsvärdet.
      </p>
      <p>
        AI:n identifierar också vilken <em>generation</em> bilen tillhör.
        Det är avgörande. En Volvo XC60 från 2017 (generation&nbsp;1) och en
        från 2018 (generation&nbsp;2) är i princip helt olika bilar, trots att
        bara ett år skiljer dem åt. Generationsbyten skapar de skarpaste
        prisklyftorna i vår data, och ren ålder kan inte fånga dem. Med
        generationsdummyvariabler i modellen kan vi.
      </p>
      <p>
        Vi extraherar också en premiumutrustnings-poäng &mdash; ett
        sammanvägt mått på hur väl utrustad bilen är jämfört med
        genomsnittet för sin modell. Den variabeln förklarar en
        överraskande stor del av prisvariationen, särskilt för premiumbilar
        som XC60 och GLC där utrustningsspridningen är enorm.
      </p>

      <h2>Modellen: multivariat regression med 18 variabler</h2>
      <p>
        Vi kör en separat regressionsmodell per bilmodell. Det kan låta
        överambitiöst, men det finns goda skäl: en RAV4 och en Golf R beter
        sig helt olika på begagnatmarknaden. Att tvinga in dem i samma modell
        skulle ge en urvattnad prediktion som inte är träffsäker för
        någondera.
      </p>
      <p>
        Varje modell tränas på alla tillgängliga annonser &mdash; vanligtvis
        mellan 300 och 2&nbsp;000 stycken, beroende på modell. De 15
        basvariablerna inkluderar ålder, miltal, hästkrafter, drivlina
        (bensin, diesel, hybrid, PHEV, elbil), säljartyp (handlare vs privat),
        och fyrhjulsdrift. Utöver det lägger vi till de tre AI-anrikade
        variablerna: generation, premiumutrustning och specifik motorvariant.
      </p>
      <p>
        Men det räcker inte med att bara slänga in variablerna rakt av. Vi
        har två viktiga val som gör stor skillnad.
      </p>

      <h3>Logaritmisk prissättning</h3>
      <p>
        Vi logaritmerar priset innan vi kör regressionen. Det låter tekniskt,
        men konsekvensen är enkel: modellen tänker i procent, inte kronor.
        En bil som &rdquo;borde&rdquo; kosta 500&nbsp;000&nbsp;kr och säljs
        för 425&nbsp;000&nbsp;kr har samma avvikelse (15&nbsp;%) som en bil
        som borde kosta 150&nbsp;000&nbsp;kr och säljs för 127&nbsp;500&nbsp;kr.
      </p>
      <p>
        Det är intuitivt rätt. 75&nbsp;000&nbsp;kr rabatt på en halvmiljonbil
        är ett bra pris. 75&nbsp;000&nbsp;kr rabatt på en bil som borde kosta
        150&nbsp;000&nbsp;kr är närmast suspekt. Log-transformen fångar detta
        automatiskt: &rdquo;fynd&rdquo; definieras relativt bilens
        prisklass, inte i absoluta kronor.
      </p>

      <h3>Interaktionstermer</h3>
      <p>
        En dieselbil tappar värde annorlunda än en elbil. Inte bara i nivå
        (dieslar kostar generellt mindre) utan i <em>takt</em>: elbilen
        tappar kanske 12&nbsp;% per år, medan dieseln tappar 8&nbsp;% men
        från ett lägre utgångspris. Om vi bara har en ålderskoefficient
        missar vi den skillnaden.
      </p>
      <p>
        Lösningen är interaktionstermer: vi låter drivlina interagera med
        ålder och miltal. Konkret betyder det att modellen lär sig separata
        värdeminskningskurvor för varje drivlina, inte en genomsnittlig
        kurva. Det gör att prediktionerna följer verkligheten mycket
        bättre &mdash; och att deal-scoring blir rättvisare. En
        dieselbil jämförs med andra dieselbilar, inte med hela beståndet.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Exempel: RAV4 Hybrid 2021, 4&nbsp;500 mil
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Beräknat marknadspris</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">~345 000 kr</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Konfidensintervall</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">&plusmn;28 000 kr</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">R&sup2; (modellprecision)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">96,4 %</div>
          </div>
        </div>
      </div>

      <h2>Varför vissa bilar är förutsägbara &mdash; och andra inte</h2>
      <p>
        R&sup2; &mdash; förklaringsgraden &mdash; mäter hur stor andel av
        prisvariationen som vår modell fångar. Och skillnaderna mellan
        modellerna är dramatiska.
      </p>
      <p>
        Toyota RAV4 toppar med R&sup2; = 96,4&nbsp;%. Det innebär att om du
        berättar ålder, miltal, drivlina och utrustning för oss kan vi
        förutsäga priset med hög precision. RAV4-marknaden är rationell:
        köparna vet vad de vill ha, priserna är konsekventa, och det finns
        tillräckligt med annonser för att modellen ska hitta mönstren.
      </p>
      <p>
        I andra änden sitter Tesla Model&nbsp;Y med R&sup2; = 68&nbsp;%.
        Vår modell missar alltså en tredjedel av prisvariationen. Varför?
        Inte för att vår modell är dålig &mdash; utan för att Model&nbsp;Y
        är en ovanligt homogen bil. Nästan alla har samma utrustning, samma
        drivlina (elbil), liknande miltal. Det finns helt enkelt väldigt lite
        variation i <em>egenskaperna</em> som kan förklara prisskillnaderna.
        Och när egenskaperna inte varierar har regressionen inget att arbeta
        med.
      </p>
      <p>
        De bilar där vi har starkast modeller &mdash; RAV4, XC60, X3, Golf
        &mdash; har gemensamt att de sålts länge, finns i flera generationer,
        har olika drivlinor och stor utrustningsspridning. Heterogenitet i
        data ger modellen något att bita i.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          R&sup2; per modell (urval)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Toyota RAV4</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">96,4 %</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Volvo XC60</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">~94 %</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">BMW X3</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">~92 %</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">VW Golf</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">~90 %</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Kia Niro</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">~85 %</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Tesla Model Y</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">68 %</div>
          </div>
        </div>
      </div>

      <h2>Att hitta fynd: residualanalys i praktiken</h2>
      <p>
        Nu kommer vi till det som de flesta besökare faktiskt bryr sig om:
        vilka bilar är underprissatta?
      </p>
      <p>
        Metoden är enkel i teorin. För varje annons beräknar modellen ett
        förväntat pris baserat på bilens egenskaper. Skillnaden mellan det
        faktiska priset och det förväntade kallas <em>residualen</em>. En
        negativ residual betyder att bilen säljs under vad modellen förväntar
        sig. Men hur stor måste avvikelsen vara för att det ska vara
        statistiskt meningsfullt och inte bara brus?
      </p>
      <p>
        Vi använder residualens standardavvikelse (SE) som måttstock. Varje
        modell har sin egen SE &mdash; ett mått på hur mycket priser
        normalt sprider sig runt prediktionen. En bil som ligger mer
        än 0,75 standardavvikelser under det förväntade priset flaggas
        som &rdquo;Bra pris&rdquo;. Mer än 1,5 standardavvikelser
        under? &rdquo;Fyndpris&rdquo;.
      </p>
      <p>
        Det ger stabila proportioner: ungefär 23&nbsp;% av alla annonser
        klassas som &rdquo;Bra pris&rdquo; och cirka 7&nbsp;% som
        &rdquo;Fyndpris&rdquo;. Siffrorna följer naturligt av
        normalfördelningen &mdash; vi har inte valt dem godtyckligt utan
        de faller ut ur statistiken.
      </p>
      <p>
        Och tack vare log-transformen är trösklarna procentuella. En bil
        som kostar 50&nbsp;000&nbsp;kr och flaggas som fyndpris har samma
        <em>relativa</em> rabatt som en bil som kostar 500&nbsp;000&nbsp;kr
        med samma flagga. Det gör systemet rättvist oavsett prisklass.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Deal-scoring
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Bra pris (tröskel)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">&gt;0,75 SE under</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Andel &rdquo;Bra pris&rdquo;</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">~23 %</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Fyndpris (tröskel)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">&gt;1,5 SE under</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Andel &rdquo;Fyndpris&rdquo;</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">~7 %</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Skalning</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Procentuell (log)</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Uppdatering</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Vid ny data</div>
          </div>
        </div>
      </div>

      <h2>Vad modellen inte kan fånga</h2>
      <p>
        Vi tror på transparens, så här är de saker som vår modell missar
        eller hanterar dåligt. De är viktiga att förstå om du använder Hela
        Notan för att fatta köpbeslut.
      </p>
      <p>
        <strong>Skick och historik.</strong> Vi har ingen information om
        lackskavanker, rostskador, servicehistorik eller olyckor. En bil
        kan vara ett &rdquo;fyndpris&rdquo; i vår modell men ha dold
        problematik som motiverar det låga priset. Vår scoring ersätter
        aldrig en besiktning.
      </p>
      <p>
        <strong>Geografiska skillnader.</strong> Vi behandlar hela Sverige
        som en marknad. I verkligheten kostar bilar mer i Stockholm och
        Göteborg. En annons från Norrlands inland kan flaggas som fynd
        helt enkelt för att den lokala marknaden har lägre priser
        generellt &mdash; inte för att säljaren gjort en miss.
      </p>
      <p>
        <strong>Tidpunkt.</strong> Bilpriserna rör sig. Vår modell
        speglar marknaden just nu, men en bil som ser rätt prissatt ut
        idag kan vara ett fynd (eller överpris) om en månad. Vi
        uppdaterar dagligen, men fångar inte intraday-rörelser eller
        säsongsvariationer fullt ut.
      </p>
      <p>
        <strong>Säljarens motivation.</strong> En privat säljare som
        behöver pengar snabbt sätter ett annat pris än en handlare med
        lagerränta att hantera. Vi vet att det är handlare eller privat
        &mdash; och det ingår i modellen &mdash; men vi kan inte fånga den
        individuella säljarens brådska eller förhandlingsvilja.
      </p>
      <p>
        <strong>Modeller med lite data.</strong> De modeller vi nyligen
        lagt till (som Land Rover Defender) har färre annonser, vilket
        ger bredare konfidensintervall och mindre pålitlig deal-scoring.
        Vi visar modellens R&sup2; och antal annonser öppet så att du
        kan bedöma tillförlitligheten själv.
      </p>

      <h2>Teknikstacken i korthet</h2>
      <p>
        För den nyfikne: pipelinen är uppdelad i tre separata kodrepon.
        <em> Scraping</em> samlar annonser från Blocket till en Postgres-databas.
        <em> Enrichment</em> kör AI-anrikning (generationsdetektering,
        utrustningsextraktion, motorklassificering).
        <em> Statistics</em> tränar regressionsmodeller och exporterar
        prediktioner och deal-scores till en web-cache som den här
        webbplatsen läser.
      </p>
      <p>
        Frontenden är byggd med Next.js, React och TypeScript. Diagrammen
        renderas med Recharts. Allt hostas på Vercel med automatisk deploy
        vid varje push. Databasen är Neon Postgres &mdash; en serverless
        Postgres-tjänst som ger oss snabb åtkomst utan att behöva
        administrera egna servrar.
      </p>
      <p>
        Regressionsmodellerna körs i Python med scikit-learn. Vi valde
        medvetet linjär regression framför mer komplexa metoder som
        gradient boosting eller neurala nätverk. Anledningen? Tolkbarhet.
        Vi vill kunna förklara exakt <em>varför</em> en bil prissätts
        som den gör. Med en linjär modell kan vi peka på koefficienterna:
        &rdquo;den här bilen kostar X&nbsp;% mer för att den är en
        hybrid, och Y&nbsp;% mindre för varje extra 1&nbsp;000 mil&rdquo;.
        Det är värde som ingen svart-låda-modell kan erbjuda.
      </p>

      <h2>Hur du använder Hela Notan</h2>
      <p>
        Hela poängen med allt det här arbetet är att ge dig, bilköparen,
        ett informationsövertag. Så här gör du:
      </p>
      <ol>
        <li>
          <strong>Välj din modell</strong> i modellväljaren på startsidan.
          Du kan jämföra flera modeller samtidigt.
        </li>
        <li>
          <strong>Studera kurvorna.</strong> Värdeminskningsdiagrammet visar
          hur priset faller med ålder. Filtrera på drivlina för att se
          skillnaden mellan hybrid och diesel. Punkterna som lyser grönt är
          bilar vi flaggat som fynd.
        </li>
        <li>
          <strong>Bläddra i datatabellen.</strong> Klicka på
          &rdquo;Fynd&rdquo;-kolumnen för att sortera efter störst rabatt
          relativt marknadspriset. Filtrera med pillknapparna ovan:
          &rdquo;Alla fynd&rdquo; visar samtliga bra-pris- och fyndpris-bilar.
        </li>
        <li>
          <strong>Kolla TCO-kalkylatorn.</strong> Under /tco kan du se vad
          det faktiskt kostar att äga bilen &mdash; inklusive
          värdeminskning, försäkring, skatt och drivmedel. Miltalet
          auto-ifylls baserat på medianmiltalet för just den modellen och
          årsmodellen du väljer.
        </li>
        <li>
          <strong>Var kritisk.</strong> Kolla R&sup2; och antal annonser
          för din modell. Ju högre precision och fler datapunkter, desto
          mer kan du lita på prediktionerna. Och glöm inte: vår
          scoring fångar inte skick, servicehistorik eller lokala
          marknadsskillnader.
        </li>
      </ol>
      <p>
        Vi bygger inte Hela Notan för att ersätta din bedömning. Vi bygger
        det för att ge dig siffror att grunda den på.
      </p>

      <blockquote>
        Ingen modell är perfekt. Men en modell som förklarar 90&ndash;96&nbsp;%
        av prisvariationen ger dig ett informationsövertag som de flesta
        bilköpare aldrig har haft. Hela Notan gör den informationen
        tillgänglig, gratis, för alla.
      </blockquote>
    </>
  );
}
