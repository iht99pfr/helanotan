/**
 * Self-referencing canonical for a route.
 *
 * Must be set per route: a canonical inherited from the root layout points
 * every page at the homepage, which is how 35 of 45 sitemap URLs came to be
 * de-indexed while the sitemap kept submitting them.
 */
export const SITE_URL = "https://helanotan.se";

export function canonical(path: string) {
  const clean = path === "/" ? "" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  return { canonical: `${SITE_URL}${clean}` };
}
