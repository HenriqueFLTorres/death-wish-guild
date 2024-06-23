"use client"

import { useQuery } from "@tanstack/react-query"
import { CreateEvent } from "./CreateEvent"
import { EventCard } from "./EventCard"
import { EVENTS } from "@/lib/QueryKeys"
import { createClient } from "@/lib/supabase/client"

function Events() {
  const supabase = createClient()

  const { data: events = [] } = useQuery({
    queryKey: [EVENTS.GET_EVENTS],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select().limit(10)

      if (error != null) throw new Error(`Failed to fetch events: ${error}`)

      return data
    },
  })

  return (
    <section className="relative z-10 flex flex-col justify-between gap-4">
      <ol className="flex flex-col gap-4">
        {events?.map((event) => (
          <EventCard key={event.start_time} {...event} />
        ))}
      </ol>

      <CreateEvent />
    </section>
  )
}
export { Events }
