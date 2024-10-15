CREATE TABLE IF NOT EXISTS "admins" (
	"id" uuid PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"fundus_points" integer DEFAULT 0 NOT NULL,
	"solana_wallet_address" text
);
--> statement-breakpoint
ALTER TABLE "users" RENAME TO "accounts";--> statement-breakpoint
ALTER TABLE "cart" RENAME COLUMN "user_id" TO "customer_id";--> statement-breakpoint
ALTER TABLE "health_logs" RENAME COLUMN "user_id" TO "customer_id";--> statement-breakpoint
ALTER TABLE "orders" RENAME COLUMN "user_id" TO "customer_id";--> statement-breakpoint
ALTER TABLE "reviews" RENAME COLUMN "user_id" TO "customer_id";--> statement-breakpoint
ALTER TABLE "session" RENAME COLUMN "user_id" TO "account_id";--> statement-breakpoint
ALTER TABLE "solana_transactions" RENAME COLUMN "user_id" TO "customer_id";--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "cart" DROP CONSTRAINT "cart_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "health_logs" DROP CONSTRAINT "health_logs_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "medications" DROP CONSTRAINT "medications_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "pharmacies" DROP CONSTRAINT "pharmacies_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "solana_transactions" DROP CONSTRAINT "solana_transactions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "pharmacies" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "admins" ADD CONSTRAINT "admins_id_accounts_id_fk" FOREIGN KEY ("id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customers" ADD CONSTRAINT "customers_id_accounts_id_fk" FOREIGN KEY ("id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cart" ADD CONSTRAINT "cart_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "health_logs" ADD CONSTRAINT "health_logs_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medications" ADD CONSTRAINT "medications_created_by_pharmacies_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."pharmacies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pharmacies" ADD CONSTRAINT "pharmacies_id_accounts_id_fk" FOREIGN KEY ("id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "solana_transactions" ADD CONSTRAINT "solana_transactions_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "pharmacies" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
ALTER TABLE "pharmacies" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "pharmacies" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "first_name";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "last_name";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "role";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "fundus_points";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "solana_wallet_address";--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_email_unique" UNIQUE("email");