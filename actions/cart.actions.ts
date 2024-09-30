"use server";

import cartService from "@/services/cart.service";

export const getCart = async () => {
  return cartService.getCart();
};

export const addToCart = async (medicationId: string, quantity: number) => {
  return cartService.addToCart(medicationId, quantity);
};

export const removeFromCart = async (cartItemId: string) => {
  return cartService.removeFromCart(cartItemId);
};

export const updateCartItemQuantity = async (
  cartItemId: string,
  quantity: number,
) => {
  return cartService.updateCartItemQuantity(cartItemId, quantity);
};

export const clearCart = async () => {
  return cartService.clearCart();
};
