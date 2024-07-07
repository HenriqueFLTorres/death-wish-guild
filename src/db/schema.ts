import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core"
import type { AdapterAccount } from "next-auth/adapters"

const eventTypeEnum = pgEnum("event_type", ["PVP", "PVE", "GUILD", "OTHER"])
const eventConfirmationTypeEnum = pgEnum("confirmation_type", [
  "PER_PLAYER",
  "PER_GROUP",
])

export const eventsTable = pgTable("events", {
  id: integer("id"),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  name: text("name").notNull(),
  confirmationType: eventConfirmationTypeEnum("confirmation_type").notNull(),
  location: text("location").notNull(),
  type: eventTypeEnum("event_type").notNull(),
  groups: jsonb("groups").$type<EventGroups>().default({}),
  confirmedPlayers: text("confirmed_players").array(),
})

const userRoleEnum = pgEnum("role_type", ["ADMIN", "MODERATOR", "MEMBER"])
const classEnum = pgEnum("class_type", ["DPS", "RANGED_DPS", "TANK", "SUPPORT"])

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  isBoarded: boolean("is_boarded").notNull().default(false),
  role: userRoleEnum("role").notNull().default("MEMBER"),
  displayName: text("display_name"),
  class: classEnum("class").notNull().default("DPS"),
})

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export type InsertUser = typeof users.$inferInsert
export type SelectUser = typeof users.$inferSelect
export type InsertEvent = typeof eventsTable.$inferInsert
export type SelectEvent = typeof eventsTable.$inferSelect
