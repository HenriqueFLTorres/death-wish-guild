import { desc, eq, inArray, or } from "drizzle-orm"
import { z } from "zod"
import { authenticatedProcedure, router } from ".."
import {
  log_action,
  log_category,
  logs,
  user,
} from "../../../supabase/migrations/schema"
import { db } from "@/db"

export const logRouter = router({
  getLatestLogs: authenticatedProcedure
    .input(
      z
        .object({
          category: z.enum(log_category.enumValues).array(),
          action: z.enum(log_action.enumValues).array(),
        })
        .optional()
    )
    .query(async (opts) => {
      const { input } = opts

      const categoryFilter = input?.category ?? []
      const actionFilter = input?.action ?? []

      const logsQuery = db
        .select()
        .from(logs)
        .where(
          or(
            categoryFilter.length > 0
              ? inArray(logs.category, categoryFilter)
              : undefined,
            actionFilter.length > 0
              ? inArray(logs.action, actionFilter)
              : undefined
          )
        )

      const logsData = await logsQuery.orderBy(desc(logs.created_at)).limit(20)

      const logsWithUser = Promise.all(
        logsData.map(async (log) => {
          const [triggerUser] = await db
            .select()
            .from(user)
            .where(eq(user.id, log.triggered_by))
            .limit(1)

          return {
            ...log,
            triggerUser,
          }
        })
      )

      return logsWithUser
    }),
  getLatestPlayerLogs: authenticatedProcedure
    .input(z.object({ userID: z.string().nullish() }))
    .query(async (opts) => {
      const { input } = opts

      if (input.userID == null) return []

      const logsData = await db
        .select()
        .from(logs)
        .where(
          or(
            eq(logs.triggered_by, input.userID),
            eq(logs.target_id, input.userID)
          )
        )
        .orderBy(desc(logs.created_at))
        .limit(5)

      const logsWithUser = Promise.all(
        logsData.map(async (log) => {
          const [triggerUser] = await db
            .select()
            .from(user)
            .where(eq(user.id, log.triggered_by))
            .limit(1)

          return {
            ...log,
            triggerUser,
          }
        })
      )

      return logsWithUser
    }),
})
