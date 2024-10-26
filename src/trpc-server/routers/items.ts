import { desc, eq } from "drizzle-orm"
import { z } from "zod"
import { adminProcedure, authenticatedProcedure, router } from ".."
import { items, user } from "../../../supabase/migrations/schema"
import { db } from "@/db"
import { traitsEnum } from "@/types/traits"

const itemsWithName = {
  id: items.id,
  auction_id: items.auction_id,
  name: items.name,
  trait: items.trait,
  acquired_by: user.name,
  added_at: items.added_at,
}

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
        .from(items)
        .where(eq(items.id, input.itemID))
        .limit(1)

      return targetItem
    }),

  getItems: authenticatedProcedure.query(async () => {
    const guildItems = await db
      .select(itemsWithName)
      .from(items)
      .leftJoin(user, eq(items.acquired_by, user.id))

    return guildItems
  }),

  getLatestDrops: authenticatedProcedure.query(async () => {
    const recentDrops = await db
      .select(itemsWithName)
      .from(items)
      .leftJoin(user, eq(items.acquired_by, user.id))
      .orderBy(desc(items.added_at))
      .limit(5)

    return recentDrops
  }),

  // getAvailableToAuctionItems: authenticatedProcedure.query(async () => {
  //   const available = await db
  //     .select()
  //     .from(items)
  //     .where(eq(items.auction_id, undefined))
  // }),

  addItem: adminProcedure
    .input(
      z.object({ name: z.string(), trait: traitsEnum, acquired_by: z.string() })
    )
    .mutation(async (opts) => {
      const { input } = opts

      const [{ insertedID }] = await db
        .insert(items)
        .values(input)
        .returning({ insertedID: items.id })

      return insertedID
    }),

  registerItemInAuction: adminProcedure
    .input(
      z.object({
        itemID: z.string(),
        auctionID: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts

      const [{ updatedID }] = await db
        .update(items)
        .set({ auction_id: input.auctionID })
        .where(eq(items.id, input.itemID))
        .returning({ updatedID: items.id })

      return updatedID
    }),
})
