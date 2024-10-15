"use server";

import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { hash, verify } from "@node-rs/argon2";

import {
  accountsTable,
  customersTable,
  pharmaciesTable,
  adminsTable,
} from "@/db/schema";
import { validateRequest, lucia } from "@/lucia";
import { db } from "@/db";
import {
  RegisterFormSchema,
  LoginFormSchema,
  PharmacyRegisterFormSchema,
} from "@/types/formschemas";
import { slugify } from "@/lib/utils";

type SignUpInput =
  | {
      values: z.infer<typeof RegisterFormSchema>;
      accountType: "customer" | "admin";
    }
  | {
      values: z.infer<typeof PharmacyRegisterFormSchema>;
      accountType: "pharmacy";
    };

export const signUp = async ({ values, accountType }: SignUpInput) => {
  try {
    if (accountType === "pharmacy") {
      PharmacyRegisterFormSchema.parse(values);
    } else {
      RegisterFormSchema.parse(values);
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }

  const hashedPassword = await hash(values.password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  try {
    const [account] = await db
      .insert(accountsTable)
      .values({
        id: uuidv4(),
        email: values.email,
        passwordHash: hashedPassword,
      })
      .returning({
        id: accountsTable.id,
        email: accountsTable.email,
      });

    switch (accountType) {
      case "customer":
        await db.insert(customersTable).values({
          id: account.id,
          firstName: values.firstName,
          lastName: values.lastName,
          solanaWalletAddress: "",
          fundusPoints: 0,
        });
        break;
      case "pharmacy":
        await db.insert(pharmaciesTable).values({
          id: account.id,
          name: values.name,
          slug: slugify(values.name),
          address: values.address,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
        });
        break;
      case "admin":
        await db.insert(adminsTable).values({
          id: account.id,
          firstName: values.firstName,
          lastName: values.lastName,
        });
        break;
    }

    const session = await lucia.createSession(account.id, {
      expiresIn: 60 * 60 * 24 * 30,
    });

    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return {
      success: true,
      data: {
        account,
        accountType,
      },
    };
  } catch (error: any) {
    if (error.code === "23505") {
      return {
        success: false,
        error: "An account with this email already exists",
      };
    }

    return {
      success: false,
      error: error?.message || "An error occurred during sign up",
    };
  }
};

export const signIn = async (values: z.infer<typeof LoginFormSchema>) => {
  try {
    LoginFormSchema.parse(values);
  } catch (error: any) {
    return {
      error: error.message,
    };
  }

  const existingAccount = await db.query.accountsTable.findFirst({
    where: (table) => eq(table.email, values.email),
  });

  if (!existingAccount || !existingAccount.passwordHash) {
    return {
      error: "Incorrect email or password",
    };
  }

  const isValidPassword = await verify(
    existingAccount.passwordHash,
    values.password,
    {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    },
  );

  if (!isValidPassword) {
    return {
      error: "Incorrect email or password",
    };
  }

  const session = await lucia.createSession(existingAccount.id, {
    expiresIn: 60 * 60 * 24 * 30,
  });

  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  // Determine account type
  const customer = await db.query.customersTable.findFirst({
    where: (table) => eq(table.id, existingAccount.id),
  });
  const pharmacy = await db.query.pharmaciesTable.findFirst({
    where: (table) => eq(table.id, existingAccount.id),
  });
  const admin = await db.query.adminsTable.findFirst({
    where: (table) => eq(table.id, existingAccount.id),
  });

  let accountType: "customer" | "pharmacy" | "admin";
  let accountDetails;

  if (customer) {
    accountType = "customer";
    accountDetails = customer;
  } else if (pharmacy) {
    accountType = "pharmacy";
    accountDetails = pharmacy;
  } else if (admin) {
    accountType = "admin";
    accountDetails = admin;
  } else {
    return {
      error: "Account type not found",
    };
  }

  return {
    success: "Logged in successfully",
    data: {
      account: existingAccount,
      accountType,
      accountDetails,
    },
  };
};

export const signOut = async () => {
  try {
    const { session } = await validateRequest();

    if (!session) {
      return {
        error: "Unauthorized",
      };
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return {
      success: "Logged out successfully",
    };
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};
