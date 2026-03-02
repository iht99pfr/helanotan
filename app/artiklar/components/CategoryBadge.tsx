import type { ArticleCategory } from "../data/types";
import { CATEGORY_SINGULAR } from "../data/types";

const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  Modellguider: "bg-blue-50 text-blue-700 border-blue-200",
  Jamforelser: "bg-amber-50 text-amber-700 border-amber-200",
  Marknadsanalyser: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Sa funkar det": "bg-purple-50 text-purple-700 border-purple-200",
};

export default function CategoryBadge({
  category,
}: {
  category: ArticleCategory;
}) {
  return (
    <span
      className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border ${CATEGORY_COLORS[category]}`}
    >
      {CATEGORY_SINGULAR[category]}
    </span>
  );
}
