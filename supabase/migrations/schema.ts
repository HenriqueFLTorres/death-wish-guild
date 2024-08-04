import {
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
} from "drizzle-orm/pg-core"

export const aal_level = pgEnum("aal_level", ["aal1", "aal2", "aal3"])
export const code_challenge_method = pgEnum("code_challenge_method", [
  "s256",
  "plain",
])
export const factor_status = pgEnum("factor_status", ["unverified", "verified"])
export const factor_type = pgEnum("factor_type", ["totp", "webauthn"])
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

export const session = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey().notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "string" }).notNull(),
})

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
    created_at: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    points: integer("points").default(0).notNull(),
    invited_by: text("invited_by"),
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
