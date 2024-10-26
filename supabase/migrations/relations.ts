import { relations } from "drizzle-orm/relations"
import {
  account,
  auctions,
  events,
  items,
  logs,
  session,
  user,
  user_events,
  user_logs,
} from "./schema"

export const auctionsRelations = relations(auctions, ({ one, many }) => ({
  item: one(items, {
    fields: [auctions.item_id],
    references: [items.id],
    relationName: "auctions_item_id_items_id",
  }),
  items: many(items, {
    relationName: "items_auction_id_auctions_id",
  }),
}))

export const itemsRelations = relations(items, ({ one, many }) => ({
  auctions: many(auctions, {
    relationName: "auctions_item_id_items_id",
  }),
  user: one(user, {
    fields: [items.acquired_by],
    references: [user.id],
  }),
  auction: one(auctions, {
    fields: [items.auction_id],
    references: [auctions.id],
    relationName: "items_auction_id_auctions_id",
  }),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const userRelations = relations(user, ({ one, many }) => ({
  sessions: many(session),
  items: many(items),
  user: one(user, {
    fields: [user.invited_by],
    references: [user.id],
    relationName: "user_invited_by_user_id",
  }),
  users: many(user, {
    relationName: "user_invited_by_user_id",
  }),
  user_events: many(user_events),
  user_logs: many(user_logs),
  accounts: many(account),
}))

export const user_eventsRelations = relations(user_events, ({ one }) => ({
  event: one(events, {
    fields: [user_events.event_id],
    references: [events.id],
  }),
  user: one(user, {
    fields: [user_events.user_id],
    references: [user.id],
  }),
}))

export const eventsRelations = relations(events, ({ many }) => ({
  user_events: many(user_events),
}))

export const user_logsRelations = relations(user_logs, ({ one }) => ({
  log: one(logs, {
    fields: [user_logs.log_id],
    references: [logs.id],
  }),
  user: one(user, {
    fields: [user_logs.user_id],
    references: [user.id],
  }),
}))

export const logsRelations = relations(logs, ({ many }) => ({
  user_logs: many(user_logs),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))
