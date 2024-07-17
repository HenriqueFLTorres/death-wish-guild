import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core"

export const class_type = pgEnum("class_type", [
  "DPS",
  "RANGED_DPS",
  "TANK",
  "SUPPORT",
])
export const confirmation_type = pgEnum("confirmation_type", [
  "PER_PLAYER",
  "PER_GROUP",
])
export const event_type = pgEnum("event_type", ["PVP", "PVE", "GUILD", "OTHER"])
export const role_type = pgEnum("role_type", ["ADMIN", "MODERATOR", "MEMBER"])

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: timestamp("emailVerified", { mode: "string" }),
    image: text("image"),
    is_boarded: boolean("is_boarded").default(false).notNull(),
    role: role_type("role").default("MEMBER").notNull(),
    display_name: text("display_name"),
    class: class_type("class").default("DPS").notNull(),
    finished_events_count: integer("finished_events_count")
      .default(0)
      .notNull(),
  },
  (table) => {
    return {
      user_id_key: unique("user_id_key").on(table.id),
    }
  }
)

export const session = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey().notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "string" }).notNull(),
})

export const events = pgTable(
  "events",
  {
    id: serial("id").primaryKey(),
    start_time: timestamp("start_time", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    name: text("name").notNull(),
    confirmation_type: confirmation_type("confirmation_type").notNull(),
    event_type: event_type("event_type").notNull(),
    groups: jsonb("groups").default({}),
    confirmed_players: text("confirmed_players").array(),
  },
  (table) => {
    return {
      events_id_key: unique("events_id_key").on(table.id),
    }
  }
)

export const user_events = pgTable(
  "user_events",
  {
    user_id: text("user_id")
      .notNull()
      .references(() => user.id),
    event_id: serial("event_id").references(() => events.id),
  },
  (table) => {
    return {
      user_events_pkey: primaryKey({
        columns: [table.user_id, table.event_id],
        name: "user_events_pkey",
      }),
    }
  }
)

export const account = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
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
  (table) => {
    return {
      account_provider_providerAccountId_pk: primaryKey({
        columns: [table.provider, table.providerAccountId],
        name: "account_provider_providerAccountId_pk",
      }),
    }
  }
)
