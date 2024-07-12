import type { events, user } from "@/../supabase/migrations/schema"

export type InsertUser = typeof user.$inferInsert
export type SelectUser = typeof user.$inferSelect
export type InsertEvent = typeof events.$inferInsert
export type SelectEvent = typeof events.$inferSelect
