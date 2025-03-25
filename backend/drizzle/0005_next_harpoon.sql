ALTER TABLE "users" RENAME COLUMN "display_name" TO "username";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");