ALTER TABLE "medications" DROP CONSTRAINT "medications_created_by_pharmacies_id_fk";
--> statement-breakpoint
ALTER TABLE "medications" DROP COLUMN IF EXISTS "created_by";