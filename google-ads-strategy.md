# Google Ads Campaign Strategy — Helanotan.se

Two campaigns targeting Swedish car buyers. Low budget, high intent keywords.

**Note:** Before launching, add `data-umami-event` tracking to key interactions (see conversion tracking sections below).

---

## Campaign 1: Ägandekostnad / TCO Calculator

People searching for what a car actually costs to own — highest intent, best landing page.

### Setup

| Field | Value |
|-------|-------|
| **Campaign type** | Search |
| **Goal** | Website traffic |
| **Network** | Google Search only (uncheck Display) |
| **Location** | Sweden |
| **Language** | Swedish |
| **Budget** | 30–50 SEK/day (~$3-5) |
| **Bidding** | Maximize clicks |
| **Landing page** | `https://helanotan.se/tco` |

### Conversion tracking

Add these `data-umami-event` attributes to the Helanotan site, then track in Google Ads:
- `tco-calculation` — when user changes any input (or clicks "Beräkna" if you add a button)
- `tco-model-select` — when user picks a car model in the TCO calculator
- Track time-on-page > 60s as an engagement conversion (via Google Ads tag)

### Ad Group 1: Ägandekostnad (ownership cost)

**Keywords:**
```
"ägandekostnad bil"
"vad kostar det att äga bil"
"bilkostnad per månad"
"total kostnad bil"
"månadskostnad bil"
"ägandekostnad begagnad bil"
ägandekostnad kalkylator
```

**Headline options (max 30 chars):**
1. Hela notan för din bil
2. Ägandekostnad — kalkylator
3. Beräkna bilens totala kostnad
4. Gratis, datadriven
5. 15 modeller analyserade

**Descriptions (max 90 chars):**
1. Beräkna ägandekostnad på 2 minuter. Värdeminskning, skatt, bränsle, service — allt inkluderat.
2. Baserat på 10 000 Blocket-annonser. Se vad bilen kostar per månad, inte bara i inköpspris.

### Ad Group 2: Värdeminskning (depreciation)

**Keywords:**
```
"värdeminskning bil"
"vilken bil tappar minst i värde"
"begagnad bil värdeminskning"
"bäst restvärde bil"
"värdeminskning suv"
"värdeminskning elbil"
värdeminskning begagnad
```

**Headline options:**
1. Så mycket tappar bilen i värde
2. Värdeminskning — 15 modeller
3. Baserat på verklig data
4. Jämför bilars restvärde
5. Helanotan.se — Gratis

**Descriptions:**
1. Se exakt värdeminskning per modell, baserat på 10 000 Blocket-annonser. Gratis verktyg.
2. RAV4, XC60, Model Y, Golf — jämför vilken som håller värdet bäst. Datadriven analys.

---

## Campaign 2: Begagnad bil — Modellsökning

People searching for specific used car models — huge volume, catch them during research.

### Setup

| Field | Value |
|-------|-------|
| **Campaign type** | Search |
| **Goal** | Website traffic |
| **Network** | Google Search only |
| **Location** | Sweden |
| **Language** | Swedish |
| **Budget** | 40–70 SEK/day (~$4-7) |
| **Bidding** | Maximize clicks |
| **Landing page** | `https://helanotan.se` (homepage, model selector) |

### Conversion tracking

- `model-select` — when user clicks a car model on the homepage
- `explorer-click` — when user clicks through to a Blocket listing
- `article-read` — when user navigates to an article from the homepage

### Ad Group 1: SUV-jämförelser

**Keywords:**
```
"bästa begagnade suv"
"begagnad suv 300000"
"vilken suv ska man köpa"
"begagnad suv jämförelse"
"suv bäst värde"
begagnad suv pris
```

**Headline options:**
1. Bästa begagnade SUV:en?
2. 7 SUV:ar jämförda med data
3. Se vad pengarna räcker till
4. Baserat på 10 000 annonser
5. Helanotan — Gratis verktyg

**Descriptions:**
1. XC60, RAV4, Tiguan, Model Y — jämför pris, värdeminskning och ägandekostnad. Gratis.
2. Vad köper 300 000 kr? Se vilken SUV som ger mest för pengarna baserat på Blocket-data.

### Ad Group 2: Specifika modeller

**Keywords:**
```
"volvo xc60 begagnad pris"
"toyota rav4 begagnad"
"vw golf begagnad pris"
"tesla model y begagnad"
"kia niro begagnad"
"bmw x3 begagnad pris"
"mercedes glc begagnad"
```

**Headline options:**
1. {Keyword:Begagnad bil} — priskoll
2. Se verkligt marknadspris
3. Är det ett bra pris?
4. Datadriven prisanalys
5. 10 000 annonser analyserade

**Descriptions:**
1. Se om priset är rätt. Vi analyserar tusentals Blocket-annonser och visar vad bilen borde kosta.
2. Jämför pris, miltal och årsmodell. Se vilka annonser som är fynd och vilka som är för dyra.

### Ad Group 3: Elbil / hybrid

**Keywords:**
```
"begagnad elbil"
"begagnad hybrid"
"elbil värdeminskning"
"laddhybrid begagnad pris"
"bästa begagnade elbil"
"elbil eller hybrid"
```

**Headline options:**
1. Elbil, PHEV eller hybrid?
2. Vilken håller värdet bäst?
3. Datadriven jämförelse
4. Se ägandekostnad per mil
5. Helanotan — Gratis

**Descriptions:**
1. Elbil vs laddhybrid vs hybrid — jämför värdeminskning och total ägandekostnad. Gratis verktyg.
2. Tesla, Kia Niro, RAV4 Hybrid — se vilken elektrifierad bil som ger mest för pengarna.

---

## Negative keywords (add to both campaigns)

```
blocket
bilhandlare
köpa bil
sälja bil
bilförsäkring pris
bilbesiktning
bilmekaniker
leasingbil
nybil pris
```

## Ad extensions (sitelinks)

| Sitelink | URL | Description |
|----------|-----|-------------|
| TCO-kalkylator | /tco | Beräkna total ägandekostnad |
| Värdeminskning | /#depreciation | Se värdeminskning per modell |
| Modellguider | /artiklar | Läs djupgående modellanalyser |
| Blocket-data | /#explorer | Utforska 10 000 annonser |

## Callout extensions

- Gratis verktyg
- Baserat på Blocket-data
- 15 bilmodeller
- Uppdateras löpande

---

## Pre-launch checklist

- [ ] Add `data-umami-event` tracking to: model selector, TCO inputs, article clicks, Blocket link clicks
- [ ] Set up Google Ads conversion tracking (either via Google tag or import from Umami)
- [ ] Create Google Ads account (or use existing)
- [ ] Create both campaigns with settings above
- [ ] Add ad groups, keywords, and responsive search ads
- [ ] Add negative keywords
- [ ] Add sitelink + callout extensions
- [ ] Start with minimum budgets, review after 1 week
- [ ] Check search terms report after 3 days to add more negatives
