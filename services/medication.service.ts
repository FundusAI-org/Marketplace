import { db } from "@/db";
import { medicationsTable } from "@/db/schema";
import { uploadImage } from "@/lib/cloudinary-upload";
import { slugify } from "@/lib/utils";
import { validateRequest } from "@/lucia";
import { Response } from "@/types/axios.types";
import { Medication } from "@/types/db.types";
import { ProductFormSchema } from "@/types/formschemas";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

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

  async getInventory(): Promise<Response<Medication[]>> {
    try {
      const { account } = await validateRequest();
      if (!account || !account.pharmacy) {
        return {
          success: false,
          data: "Unauthorized",
        };
      }

      const inventory = await db.query.medicationsTable.findMany({
        where: eq(medicationsTable.pharmacyId, account.id),
        with: {},
      });

      return {
        success: true,
        data: inventory,
      };
    } catch (error: any) {
      return {
        success: false,
        data: error.message as string,
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
        where: eq(medicationsTable.hidden, false),
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

  async createMedication(formData: FormData) {
    const { account } = await validateRequest();
    if (!account || !account.pharmacy) {
      return {
        success: false,
        data: "Unauthorized",
      };
    }

    const file = formData.get("imageBlob") as File;
    const name = formData.get("name") as string;

    if (!file) {
      return {
        success: false,
        data: "No file uploaded",
      };
    }

    try {
      const imageUploadResult = await uploadImage(
        file,
        name,
        account.pharmacy.name,
      );

      const newMedicationData: z.infer<typeof ProductFormSchema> = {
        imageUrl: imageUploadResult.secure_url,
        name: formData.get("name") as string,
        price: parseFloat(formData.get("price") as string),
        quantity: parseInt(formData.get("quantity") as string, 10),
        description: formData.get("description") as string,
        sideEffects: formData.get("sideEffects") as string,
        details: formData.get("details") as string,
        usage: formData.get("usage") as string,
      };

      // Validate the data against the schema
      ProductFormSchema.omit({
        imageBlob: true,
      }).parse(newMedicationData);

      console.log(newMedicationData);

      const [createdMed] = await db
        .insert(medicationsTable)
        .values({
          ...newMedicationData,
          sideEffect: newMedicationData.sideEffects,
          usage: newMedicationData.usage,
          description: newMedicationData.description,
          name: newMedicationData.name,
          imageUrl: newMedicationData.imageUrl,
          details: newMedicationData.details,
          quantity: newMedicationData.quantity,
          price: newMedicationData.price.toFixed(2),
          pharmacyId: account.id,
          slug: slugify(newMedicationData.name),
        })
        .returning();

      return {
        success: true,
        data: createdMed,
      };
    } catch (error: any) {
      console.error("Error creating medication:", error);
      return {
        success: false,
        data:
          error.message || "An error occurred while creating the medication",
      };
    }
  }
}

export default new MedicationService();
