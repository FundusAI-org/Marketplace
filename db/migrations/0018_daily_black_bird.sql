ALTER TABLE "orders" ALTER COLUMN "fundus_points_used" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "fundus_points_used" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "fundus_points" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "fundus_points" SET NOT NULL;