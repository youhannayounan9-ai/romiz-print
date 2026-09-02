"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CartItem {
  /** Unique cart LINE-ITEM id — composite of product + all custom attributes */
  cartItemId: string;
  /** The underlying product's ID (not unique per cart row) */
  productId: string | number;
  productSlug: string;
  name: string;
  /** Default product image (used as fallback) */
  image: string;
  /** URL of the customer's uploaded design file, if any */
  uploadedImage?: string;
  price: number;
  quantity: number;
  /** All other options (size, color, meters, etc.) */
  options?: Record<string, string>;
}

/** Shape passed to addItem — cartItemId is generated internally */
export type NewCartItem = Omit<CartItem, "cartItemId"> & { cartItemId?: string };

interface CartContextType {
  items: CartItem[];
  addItem: (item: NewCartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

// ─── Composite key generator ──────────────────────────────────────────────────

/**
 * Build a stable, unique cart line-item ID from all attributes that matter
 * for product identity. Any difference in size, color, custom design or
 * uploaded image produces a different key → separate row in cart.
 */
function generateCartItemId(item: NewCartItem): string {
  const size = item.options?.["size"] || item.options?.["Size"] || "";
  const color = item.options?.["color"] || item.options?.["Color"] || "";
  const customDesign = item.options?.["custom design"] || item.options?.["Custom Design"] || "";
  const uploadedImage = item.uploadedImage || "";

  // Use first 120 chars of uploaded URL so different files still differ
  const imageKey = uploadedImage.slice(0, 120);

  return [
    String(item.productId),
    size,
    color,
    customDesign,
    imageKey,
  ].join("‖"); // use unusual separator to avoid accidental collisions
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("romiz_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("romiz_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  // ── addItem ────────────────────────────────────────────────────────────────

  const addItem = (newItem: NewCartItem) => {
    setItems((prev) => {
      const cartItemId = newItem.cartItemId ?? generateCartItemId(newItem);

      const existingIdx = prev.findIndex((i) => i.cartItemId === cartItemId);

      if (existingIdx >= 0) {
        // Same product + identical options → increment quantity only
        return prev.map((item, idx) =>
          idx === existingIdx
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }

      // Any difference → new distinct line item
      return [...prev, { ...newItem, cartItemId }];
    });
  };

  // ── removeItem ─────────────────────────────────────────────────────────────

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  // ── updateQuantity ─────────────────────────────────────────────────────────

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.cartItemId === cartItemId ? { ...i, quantity } : i))
    );
  };

  // ── clearCart ──────────────────────────────────────────────────────────────

  const clearCart = () => setItems([]);

  // ── Derived values ─────────────────────────────────────────────────────────

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal   = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
