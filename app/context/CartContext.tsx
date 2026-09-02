"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  id: string; // Unique ID for the cart item (usually productId + options hash)
  productId: string | number;
  productSlug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  options?: Record<string, string>;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("romiz_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from local storage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("romiz_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const generateItemId = (productId: string | number, options?: Record<string, string>) => {
    if (!options || Object.keys(options).length === 0) return `${productId}`;
    
    // Sort keys for a stable ID regardless of insertion order
    const sortedKeys = Object.keys(options).sort();
    const sortedOptions = sortedKeys.map(key => {
      // Truncate long values (e.g. upload URLs) to first 100 chars
      const v = options[key] ?? "";
      const truncated = v.length > 100 ? v.slice(0, 100) : v;
      return `${key}:${truncated}`;
    }).join("|");
    return `${productId}-${sortedOptions}`;
  };

  const addItem = (newItem: Omit<CartItem, "id">) => {
    setItems((prevItems) => {
      const itemId = generateItemId(newItem.productId, newItem.options);

      // Check if this exact item (with same options) already exists
      const existingItemIndex = prevItems.findIndex((item) => item.id === itemId);

      if (existingItemIndex >= 0) {
        // Exact same product + exact same options → increment quantity (immutable update)
        return prevItems.map((item, idx) =>
          idx === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        // Add new item
        return [...prevItems, { ...newItem, id: itemId }];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
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
