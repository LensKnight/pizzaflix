"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  name: string;
  price: number;
  qty: number;
}

interface CartContextType {
  cart: CartItem[];
  addItem: (item: { name: string; price: number }) => void;
  removeItem: (name: string) => void;
  updateQty: (name: string, qty: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. Page load hone par localStorage se pehle se saved cart loading
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("pizzaflix_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // 2. Jab bhi cart state badlegi, localStorage update ho jaayega
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("pizzaflix_cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addItem = (item: { name: string; price: number }) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeItem = (name: string) => {
    setCart((prev) => prev.filter((i) => i.name !== name));
  };

  const updateQty = (name: string, qty: number) => {
    if (qty <= 0) return removeItem(name);
    setCart((prev) => prev.map((i) => (i.name === name ? { ...i, qty } : i)));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("pizzaflix_cart");
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQty, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}