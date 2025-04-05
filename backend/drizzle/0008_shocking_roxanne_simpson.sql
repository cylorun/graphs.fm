ALTER TABLE "user_tracks" ALTER COLUMN "played_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "timezone" varchar(50) DEFAULT 'UTC' NOT NULL;