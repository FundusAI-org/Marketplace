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
  Cart,
  CartItem,
} from "@/types/db.types";
import { slugify } from "@/lib/utils";

export async function seed() {
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
    console.log("Seeding users...");
    const additionalUsers: Omit<User, "createdAt" | "updatedAt">[] =
      await Promise.all(
        Array.from({ length: 10 }, async () => {
          return {
            id: faker.string.uuid(),
            email: faker.internet.email(),
            passwordHash: await hash("customerpass"),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            fundusPoints: faker.number.int({ min: 0, max: 100 }),
            role: "customer",
            solanaWalletAddress: null,
          };
        }),
      );

    const users: Omit<User, "createdAt" | "updatedAt">[] = [
      {
        id: faker.string.uuid(),
        email: "admin@fundusai.com",
        passwordHash: await hash("adminpass"),
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        fundusPoints: faker.number.int({ min: 0, max: 100 }),
        solanaWalletAddress: null,
      },
      {
        id: faker.string.uuid(),
        email: "customer@example.com",
        passwordHash: await hash("customerpass"),
        firstName: "John",
        lastName: "Doe",
        role: "customer",
        fundusPoints: faker.number.int({ min: 0, max: 100 }),
        solanaWalletAddress: null,
      },
      {
        id: faker.string.uuid(),
        email: "pharmacy@example.com",
        passwordHash: await hash("pharmacypass"),
        firstName: "Jane",
        lastName: "Smith",
        role: "pharmacy",
        fundusPoints: faker.number.int({ min: 0, max: 100 }),
        solanaWalletAddress: null,
      },
      ...additionalUsers,
    ];

    await db.insert(usersTable).values(users);

    // Seed Pharmacies
    console.log("Seeding pharmacies...");
    const pharmacies: Omit<Pharmacy, "createdAt" | "updatedAt">[] = [
      {
        id: faker.string.uuid(),
        userId: users.find((u) => u.role === "pharmacy")!.id,
        slug: "central-pharmacy",
        name: "Central Pharmacy",
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
      },
    ];
    await db.insert(pharmaciesTable).values(pharmacies);

    // Seed Medications
    console.log("Seeding medications...");
    const medications: Omit<Medication, "createdAt" | "updatedAt">[] =
      Array.from({ length: 10 }, () => {
        const name = faker.commerce.productName();
        return {
          id: faker.string.uuid(),
          slug: slugify(name),
          name,
          description: faker.lorem.sentence(),
          price: faker.number.float({ min: 10, max: 1000 }).toString(),
          inStock: faker.datatype.boolean(),
          imageUrl: faker.image.url(),
          createdBy: users[2].id,
          pharmacyId: pharmacies[0].id,
        };
      });

    await db.insert(medicationsTable).values(medications);

    // Seed Pharmacy Inventory
    console.log("Seeding pharmacy inventory...");
    const pharmacyInventory: Omit<
      PharmacyInventory,
      "createdAt" | "updatedAt"
    >[] = medications.map((med) => ({
      id: faker.string.uuid(),
      pharmacyId: pharmacies[0].id,
      medicationId: med.id,
      quantity: faker.number.int({ min: 0, max: 100 }),
      price: med.price,
    }));
    await db.insert(pharmacyInventoryTable).values(pharmacyInventory);

    // Seed Orders
    console.log("Seeding orders...");
    const orders: Omit<Order, "createdAt" | "updatedAt">[] = [
      {
        id: faker.string.uuid(),
        userId: users.find((u) => u.role === "customer")!.id,
        pharmacyId: pharmacies[0].id,
        status: "delivered",
        totalAmount: faker.number.float({ min: 50, max: 500 }).toString(),
        fundusPointsUsed: faker.number.int({ min: 0, max: 50 }),
      },
    ];
    await db.insert(ordersTable).values(orders);

    // Seed Order Items
    console.log("Seeding order items...");
    const orderItems: Omit<OrderItem, "createdAt" | "updatedAt">[] = [
      {
        id: faker.string.uuid(),
        orderId: orders[0].id,
        medicationId: medications[0].id,
        quantity: faker.number.int({ min: 1, max: 5 }),
        price: medications[0].price,
      },
      {
        id: faker.string.uuid(),
        orderId: orders[0].id,
        medicationId: medications[1].id,
        quantity: faker.number.int({ min: 1, max: 5 }),
        price: medications[1].price,
      },
    ];
    await db.insert(orderItemsTable).values(orderItems);

    // Seed Reviews
    console.log("Seeding reviews...");
    const reviews: Omit<Review, "createdAt" | "updatedAt">[] = [
      {
        id: faker.string.uuid(),
        userId: users.find((u) => u.role === "customer")!.id,
        medicationId: medications[0].id,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.sentence(),
      },
    ];
    await db.insert(reviewsTable).values(reviews);

    // Seed Carts
    console.log("Seeding carts...");
    const carts: Omit<Cart, "createdAt" | "updatedAt">[] = [
      {
        id: faker.string.uuid(),
        userId: users.find((u) => u.role === "customer")!.id,
      },
    ];
    await db.insert(cartTable).values(carts);

    // Seed Cart Items
    console.log("Seeding cart items...");
    const cartItems: Omit<CartItem, "createdAt" | "updatedAt">[] = [
      {
        id: faker.string.uuid(),
        cartId: carts[0].id,
        medicationId: medications[0].id,
        quantity: faker.number.int({ min: 1, max: 5 }),
        price: medications[0].price,
      },
    ];
    await db.insert(cartItemsTable).values(cartItems);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run the seed function
seed().catch((error) => {
  console.error("Failed to seed database:", error);
  process.exit(1);
});
