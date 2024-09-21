import { createTRPCReact } from "@trpc/react-query"
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "@/trpc-server/router"

export const trpc = createTRPCReact<AppRouter>({})

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
