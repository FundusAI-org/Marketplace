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
    const seedMedications: Omit<
      Medication,
      "createdAt" | "updatedAt" | "id"
    >[] = [
      {
        imageUrl:
          "https://ik.imagekit.io/e696lodil/fundus%20ai/Glucometer_0ihuIzw4v.heic?updatedAt=1727986597521",
        name: "OneTouch Glucometer (with Lancing Pen)",
        slug: slugify("OneTouch Glucometer (with Lancing Pen)"),
        description: `The OneTouch Glucometer is a reliable blood glucose monitoring system designed for people with diabetes to easily and accurately measure their blood sugar levels at home or on the go. The kit comes with a glucometer, a lancing pen, and a set of lancets, making it an all-in-one solution for routine glucose testing. The device delivers quick results in just 5 seconds and can store up to 500 test results to help users track their glucose levels over time.`,
        price: "40",
        inStock: true,
        sideEffect: `Skin irritation or soreness from frequent finger pricking,
Risk of infection if lancets are reused`,
        createdBy: users[0].id,
        pharmacyId: pharmacies[0].id,
        details: `
        Glucometer with digital display.
Comes with a lancing pen and 10 sterile lancets.
Requires OneTouch test strips (sold separately).
Test time: 5 seconds.
Memory: Stores up to 500 test results with date and time.
Requires 2 AAA batteries (included).
Compact and portable, easy for daily use.
Compatible with OneTouch app for Bluetooth data syncing`,
        usage: `Wash your hands and dry them thoroughly.
Load a lancet into the lancing pen and adjust the depth based on skin sensitivity.
Use the lancing pen to prick the fingertip and obtain a small drop of blood.
Insert a glucose test strip into the glucometer.
Touch the blood sample to the test strip, and wait for the device to display the result (within 5 seconds).
Record the result, or let the glucometer store it for future reference.
Dispose of the lancet and test strip properly after each test`,
      },
      {
        imageUrl:
          "https://ik.imagekit.io/e696lodil/fundus%20ai/Insulin%20Injection_U-lkp-MgT.heic?updatedAt=1727987316081",
        name: "Insulin Injection (NovoLog)",
        slug: slugify("Insulin Injection (NovoLog)"),
        description:
          "NovoLog is a fast-acting insulin analog (insulin aspart) designed for people with diabetes to manage their blood sugar levels after meals. It works by replacing the insulin that the body is unable to produce, helping glucose enter cells for energy production.",
        price: "90",
        inStock: true,
        sideEffect: `Low blood sugar (hypoglycemia),
Redness or swelling at the injection site,
Weight gain,
Allergic reactions (rare)`,
        createdBy: users[0].id,
        pharmacyId: pharmacies[0].id,
        details: `10 mL vial, 100 units/mL.
Store in a refrigerator (36°F–46°F).
Avoid freezing. Do not use if the liquid has particles or is discolored.
Dispose of used syringes in a sharps container`,
        usage: `Clean the vial's rubber stopper with an alcohol swab.
Use an insulin syringe to draw the correct dose from the vial.
Inject under the skin (subcutaneous), typically in the stomach, thighs, or upper arms, as directed by your doctor.
Administer the injection immediately before a meal`,
      },
      {
        name: "Insulin Pen (Prefilled)",
        imageUrl:
          "https://ik.imagekit.io/e696lodil/fundus%20ai/Insulin%20Pen_YukThY5p-.heic?updatedAt=1727987348993",
        slug: slugify("Insulin Pen (Prefilled)"),
        description:
          "Prefilled insulin pens offer a convenient, ready-to-use way to administer insulin. Each pen is loaded with fast-acting insulin, ideal for controlling post-meal blood sugar spikes. It provides accurate dosing and reduces the need for manual syringe preparation.",
        price: "120",
        inStock: true,
        sideEffect: `Low blood sugar (hypoglycemia),
Lipodystrophy (skin thickening) at the injection site,
Allergic reactions (itching, rash)`,
        createdBy: users[0].id,
        pharmacyId: pharmacies[0].id,
        details: `Prefilled pen with 300 units of insulin.
Available in various insulin types (fast-acting, long-acting).
Dosage dial for accurate measurements.
Can be stored at room temperature for up to 28 days once opened`,
        usage: `Attach a new needle to the pen.
Prime the pen by dialing a small dose and releasing it.
Dial the correct dose as prescribed by your doctor.
Inject the insulin under the skin in areas such as the abdomen, thigh, or upper arm.
Remove and dispose of the needle after each use`,
      },
      {
        imageUrl:
          "https://ik.imagekit.io/e696lodil/fundus%20ai/Lancing%20Pen%20and%20Lancets_qNMwff1e3.heic?updatedAt=1727987349177",
        name: "Lancing Pen and Lancets",
        slug: slugify("Lancing Pen and Lancets"),
        description:
          "A lancing pen is used for obtaining small blood samples for glucose testing. The lancets are disposable needles that fit into the lancing pen, making it easier to prick the skin for blood sugar monitoring.",
        createdBy: users[0].id,
        pharmacyId: pharmacies[0].id,
        details: `Adjustable depth settings for comfort.
Compatible with standard lancets.
Compact, easy-to-carry design.
Comes with 100 sterile, single-use lancets`,
        inStock: true,
        price: "15",
        usage: `Insert a lancet into the lancing pen.
Adjust the depth setting based on skin sensitivity.
Press the pen against the fingertip and press the button to release the needle.
Collect the blood sample on a glucose test strip.
Dispose of the lancet after each use`,
        sideEffect: `Skin irritation or soreness,
Risk of infection if lancets are reused`,
      },
    ];

    const medications = await db
      .insert(medicationsTable)
      .values(seedMedications)
      .returning();

    console.log(medications);

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
