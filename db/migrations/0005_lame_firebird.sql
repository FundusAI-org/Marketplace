ALTER TABLE "medications" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "medications" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "pharmacies" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "medications" ADD CONSTRAINT "medications_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "pharmacies" ADD CONSTRAINT "pharmacies_slug_unique" UNIQUE("slug");