import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query"
import Image from "next/image"
import type { ReactNode } from "react"

import { Events } from "./_components/Events"
import { EVENTS } from "@/lib/QueryKeys"
import { createClient } from "@/lib/supabase/server"

interface TemplateProps {
  children: ReactNode
}

export default async function Template(props: TemplateProps) {
  const { children } = props

  const queryClient = new QueryClient()
  const supabase = createClient()

  await queryClient.prefetchQuery({
    queryKey: [EVENTS.GET_EVENTS],
    queryFn: async () => {
      const { data } = await supabase.from("events").select().limit(10)

      return data
    },
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className="relative flex max-h-[75vh] w-full max-w-screen-xl gap-6 overflow-hidden rounded-lg px-7 py-10">
        <div className="absolute left-0 top-0 h-full w-full rounded-none bg-gradient-to-b from-neutral-800 to-neutral-900 opacity-60 backdrop-blur-lg" />

        <Image
          alt=""
          className="pointer-events-none absolute w-full scale-125 object-cover"
          src={"/groups-decal.png"}
          fill
        />

        <Events />

        {children}
      </section>
    </HydrationBoundary>
  )
}
