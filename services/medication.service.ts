import { db } from "@/db";
import { medicationsTable } from "@/db/schema";
import { validateRequest } from "@/lucia";
import { Response } from "@/types/axios.types";
import { Medication } from "@/types/db.types";
import { eq, desc } from "drizzle-orm";

class MedicationService {
  async getMedications(): Promise<Response<Medication[]>> {
    try {
      const medications = await db.query.medicationsTable.findMany({
        with: {},
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
        with: {},
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
    const { account } = await validateRequest();
    if (!account || !account.admin || !account.pharmacy) {
      return {
        success: false,
        data: "Unauthorized",
      };
    }

    try {
      const existingMedication = await db.query.medicationsTable.findFirst({
        where: eq(medicationsTable.id, medicationId),
        with: {},
      });

      if (!existingMedication) {
        return {
          success: false,
          data: "Medication not found",
        };
      }

      if (account.id === existingMedication.pharmacyId) {
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
    const { account } = await validateRequest();
    if (!account || !account.admin || !account.pharmacy) {
      return {
        success: false,
        data: "Unauthorized",
      };
    }

    try {
      const existingMedication = await db.query.medicationsTable.findFirst({
        where: eq(medicationsTable.id, medicationId),
        with: {
          pharmacy: {
            columns: {
              id: true,
            },
          },
        },
      });

      if (!existingMedication) {
        return {
          success: false,
          data: "Medication not found",
        };
      }

      if (account.id === existingMedication.pharmacyId) {
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
    const { account } = await validateRequest();
    if (!account || !account.admin || !account.pharmacy) {
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
          details: newMedication.details,
          sideEffect: newMedication.sideEffect,
          usage: newMedication.usage,
          description: newMedication.description,
          name: newMedication.name,
          price: newMedication.price,
          imageUrl: newMedication.imageUrl,
          pharmacyId: newMedication.pharmacyId,
          slug: newMedication.slug,
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
