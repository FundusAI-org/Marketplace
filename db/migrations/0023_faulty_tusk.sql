ALTER TABLE "customers" ALTER COLUMN "fundus_points" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "solana_wallet_address" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pharmacies" ALTER COLUMN "address" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pharmacies" ALTER COLUMN "city" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pharmacies" ALTER COLUMN "state" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pharmacies" ALTER COLUMN "zip_code" SET NOT NULL;