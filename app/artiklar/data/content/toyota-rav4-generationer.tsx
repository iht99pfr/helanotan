export default function ToyotaRav4Generationer() {
  return (
    <>
      <h2>Tre generationer som knappt delar namn</h2>

      <p>
        Toyota RAV4 har funnits sedan 1994, men de tre generationer som
        dominerar den svenska begagnatmarknaden idag har remarkabelt lite
        gemensamt. En generation 3 från 2008 är en kompakt, bensindoftande
        crossover med manuell låda. En generation 5 från 2022 är en
        högteknologisk hybridmaskin som knappt vet vad en växelspak är.
        Prisskillnaden? Ungefär 280 000 kronor.
      </p>

      <p>
        Vi har analyserat 554 RAV4-annonser och byggt en regressionsmodell som
        förklarar 96,4 procent av prisvariationen &mdash; den bästa modellen i
        hela vår databas. Det betyder att RAV4 är den mest förutsägbara bilen
        att prissätta på den svenska marknaden. Och det öppnar för en fascinerande
        historia om hur en enda modell kan genomgå en fullständig identitetskris
        på femton år.
      </p>

      <h2>Generation 3 (2006&ndash;2012): Den glömda</h2>

      <p>
        Den tredje generationen RAV4 är den bil som Toyota-entusiaster helst
        låtsas inte finns. Den har varken hybridteknikens nimbus eller den
        femte generationens moderna formspråk. Den är bara en rejäl, fyrkantig
        SUV med bensinmotor och i bästa fall fyrhjulsdrift &mdash; en bil som
        gör jobbet utan att kräva uppmärksamhet.
      </p>

      <p>
        Med ett genomsnittspris på 87 000 kronor och en medelålder på 17,8 år
        befinner sig gen 3 i ett prissegment där de flesta köpare letar efter
        transportmedel snarare än statusobjekt. Det är Volvos gamla V70-territorium:
        bilar som byter ägare på Blocket utan att någon skriver en annons med
        fler än tre meningar.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Generation 3 i siffror
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Annonser</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">53 st</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snittpris</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">87 000 kr</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Medelålder</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">17,8 år</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Årsmodeller</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">2006&ndash;2012</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Dominerande drivlina</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Bensin</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Prisspann</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">45&ndash;140 000 kr</div>
          </div>
        </div>
      </div>

      <p>
        Men det finns en poäng med gen 3 som siffrorna inte fångar: den är
        nästan oförstörbar. Toyota RAV4 från den här eran har ett rykte om
        mekanisk driftsäkerhet som få bilar i klassen kan matcha. Motorerna
        &mdash; vanligtvis 2,0- eller 2,4-liters bensin &mdash; är beprövade
        konstruktioner utan turbo, utan hybridbatteri, utan saker som kan gå
        sönder på sätt som kostar fem siffror att åtgärda. Det finns en anledning
        till att dessa bilar fortfarande säljs efter 18 år.
      </p>

      <p>
        Frågan är om marknaden undervärderar dem. Med 53 annonser i vår data
        är underlaget tunnare än för nyare generationer, men prisnivån antyder
        att köpare behandlar gen 3 som vilken gammal SUV som helst. Det är de
        inte. Det är Toyotor.
      </p>

      <h2>Generation 4 (2013&ndash;2018): Mellanbarnet</h2>

      <p>
        Om gen 3 är den glömda och gen 5 är stjärnan, är generation 4 det
        klassiska mellanbarnet &mdash; aldrig riktigt i rampljuset men solitt
        pålitlig. Den fjärde generationen RAV4 markerade en viktig övergång:
        Toyota började erbjuda hybrid som alternativ (om än i begränsad
        utsträckning på den svenska marknaden), och bilen växte till en mer
        familjevänlig storlek.
      </p>

      <p>
        Med 115 annonser och ett genomsnittspris på 192 000 kronor placerar
        sig gen 4 i sweet spot-segmentet &mdash; tillräckligt ny för att ha
        modern säkerhetsutrustning, tillräckligt gammal för att ha tappat den
        värsta nybilspremien. Medelåldern på 9,8 år innebär att de flesta
        exemplaren är 2015&ndash;2017-modeller, bilar som i många fall passerat
        garantitiden men fortfarande har årtionden av liv kvar.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Generation 4 i siffror
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Annonser</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">115 st</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snittpris</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">192 000 kr</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Medelålder</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">9,8 år</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Årsmodeller</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">2013&ndash;2018</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Prishopp till gen 5</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">+177 000 kr</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Prisspann</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">120&ndash;260 000 kr</div>
          </div>
        </div>
      </div>

      <p>
        Det intressanta med gen 4 är prissteget uppåt. Att gå från gen 3 till
        gen 4 kostar ungefär 105 000 kronor mer i snitt, men du får i gengäld
        en 7&ndash;8 år nyare bil. Det är ett rimligt prishopp. Att sedan gå
        från gen 4 till gen 5 kostar ytterligare 177 000 kronor &mdash; och
        där får du bara 5&ndash;6 år nyare bil. Prislyftet vid generationsbytet
        2019 är markant, och det beror inte bara på att bilen är nyare.
      </p>

      <p>
        Gen 4 är för köparen som vill ha Toyota-kvalitet och en någorlunda
        modern bil utan att betala hybridpremien. Många exemplar har den
        pålitliga 2,0-liters bensinmotorn och &mdash; till skillnad från gen 5
        &mdash; är fortfarande tillgängliga med manuell växellåda. För den som
        kör kortare sträckor och inte behöver hybridens bränslebesparingar kan
        det vara det smartare valet rent ekonomiskt.
      </p>

      <h2>Generation 5 (2019&ndash;idag): Hybridmaskinen</h2>

      <p>
        Generation 5 är den RAV4 som förändrade allt. När Toyota lanserade den
        2019 var budskapet tydligt: hybrid är inte längre ett alternativ, det
        är standarden. Och den svenska marknaden lyssnade. Av de 386 gen
        5-annonser vi analyserar är den överväldigande majoriteten hybrider.
        Ren bensin har blivit undantaget.
      </p>

      <p>
        Med ett genomsnittspris på 369 000 kronor och en medelålder på bara
        4,2 år befinner sig gen 5 i det prissegment där bilar fortfarande
        känns nya. Läderdoft i kupén, skärmar utan repor, servicehistorik med
        få rader. Det är en bil som säljs för att ägaren tröttnat eller fått
        barn nummer tre &mdash; inte för att något är fel.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Generation 5 i siffror
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Annonser</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">386 st</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snittpris</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">369 000 kr</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Medelålder</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">4,2 år</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Årsmodeller</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">2019&ndash;2025</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Andel hybrider</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">&gt;95%</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">PHEV-snittpris</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">402 000 kr</div>
          </div>
        </div>
      </div>

      <p>
        Den femte generationen har dessutom introducerat en laddhybridversion
        (PHEV) som med sitt genomsnittspris på 402 000 kronor utgör det
        absoluta premiumsegmentet inom RAV4-familjen. Med 57 PHEV-annonser i
        vår data ser vi att dessa bilar handlas till en tydlig premie &mdash;
        ungefär 33 000 kronor mer än en vanlig hybrid &mdash; men erbjuder i
        gengäld eldrift för de flesta pendlingsresor.
      </p>

      <p>
        Prisstrukturen inom gen 5 är anmärkningsvärt stram. Variationen mellan
        exemplar med liknande ålder och miltal är liten, vilket speglar en
        marknad där köpare vet exakt vad en RAV4 Hybrid ska kosta. Det finns
        få kap att göra &mdash; men det betyder också att du sällan blir lurad.
      </p>

      <h2>Bränslerevolutionen: Från bensin till hybridmaskin</h2>

      <p>
        Den kanske mest dramatiska förändringen mellan generationerna är inte
        designen, storleken eller priset &mdash; det är drivlinan. RAV4:s
        bränslehistoria berättar historien om hela den svenska bilmarknaden i
        miniformat.
      </p>

      <p>
        Generation 3 var en renodlad bensinbil. Diesel förekom men var sällsynt
        på den svenska marknaden. Generation 4 introducerade hybrid som ett
        alternativ men behöll bensin som huvudspår. Generation 5 vände på
        steken helt: hybrid blev standard och ren bensin reducerades till en
        budgetvariant som nästan ingen väljer.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Drivlina &mdash; pris och volym
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Hybrid &mdash; annonser</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">389 st</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Hybrid &mdash; snittpris</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">338 000 kr</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">PHEV &mdash; annonser</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">57 st</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">PHEV &mdash; snittpris</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">402 000 kr</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Bensin &mdash; annonser</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">92 st</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Bensin &mdash; snittpris</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">138 000 kr</div>
          </div>
        </div>
      </div>

      <p>
        Siffrorna talar sitt tydliga språk: 389 av 554 annonser &mdash; över
        70 procent &mdash; är hybrider. Bensinbilarnas genomsnittspris på
        138 000 kronor avslöjar att de nästan uteslutande tillhör äldre
        generationer. Den som köper en bensindriven RAV4 idag köper med stor
        sannolikhet en gen 3 eller gen 4.
      </p>

      <p>
        Det skapar en intressant dynamik på marknaden. Hybridpremien är inte
        bara en fråga om teknik &mdash; den är i praktiken en generationspremie.
        Du betalar inte 200 000 kronor mer för att bilen har en elmotor. Du
        betalar för att bilen är tio år nyare, har moderna säkerhetssystem och
        en helt annan inredningskänsla. Hybriddrivlinan råkar bara vara det
        som skiljer gammal från ny i RAV4-världen.
      </p>

      <h2>Varför RAV4 har marknadens mest förutsägbara prissättning</h2>

      <p>
        Vår regressionsmodell för Toyota RAV4 når ett R&#178;-värde på 96,4
        procent &mdash; det bästa resultatet bland alla 15 modeller vi
        analyserar. Till jämförelse ligger Tesla Model Y på 68 procent, och
        de flesta modeller hamnar i intervallet 85&ndash;92 procent. Vad
        betyder det?
      </p>

      <p>
        R&#178; mäter hur stor andel av prisvariationen som vår modell kan
        förklara med kända faktorer som ålder, miltal, drivlina och utrustning.
        Ett värde på 96,4 procent innebär att nästan all prisvariation i
        RAV4-data kan förklaras av objektiva, mätbara egenskaper. Det finns
        nästan inget &rdquo;mysteri&rdquo; i prissättningen.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Modellprecision
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">R&#178;</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">96,4%</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Ranking</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">#1 av 15 modeller</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Antal annonser</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">554 st</div>
          </div>
        </div>
      </div>

      <p>
        Det finns flera skäl till detta. Det första är homogenitet: RAV4
        erbjuds i relativt få varianter jämfört med exempelvis BMW X3 eller
        Mercedes GLC. Det finns inga M-paket, AMG-linjer eller
        motorstorleksmatriser att hålla reda på. En RAV4 Hybrid AWD-i är i
        princip samma bil oavsett om den såldes i Malmö eller Umeå.
      </p>

      <p>
        Det andra skälet är köparprofilen. RAV4-köpare är, generaliserat,
        pragmatiker. De köper bilen för att den är pålitlig, bränslesnål och
        lagom stor &mdash; inte för att den har en viss motor eller en specifik
        lackfärg. Det skapar en marknad med färre emotionella prispremier och
        mer rationella prisbeslut.
      </p>

      <p>
        Det tredje skälet är datavolym. Med 554 annonser har vi tillräckligt
        underlag för att regressionsmodellen ska fånga de verkliga
        prismönstren utan att enstaka outliers stör bilden. Fler datapunkter
        ger en stabilare modell, och RAV4 ligger i toppen av vår databas
        sett till antal annonser.
      </p>

      <h2>De dolda fynden: Är äldre generationer undervärderade?</h2>

      <p>
        Här blir det intressant. Vår deal-scoring &mdash; som identifierar
        bilar prissatta signifikant under marknadsvärde &mdash; visar att
        gen 3 och gen 4 innehåller en oproportionerligt stor andel
        underprissatta bilar. Det beror troligen på att säljare av äldre
        RAV4:or inte alltid är medvetna om Toyotas rykte och den mekaniska
        hållbarheten.
      </p>

      <p>
        En gen 3 RAV4 i bra skick med dokumenterad servicehistorik är inte
        vilken 18 år gammal SUV som helst. Det är en bil med en motor som
        sannolikt rullar i ytterligare tio år utan större ingrepp. Men
        marknaden prissätter den utifrån ålder och märke &mdash; och Toyota
        i det segmentet saknar den premium-nimbus som gör att en gammal BMW
        eller Volvo ändå håller ett högre pris.
      </p>

      <p>
        Generation 4 erbjuder ett liknande scenario, om än i en annan
        prisklass. Med ett snittpris på 192 000 kronor konkurrerar den med
        betydligt äldre exemplar av BMW X3 och Mercedes GLC &mdash; bilar
        som visserligen har mer prestige men också betydligt högre
        underhållskostnader. En RAV4 gen 4 mot en GLC av samma ålder?
        Underhållskalkylen talar entydigt till Toyotans fördel.
      </p>

      <blockquote>
        Den som prioriterar driftsäkerhet över prestige hittar de bästa
        affärerna i RAV4:s äldre generationer &mdash; där priset speglar
        åldern men inte bilens faktiska återstående livslängd.
      </blockquote>

      <h2>Köpguide: Vilken generation för vilken budget?</h2>

      <p>
        Låt oss bryta ned det praktiskt. Varje generation passar en specifik
        köparprofil, och det handlar inte bara om budget &mdash; det handlar
        om vad du behöver av bilen.
      </p>

      <h3>Under 120 000 kronor: Generation 3</h3>

      <p>
        Du får en 15&ndash;20 år gammal bensindriven SUV med fyrhjulsdrift och
        Toyotas legendariska hållbarhet. Perfekt som andrabil, sommarstuga-bil
        eller för den som vill ha en driftsäker bil utan att binda kapital.
        Räkna med bensinförbrukning runt 0,9&ndash;1,0 liter per mil och
        minimal risk för oväntade verkstadskostnader. Nackdelen: åldrad
        inredning, saknar moderna assistanssystem och kan kännas sliten om
        den haft många ägare.
      </p>

      <h3>150 000&ndash;250 000 kronor: Generation 4</h3>

      <p>
        Sweet spot för den budgetmedvetna familjen. Du får en 8&ndash;12 år
        gammal bil med bättre säkerhet, modernare inredning och i många fall
        fortfarande under 15 000 mil. Bensinmotor dominerar, men enstaka
        hybrider förekommer i övre delen av prisspannet. Det här är den
        generation som ger mest bil per krona om du räknar in förväntad
        återstående livslängd.
      </p>

      <h3>300 000&ndash;450 000 kronor: Generation 5 Hybrid</h3>

      <p>
        Den moderna RAV4-upplevelsen. Hybridmotor med automatik, LED-strålkastare,
        avancerade förarstöd och en bränsleförbrukning under 0,5 liter per
        mil i blandad körning. De flesta exemplaren har mellan 3 000 och
        8 000 mil och är 2&ndash;5 år gamla. Prissättningen är stram &mdash;
        förvänta dig inte stora kap &mdash; men du vet exakt vad du får.
      </p>

      <h3>400 000+ kronor: Generation 5 PHEV</h3>

      <p>
        Premiumalternativet. Med laddhybridteknik och en elektrisk räckvidd
        på cirka 7&ndash;8 mil klarar de flesta pendlare sina dagliga resor
        på el. Högre inköpspris kompenseras delvis av lägre driftkostnader,
        men det kräver att du faktiskt laddar regelbundet. Med 57 annonser
        och ett snittpris på 402 000 kronor är detta det tunnaste
        marknadssegmentet &mdash; men också det med minst prisvariation.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Snabbguide &mdash; generation vs budget
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Under 120 000 kr</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Gen 3 bensin</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">150&ndash;250 000 kr</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Gen 4 bensin</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">300&ndash;450 000 kr</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Gen 5 hybrid</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">400 000+ kr</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Gen 5 PHEV</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Bäst kr/livslängd</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Gen 4</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Lägst risk</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Gen 5 hybrid</div>
          </div>
        </div>
      </div>

      <h2>Slutsatsen: En modell, tre verkligheter</h2>

      <p>
        Toyota RAV4 illustrerar något som gäller för hela bilmarknaden men
        sällan blir så tydligt: ett modellnamn är inte en garanti för
        kontinuitet. Att tre bilar med samma namn kan spänna från 87 000 till
        402 000 kronor &mdash; och från bensinmotor till laddhybrid &mdash;
        säger allt om hur snabbt bilindustrin rör sig.
      </p>

      <p>
        Det mest anmärkningsvärda med RAV4 är dock inte prisspridningen utan
        förutsägbarheten. Med ett R&#178; på 96,4 procent är detta den bil
        där du, som köpare, har allra bäst förutsättningar att veta om du
        betalar rätt pris. Vår regressionsmodell kan berätta med hög precision
        vad en specifik RAV4 bör kosta &mdash; och det gör den till den
        kanske tryggaste begagnataffären på marknaden.
      </p>

      <p>
        Oavsett om du siktar på en gen 3 för 90 000 eller en gen 5 PHEV
        för 400 000 gäller samma grundregel: kontrollera priset mot
        marknadsdatan. Med RAV4 har du bättre förutsättningar att göra det
        än med någon annan bil vi analyserar.
      </p>
    </>
  );
}
