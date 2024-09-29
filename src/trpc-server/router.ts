import { eventRouter } from "./routers/event"
import { guildRouter } from "./routers/guild"
import { logRouter } from "./routers/logs"
import { userRouter } from "./routers/user"
import { router } from "./index"

export const appRouter = router({
  events: eventRouter,
  user: userRouter,
  logs: logRouter,
  guild: guildRouter,
})

export type AppRouter = typeof appRouter
