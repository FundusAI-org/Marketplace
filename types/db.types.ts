import {
  usersTable,
  sessionsTable,
  medicationsTable,
  pharmaciesTable,
  pharmacyInventoryTable,
  ordersTable,
  orderItemsTable,
  healthLogsTable,
  reviewsTable,
  cartTable,
  cartItemsTable,
} from "@/db/schema";

export type User = typeof usersTable.$inferSelect;
export type Session = typeof sessionsTable.$inferSelect;
export type Medication = typeof medicationsTable.$inferSelect;
export type Pharmacy = typeof pharmaciesTable.$inferSelect;
export type PharmacyInventory = typeof pharmacyInventoryTable.$inferSelect;
export type Order = typeof ordersTable.$inferSelect;
export type OrderItem = typeof orderItemsTable.$inferSelect;
export type HealthLog = typeof healthLogsTable.$inferSelect;
export type Review = typeof reviewsTable.$inferSelect;
export type Cart = typeof cartTable.$inferSelect;
export type CartItem = typeof cartItemsTable.$inferSelect;

// Enum types
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
export type UserRole = "customer" | "admin" | "pharmacy";
