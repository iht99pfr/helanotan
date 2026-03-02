export default function Handlarpremie() {
  return (
    <>
      <p>
        Frågan dyker upp varje gång någon ska köpa begagnad bil: ska jag köpa av
        handlare eller privat? Den konventionella visdomen säger att handlare tar
        ett rejält påslag — men hur stort är det egentligen? Vi har gått igenom
        drygt 10 000 annonser på Blocket för att ta reda på det. Resultaten
        sträcker sig från 0 procent för Tesla Model Y till nästan 100 procent för
        VW Tiguan. Men som vi ska se är de rena siffrorna djupt vilseledande.
      </p>

      <h2>De rena siffrorna: modell för modell</h2>

      <p>
        Låt oss börja med det mest brutala sättet att mäta handlarpremien: ta
        medianpriset hos handlare, ta medianpriset vid privatförsäljning, och
        beräkna skillnaden. Ingen justering för ålder, miltal eller utrustning —
        bara rena prisskillnader.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Rå handlarpremie — medianpris handlare vs privat
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">VW Tiguan</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              279 000 vs 141 000 kr (+98%)
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">BMW X3</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              340 000 vs 171 000 kr (+99%)
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Toyota RAV4</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              308 000 vs 171 000 kr (+80%)
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Volvo XC60</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              341 000 vs 209 000 kr (+63%)
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Kia Niro</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              271 000 vs 180 000 kr (+51%)
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Tesla Model Y</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              382 000 vs 382 000 kr (0%)
            </div>
          </div>
        </div>
      </div>

      <p>
        Siffrorna är slående. En Tiguan hos handlare kostar i median nästan
        dubbelt så mycket som en privatannonserad. BMW X3 visar samma mönster.
        Och så finns det Tesla Model Y, där handlar- och privatpris är identiska
        — ned till sista tusenlappen. Men innan du ringer din kompis och ber om
        hjälp att hitta en privat Tiguan bör du läsa vidare. De här siffrorna
        ljuger.
      </p>

      <h2>Varför de rena siffrorna är vilseledande</h2>

      <p>
        Det grundläggande problemet med jämförelsen ovan är att handlare och
        privatpersoner inte säljer samma bilar. Handlare säljer i genomsnitt
        nyare bilar med lägre miltal och bättre utrustning. Privatpersoner säljer
        oftare äldre bilar som de själva kört i många år. Att jämföra
        medianpriserna rakt av är som att jämföra priset på en tvåårig bil med en
        åttaårig bil och sedan klaga på att den nyare kostar mer.
      </p>

      <p>
        Det här syns tydligt i vår data. För de flesta modeller utgör
        handlarbilar 90 procent eller mer av alla annonser. Privatförsäljningar
        är sällsynta — och de som finns tenderar att vara äldre exemplar. En
        privatperson som ska sälja sin tre år gamla X3 leasing-retur gör det
        sällan på Blocket. Den bilen hamnar hos en handlare.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Andel handlarannonser per modell
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">BMW X3</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              93% handlare
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Volvo XC60</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              94% handlare
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">VW Tiguan</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              91% handlare
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Toyota RAV4</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              90% handlare
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Tesla Model Y</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              91% handlare
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Kia Niro</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              85% handlare
            </div>
          </div>
        </div>
      </div>

      <p>
        När 90+ procent av annonserna kommer från handlare innebär det att de
        privata försäljningarna utgör en liten och icke-representativ grupp. De
        tio procent av Tiguanarna som säljs privat kan vara tio år gamla dieslar
        med 25 000 mil, medan handlarbeståndet domineras av tre–fyra år gamla
        exemplar med under 8 000 mil. Att då jämföra medianen i de två grupperna
        och ropa &quot;98 procent påslag!&quot; är statistiskt nonsens.
      </p>

      <p>
        Det är samma misstag som att jämföra medelinkomsten på två arbetsplatser
        utan att kontrollera för tjänstebeteckning, erfarenhet och arbetstid.
        Siffran du får fram berättar mer om sammansättningen av grupperna än om
        den faktiska löneskillnaden.
      </p>

      <h2>Den regressionsanpassade premien</h2>

      <p>
        För att förstå den verkliga handlarpremien behöver vi kontrollera för de
        faktorer som skiljer bilarna åt. Vår regressionsmodell tar hänsyn till
        ålder, miltal, bränsletyp, hästkrafter, utrustningsnivå och drivlina.
        Den svarar på frågan: om en handlare och en privatperson säljer exakt
        samma bil — samma ålder, samma miltal, samma utrustning — hur mycket mer
        tar handlaren betalt?
      </p>

      <p>
        Svaret är överraskande: den regressionsanpassade handlarpremien är
        betydligt lägre än de rena siffrorna antyder. För de flesta modeller
        handlar det om 5–15 procent, inte 50–100 procent. En stor del av
        prisskillnaden förklaras av att handlare helt enkelt säljer nyare och
        bättre bilar.
      </p>

      <p>
        Det finns dock reella skillnader mellan modellerna. För premiumbilar som
        BMW X3 och Volvo XC60, där handlare ofta erbjuder certifierade
        begagnatprogram och utökade garantier, tenderar den justerade premien att
        vara något högre. För Tesla Model Y, där prissättningen är extrem
        transparent tack vare Teslas egna begagnatförsäljning och den starka
        marknadsstandarden, är premien i princip obefintlig.
      </p>

      <p>
        Tesla-fallet är fascinerande. Model Y har noll procent rå handlarpremie,
        och den regressionsjusterade premien bekräftar bilden. Anledningen är
        sannolikt en kombination av faktorer: Tesla sätter själva priset på
        begagnade bilar via sin webbplats, konfigurationerna är standardiserade
        (ingen bläddrar igenom tillvalslistan som på en Mercedes), och köparna är
        prismedvetna teknikentusiaster som jämför varje tusenlapp online. Det
        skapar en marknad där handlaren helt enkelt inte kan ta ut en premie.
      </p>

      <h2>Vad du faktiskt betalar för hos handlaren</h2>

      <p>
        Den naturliga följdfrågan är: om handlaren tar 5–15 procent mer för
        samma bil, vad får jag för de pengarna? Svaret varierar beroende på
        handlare, men det finns några konkreta värden som ingår.
      </p>

      <h3>Konsumentköplagen</h3>

      <p>
        Den viktigaste skillnaden är juridisk. När du köper av en handlare
        omfattas du av konsumentköplagen, som ger dig tre års reklamationsrätt
        på dolda fel. Under de första sex månaderna är bevisbördan omvänd —
        handlaren måste bevisa att felet inte fanns vid leverans. Vid privat köp
        gäller köplagen, som ger betydligt svagare skydd. Praktiskt sett är det
        nästan omöjligt att få ersättning för dolda fel vid privat köp om inte
        säljaren aktivt ljugit.
      </p>

      <h3>Garanti och service</h3>

      <p>
        Många handlare erbjuder 6–12 månaders garanti utöver den lagstadgade
        reklamationsrätten. Märkeshandlare med certifierade begagnatprogram (som
        Volvo Selekt eller BMW Premium Selection) går ännu längre med
        flerpunktsinspektion, historikkontroll och ibland upp till 24 månaders
        garanti. Det är svårt att sätta ett exakt kronvärde på detta, men en
        privat reparation av en automatväxellåda kan lätt kosta 50 000–80 000 kr.
        Den risken prissätts in i handlarpremien.
      </p>

      <h3>Finansiering och inbyte</h3>

      <p>
        Handlare erbjuder finansiering och tar emot inbyten, vilket förenklar
        transaktionen. Du slipper hantera Swish-överföringar på sexsiffriga
        belopp, okända köpare eller säljare, och den logistiska huvudvärken med
        att synkronisera betalning och ägarbyte. Bekvämligheten har ett värde,
        även om det är svårt att kvantifiera.
      </p>

      <h3>Besiktning och klargjorda bilar</h3>

      <p>
        En handlare som tar sitt rykte på allvar besiktigar bilen, åtgärdar
        uppenbara brister och levererar den nywashad med eventuella feljusteringar
        fixade. En privatperson säljer bilen i det skick den befinner sig — ibland
        utmärkt, ibland med en lista av &quot;småsaker som borde fixas.&quot; Skillnaden
        märks framför allt vid billigare bilar, där kostnaden för att åtgärda
        slitage kan utgöra en betydande del av köpesumman.
      </p>

      <h2>Modellspecifika mönster</h2>

      <p>
        Handlarpremien varierar inte bara i storlek utan också i karaktär
        beroende på modell. Här är vad vi ser i vår data:
      </p>

      <p>
        <strong>VW Tiguan och BMW X3</strong> har de högsta råa premierna (98–99
        procent), men det beror nästan helt på att privatbeståndet består av
        betydligt äldre bilar. Båda modellerna har starka begagnatprogram via
        märkeshandlare, vilket gör att nyare exemplar nästan uteslutande säljs
        via handlare. Den privatperson som säljer sin Tiguan gör det vanligtvis
        först efter 8–10 år, när bilen passerat den punkt där en handlare kan
        ta fullt pris.
      </p>

      <p>
        <strong>Toyota RAV4</strong> visar ett intressant mönster. Med 80
        procent rå premie och ett starkt Toyota-rykte om hållbarhet attraherar
        modellen köpare som litar på bilen oavsett säljare. Toyotas
        garantiprogram för begagnade bilar (Toyota Relax) förlänger
        fabriksgarantin upp till tio år, vilket gör handlarköpet mer attraktivt
        för nyare exemplar — men minskar premien jämfört med märken utan
        motsvarande program, eftersom köparen vet att grundkvaliteten är hög.
      </p>

      <p>
        <strong>Volvo XC60</strong> landar på 63 procent rå premie, lägre än
        Tiguan och X3 trots att det är en premiumbil. En förklaring är att XC60
        har en ovanligt stor andel privatförsäljare med relativt nya bilar —
        leasingreturer som säljs vidare av privatpersoner snarare än att gå
        tillbaka till handlaren. Det ger en mer rättvis jämförelsegrupp.
      </p>

      <p>
        <strong>Kia Niro</strong> med 51 procent rå premie har den lägsta premien
        bland de konventionella modellerna (Tesla undantaget). Niro är en relativt
        ny modell på begagnatmarknaden, och Kias sjuåriga garanti följer bilen
        oavsett om den säljs privat eller via handlare. Det minskar
        mervärdet av handlarköpet — garantin finns redan.
      </p>

      <p>
        <strong>Tesla Model Y</strong> är i en klass för sig med 0 procent
        premie. Som vi diskuterat beror det på marknadens transparens,
        standardiserade konfigurationer och en köpargrupp som aktivt jämför
        priser online. Det är också värt att notera att Tesla inte har ett
        traditionellt återförsäljarnätverk — de handlare som säljer begagnade
        Model Y är oberoende aktörer utan märkescertifiering, vilket gör det
        svårare att motivera en premie.
      </p>

      <h2>Räkneexempel: är handlarpremien värt det?</h2>

      <p>
        Låt oss ta ett konkret exempel. Säg att du hittar en Volvo XC60 2021 med
        6 000 mil. Handlaren vill ha 350 000 kr. En liknande bil finns privat
        för 315 000 kr — en skillnad på 35 000 kr, eller ungefär 10 procent
        (regressionsjusterat).
      </p>

      <p>
        Vad får du för de 35 000 kronorna? Tre års reklamationsrätt med omvänd
        bevisbörda, eventuellt 12 månaders garanti, en besiktigad och klargjord
        bil, och möjligheten att finansiera köpet. Värdet av enbart
        reklamationsrätten kan uppskattas genom att titta på vad en separat
        vagnskadegaranti kostar — typiskt 8 000–15 000 kr per år. Lägger du till
        tryggheten av att handla med ett företag som har skyldigheter under
        konsumentköplagen, börjar 35 000 kr framstå som rimligt.
      </p>

      <p>
        Men — och det här är viktigt — kalkylen ser helt annorlunda ut vid lägre
        prisklasser. Om handlarpremien på en äldre Golf är 15 000 kr och bilen
        kostar 80 000 kr, motsvarar det nästan 20 procent. På en bil i den
        prisklassen är sannolikheten för dyra motorfel lägre (de har redan
        inträffat och åtgärdats, eller så har bilen bevisat sin hållbarhet), och
        den absoluta risken du tar genom att köpa privat är mindre.
      </p>

      <h2>Praktiska råd: när ska du köpa privat?</h2>

      <p>
        Baserat på vår analys av tiotusentals annonser kan vi destillera några
        tumregler:
      </p>

      <p>
        <strong>Köp av handlare</strong> om bilen är relativt ny (under 5 år),
        kostar mer än 250 000 kr, och du inte har erfarenhet av att bedöma
        bilars skick. Handlarpremien på 5–15 procent köper dig juridiskt skydd
        som kan vara värt hundratusentals kronor om något går fel. Det gäller
        särskilt för premiumbilar med komplexa system — en automatväxellåda, ett
        luftfjädringssystem eller en stor batteripack kan kosta mer att reparera
        än hela premien.
      </p>

      <p>
        <strong>Köp privat</strong> om bilen är äldre (7+ år), kostar under
        150 000 kr, och du kan bedöma bilens skick själv eller ta med en kunnig
        vän. I den prisklassen äter handlarpremien procentuellt mycket av
        bilens värde, och den absoluta risken vid fel är hanterbar. Se till att
        kräva fullständig servicehistorik, kontrollera bilen hos en oberoende
        verkstad innan köp (kostar 1 500–3 000 kr), och verifiera att bilen inte
        har belåning eller andra hinder.
      </p>

      <p>
        <strong>Tesla Model Y</strong> är ett specialfall — det spelar ingen
        ekonomisk roll om du köper av handlare eller privat, eftersom premien är
        obefintlig. Välj det alternativ som erbjuder bäst bekvämlighet.
      </p>

      <p>
        <strong>Toyota och Kia</strong> med deras långa garantier (Toyota Relax
        upp till 10 år, Kia 7 år) minskar argumentet för handlarköp, särskilt om
        garantin fortfarande är aktiv oavsett säljartyp. Kontrollera alltid att
        garantin är överförbar och att serviceboken är komplett.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Tumregel: handlare vs privat
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Ny bil (&lt;5 år, &gt;250 tkr)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              Handlare — skyddet är värt premien
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Äldre bil (&gt;7 år, &lt;150 tkr)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              Privat — lägre risk, stor besparing
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Tesla Model Y</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              Spelar ingen roll — 0% premie
            </div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Toyota/Kia med garanti</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">
              Kontrollera garantivillkor — ofta privat OK
            </div>
          </div>
        </div>
      </div>

      <h2>Vad vår data inte fångar</h2>

      <p>
        Det finns begränsningar i analysen som är värda att nämna. Vår data
        kommer från Blocket, som är den dominerande plattformen men inte den
        enda. Bytbil, Wayke och handlarnas egna webbplatser fångas inte, och det
        är möjligt att prisbilden ser annorlunda ut där. Handlare som annonserar
        på Blocket kan ha andra prissättningsstrategier än de som primärt
        använder Bytbil.
      </p>

      <p>
        Vi kan inte heller kontrollera för bilens faktiska skick — kosmetiska
        brister, servicehistorikens fullständighet eller huruvida bilen varit i
        olycka. Det är sannolikt att handlarbilar i genomsnitt är i bättre skick
        eftersom handlaren åtgärdat uppenbara brister innan försäljning. Det
        innebär att den verkliga handlarpremien — för exakt samma bil i exakt
        samma skick — kan vara ännu lägre än vad vår regressionsmodell visar.
      </p>

      <p>
        Slutligen är det värt att komma ihåg att förhandlingsutrymmet skiljer
        sig. En handlare har ofta 5–10 procent marginal att ge i prisavdrag,
        medan en privatperson kan vara mer eller mindre flexibel beroende på hur
        bråttom de har att sälja. Den slutgiltiga premien bestäms inte bara av
        annonserat pris utan av din förhandlingsförmåga.
      </p>

      <h2>Sammanfattning</h2>

      <p>
        Handlarpremien på den svenska begagnatmarknaden är verklig men kraftigt
        överskattad av rena prisjämförelser. De rena siffrorna — 51 till 99
        procent beroende på modell — speglar främst att handlare säljer nyare
        bilar, inte att de tar hundra procent påslag. Den regressionsjusterade
        premien, som kontrollerar för ålder, miltal och utrustning, landar
        typiskt på 5–15 procent. I gengäld får du juridiskt skydd under
        konsumentköplagen, garanti, besiktning och bekvämlighet. Huruvida det
        är värt pengarna beror på bilens pris, din riskaptit och din förmåga
        att bedöma bilens skick på egen hand.
      </p>

      <p>
        Tesla Model Y sticker ut som det enda undantaget — en marknad så
        transparent att handlarpremien kollapsat till noll. Det är möjligen en
        föregångare för hur hela begagnatmarknaden kommer att se ut i
        framtiden, när prisdata blir alltmer tillgänglig och köpare kan jämföra
        varje bil med marknadspriset i realtid. Tills dess förblir
        handlarpremien en realitet — men en betydligt mindre dramatisk sådan
        än vad rubrikerna vill hävda.
      </p>
    </>
  );
}
