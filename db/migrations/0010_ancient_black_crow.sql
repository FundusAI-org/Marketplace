DO $$ BEGIN
 CREATE TYPE "public"."solana_transaction_status" AS ENUM('pending', 'completed', 'failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "medications" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "medications" ALTER COLUMN "in_stock" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "medications" ALTER COLUMN "image_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "solana_transactions" ALTER COLUMN "amount_sol" SET DATA TYPE numeric(20, 9);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_hash" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "first_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "solana_transactions" DROP COLUMN IF EXISTS "status";--> statement-breakpoint
ALTER TABLE "solana_transactions" ADD CONSTRAINT "solana_transactions_signature_unique" UNIQUE("signature");