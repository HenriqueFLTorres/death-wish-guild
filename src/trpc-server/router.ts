import { eq, sql } from "drizzle-orm"
import { z } from "zod"
import { events, user } from "../../supabase/migrations/schema"
import { publicProcedure, router } from "./index"
import { db } from "@/db"

export const appRouter = router({
  getUsers: publicProcedure.query(async () => {
    const users = await db.select().from(user)
    return users
  }),
  updateUserRole: publicProcedure
    .input(
      z.object({
        userID: z.string(),
        role: z.enum(["ADMIN", "MODERATOR", "MEMBER"]),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts

      await db
        .update(user)
        .set({
          role: input.role,
        })
        .where(eq(user.id, input.userID))
    }),
  completeOnboarding: publicProcedure
    .input(
      z.object({
        userID: z.string().nullish(),
        class: z.enum(["DPS", "RANGED_DPS", "TANK", "SUPPORT"]),
        displayName: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts

      if (input.userID == null) throw new Error("User ID is required")

      const [{ updatedID }] = await db
        .update(user)
        .set({
          is_boarded: true,
          class: input.class,
          display_name: input.displayName,
        })
        .where(eq(user.id, input.userID))
        .returning({ updatedID: user.id })
      return updatedID
    }),
  getEvent: publicProcedure
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
  getEvents: publicProcedure.query(async () => {
    const eventsData = await db.select().from(events)
    return eventsData
  }),
  createEvent: publicProcedure
    .input(
      z.object({
        start_time: z.date(),
        name: z.string(),
        location: z.string(),
        confirmation_type: z.enum(["PER_PLAYER", "PER_GROUP"]),
        event_type: z.enum(["PVP", "PVE", "GUILD", "OTHER"]),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts

      const [{ insertedID }] = await db
        .insert(events)
        .values({
          ...input,
          start_time: input.start_time.toDateString(),
        })
        .returning({ insertedID: events.id })

      return insertedID
    }),
  updateEventGroup: publicProcedure
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
})

export type AppRouter = typeof appRouter
