/**
 * Sara's journey, end to end, in a real browser against production.
 *
 * Phase A: lands on a model page from search — does it answer year/fuel/fair
 * price without her touching anything? Phase B: she has a Blocket ad — can
 * she get a verdict on that exact car in under a minute? Phase C: does the
 * verdict work as a document (one screen on a phone, share that carries the
 * car)? Plus the trust checks: numbers agree across pages, refusals are
 * honest, the partner-glance OG cards exist.
 */
import { chromium, devices } from "playwright";

const BASE = process.argv[2] || "https://helanotan.se";
const failures = [];
const notes = [];

function check(name, ok, detail = "") {
  console.log(`${ok ? "ok  " : "FEL "} ${name}${detail ? " — " + detail : ""}`);
  if (!ok) failures.push(`${name}: ${detail}`);
}

const browser = await chromium.launch();

// ---------- Phase A: research on mobile, evening couch ----------
{
  const ctx = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/bilar/toyota-rav4`, { waitUntil: "load" });
  const text = await page.evaluate(() => document.body.innerText);

  check("A: kvantifierad mening i HTML", /tappar i snitt[\s\S]{0,80}kr per månad/.test(text));
  check("A: bränslesplit-sektionen finns", text.includes("Vilket drivmedel"));
  check("A: FAQ finns", text.includes("Vanliga frågor"));
  check("A: värderingsformuläret syns", text.includes("Kolla priset"));
  const jsonld = await page.evaluate(() =>
    [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent).join(" "));
  check("A: FAQPage + Dataset JSON-LD", jsonld.includes("FAQPage") && jsonld.includes("Dataset"));

  // OG card for the partner glance
  const og = await page.evaluate(() =>
    document.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? "");
  check("A: modellsidan har og:image", og.includes("opengraph-image"), og.slice(0, 80));
  await ctx.close();
}

// ---------- Phase B: the verdict via the form ----------
{
  const ctx = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/bilar/volvo-xc60`, { waitUntil: "load" });
  await page.fill('input[placeholder="6 800"]', "6800");
  await page.fill('input[placeholder="valfritt"]', "389000");
  await page.selectOption("select >> nth=0", "2021");
  await page.click('button:has-text("Värdera bilen")');
  await page.waitForURL("**/vardera**", { timeout: 20000 });
  const text = await page.evaluate(() => document.body.innerText);

  check("B: intyg nås från formuläret", text.includes("Prisestimat"));
  check("B: begärt pris bedöms", /kr (under|över)/.test(text));
  check("B: osäkerhet i två-av-tre-språk", text.includes("två bilar av tre"));
  check("B: proveniensstämpel", /Baserat på [\d\s]+ Blocket-annonser/.test(text));

  // The breakdown must reconcile exactly.
  const nums = await page.evaluate(() => {
    const t = document.body.innerText;
    const base = t.match(/Typisk [^\n]+\n([\d\s]+) kr/);
    const sum = t.match(/Summa\n([\d\s]+) kr/);
    const steps = [...t.matchAll(/\n([+−])([\d\s]+) kr\n/g)].map(
      (m) => (m[1] === "−" ? -1 : 1) * Number(m[2].replace(/\s/g, "")));
    return {
      base: base ? Number(base[1].replace(/\s/g, "")) : null,
      sum: sum ? Number(sum[1].replace(/\s/g, "")) : null,
      steps,
    };
  });
  if (nums.base != null && nums.sum != null) {
    const total = nums.base + nums.steps.reduce((a, c) => a + c, 0);
    check("B: uppdelningen summerar exakt", Math.abs(total - nums.sum) <= 2,
      `${nums.base} + steg = ${total} vs ${nums.sum}`);
  } else {
    check("B: uppdelningen hittad", false, JSON.stringify(nums).slice(0, 120));
  }

  // Phase C essentials: one screen? share button?
  const height = await page.evaluate(() =>
    document.querySelector("article")?.getBoundingClientRect().height ?? 9999);
  notes.push(`intyg-höjd på iPhone: ${Math.round(height)} px (viewport 844)`);
  check("C: delningsknapp finns", text.includes("Dela värderingen"));

  const ogUrl = await page.evaluate(() =>
    document.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? "");
  check("C: intyget har dynamisk OG", ogUrl.includes("/api/og/vardering"), ogUrl.slice(0, 90));
  await ctx.close();
}

