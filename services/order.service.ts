// import { db } from "@/db";
// import { eq, and, desc, inArray } from "drizzle-orm";
// import {
//   ordersTable,
//   orderItemsTable,
//   medicationsTable,
//   usersTable,
//   cartTable,
//   cartItemsTable,
// } from "@/db/schema";
// import { v4 as uuidv4 } from "uuid";
// import { validateRequest } from "@/lucia";

// export interface CreateOrderInput {
//   userId: string;
//   items: Array<{ id: string; quantity: number }>;
//   fundusPointsUsed?: number;
//   solanaTransactionId?: string;
//   tradtionalTransactionId?: string;
// }

// export interface OrderWithItems {
//   id: string;
//   status: string;
//   totalAmount: number;
//   fundusPointsUsed: number;
//   createdAt: Date;
//   updatedAt: Date;
//   items: Array<{
//     id: string;
//     orderId: string;
//     medicationId: string;
//     quantity: number;
//     price: number;
//     medicationName: string;
//   }>;
// }

// class OrderService {
//   async createOrder(input: CreateOrderInput): Promise<string> {
//     const { user } = await validateRequest();
//     if (!user) {
//       throw new Error("Unauthorized");
//     }

//     return await db.transaction(async (tx) => {
//       const orderItems = [];
//       let totalAmount = 0;
//       const medicationIds = input.items.map((item) => item.id);

//       const medications = await tx
//         .select({
//           id: medicationsTable.id,
//           price: medicationsTable.price,
//           name: medicationsTable.name,
//         })
//         .from(medicationsTable)
//         .where(inArray(medicationsTable.id, medicationIds));

//       const medicationMap = new Map(
//         medications.map((m) => [m.id, { price: m.price, name: m.name }]),
//       );

//       for (const item of input.items) {
//         const medication = medicationMap.get(item.id);
//         if (!medication) {
//           throw new Error(`Medication not found: ${item.id}`);
//         }

//         const itemTotal = Number(medication.price) * item.quantity;
//         totalAmount += itemTotal;

//         orderItems.push({
//           id: uuidv4(),
//           medicationId: item.id,
//           quantity: item.quantity,
//           price: medication.price,
//         });
//       }

//       const [order] = await tx
//         .insert(ordersTable)
//         .values({
//           userId: input.userId,

//           totalAmount: totalAmount.toString(),
//           fundusPointsUsed: input.fundusPointsUsed || 0,
//         })
//         .returning();

//       await tx.insert(orderItemsTable).values(
//         orderItems.map((item) => ({
//           ...item,
//           orderId: order.id,
//         })),
//       );

//       // Remove items from cart
//       await this.removeItemsFromCart(tx, input.userId, medicationIds);

//       // Update user's fundus points if used
//       if (input.fundusPointsUsed) {
//         await tx
//           .update(usersTable)
//           .set({
//             fundusPoints: user.fundusPoints - input.fundusPointsUsed,
//           })
//           .where(eq(usersTable.id, input.userId));
//       }

//       return order.id;
//     });
//   }

//   private async removeItemsFromCart(
//     tx: any,
//     userId: string,
//     medicationIds: string[],
//   ) {
//     const userCart = await tx
//       .select({ id: cartTable.id })
//       .from(cartTable)
//       .where(eq(cartTable.userId, userId))
//       .limit(1);

//     if (userCart.length === 0) {
//       return; // No cart found, nothing to remove
//     }

//     const cartId = userCart[0].id;

//     await tx
//       .delete(cartItemsTable)
//       .where(
//         and(
//           eq(cartItemsTable.cartId, cartId),
//           inArray(cartItemsTable.medicationId, medicationIds),
//         ),
//       );
//   }

//   //   async getOrderById(orderId: string): Promise<OrderWithItems | null> {
//   //     const order = await db.query.ordersTable.findFirst({
//   //       where: eq(ordersTable.id, orderId),
//   //       with: {
//   //         items: {
//   //           with: {
//   //             medication: true,
//   //           },
//   //         },
//   //       },
//   //     });

//   //     if (!order) {
//   //       return null;
//   //     }

//   //     return {
//   //       ...order,
//   //       items: order.items.map((item) => ({
//   //         id: item.id,
//   //         orderId: item.orderId,
//   //         medicationId: item.medicationId,
//   //         quantity: item.quantity,
//   //         price: Number(item.price),
//   //         medicationName: item.medication.name,
//   //       })),
//   //     };
//   //   }

//   //   async getUserOrders(userId: string): Promise<OrderWithItems[]> {
//   //     const orders = await db.query.ordersTable.findMany({
//   //       where: eq(ordersTable.userId, userId),
//   //       with: {
//   //         items: {
//   //           with: {
//   //             medication: true,
//   //           },
//   //         },
//   //       },
//   //       orderBy: [desc(ordersTable.createdAt)],
//   //     });

//   //     return orders.map((order) => ({
//   //       ...order,
//   //       items: order.items.map((item) => ({
//   //         id: item.id,
//   //         orderId: item.orderId,
//   //         medicationId: item.medicationId,
//   //         quantity: item.quantity,
//   //         price: Number(item.price),
//   //         medicationName: item.medication.name,
//   //       })),
//   //     }));
//   //   }

//   //   async updateOrderStatus(
//   //     orderId: string,
//   //     status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
//   //   ): Promise<OrderWithItems | null> {
//   //     const [updatedOrder] = await db
//   //       .update(ordersTable)
//   //       .set({ status, updatedAt: new Date() })
//   //       .where(eq(ordersTable.id, orderId))
//   //       .returning();

//   //     if (!updatedOrder) {
//   //       return null;
//   //     }

