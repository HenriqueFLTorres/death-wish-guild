import { auctionRouter } from "./routers/auctions"
import { eventRouter } from "./routers/event"
import { guildRouter } from "./routers/guild"
import { itemRouter } from "./routers/items"
import { logRouter } from "./routers/logs"
import { userRouter } from "./routers/user"
import { router } from "./index"

export const appRouter = router({
  events: eventRouter,
  user: userRouter,
  logs: logRouter,
  guild: guildRouter,
  items: itemRouter,
  auctions: auctionRouter,
})

export type AppRouter = typeof appRouter
