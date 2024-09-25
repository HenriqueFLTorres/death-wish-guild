import { and, desc, eq, sql } from "drizzle-orm"
import { z } from "zod"
import {
  adminProcedure,
  authenticatedProcedure,
  publicProcedure,
  router,
} from ".."
import { user } from "../../../supabase/migrations/schema"
import { createLog } from "../utils"
import { db } from "@/db"
import { SelectUser } from "@/db/schema"

export const userRouter = router({
  getUser: authenticatedProcedure
    .input(
      z.object({
        userID: z.string(),
      })
    )
    .query(async (opts) => {
      const { input } = opts

      const [targetUser] = await db
        .select()
        .from(user)
        .where(and(eq(user.id, input.userID), eq(user.is_recruited, true)))
        .limit(1)

      const [invitedBy] = await db
        .select()
        .from(user)
        .where(eq(user.id, targetUser.invited_by as string))
        .limit(1)

      return { ...targetUser, invitedBy }
    }),
  updateUserInfo: authenticatedProcedure
    .input(
      z.object({
        name: z.string(),
        image: z.string().nullish(),
        class: z.enum(["DPS", "RANGED_DPS", "TANK", "SUPPORT"]),
      })
    )
    .mutation(async (opts) => {
      const { input, ctx } = opts

      const currentUser = ctx.session?.user

      if (currentUser?.id == null) throw new Error("User not found")

      const [updatedUser] = await db
        .update(user)
        .set({
          name: input.name,
          image: input.image,
          class: input.class,
        })
        .where(eq(user.id, currentUser.id))
        .returning({
          id: user.id,
          name: user.name,
          image: user.image,
          class: user.class,
        })

      const logObject = {
        action: "UPDATE",
        triggered_by: updatedUser.id,
        category: "USER",
      } as const

      const hasNameChanged = updatedUser.name !== currentUser.name
      if (hasNameChanged)
        await createLog({
          type: "USER_NAME",
          from: currentUser.name,
          to: updatedUser.name,
          ...logObject,
        })

      const hasClassChanged = updatedUser.class !== currentUser.class
      if (hasClassChanged)
        await createLog({
          type: "USER_CLASS",
          from: currentUser.class,
          to: updatedUser.class,
          ...logObject,
        })
    }),
  getUsers: authenticatedProcedure.query(async () => {
    const users = await db
      .select()
      .from(user)
      .where(eq(user.is_recruited, true))
    return users
  }),
  getUsersForRecruitment: authenticatedProcedure.query(async () => {
    const users = await db
      .select()
      .from(user)
      .where(and(eq(user.is_recruited, false), eq(user.is_boarded, true)))
    return users
  }),
  getPlayersByClass: authenticatedProcedure.query(async () => {
    const users = await db
      .select({
        class: user.class,
        count: sql<number>`cast(count(${user.id}) as int)`,
      })
      .from(user)
      .where(eq(user.is_recruited, true))
      .groupBy(user.class)

    return users
  }),
  getRecentPlayers: authenticatedProcedure.query(async () => {
    const users = await db
      .select()
      .from(user)
      .where(eq(user.is_recruited, true))
      .orderBy(desc(user.joined_at))
      .limit(5)

    return users
  }),
  getPlayersPointsRanking: authenticatedProcedure.query(async () => {
    const users = await db
      .select()
      .from(user)
      .where(eq(user.is_recruited, true))
      .orderBy(desc(user.points))
      .limit(5)

    return users
  }),
  getPositionMember: authenticatedProcedure
    .input(
      z.object({
        userID: z.string().nullish(),
      })
    )
    .query(async (opts) => {
      const { input } = opts

      const [targetUser] = await db.execute(sql`
          SELECT
            id,
            name,
            image,
            points,
            class,
            rank
          FROM (
            SELECT
              id,
              name,
              image,
              points,
              class,
              RANK() OVER (ORDER BY points DESC) AS rank
            FROM
              public.user
          ) ranked_users
          WHERE
            id = ${input.userID};
        `)

      return targetUser as SelectUser & { rank: string }
    }),
  acceptRecruit: adminProcedure
    .input(
      z.object({
        ID: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input, ctx } = opts
      const currentUser = ctx.session?.user

      await db
        .update(user)
        .set({
          joined_at: new Date().toISOString(),
          invited_by: currentUser?.id,
          is_recruited: true,
        })
        .where(eq(user.id, input.ID))
    }),
  rejectRecruit: adminProcedure
    .input(
      z.object({
        ID: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts

      await db.delete(user).where(eq(user.id, input.ID))
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
        .where(and(eq(user.id, input.userID), eq(user.is_recruited, true)))
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
        name: z.string(),
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
          name: input.name,
        })
        .where(eq(user.id, input.userID))
        .returning({ updatedID: user.id })
      return updatedID
    }),
})
