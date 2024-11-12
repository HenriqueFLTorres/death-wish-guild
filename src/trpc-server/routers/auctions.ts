import { eq, sql } from "drizzle-orm"
import { z } from "zod"
import { adminProcedure, authenticatedProcedure, router } from ".."
import { auctions, items, user } from "../../../supabase/migrations/schema"
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
        .innerJoin(items, eq(items.id, auctions.item_id))
        .limit(1)

      return {
        ...targetAuction.auctions,
        item: targetAuction.items,
      }
    }),
  getAuctions: authenticatedProcedure.query(async () => {
    const guildAuctions = await db
      .select()
      .from(auctions)
      .innerJoin(items, eq(items.id, auctions.item_id))

    const joinedData = guildAuctions.map((auction) => ({
      ...auction.auctions,
      item: {
        ...auction.items,
      },
    }))

    return joinedData
  }),
  createAuction: adminProcedure
    .input(
      z.object({
        item_id: z.string(),
        initial_bid: z.number(),
        class_type: z.array(classesEnum),
        start_time: z.string(),
        end_time: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts

      const [{ insertedID }] = await db
        .insert(auctions)
        .values(input)
        .returning({ insertedID: auctions.id })

      const [{ updatedID }] = await db
        .update(items)
        .set({ auction_id: insertedID })
        .where(eq(items.id, input.item_id))
        .returning({ updatedID: items.auction_id })

      return { insertedID, updatedID }
    }),
  deleteAuction: adminProcedure
    .input(
      z.object({
        auctionID: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts
      const [deletedAuction] = await db
        .delete(auctions)
        .where(eq(auctions.id, input.auctionID))

      return deletedAuction
    }),
  forceAuction: authenticatedProcedure
    .input(
      z.object({
        auctionID: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts
      const now = new Date(Date.now()).toISOString()
      const [forceAuction] = await db
        .update(auctions)
        .set({ start_time: now })
        .where(eq(auctions.id, input.auctionID))

      return forceAuction
    }),
  cancelAuction: adminProcedure
    .input(
      z.object({
        auctionID: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts

      const [cancelAuction] = await db
        .update(auctions)
        .set({ status: "CANCELED" })
        .where(eq(auctions.id, input.auctionID))

      return cancelAuction
    }),
  endAuction: adminProcedure
    .input(
      z.object({
        auctionID: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts

      const [endAuction] = await db
        .update(auctions)
        .set({ status: "FINISHED" })
        .where(eq(auctions.id, input.auctionID))

      return endAuction
    }),
  getBidHistory: authenticatedProcedure
    .input(
      z.object({
        auctionID: z.string(),
      })
    )
    .query(async (opts) => {
      const { input } = opts

      const [auction] = await db
        .select()
        .from(auctions)
        .where(eq(auctions.id, input.auctionID))
        .limit(1)

      const bidHistory = auction.bid_history?.bid_history ?? []

      const parsedBidHistory = await Promise.all(
        bidHistory.map(async (bid) => {
          const [bidder] = await db
            .select()
            .from(user)
            .where(eq(user.id, bid.user_id))
            .limit(1)

          return {
            ...bid,
            user: bidder,
          }
        })
      )

      return parsedBidHistory.reverse()
    }),
  placeBid: authenticatedProcedure
    .input(
      z.object({
        auctionID: z.string(),
        amount: z.number(),
      })
    )
    .mutation(async (opts) => {
      const { input, ctx } = opts

      const user = ctx.session?.user

      if (user == null) throw new Error("USER_NOT_AUTHENTICATED")
      if (user.points < input.amount) throw new Error("INSUFFICIENT_POINTS")

      const [auction] = await db
        .select()
        .from(auctions)
        .where(eq(auctions.id, input.auctionID))
        .limit(1)

      if (auction == null) throw new Error("AUCTION_NOT_FOUND")
      if (
        auction.class_type != null &&
        !auction.class_type.includes(user.class)
      )
        throw new Error("NOT_ALLOWED_CLASS")

      const minBidAmount =
        auction.current_max_bid == null
          ? auction.initial_bid
          : auction.current_max_bid + 5

      if (input.amount < minBidAmount) throw new Error("INVALID_BID_AMOUNT")

      const [{ updatedID }] = await db
        .update(auctions)
        .set({
          current_max_bid: input.amount,
          bid_history: sql`jsonb_set(
            COALESCE(${auctions.bid_history}, '{"bid_history":[]}'::jsonb),
            '{bid_history}',
            (COALESCE(${auctions.bid_history}->>'bid_history', '[]')::jsonb || 
              jsonb_build_object(
                'amount', ${input.amount}::numeric,
                'user_id', ${user.id}::text,
                'bidded_at', ${new Date().toISOString()}::timestamp,
                'id', ${crypto.randomUUID()}::uuid
              )::jsonb
            )
          )`,
        })
        .where(eq(auctions.id, input.auctionID))
        .returning({ updatedID: auctions.id })

      return updatedID
    }),
  deleteBid: adminProcedure
    .input(
      z.object({
        auctionID: z.string(),
        bidId: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts

      const [auction] = await db
        .select()
        .from(auctions)
        .where(eq(auctions.id, input.auctionID))
        .limit(1)

      const filtered = auction.bid_history?.bid_history.filter(
        (x) => x.id !== input.bidId
      )
      if (filtered === undefined) return

      return []
    }),
})
