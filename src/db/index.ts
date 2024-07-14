import { config } from "dotenv"
import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "@/../supabase/migrations/schema"

config({ path: ".env" })

if (process.env.DATABASE_URL == null)
  throw new Error("DATABASE_URL is required")

const drizzleClient = drizzle(
  postgres(process.env.DATABASE_URL, {
    prepare: false,
  }),
  { schema }
)

declare global {
  interface Global {
    database: PostgresJsDatabase<typeof schema> | undefined
  }
}

export const db = global.database ?? drizzleClient
if (process.env.NODE_ENV !== "production") global.database = db
