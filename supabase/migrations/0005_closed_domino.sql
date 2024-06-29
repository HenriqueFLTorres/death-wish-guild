ALTER TABLE "events" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "confirmed_players" SET DATA TYPE integer[];--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "confirmation_type" "confirmation_type" NOT NULL;