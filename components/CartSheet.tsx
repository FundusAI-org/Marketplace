"use client";

import { useCart } from "@/providers/cart.provider";
import { FC } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { updateCartItemQuantity, removeFromCart } from "@/actions/cart.actions";

interface CartSheetProps {}

const CartSheet: FC<CartSheetProps> = ({}) => {
  const { cart, refreshCart } = useCart();

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      const result = await updateCartItemQuantity(itemId, newQuantity);
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

  const handleRemoveItem = async (itemId: string) => {
    try {
      const result = await removeFromCart(itemId);
      if (result.success) {
        await refreshCart();
        toast.info("Item removed from cart");
      } else {
        toast.error(result.data || "Failed to remove item from cart");
      }
    } catch (error) {
      toast.error("An error occurred while removing the item");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative inline-flex">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>
          <span className="absolute bottom-0 right-0 inline-flex items-center rounded-full bg-primary px-2 py-1 text-xs font-semibold text-white">
            {cart?.items.length || 0}
          </span>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
          <SheetDescription>
            Edit Cart Items, remove items, or clear cart
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {cart?.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b pb-4"
            >
              <Image
                src={
                  item.medication.imageUrl ||
                  `/placeholder.svg?height=80&width=80`
                }
                alt={item.medication.name}
                width={50}
                height={50}
                className="rounded object-cover"
              />
              <div className="flex-grow">
                <h3 className="font-semibold">{item.medication.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {/* {item.medication.pharmacy.name} */}
                </p>
                <p className="font-bold">${Number(item.price).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    handleUpdateQuantity(item.id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span>{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    handleUpdateQuantity(item.id, item.quantity + 1)
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Link className="w-full" href="/checkout">
              <Button type="submit" className="w-full">
                Checkout
              </Button>
            </Link>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
