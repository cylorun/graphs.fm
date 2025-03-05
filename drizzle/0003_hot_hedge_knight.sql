ALTER TABLE "session" ALTER COLUMN "sid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "sess" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "expire" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_sid_unique" UNIQUE("sid");