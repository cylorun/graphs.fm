CREATE TABLE "albums" (
	"id" serial PRIMARY KEY NOT NULL,
	"spotify_id" varchar(50) NOT NULL,
	"album_name" varchar(255) NOT NULL,
	"image_url" text,
	"release_date" timestamp,
	"artist_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "albums_spotify_id_unique" UNIQUE("spotify_id")
);
--> statement-breakpoint
ALTER TABLE "tracks" ADD COLUMN "album_id" integer;--> statement-breakpoint
ALTER TABLE "albums" ADD CONSTRAINT "albums_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracks" DROP COLUMN "album";