import { db } from "@/db";
import { usersTable, pharmaciesTable } from "@/db/schema";
import { validateRequest } from "@/lucia";
import { Response } from "@/types/axios.types";
import { User } from "@/types/db.types";
import { eq, and, not } from "drizzle-orm";

class UsersService {
  async getUsers(): Promise<Response<User[]>> {
    const { user } = await validateRequest();
    if (!user || user.role !== "admin") {
      return {
        success: false,
        data: "Unauthorized",
      };
    }

    try {
      const res = await db.query.usersTable.findMany();
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

  async getCustomersForPharmacy(): Promise<Response<User[]>> {
    const { user } = await validateRequest();
    if (!user || user.role !== "pharmacy") {
      return {
        success: false,
        data: "Unauthorized",
      };
    }

    try {
      const pharmacy = await db.query.pharmaciesTable.findFirst({
        where: eq(pharmaciesTable.userId, user.id),
      });

      if (!pharmacy) {
        return {
          success: false,
          data: "Pharmacy not found",
        };
      }

      const customers = await db.query.usersTable.findMany({
        where: and(
          eq(usersTable.role, "customer"),
          not(eq(usersTable.id, user.id)),
        ),
      });

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
    const { user } = await validateRequest();
    if (!user || user.role !== "admin") {
      return {
        success: false,
        data: "Unauthorized",
      };
    }

    try {
      await db.delete(usersTable).where(eq(usersTable.id, userId));
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

  async updateUser(updatedUser: Partial<User>): Promise<Response<User>> {
    const { user } = await validateRequest();
    if (!user) {
      return {
        success: false,
        data: "Unauthorized",
      };
    }

    if (user.role !== "admin" && user.id !== updatedUser.id) {
      return {
        success: false,
        data: "Unauthorized",
      };
    }

    try {
      const res = await db
        .update(usersTable)
        .set(updatedUser)
        .where(eq(usersTable.id, updatedUser.id!))
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

  async updateUserRole(
    userId: string,
    newRole: User["role"],
  ): Promise<Response<User>> {
    const { user } = await validateRequest();
    if (!user || user.role !== "admin") {
      return {
        success: false,
        data: "Unauthorized",
      };
    }

    try {
      const res = await db
        .update(usersTable)
        .set({ role: newRole })
        .where(eq(usersTable.id, userId))
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
