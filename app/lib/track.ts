/**
 * Umami event tracking.
 *
 * The site ran for a year with pageviews and nothing else, so questions like
 * "does anyone use the deal filter?" or "which of the 19 models do people care
 * about?" had no answer and every product decision was a guess. These events
 * exist to make the next decision an evidence-based one.
 *
 * `listing_click` is the north star: it is the only event that means someone
 * left here holding a specific car. Everything else is a step toward it.
 */

type Props = Record<string, string | number | boolean | undefined>;

interface UmamiWindow {
  umami?: { track: (name: string, data?: Props) => void };
}

export function track(event: string, props?: Props) {
  if (typeof window === "undefined") return;
  const umami = (window as UmamiWindow).umami;
  if (!umami?.track) return;
  try {
    // Drop undefined values — Umami stores them as the string "undefined",
    // which then pollutes the property breakdowns in the dashboard.
    const clean: Props = {};
    for (const [k, v] of Object.entries(props ?? {})) {
      if (v !== undefined) clean[k] = v;
    }
    umami.track(event, Object.keys(clean).length ? clean : undefined);
  } catch {
    // Analytics must never break the page.
  }
}

/** Bucket a price so property cardinality stays readable in the dashboard. */
export function priceBucket(price: number): string {
  if (price < 100_000) return "<100k";
  if (price < 200_000) return "100-200k";
  if (price < 300_000) return "200-300k";
  if (price < 500_000) return "300-500k";
  if (price < 800_000) return "500-800k";
  return "800k+";
}
