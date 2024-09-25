import { eventRouter } from "./routers/event"
import { logRouter } from "./routers/logs"
import { userRouter } from "./routers/user"
import { router } from "./index"

export const appRouter = router({
  events: eventRouter,
  user: userRouter,
  logs: logRouter,
})

export type AppRouter = typeof appRouter
