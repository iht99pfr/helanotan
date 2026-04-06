"use client";

import { useState } from "react";
import { useCart } from "./CartContext";
import CartDrawer from "./CartDrawer";

export default function CartButton() {
  const { itemCount } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setDrawerOpen(true)}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-300 ${
          itemCount > 0
            ? "bg-[var(--foreground)] text-white hover:opacity-90 scale-100"
            : "bg-[var(--card)] text-[var(--muted)] border border-[var(--border)] hover:border-[var(--muted)] scale-95 opacity-70 hover:opacity-100"
        }`}
      >
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
        {itemCount > 0 && (
          <span className="text-sm font-semibold">{itemCount}</span>
        )}
      </button>
      <CartDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
