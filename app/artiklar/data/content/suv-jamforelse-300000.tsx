export default function SuvJamforelse300000() {
  return (
    <>
      <p>
        Trehundratusen kronor. Det är den magiska gränsen där begagnatmarknaden
        för SUV:ar verkligen öppnar sig. För den summan kan du köpa en nästan ny
        Volvo XC40 — eller en välutrustad BMW X3 som snart fyller tio. Du kan
        välja japansk pålitlighet, tyskt premiumchassi eller en Tesla som
        fortfarande har garantin kvar. Frågan är inte <em>om</em> du hittar
        någonting bra — utan vilken avvägning du är beredd att göra.
      </p>

      <p>
        Vi har analyserat tusentals Blocket-annonser med regressionsmodeller för
        att ta reda på exakt vad 300&nbsp;000&nbsp;kr räcker till i sju av
        Sveriges mest sålda SUV-modeller. Resultaten är talande: samma
        budgetpost ger dig bilar som skiljer sig med fem år i ålder, sju mil i
        körning och helt olika utsikter för framtida värdeminskning.
      </p>

      <h2>Spelplanen: Sju SUV:ar, en budget</h2>

      <p>
        Låt oss börja med överblicken. När vi filtrerar vår data kring
        prisintervallet 250&nbsp;000–350&nbsp;000&nbsp;kr och tar
        genomsnittet för varje modell får vi följande bild:
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Översikt: Vad 300 000 kr köper
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">XC40</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">329 tkr / 3,5 år / 6,8 mil</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">XC60</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">333 tkr / 6,6 år / 13,7 mil</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">BMW X3</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">325 tkr / 8,1 år / 13,4 mil</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">RAV4</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">300 tkr / 7,0 år / 11,6 mil</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Mercedes GLC</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">338 tkr / 7,2 år / 12,9 mil</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">VW Tiguan</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">270 tkr / 6,9 år / 11,8 mil</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Tesla Model Y</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">382 tkr / 3,3 år / &mdash;</div>
          </div>
        </div>
      </div>

      <p>
        Skillnaderna är dramatiska. För samma pengar kan du köpa en XC40 som är
        knappt fyra år gammal med under 70&nbsp;000 km på mätaren — eller en
        BMW X3 som är dubbelt så gammal med dubbelt så många mil. Båda är
        SUV:ar, båda kostar runt 300&nbsp;000&nbsp;kr, men det är två
        fundamentalt olika propositioner.
      </p>

      <h2>Volvo XC40 — Den unga och okomplicerade</h2>

      <p>
        XC40 är den yngsta bilen på listan, och det är ingen slump. Den har
        helt enkelt inte hunnit tappa lika mycket i värde som de andra.
        329&nbsp;000&nbsp;kr ger dig typiskt en 2022-modell med runt
        68&nbsp;000 km på klockan — troligen en T2 eller B3 mild hybrid i
        grundutförande med Volvos nya Android-baserade infotainmentsystem.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Volvo XC40 i siffror
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Snittpris</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">329 000 kr</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snittålder</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">3,5 år</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snittmil</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">6,8 mil (68 000 km)</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Typisk motor</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">B3/T2 mild hybrid</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Karossklass</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Kompakt-SUV</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Fördel</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Låg ålder, modern teknik</div>
          </div>
        </div>
      </div>

      <p>
        Fördelen är uppenbar: du får en bil som fortfarande känns ny. Garantin
        kan ha löpt ut, men servicekostnaderna är låga de första åren och du
        slipper oroa dig för åldersrelaterat slitage. Nackdelen är lika
        uppenbar: XC40 är den minsta bilen på listan. Bagageutrymmet är
        kompakt, baksätet är snålt för tre och motoralternativen i det här
        prissegmentet tenderar att vara de svagare varianterna.
      </p>

      <p>
        För den som prioriterar att köra en relativt ny bil och inte behöver
        maximalt utrymme är XC40 ett solitt val. Men äger du redan en och
        funderar på att sälja — var beredd på att värdet fortsätter nedåt
        ganska brant de kommande åren.
      </p>

      <h2>Volvo XC60 — Storsyskonets lockelse</h2>

      <p>
        Med XC60 kliver du upp en storlek och får märkbart mer bil för pengarna —
        men du betalar med högre ålder och fler mil. 333&nbsp;000&nbsp;kr ger
        dig typiskt en 2019-modell (generation 2) med runt 137&nbsp;000 km.
        Det är en välutrustad mellanklass-SUV med starkare motorer, rymligare
        interiör och ofta fyrhjulsdrift.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Volvo XC60 i siffror
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Snittpris</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">333 000 kr</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snittålder</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">6,6 år</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snittmil</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">13,7 mil (137 000 km)</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Typisk motor</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">D4/T5 AWD</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Karossklass</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Mellanklass-SUV</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Fördel</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Mest bil för pengarna</div>
          </div>
        </div>
      </div>

      <p>
        XC60 är för många den ultimata kompromissen i det här prissegmentet.
        Du får en bil som kostade någonstans kring 550&nbsp;000–650&nbsp;000&nbsp;kr
        ny — alltså en värdeminskning på nästan 50 procent. Det innebär att
        utrustningsnivån är hög: adaptiv farthållare, Pilot Assist,
        Harman&nbsp;Kardon-ljud och läderklädsel är vanliga i annonserna.
      </p>

      <p>
        Risken? Vid 13,7 mil och nästan sju års ålder börjar serviceräkningarna
        klättra. Bromsskivor, dämpare och eventuella automatlådefel är inte
        ovanliga. Och dieselexemplaren (som dominerar i den här
        åldersgruppen) får allt svårare att sälja vidare ju äldre de blir,
        med tanke på miljözonerna som breder ut sig i svenska städer.
      </p>

      <h2>BMW X3 — Premium som kostat, nu billigt</h2>

      <p>
        X3 är den äldsta bilen på listan i genomsnitt. 325&nbsp;000&nbsp;kr
        ger dig typiskt en 2017–2018-modell (G01-generationen) med drygt
        134&nbsp;000 km. Det är en bil som en gång kostade uppemot
        700&nbsp;000&nbsp;kr och som fortfarande känns premiummässigt — även
        efter åtta år.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          BMW X3 i siffror
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Snittpris</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">325 000 kr</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snittålder</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">8,1 år</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snittmil</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">13,4 mil (134 000 km)</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Typisk motor</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">xDrive20d/30d</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Karossklass</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Mellanklass-SUV</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Fördel</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Körglädje, premiumkänsla</div>
          </div>
        </div>
      </div>

      <p>
        X3 är den bil på listan som ger mest körglädje. BMW:s bakhjulsdrivna
        plattform (med xDrive lagt ovanpå) ger en körkaraktär som ingen av de
        andra matchat. Styrkänslan är precis, chassit är stramt men komfortabelt,
        och sexcylindermotorerna (30d/30i) är bland de bästa i klassen.
      </p>

      <p>
        Men åtta år gammal premiumteknik är också åtta år gammal premiumteknik
        som kan gå sönder. Timing-kedjan, oljeförluster och elektroniska
        glapp är kända svagheter på G01-generationen. Servicekostnaderna
        ligger typiskt 30–50 procent högre än för en Volvo i samma ålder.
        X3 är bilen för den som älskar att köra — och som har en buffert
        för när någonting behöver fixas.
      </p>

      <h2>Toyota RAV4 — Pålitlighetens pris</h2>

      <p>
        RAV4 är den enda bilen på listan där du kan tala om en riktig
        &quot;Toyota-premie&quot; på begagnatmarknaden. 300&nbsp;000&nbsp;kr ger
        dig typiskt en 2019-modell med 116&nbsp;000 km — och troligen en
        hybrid. Generation 5 RAV4 Hybrid är en av de mest efterfrågade
        begagnade bilarna i Sverige, och det syns i priserna.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Toyota RAV4 i siffror
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Snittpris</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">300 000 kr</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snittålder</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">7,0 år</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snittmil</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">11,6 mil (116 000 km)</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Typisk motor</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">2.5 Hybrid AWD-i</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Karossklass</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Mellanklass-SUV</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Fördel</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Driftsäkerhet, låga kostnader</div>
          </div>
        </div>
      </div>

      <p>
        Siffrorna berättar en intressant historia. RAV4 har 11,6 mil i snitt —
        märkbart lägre än XC60:s 13,7 eller X3:s 13,4. Det speglar delvis
        att Toyota-ägare tenderar att behålla sina bilar längre och köra dem
        mindre, men också att hybridtekniken lockar en annan typ av köpare.
      </p>

      <p>
        Den stora fördelen med RAV4 är förutsägbarheten. Toyotas hybridteknik
        är beprövad sedan Prius-eran, underhållskostnaderna är bland de lägsta
        i klassen, och bilen håller sitt värde ovanligt bra. Nackdelen?
        Interiörkvaliteten känns en generation efter Volvo och BMW. Plastytorna är
        hårda, infotainmentsystemet är trögt, och körkänslan är mer
        transportmedel än körglädje. Men för den som vill minimera risken
        är RAV4 det tryggaste valet.
      </p>

      <h2>Mercedes GLC — Stjärnan som fortfarande glänser</h2>

      <p>
        GLC är det dyraste alternativet i vår jämförelse — 338&nbsp;000&nbsp;kr
        i snitt — men det är också den bil som levererar den mest
        kompletta premiumkänslan. En typisk GLC för dessa pengar är en
        2018–2019 (X253-generationen) med 129&nbsp;000 km, troligen en
        220d eller 300d med 4MATIC.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Mercedes GLC i siffror
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Snittpris</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">338 000 kr</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snittålder</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">7,2 år</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snittmil</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">12,9 mil (129 000 km)</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Typisk motor</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">220d/300d 4MATIC</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Karossklass</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Mellanklass-SUV</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Fördel</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Interiörkvalitet, komfort</div>
          </div>
        </div>
      </div>

      <p>
        Mercedes gör interiörer som få andra. Ambientbelysning, MBUX-systemet
        (även i äldre version), och en generell materialkänsla som ligger
        ett steg över Volvo i den här generationen. GLC är också överraskande
        rymlig — bagageutrymmet är större än X3:s och jämbördigt med XC60.
      </p>

      <p>
        Svagheten är liknande som för BMW: serviceräkningarna för en sjuårig
        Mercedes är inte för den budgetmedvetne. Dessutom har dieselvarianterna
        (som dominerar i den här åldersklassen) drabbats av
        mjukvaruuppdateringar och utsläppsåterkallelser som kan påverka
        andrahandsvärdet negativt. Köp GLC om du vill ha den bästa interiören
        på listan — men budgetera för servicekostnader i X3-klassen.
      </p>

      <h2>VW Tiguan — Budgetvalet som överraskar</h2>

      <p>
        Tiguan är den billigaste bilen i jämförelsen, och det är därför den är
        intressant. 270&nbsp;000&nbsp;kr ger dig typiskt en 2019-modell med
        118&nbsp;000 km — en bil som är yngre och har färre mil än både
        X3 och GLC, till ett pris som är 55&nbsp;000–68&nbsp;000&nbsp;kr
        lägre.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          VW Tiguan i siffror
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Snittpris</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">270 000 kr</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snittålder</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">6,9 år</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snittmil</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">11,8 mil (118 000 km)</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Typisk motor</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">2.0 TDI/TSI DSG</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Karossklass</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Kompakt/Mellanklass-SUV</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Fördel</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Lägst pris, praktisk</div>
          </div>
        </div>
      </div>

      <p>
        Tiguan är Volkswagens mest sålda SUV globalt, och det finns en
        anledning till det: den är oproportionerligt praktisk för sin storlek.
        Bagageutrymmet är större än XC40:s (615 liter mot 460), baksätets
        benutrymme är generöst, och MQB-plattformen ger en rättfram
        körkänsla som aldrig föreställer sig vara någonting annat än den är.
      </p>

      <p>
        DSG-lådan (dubbelkopplingsväxellådan) är både Tiguans styrka och
        akilleshäl. Den är blixtsnabb i växlingarna, men kan kräva
        service eller byte vid högre miltal. Ersättningskostnaden är
        betydande. Bortsett från det är Tiguan den bil på listan som ger
        mest kvarvarande budget för service, försäkring och eventuella
        reparationer. För den prismedvetne är det ett starkt argument.
      </p>

      <h2>Tesla Model Y — Framtiden som kostar mer</h2>

      <p>
        Model Y är outlieren i jämförelsen. Med ett snittpris på
        382&nbsp;000&nbsp;kr ligger den nästan 30 procent över Tiguan och
        drygt 15 procent över det samlade genomsnittet. För de pengarna får
        du visserligen en bil som bara är 3,3 år gammal — den yngsta på
        listan — men till en premie som kräver förklaring.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Tesla Model Y i siffror
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Snittpris</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">382 000 kr</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snittålder</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">3,3 år</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snittmil</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">&mdash;</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Typisk motor</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Long Range / Standard</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Karossklass</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Mellanklass-SUV (elbil)</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Fördel</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Lägst driftskostnad, ung</div>
          </div>
        </div>
      </div>

      <p>
        Model Y är unik på flera sätt. Driftskostnaden är den lägsta i
        jämförelsen — ingen bensin, inget oljebyte, minimalt bromsslitage
        tack vare regenerering. Försäkringen är högre än för många
        förbränningsmotorbilar, men den totala ägandekostnaden är ofta
        konkurrenskraftig även med det högre köpepriset.
      </p>

      <p>
        Problemet är restvärdet. Tesla har historiskt sett sänkt priserna
        på nya bilar flera gånger, vilket dragit ner hela begagnatmarknaden.
        Vår data visar att Model Y har den mest osäkra priskurvan av alla
        modeller vi följer — vår regressionsmodell förklarar bara 68 procent
        av prisvariationen, jämfört med 85–93 procent för de andra bilarna.
        Det innebär att du tar en större risk när du köper en begagnad
        Model Y: den kan vara ett fynd, men den kan också tappa mer än
        förväntat.
      </p>

      <h2>Värdeminskningen framåt: Vem vinner kapplöpningen?</h2>

      <p>
        Att köpa begagnat handlar inte bara om vad du betalar idag — utan om
        vad bilen är värd när du säljer den. Här skiljer sig modellerna markant.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 my-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Värdeutveckling — prognos
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[var(--muted)]">Bäst framtida restvärde</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">RAV4 Hybrid</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Stabil men sjunkande</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">XC40, GLC</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Mest oförutsägbar</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Tesla Model Y</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Snabbast dalande</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">BMW X3 (diesel)</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Bäst kr/förlorad kr</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">Tiguan</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Platåzon nådd</div>
            <div className="font-mono font-semibold text-[var(--foreground)]">X3, XC60 (8+ år)</div>
          </div>
        </div>
      </div>

      <p>
        RAV4 Hybrid sticker ut som den klaraste vinnaren när det gäller
        framtida restvärde. Toyotas kombination av beprövad hybridteknik,
        låga driftskostnader och en köparbas som aktivt söker just denna bil
        skapar en självförstärkande premie på begagnatmarknaden. Även efter
        sju år handlas RAV4 till priser som får tyska konkurrenter att
        blekna av avund.
      </p>

      <p>
        I andra änden av spektrumet hittar vi BMW X3 med dieselmotor. Vid
        åtta års ålder är den redan i den zon där värdeminskningen planar ut,
        men den har också längst kvar till den absoluta botten. Dieselns
        minskande popularitet, kombinerat med BMW:s rykte för dyra
        servicekostnader, innebär att en X3 vid 300&nbsp;000&nbsp;kr
        sannolikt är värd 200&nbsp;000–220&nbsp;000&nbsp;kr om två–tre år.
      </p>

      <p>
        Tiguan är intressant från ett avskrivningsperspektiv: den har redan
        tappat så mycket i värde att den årliga förlusten framåt är modest i
        kronor räknat. Du köper för 270&nbsp;000&nbsp;kr och kan rimligt
        förvänta dig att sälja för 200&nbsp;000–220&nbsp;000&nbsp;kr om
        tre år — en årlig värdeminskning på runt 20&nbsp;000&nbsp;kr.
        Det är hälften av vad XC40-ägaren får räkna med.
      </p>

      <h2>Bästa bilen för familjen</h2>

      <p>
        Om du regelbundet kör med två barnstolar i baksätet, lastar
        barnvagnar och har saker för en veckas semester i bagageutrymmet
        är svaret enkelt: <strong>Volvo XC60</strong>. Den kombinerar det
        största bagageutrymmet på listan (bland de traditionella
        alternativen) med den bästa säkerhetsupplevelsen och ett baksäte
        som faktiskt rymmer tre personer. ISOFIX-fästena är lättåtkomliga,
        och Volvos barnsäkerhetsprogram är branschledande.
      </p>

      <p>
        Tiguan är ett starkt andrahandsalternativ för familjen — lägre köpepris
        innebär mer pengar över för barnförsäkringar, aktiviteter och
        semester. Bagageutrymmet är större än XC40:s och GLC:s.
      </p>

      <h2>Bästa bilen för pendlaren</h2>

      <p>
        Kör du 5–8 mil om dagen i stockholmstrafiken eller pendlar på
        motorväg? Då är kalkylens optimala val antingen <strong>Toyota
        RAV4 Hybrid</strong> eller <strong>Tesla Model Y</strong>, beroende
        på ditt laddbeteende.
      </p>

      <p>
        RAV4 Hybrid kräver ingen laddinfrastruktur — den laddar sig själv
        och levererar en blandad förbrukning kring 0,5 liter per mil. För
        en pendlare som kör 2&nbsp;000 mil per år innebär det en
        bränslekostnad på runt 17&nbsp;000&nbsp;kr årligen. Model Y
        reducerar den siffran till runt 6&nbsp;000–8&nbsp;000&nbsp;kr i
        elkostnad — men kräver tillgång till hemmaladdning för att
        kalkylen ska gå ihop. Utan egen laddare äter snabbladdningskostnader
        upp hela besparingen.
      </p>

      <h2>Bästa valet totalt sett</h2>

      <p>
        Det finns inget universellt &quot;bästa val&quot; — men om vi tittar på
        den samlade bilden av köpepris, driftskostnad, pålitlighet och
        framtida restvärde sticker två bilar ut:
      </p>

      <p>
        <strong>Toyota RAV4 Hybrid</strong> är det tryggaste köpet. Du
        får en beprövad hybrid med låga driftskostnader, branschens bästa
        pålitlighetsstatistik och det starkaste restvärdet. Du offrar
        interiörlyxen och körkänslan — men du sover gott om nätterna.
      </p>

      <p>
        <strong>VW Tiguan</strong> är det smartaste köpet för den
        prismedvetne. 30&nbsp;000–65&nbsp;000&nbsp;kr billigare än
        konkurrenterna, med likvärdig ålder och miltalsintervall. Den
        sparade pengen kan läggas på en utökad garanti, service eller
        helt enkelt bli kvar på kontot. Avskrivningen i kronor är den
        lägsta i gruppen.
      </p>

      <h2>Slutsatsen</h2>

      <p>
        300&nbsp;000&nbsp;kr på begagnatmarknaden är som ett
        Rorschachtest för bilköpare. Vad du <em>ser</em> i prisklassen
        avslöjar vad du <em>värderar</em>. Vill du ha det senaste och
        fräschaste? XC40. Mest bil för pengarna? XC60. Körupplevelsen?
        X3. Trygghet och lägst kostnad? RAV4. Premiumkänslan? GLC.
        Lägsta priset? Tiguan. Framtidens teknik? Model Y.
      </p>

      <p>
        Det enda felaktiga valet är att inte kolla siffrorna innan du
        bestämmer dig. Och det, om inte annat, är vad du just har gjort.
      </p>
    </>
  );
}
