import crypto from "crypto";

/**
 * Outbound email.
 *
 * /bevaka and the deal alerts have been collecting addresses since March and
 * have never sent anything — there was no mail library and no scheduler, while
 * the copy promised a report every month. This is the delivery side of that
 * promise.
 *
 * Two deliberate safeties, because the failure mode here is mailing real
 * people by accident:
 *   - Nothing sends unless RESEND_API_KEY and EMAIL_FROM are both set.
 *   - The digest route is dry-run unless explicitly told to send.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export interface Mail {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendMail(mail: Mail): Promise<{ ok: boolean; error?: string }> {
  if (!emailConfigured()) {
    return { ok: false, error: "RESEND_API_KEY or EMAIL_FROM missing" };
  }
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [mail.to],
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        headers: {
          // One-click unsubscribe. Gmail and Yahoo require this on bulk mail,
          // and without it a "monthly report" is indistinguishable from spam.
          "List-Unsubscribe": `<${unsubscribeUrl(mail.to)}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      }),
    });
    if (!res.ok) return { ok: false, error: `${res.status} ${await res.text()}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
  }
}

/** Signed so an address cannot be unsubscribed by anyone who guesses it. */
export function unsubscribeToken(email: string): string {
  const secret = process.env.EMAIL_SECRET || process.env.CRON_SECRET || "";
  return crypto.createHmac("sha256", secret).update(email.toLowerCase()).digest("hex").slice(0, 32);
}

export function unsubscribeUrl(email: string): string {
  const q = new URLSearchParams({ e: email, t: unsubscribeToken(email) });
  return `https://helanotan.se/api/unsubscribe?${q}`;
}

const kr = (n: number) => Math.round(n).toLocaleString("sv-SE");

export function watcherEmail(opts: {
  email: string;
  label: string;
  modelYear: number;
  value: number;
  monthlyLoss: number;
  yearAhead: number;
}): Mail {
  const { label, modelYear, value, monthlyLoss, yearAhead } = opts;
  const subject = `Din ${label} ${modelYear}: ${kr(value)} kr`;
  const unsub = unsubscribeUrl(opts.email);
  const text = [
    `Din ${label} ${modelYear}`,
    ``,
    `Uppskattat marknadsvärde: ${kr(value)} kr`,
    `Värdeminskning: ${kr(monthlyLoss)} kr/mån`,
    `Om ett år: ${kr(yearAhead)} kr`,
    ``,
    `Siffrorna bygger på aktuella Blocket-annonser för samma modell och`,
    `årsmodell. Enskilda bilar avviker — skick och servicehistorik syns inte.`,
    ``,
    `Se hela underlaget: https://helanotan.se/bevaka`,
    `Avsluta bevakningen: ${unsub}`,
  ].join("\n");
  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px;color:#171512">
      <h1 style="font-size:20px;margin:0 0 4px">Din ${label} ${modelYear}</h1>
      <p style="color:#6b6558;margin:0 0 20px;font-size:14px">Uppdaterat marknadsvärde</p>
      <div style="border:1px solid #d9d2c4;border-radius:8px;padding:16px;margin-bottom:16px">
        <div style="font-size:28px;font-weight:700">${kr(value)} kr</div>
        <div style="color:#6b6558;font-size:14px;margin-top:4px">
          −${kr(monthlyLoss)} kr/mån &middot; om ett år ca ${kr(yearAhead)} kr
        </div>
      </div>
      <p style="font-size:13px;color:#6b6558;line-height:1.5">
        Siffrorna bygger på aktuella Blocket-annonser för samma modell och årsmodell.
        Enskilda bilar avviker — skick och servicehistorik syns inte i en annons.
      </p>
      <p style="font-size:13px">
        <a href="https://helanotan.se/bevaka" style="color:#1a5c3a">Se hela underlaget</a>
        &middot;
        <a href="${unsub}" style="color:#6b6558">Avsluta bevakningen</a>
      </p>
    </div>`;
  return { to: opts.email, subject, html, text };
}

export interface DealLine {
  label: string;
  year: number;
  price: number;
  mileage: number;
  pctUnder: number;
  saving: number;
  url: string;
}

export function dealEmail(opts: { email: string; deals: DealLine[] }): Mail {
  const { deals } = opts;
  const unsub = unsubscribeUrl(opts.email);
  const subject = deals.length === 1
    ? `1 ny bil under prisestimat`
    : `${deals.length} nya bilar under prisestimat`;
  const line = (d: DealLine) =>
    `${d.label} ${d.year} — ${kr(d.price)} kr, ${kr(d.mileage)} mil` +
    ` (${d.pctUnder}% under estimat, ${kr(d.saving)} kr)\n${d.url}`;
  const text = [
    subject, "",
    ...deals.map(line), "",
    `Ett lågt pris kan ha en bra förklaring — läs annonsen.`,
    `Avsluta bevakningen: ${unsub}`,
  ].join("\n\n");
  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;color:#171512">
      <h1 style="font-size:20px;margin:0 0 16px">${subject}</h1>
      ${deals.map((d) => `
        <a href="${d.url}" style="display:block;border:1px solid #d9d2c4;border-radius:8px;padding:12px;margin-bottom:10px;text-decoration:none;color:inherit">
          <div style="font-weight:600">${d.label} ${d.year}</div>
          <div style="font-size:14px;color:#6b6558">${kr(d.price)} kr &middot; ${kr(d.mileage)} mil</div>
          <div style="font-size:14px;color:#1a5c3a;font-weight:600;margin-top:4px">
            ${d.pctUnder}% under estimat &middot; ${kr(d.saving)} kr
          </div>
        </a>`).join("")}
      <p style="font-size:13px;color:#6b6558;line-height:1.5">
        Ett lågt pris kan ha en bra förklaring — läs annonsen.
      </p>
      <p style="font-size:13px"><a href="${unsub}" style="color:#6b6558">Avsluta bevakningen</a></p>
    </div>`;
  return { to: opts.email, subject, html, text };
}
