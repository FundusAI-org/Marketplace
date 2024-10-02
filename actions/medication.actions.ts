"use server";

import medicationService from "@/services/medication.service";
import { Medication } from "@/types/db.types";

export const getMedications = async () => {
  return medicationService.getMedications();
};

export const getMedication = async (medicationId: string) => {
  return medicationService.getMedication(medicationId);
};

export const getMedicationBySlug = async (slug: string) => {
  return medicationService.getMedicationBySlug(slug);
};

export const getFeaturedMedications = async () => {
  return medicationService.getFeaturedMedications();
};

export const updateMedication = async (
  medicationId: string,
  updatedMedication: Partial<Medication>,
) => {
  return medicationService.updateMedication(medicationId, updatedMedication);
};
