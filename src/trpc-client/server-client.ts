import { createCallerFactory } from "@/trpc-server"
import { createContext } from "@/trpc-server/context"
import { appRouter } from "@/trpc-server/router"

const createCaller = createCallerFactory(appRouter)

const context = await createContext()
export const serverClient = createCaller(context)
