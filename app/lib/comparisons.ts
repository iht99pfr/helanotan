/**
 * The curated head-to-head list. Curated, not combinatorial: 18 models give
 * 153 possible pairs, most of which nobody has ever typed into Google. Each
 * entry here is a comparison a real buyer faces — same segment, same money.
 */
export const PAIRS: [string, string][] = [
  ["volvo-xc60", "toyota-rav4"],
  ["volvo-xc40", "toyota-rav4"],
  ["volvo-xc60", "mercedes-glc"],
  ["volvo-xc60", "bmw-x3"],
  ["volvo-xc40", "tesla-model-y"],
  ["vw-tiguan", "toyota-rav4"],
  ["toyota-yaris", "vw-golf"],
  ["kia-niro", "toyota-yaris-cross"],
];

export function pairSlug(a: string, b: string): string {
  return `${a}-vs-${b}`;
}

export function parsePair(par: string): [string, string] | null {
  return PAIRS.find(([a, b]) => pairSlug(a, b) === par) ?? null;
}

/** Comparisons involving one model, for cross-linking from its page. */
export function comparisonsFor(slug: string): { par: string; other: string }[] {
  return PAIRS.filter(([a, b]) => a === slug || b === slug)
    .map(([a, b]) => ({ par: pairSlug(a, b), other: a === slug ? b : a }));
}
