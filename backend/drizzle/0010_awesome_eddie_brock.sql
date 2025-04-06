ALTER TABLE "albums" ALTER COLUMN "release_date" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "albums" ALTER COLUMN "release_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tracks" ALTER COLUMN "album_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "albums" ADD COLUMN "release_date_precision" text NOT NULL;