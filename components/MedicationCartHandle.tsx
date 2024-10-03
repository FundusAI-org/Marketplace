"use client";

import { FC, useState } from "react";

import { Button } from "./ui/button";

import { toast } from "sonner";
import { Loader2, Plus, Minus } from "lucide-react";
import {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
} from "@/actions/cart.actions";
import { useCart } from "@/providers/cart.provider";

interface MedicationCartHandleProps {
  id: string;
  name: string;
}

const MedicationCartHandle: FC<MedicationCartHandleProps> = ({
  name: medicationName,
  id: medicationId,
}) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { cart, refreshCart } = useCart();

  const cartItem = cart?.items.find(
    (item) => item.medicationId === medicationId,
  );

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    setIsAddingToCart(true);
    try {
      const data = await addToCart(medicationId, 1);

      if (data.success) {
        await refreshCart();
        toast.info("Added to cart successfully");
      } else {
        toast.error(data.data.toString() || "Failed to add to cart");
      }
    } catch (error) {
      toast.error("An error occurred while adding to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (!cartItem) return;

    try {
      const result = await updateCartItemQuantity(cartItem.id, newQuantity);
      if (result.success) {
        await refreshCart();
        toast.info("Cart updated successfully");
      } else {
        toast.error(result.data.toString() || "Failed to update cart");
      }
    } catch (error) {
      toast.error("An error occurred while updating the cart");
    }
  };

  const handleRemoveFromCart = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    if (!cartItem) return;

    try {
      const result = await removeFromCart(cartItem.id);
      if (result.success) {
        await refreshCart();
        toast.info("Removed from cart successfully");
      } else {
        toast.error(result.data.toString() || "Failed to remove from cart");
      }
    } catch (error) {
      toast.error("An error occurred while removing from cart");
    }
  };

  return (
    <>
      {cartItem ? (
        <div className="flex w-full max-w-xs items-center justify-between gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-muted-foreground">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem.quantity - 1)}
            disabled={cartItem.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span>{cartItem.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button size="sm" type="reset" onClick={handleRemoveFromCart}>
            Remove
          </Button>
        </div>
      ) : (
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          aria-label={`Add ${medicationName} to cart`}
        >
          {isAddingToCart ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            "Add to Cart"
          )}
        </Button>
      )}
    </>
  );
};

export default MedicationCartHandle;
