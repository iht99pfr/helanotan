export default function VwGolf20Ar() {
  return (
    <>
      <p>
        Ingen bil i vår databas spänner över ett så brett prisintervall som
        Volkswagen Golf. Från en sliten 2005:a för 30 000 kronor till en
        fabriksny Golf R för över 600 000 &mdash; det är tjugo årsmodeller, tre
        generationer, fyra drivlinor och nästan två tusen annonser som
        tillsammans tecknar den mest kompletta priskurvan vi har tillgång till.
      </p>

      <p>
        Det är också en kurva full av överraskningar. Det finns en treårig platå
        där värdeminskningen nästan stannar av helt. Det finns ett
        generationshopp som adderar 25 000 kronor över en natt. Och det finns
        prestandaversioner som trotsar all logik och behåller sitt värde bättre
        än grundmodellen.
      </p>

      <p>
        Vi har gått igenom samtliga 1 774 Golf-annonser på Blocket för att
        förstå exakt hur Sveriges mest sålda bil tappar &mdash; och ibland inte
        tappar &mdash; i värde.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          VW Golf i siffror
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Annonser</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              1 774
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Prisintervall</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              30 000 &ndash; 600 000 kr
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Årsmodeller</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              2005 &ndash; 2026
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Medelålder</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              9,2 år
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Medelmiltal</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              12,5 mil
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Modellens R²</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              92,4 %
            </div>
          </div>
        </div>
      </div>

      <h2>Den kompletta priskurvan &mdash; år för år</h2>

      <p>
        Vi börjar där alla bilar slutar: i botten. En Golf från 2005 &mdash;
        generation fem, den som introducerade den moderna Golf-designen &mdash;
        kostar i snitt runt 30 000 kronor. Det är en bil som är 21 år gammal,
        har rullat uppemot 25 mil och som i praktiken har kostat sin ägare
        kanske 1 500 kronor per år i värdeminskning de senaste tio åren. Det är
        billigare än parkeringsavgiften på Söder.
      </p>

      <p>
        Därifrån stiger kurvan stadigt. En 2008:a landar kring 45 000. En
        2010:a kostar runt 60 000 &mdash; fortfarande generation sex, den som
        många anser vara den bästa Golf som någonsin byggts, med sin breda
        spårvidd och sofistikerade chassi. Runt 2012&ndash;2013 passerar vi
        100 000-strecket, och här börjar det hända intressanta saker.
      </p>

      <p>
        Generation sju introducerades 2013, och på begagnatmarknaden syns
        generationsbytet som en tydlig trappstegseffekt. En sen Golf 6 från
        2012 kostar märkbart mindre än en tidig Golf 7 från 2013, trots att
        bilarna bara skiljer ett år i ålder. Det är ett mönster vi ser på
        nästan alla modeller i vår data, men få gånger så tydligt som här.
      </p>

      <h2>Prisplatån 2017&ndash;2019: Tre år, nästan noll värdeminskning</h2>

      <p>
        Det mest fascinerande i hela Golf-datasetet dyker upp mitt i
        priskurvan. Mellan årsmodell 2017 och 2019 planar priserna ut nästan
        helt:
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Prisplatån 2017&ndash;2019
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">2017 (medianpris)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              167 000 kr
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">2018 (medianpris)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              171 000 kr
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">2019 (medianpris)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              172 000 kr
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Skillnad 2017 vs 2019</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              +5 000 kr
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Årlig depreciering</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              ~2 500 kr
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Procentuellt per år</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              ~1,5 %
            </div>
          </div>
        </div>
      </div>

      <p>
        Tre årsmodeller, fem tusen kronors skillnad. Det är en årlig
        depreciering på ungefär 1,5 procent &mdash; att jämföra med de
        10&ndash;15 procent som är normalt för bilar i den åldern.
      </p>

      <p>
        Varför? Det finns flera förklaringar som samverkar. Årsmodellerna
        2017&ndash;2019 representerar den sista fasen av Golf 7.5 &mdash; den
        uppdaterade versionen av generation sju som fick nytt infotainment,
        uppdaterat chassi och en mild ansiktslyftning. Det var i praktiken en
        färdigutvecklad bil utan barnsjukdomar. Samtidigt visste marknaden att
        Golf 8 var på väg, vilket trycker ner priserna på den utgående
        modellen. Resultatet är en sweet spot: en bil som alla vill ha, men som
        ingen betalar generationspremium för.
      </p>

      <p>
        För den som letar efter en Golf är det här den mest intressanta zonen.
        Du betalar i princip samma pris oavsett om du väljer en 2017, 2018
        eller 2019, men du får en nyare bil med lägre miltal. Att välja en
        2019:a framför en 2017:a kostar knappt något extra men ger dig två
        års färskare teknik och i snitt 3 mil lägre miltal.
      </p>

      <h2>Golf 8 (2020+): Generationspremien</h2>

      <p>
        Från den platta platån vid 172 000 kronor hoppar medianpriset till
        195 000 för en 2020:a. Det är ett steg på 23 000 kronor &mdash;
        eller 13 procent &mdash; för ett enda årsmodellsteg. Golf 8 hade
        anlänt.
      </p>

      <p>
        Generationsbytet till Golf 8 var kontroversiellt. Det nya
        infotainmentsystemet fick massiv kritik, de fysiska knapparna
        försvann, och kvalitetskänslan var enligt många testkörare sämre än
        föregångaren. Trots det betalar begagnatmarknaden en tydlig premie.
        Och den premien växer med åren: en 2021:a kostar runt 220 000, en
        2022:a ungefär 245 000, och en 2023:a landar kring 285 000.
      </p>

      <p>
        Det är en deprecieringstakt på ungefär 20 000 kronor per år för de
        nyaste Golf 8-bilarna &mdash; snabbare än platån, men långsammare
        än snittet för hela datasettet. Golf 8 faller alltså i värde, men
        den faller kontrollerat. Och den faller från en högre utgångspunkt
        än Golf 7 någonsin gjorde.
      </p>

      <p>
        Den som köper en Golf 8 från 2020 idag &mdash; sex år gammal,
        troligen runt 8&ndash;10 mil &mdash; betalar den minsta premien
        för den nya generationen. Det är bilen som har tagit den värsta
        smällen redan, men som fortfarande känns modern. Om du kan leva
        med pekskärmarna.
      </p>

      <h2>Drivlinorna: Bensinens dominans, dieselns fall, PHEV:s intåg</h2>

      <p>
        Golf är en av få bilar i vår data där alla tre traditionella
        drivlinor &mdash; bensin, diesel och laddhybrid &mdash; har
        tillräckligt med annonser för att analysera separat. Fördelningen
        berättar en historia om hur den svenska bilmarknaden har förändrats.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Drivlinor i detalj
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Bensin (antal)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              1 152 bilar
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Bensin (snittpris)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              176 000 kr
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Diesel (antal)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              362 bilar
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Diesel (snittpris)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              108 000 kr
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">PHEV (antal)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              114 bilar
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">PHEV (snittpris)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              232 000 kr
            </div>
          </div>
        </div>
      </div>

      <p>
        Bensin dominerar med nästan två tredjedelar av alla annonser. Det
        är inte förvånande &mdash; Golf har alltid varit en bensinbil i
        grunden, och TSI-motorerna (1.0, 1.4 och 1.5) har varit de
        självklara valen för privatköpare. Snittpriset på 176 000 kronor
        speglar att bensinbilar finns i alla åldrar, från äldsta till
        nyaste.
      </p>

      <p>
        Diesel berättar en annan historia. Med bara 362 annonser och ett
        snittpris på 108 000 kronor är det tydligt att diesel-Golf i
        huvudsak är äldre bilar. TDI-motorerna var populära under Golf 6-
        och tidiga Golf 7-eran, men har i princip försvunnit från
        nybilsförsäljningen. Resultatet är ett snedvridet genomsnittspris:
        det finns helt enkelt inga nya diesel-Golfare att dra upp snittet.
        För den som letar efter en billig Golf med låg förbrukning och
        långkörningsegenskaper är en diesel från 2014&ndash;2016 dock
        fortfarande ett utmärkt val, ofta till under 120 000 kronor.
      </p>

      <p>
        Golf GTE &mdash; laddhybriden &mdash; är den minsta gruppen med
        114 annonser, men den mest koncentrerade. Nästan alla GTE:er
        är från 2017 och framåt, och snittpriset på 232 000 kronor
        speglar det. Det är den dyraste drivlinan, men också den som
        tappar snabbast i procentuella termer. En GTE från 2017 kostar
        idag runt 160 000 &mdash; ungefär halva nybilspriset &mdash;
        medan en bensin-Golf från samma år kostar 167 000, trots att
        den var markant billigare som ny. Laddhybriden har alltså
        deprecierats förbi bensinmotorn. Det mönstret ser vi i
        princip på alla modeller i vår data: PHEV-bilar tappar mer i
        kronor, men det beror främst på att de startade högre.
      </p>

      <h2>GTI och R: Prestandapremien &mdash; värd det på begagnat?</h2>

      <p>
        Volkswagen Golf GTI och Golf R är inte bara snabbare versioner
        av samma bil &mdash; de är i praktiken separata bilar med egna
        priskurvor, egna köpare och egna värdeminskningslogiker. Och de
        följer inte alls samma mönster som vanliga Golf.
      </p>

      <p>
        Golf GTI kostar som ny runt 500 000 kronor. På begagnatmarknaden
        hittar vi GTI:er från 2015 för omkring 180 000 &mdash; en tioårig
        bil som fortfarande kostar mer än en vanlig Golf från 2019. Det är
        en premie på i storleksordningen 30&ndash;50 000 kronor beroende
        på årsmodell, och den premien är remarkabelt stabil. En GTI tappar
        ungefär lika många kronor per år som en vanlig Golf, men eftersom
        utgångspriset är högre blir den procentuella deprecieringen lägre.
        Du betalar mer, men du förlorar inte mer.
      </p>

      <p>
        Golf R tar detta ett steg längre. Med fyrhjulsdrift, 300+ hästkrafter
        och ett nybilspris kring 600 000 kronor representerar den toppen av
        Golf-hierarkin. Och begagnatmarknaden respekterar det: en fem år gammal
        Golf R kostar typiskt 350 000&ndash;400 000 kronor. Det är bilar som
        har behållit 60&ndash;65 procent av nybilspriset efter fem år, att
        jämföra med 45&ndash;50 procent för en vanlig Golf i samma ålder.
      </p>

      <p>
        Anledningen är enkel: utbudet är begränsat. Det säljs ungefär tio
        vanliga Golf för varje Golf R, och efterfrågan bland entusiaster är
        konstant. Det skapar ett prisunderstöd som vanliga Golfare inte har.
        Dessutom tenderar R-ägare att vara mer noggranna med service och
        underhåll, vilket ger bättre bilar på andrahandsmarknaden.
      </p>

      <p>
        Är det värt premien? Det beror på perspektivet. Om du ser bilen som
        ren transport är svaret nej &mdash; du betalar 50&ndash;100 procent
        mer för en bil som i grunden är samma plattform. Men om du ser det
        som investering i körupplevelse, och väger in det starkare
        restvärdet, blir kalkylen intressantare. En Golf R som kostar
        380 000 kronor idag och säljs för 300 000 om tre år har kostat dig
        ungefär 27 000 kronor per år i värdeminskning. En vanlig Golf för
        200 000 som sjunker till 140 000 kostar 20 000 per år. Skillnaden i
        faktisk ägandekostnad är alltså bara 7 000 kronor per år &mdash;
        eller 600 kronor i månaden &mdash; för en dramatiskt bättre bil.
      </p>

      <h2>Sweet spots: Bästa Golfen för varje budget</h2>

      <p>
        Vår data pekar ut tre tydliga sweet spots beroende på budget och
        behov. De bygger på kombinationen av pris, förväntad framtida
        värdeminskning, och var i livscykeln bilen befinner sig.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Sweet spots per budget
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Budget: 60&ndash;80 000 kr</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              Golf 6 (2010&ndash;2012)
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Budget: 160&ndash;175 000 kr</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              Golf 7.5 (2017&ndash;2019)
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Budget: 190&ndash;220 000 kr</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              Golf 8 (2020&ndash;2021)
            </div>
          </div>
        </div>
      </div>

      <p>
        <strong>Budget 60&ndash;80 000 kronor: Golf 6, 2010&ndash;2012.</strong>{" "}
        Det här är den bortglömda generationen &mdash; och därmed den
        undervärderade. Golf 6 hade den kanske bästa balansen mellan
        köregenskaper och byggkvalitet i Golf-historien, och den är
        tillräckligt gammal för att deprecieringen har planat ut. Du
        förlorar knappt något per år, och reservdelarna är billiga.
        Undvik tidiga 1.4 TSI-motorer (twincharger) som kan ha
        kamkedjeproblematik &mdash; välj helst 1.6 TDI eller 1.2 TSI
        från 2011&ndash;2012.
      </p>

      <p>
        <strong>Budget 160&ndash;175 000 kronor: Golf 7.5, 2017&ndash;2019.</strong>{" "}
        Prisplatån gör det här till det mest kostnadseffektiva Golf-köpet
        som existerar. Välj en 2019:a om du hittar en &mdash; du betalar
        marginellt mer men får en bil som bara är sju år gammal med moderna
        säkerhetssystem, Apple CarPlay och en beprövad drivlina.
        Årskostnaden i värdeminskning ligger kring 10 000&ndash;15 000
        kronor, och den kommer att krympa ytterligare de kommande åren
        när bilen når sin plana fas.
      </p>

      <p>
        <strong>Budget 190&ndash;220 000 kronor: Golf 8, 2020&ndash;2021.</strong>{" "}
        Är du beredd att sträcka dig lite har du den senaste generationen.
        En 2020:a för 195 000 har redan tagit den största
        deprecieringssmällen och känns fortfarande som en ny bil.
        Infotainmentsystemet har dessutom förbättrats med
        mjukvaruuppdateringar sedan lanseringen. Risken är att Golf 8.5
        eller Golf 9 annonseras inom kort och trycker ner värdena på tidiga
        Golf 8, men historiskt har generationsbyten på Golf haft en
        begränsad effekt på den utgående generationens pris.
      </p>

      <h2>Varför 92,4 % R² trots 20 årsmodeller?</h2>

      <p>
        Vår regressionsmodell förklarar 92,4 procent av prisvariationen i
        Golf-datasetet. Det är en anmärkningsvärt hög siffra med tanke på
        att vi spänner över 20+ årsmodeller, tre generationer, fyra
        drivlinor och allt från 150-hästars GTI:er till 85-hästars
        bensinsparare.
      </p>

      <p>
        Förklaringen ligger i att Golf är extremt standardiserad. Till
        skillnad från exempelvis BMW X3 &mdash; där utrustningsnivåer,
        motoralternativ och tillval skapar enorm spridning &mdash; är Golf
        en relativt homogen bil. De flesta köpare väljer mellannivåns
        utrustning, standardmotorn och knappt några tillval. Det gör att
        ålder, miltal och drivlina förklarar nästan allt. Det är därför vi
        kan rita priskurvan med sådan precision.
      </p>

      <p>
        De resterande 7,6 procenten av variationen fångar saker som
        vår modell inte ser: enskilda utrustningspaket (R-line exteriör,
        panoramatak), regionala prisskillnader, och ren prisoptimism
        hos säljare som tror att deras bil är speciell. I de allra
        flesta fall är den inte det. En Golf är en Golf &mdash; och det
        är precis det som gör den så lättanalyserad.
      </p>

      <h2>Sammanfattning: Folkbilen som avslöjar marknaden</h2>

      <p>
        Volkswagen Golf är inte den mest spännande bilen i vår databas.
        Den har varken Tesla Model Y:s polariserande priskurva eller
        Land Cruisers legendariska värdestabilitet. Men den är den mest
        lärorika.
      </p>

      <p>
        Med 1 774 annonser och 20 årsmodeller fungerar Golf som ett
        slags facit för hur den svenska begagnatmarknaden prissätter bilar.
        Prisplatån 2017&ndash;2019 visar att slutet av en generation kan
        vara det smartaste köpet. Generationshoppet 2020 visar att ny
        teknik kostar, oavsett om den är bättre eller sämre. Och
        GTI/R-premien visar att entusiastbilar lever efter egna regler.
      </p>

      <p>
        Oavsett om du letar efter en stadsbil för 60 000 eller en
        fyrhjulsdriven prestandabil för 400 000 finns det en Golf som
        passar. Och med vår data kan du se exakt vad den borde kosta.
      </p>
    </>
  );
}
