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
  real,
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

export const solanaTransactionStatusEnum = pgEnum("solana_transaction_status", [
  "pending",
  "completed",
  "failed",
]);

// Base account table
export const accountsTable = pgTable("accounts", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Customer table
export const customersTable = pgTable("customers", {
  id: uuid("id")
    .primaryKey()
    .references(() => accountsTable.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  fundusPoints: integer("fundus_points").notNull(),
  solanaWalletAddress: text("solana_wallet_address").notNull(),
});

// Admin table
export const adminsTable = pgTable("admins", {
  id: uuid("id")
    .primaryKey()
    .references(() => accountsTable.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
});

// Pharmacy table (replaces the previous pharmaciesTable)
export const pharmaciesTable = pgTable("pharmacies", {
  id: uuid("id")
    .primaryKey()
    .references(() => accountsTable.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
});

// Sessions table
export const sessionsTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: uuid("account_id")
    .notNull()
    .references(() => accountsTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
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
  pharmacyId: uuid("pharmacy_id")
    .notNull()
    .references(() => pharmaciesTable.id, { onDelete: "cascade" }),
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
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customersTable.id, { onDelete: "cascade" }),
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
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customersTable.id, { onDelete: "cascade" }),
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
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customersTable.id, { onDelete: "cascade" }),
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
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customersTable.id, { onDelete: "cascade" }),
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
  customerId: uuid("customer_id")
    .references(() => customersTable.id, { onDelete: "cascade" })
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

// Relations
export const accountsRelations = relations(accountsTable, ({ one }) => ({
  customer: one(customersTable, {
    fields: [accountsTable.id],
    references: [customersTable.id],
  }),
  admin: one(adminsTable, {
    fields: [accountsTable.id],
    references: [adminsTable.id],
  }),
  pharmacy: one(pharmaciesTable, {
    fields: [accountsTable.id],
    references: [pharmaciesTable.id],
  }),
}));

export const customersRelations = relations(
  customersTable,
  ({ many, one }) => ({
    account: one(accountsTable, {
      fields: [customersTable.id],
      references: [accountsTable.id],
    }),
    orders: many(ordersTable),
    healthLogs: many(healthLogsTable),
    cart: one(cartTable),
    solanaTransactions: many(solanaTransactionsTable),
  }),
);

export const adminsRelations = relations(adminsTable, ({ one }) => ({
  account: one(accountsTable, {
    fields: [adminsTable.id],
    references: [accountsTable.id],
  }),
}));

export const pharmaciesRelations = relations(
  pharmaciesTable,
  ({ one, many }) => ({
    account: one(accountsTable, {
      fields: [pharmaciesTable.id],
      references: [accountsTable.id],
    }),
    inventory: many(pharmacyInventoryTable),
    medications: many(medicationsTable),
  }),
);

// Add relations for the new table
export const solanaTransactionsRelations = relations(
  solanaTransactionsTable,
  ({ one }) => ({
    user: one(accountsTable, {
      fields: [solanaTransactionsTable.customerId],
      references: [accountsTable.id],
    }),
    order: one(ordersTable, {
      fields: [solanaTransactionsTable.orderId],
      references: [ordersTable.id],
    }),
  }),
);

export const medicationsRelations = relations(
  medicationsTable,
  ({ many, one }) => ({
    orderItems: many(orderItemsTable),
    pharmacyInventory: many(pharmacyInventoryTable),
    cartItems: many(cartItemsTable),
    reviews: many(reviewsTable),
    pharmacy: one(pharmaciesTable, {
      fields: [medicationsTable.pharmacyId],
      references: [pharmaciesTable.id],
    }),
  }),
);

export const ordersRelations = relations(ordersTable, ({ one, many }) => ({
  user: one(customersTable, {
    fields: [ordersTable.customerId],
    references: [customersTable.id],
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
  user: one(customersTable, {
    fields: [cartTable.customerId],
    references: [customersTable.id],
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
  user: one(customersTable, {
    fields: [healthLogsTable.customerId],
    references: [customersTable.id],
  }),
}));

export const reviewsRelations = relations(reviewsTable, ({ one }) => ({
  user: one(customersTable, {
    fields: [reviewsTable.customerId],
    references: [customersTable.id],
  }),
  medication: one(medicationsTable, {
    fields: [reviewsTable.medicationId],
    references: [medicationsTable.id],
  }),
}));

// Types
export type InsertAccount = typeof accountsTable.$inferInsert;
export type SelectAccount = typeof accountsTable.$inferSelect;

export type InsertCustomer = typeof customersTable.$inferInsert;
export type SelectCustomer = typeof customersTable.$inferSelect;

export type InsertAdmin = typeof adminsTable.$inferInsert;
export type SelectAdmin = typeof adminsTable.$inferSelect;

export type InsertPharmacy = typeof pharmaciesTable.$inferInsert;
export type SelectPharmacy = typeof pharmaciesTable.$inferSelect;

export type InsertMedication = typeof medicationsTable.$inferInsert;
export type SelectMedication = typeof medicationsTable.$inferSelect;

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
