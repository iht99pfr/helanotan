export default function PremiumutrustningAterforsakringsvarde() {
  return (
    <>
      <p>
        Du betalade 47 000 kronor extra för panoramatak när du köpte bilen ny.
        Tre år senare står du på Blocket och undrar: finns de pengarna kvar
        någonstans i priset? Eller försvann de samma sekund du körde ut från
        handlaren?
      </p>
      <p>
        De flesta tillval är bortkastade pengar ur ett andrahandsmarknadsperspektiv.
        Det är den konventionella visdomen, och den stämmer i stort. Men när vi
        analyserar tusentals annonser med regressionsmodeller dyker det upp några
        undantag &mdash; utrustning som faktiskt, mätbart, höjer priset på
        begagnatmarknaden. Skillnaden mellan rätt och fel tillval kan vara
        tiotusentals kronor vid försäljning.
      </p>
      <p>
        Den här artikeln handlar om vilka tillval det är &mdash; och varför vi
        äntligen kan mäta det med data istället för magkänsla.
      </p>

      <h2>Hur vi mäter utrustningens påverkan</h2>
      <p>
        Hela Notans datapipeline samlar in annonser från Blocket.se och
        analyserar dem med AI. Varje annons körs genom en språkmodell som
        extraherar strukturerad information ur fritext: motoreffekt, drivlina,
        generation &mdash; och utrustning. Vi letar specifikt efter nio
        premiumfunktioner som förekommer tillräckligt ofta för att vara
        statistiskt meningsfulla:
      </p>
      <ul>
        <li>Panoramatak</li>
        <li>Ventilerade säten</li>
        <li>Head-up display (HUD)</li>
        <li>JBL-ljudsystem</li>
        <li>Läderklädsel</li>
        <li>Harman Kardon-ljud</li>
        <li>Bowers &amp; Wilkins-ljud</li>
        <li>Luftfjädring</li>
        <li>Massagesäten</li>
      </ul>
      <p>
        Dessa nio features summeras till ett utrustningsindex per bil. Men vi
        stannar inte där. Varje enskild utrustning testas också individuellt i
        regressionen, så vi kan skilja mellan &ldquo;bilen har mycket
        utrustning&rdquo; (ett proxymått för högt specifikation) och &ldquo;just
        den här funktionen höjer priset&rdquo;.
      </p>
      <p>
        Metoden bygger på multivariat regression: vi kontrollerar för ålder,
        miltal, bränsletyp, hästkrafter, säljartyp och generationstillhörighet.
        Det som blir kvar &mdash; den isolerade effekten av utrustning &mdash;
        är det vi rapporterar.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Datakällor
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Analyserade annonser</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              10 000+
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Spårad premiumutrustning</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              9 funktioner
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Modeller med utrustningsdata</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              XC60, RAV4, XC40
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Extraktionsmetod</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              AI (LLM-parsning)
            </div>
          </div>
        </div>
      </div>

      <h2>Det som faktiskt spelar roll</h2>
      <p>
        Låt oss börja med det positiva. Vår data visar att en handfull tillval
        konsekvent korrelerar med högre begagnatpriser, även efter att vi
        kontrollerat för bilens övriga egenskaper. Rangordnat efter estimerad
        priseffekt:
      </p>

      <h3>1. Panoramatak</h3>
      <p>
        Den tydligaste signalen i datan. Bilar med panoramatak prissätts
        konsekvent högre över alla tre modeller vi mäter. Effekten är särskilt
        stark för Volvo XC60, där panoramatak är en del av den mest
        efterfrågade utrustningsnivån (Inscription med panoramatak). Nybilspris
        för tillvalet: runt 20 000&ndash;25 000 kr. Uppskattad återhållning
        efter 3&ndash;5 år: en tydligt mätbar andel av nybilskostnaden,
        sannolikt 40&ndash;60 procent. Det gör det till ett av de mest
        &ldquo;lönsamma&rdquo; tillvalen att ha vid försäljning.
      </p>
      <p>
        Varför? Troligen för att panoramatak är visuellt uppenbart &mdash; det
        syns på bilder, det är det första köparen märker vid provkörning, och
        det signalerar en högt specificerad bil. Det är också ett tillval som
        inte kan eftermonteras.
      </p>

      <h3>2. Ventilerade säten</h3>
      <p>
        Det näst starkaste premiumtillvalet i datan. Ventilerade säten är ett
        sällsynt tillval som nästan uteslutande finns i högt specificerade
        bilar, vilket gör det till en stark signal till köpare att bilen är
        &ldquo;full spec&rdquo;. Det finns en viss konfunderingseffekt här
        &mdash; bilar med ventilerade säten har ofta också andra
        premiumtillval &mdash; men effekten kvarstår även i multivariat analys.
      </p>

      <h3>3. Head-up display (HUD)</h3>
      <p>
        HUD har blivit en allt vanligare prestige-funktion i premium-SUV:ar.
        Vår data visar en tydlig prispremie för bilar med HUD, särskilt i
        Volvo XC60 och BMW X3. Liksom ventilerade säten fungerar det som en
        markör för hög specifikation. Nybilspriset (15 000&ndash;20 000 kr)
        behålls delvis på andrahandsmarknaden.
      </p>

      <h3>4. Premiumljud (Harman Kardon / Bowers &amp; Wilkins / JBL)</h3>
      <p>
        Ljudsystem hamnar i en intressant mellanzon. Bowers &amp; Wilkins i en
        Volvo och Harman Kardon i en BMW ger mätbara &mdash; om än måttliga
        &mdash; prispremier. Effekten är troligen delvis driven av att
        premiumljud korrelerar med höga utrustningsnivåer. JBL-system i Toyota
        RAV4 visar en liknande men svagare signal.
      </p>
      <p>
        Skillnaden mellan ljudsystemen är relevant: Bowers &amp; Wilkins
        (nybilspris ~25 000 kr) behåller proportionellt mer av investeringen
        än JBL (~10 000 kr), möjligen för att det associeras starkare med
        premiumkänsla.
      </p>

      <h3>5. Luftfjädring</h3>
      <p>
        Mätbar effekt, men med en viktig asterisk: luftfjädring är ovanligt nog
        att samplestorleken är begränsad, och det finns en dokumenterad oro
        bland begagnatköpare för reparationskostnader. Effekten är positiv men
        inte lika robust som panoramatak eller ventilerade säten.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Modellförbättring med utrustningsdata
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Volvo XC60: R²-förbättring</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              +0,93 procentenheter
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Toyota RAV4: R²-förbättring</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              +0,67 procentenheter
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Alla 3 modeller</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              Statistiskt signifikant
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Starkaste enskilda tillval</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              Panoramatak
            </div>
          </div>
        </div>
      </div>

      <h2>Det som spelar mindre roll än du tror</h2>
      <p>
        Lika intressant som vilka tillval som höjer priset är vilka som inte
        gör det. Här finns en del obekväma sanningar för den som speckat sin
        bil med allt tänkbart.
      </p>

      <h3>Läderklädsel</h3>
      <p>
        Det kanske mest förvånande resultatet. Läder var historiskt sett det
        klassiska premiumtillvalet &mdash; det som &ldquo;alla visste&rdquo;
        höjde andrahandsvärdet. I vår data är effekten svag och inkonsekvent
        mellan modeller. En förklaring: läder har blivit så vanligt i
        mellanklass-SUV:ar att det inte längre fungerar som en
        differentieringsfaktor. En Volvo XC60 utan läder är undantaget, inte
        regeln &mdash; och prismodellen fångar redan upp utrustningsnivån
        genom andra variabler.
      </p>
      <p>
        Det betyder inte att läder är värdelöst. Det betyder att du inte ska
        räkna med att det betalar sig vid försäljning. Skillnaden mot tyg är
        för liten för att motivera nybilspriset på 15 000&ndash;30 000 kr ur
        ett rent ekonomiskt perspektiv.
      </p>

      <h3>Massagesäten</h3>
      <p>
        Ett lyxtillval som kostar 10 000&ndash;15 000 kr nytt, men som knappt
        registrerar i andrahandsdatan. Problemet: massagesäten nämns
        inkonsekvent i annonser (många säljare glömmer det eller anser det
        för trivialt att nämna), och köpare tycks inte aktivt söka efter det.
        Det är ett &ldquo;nice to have&rdquo; som sällan driver köpbeslut.
      </p>

      <h3>Specifika färger och interiörval</h3>
      <p>
        Vi trackar inte färg som en premiumutrustning, men det är värt att
        nämna: den konventionella visdomen att vit, svart och grå håller
        värdet bättre stöds inte entydigt av data i det här segmentet.
        Prissättning domineras av mekaniska och funktionella egenskaper, inte
        estetiska val. Det finns en svag negativ effekt av ovanliga färger i
        vissa modeller, men den är sällan statistiskt signifikant.
      </p>

      <h2>Modellspecifika mönster</h2>
      <p>
        Utrustningens påverkan är inte universell. Samma tillval kan vara värt
        tusentals kronor mer i en modell och nästan ingenting i en annan.
        Här är de viktigaste skillnaderna:
      </p>

      <h3>Volvo XC60: utrustning spelar störst roll</h3>
      <p>
        XC60 har den starkaste utrustningseffekten av alla modeller vi mäter.
        R²-förbättringen på +0,93 procentenheter innebär att utrustning
        förklarar en meningsfull del av prisvariationen som inte fångas av
        ålder, miltal och bränsletyp ensamt. Det beror troligen på att XC60
        har ett brett utbud av utrustningsnivåer (Momentum, R-Design,
        Inscription) med stora prisskillnader.
      </p>
      <p>
        Panoramatak, ventilerade säten och Bowers &amp; Wilkins är de tre
        starkaste prediktorerna. En fullt utrustad Inscription med alla tre
        tillvalen prissätts systematiskt högre än en basmodell med samma
        ålder och miltal. Skillnaden kan vara 30 000&ndash;50 000 kr
        &mdash; tillräckligt för att motivera viss premiumutrustning vid
        nybilsköp, om du planerar att sälja inom 3&ndash;5 år.
      </p>

      <h3>Toyota RAV4: begränsad men mätbar effekt</h3>
      <p>
        RAV4 visar en R²-förbättring på +0,67 procentenheter. Effekten är
        svagare, vilket stämmer med Toyotas prissättningsstrategi: RAV4
        säljs med färre valbara tillval och mer standardiserade
        utrustningspaket. De flesta RAV4:or på marknaden liknar varandra
        mer än XC60:or gör.
      </p>
      <p>
        JBL-ljud och panoramatak (tillgängligt på Style-nivån) är de
        tydligaste prisdriven. Men effekten är mindre dramatisk &mdash;
        kanske 10 000&ndash;20 000 kr skillnad &mdash; delvis för att
        RAV4-marknaden i sig är mer priskänslig och köparna prioriterar
        driftsekonomi framför utrustning.
      </p>

      <h3>Volvo XC40: mellanläge</h3>
      <p>
        XC40 hamnar mellan XC60 och RAV4. Utrustningseffekten är
        statistiskt signifikant men svagare än för XC60, troligen för att
        XC40 har en snävare prissättningsspridning generellt. Harman
        Kardon-ljud (standardljudsystemet i vissa paket) ger en mätbar
        premie, likaså panoramatak. Ventilerade säten är ovanligare i XC40
        och samplestorleken är för liten för att dra säkra slutsatser.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Modell-jämförelse
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Störst utrustningseffekt</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              Volvo XC60
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Mest standardiserad marknad</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              Toyota RAV4
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">XC60 topp-3 tillval</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              Pano, vent. säten, B&amp;W
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">RAV4 topp-2 tillval</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              JBL-ljud, panoramatak
            </div>
          </div>
        </div>
      </div>

      <h2>Utrustningsindex vs. enskilda tillval</h2>
      <p>
        En av de mer intressanta insikterna från vår analys är att det totala
        antalet premiumfunktioner &mdash; vårt utrustningsindex &mdash; är en
        starkare prediktor än de flesta enskilda tillval. En bil med fyra av
        nio premiumfunktioner prissätts högre än en bil med bara en, oavsett
        vilka det är.
      </p>
      <p>
        Det antyder att begagnatmarknaden värderar &ldquo;generell
        specifikation&rdquo; minst lika mycket som specifika funktioner. En
        köpare som ser panoramatak, ventilerade säten och premiumljud i samma
        annons drar slutsatsen att bilen är välspecificerad och sannolikt
        välvårdad &mdash; och är beredd att betala mer. Det är en
        signaleffekt utöver den rena funktionaliteten.
      </p>
      <p>
        Det innebär också att ett enskilt lyxtillval i en annars basmodell
        ger begränsad utdelning. Panoramatak i en Momentum utan övrig
        premiumutrustning höjer priset, ja &mdash; men inte lika mycket som
        panoramatak i en Inscription som redan har resten av paketet. Kontexten
        spelar roll.
      </p>

      <h2>Varför AI-extraktion förändrar spelreglerna</h2>
      <p>
        Innan vi kunde mäta utrustningseffekter med data var bedömningen av
        tillval helt anekdotisk. Bilhandlare hade sina tumregler (&ldquo;skinn
        ger 15 000 extra&rdquo;), bilprissajter som KVD och Bytbil använde
        grova schabloner, och köpare fick lita på magkänsla.
      </p>
      <p>
        Det som gör vår approach annorlunda är AI-extraktionen. Vi använder
        en språkmodell för att läsa varje annons fritext och extrahera
        utrustningsinformation som annonsören ofta inte ens tagit sig tid att
        strukturera. &ldquo;Fullutr volvo inscription b&amp;w panorama
        vent.säten&rdquo; blir till nio binära variabler som kan användas i
        en regressionsmodell.
      </p>
      <p>
        Det innebär att vi för första gången kan kvantifiera utrustningseffekter
        i stor skala, baserat på faktiska marknadspriser istället för
        uppskattningar. Resultaten är inte perfekta &mdash; AI-extraktionen
        missar ibland utrustning som inte nämns i annonstexten, och det finns
        en fundamental selektion i att välspecificerade bilar oftare beskrivs i
        detalj &mdash; men det är ett enormt steg framåt jämfört med inga data
        alls.
      </p>

      <h2>Praktiska råd: vad du ska leta efter</h2>
      <p>
        Om du köper begagnat och vill maximera värde finns det en enkel
        slutsats: leta efter bilar som har rätt tillval men där säljaren inte
        prissatt dem fullt ut. Det är lättare sagt än gjort, men vår
        deal-scoring hjälper &mdash; en bil som vår modell flaggar som
        &ldquo;fyndpris&rdquo; och som dessutom har panoramatak och
        premiumljud är en dubbel vinst.
      </p>
      <p>
        Mer konkret:
      </p>
      <ul>
        <li>
          <strong>Prioritera panoramatak</strong> &mdash; det är det enskilda
          tillval som mest konsekvent påverkar andrahandsvärdet. Om du väljer
          mellan två likvärdiga bilar, ta den med panoramatak.
        </li>
        <li>
          <strong>Ventilerade säten är en signal</strong> &mdash; en bil med
          ventilerade säten har nästan alltid hög specifikation överlag. Det
          är ett snabbt filter vid sökning.
        </li>
        <li>
          <strong>Premiumljud: bonus, inte kriterium</strong> &mdash; trevligt
          att ha, men betala inte aktivt extra för det. Skillnaden i
          andrahandsvärde är för liten för att motivera prisskillnaden.
        </li>
        <li>
          <strong>Skinn: sluta överbetala</strong> &mdash; om du har valet
          mellan en bil med läder och en utan, till samma pris, ta läder
          givetvis. Men betala inte 20 000 kr extra för det. Marknaden
          kompenserar dig inte.
        </li>
        <li>
          <strong>Massagesäten: strunt samma</strong> &mdash; trevligt om det
          finns, men det påverkar inte priset. Betala noll kronor extra.
        </li>
      </ul>

      <p>
        Om du köper nytt och tänker sälja inom 3&ndash;5 år, är kalkylen mer
        nyanserad. Panoramatak och höga utrustningsnivåer betalar tillbaka en
        del av investeringen. Men ingen premiumutrustning är en &ldquo;bra
        investering&rdquo; i strikt mening &mdash; du får alltid tillbaka
        mindre än du betalade. Frågan är bara hur mycket mindre.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Sammanfattning: tillvalens andrahandsvärde
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Köp om du hittar det</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              Panoramatak, ventilerade säten
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Trevlig bonus</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              HUD, premiumljud
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Inte värt extrapris</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              Läder (separat tillval)
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Påverkar inte priset</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              Massagesäten
            </div>
          </div>
        </div>
      </div>

      <h2>Begränsningar och nästa steg</h2>
      <p>
        Vår analys har begränsningar som är viktiga att förstå. AI-extraktionen
        fångar bara utrustning som nämns i annonstexten &mdash; bilar vars
        säljare inte listar utrustning i detalj missar vi. Det skapar en
        potentiell bias: bilar med tydligt listad premiumutrustning kan vara
        systematiskt annorlunda än genomsnittet (mer sannolikt handlarbilar,
        nyare, bättre vårdade).
      </p>
      <p>
        Vi mäter korrelation snarare än kausalitet. Att en bil med panoramatak
        säljs dyrare bevisar inte att panoramataket orsakar prisskillnaden
        &mdash; det kan vara att bilar med panoramatak tenderar att vara
        bättre utrustade överlag, och att vår modell inte fångar alla
        konfunderar. Utrustningsindexet kontrollerar delvis för detta, men inte
        fullständigt.
      </p>
      <p>
        Framöver vill vi utöka analysen till fler modeller och fler
        utrustningstyper. Dragkrok, adaptiv farthållare, 360-kamera och
        elektrisk baklucka är alla kandidater. Vi vill också kunna separera
        effekten av enskilda tillval med högre statistisk kraft, genom att
        utöka datasetet ytterligare.
      </p>
      <p>
        Tills dess: nästa gång du speckar en nybil eller väljer mellan
        begagnade alternativ, titta på utrustningslistan med nya ögon.
        Panoramatak och ventilerade säten betalar sig mer än du tror.
        Massagesäten och specialfärger gör det inte.
      </p>
    </>
  );
}
