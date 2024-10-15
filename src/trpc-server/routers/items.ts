import { eq } from "drizzle-orm"
import { z } from "zod"
import { adminProcedure, authenticatedProcedure, router } from ".."
import { item } from "../../../supabase/migrations/schema"
import { db } from "@/db"
import { traitsEnum } from "@/types/traits"

export const itemRouter = router({
  getItem: authenticatedProcedure
    .input(
      z.object({
        itemID: z.string(),
      })
    )
    .query(async (opts) => {
      const { input } = opts

      const [targetItem] = await db
        .select()
        .from(item)
        .where(eq(item.id, input.itemID))
        .limit(1)

      return targetItem
    }),

  getItems: authenticatedProcedure.query(async () => {
    const items = await db.select().from(item)

    return items
  }),

  addItem: adminProcedure
    .input(z.object({ name: z.string(), trait: traitsEnum }))
    .mutation(async (opts) => {
      const { input } = opts

      const [{ insertedID }] = await db
        .insert(item)
        .values(input)
        .returning({ insertedID: item.id })

      return insertedID
    }),
})
