ALTER TABLE "userBadges" RENAME COLUMN "artist_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "userBadges" RENAME COLUMN "genre_id" TO "badge_id";--> statement-breakpoint
ALTER TABLE "userBadges" DROP CONSTRAINT "userBadges_artist_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "userBadges" DROP CONSTRAINT "userBadges_genre_id_badges_id_fk";
--> statement-breakpoint
ALTER TABLE "userBadges" ADD CONSTRAINT "userBadges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userBadges" ADD CONSTRAINT "userBadges_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;