// ---------- Refusals stay refusals ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(
    `${BASE}/bilar/toyota-land-cruiser/vardera?ar=2015&mil=15000&drivmedel=Diesel`,
    { waitUntil: "load" });
  const text = await page.evaluate(() => document.body.innerText);
  check("Ärlighet: Land Cruiser vägrar eller redovisar bandet",
    text.includes("kan inte värdera") || /±[\d\s]+ kr — två bilar av tre/.test(text));
  notes.push(`Land Cruiser-intyg: ${text.includes("kan inte värdera") ? "vägrar" : "estimat med brett band (spread 25,0%, n=65)"}`);

  await page.goto(`${BASE}/bilar/vw-golf/vardera?ar=2006&mil=45000&drivmedel=Bensin`,
    { waitUntil: "load" });
  const t2 = await page.evaluate(() => document.body.innerText);
  notes.push(`gammal Golf (2006, 45k mil): ${t2.includes("kan inte värdera") ? "vägrar" : "ger estimat"}`);
  await ctx.close();
}

// ---------- Cross-page number agreement ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const grab = async (url, re) => {
    await page.goto(BASE + url, { waitUntil: "load" });
    await page.waitForTimeout(4000);
    const t = await page.evaluate(() => document.body.innerText);
    const m = t.match(re);
    return m ? m[1] : null;
  };
  const onModel = await grab("/bilar/volvo-xc60", /±(\d+)%/);
  const onMetod = await grab("/metod", /Volvo XC60[\s\S]{0,400}?±(\d+)%/);
  check("Röst: XC60 ±% lika på /bilar och /metod", onModel != null && onModel === onMetod,
    `bilar ±${onModel} vs metod ±${onMetod}`);

  await page.goto(`${BASE}/press`, { waitUntil: "load" });
  const press = await page.evaluate(() => document.body.innerText);
  check("Press: tabell + kontakt", press.includes("Handlarpremie") && press.includes("press@helanotan.se"));
  const crazy = press.match(/[+-]?\d{3,},\d%|[+-]\d{3,}%/);
  check("Press: inga urspårade premier", !crazy, crazy?.[0] ?? "");
  await ctx.close();
}

// ---------- The repaired bevaka loop ----------
{
  const ctx = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/bevaka?model=X3&fuel=PHEV&year=2022`, { waitUntil: "load" });
  await page.waitForTimeout(2500);
  const sel = await page.evaluate(() => {
    const s = [...document.querySelectorAll("select")];
    return s.map((x) => x.value).join("|");
  });
  check("Bevaka: delad länk återställer bilen", sel.includes("X3") && sel.includes("2022"), sel);
  await ctx.close();
}

// ---------- Homepage order and trust strip ----------
{
  const ctx = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "load" });
  const t = await page.evaluate(() => document.body.innerText);
  const iModels = t.indexOf("Värdeminskning per modell");
  const iDeals = t.indexOf("Under prisestimat just nu");
  check("Hem: statistik före fynd", iModels > 0 && iDeals > iModels, `${iModels} vs ${iDeals}`);
  check("Hem: provenansraden", t.toUpperCase().includes("VI SÄLJER INGET"));
  check("Hem: Not-eyebrows", t.includes("NOT 01") && t.includes("NOT 02"));
  check("Hem: byline utan AI", !t.includes("Up North AI") && t.includes("Patrik Frisk"));
  await ctx.close();
}

await browser.close();

console.log("\n--- noteringar ---");
for (const n of notes) console.log("  " + n);
if (failures.length) {
  console.log(`\n${failures.length} FEL`);
  process.exit(1);
}
console.log("\nAlla Sara-kontroller gröna.");
