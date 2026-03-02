export default function TeslaModelYPrissattning() {
  return (
    <>
      <h2>Bilen alla prissätter lika</h2>
      <p>
        Det finns en bilmodell på den svenska begagnatmarknaden som bryter mot
        alla konventioner. En bil där det inte spelar någon roll om du köper av
        en etablerad handlare i Göteborg eller en privatperson i Umeå — priset
        är exakt detsamma. Inte ungefär. Inte i närheten. Exakt.
      </p>
      <p>
        Tesla Model Y är den enda bilen av de femton modeller vi följer på Hela
        Notan där genomsnittspriset hos handlare och privata säljare är
        identiskt: 382&nbsp;000 kronor. Noll procent handlarpremie. Det är en
        anomali som saknar motstycke i vår data — och den berättar en hel del om
        hur Teslas försäljningsmodell omformat spelreglerna för begagnade bilar i
        Sverige.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Model Y i siffror
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Handlare (snitt)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              382 000 kr (482 bilar)
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Privat (snitt)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              382 000 kr (45 bilar)
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Handlarpremie</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              0 %
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Andel handlare</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              91 %
            </div>
          </div>
        </div>
      </div>

      <h2>Noll procent — i ett hav av påslag</h2>
      <p>
        För att förstå hur ovanligt detta är behöver vi sätta siffran i relation
        till resten av marknaden. Ta Volvo XC60, en av de vanligaste bilarna i
        vår databas. Hos en handlare kostar en begagnad XC60 i genomsnitt
        341&nbsp;000 kronor. Samma bil hos en privatsäljare? 209&nbsp;000
        kronor. Det är ett handlarpåslag på 63&nbsp;procent. Den skillnaden
        förklaras delvis av att handlare tenderar att ha nyare och finare bilar i
        sin stock — men även när man kontrollerar för ålder och skick kvarstår en
        rejäl premie.
      </p>
      <p>
        Volkswagen Tiguan uppvisar liknande mönster. BMW X3 likaså. I princip
        varje modell vi mäter har en tydlig handlarpremie, och det är logiskt:
        handlaren erbjuder garanti, finansiering, eventuell inbytesmöjlighet och
        ett professionellt bemötande som kostar pengar. Att handlare tar mer
        betalt är inte konstigt — det är regel.
      </p>
      <p>
        Mot den bakgrunden sticker Model Y ut som en statistisk omöjlighet. Med
        482 handlarbilar och 45 privata annonser ger datan en kristallklar bild:
        det finns ingen premie. Köparen betalar samma summa oavsett vem som
        säljer. Frågan är varför.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Handlarpremie — Model Y vs konkurrenter
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Tesla Model Y</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              0 %
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Volvo XC60</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              63 %
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">VW Tiguan</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              ~50 %
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">BMW X3</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              ~45 %
            </div>
          </div>
        </div>
      </div>

      <h2>Varför Tesla är annorlunda</h2>
      <p>
        Svaret börjar med hur Tesla säljer nya bilar. Till skillnad från i
        princip alla andra biltillverkare har Tesla inga fristående
        återförsäljare. Det finns inga Tesla-handlare med egen prissättning,
        inga regionala rabatter, inga förhandlingsmöjligheter. Varje ny Model Y
        säljs direkt från Tesla till kund, till exakt samma pris i hela landet.
        Det innebär att nybilspriset är fullständigt transparent — alla vet vad
        alla andra betalade.
      </p>
      <p>
        Den transparensen sipprar ner till begagnatmarknaden. När alla vet vad en
        ny Model Y kostar, och alla vet hur gammal en specifik begagnad bil är,
        uppstår en implicit prislista som varken handlare eller privatpersoner
        kan avvika särskilt mycket ifrån. Det finns inget informationsövertag att
        kapitalisera på.
      </p>
      <p>
        Dessutom: Model Y är extremt standardiserad. Traditionella bilmärken
        erbjuder ett virrvarr av motoralternativ, utrustningspaket,
        transmissionsval och specialversioner. En Volvo XC60 kan vara en D4
        med grundutrustning eller en T8 Inscription med panoramatak, luftfjädring
        och B&amp;W-ljud. Prisskillnaden mellan dessa är enorm, och den gör varje
        begagnad XC60 unik — en handlare med specialistkunskap kan hitta och
        prissätta den skillnaden bättre än en privatperson.
      </p>
      <p>
        En Model Y har inte den komplexiteten. Det finns i praktiken två
        versioner: Standard Range och Long Range (samt den tillfälliga
        Performance). Alla har samma motor, samma mjukvara, samma infotainment.
        Tillval är begränsade till färg, fälgar och dragkrok. Det gör att varje
        begagnad Model Y i stort sett är utbytbar mot en annan med samma
        årsmodell och körda mil. Ingen specialistkunskap behövs för att
        prissätta den — och alltså ingen premie att motivera.
      </p>
      <p>
        Det tredje skälet handlar om köparen. Tesla-ägare är, generellt sett,
        mer digitalt engagerade och mer prismedvetna på just det här sättet.
        De har koll på nybilspriser, OTA-uppdateringar och
        andrahandsvärden. Att ta ut en premie mot denna kundgrupp är svårt —
        de ser igenom det direkt. Handlare som säljer Model Y vet detta och
        prissätter därefter.
      </p>

      <h2>91 procent handlare — den nästan utslocknade privatmarknaden</h2>
      <p>
        En annan unik egenskap: 91&nbsp;procent av alla begagnade Model Y i vår
        data säljs av handlare. Bara 45 av 527 annonser är privata. Det är den
        högsta handlarandelen av alla modeller vi mäter.
      </p>
      <p>
        Varför så få privatförsäljningar? En del av svaret är leasingstrukturen.
        En mycket stor andel av alla Model Y i Sverige levereras via företagsleasing,
        tjänstebil eller privatleasing. När leasingperioden tar slut — ofta efter
        tre år — hamnar bilen inte hos den ursprungliga föraren utan hos
        leasingbolaget, som säljer den vidare genom auktioner eller
        partnerskapade bilhandlare. Privatpersonen som körde bilen i tre år
        ägde den aldrig.
      </p>
      <p>
        Det skapar en begagnatmarknad som nästan uteslutande domineras av
        professionella aktörer. Och eftersom dessa aktörer alla köper in bilarna
        till liknande priser via samma kanaler, och alla säljer till
        samma typ av prismedveten köpare, konvergerar priserna. Resultatet
        är den platta prisskillnad vi observerar.
      </p>

      <h2>Värdeminskningskurvan: snabbast i fältet</h2>
      <p>
        Att handlarpremien är noll betyder inte att Model Y är billig att äga.
        Tvärtom visar vår data att Model Y tappar värde snabbare än de flesta
        konkurrenter under sina första år.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Värdeminskning per årsmodell
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">2025 (ca 1 år)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              516 000 kr
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">2023 (ca 3 år)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              ~370 000 kr
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">2021 (ca 5 år)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              328 000 kr
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Tapp 2025→2021</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              −36 % på 4 år
            </div>
          </div>
        </div>
      </div>

      <p>
        Från 516&nbsp;000 kronor för en 2025-modell till 328&nbsp;000 för en
        2021:a — det är 36&nbsp;procent på fyra årsmodeller. En del av det
        förklaras av att Tesla aktivt sänkt nybilspriset under perioden, vilket
        drar ner hela begagnatmarknaden. När en ny Model Y plötsligt kostar
        30&nbsp;000 kronor mindre på tesla.com justeras alla begagnade priser
        neråt. Det är en mekanism som är unik för märken med centraliserad,
        transparent prissättning.
      </p>
      <p>
        Den snabba depreciationen gör Model Y till en dyr bil att äga de första
        åren — men potentiellt ett bra begagnatköp. Den som köper en tre år
        gammal Model Y slipper den brantaste delen av kurvan och får en bil som
        fortfarande har modern mjukvara och drivlina, till ett pris som
        stabiliserats.
      </p>
      <p>
        Medelåldern i vår data är bara 3,3&nbsp;år med ett genomsnitt på
        7,4&nbsp;mil — det är en exceptionellt ung och lågmilad bilpark. Det
        bekräftar bilden av en marknad driven av leasing: bilarna cirkulerar
        snabbt och lämnar aldrig den mest attraktiva delen av livscykeln.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Bilparken
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Medelålder</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              3,3 år
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Genomsnittlig miltal</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              7,4 mil (7 400 km)
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Drivlina</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              100 % el
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Totalt annonser</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              527
            </div>
          </div>
        </div>
      </div>

      <h2>Varför R² bara är 68 procent</h2>
      <p>
        Var och en av de modeller vi spårar på Hela Notan har en
        regressionsmodell som försöker förklara priset utifrån variabler som
        ålder, miltal, motortyp, hästkrafter och utrustningsnivå. Modellens
        förklaringsgrad, R², anger hur stor andel av prisvariationen som kan
        förklaras av dessa faktorer. För de flesta bilar ligger R² på 85–95
        procent. För Model Y: 68&nbsp;procent.
      </p>
      <p>
        Det låter kanske som att vår modell fungerar dåligt på Tesla. Men det
        omvända är närmare sanningen: det är Model Y som fungerar annorlunda. Den
        låga R²-siffran beror inte på att modellen missar viktiga variabler —
        den beror på att de vanliga variablerna helt enkelt inte spelar lika stor
        roll.
      </p>
      <p>
        Tänk på det så här: en traditionell bil har enormt många
        konfigurationsmöjligheter. En Volvo XC60 kan ha sex olika motorer, tre
        utrustningsnivåer och dussintals tillvalspaket. Varje kombination
        skapar en unik prispunkt, och regressionsmodellen kan fånga dessa
        skillnader. Det ger hög R².
      </p>
      <p>
        Model Y har nästan ingen variation. Alla har elmotor. Alla har samma
        infotainment. Tillvalen är minimala. De faktorer som normalt förklarar
        prisskillnader mellan bilar av samma modell — motortyp, utrustning,
        bränsleval — finns inte. Det som återstår är ålder och miltal, och de
        förklarar bara en del av variationen.
      </p>
      <p>
        Resten av prisskillnaden drivs förmodligen av faktorer som vår modell
        inte fångar: kosmetiskt skick, batteriets hälsa, om bilen har Autopilot
        eller Full Self-Driving, och — inte minst — Teslas egna prisändringar
        som rubbar hela marknadens referenspunkter. Det är en marknad där
        nybilsprisets rörelser kan ha större effekt på begagnatpriset än bilens
        faktiska ålder.
      </p>

      <blockquote>
        R² på 68 % betyder inte att prissättningen är kaotisk — det betyder att
        de vanliga förklaringsfaktorerna inte räcker. Model Y:s pris styrs av
        Teslas centrala prisändringar minst lika mycket som av ålder och miltal.
      </blockquote>

      <h2>Vad det betyder för köpare och säljare</h2>
      <p>
        Om du letar efter en begagnad Model Y är prislandskapet ovanligt enkelt
        att navigera. Du behöver inte oroa dig för att bli lurad av en handlare —
        de tar inte mer betalt än en privatperson. Du behöver inte heller jaga
        privata annonser för att hitta ett bättre pris, för det finns i
        praktiken inget bättre pris att hitta.
      </p>
      <p>
        Det som däremot spelar roll är timing. Eftersom Tesla regelbundet
        justerar sina nybilspriser — ibland med tiotusentals kronor åt gången —
        kan begagnatmarknaden röra sig snabbt. En prissänkning på nya bilar
        pressar ned värdet på begagnade exemplar nästan omedelbart. Det gör
        tidpunkten för köpet potentiellt viktigare än vilken specifik bil du
        väljer.
      </p>
      <p>
        Vårt fynd-system, som identifierar bilar prissatta under
        marknadsvärdet, hittar deals även bland Model Y — men de tenderar att
        vara mindre dramatiska än för andra modeller. Prisvariationen är helt
        enkelt mindre. Där en XC60 kan vara 100&nbsp;000 kronor felprisad har en
        Model Y kanske 20&nbsp;000 kronors spelrum. Marknaden är redan
        effektiv.
      </p>

      <h2>Den perfekta begagnatmarknaden</h2>
      <p>
        Ekonomer talar ibland om &quot;perfekta marknader&quot; — marknader där
        alla aktörer har fullständig information, produkterna är homogena och
        priserna konvergerar mot ett enda jämviktspris. Begagnade bilar brukar
        vara raka motsatsen: asymmetrisk information, heterogena produkter och
        stora prisspridningar.
      </p>
      <p>
        Model Y utmanar den bilden. Med sin extrema standardisering,
        transparenta nybilsprissättning och leasingdrivna begagnatmarknad
        närmar den sig något som liknar en perfekt marknad. Priserna är
        förutsägbara. Informationsövertag är svåra att uppnå. Handlarens
        mervärde — kunskap om specifikationer och skick — är minimalt när alla
        bilar i stort sett är likadana.
      </p>
      <p>
        Det är på sätt och vis en framgångssaga: en marknad som fungerar så
        effektivt att mellanhandens traditionella roll har erodera till nästan
        ingenting. Men det är också en berättelse med nyanser. Handlarens
        funktion på den här marknaden är inte att prissätta — den är att
        tillhandahålla logistik, garanti och finansiering. Och det gör de
        utan att kunna ta extra betalt. Det förklarar varför många traditionella
        handlare hellre fokuserar på andra märken.
      </p>

      <h2>Är Model Y ett bra begagnatköp?</h2>
      <p>
        Det beror, som alltid, på vad man jämför med. Model Y:s styrka som
        begagnatbil är den enkla prissättningen — du vet vad du betalar, du vet
        att du inte betalar för mycket, och du vet att priset är marknadsmässigt.
        Den unga bilparken (3,3&nbsp;år i snitt) och den låga genomsnittsmilan
        (7,4&nbsp;mil) innebär att de flesta begagnade exemplar fortfarande är i
        mycket gott skick.
      </p>
      <p>
        Svagheten är depreciationen. Med 36&nbsp;procent värdeminskning på fyra
        årsmodeller förlorar tidiga ägare betydande belopp. Men den som köper
        begagnat kan vända det till sin fördel: en tre år gammal Model Y till
        runt 370&nbsp;000 kronor har redan tagit den värsta smällen och erbjuder
        mycket modern elbil till ett pris som börjar närma sig konventionella
        SUV:ar.
      </p>
      <p>
        Risken ligger i Teslas prispolitik. Om Tesla sänker nybilspriset
        ytterligare — vilket de gjort upprepade gånger — sjunker även din
        begagnade bils värde. Det är en faktor som inte finns i samma utsträckning
        för traditionella märken, där nybilspriser är mer stabila och lokala
        förhandlingar skapar en buffert.
      </p>
      <p>
        Model Y är, sammanfattningsvis, begagnatmarknadens enklaste bil att
        köpa. Den som letar efter förutsägbarhet, transparens och ett
        marknadsmässigt pris utan förhandling hittar det här. Men den som
        söker ett fynd — en bil som är felprisad, underskattad eller okänd —
        behöver leta på annat håll. Marknaden har redan gjort jobbet.
      </p>
    </>
  );
}
