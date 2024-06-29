CREATE TABLE IF NOT EXISTS "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"start_time" timestamp NOT NULL,
	"title" text NOT NULL,
	"location" text NOT NULL,
	"type" "type" NOT NULL,
	"groups" jsonb DEFAULT '{}'::jsonb,
	"confirmed_players" bigint[] DEFAULT  NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp NOT NULL,
	"name" text NOT NULL
);
