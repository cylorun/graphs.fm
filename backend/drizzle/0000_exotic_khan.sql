CREATE TABLE "sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	"data" text NOT NULL,
	CONSTRAINT "sessions_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
CREATE TABLE "tracks" (
	"id" serial PRIMARY KEY NOT NULL,
	"spotify_id" varchar(50) NOT NULL,
	"track_name" varchar(255) NOT NULL,
	"artist" varchar(255) NOT NULL,
	"album" varchar(255) NOT NULL,
	"duration_ms" integer NOT NULL,
	"image_url" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "tracks_spotify_id_unique" UNIQUE("spotify_id")
);
--> statement-breakpoint
CREATE TABLE "user_tracks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"track_id" integer,
	"played_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"spotify_id" varchar(50) NOT NULL,
	"display_name" varchar(100),
	"email" varchar(100),
	"profile_image" text,
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_login" timestamp DEFAULT now(),
	CONSTRAINT "users_spotify_id_unique" UNIQUE("spotify_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "user_tracks" ADD CONSTRAINT "user_tracks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_tracks" ADD CONSTRAINT "user_tracks_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE cascade ON UPDATE no action;