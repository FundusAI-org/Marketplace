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

import { hash } from "@node-rs/argon2";
import { db } from ".";
import { faker } from "@faker-js/faker";
import {
  Medication,
  User,
  Pharmacy,
  PharmacyInventory,
  Order,
  OrderItem,
  Review,
} from "@/types/db.types";
import { slugify } from "@/lib/utils";

export async function seed() {
  // Clear existing data
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

  const additionalUsers: Omit<User, "createdAt" | "updatedAt">[] =
    await Promise.all(
      Array.from({ length: 10 }, async () => {
        return {
          id: faker.string.uuid(),
          email: faker.internet.email(),
          passwordHash: (
            await hash("customerpass", {
              memoryCost: 19456,
              timeCost: 2,
              outputLen: 32,
              parallelism: 1,
            })
          ).toString(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          fundusPoints: faker.number.int({ min: 0, max: 100 }),
          role: "customer",
        };
      }),
    );

  const users: Omit<User, "createdAt" | "updatedAt">[] = [
    {
      id: faker.string.uuid(),
      email: "admin@fundusai.com",
      passwordHash: (
        await hash("adminpass", {
          memoryCost: 19456,
          timeCost: 2,
          outputLen: 32,
          parallelism: 1,
        })
      ).toString(),
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      fundusPoints: faker.number.int({ min: 0, max: 100 }),
    },
    {
      id: faker.string.uuid(),
      email: "customer@example.com",
      passwordHash: (
        await hash("customerpass", {
          memoryCost: 19456,
          timeCost: 2,
          outputLen: 32,
          parallelism: 1,
        })
      ).toString(),
      firstName: "John",
      lastName: "Doe",
      role: "customer",
      fundusPoints: faker.number.int({ min: 0, max: 100 }),
    },
    {
      id: faker.string.uuid(),
      email: "pharmacy@example.com",
      passwordHash: (
        await hash("pharmacypass", {
          memoryCost: 19456,
          timeCost: 2,
          outputLen: 32,
          parallelism: 1,
        })
      ).toString(),
      firstName: "Jane",
      lastName: "Smith",
      role: "pharmacy",
      fundusPoints: faker.number.int({ min: 0, max: 100 }),
    },
    ...additionalUsers,
  ];

  await db.insert(usersTable).values(users);

  // Seed Medications

  const medications: Omit<Medication, "createdAt" | "updatedAt">[] = Array.from(
    { length: 10 },
    () => {
      const name = faker.commerce.productName(); // Fixing how `faker` generates a product name

      return {
        id: faker.string.uuid(),
        slug: slugify(name),
        name,
        description: "For blood sugar control",
        price: faker.number.float({ min: 0, max: 10000 }).toString(), // If price is a string, keep it as is; otherwise, convert to a number
        inStock: true,
        imageUrl: faker.image.url(),
      };
    },
  );

  await db.insert(medicationsTable).values(medications);

  // Seed Pharmacies
  const pharmacies: Omit<Pharmacy, "createdAt" | "updatedAt">[] = [
    {
      id: faker.string.uuid(),
      userId: users[2].id,
      slug: "central-pharmacy",
      name: "Central Pharmacy",
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
    },
  ];
  await db.insert(pharmaciesTable).values(pharmacies);

  // Seed Pharmacy Inventory
  const pharmacyInventoryies: Omit<
    PharmacyInventory,
    "createdAt" | "updatedAt"
  >[] = medications.map((med) => ({
    id: faker.string.uuid(),
    pharmacyId: pharmacies[0].id,
    medicationId: med.id,
    quantity: Math.floor(Math.random() * 100) + 1,
    price: med.price,
  }));
  await db.insert(pharmacyInventoryTable).values(pharmacyInventoryies);

  // Seed Orders
  const orders: Omit<Order, "createdAt" | "updatedAt">[] = [
    {
      id: faker.string.uuid(),
      userId: users[1].id,
      pharmacyId: pharmacies[0].id,
      status: "delivered",
      totalAmount: faker.number.float({ min: 0, max: 100 }).toString(),
      fundusPointsUsed: 0,
    },
  ];
  await db.insert(ordersTable).values(orders);

  // Seed Order Items
  const orderItems: Omit<OrderItem, "createdAt" | "updatedAt">[] = [
    {
      id: faker.string.uuid(),
      orderId: orders[0].id,
      medicationId: medications[0].id,
      quantity: 1,
      price: faker.number.float({ min: 0, max: 100 }).toString(),
    },
    {
      id: faker.string.uuid(),
      orderId: orders[0].id,
      medicationId: medications[1].id,
      quantity: 1,
      price: faker.number.float({ min: 0, max: 100 }).toString(),
    },
  ];
  await db.insert(orderItemsTable).values(orderItems);

  // Seed Reviews
  const reviews: Omit<Review, "createdAt" | "updatedAt">[] = [
    {
      id: faker.string.uuid(),
      userId: users[1].id,
      medicationId: medications[0].id,
      rating: 5,
      comment: "Works great!",
    },
  ];
  await db.insert(reviewsTable).values(reviews);

  console.log("Database seeded successfully!");
}

// Run the seed function
seed().catch(console.error);
