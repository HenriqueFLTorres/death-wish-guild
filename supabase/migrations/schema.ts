import {
  type AnyPgColumn,
  boolean,
  foreignKey,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

export const aal_level = pgEnum("aal_level", ["aal1", "aal2", "aal3"])
export const code_challenge_method = pgEnum("code_challenge_method", [
  "s256",
  "plain",
])
export const factor_status = pgEnum("factor_status", ["unverified", "verified"])
export const factor_type = pgEnum("factor_type", ["totp", "webauthn", "phone"])
export const one_time_token_type = pgEnum("one_time_token_type", [
  "confirmation_token",
  "reauthentication_token",
  "recovery_token",
  "email_change_token_new",
  "email_change_token_current",
  "phone_change_token",
])
export const key_status = pgEnum("key_status", [
  "default",
  "valid",
  "invalid",
  "expired",
])
export const key_type = pgEnum("key_type", [
  "aead-ietf",
  "aead-det",
  "hmacsha512",
  "hmacsha256",
  "auth",
  "shorthash",
  "generichash",
  "kdf",
  "secretbox",
  "secretstream",
  "stream_xchacha20",
])
export const auction_status_type = pgEnum("auction_status_type", [
  "OPEN",
  "FINISHED",
  "CANCELED",
])
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
export const log_action = pgEnum("log_action", [
  "CREATE",
  "UPDATE",
  "DELETE",
  "FINISH",
])
export const log_category = pgEnum("log_category", [
  "USER",
  "AUCTION",
  "EVENTS",
])
export const log_type = pgEnum("log_type", [
  "USER_NAME",
  "PRIMARY_WEAPON",
  "SECONDARY_WEAPON",
  "POINTS",
  "AUCTION",
  "BID",
  "GUILD_JOIN",
  "EVENT",
  "USER_CLASS",
])
export const role_type = pgEnum("role_type", ["ADMIN", "MODERATOR", "MEMBER"])
export const action = pgEnum("action", [
  "INSERT",
  "UPDATE",
  "DELETE",
  "TRUNCATE",
  "ERROR",
])
export const equality_op = pgEnum("equality_op", [
  "eq",
  "neq",
  "lt",
  "lte",
  "gt",
  "gte",
  "in",
])

export const bid_history = pgTable("bid_history", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "set null" }),
  auction_id: uuid("auction_id")
    .notNull()
    .references(() => auctions.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  amount: integer("amount").notNull(),
  bidded_at: timestamp("bidded_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
})

export const auctions = pgTable("auctions", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  current_max_bid: integer("current_max_bid"),
  class_type: class_type("biddable_classes").array(),
  start_time: timestamp("start_time", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
  end_time: timestamp("end_time", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  item_id: uuid("item_id")
    .notNull()
    .references((): AnyPgColumn => items.id, { onDelete: "set null" }),
  initial_bid: integer("initial_bid").default(0).notNull(),
  status: auction_status_type("status").default("OPEN").notNull(),
  bid_history: uuid("bid_history").array(),
})

export const events = pgTable("events", {
  id: serial("id").primaryKey().notNull(),
  start_time: timestamp("start_time", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
  name: text("name").notNull(),
  confirmation_type: confirmation_type("confirmation_type").notNull(),
  event_type: event_type("event_type").notNull(),
  groups: jsonb("groups").default({}),
  confirmed_players: text("confirmed_players").array(),
  is_finished: boolean("is_finished").default(false).notNull(),
  points_for_completion: integer("points_for_completion").default(0).notNull(),
})

export const guild = pgTable("guild", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text("name").notNull(),
  message_of_the_day: text("message_of_the_day"),
})

export const items = pgTable("items", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text("name").notNull(),
  trait: text("trait").notNull(),
  added_at: timestamp("added_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  acquired_by: text("acquired_by")
    .notNull()
    .references(() => user.id),
  auction_id: uuid("auction_id").references((): AnyPgColumn => auctions.id, {
    onDelete: "set null",
  }),
})

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    image: text("image"),
    is_recruited: boolean("is_recruited").default(false).notNull(),
    role: role_type("role").default("MEMBER").notNull(),
    username: text("username"),
    class: class_type("class").default("DPS").notNull(),
    joined_at: timestamp("joined_at", { mode: "string" }),
    points: integer("points").default(0).notNull(),
    invited_by: text("invited_by"),
    is_boarded: boolean("is_boarded").default(false).notNull(),
    user_logs: uuid("user_logs").array(),
    discord_id: text("discord_id"),
    emailVerified: timestamp("emailVerified", { mode: "string" }),
    finished_events_count: integer("finished_events_count")
      .default(0)
      .notNull(),
  },
  (table) => {
    return {
      user_invited_by_fkey: foreignKey({
        columns: [table.invited_by],
        foreignColumns: [table.id],
        name: "user_invited_by_fkey",
      }),
    }
  }
)

export const logs = pgTable("logs", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  category: log_category("category").notNull(),
  type: log_type("type").notNull(),
  action: log_action("action").notNull(),
  target_id: text("target_id"),
  from: text("from"),
  to: text("to"),
  triggered_by: text("triggered_by").notNull(),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
})

export const session = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey().notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "string" }).notNull(),
})

export const user_events = pgTable(
  "user_events",
  {
    user_id: text("user_id")
      .notNull()
      .references(() => user.id),
    event_id: serial("event_id")
      .notNull()
      .references(() => events.id),
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

export const user_logs = pgTable(
  "user_logs",
  {
    user_id: text("user_id")
      .notNull()
      .references(() => user.id),
    log_id: uuid("log_id")
      .notNull()
      .references(() => logs.id),
  },
  (table) => {
    return {
      user_logs_pkey: primaryKey({
        columns: [table.user_id, table.log_id],
        name: "user_logs_pkey",
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
