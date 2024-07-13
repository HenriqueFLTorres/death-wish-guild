"use client"

import { CreateEvent } from "./CreateEvent"
import { EventCard } from "./EventCard"
import { trpc } from "@/trpc-client/client"

function Events() {
  const { data: events = [] } = trpc.getEvents.useQuery()

  const eventsSortedByDate = events.sort(
    (a, b) => Number(new Date(b.start_time)) - Number(new Date(a.start_time))
  )

  return (
    <section className="relative z-10 flex flex-col justify-between gap-4">
      <ol className="scrollbar flex flex-col gap-4 overflow-auto rounded-2xl">
        {eventsSortedByDate?.map((event) => (
          <EventCard key={event.start_time.toString()} {...event} />
        ))}
      </ol>

      <CreateEvent />
    </section>
  )
}
export { Events }
