import { desc, eq, sql } from "drizzle-orm"
import { z } from "zod"
import { events, user } from "../../supabase/migrations/schema"
import {
  adminProcedure,
  authenticatedProcedure,
  publicProcedure,
  router,
} from "./index"
import { db } from "@/db"

export const appRouter = router({
  getUsers: authenticatedProcedure.query(async () => {
    const users = await db.select().from(user)
    return users
  }),
  getPlayersByClass: authenticatedProcedure.query(async () => {
    const users = await db
      .select({
        class: user.class,
        count: sql<number>`cast(count(${user.id}) as int)`,
      })
      .from(user)
      .groupBy(user.class)

    return users
  }),
  getRecentPlayers: authenticatedProcedure.query(async () => {
    const users = await db
      .select()
      .from(user)
      .orderBy(desc(user.created_at))
      .limit(5)

    return users
  }),
  updateUserRole: adminProcedure
    .input(
      z.object({
        userID: z.string(),
        role: z.enum(["ADMIN", "MODERATOR", "MEMBER"]),
      })
    )
    .mutation(async (opts) => {
      const { input, ctx } = opts
      const currentUser = ctx.session?.user

      if (currentUser?.id === input.userID)
        throw new Error("You cannot change your own role")

      const [targetUser] = await db
        .select()
        .from(user)
        .where(eq(user.id, input.userID))
        .limit(1)

      if (targetUser.role === "ADMIN")
        throw new Error("You cannot change the role of an admin")

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
})

export type AppRouter = typeof appRouter
