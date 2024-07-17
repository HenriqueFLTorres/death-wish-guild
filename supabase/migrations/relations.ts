import { relations } from "drizzle-orm/relations"
import { account, events, session, user, user_events } from "./schema"

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  user_events: many(user_events),
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

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))
