"use client";

import { useCart, scatterPointId, type CartItemFromScatter } from "./CartContext";

interface ScatterPoint {
  age: number;
  price: number;
  mileage: number;
  year: number;
  fuel: string;
  hp: number;
  seller: string;
  predicted?: number;
  residual?: number;
  deal?: "good" | "great";
}

const FUEL_LABELS: Record<string, string> = {
  Hybrid: "Hybrid",
  PHEV: "Laddhybrid",
  Diesel: "Diesel",
  Petrol: "Bensin",
  Electric: "El",
};

const displayName = (key: string) => key.replace(/([a-z0-9])([A-Z])/g, "$1 $2");

interface Props {
  point: ScatterPoint | null;
  modelKey: string;
  modelLabel: string;
  onClose: () => void;
}

export default function CarDetailModal({ point, modelKey, modelLabel, onClose }: Props) {
  const { addItem, removeItem, isInCart } = useCart();

  if (!point) return null;

  const cartId = scatterPointId(modelKey, point);
  const inCart = isInCart(cartId);

  function handleToggle() {
    if (inCart) {
      removeItem(cartId);
    } else {
      const item: CartItemFromScatter = {
        cartId,
        source: "scatter",
        modelKey,
        modelLabel,
        age: point!.age,
        year: point!.year,
        price: point!.price,
        mileage: point!.mileage,
        fuel: point!.fuel,
        hp: point!.hp,
        seller: point!.seller,
        predicted: point!.predicted,
        residual: point!.residual,
        deal: point!.deal,
        addedAt: Date.now(),
      };
      addItem(item);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-xl border border-[var(--border)] shadow-xl max-w-sm w-full p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-[var(--foreground)]">{modelLabel}</h3>
            <p className="text-sm text-[var(--muted)]">{point.year} &middot; {FUEL_LABELS[point.fuel] || point.fuel}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--muted)] hover:text-[var(--foreground)] transition p-1"
          >
            <svg width={20} height={20} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-[var(--muted)]">Pris</span>
            <p className="font-mono font-semibold text-[var(--foreground)]">{point.price.toLocaleString("sv-SE")} kr</p>
          </div>
          <div>
            <span className="text-[var(--muted)]">Miltal</span>
            <p className="font-mono text-[var(--foreground)]">{point.mileage.toLocaleString("sv-SE")} mil</p>
          </div>
          <div>
            <span className="text-[var(--muted)]">Hästkrafter</span>
            <p className="font-mono text-[var(--foreground)]">{point.hp} hk</p>
          </div>
          <div>
            <span className="text-[var(--muted)]">Säljare</span>
            <p className="text-[var(--foreground)]">{point.seller === "dealer" ? "Handlare" : "Privat"}</p>
          </div>
          <div>
            <span className="text-[var(--muted)]">Ålder</span>
            <p className="font-mono text-[var(--foreground)]">{point.age} år</p>
          </div>
        </div>

        {/* Deal info */}
        {point.predicted != null && (
          <div className="bg-[var(--card)] rounded-lg p-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)]">Predikterat pris</span>
              <span className="font-mono text-[var(--foreground)]">{point.predicted.toLocaleString("sv-SE")} kr</span>
            </div>
            {point.residual != null && point.residual < 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">Under predikterat</span>
                <span className="font-mono font-semibold text-green-600">
                  {Math.abs(point.residual).toLocaleString("sv-SE")} kr
                </span>
              </div>
            )}
            {point.deal && (
              <div className="pt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  point.deal === "great"
                    ? "bg-green-100 text-green-700"
                    : "bg-green-50 text-green-600"
                }`}>
                  {point.deal === "great" ? "Fyndpris" : "Bra pris"}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-2">
          <button
            onClick={handleToggle}
            className={`w-full py-2.5 rounded-lg text-sm font-medium transition ${
              inCart
                ? "bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                : "bg-[var(--foreground)] text-white hover:opacity-90"
            }`}
          >
            {inCart ? "Ta bort ur köpkorg" : "Spara i köpkorg"}
          </button>
          <a
            href={`https://www.blocket.se/annonser/hela_sverige/fordon/bilar?q=${encodeURIComponent(modelLabel)}&cg=1020&mys=${point.year}&mye=${point.year}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2.5 rounded-lg text-sm font-medium text-center border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--card)] transition"
          >
            Sök på Blocket
          </a>
        </div>
      </div>
    </div>
  );
}
