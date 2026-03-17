"use client";

import { usePathname } from "next/navigation";
import { useCallback } from "react";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "Värdeminskning", href: "/#depreciation" },
  { label: "Miltal", href: "/#mileage" },
  { label: "Ägandekostnad", href: "/tco" },
  { label: "Toppen", href: "/toppen" },
  { label: "Köpguide", href: "/kopguide" },
  { label: "Alla bilar", href: "/#explorer" },
  { label: "Bevaka", href: "/bevaka" },
  { label: "Fakta", href: "/fakta" },
  { label: "Artiklar", href: "/artiklar" },
  { label: "Nyheter", href: "/nyheter" },
];

export default function Nav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/tco") return pathname === "/tco";
    if (href === "/toppen") return pathname === "/toppen";
    if (href === "/kopguide") return pathname.startsWith("/kopguide");
    if (href === "/bevaka") return pathname === "/bevaka";
    if (href === "/fakta") return pathname === "/fakta";
    if (href === "/artiklar") return pathname.startsWith("/artiklar");
    if (href === "/nyheter") return pathname.startsWith("/nyheter");
    return false;
  }

  // Auto-scroll active pill into view on mobile
  const activeRef = useCallback((node: HTMLAnchorElement | null) => {
    if (node) {
      node.scrollIntoView({ inline: "center", block: "nearest" });
    }
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-[var(--background)]/95 backdrop-blur-md shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
      {/* Desktop: single row */}
      <div className="hidden sm:flex items-center gap-4 max-w-7xl mx-auto px-6 py-4 border-b border-[var(--border)]">
        <a href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/logo-cropped.png" alt="" width={35} height={28} className="shrink-0" />
          <span className="text-xl font-bold tracking-tight text-[var(--foreground)]">Hela Notan</span>
        </a>
        <div className="flex gap-5 text-sm text-[var(--muted)]">
          {NAV_ITEMS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className={`transition ${
                isActive(href)
                  ? "text-[var(--foreground)] font-medium"
                  : "hover:text-[var(--foreground)]"
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
            <span className="text-lg font-bold tracking-tight text-[var(--foreground)]">Hela Notan</span>
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
