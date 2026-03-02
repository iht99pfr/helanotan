export default function ElbilPhevHybridRestvarde() {
  return (
    <>
      <p>
        Det svenska billandskapet har förändrats i grunden. Elbilar, laddhybrider
        och hybrider konkurrerar nu inte bara om köparnas uppmärksamhet utan
        också om begagnatmarknadens gunst. Men när den första vågen av
        elektrifierade bilar börjar cirkulera som begagnade uppstår en
        avgörande fråga: vilken drivlina håller värdet bäst?
      </p>

      <p>
        De flesta diskussioner om restvärde stannar vid magkänsla och
        hörsägen. &quot;Elbilar tappar som stenar.&quot; &quot;Laddhybrider är
        det smartaste valet.&quot; &quot;Hybrider håller sig bäst.&quot; Vi hör
        dessa påståenden dagligen — men ingen backar dem med data. Tills nu.
      </p>

      <p>
        Vi har analyserat över 3 300 annonser fördelade på tre drivlinor, fyra
        modellserier och priskurvor som sträcker sig upp till tio år bakåt.
        Resultaten är inte vad de flesta förväntar sig.
      </p>

      <h2>Det perfekta testfallet: Kia Niro</h2>

      <p>
        Om du vill förstå hur drivlina påverkar restvärde behöver du isolera
        alla andra variabler. Olika bilmodeller skiljer sig i storlek,
        utrustningsnivå, märkesuppfattning och målgrupp — faktorer som grumlar
        jämförelsen. Det som gör Kia Niro unik i det här sammanhanget är att
        den finns i tre varianter med identisk kaross, identisk interiör och
        snarlik utrustningsstruktur — men med tre helt olika drivlinor:
        ren elbil (EV), laddhybrid (PHEV) och konventionell hybrid (HEV).
      </p>

      <p>
        Det är så nära ett kontrollerat experiment man kan komma på
        begagnatmarknaden. Samma bil, samma märke, samma storleksklass. Den
        enda variabeln som skiljer dem åt är vad som driver hjulen.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Kia Niro — tre drivlinor i siffror
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Niro Electric (EV)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              454 bilar
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snittpris EV</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              305 000 kr
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Medelålder EV</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              3,3 år
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Niro PHEV</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              290 bilar
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snittpris PHEV</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              243 000 kr
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Medelålder PHEV</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              4,9 år
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Niro Hybrid (HEV)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              128 bilar
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snittpris HEV</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              205 000 kr
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Medelålder HEV</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              6,3 år
            </div>
          </div>
        </div>
      </div>

      <p>
        Det första som slår en är prisskillnaden. En Niro Electric kostar i
        snitt 305 000 kronor — men den är också markant yngre (3,3 år mot
        hybridens 6,3 år). Det vore ett misstag att jämföra dessa snittvärden
        rakt av. En bil som i genomsnitt är tre år gammal borde kosta mer än
        en som i genomsnitt är sex år gammal, oavsett drivlina. Därför
        använder vi regressionsanalys som justerar för ålder, mileage och
        övriga faktorer.
      </p>

      <p>
        När vi kontrollerar för ålder framträder ett mönster som utmanar den
        gängse uppfattningen. Niro Electric tappar inte dramatiskt mer i värde
        än sina syskon. Under de första tre åren ligger elbilens
        värdeminskningskurva faktiskt nära PHEV-varianten. Det stora nypriset
        innebär att kronorna som tappas är fler — men i procentuella termer är
        bilden mer nyanserad.
      </p>

      <p>
        Hybriden, å andra sidan, visar den stabilaste priskurvan. Med ett
        lägre nypris och enklare teknik (ingen extern laddning, ingen stor
        batterikostnad) åldras den prismässigt som en konventionell bil.
        Resultatet är att den procentuella kvarhållningsgraden — restvärdet som
        andel av nypriset — ofta är högst för hybridvarianten.
      </p>

      <p>
        Men det finns en hake. Den konventionella hybriden kostade minst ny och
        kostar minst begagnad. Om du sålde den i dag skulle du få tillbaka
        minst kronor i absoluta tal. Restvärde i procent och restvärde i
        kronor berättar två olika historier.
      </p>

      <h2>Volvos splittring: XC40 och XC60</h2>

      <p>
        Kia Niro ger oss det renaste testet, men Volvo ger oss volymen. Med
        över 1 500 XC40-annonser och nästan 2 000 XC60-annonser i vår
        databas kan vi studera elbil-mot-resten-frågan med betydligt större
        statistisk säkerhet.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Volvo XC40 — Electric vs PHEV
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">XC40 Recharge (EV)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              1 356 bilar
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snittpris EV</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              335 000 kr
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Medelålder EV</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              3,0 år
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">XC40 PHEV</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              222 bilar
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snittpris PHEV</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              345 000 kr
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Medelålder PHEV</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              4,1 år
            </div>
          </div>
        </div>
      </div>

      <p>
        Här ser vi något fascinerande. XC40 Recharge (den rena elbilen) har ett
        snittpris på 335 000 kronor vid en medelålder av 3,0 år. PHEV-varianten
        kostar i snitt 345 000 kronor — alltså tiotusen mer — men den är i
        genomsnitt ett helt år äldre (4,1 år). Det innebär att PHEV-varianten
        har ett starkare restvärde justerat för ålder.
      </p>

      <p>
        Förklaringen är delvis strukturell. XC40 Recharge kom med aggressiva
        prissubventioner och klimatbonusar som sänkte den effektiva
        anskaffningskostnaden. När subventionerna försvann — och Teslas
        prisreduktioner pressade hela elbilsmarknaden — sjönk begagnatpriserna
        i takt. PHEV-modellerna påverkades inte i samma grad eftersom deras
        prissättning aldrig byggde på subventioner i samma utsträckning.
      </p>

      <p>
        Resultatet är att en tre år gammal XC40 Recharge i dag kostar ungefär
        lika mycket som en fyra år gammal XC40 PHEV. Det är en viktig insikt
        för köpare: elbilen ger lägre driftskostnader men tappar mer per år.
        PHEV:en kostar mer att tanka men behåller mer av sitt kapital.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Volvo XC60 — PHEV vs Diesel
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">XC60 PHEV</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              926 bilar
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snittpris PHEV</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              460 000 kr
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Medelålder PHEV</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              3,2 år
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">XC60 Diesel</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              979 bilar
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snittpris Diesel</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              209 000 kr
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Medelålder Diesel</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              9,9 år
            </div>
          </div>
        </div>
      </div>

      <p>
        XC60 ger oss en annan dimension: laddhybrid mot diesel. Här handlar
        det inte om att välja grad av elektrifiering, utan om en tidsmässig
        klyfta. XC60 PHEV är i genomsnitt 3,2 år gammal med ett snittpris på
        460 000 kronor. Dieselvarianten — nästan uteslutande generation 2
        (2017+) — har en medelålder på 9,9 år och kostar 209 000 kronor.
      </p>

      <p>
        Men jämförelsen är inte rättvis rakt av. Dieseln representerar en äldre
        generation bilar som hade lägre nypriser, enklare teknik och lägre
        utrustningsnivå. Prisklyftan speglar inte bara drivlinan utan hela
        bilens ålder och specifikation. Det vi kan säga med säkerhet är att
        XC60 PHEV, vid sin ålder, kommenderar ett pris som pekar på starkt
        restvärde — men vi saknar tillräckligt med PHEV-data i ålderssegmentet
        7-10 år för att projicera om den styrkan håller i sig.
      </p>

      <p>
        Det som gör XC60-data intressant är dieselns beteende i den långa
        svansen. En tio år gammal XC60 D5 kostar runt 200 000 kronor —
        anmärkningsvärt stabilt. Dieslar i den här klassen har nått en
        prisplatå där ytterligare åldring inte sänker priset nämnvärt.
        Frågan är om PHEV-bilarna når en liknande platå, eller om
        batteriförslitning och teknisk komplexitet gör att de fortsätter tappa.
        Det vet vi inte ännu — data saknas.
      </p>

      <h2>Tesla Model Y — den rena elbilens riktmärke</h2>

      <p>
        Inget samtal om elbilars restvärde är komplett utan Tesla Model Y.
        Den dominerar elbilsmarknaden i Sverige med enorma volymer och — kanske
        viktigast — en prissättning som avviker från alla andra märken.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Tesla Model Y i siffror
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Drivlina</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              100 % elbil
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snittpris</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              382 000 kr
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Medelålder</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              3,3 år
            </div>
          </div>
        </div>
      </div>

      <p>
        Model Y kostar i snitt 382 000 kronor vid 3,3 års ålder. Jämfört med
        Niro Electric (305 000 vid 3,3 år) och XC40 Recharge (335 000 vid 3,0
        år) är det ett premium — men inte ett enormt sådant. Teslas
        prissättning på begagnatmarknaden styrs av två motkrafter: å ena sidan
        stark efterfrågan och ett etablerat varumärke, å andra sidan
        aggressiva nyprisänkningar från fabriken som omedelbart sänker värdet
        på befintliga bilar.
      </p>

      <p>
        Det som utmärker Model Y i vår data är den ovanligt platta
        värdeminskningskurvan under de första två åren, följd av en brantare
        nedgång. Nya nyprisänkningar slår igenom med fördröjning — varje gång
        Tesla justerar prislistan rusar begagnatpriserna ner för att hålla
        jämna steg. Det skapar en trappstegsformad kurva snarare än den
        jämna exponentialfunktion vi ser hos andra bilar.
      </p>

      <p>
        En annan unik aspekt är att handlare och privatpersoner säljer Model Y
        till i princip samma pris. Handlarpremien, som hos andra modeller kan
        vara 5-15 procent, är noll för Tesla. Det beror delvis på att Tesla
        inte har ett traditionellt återförsäljarnätverk — handlarna köper
        bilarna på samma marknad som privatpersoner och har ingen
        informationsfördel att prissätta utifrån.
      </p>

      <h2>Värdeminskningskurvor vs ögonblicksbilder</h2>

      <p>
        Hittills har vi jämfört snittpris och medelålder — nyttiga siffror,
        men grovhuggna verktyg. Den verkliga styrkan i vår data ligger i
        värdeminskningskurvorna: regressionsmodeller som visar hur priset
        sjunker kronor för kronor för varje år som går, justerat för
        mileage, bränsle, utrustning och säljartyp.
      </p>

      <p>
        Varför spelar det roll? Tänk så här: en bil som kostar 300 000 kronor
        vid tre års ålder kan ha nått dit via två helt olika vägar. Den kan ha
        kostat 550 000 ny och tappat 250 000 — eller den kan ha kostat 400 000
        ny och tappat 100 000. Slutpriset är detsamma, men
        värdeminskningstakten är fundamentalt annorlunda.
      </p>

      <p>
        Vår regressionsanalys tar hänsyn till detta. Vi modellerar priset som
        en funktion av ålder (med avtagande takt), mileage, bränsletyp,
        hästkrafter, säljartyp och interaktionseffekter mellan bränsle och
        ålder. Det innebär att vi kan säga inte bara var bilarna befinner sig
        prismässigt i dag, utan hur snabbt de rör sig nedåt — och om den
        takten skiljer sig mellan drivlinor.
      </p>

      <p>
        Tre mönster framträder tydligt:
      </p>

      <p>
        <strong>1. Elbilar tappar mest under år 1-2, sedan planar de ut.</strong>{" "}
        Det gäller både Niro Electric, XC40 Recharge och Model Y. Den initiala
        smällen är hård — ofta 15-25 procent under de första två åren. Men
        efter den inledande perioden mattas kurvan och den årliga
        depreciationen krymper. Förklaringen: den första ägaren absorberar
        den största delen av nybilspremien och eventuella subventionsjusteringar.
      </p>

      <p>
        <strong>2. PHEV-bilar tappar jämnare men längre.</strong> Laddhybriderna
        visar en stabilare värdeminskningsprofil under de första åren — ingen
        dramatisk initial smäll — men de fortsätter tappa i relativt jämn takt
        längre. En möjlig förklaring är att PHEV-teknik uppfattas som
        övergångsteknik: ju äldre bilen blir, desto mer tveksam blir marknaden
        till kombinationen av förbränningsmotor, elmotor och batteri.
      </p>

      <p>
        <strong>3. Konventionella hybrider och dieslar hittar en prisplatå.</strong>{" "}
        Niro Hybrid och XC60 Diesel visar samma fenomen: efter 6-8 år
        avtar värdeminskningen drastiskt. Bilen kostar vad marknaden anser att
        en fungerande bil i den klassen är värd — tekniken i sig har slutat
        vara en prissättningsfaktor. Det här är den typ av prisunderlägsenhet
        som faktiskt gynnar köparen: du betalar för transport, inte för teknik.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Värdeminskningsprofiler — sammanfattning
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Elbil (EV)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              Brant start, tidigt golv
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Laddhybrid (PHEV)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              Jämn nedgång, inget tydligt golv
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Hybrid / Diesel</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              Långsam nedgång, tydlig prisplatå
            </div>
          </div>
        </div>
      </div>

      <h2>Den stora osäkerhetsfaktorn: batteriet</h2>

      <p>
        Ett ämne som genomsyrar varje restvärdesanalys av elektrifierade bilar
        är batteriet. I en konventionell bil är motorn en mogen, förstådd
        komponent. I en elbil är batteriet den dyraste enskilda delen — och
        den del som åldras mest oförutsägbart.
      </p>

      <p>
        Vi ser ännu inga tydliga tecken på att batterihälsa påverkar
        begagnatpriserna i vår data. De flesta elbilar i datamängden är under
        fem år gamla, och moderna litiumjonbatterier behåller typiskt 90-95
        procent av sin kapacitet under den perioden. Men den verkliga frågan
        är vad som händer vid 8, 10, 12 års ålder — och där saknar vi
        fortfarande tillräckliga datapunkter.
      </p>

      <p>
        PHEV-bilar bär en dubbel risk: de har både ett batteri (om än mindre)
        och en förbränningsmotor som båda åldras. Hybridbilar har den minsta
        exponeringen — deras batterier är små, billiga att byta och spelar en
        underordnad roll i bilens totala värdering.
      </p>

      <p>
        Det innebär att de värdeminskningskurvor vi ser i dag sannolikt inte
        är de kurvor vi kommer se om fem år. Elbilar kan antingen stabiliseras
        ytterligare (om batterierna visar sig hålla bättre än befarat) eller
        tappa brant (om byte av stort batteripaket blir en dyr realitet).
        Historisk data ger oss en bild av nuläget, inte en garanti för
        framtiden.
      </p>

      <h2>Domen: vilken drivlina är det smartaste köpet?</h2>

      <p>
        Svaret beror på vad du optimerar för. Låt oss bryta ned det:
      </p>

      <p>
        <strong>Om du vill minimera total ägandekostnad per år</strong> — och
        kör mycket — vinner elbilen. Lägre bränsle- och servicekostnader
        kompenserar den brantare initiala värdeminskningen, särskilt om du
        köper en bil som redan är 2-3 år gammal och låter den första ägaren ta
        den största smällen. En Niro Electric för 305 000 eller en XC40
        Recharge för 335 000 är redan förbi sin värsta depreciationsperiod.
      </p>

      <p>
        <strong>Om du vill maximera restvärde i kronor</strong> — och planerar
        att sälja inom 3-5 år — har PHEV-bilar en fördel i dag. XC40 PHEV och
        XC60 PHEV behåller sina absoluta priser bättre än sina helelektriska
        syskon, delvis för att de inte varit lika exponerade för
        subventionsjusteringar och nyprisänkningar.
      </p>

      <p>
        <strong>Om du vill köpa billigast möjligt och inte bryr dig om
        framtida värde</strong> — välj en hybrid eller diesel som nått sin
        prisplatå. En Niro Hybrid för 205 000 kronor eller en XC60 D5 för
        209 000 är bilar som knappt tappar mer. Du betalar för transport, inte
        för prestige eller teknik. Det kronor-per-månad du faktiskt förlorar
        i värde kan vara lägre än för en nyare, dyrare elbil — trots att
        elbilens procentuella restvärde ser bättre ut på pappret.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Smartaste köpet — per strategi
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Lägst ägandekostnad/år</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              Elbil, 2-3 år gammal
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Bäst restvärde i kr</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              PHEV, 1-3 år gammal
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Lägst absolut förlust</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              Hybrid/diesel, 6+ år
            </div>
          </div>
        </div>
      </div>

      <p>
        Det finns ingen universellt &quot;bästa&quot; drivlina ur ett
        restvärdes-perspektiv. Det beror på om du räknar i procent eller
        kronor, om du räknar driftkostnad eller bara kapitalkostnad, och hur
        länge du tänker äga bilen.
      </p>

      <p>
        Men vad data visar med all tydlighet är att den vanligaste
        berättelsen — &quot;elbilar tappar mest&quot; — är en
        förenkling. Elbilar tappar mest under de första åren, ja. Men de
        planar ut snabbare. Och räknar man in bränsle- och servicebesparingar
        i den totala kalkylen vänds bilden för den som kör 1 500 mil per år
        eller mer.
      </p>

      <p>
        Det smartaste du kan göra är att inte lita på generella påståenden —
        utan att titta på kurvan för just den modell du funderar på. Det är
        därför vi byggt Hela Notan.
      </p>
    </>
  );
}
