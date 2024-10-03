"use client";

import { FC, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Medication, Pharmacy } from "@/types/db.types";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Plus, Minus } from "lucide-react";
import { addToCart, updateCartItemQuantity } from "@/actions/cart.actions";
import { useCart } from "@/providers/cart.provider";
import { SearchResult } from "@/services/search.service";

interface MedicationCardProps {
  medication: SearchResult["medications"][0];
}

const MedicationCard: FC<MedicationCardProps> = ({ medication }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { cart, refreshCart } = useCart();

  const cartItem = cart?.items.find(
    (item) => item.medicationId === medication.id,
  );

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    setIsAddingToCart(true);
    try {
      const data = await addToCart(medication.id, 1);

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

  return (
    <Card className="flex h-full flex-col">
      <Link href={`/medication/${medication.slug}`} className="flex-grow">
        <CardContent className="p-4">
          <div className="relative mb-4 aspect-square">
            <Image
              src={
                medication.imageUrl || `/placeholder.svg?height=200&width=200`
              }
              alt={medication.name}
              fill
              className="rounded object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <h3 className="mb-2 line-clamp-2 font-semibold">{medication.name}</h3>
          <p className="mb-2 line-clamp-1 text-sm text-muted-foreground">
            {medication.pharmacy.name}
          </p>
          <p className="font-bold">${Number(medication.price).toFixed(2)}</p>
        </CardContent>
      </Link>
      <CardFooter>
        {cartItem ? (
          <div className="flex w-full items-center justify-between">
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
          </div>
        ) : (
          <Button
            className="w-full"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            aria-label={`Add ${medication.name} to cart`}
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
      </CardFooter>
    </Card>
  );
};

export default MedicationCard;
