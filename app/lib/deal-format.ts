/**
 * How a deal is described to a reader.
 *
 * "Fyndpris" is a claim; it tells you the site is excited, not how much money
 * is involved. Every surface now leads with the measurement — how far under
 * the model's estimate the asking price sits, in percent and in kronor — and
 * keeps the label as a secondary tag. The article that explains the two
 * thresholds is also the single best-ranking page on the site, so the names
 * stay; they just stop doing the work a number should do.
 */

export type Deal = "great" | "good" | null | undefined;

/** Percent below the estimate. Positive means cheaper than predicted. */
export function percentUnder(price: number, predicted: number | null | undefined): number | null {
  if (!predicted || predicted <= 0 || !price) return null;
  const pct = (1 - price / predicted) * 100;
  return pct > 0 ? Math.round(pct) : null;
}

/** "23% under prisestimat" — the phrase used wherever a deal is shown. */
export function underEstimateLabel(
  price: number, predicted: number | null | undefined,
): string | null {
  const pct = percentUnder(price, predicted);
  return pct == null ? null : `${pct}% under prisestimat`;
}

export function dealName(deal: Deal): string | null {
  return deal === "great" ? "Fyndpris" : deal === "good" ? "Bra pris" : null;
}

/**
 * What the badge should say, in one call: the measurement first, then the
 * saving in kronor. Falls back to the label alone if we have no estimate.
 */
export function dealBadge(
  price: number, predicted: number | null | undefined, residual: number | null | undefined,
  deal: Deal,
): { headline: string; detail: string | null } | null {
  if (!deal) return null;
  const pct = percentUnder(price, predicted);
  if (pct == null) return { headline: dealName(deal)!, detail: null };
  const saving = residual != null ? Math.abs(Math.round(residual)) : null;
  return {
    headline: `${pct}% under estimat`,
    detail: saving != null ? `${saving.toLocaleString("sv-SE")} kr` : null,
  };
}
