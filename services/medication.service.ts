import { db } from "@/db";
import { medicationsTable, usersTable } from "@/db/schema";
import { validateRequest } from "@/lucia";
import { Response } from "@/types/axios.types";
import { Medication } from "@/types/db.types";
import { eq, desc } from "drizzle-orm";

class MedicationService {
  async getMedications(): Promise<Response<Medication[]>> {
    try {
      const medications = await db.query.medicationsTable.findMany({
        with: {
          createdBy: {
            columns: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      });
      return {
        success: true,
        data: medications,
      };
    } catch (error: any) {
      return {
        success: false,
        data: error.message,
      };
    }
  }

  async getMedication(medicationId: string): Promise<Response<Medication>> {
    try {
      const medication = await db.query.medicationsTable.findFirst({
        where: eq(medicationsTable.id, medicationId),
        with: {
          createdBy: {
            columns: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      });

      if (!medication) {
        return {
          success: false,
          data: "Medication not found",
        };
      }

      return {
        success: true,
        data: medication,
      };
    } catch (error: any) {
      return {
        success: false,
        data: error.message,
      };
    }
  }

  async getMedicationBySlug(slug: string): Promise<Response<any>> {
    try {
      const medication = await db.query.medicationsTable.findFirst({
        where: eq(medicationsTable.slug, slug),
        with: {
          reviews: {
            columns: {
              id: true,
              rating: true,
              comment: true,
            },
          },
          pharmacy: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!medication) {
        return {
          success: false,
          data: "Medication not found",
        };
      }

      return {
        success: true,
        data: medication,
      };
    } catch (error: any) {
      return {
        success: false,
        data: error.message,
      };
    }
  }

  async getFeaturedMedications() {
    try {
      const featuredMedications = await db.query.medicationsTable.findMany({
        where: eq(medicationsTable.inStock, true),
        orderBy: [desc(medicationsTable.createdAt)],
        limit: 5,
        with: {
          pharmacy: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      });

      return {
        success: true,
        data: featuredMedications,
      };
    } catch (error: any) {
      return {
        success: false,
        data: error.message,
      };
    }
  }

  async updateMedication(
    medicationId: string,
    updatedMedication: Partial<Medication>,
  ): Promise<Response<Medication>> {
    const { user } = await validateRequest();
    if (!user) {
      return {
        success: false,
        data: "Unauthorized",
      };
    }

    try {
      const existingMedication = await db.query.medicationsTable.findFirst({
        where: eq(medicationsTable.id, medicationId),
        with: {
          createdBy: true,
        },
      });

      if (!existingMedication) {
        return {
          success: false,
          data: "Medication not found",
        };
      }

      if (
        user.role !== "admin" &&
        user.id !== existingMedication.createdBy.id
      ) {
        return {
          success: false,
          data: "Unauthorized",
        };
      }

      const [updatedMed] = await db
        .update(medicationsTable)
        .set(updatedMedication)
        .where(eq(medicationsTable.id, medicationId))
        .returning();

      return {
        success: true,
        data: updatedMed,
      };
    } catch (error: any) {
      return {
        success: false,
        data: error.message,
      };
    }
  }

  async deleteMedication(medicationId: string): Promise<Response<string>> {
    const { user } = await validateRequest();
    if (!user) {
      return {
        success: false,
        data: "Unauthorized",
      };
    }

    try {
      const existingMedication = await db.query.medicationsTable.findFirst({
        where: eq(medicationsTable.id, medicationId),
        with: {
          createdBy: true,
        },
      });

      if (!existingMedication) {
        return {
          success: false,
          data: "Medication not found",
        };
      }

      if (
        user.role !== "admin" &&
        user.id !== existingMedication.createdBy.id
      ) {
        return {
          success: false,
          data: "Unauthorized",
        };
      }

      const [deletedMed] = await db
        .delete(medicationsTable)
        .where(eq(medicationsTable.id, medicationId))
        .returning({ id: medicationsTable.id });

      return {
        success: true,
        data: "Medication deleted successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        data: error.message,
      };
    }
  }

  async createMedication(newMedication: Partial<Medication>) {
    const { user } = await validateRequest();
    if (!user || (user.role !== "admin" && user.role !== "pharmacy")) {
      return {
        success: false,
        data: "Unauthorized",
      };
    }

    try {
      const [createdMed] = await db
        .insert(medicationsTable)
        .values({
          ...newMedication,
          description: newMedication.description,
          name: newMedication.name,
          price: newMedication.price,
          imageUrl: newMedication.imageUrl,
          pharmacyId: newMedication.pharmacyId,
          slug: newMedication.slug,
          createdBy: user.id,
        })
        // .values(newMedication)
        .returning();
      return {
        success: true,
        data: createdMed,
      };
    } catch (error: any) {
      return {
        success: false,
        data: error.message,
      };
    }
  }
}

export default new MedicationService();
