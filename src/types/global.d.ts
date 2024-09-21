import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"
import type * as schema from "@/../supabase/migrations/schema"

declare global {
  // eslint-disable-next-line no-var
  var database: PostgresJsDatabase<typeof schema> | undefined
}
