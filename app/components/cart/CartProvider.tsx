"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = { slug: string; name: string; image: string; price: number; quantity: number; size: string; href: string };
type CartContextValue = { items: CartItem[]; count: number; addItem: (item: Omit<CartItem, "quantity">, quantity: number) => void; removeItem: (slug: string, size: string) => void };
const CartContext = createContext<CartContextValue | null>(null);
const key = "furnitureCoCart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem(key) || "[]")); } catch { localStorage.removeItem(key); } }, []);
  useEffect(() => { localStorage.setItem(key, JSON.stringify(items)); }, [items]);
  const value = useMemo(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    addItem: (item: Omit<CartItem, "quantity">, quantity: number) => setItems((current) => {
      const existing = current.find((entry) => entry.slug === item.slug && entry.size === item.size);
      return existing ? current.map((entry) => entry === existing ? { ...entry, quantity: entry.quantity + quantity } : entry) : [...current, { ...item, quantity }];
    }),
    removeItem: (slug: string, size: string) => setItems((current) => current.filter((item) => !(item.slug === slug && item.size === size))),
  }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() { const context = useContext(CartContext); if (!context) throw new Error("useCart must be used inside CartProvider"); return context; }
