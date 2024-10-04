"use server";

// import { orderService } from '@/services/OrderService';
import { validateRequest } from "@/lucia";
import { orderService } from "@/services/order.service";

export async function createOrder(
  items: Array<{ id: string; quantity: number }>,
  orderId: string,
  solanaTransactionId?: string,
  fundusPointsUsed?: number,
  tradtionalTransactionId?: string,
) {
  const { user } = await validateRequest();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const order = await orderService.createOrder({
      userId: user.id,
      items: items,
      fundusPointsUsed: fundusPointsUsed,
      solanaTransactionId: solanaTransactionId,
      orderId,
    });
    return { success: true, order };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to create order" };
  }
}

// export async function getUserOrders() {
//   const { user } = await validateRequest();
//   if (!user) {
//     return { success: false, error: 'Unauthorized' };
//   }

//   try {
//     const orders = await orderService.getUserOrders(user.id);
//     return { success: true, orders };
//   } catch (error) {
//     console.error('Error fetching user orders:', error);
//     return { success: false, error: 'Failed to fetch orders' };
//   }
// }

// export async function cancelOrder(orderId: string) {
//   const { user } = await validateRequest();
//   if (!user) {
//     return { success: false, error: 'Unauthorized' };
//   }

//   try {
//     const isOwner = await orderService.isOrderOwnedByUser(orderId, user.id);
//     if (!isOwner) {
//       return { success: false, error: 'Not authorized to cancel this order' };
//     }

//     const cancelledOrder = await orderService.cancelOrder(orderId);
//     return { success: true, order: cancelledOrder };
//   } catch (error) {
//     console.error('Error cancelling order:', error);
//     return { success: false, error: 'Failed to cancel order' };
//   }
// }

// export async function getPharmacyOrders(pharmacyId: string) {
//   const { user } = await validateRequest();
//   if (!user || user.role !== 'pharmacy') {
//     return { success: false, error: 'Unauthorized' };
//   }

//   try {
//     const orders = await orderService.getPharmacyOrders(pharmacyId);
//     return { success: true, orders };
//   } catch (error) {
//     console.error('Error fetching pharmacy orders:', error);
//     return { success: false, error: 'Failed to fetch orders' };
//   }
// }