//   //     return this.getOrderById(orderId);
//   //   }

//   //   async cancelOrder(orderId: string): Promise<OrderWithItems | null> {
//   //     return this.updateOrderStatus(orderId, "cancelled");
//   //   }

//   //   async getOrderTotal(orderId: string): Promise<number> {
//   //     const result = await db
//   //       .select({
//   //         total: db.sql<number>`SUM(${orderItemsTable.price} * ${orderItemsTable.quantity})`,
//   //       })
//   //       .from(orderItemsTable)
//   //       .where(eq(orderItemsTable.orderId, orderId));

//   //     return result[0]?.total || 0;
//   //   }

//   async isOrderOwnedByUser(orderId: string, userId: string): Promise<boolean> {
//     const order = await db.query.ordersTable.findFirst({
//       where: and(eq(ordersTable.id, orderId), eq(ordersTable.userId, userId)),
//     });

//     return !!order;
//   }

//   //   async getPharmacyOrders(pharmacyId: string): Promise<OrderWithItems[]> {
//   //     const orders = await db.query.ordersTable.findMany({
//   //       where: eq(ordersTable.pharmacyId, pharmacyId),
//   //       with: {
//   //         items: {
//   //           with: {
//   //             medication: true,
//   //           },
//   //         },
//   //       },
//   //       orderBy: [desc(ordersTable.createdAt)],
//   //     });

//   //     return orders.map((order) => ({
//   //       ...order,
//   //       items: order.items.map((item) => ({
//   //         id: item.id,
//   //         orderId: item.orderId,
//   //         medicationId: item.medicationId,
//   //         quantity: item.quantity,
//   //         price: Number(item.price),
//   //         medicationName: item.medication.name,
//   //       })),
//   //     }));
//   //   }
// }

// export const orderService = new OrderService();

import { db } from "@/db";
import { eq, and, desc, inArray } from "drizzle-orm";
import {
  ordersTable,
  orderItemsTable,
  medicationsTable,
  cartTable,
  cartItemsTable,
  solanaTransactionsTable,
  customersTable,
} from "@/db/schema";
import { v4 as uuidv4 } from "uuid";
import { validateRequest } from "@/lucia";

export interface CreateOrderInput {
  userId: string;
  items: Array<{ id: string; quantity: number }>;
  fundusPointsUsed?: number;
  solanaTransactionId?: string;
  traditionalTransactionId?: string;
  orderId: string;
}

export interface OrderWithItems {
  id: string;
  status: string;
  totalAmount: number;
  fundusPointsUsed: number;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    id: string;
    orderId: string;
    medicationId: string;
    quantity: number;
    price: number;
    medicationName: string;
  }>;
}

class OrderService {
  async createOrder(
    input: CreateOrderInput,
  ): Promise<{ success: boolean; orderId?: string }> {
    const { account: user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Step 1: Create the order
    const order = {
      id: input.orderId,
    };

    // Step 2: Create order items and calculate total amount
    const medicationIds = input.items.map((item) => item.id);
    const medications = await db
      .select({
        id: medicationsTable.id,
        price: medicationsTable.price,
        name: medicationsTable.name,
      })
      .from(medicationsTable)
      .where(inArray(medicationsTable.id, medicationIds));

    const medicationMap = new Map(
      medications.map((m) => [m.id, { price: m.price, name: m.name }]),
    );

    let totalAmount = 0;
    const orderItems = input.items.map((item) => {
      const medication = medicationMap.get(item.id);
      if (!medication) {
        throw new Error(`Medication not found: ${item.id}`);
      }

      const itemTotal = Number(medication.price) * item.quantity;
      totalAmount += itemTotal;

      return {
        id: uuidv4(),
        orderId: order.id,
        medicationId: item.id,
        quantity: item.quantity,
        price: medication.price,
      };
    });

    await db.insert(orderItemsTable).values(orderItems);

    // Step 3: Update order with total amount
    await db
      .update(ordersTable)
      .set({
        totalAmount: totalAmount.toString(),
        fundusPointsUsed: input.fundusPointsUsed,
      })
      .where(eq(ordersTable.id, order.id));

    // Step 4: Remove items from cart
    await this.removeItemsFromCart(input.userId, medicationIds);

    // Step 5: Update user's fundus points if used
    if (input.fundusPointsUsed) {
      await db
        .update(customersTable)
        .set({
          fundusPoints: user.customer.fundusPoints - input.fundusPointsUsed,
        })
        .where(eq(customersTable.id, input.userId));
    }

    // Step 6: Update Solana transaction with order ID if applicable
    if (input.solanaTransactionId) {
      await db
        .update(solanaTransactionsTable)
        .set({ orderId: order.id })
        .where(eq(solanaTransactionsTable.id, input.solanaTransactionId));
    }

    // Step 7: Handle traditional transaction ID if applicable
    if (input.traditionalTransactionId) {
      // Implement logic for traditional transaction if needed
      // This might involve updating a separate table for traditional payments
    }

    return { success: true, orderId: order.id };
  }

  private async removeItemsFromCart(userId: string, medicationIds: string[]) {
    await db.delete(cartTable).where(eq(cartTable.customerId, userId));
  }

  async isOrderOwnedByUser(orderId: string, userId: string): Promise<boolean> {
    const order = await db.query.ordersTable.findFirst({
      where: and(
        eq(ordersTable.id, orderId),
        eq(ordersTable.customerId, userId),
      ),
    });

    return !!order;
  }

  // Other methods (getOrderById, getUserOrders, updateOrderStatus, etc.) remain unchanged
}

export const orderService = new OrderService();
