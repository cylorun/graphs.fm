CREATE TABLE "session" (
	"id" serial PRIMARY KEY NOT NULL,
	"sid" varchar(255) NOT NULL,
	"sess" json NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
DROP TABLE "sessions" CASCADE;