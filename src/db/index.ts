import { config } from "dotenv"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

config({ path: ".env" })

if (process.env.DATABASE_URL == null)
  throw new Error("DATABASE_URL is required")

const client = postgres(process.env.DATABASE_URL)
export const db = drizzle(client)
