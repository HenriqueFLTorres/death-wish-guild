import { and, asc, between, eq, gte, lte, sql } from "drizzle-orm"
import { z } from "zod"
import { adminProcedure, authenticatedProcedure, router } from ".."
import { events, user, user_events } from "../../../supabase/migrations/schema"
import { db } from "@/db"

export const eventRouter = router({
  getEvent: authenticatedProcedure
    .input(z.object({ id: z.number() }))
    .query(async (opts) => {
      const { input } = opts

      const [event] = await db
        .select()
        .from(events)
        .where(eq(events.id, input.id))
        .limit(1)

      return event
    }),
  getEvents: authenticatedProcedure.query(async () => {
    const eventsData = await db.select().from(events)
    return eventsData
  }),
  getEventsByDay: authenticatedProcedure
    .input(z.object({ startOfDay: z.date(), endOfDay: z.date() }))
    .query(async (opts) => {
      const { input } = opts

      const eventsData = await db
        .select()
        .from(events)
        .where(
          between(
            events.start_time,
            input.startOfDay.toISOString(),
            input.endOfDay.toISOString()
          )
        )
        .orderBy(asc(events.start_time))

      return eventsData
    }),
  getUnfinishedEvents: adminProcedure.query(async () => {
    const eventsData = await db
      .select()
      .from(events)
      .where(
        and(
          lte(events.start_time, new Date().toDateString()),
          eq(events.is_finished, false)
        )
      )
      .orderBy(asc(events.start_time))

    return eventsData
  }),
  getNextEvents: authenticatedProcedure.query(async () => {
    const eventsData = await db
      .select()
      .from(events)
      .where(gte(events.start_time, new Date().toDateString()))
      .orderBy(asc(events.start_time))
      .limit(5)

    return eventsData
  }),
  createEvent: adminProcedure
    .input(
      z.object({
        start_time: z.string(),
        name: z.string(),
        confirmation_type: z.enum(["PER_PLAYER", "PER_GROUP"]),
        event_type: z.enum(["PVP", "PVE", "GUILD", "OTHER"]),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts

      const [{ insertedID }] = await db
        .insert(events)
        .values(input)
        .returning({ insertedID: events.id })

      return insertedID
    }),
  updateEventGroup: adminProcedure
    .input(z.object({ id: z.number(), groups: z.any() }))
    .mutation(async (opts) => {
      const { input } = opts

      const [{ updatedID }] = await db
        .update(events)
        .set({ groups: sql`${input.groups}::jsonb` })
        .where(eq(events.id, input.id))
        .returning({ updatedID: events.id })

      return updatedID
    }),
  confirmEvent: authenticatedProcedure
    .input(z.object({ eventID: z.number() }))
    .mutation(async (opts) => {
      const { ctx, input } = opts

      const eventID = input.eventID
      const userID = ctx.session?.user.id

      const [{ updatedID }] = await db
        .update(events)
        .set({
          confirmed_players: sql`array_append(confirmed_players, ${userID})`,
        })
        .where(eq(events.id, eventID))
        .returning({ updatedID: user.id })

      return updatedID
    }),
  removeEventConfirmation: authenticatedProcedure
    .input(z.object({ eventID: z.number() }))
    .mutation(async (opts) => {
      const { ctx, input } = opts

      const eventID = input.eventID
      const userID = ctx.session?.user.id

      const [{ updatedID }] = await db
        .update(events)
        .set({
          confirmed_players: sql`array_remove(confirmed_players, ${userID})`,
        })
        .where(eq(events.id, eventID))
        .returning({ updatedID: user.id })

      return updatedID
    }),
  finishEvent: adminProcedure
    .input(z.object({ id: z.number(), confirmedPlayers: z.string().array() }))
    .mutation(async (opts) => {
      const { input, ctx } = opts

      if (ctx.session?.user.role !== "ADMIN") throw new Error("Unauthorized")

      const [{ updatedID }] = await db
        .update(events)
        .set({ is_finished: true, confirmed_players: input.confirmedPlayers })
        .where(and(eq(events.id, input.id), eq(events.is_finished, false)))
        .returning({ updatedID: events.id })

      await Promise.all(
        input.confirmedPlayers.map(async (playerID) => {
          await db.insert(user_events).values({
            user_id: playerID,
            event_id: updatedID,
          })
          await db
            .update(user)
            .set({
              finished_events_count: sql`${user.finished_events_count} + 1`,
            })
            .where(eq(user.id, playerID))
        })
      )

      return updatedID
    }),
})
