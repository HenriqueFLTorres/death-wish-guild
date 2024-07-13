import { TRPCError, initTRPC } from "@trpc/server"
import superjson from "superjson"

import type { createContext } from "./context"

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
})

export const createCallerFactory = t.createCallerFactory
export const router = t.router

export const publicProcedure = t.procedure
export const authenticatedProcedure = t.procedure.use((opts) => {
  const { ctx } = opts

  if (ctx.session == null) throw new TRPCError({ code: "UNAUTHORIZED" })

  return opts.next()
})
export const adminProcedure = authenticatedProcedure.use((opts) => {
  const { ctx } = opts

  if (ctx.session == null || ctx.session.user.role !== "ADMIN")
    throw new TRPCError({ code: "UNAUTHORIZED" })

  return opts.next()
})
