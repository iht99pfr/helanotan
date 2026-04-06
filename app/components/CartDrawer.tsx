"use client";

import { useCart, type CartItem } from "./CartContext";

const FUEL_LABELS: Record<string, string> = {
  Hybrid: "Hybrid",
  PHEV: "Laddhybrid",
  Diesel: "Diesel",
  Petrol: "Bensin",
  Electric: "El",
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function CartItemCard({ item, onRemove }: { item: CartItem; onRemove: () => void }) {
  return (
    <div className={`p-3 border border-[var(--border)] rounded-lg space-y-1 ${
      item.deal === "great" ? "bg-green-50/60" : item.deal === "good" ? "bg-green-50/30" : "bg-white"
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-sm text-[var(--foreground)]">{item.modelLabel}</p>
          <p className="text-xs text-[var(--muted)]">
            {item.year} &middot; {FUEL_LABELS[item.fuel] || item.fuel} &middot; {item.mileage.toLocaleString("sv-SE")} mil
          </p>
        </div>
        <button
          onClick={onRemove}
          className="text-[var(--muted)] hover:text-red-500 transition p-0.5"
          title="Ta bort"
        >
          <svg width={16} height={16} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-mono font-semibold text-sm text-[var(--foreground)]">
          {item.price.toLocaleString("sv-SE")} kr
        </span>
        <div className="flex items-center gap-2">
          {item.deal === "great" && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">Fyndpris</span>
          )}
          {item.deal === "good" && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-50 text-green-600">Bra pris</span>
          )}
        </div>
      </div>
      {item.residual != null && item.residual < 0 && (
        <p className="text-xs text-green-600 font-medium">
          {Math.abs(item.residual).toLocaleString("sv-SE")} kr under predikterat
        </p>
      )}
      <div className="pt-1">
        <a
          href={item.source === "table"
            ? item.url
            : `https://www.blocket.se/annonser/hela_sverige/fordon/bilar?q=${encodeURIComponent(item.modelLabel)}&cg=1020&mys=${item.year}&mye=${item.year}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Visa på Blocket
        </a>
      </div>
    </div>
  );
}

export default function CartDrawer({ isOpen, onClose }: Props) {
  const { items, removeItem, clearCart } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-[var(--background)] border-l border-[var(--border)] shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-bold text-[var(--foreground)]">
            Köpkorg ({items.length})
          </h2>
          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-500 hover:text-red-700 transition"
              >
                Rensa alla
              </button>
            )}
            <button
              onClick={onClose}
              className="text-[var(--muted)] hover:text-[var(--foreground)] transition p-1"
            >
              <svg width={20} height={20} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-65px)] p-4 space-y-2">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[var(--muted)] text-sm">Din köpkorg är tom.</p>
              <p className="text-[var(--muted)] text-xs mt-2">
                Klicka på en punkt i grafen eller spara en bil från listan.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <CartItemCard
                key={item.cartId}
                item={item}
                onRemove={() => removeItem(item.cartId)}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
