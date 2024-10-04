ALTER TABLE "orders" DROP CONSTRAINT "orders_pharmacy_id_pharmacies_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "pharmacy_id";