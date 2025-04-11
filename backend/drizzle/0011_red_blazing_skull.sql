CREATE TABLE "badges" (
	"id" varchar PRIMARY KEY NOT NULL,
	"badge_name" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "badges_badge_name_unique" UNIQUE("badge_name")
);
--> statement-breakpoint
CREATE TABLE "userBadges" (
	"id" serial NOT NULL,
	"artist_id" integer NOT NULL,
	"genre_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "userBadges" ADD CONSTRAINT "userBadges_artist_id_users_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userBadges" ADD CONSTRAINT "userBadges_genre_id_badges_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;