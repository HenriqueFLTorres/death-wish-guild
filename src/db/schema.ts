import {
  bigint,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  created_at: timestamp("created_at").notNull(),
  name: text("name").notNull(),
})

const eventTypeEnum = pgEnum("type", ["PVP", "PVE", "GUILD", "OTHER"])

export const eventsTable = pgTable("events", {
  id: serial("id").primaryKey(),
  start_time: timestamp("start_time").notNull(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  type: eventTypeEnum("type").notNull(),
  groups: jsonb("groups").$type<EventGroups>().default({}),
  confirmed_players: bigint("confirmed_players", { mode: "bigint" })
    .array()
    .notNull()
    .default([]),
})

export type InsertUser = typeof usersTable.$inferInsert
export type SelectUser = typeof usersTable.$inferSelect
export type InsertEvent = typeof eventsTable.$inferInsert
export type SelectEvent = typeof eventsTable.$inferSelect
