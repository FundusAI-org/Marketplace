import {
  usersTable,
  medicationsTable,
  pharmaciesTable,
  pharmacyInventoryTable,
  ordersTable,
  orderItemsTable,
  healthLogsTable,
  reviewsTable,
  cartTable,
  cartItemsTable,
} from "./schema";

import { db } from ".";

export async function clearDB() {
  try {
    // Clear existing data
    console.log("Clearing existing data...");
    await db.delete(cartItemsTable);
    await db.delete(cartTable);
    await db.delete(reviewsTable);
    await db.delete(healthLogsTable);
    await db.delete(orderItemsTable);
    await db.delete(ordersTable);
    await db.delete(pharmacyInventoryTable);
    await db.delete(pharmaciesTable);
    await db.delete(medicationsTable);
    await db.delete(usersTable);

    // Seed Users
    console.log("Deleted existing data");
  } catch (error) {
    console.error("Error clearing database:", error);
    throw error;
  }
}

// Run the seed function
clearDB().catch((error) => {
  console.error("Failed to clear database:", error);
  process.exit(1);
});
