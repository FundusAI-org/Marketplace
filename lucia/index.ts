import { Lucia, Session } from "lucia";
import adapter from "./adapter";
import { cookies } from "next/headers";
import { cache } from "react";
import { Account } from "@/types/db.types";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => attributes,
});

export const validateRequest = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return {
      account: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);
  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {}

  const data = await db.query.accountsTable.findFirst({
    where: (table) => eq(table.id, result.user.id),
    with: {
      customer: {
        columns: {
          firstName: true,
          lastName: true,
          fundusPoints: true,
          solanaWalletAddress: true,
        },
      },
      admin: {
        columns: {
          firstName: true,
          lastName: true,
        },
      },
      pharmacy: {
        columns: {
          name: true,
          slug: true,
        },
      },
    },
  });

  return { account: data, session: result.session };
});

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Account;
  }
}
