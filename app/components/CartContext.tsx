"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface CartItemBase {
  cartId: string;
  modelKey: string;
  modelLabel: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  hp: number;
  seller: string;
  predicted?: number;
  residual?: number;
  deal?: string | null;
  addedAt: number;
}

export interface CartItemFromScatter extends CartItemBase {
  source: "scatter";
  age: number;
}

export interface CartItemFromTable extends CartItemBase {
  source: "table";
  blocketId: string;
  url: string;
  make: string;
  model: string;
}

export type CartItem = CartItemFromScatter | CartItemFromTable;

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (cartId: string) => void;
  isInCart: (cartId: string) => boolean;
  clearCart: () => void;
  itemCount: number;
}

const CartCtx = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  isInCart: () => false,
  clearCart: () => {},
  itemCount: 0,
});

export function useCart() {
  return useContext(CartCtx);
}

const STORAGE_KEY = "helanotan_cart";
const MAX_ITEMS = 50;

function loadFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function saveToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function scatterPointId(modelKey: string, p: { year: number; price: number; mileage: number; hp: number; fuel: string; seller: string }): string {
  return `s-${modelKey}-${p.year}-${p.price}-${p.mileage}-${p.hp}-${p.fuel}-${p.seller}`;
}

export function tableItemId(blocketId: string): string {
  return `t-${blocketId}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(loadFromStorage());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveToStorage(items);
  }, [items, loaded]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.cartId === item.cartId)) return prev;
      if (prev.length >= MAX_ITEMS) return prev;
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((cartId: string) => {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId));
  }, []);

  const isInCart = useCallback((cartId: string) => {
    return items.some((i) => i.cartId === cartId);
  }, [items]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <CartCtx.Provider value={{ items, addItem, removeItem, isInCart, clearCart, itemCount: items.length }}>
      {children}
    </CartCtx.Provider>
  );
}
