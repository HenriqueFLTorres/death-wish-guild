import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"
config({ path: ".env" })

if (process.env.DATABASE_URL == null)
  throw new Error("DATABASE_URL is required")

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./supabase/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})
