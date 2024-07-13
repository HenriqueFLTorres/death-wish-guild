"use client"

import {
  QueryClientProvider as Provider,
  QueryClient,
} from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import type { ReactNode } from "react"
import superjson from "superjson"
import { trpc } from "@/trpc-client/client"

const url = "http://localhost:3000/api/trpc"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        throwOnError: true,
      },
      mutations: {
        onError: (error) => console.error(error),
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient()
  }

  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}

interface QueryClientProviderProps {
  children: ReactNode
}

export default function QueryClientProvider(props: QueryClientProviderProps) {
  const { children } = props
  const queryClient = getQueryClient()

  const trpcClient = trpc.createClient({
    transformer: superjson,
    links: [
      httpBatchLink({
        url,
      }),
    ],
  })

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <Provider client={queryClient}>{children}</Provider>
    </trpc.Provider>
  )
}
