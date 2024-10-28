DROP TABLE "pharmacy_inventory";--> statement-breakpoint
ALTER TABLE "medications" ALTER COLUMN "in_stock" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "medications" ADD COLUMN "quantity" integer NOT NULL;