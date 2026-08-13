# Marknadsföring — färdigt att skicka, men oskickat

Allt här är utkast. **Inget är skickat** — avsändaren är du. Siffrorna märkta
`[X]` hämtas färskt från /press innan utskick (de ändras varje vecka).

Kanalordningen är medveten: indexeringen är ett auktoritetsproblem, så
**press och forum före allt annat** — externa länkar är det som får Google
att crawla modellsidorna, som är sajtens långsiktiga trafikmotor.

---

## 1. Pitch #1 — motorpress (Vi Bilägare först, sedan Carup)

**Till:** redaktionen@vibilagare.se
**Ämne:** Data från [30 000+] Blocket-annonser: vilka bilar tappar mest — Defender −[346 000] kr första året

> Hej,
>
> Jag driver helanotan.se, en gratis och oberoende sajt som analyserar
> begagnatpriser. Jag har regressionsmodeller byggda på [30 135] faktiska
> Blocket-annonser för 18 vanliga modeller (RAV4, XC60, Model Y, Golf m.fl.)
> och tänkte att siffrorna kan vara en story:
>
> - Land Rover Defender tappar i snitt ca [346 000] kr första året — mest av
>   alla modeller vi följer.
> - [Modell X] behåller bäst värde: ~[Y]% av nypriset efter 3 år.
> - Bilhandlare tar i snitt [Z]% mer än privatsäljare för likvärdig bil —
>   men nära noll extra på elbilar.
>
> Siffrorna kommer från verkliga annonspriser, inte listpriser, och metoden
> är öppet redovisad: https://helanotan.se/metod. En kontrollmätning: bilar
> som ligger under modellens förväntade pris försvinner också snabbare från
> Blocket (31,9% mot 27,5% på 17 dagar) — marknaden bekräftar modellen.
>
> Färdiga tabeller fria att publicera med källa: https://helanotan.se/press
> Jag tar fram data per modell, årsmodell eller drivmedel på begäran —
> svarar samma dag.
>
> Vänliga hälsningar
> Patrik Frisk
> helanotan.se · [telefonnummer]

**Sekvens:** Vi Bilägare → vänta 4–5 dagar → Carup (carup.se/kontakta-oss)
→ Teknikens Värld → auto motor & sport. En i taget, aldrig massutskick.

## 2. Pitch #2 — familjeekonomi (vecka 6–8, efter motorpressen)

**Till:** Omni Ekonomi / SvD·DN ekonomi / Expressen Dina Pengar
**Vinkel:** inte "bilar tappar värde" utan **"familjens näst största utgift"**.
**Ämne:** Att köpa hos bilhandlare kostar [9]% extra — utom om bilen är en elbil

> Hej,
>
> En siffra ur vår databas som kan intressera era läsare: för en begagnad
> VW Golf begär handlare i snitt [+9,2]% mer än privatsäljare för likvärdig
> bil — cirka [13 000] kr. För en Tesla Model Y är skillnaden nära noll.
> Garantin kostar alltså — utom där den inte gör det.
>
> Vi har mätt handlarpremien per modell på [30 135] Blocket-annonser, med
> öppen metod (helanotan.se/metod). Tabell fri att publicera med källa:
> helanotan.se/press. Kompletterande uttag samma dag.
>
> Vänliga hälsningar
> Patrik Frisk, helanotan.se

## 3. Foruminlägg — RikaTillsammans (befintliga trådar, inte ny tråd)

Trådar som redan frågar: "Värdeminskning bilmodeller" (t/70420),
"Hur räkna på värdeminskning nu?" (t/58861).

> Jag har faktiskt byggt ihop exakt det som efterfrågas här — irriterade mig
> på att alla siffror om värdeminskning var tumregler ("50% på tre år") utan
> källa, så jag samlade in [30 135] Blocket-annonser och körde regression per
> modell.
>
> Några konkreta svar på trådens fråga:
> - RAV4 Hybrid behåller ~[78]% efter 3 år — bland de bästa vi mätt.
> - Tesla Model Y: ~[X]% — elbilstappet syns i datan, inte bara i rubrikerna.
> - Land Rover Defender tappar ~[346 000] kr första året, mest av 18 modeller.
>
> Tumregeln "15% per år efter år tre" stämmer hyfsat för bensinbilar men inte
> alls för laddbart, där kurvan är brantare tidigt.
>
> Allt ligger öppet och gratis på helanotan.se (metoden:
> helanotan.se/metod) — inga konton, ingen reklam. Säg till om någon vill se
> en specifik modell/årsmodell så kollar jag vad datan säger.

Sista meningen är viktigast: den gör dig till trådens resurs. Svara på varje
följdfråga inom 24 h.

## 4. Ägargrupper på Facebook (validatorerna — 1 h/vecka)

Sara ställer frågan; **någon annan** måste posta länken. Så odla dem som blir
citerade: gå med i 6–8 ägargrupper för våra modeller ("Volvo XC60/XC90
Sverige", "Toyota RAV4 Sverige", …). Svara på "vilken årsmodell?"- och "vad
är den värd?"-frågor med data, skärmdump av grafen före länk, länka bara när
det är direkt relevant, och säg öppet att du byggt sajten. Efter ~10 äkta
svar per grupp börjar stammisar citera sajten oombedda — det är tillgången.

**Aldrig:** posta själv i familje-/lokalgrupper (där dör man som lead funnel).
**Flashback:** länk i signaturen + faktasvar i trådar; aldrig egen tråd.

## 5. Google Ads — inte nu

Villkorad omstart tidigast dag 60, endast som **sökfras-spaning**:
exakt/frasmatchning på "värdeminskning [modell]" m.fl., partternätverk AV,
max 1 500 kr/mån, konvertering = `listing_click`, döda vid CPA > 50 kr.
Syftet är att lära vilka fraser som konverterar — inte trafik.

## 6. Månadsrutin (efter varje /refresh, ~30 min)

1. Kör `python3 scripts/gsc-report.py --days 28 --inspect`
2. Skriv "månadens siffror" — tre punkter med störst förändring
3. Posta i de forum där du är etablerad; mejla journalisten som svarat
4. Kolla: indexerade sidor, visningar på /bilar/* och /jamfor/*, referrals

## Dag 90 — ärliga mål

≥10 sidor indexerade · 1 pressomnämnande med länk · 30–80 forumbesök/vecka ·
5–10 varumärkessökningar/vecka · organiskt 5–15 besök/dag (från 1).
Det låter lite. Det är det. Men det är riktiga människor med riktade
intentioner, och kurvan pekar då åt rätt håll.
