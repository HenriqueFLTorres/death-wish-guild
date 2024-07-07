"use client"

import { CreateEvent } from "./CreateEvent"
import { EventCard } from "./EventCard"
import { useGetEvents } from "@/db/hooks/events/useGetEvents"

function Events() {
  const { data: events = [] } = useGetEvents()

  const eventsSortedByDate = events.sort(
    (a, b) => Number(new Date(b.startTime)) - Number(new Date(a.startTime))
  )

  return (
    <section className="relative z-10 flex flex-col justify-between gap-4">
      <ol className="scrollbar flex flex-col gap-4 overflow-auto rounded-2xl">
        {eventsSortedByDate?.map((event) => (
          <EventCard key={event.startTime.toString()} {...event} />
        ))}
      </ol>

      <CreateEvent />
    </section>
  )
}
export { Events }
