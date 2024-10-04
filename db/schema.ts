import {
  pgTable,
  uuid,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const userRoleEnum = pgEnum("user_role", [
  "customer",
  "admin",
  "pharmacy",
]);

export const solanaTransactionStatusEnum = pgEnum("solana_transaction_status", [
  "pending",
  "completed",
  "failed",
]);

// Users table
export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: userRoleEnum("role").default("customer").notNull(),
  fundusPoints: integer("fundus_points").notNull(),
  solanaWalletAddress: text("solana_wallet_address").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Sessions table
export const sessionsTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Medications table
export const medicationsTable = pgTable("medications", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  inStock: boolean("in_stock").default(true).notNull(),
  imageUrl: text("image_url").notNull(),
  sideEffect: text("side_effect").notNull(),
  details: text("details").notNull(),
  usage: text("usage").notNull(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  pharmacyId: uuid("pharmacy_id")
    .notNull()
    .references(() => pharmaciesTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Pharmacies table
export const pharmaciesTable = pgTable("pharmacies", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Pharmacy Inventory table
export const pharmacyInventoryTable = pgTable("pharmacy_inventory", {
  id: uuid("id").defaultRandom().primaryKey(),
  pharmacyId: uuid("pharmacy_id")
    .notNull()
    .references(() => pharmaciesTable.id, { onDelete: "cascade" }),
  medicationId: uuid("medication_id")
    .notNull()
    .references(() => medicationsTable.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Orders table
export const ordersTable = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  status: orderStatusEnum("status").default("pending").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  fundusPointsUsed: integer("fundus_points_used").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Order Items table
export const orderItemsTable = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => ordersTable.id, { onDelete: "cascade" }),
  medicationId: uuid("medication_id")
    .notNull()
    .references(() => medicationsTable.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Health Logs table
export const healthLogsTable = pgTable("health_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  bloodSugar: decimal("blood_sugar", { precision: 5, scale: 2 }),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  bloodPressureSystolic: integer("blood_pressure_systolic"),
  bloodPressureDiastolic: integer("blood_pressure_diastolic"),
  notes: text("notes"),
  logDate: date("log_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Reviews table
export const reviewsTable = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  medicationId: uuid("medication_id")
    .notNull()
    .references(() => medicationsTable.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Cart table
export const cartTable = pgTable("cart", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id") // Change this from text to uuid
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Cart Items table
export const cartItemsTable = pgTable("cart_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  cartId: uuid("cart_id")
    .notNull()
    .references(() => cartTable.id, { onDelete: "cascade" }),
  medicationId: uuid("medication_id")
    .notNull()
    .references(() => medicationsTable.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Solana Transactions
export const solanaTransactionsTable = pgTable("solana_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  orderId: uuid("order_id")
    .references(() => ordersTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  amountSOL: decimal("amount_sol", { precision: 20, scale: 9 }).notNull(),
  signature: text("signature").notNull().unique(),
  status: solanaTransactionStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Add relations for the new table
export const solanaTransactionsRelations = relations(
  solanaTransactionsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [solanaTransactionsTable.userId],
      references: [usersTable.id],
    }),
    order: one(ordersTable, {
      fields: [solanaTransactionsTable.orderId],
      references: [ordersTable.id],
    }),
  }),
);

// Relations
export const usersRelations = relations(usersTable, ({ many, one }) => ({
  orders: many(ordersTable),
  healthLogs: many(healthLogsTable),
  pharmacy: one(pharmaciesTable, {
    fields: [usersTable.id],
    references: [pharmaciesTable.userId],
  }),
  cart: one(cartTable),
  solanaTransactions: many(solanaTransactionsTable),
}));

export const medicationsRelations = relations(
  medicationsTable,
  ({ many, one }) => ({
    orderItems: many(orderItemsTable),
    pharmacyInventory: many(pharmacyInventoryTable),
    cartItems: many(cartItemsTable),
    reviews: many(reviewsTable),
    createdBy: one(usersTable, {
      fields: [medicationsTable.createdBy],
      references: [usersTable.id],
    }),
    pharmacy: one(pharmaciesTable, {
      fields: [medicationsTable.pharmacyId],
      references: [pharmaciesTable.id],
    }),
  }),
);

export const pharmaciesRelations = relations(
  pharmaciesTable,
  ({ many, one }) => ({
    orders: many(ordersTable),
    user: one(usersTable, {
      fields: [pharmaciesTable.userId],
      references: [usersTable.id],
    }),
    inventory: many(pharmacyInventoryTable),
  }),
);

export const ordersRelations = relations(ordersTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [ordersTable.userId],
    references: [usersTable.id],
  }),
  orderItems: many(orderItemsTable),
}));

export const orderItemsRelations = relations(orderItemsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [orderItemsTable.orderId],
    references: [ordersTable.id],
  }),
  medication: one(medicationsTable, {
    fields: [orderItemsTable.medicationId],
    references: [medicationsTable.id],
  }),
}));

export const cartRelations = relations(cartTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [cartTable.userId],
    references: [usersTable.id],
  }),
  cartItems: many(cartItemsTable),
}));

export const cartItemsRelations = relations(cartItemsTable, ({ one }) => ({
  cart: one(cartTable, {
    fields: [cartItemsTable.cartId],
    references: [cartTable.id],
  }),
  medication: one(medicationsTable, {
    fields: [cartItemsTable.medicationId],
    references: [medicationsTable.id],
  }),
}));

export const healthLogsRelations = relations(healthLogsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [healthLogsTable.userId],
    references: [usersTable.id],
  }),
}));

export const reviewsRelations = relations(reviewsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [reviewsTable.userId],
    references: [usersTable.id],
  }),
  medication: one(medicationsTable, {
    fields: [reviewsTable.medicationId],
    references: [medicationsTable.id],
  }),
}));

// Types
export type InsertUser = typeof usersTable.$inferInsert & {
  role: (typeof usersTable.$inferSelect)["role"];
};

export type SelectUser = typeof usersTable.$inferSelect;

export type InsertMedication = typeof medicationsTable.$inferInsert;
export type SelectMedication = typeof medicationsTable.$inferSelect;

export type InsertPharmacy = typeof pharmaciesTable.$inferInsert;
export type SelectPharmacy = typeof pharmaciesTable.$inferSelect;

export type InsertPharmacyInventory =
  typeof pharmacyInventoryTable.$inferInsert;
export type SelectPharmacyInventory =
  typeof pharmacyInventoryTable.$inferSelect;

export type InsertOrder = typeof ordersTable.$inferInsert;
export type SelectOrder = typeof ordersTable.$inferSelect;

export type InsertOrderItem = typeof orderItemsTable.$inferInsert;
export type SelectOrderItem = typeof orderItemsTable.$inferSelect;

export type InsertHealthLog = typeof healthLogsTable.$inferInsert;
export type SelectHealthLog = typeof healthLogsTable.$inferSelect;

export type InsertReview = typeof reviewsTable.$inferInsert;
export type SelectReview = typeof reviewsTable.$inferSelect;

export type InsertCart = typeof cartTable.$inferInsert;
export type SelectCart = typeof cartTable.$inferSelect;

export type InsertCartItem = typeof cartItemsTable.$inferInsert;
export type SelectCartItem = typeof cartItemsTable.$inferSelect;

export type InsertSolanaTransaction =
  typeof solanaTransactionsTable.$inferInsert;
export type SelectSolanaTransaction =
  typeof solanaTransactionsTable.$inferSelect;
