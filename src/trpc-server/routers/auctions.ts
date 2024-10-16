import { eq } from "drizzle-orm"
import { z } from "zod"
import { adminProcedure, authenticatedProcedure, router } from ".."
import { auctions } from "../../../supabase/migrations/schema"
import { db } from "@/db"
import { classesEnum } from "@/types/classes"

export const auctionRouter = router({
  getAuction: authenticatedProcedure
    .input(
      z.object({
        auctionID: z.string(),
      })
    )
    .query(async (opts) => {
      const { input } = opts

      const [targetAuction] = await db
        .select()
        .from(auctions)
        .where(eq(auctions.id, input.auctionID))
        .limit(1)

      return targetAuction
    }),

  getAuctions: authenticatedProcedure.query(async () => {
    const guildAuctions = await db.select().from(auctions)

    return guildAuctions
  }),

  createAuction: adminProcedure
    .input(
      z.object({
        item_id: z.string(),
        biddable_classes: z.array(classesEnum),
        start_price: z.number(),
        start_time: z.string().datetime(),
        end_time: z.string().datetime(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts

      const [insertedID] = await db.insert(auctions).values(input)

      return insertedID
    }),
})
