import { db } from "@/db";
import { medicationsTable, pharmaciesTable } from "@/db/schema";
import { Response } from "@/types/axios.types";
import { Medication, Pharmacy } from "@/types/db.types";
import { and, or, ilike, eq, gte, lte } from "drizzle-orm";

export interface SearchResult {
  medications: (Medication & { pharmacy: { id: string; name: string } })[];
  pharmacies: Pharmacy[];
}

class SearchService {
  async search(query: string): Promise<Response<SearchResult>> {
    try {
      const medications = await db.query.medicationsTable.findMany({
        where: or(
          ilike(medicationsTable.name, `%${query}%`),
          ilike(medicationsTable.description, `%${query}%`),
        ),

        with: {
          pharmacy: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      });

      // await db
      // .select()
      // .from(medicationsTable)
      // .where(or(
      //   ilike(medicationsTable.name, `%${query}%`),
      //   ilike(medicationsTable.description, `%${query}%`),
      // ))
      // .leftJoin(pharmaciesTable, or(
      //     ilike(pharmaciesTable.name, `%${query}%`),
      //     ilike(pharmaciesTable.address, `%${query}%`),
      //     ilike(pharmaciesTable.city, `%${query}%`),
      //     ilike(pharmaciesTable.state, `%${query}%`),
      //   ))

      const pharmacies = await db.query.pharmaciesTable.findMany({
        where: or(
          ilike(pharmaciesTable.name, `%${query}%`),
          ilike(pharmaciesTable.address, `%${query}%`),
          ilike(pharmaciesTable.city, `%${query}%`),
          ilike(pharmaciesTable.state, `%${query}%`),
        ),
        with: {},
      });

      return {
        success: true,
        data: {
          medications,
          pharmacies,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        data: error.message,
      };
    }
  }

  async searchMedications(query: string): Promise<Response<Medication[]>> {
    try {
      const medications = await db.query.medicationsTable.findMany({
        where: or(
          ilike(medicationsTable.name, `%${query}%`),
          ilike(medicationsTable.description, `%${query}%`),
        ),
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

  async searchPharmacies(query: string): Promise<Response<Pharmacy[]>> {
    try {
      const pharmacies = await db.query.pharmaciesTable.findMany({
        where: or(
          ilike(pharmaciesTable.name, `%${query}%`),
          ilike(pharmaciesTable.address, `%${query}%`),
          ilike(pharmaciesTable.city, `%${query}%`),
          ilike(pharmaciesTable.state, `%${query}%`),
        ),
        with: {},
      });

      return {
        success: true,
        data: pharmacies,
      };
    } catch (error: any) {
      return {
        success: false,
        data: error.message,
      };
    }
  }

  async advancedSearch(
    query: string,
    filters: {
      inStock?: boolean;
      minPrice?: number;
      maxPrice?: number;
      state?: string;
    },
  ): Promise<Response<SearchResult>> {
    try {
      const medicationConditions = [
        or(
          ilike(medicationsTable.name, `%${query}%`),
          ilike(medicationsTable.description, `%${query}%`),
        ),
      ];

      if (filters.inStock !== undefined) {
        medicationConditions.push(
          eq(medicationsTable.inStock, filters.inStock),
        );
      }

      if (filters.minPrice !== undefined) {
        medicationConditions.push(
          gte(medicationsTable.price, filters.minPrice.toPrecision(10)),
        );
      }

      if (filters.maxPrice !== undefined) {
        medicationConditions.push(
          lte(medicationsTable.price, filters.maxPrice.toPrecision(10)),
        );
      }

      const medications = await db.query.medicationsTable.findMany({
        where: and(...medicationConditions),
        with: {
          pharmacy: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      });

      const pharmacyConditions = [
        or(
          ilike(pharmaciesTable.name, `%${query}%`),
          ilike(pharmaciesTable.address, `%${query}%`),
          ilike(pharmaciesTable.city, `%${query}%`),
          ilike(pharmaciesTable.state, `%${query}%`),
        ),
      ];

      if (filters.state) {
        pharmacyConditions.push(eq(pharmaciesTable.state, filters.state));
      }

      const pharmacies = await db.query.pharmaciesTable.findMany({
        where: and(...pharmacyConditions),
        with: {},
      });

      return {
        success: true,
        data: {
          medications,
          pharmacies,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        data: error.message,
      };
    }
  }
}

export default new SearchService();
