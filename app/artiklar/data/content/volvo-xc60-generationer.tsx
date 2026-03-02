export default function VolvoXC60Generationer() {
  return (
    <>
      <p>
        Det finns ett enda modellår i hela den svenska begagnatmarknaden som skapar en
        prisskillnad på 100 000 kronor. Inte tio tusen, inte trettio tusen &mdash;
        hundratusen. Det är språnget mellan en Volvo XC60 årsmodell 2017 och en 2018.
        Samma namn, samma emblem, samma parkeringsplats utanför Willys. Men en
        genomsnittskostnad som hoppar från 203 000 till 304 000 kronor &mdash; en
        ökning på nästan 50 procent för ett enda modellår. Det är den skarpaste
        prisklyftan i hela vår databas, och den berättar något fundamentalt om hur
        den svenska begagnatmarknaden värderar bilar.
      </p>

      <p>
        Förklaringen stavas generationsbyte. Volvo lanserade den andra generationen
        XC60 (internt kallad SPA, Scalable Product Architecture) som 2018-modell.
        Den delade ingenting med föregångaren utom namnet. Ny plattform, ny design,
        ny teknik, nytt säkerhetssystem &mdash; och framförallt en helt ny känsla
        bakom ratten. Marknaden vet detta. Och marknaden prissätter det med kirurgisk
        precision.
      </p>

      <p>
        Vi har analyserat 2 062 XC60-annonser på Blocket &mdash; 597 stycken
        generation 1 och 1 465 generation 2. Det gör XC60 till den mest omsatta
        premium-SUV:en i Sverige, och det ger oss ett ovanligt rikt dataunderlag
        för att förstå exakt vad generationsbytet gör med priserna.
      </p>

      <h2>Siffrorna: Två generationer, två helt olika bilar</h2>

      <p>
        Låt oss börja med den breda bilden. Generation 1 (2009&ndash;2017) säljs
        för i snitt 151 000 kronor. Bilarna är i genomsnitt 12 år gamla, har rullat
        långt och representerar en tid då XC60 var Volvos mittenmodell med
        femcylindrig turbo och en interiör som redan kändes daterad när den var ny.
        Generation 2 (2018&ndash;) säljs för i snitt 407 000 kronor. Bilarna är i
        genomsnitt 4,4 år gamla, domineras av laddhybrider och erbjuder en
        förarupplevelse som ligger närmare en tysk premiumbil än en traditionell Volvo.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Generation 1 vs Generation 2
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Gen 1 &mdash; antal annonser</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">597 st</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Gen 2 &mdash; antal annonser</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">1 465 st</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Gen 1 &mdash; snittpris</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">151 000 kr</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Gen 2 &mdash; snittpris</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">407 000 kr</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Gen 1 &mdash; snittålder</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">12 år</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Gen 2 &mdash; snittålder</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">4,4 år</div>
          </div>
        </div>
      </div>

      <p>
        Skillnaden på 256 000 kronor i snittpris beror förstås delvis på att
        generation 2 är nyare. Men vår regressionsmodell &mdash; som kontrollerar
        för ålder, miltal, bränsletyp, hästkrafter och utrusning &mdash; visar
        att generationsbytet i sig förklarar en stor del av prisskillnaden. Modellens
        R&sup2; på 95,6 procent innebär att vi kan förklara nästan all prisvariation,
        och generation är en statistiskt signifikant variabel även efter att vi
        rensat bort ålderseffekten.
      </p>

      <p>
        Översatt till klartext: det handlar inte bara om att 2018-bilar är nyare.
        Marknaden betalar en premie specifikt för att det är generation 2.
      </p>

      <h2>Prisklyftan: 203 000 till 304 000 på ett enda år</h2>

      <p>
        Det mest slående i datan är vad som händer exakt vid gränsen. En XC60
        årsmodell 2017 &mdash; den sista generation 1 &mdash; säljs för i genomsnitt
        203 000 kronor. En årsmodell 2018, den första generation 2, kostar 304 000
        kronor. Det är en skillnad på 101 000 kronor, eller drygt 50 procent, för
        ett modellår.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Prisklyftan i siffror
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Årsmodell 2017 (sista gen 1)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">203 000 kr</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Årsmodell 2018 (första gen 2)</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">304 000 kr</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Prisskillnad</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">+101 000 kr</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Procentuell ökning</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">~50%</div>
          </div>
        </div>
      </div>

      <p>
        Jämför det med hur priskurvan normalt ser ut. Mellan 2016 och 2017 sjunker
        priset med kanske 15&ndash;20 tusen kronor &mdash; en helt normal
        värdeminskningskurva. Mellan 2015 och 2016 likaså. Kurvan är jämn, förutsägbar,
        nästan tråkig i sin regelbundenhet. Och sedan, vid 2017&ndash;2018, bryter
        den fullständigt. Det ser ut som ett trappsteg i datan &mdash; och det är
        precis vad det är.
      </p>

      <p>
        Det här är inte unikt för generationsbyten i sig. Toyota RAV4 visar
        liknande mönster vid sina generationsbyten. Men inget annat modellbyte
        i vår data skapar en lika skarp och stor prisklyfta som XC60. Det beror
        på att skillnaden mellan generation 1 och 2 är ovanligt dramatisk.
      </p>

      <h2>Vad du faktiskt får för pengarna</h2>

      <p>
        Prisklyftan är inte irrationell. Den speglar genuina skillnader i produkt.
        Generation 1 var i grunden en vidareutveckling av Volvos gamla P3-plattform,
        delad med Ford. Den erbjöd Volvos femcylindriga motorer (T5, T6, D4, D5),
        en interiör som såg ut som 2008 (för det var den) och säkerhetssystem som
        var banbrytande när bilen lanserades men som nu överträffas av nästan alla
        konkurrenter.
      </p>

      <p>
        Generation 2 byggdes på Volvos egna SPA-plattform. Den fick det vertikala
        pekskärmsgränssnittet Sensus (och senare Google Built-In), den stora
        Bowers &amp; Wilkins-ljudanläggningen som tillval, Pilot Assist med
        adaptiv farthållare och filhållning, 360-graders kamera, och en interiör
        som &mdash; när den lanserades &mdash; var bland de bästa i klassen. Dessutom
        blev T8 Twin Engine, Volvos laddhybrid, standardvalet för många köpare.
      </p>

      <p>
        Listan kan göras lång, men poängen är enkel: det är i praktiken två
        helt olika bilar som råkar heta samma sak. Att den svenska begagnatmarknaden
        prissätter dem därefter är logiskt. Det intressanta är <em>hur mycket</em>{" "}
        marknaden värderar skillnaden.
      </p>

      <h2>Bränsleskiftet: Varför generation 2 domineras av PHEV</h2>

      <p>
        En av de mest anmärkningsvärda upptäckterna i datan handlar inte om pris
        utan om drivlina. Av de 1 465 generation 2-annonserna är 926 stycken &mdash;
        alltså 63 procent &mdash; laddhybrider. Det gör PHEV till den överlägset
        dominerande drivlinan i moderna XC60. Snittkostnaden för dessa
        PHEV-exemplar landar på 460 000 kronor.
      </p>

      <p>
        Jämför det med generation 1, där diesel dominerar fullständigt. D4 och
        D5 utgör majoriteten av utbudet, till ett genomsnittspris kring 209 000
        kronor. Det är inte bara ett generationsbyte &mdash; det är ett komplett
        skifte i vad en Volvo XC60 <em>är</em>.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Drivlineskiftet
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">PHEV-andel gen 2</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">63% (926 av 1 465)</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">PHEV snittpris</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">460 000 kr</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Dominerande drivlina gen 1</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Diesel (D4/D5)</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Diesel gen 1 snittpris</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">209 000 kr</div>
          </div>
        </div>
      </div>

      <p>
        PHEV-dominansen beror på flera faktorer. Förmånsvärdet för laddhybrider
        var extremt gynnsamt under åren 2018&ndash;2022, vilket gjorde T8 till det
        naturliga valet för tjänstebilsköpare. Och XC60 är en utpräglad
        tjänstebil &mdash; en stor del av det begagnade utbudet kommer från
        leasingreturer. Det innebär att begagnatmarknaden för generation 2
        i praktiken är en PHEV-marknad.
      </p>

      <p>
        Det har konsekvenser för köparen. PHEV-versionen T8 erbjuder fyra
        drivlinor (el, hybrid, bensin, AWD), runt 390&ndash;455 hästkrafter
        beroende på årsmodell, och en elektrisk räckvidd på 40&ndash;80 km. Men
        den kräver också att du har laddningsmöjlighet. Utan regelbunden laddning
        blir T8 en tung och törstig bensinbil med ett batteri som bara tar plats.
      </p>

      <p>
        För dig som inte kan ladda hemma, eller inte vill ha komplexiteten i en
        PHEV-drivlina, finns det fortfarande B5-varianter (mild hybrid bensin)
        i generation 2. De är färre till antalet men erbjuder en enklare ägandebild
        &mdash; och ofta lägre priser just eftersom PHEV dominerar efterfrågan.
      </p>

      <h2>Var finns sweet spots? Bästa värdet per generation</h2>

      <p>
        Nu till den intressanta frågan: var i priskurvan får du mest bil för pengarna?
      </p>

      <h3>Generation 1: Under 150 000 kr</h3>

      <p>
        Om du kan acceptera en bil som är 10&ndash;14 år gammal erbjuder generation 1
        genuint mycket bil för pengarna. En XC60 D5 AWD från 2013&ndash;2015 kostar
        typiskt 120 000&ndash;170 000 kronor med 12&ndash;18 000 mil på mätaren. Det
        är en rymlig, bekväm och säker bil som fortfarande håller bra på motorvägen.
        Femcylinderljudet är en bonus som generation 2 aldrig kan matcha.
      </p>

      <p>
        Riskerna är uppenbara: servicekostnaderna stiger med åldern, Volvos
        automatväxellåda (Aisin) kan bli dyr att reparera, och vissa
        turbomodeller har kända oljeproblem. Men om du letar efter en stor,
        bekväm SUV som transportmedel &mdash; inte som statusmarkör &mdash; är
        det svårt att slå generation 1 ur ett kostnadsperspektiv.
      </p>

      <h3>Generation 2: 2019&ndash;2020, under 350 000 kr</h3>

      <p>
        De första årsmodellerna av generation 2 (2018) har tappat tillräckligt
        i värde för att hamna under 300 000 kronor i många fall. Men de riktiga
        sweet spot-bilarna är årsmodell 2019&ndash;2020. Vid den tidpunkten hade
        Volvo löst de flesta barnsjukdomarna i SPA-plattformen, uppdaterat
        infotainmentsystemet och justerat fjädringen. En 2019&ndash;2020 T8 med
        6 000&ndash;10 000 mil kostar typiskt 300 000&ndash;380 000 kronor.
      </p>

      <p>
        Det är fortfarande mycket pengar. Men jämfört med en ny XC60 som startar
        på 650 000 kronor (och snabbt klättrar över 750 000 med tillval) är det
        en väsentlig besparing. Och värdeminskningskurvan planar ut kring 4&ndash;5
        års ålder, vilket innebär att du tappar mindre per år framöver.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Sweet spots
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Gen 1 sweet spot</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">2013&ndash;2015 D5 AWD</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Gen 1 prisintervall</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">120&ndash;170 000 kr</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Gen 2 sweet spot</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">2019&ndash;2020 T8</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Gen 2 prisintervall</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">300&ndash;380 000 kr</div>
          </div>
        </div>
      </div>

      <h2>Regressionsmodellen: Vad prisskillnaden egentligen beror på</h2>

      <p>
        En invändning man ofta hör är att prisskillnaden &quot;bara beror på
        åldern&quot;. Det stämmer delvis &mdash; ålder är den enskilt viktigaste
        faktorn för begagnatpriser. Men vår regressionsmodell gör det möjligt att
        separera effekterna.
      </p>

      <p>
        Modellen kontrollerar för ålder, miltal, bränsletyp, hästkrafter,
        utrustningsnivå, säljartyp (handlare vs privat) och interaktionseffekter
        mellan bränsle och ålder. Med ett R&sup2; på 95,6 procent förklarar den
        nästan all prisvariation i XC60-data. Och generation &mdash; representerad
        genom årsmodellens effekt utöver den linjära ålderseffekten &mdash; är
        statistiskt signifikant.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Modellprecision
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">R&sup2;</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">95,6%</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Antal annonser</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">2 062</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Generation signifikant?</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Ja, p &lt; 0,001</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Mest omsatta premium-SUV</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">XC60 (i Sverige)</div>
          </div>
        </div>
      </div>

      <p>
        Det innebär i praktiken att om du jämför en hypotetisk generation 1 och
        generation 2 med <em>samma</em> ålder, <em>samma</em> miltal och{" "}
        <em>samma</em> motorstyrka, skulle generation 2 fortfarande vara värd
        avsevärt mer. Marknaden betalar alltså inte bara för att bilen är nyare
        &mdash; den betalar för vad bilen <em>är</em>.
      </p>

      <h2>Årsmodell 2017: Den mest missförstådda XC60:n</h2>

      <p>
        Här finns en intressant spänning. Årsmodell 2017, den sista generation 1,
        är i många avseenden en fullt kapabel bil. Volvo hade vid det laget
        finslipat den under åtta år. De vanligaste problemen var åtgärdade,
        tillförlitligheten var väldokumenterad och reservdelarna billiga. En 2017
        D4 med Summum-utrustning erbjuder skinninteriör, navigation, bra ljud
        och en beprövad drivlina.
      </p>

      <p>
        Men marknaden straffar den hårt just för att den befinner sig på
        &quot;fel sida&quot; av generationsbytet. En 2017 till 203 000 kr kontra
        en 2018 till 304 000 kr &mdash; det är ett år i ålder men hundratusen
        kronor i skillnad. Frågan är om den skillnaden motsvarar hundratusen
        kronor i faktiskt mervärde för dig som köpare.
      </p>

      <p>
        Svaret beror på dina prioriteringar. Om du vill ha det senaste
        säkerhetssystemet, en stor pekskärm, laddhybridteknik och en modern
        interiör &mdash; ja, då är generation 2 värd premien. Men om du
        primärt behöver en rymlig, pålitlig SUV för pendling och
        familjelogistik, och kan tänka dig att leva med en äldre
        interiördesign och analoga mätare, då representerar den sista
        generation 1 ett av de bästa köpen i hela premium-SUV-segmentet.
      </p>

      <h2>Framtidsutsikter: Var är priserna på väg?</h2>

      <p>
        Generation 1 närmar sig botten av sin värdeminskningskurva. Bilar under
        100 000 kronor dyker redan upp för de äldsta årsmodellerna
        (2009&ndash;2011), och inom ett par år kommer även 2012&ndash;2014 att
        hamna där. Det innebär att den som köper en generation 1 idag kan
        förvänta sig relativt liten ytterligare värdeminskning i kronor &mdash;
        du förlorar kanske 10&ndash;15 000 per år istället för de
        60&ndash;80 000 som drabbar en nyare generation 2.
      </p>

      <p>
        Generation 2 befinner sig mitt i sin brantaste värdeminskningsfas.
        T8-modeller som kostade 750 000&ndash;900 000 nya säljs nu för
        300 000&ndash;450 000 kronor efter 4&ndash;6 år. Men kurvan planar ut.
        Vår modell visar att värdeminskningshastigheten avtar markant efter
        5 års ålder. Det gör 2019&ndash;2020-modeller till de bästa kandidaterna
        om du vill minimera framtida förluster.
      </p>

      <p>
        En osäkerhetsfaktor är batterihälsan i T8-modellerna. Laddhybrider är
        fortfarande relativt nya på begagnatmarknaden, och det finns inte
        tillräckligt med långtidsdata för att veta hur väl batterierna åldras
        efter 8&ndash;10 år. Det är en risk som marknaden ännu inte har
        prissatt fullt ut &mdash; och den kan påverka framtida priser i
        båda riktningarna.
      </p>

      <h2>Slutsats: Vilket köp ska du göra?</h2>

      <p>
        XC60:s generationsbyte är ett skolboksexempel på hur den svenska
        begagnatmarknaden fungerar. Priset drivs inte bara av ålder och miltal
        &mdash; det drivs av vad bilen faktiskt erbjuder. Och skillnaden
        mellan generation 1 och 2 är stor nog att motivera ett prishopp på
        50 procent för ett enda modellår.
      </p>

      <p>
        För budgetköparen (under 200 000 kr) är generation 1 svårslagen. En
        2014&ndash;2015 D5 AWD med Summum-utrustning ger en stor, bekväm och
        säker SUV till ett pris som konkurrerar med betydligt enklare bilar.
        Värdeminskningsrisken är minimal och driftkostnaderna förutsägbara.
      </p>

      <p>
        För den som kan sträcka sig till 300 000&ndash;400 000 kr öppnar sig en
        helt annan värld. En 2019&ndash;2020 T8 med laddmöjlighet erbjuder en
        av de mest kompletta bilarna i segmentet: fyrhjulsdrift, 400+
        hästkrafter, tyst stadskörning på el, Pilot Assist på motorvägen och
        en interiör som fortfarande känns relevant. Att den kostar hälften av
        vad den gjorde ny gör den inte till ett billigt köp &mdash; men det gör
        den till ett smart ett.
      </p>

      <p>
        Det enda misstaget är att inte vara medveten om klyftan. Om du letar
        efter en XC60 och hamnar vid gränsen mellan en dyr 2017 och en billig
        2018, vet du nu varför priserna ser ut som de gör. Det är inte en
        bugg i marknaden. Det är en feature.
      </p>
    </>
  );
}
