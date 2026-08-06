"use client";

import { usePathname } from "next/navigation";
import { useCallback } from "react";
import Image from "next/image";
import { track } from "@/app/lib/track";

// Ten links produced 1.0 pages per session — nobody was navigating, and a
// menu that offers everything ranks nothing. These five are the questions a
// buyer actually arrives with. /fakta, /metod, /nyheter and /bevaka keep
// their URLs and stay linked from the footer and from in-page context.
const NAV_ITEMS = [
  { label: "Modeller", href: "/bilar" },
  { label: "Ägandekostnad", href: "/tco" },
  { label: "Köpguide", href: "/kopguide" },
  { label: "Toppen", href: "/toppen" },
  { label: "Artiklar", href: "/artiklar" },
];

export default function Nav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  // Auto-scroll active pill into view on mobile
  const activeRef = useCallback((node: HTMLAnchorElement | null) => {
    if (node) {
      node.scrollIntoView({ inline: "center", block: "nearest" });
    }
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-[var(--background)]/95 backdrop-blur-md">
      {/* Desktop: single row */}
      <div className="hidden sm:flex items-center gap-4 max-w-7xl mx-auto px-6 py-4 border-b border-[var(--border)]">
        <a href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/logo-cropped.png" alt="" width={35} height={28} className="shrink-0" />
          <span className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[var(--foreground)]">Hela Notan</span>
        </a>
        <div className="flex gap-6 text-sm text-[var(--muted)]">
          {NAV_ITEMS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => track("nav_click", { to: href, from: pathname })}
              className={`transition pb-1 -mb-1 border-b-2 ${
                isActive(href)
                  ? "text-[var(--foreground)] font-medium border-[var(--foreground)]"
                  : "border-transparent hover:text-[var(--foreground)]"
              }`}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Mobile: two rows — logo + scrollable tabs */}
      <div className="sm:hidden border-b border-[var(--border)]">
        <div className="px-4 pt-3 pb-2">
          <a href="/" className="flex items-center gap-2">
            <Image src="/logo-cropped.png" alt="" width={30} height={24} className="shrink-0" />
            <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--foreground)]">Hela Notan</span>
          </a>
        </div>
        <div className="relative">
          <div className="flex gap-1.5 px-3 pb-3 overflow-x-auto scrollbar-hide">
            {NAV_ITEMS.map(({ label, href }) => {
              const active = isActive(href);
              return (
                <a
                  key={href}
                  href={href}
                  ref={active ? activeRef : undefined}
                  onClick={() => track("nav_click", { to: href, from: pathname })}
                  className={`whitespace-nowrap text-xs font-medium px-3.5 py-1.5 rounded-full border transition ${
                    active
                      ? "bg-[var(--foreground)] text-white border-[var(--foreground)]"
                      : "bg-[var(--card)] text-[var(--muted)] border-[var(--border)] active:bg-[var(--border)]"
                  }`}
                >
                  {label}
                </a>
              );
            })}
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--background)]/95 to-transparent pointer-events-none" />
        </div>
      </div>
    </nav>
  );
}
