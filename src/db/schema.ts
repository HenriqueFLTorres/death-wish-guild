import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

export const usersTable = pgTable("users", {
  id: integer("id").primaryKey(),
  created_at: timestamp("created_at").notNull(),
  name: text("name").notNull(),
})

const eventTypeEnum = pgEnum("type", ["PVP", "PVE", "GUILD", "OTHER"])
const eventConfirmationTypeEnum = pgEnum("confirmation_type", [
  "PER_PLAYER",
  "PER_GROUP",
])

export const eventsTable = pgTable("events", {
  id: integer("id").primaryKey(),
  start_time: timestamp("start_time").notNull(),
  name: text("name").notNull(),
  confirmation_type: eventConfirmationTypeEnum("confirmation_type").notNull(),
  location: text("location").notNull(),
  type: eventTypeEnum("type").notNull(),
  groups: jsonb("groups").$type<EventGroups>().default({}),
  confirmed_players: integer("confirmed_players").array().notNull().default([]),
})

export type InsertUser = typeof usersTable.$inferInsert
export type SelectUser = typeof usersTable.$inferSelect
export type InsertEvent = typeof eventsTable.$inferInsert
export type SelectEvent = typeof eventsTable.$inferSelect
