import {
  accountsTable,
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
  customersTable,
  adminsTable,
} from "@/db/schema";

export type Account = typeof accountsTable.$inferSelect & {
  customer?: Omit<Customer, "id">;
  admin?: Omit<Admin, "id">;
  pharmacy?: Omit<
    Pharmacy,
    "id" | "slug" | "address" | "city" | "state" | "zipCode"
  >;
};
export type Session = typeof sessionsTable.$inferSelect;
export type Customer = typeof customersTable.$inferSelect;
export type Admin = typeof adminsTable.$inferSelect;
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
