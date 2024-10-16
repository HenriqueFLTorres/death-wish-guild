import type {
  auctions,
  events,
  items,
  logs,
  user,
} from "@/../supabase/migrations/schema"

export type InsertUser = typeof user.$inferInsert
export type SelectUser = typeof user.$inferSelect
export type InsertEvent = typeof events.$inferInsert
export type SelectEvent = typeof events.$inferSelect
export type InsertLog = typeof logs.$inferInsert
export type SelectLog = typeof logs.$inferSelect
export type InsertItem = typeof items.$inferInsert
export type SelectItem = typeof items.$inferSelect
export type InsertAuction = typeof auctions.$inferInsert
export type SelectAuction = typeof auctions.$inferSelect
