import { db } from "@/db";
import { accountsTable, pharmaciesTable } from "@/db/schema";
import { validateRequest } from "@/lucia";
import { Response } from "@/types/axios.types";
import { Account } from "@/types/db.types";
import { eq, and, not } from "drizzle-orm";

class UsersService {
  async getUsers(): Promise<
    Response<
      {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        fundusPoints: number;
      }[]
    >
  > {
    const { account: user } = await validateRequest();
    if (!user || !user.admin) {
      return {
        success: false,
        data: "Unauthorized",
      };
    }

    try {
      const customers = await db.query.customersTable.findMany({
        with: {
          account: {
            columns: {
              email: true,
            },
          },
        },
      });

      const admins = await db.query.adminsTable.findMany({
        with: {
          account: {
            columns: {
              email: true,
            },
          },
        },
      });

      const res = [
        ...[...customers].map((user) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.account.email,
          fundusPoints: user.fundusPoints,
          role: "customer",
        })),
        ...[...admins].map((user) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.account.email,
          fundusPoints: null,
          role: "admin",
        })),
      ];

      return {
        success: true,
        data: res,
      };
    } catch (error: any) {
      return {
        success: false,
        data: error.message,
      };
    }
  }

  async getCustomersForPharmacy(): Promise<
    Response<
      {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        fundusPoints: number;
      }[]
    >
  > {
    const { account: user } = await validateRequest();
    if (!user || !user.pharmacy) {
      return {
        success: false,
        data: "Unauthorized",
      };
    }

    try {
      const pharmacy = await db.query.pharmaciesTable.findFirst({
        where: eq(pharmaciesTable.id, user.id),
      });

      if (!pharmacy) {
        return {
          success: false,
          data: "Pharmacy not found",
        };
      }

      // const customers = await db.query.customersTable.findMany({
      //   where: and(
      //     eq(usersTable.role, "customer"),
      //     not(eq(usersTable.id, user.id)),
      //   ),
      // });

      const customers = [];

      return {
        success: true,
        data: customers,
      };
    } catch (error: any) {
      return {
        success: false,
        data: error.message,
      };
    }
  }

  async deleteUser(userId: string): Promise<Response<string>> {
    const { account: user } = await validateRequest();
    if (!user || !user.admin) {
      return {
        success: false,
        data: "Unauthorized",
      };
    }

    try {
      await db.delete(accountsTable).where(eq(accountsTable.id, userId));
      return {
        success: true,
        data: "User deleted successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        data: error.message,
      };
    }
  }

  async updateUser(updatedUser: Partial<Account>): Promise<Response<Account>> {
    const { account: user } = await validateRequest();
    if (!user) {
      return {
        success: false,
        data: "Unauthorized",
      };
    }

    if (!user.admin && user.id !== updatedUser.id) {
      return {
        success: false,
        data: "Unauthorized",
      };
    }

    try {
      const res = await db
        .update(accountsTable)
        .set(updatedUser)
        .where(eq(accountsTable.id, updatedUser.id!))
        .returning();

      if (res.length === 0) {
        return {
          success: false,
          data: "User not found",
        };
      }

      return {
        success: true,
        data: res[0],
      };
    } catch (error: any) {
      return {
        success: false,
        data: error.message,
      };
    }
  }
}

export default new UsersService();
