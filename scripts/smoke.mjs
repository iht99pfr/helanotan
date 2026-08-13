/**
 * Browser smoke test for every route, at desktop and mobile.
 *
 * This exists because a curl check reported 200 on a page that was showing
 * "Application error: a client-side exception has occurred" to a real visitor.
 * Server-rendered HTML says nothing about whether the page survives hydration,
 * and the charts, the model selector and the listings table are all client
 * components. Only a browser can answer that.
 *
 *   node scripts/smoke.mjs                     # against production
 *   node scripts/smoke.mjs http://localhost:3999
 */
import { chromium, devices } from "playwright";

const BASE = process.argv[2] || "https://helanotan.se";

const ROUTES = [
  "/", "/bilar", "/bilar/volvo-xc60", "/bilar/vw-golf", "/bilar/bmw-x3-m",
  "/bilar/volvo-xc60/vardera?ar=2021&mil=6800&drivmedel=Bensin&hk=197&pris=389000",
  "/bilar/toyota-land-cruiser/vardera?ar=2015&mil=15000&drivmedel=Diesel",
  "/jamfor/volvo-xc60-vs-toyota-rav4", "/jamfor/toyota-yaris-vs-vw-golf",
  "/press",
  "/tco", "/kopguide", "/toppen", "/bevaka", "/saljtid", "/metod",
  "/artiklar", "/artiklar/sa-prissatter-vi-bilar", "/nyheter",
];

const VIEWPORTS = [
  { name: "desktop", viewport: { width: 1440, height: 900 } },
  { name: "mobil", viewport: devices["iPhone 13"].viewport, isMobile: true },
];

// Recharts complains about a zero-size container during the first paint of a
// responsive chart. It is noise, not a fault, and it would drown the signal.
const IGNORE = [/width\(-?\d+\) and height\(-?\d+\) of chart/i];

const failures = [];

/** Drag the pointer across every chart, which is where the tooltips live. */
async function sweepCharts(page) {
  const charts = await page.$$(".recharts-surface");
  for (const chart of charts) {
    // Without this the pointer is sent to coordinates below the fold and
    // never touches the chart at all — which is how the first version of this
    // sweep passed against a build that crashed on hover.
    await chart.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(250);
    const box = await chart.boundingBox();
    if (!box) continue;
    for (const fx of [0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 0.95]) {
      for (const fy of [0.25, 0.5, 0.75]) {
        await page.mouse.move(box.x + box.width * fx, box.y + box.height * fy, { steps: 8 });
        await page.waitForTimeout(60);
      }
    }
  }
}

async function check(browser, route, vp) {
  const context = await browser.newContext({
    viewport: vp.viewport,
    isMobile: vp.isMobile ?? false,
    hasTouch: vp.isMobile ?? false,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const text = m.text();
    if (IGNORE.some((re) => re.test(text))) return;
    errors.push(text);
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

  let status = 0;
  try {
    // Not networkidle. Microsoft Clarity posts a telemetry beacon every few
    // seconds, which keeps resetting the 500 ms of silence networkidle waits
    // for — so the homepage "timed out" at 45 s on desktop while curl served
    // it in 1.3 s. Playwright advises against networkidle for exactly this.
    // Wait for the page to be usable instead: charts drawn, or 6 s elapsed.
    const res = await page.goto(BASE + route, {
      waitUntil: "domcontentloaded", timeout: 45_000,
    });
    status = res?.status() ?? 0;
    await page.waitForLoadState("load", { timeout: 20_000 }).catch(() => {});
    await page
      .waitForFunction(() => document.querySelectorAll(".recharts-surface").length > 0,
                       { timeout: 6_000 })
      .catch(() => {});
    await page.waitForTimeout(1500);

    // Loading the page is not the same as using it. A merged scatter-and-curve
    // chart shipped a tooltip that read `price.toLocaleString()` on every
    // payload it was handed — fine until the mouse crossed the curve, whose
    // points have no price, at which point the whole page came down. A check
    // that only navigates would have called that page healthy, and did.
    await sweepCharts(page);
    await page.waitForTimeout(600);

    const body = await page.evaluate(() => document.body.innerText);
    const crashed = body.includes("Application error")
      || body.includes("client-side exception");
    const empty = body.trim().length < 200;

    if (status >= 400) failures.push(`${route} [${vp.name}] HTTP ${status}`);
    if (crashed) failures.push(`${route} [${vp.name}] KRASCH: React-fel i klienten`);
    if (empty) failures.push(`${route} [${vp.name}] nästan tom sida (${body.trim().length} tecken)`);
    for (const e of errors) failures.push(`${route} [${vp.name}] konsolfel: ${e.slice(0, 160)}`);

    const mark = failures.some((f) => f.startsWith(`${route} [${vp.name}]`)) ? "FEL " : "ok  ";
    console.log(`${mark} ${vp.name.padEnd(8)} ${route.padEnd(34)} ${status}  ${body.trim().length} tecken`);
  } catch (e) {
    failures.push(`${route} [${vp.name}] ${e.message.split("\n")[0]}`);
    console.log(`FEL  ${vp.name.padEnd(8)} ${route.padEnd(34)} ${e.message.split("\n")[0]}`);
  }
  await context.close();
}

const browser = await chromium.launch();
console.log(`Smoke: ${BASE}\n`);
for (const vp of VIEWPORTS) {
  for (const route of ROUTES) await check(browser, route, vp);
  console.log("");
}
await browser.close();

if (failures.length) {
  console.log(`\n${failures.length} PROBLEM:\n`);
  for (const f of failures) console.log("  - " + f);
  process.exit(1);
}
console.log("\nAlla sidor laddar rent i webbläsare.");
