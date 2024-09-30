"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SelectCart, SelectCartItem } from "@/db/schema";
import { getCart } from "@/actions/cart.actions";
import { useSession } from "./session.provider";

interface CartWithItems extends SelectCart {
  items: SelectCartItem[];
}

interface CartContextType {
  cart: CartWithItems | null;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{
  children: React.ReactNode;
  initialValue: CartWithItems | null;
}> = ({ children, initialValue }) => {
  const [cart, setCart] = useState<CartWithItems | null>(initialValue);

  const { user } = useSession();

  const refreshCart = async () => {
    try {
      const data = await getCart();

      if (!data.success) {
        throw new Error("Failed to fetch cart");
      }

      setCart(data.data);
    } catch (error) {
      console.error("Error refreshing cart:", error);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  useEffect(() => {
    if (user) {
      refreshCart();
    }
  }, [user]);

  return (
    <CartContext.Provider value={{ cart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};
