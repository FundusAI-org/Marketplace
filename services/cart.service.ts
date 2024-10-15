import { db } from "@/db";
import { cartTable, cartItemsTable, medicationsTable } from "@/db/schema";
import { Response } from "@/types/axios.types";
import { SelectCart, SelectCartItem } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { validateRequest } from "@/lucia";
import { Medication } from "@/types/db.types";

interface CartWithItems extends SelectCart {
  items: (SelectCartItem & { medication: Medication })[];
}

class CartService {
  async getCart(): Promise<Response<CartWithItems | null>> {
    try {
      const { account: user } = await validateRequest();
      if (!user || !user.customer) {
        return {
          success: false,
          data: "Unauthorized",
        };
      }

      const cart = await db.query.cartTable.findFirst({
        where: eq(cartTable.customerId, user.id),
        with: {
          cartItems: {
            with: {
              medication: true,
            },
          },
        },
      });

      if (!cart) {
        const [newCart] = await db
          .insert(cartTable)
          .values({ customerId: user.id })
          .returning();
        return {
          success: true,
          data: { ...newCart, items: [] },
        };
      }

      return {
        success: true,
        data: {
          ...cart,
          items: cart.cartItems.sort(
            (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
          ),
        },
      };
    } catch (error: any) {
      console.error("Get cart error:", error);
      return {
        success: false,
        data: error.message || null,
      };
    }
  }

  async addToCart(
    medicationId: string,
    quantity: number,
  ): Promise<Response<SelectCartItem | null>> {
    try {
      const { account: user } = await validateRequest();
      if (!user) {
        return {
          success: false,
          data: "Unauthorized",
        };
      }

      let cart = await db.query.cartTable.findFirst({
        where: eq(cartTable.customerId, user.id),
      });

      if (!cart) {
        [cart] = await db
          .insert(cartTable)
          .values({ customerId: user.id })
          .returning();
      }

      const existingItem = await db.query.cartItemsTable.findFirst({
        where: and(
          eq(cartItemsTable.cartId, cart.id),
          eq(cartItemsTable.medicationId, medicationId),
        ),
      });

      if (existingItem) {
        const [updatedItem] = await db
          .update(cartItemsTable)
          .set({ quantity: existingItem.quantity + quantity })
          .where(eq(cartItemsTable.id, existingItem.id))
          .returning();
        return {
          success: true,
          data: updatedItem,
        };
      } else {
        const medication = await db.query.medicationsTable.findFirst({
          where: eq(medicationsTable.id, medicationId),
        });

        if (!medication) {
          return {
            success: false,
            data: null,
          };
        }

        const [newItem] = await db
          .insert(cartItemsTable)
          .values({
            cartId: cart.id,
            medicationId,
            quantity,
            price: medication.price,
          })
          .returning();

        return {
          success: true,
          data: newItem,
        };
      }
    } catch (error: any) {
      console.error("Add to cart error:", error);
      return {
        success: false,
        data: error.message || null,
      };
    }
  }

  async removeFromCart(cartItemId: string): Promise<Response<boolean>> {
    try {
      const { account: user } = await validateRequest();
      if (!user) {
        return {
          success: false,
          data: "Unauthorized",
        };
      }

      const cart = await db.query.cartTable.findFirst({
        where: eq(cartTable.customerId, user.id),
      });

      if (!cart) {
        return {
          success: false,
          data: "Error fetching cart",
        };
      }

      const result = await db
        .delete(cartItemsTable)
        .where(
          and(
            eq(cartItemsTable.id, cartItemId),
            eq(cartItemsTable.cartId, cart.id),
          ),
        );

      return {
        success: true,
        data: result.rowCount > 0,
      };
    } catch (error: any) {
      console.error("Remove from cart error:", error);
      return {
        success: false,
        data: "Error removing from cart",
      };
    }
  }

  async updateCartItemQuantity(
    cartItemId: string,
    quantity: number,
  ): Promise<Response<SelectCartItem | null>> {
    try {
      const { account: user } = await validateRequest();
      if (!user) {
        return {
          success: false,
          data: "Unauthorized",
        };
      }

      const cart = await db.query.cartTable.findFirst({
        where: eq(cartTable.customerId, user.id),
      });

      if (!cart) {
        return {
          success: false,
          data: null,
        };
      }

      const [updatedItem] = await db
        .update(cartItemsTable)
        .set({ quantity })
        .where(
          and(
            eq(cartItemsTable.id, cartItemId),
            eq(cartItemsTable.cartId, cart.id),
          ),
        )
        .returning();

      if (!updatedItem) {
        return {
          success: false,
          data: null,
        };
      }

      return {
        success: true,
        data: updatedItem,
      };
    } catch (error: any) {
      console.error("Update cart item quantity error:", error);
      return {
        success: false,
        data: null,
      };
    }
  }

  async clearCart(): Promise<Response<boolean>> {
    try {
      const { account: user } = await validateRequest();
      if (!user) {
        return {
          success: false,
          data: "Unauthorized",
        };
      }

      const cart = await db.query.cartTable.findFirst({
        where: eq(cartTable.customerId, user.id),
      });

      if (!cart) {
        return {
          success: false,
          data: "Error fetching cart",
        };
      }

      await db.delete(cartItemsTable).where(eq(cartItemsTable.cartId, cart.id));

      return {
        success: true,
        data: true,
      };
    } catch (error: any) {
      console.error("Clear cart error:", error);
      return {
        success: false,
        data: "Error clearing cart",
      };
    }
  }
}

export default new CartService();
