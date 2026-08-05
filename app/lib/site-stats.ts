import { getDb } from "@/app/lib/db";

/**
 * The single source of truth for "how much data do we have and how fresh is it".
 *
 * These numbers used to be hardcoded per page, and drifted badly: the footer
 * claimed "Uppdaterad feb 2026" while the pipeline had run that morning, and
 * four pages quoted four different car counts (4 406 / 9 503 / 12 851 / 33 730).
 * For a site whose entire proposition is trustworthy data, contradicting
 * yourself is worse than any missing feature — so every surface now reads from
 * here.
 */
export interface SiteStats {
  /** Every listing we have analysed, ever. The headline credibility number. */
  totalCars: number;
  /** Listings a buyer can actually go and look at right now. */
  activeCars: number;
  /** Models with enough data to be modelled. */
  modelCount: number;
  /** ISO date of the last pipeline publish, e.g. "2026-08-04". */
  lastUpdated: string;
  /** Swedish long form for prose, e.g. "4 augusti 2026". */
  lastUpdatedLong: string;
}

const MONTHS = [
  "januari", "februari", "mars", "april", "maj", "juni",
  "juli", "augusti", "september", "oktober", "november", "december",
];

function longDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export async function getSiteStats(): Promise<SiteStats> {
  const sql = getDb();
  const [counts] = await sql`
    SELECT count(*)::int AS total,
           count(*) FILTER (WHERE is_active)::int AS active,
           count(DISTINCT model_key)::int AS models
    FROM cars_enriched
    WHERE model_key IS NOT NULL
      AND (exclusion_tags = '[]'::jsonb OR exclusion_tags IS NULL)`;
  const [updated] = await sql`
    SELECT to_char(max(updated_at), 'YYYY-MM-DD') AS d FROM web_cache`;

  const lastUpdated: string =
    updated?.d ?? new Date().toISOString().slice(0, 10);

  return {
    totalCars: counts?.total ?? 0,
    activeCars: counts?.active ?? 0,
    modelCount: counts?.models ?? 0,
    lastUpdated,
    lastUpdatedLong: longDate(lastUpdated),
  };
}

/** Swedish thousands separators, used wherever these numbers are rendered. */
export function sv(n: number): string {
  return new Intl.NumberFormat("sv-SE").format(n);
}
