ALTER TABLE "userBadges" RENAME TO "user_badges";--> statement-breakpoint
ALTER TABLE "user_badges" DROP CONSTRAINT "userBadges_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_badges" DROP CONSTRAINT "userBadges_badge_id_badges_id_fk";
--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;