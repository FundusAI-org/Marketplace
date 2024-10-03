"use server";
import { z } from "zod";

import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { hash, verify } from "@node-rs/argon2";

import { usersTable } from "@/db/schema";
import { validateRequest, lucia } from "@/lucia";
import { db } from "@/db";
import { RegisterFormSchema, LoginFormSchema } from "@/types/formschemas";
import { generateId } from "lucia";

export const signUp = async (values: z.infer<typeof RegisterFormSchema>) => {
  try {
    RegisterFormSchema.parse(values);
  } catch (error: any) {
    return {
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
    const [user] = await db
      .insert(usersTable)
      .values({
        id: generateId(15),
        email: values.email,
        passwordHash: hashedPassword,
        firstName: values.firstName,
        lastName: values.lastName,
      })
      .returning({
        id: usersTable.id,
        email: usersTable.email,
      });

    const session = await lucia.createSession(user.id, {
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
        user,
      },
    };
  } catch (error: any) {
    return {
      error: error?.message,
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

  console.log(values);

  const existingUser = await db.query.usersTable.findFirst({
    where: (table) => eq(table.email, values.email),
  });

  if (!existingUser) {
    return {
      error: "User not found",
    };
  }

  if (!existingUser.passwordHash) {
    return {
      error: "User not found",
    };
  }

  const isValidPassword = await verify(
    existingUser.passwordHash,
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

  const session = await lucia.createSession(existingUser.id, {
    expiresIn: 60 * 60 * 24 * 30,
  });

  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return {
    success: "Logged in successfully",
    data: {
      user: existingUser,
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
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};
