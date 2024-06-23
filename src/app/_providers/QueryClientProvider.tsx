"use client"

import {
  QueryClientProvider as Provider,
  QueryClient,
} from "@tanstack/react-query"
import type { ReactNode } from "react"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
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

  return <Provider client={queryClient}>{children}</Provider>
}
