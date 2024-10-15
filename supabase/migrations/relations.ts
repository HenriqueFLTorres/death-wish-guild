import { relations } from "drizzle-orm/relations"
import {
  account,
  auction,
  events,
  item,
  logs,
  session,
  user,
  user_events,
  user_logs,
} from "./schema"

export const auctionRelations = relations(auction, ({ one }) => ({
  item: one(item, {
    fields: [auction.item_id],
    references: [item.id],
  }),
}))

export const itemRelations = relations(item, ({ many }) => ({
  auctions: many(auction),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const userRelations = relations(user, ({ one, many }) => ({
  sessions: many(session),
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
