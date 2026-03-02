"use client";

import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Värdeminskning", href: "/#depreciation" },
  { label: "Miltal", href: "/#mileage" },
  { label: "Ägandekostnad", href: "/tco" },
  { label: "Alla bilar", href: "/#explorer" },
  { label: "Artiklar", href: "/artiklar" },
];

export default function Nav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/tco") return pathname === "/tco";
    if (href === "/artiklar") return pathname.startsWith("/artiklar");
    return false;
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        <a href="/" className="text-xl font-bold tracking-tight shrink-0 text-[var(--foreground)]">
          Hela Notan
        </a>
        <div className="relative flex-1 min-w-0">
          <div className="flex gap-1 sm:gap-5 text-sm text-[var(--muted)] overflow-x-auto scrollbar-hide">
            {NAV_ITEMS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className={`whitespace-nowrap px-2 py-2 sm:px-0 sm:py-0 transition ${
                  isActive(href)
                    ? "text-[var(--foreground)] font-medium"
                    : "hover:text-[var(--foreground)]"
                }`}
              >
                {label}
              </a>
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[var(--background)]/95 to-transparent pointer-events-none sm:hidden" />
        </div>
      </div>
    </nav>
  );
}
