"use client"

import { add, endOfDay, startOfDay, sub } from "date-fns"
import { EventsCalendar } from "./_components/EventsCalendar"
import { trpc } from "@/trpc-client/client"

function Events() {
  const { data: events = [] } = trpc.getEventsByDay.useQuery({
    startOfDay: sub(startOfDay(new Date()), { days: 1 }),
    endOfDay: add(endOfDay(new Date()), { days: 6 }),
  })

  return (
    <section className="flex h-full w-full flex-col rounded-xl border border-neutral-800 bg-gradient-to-bl from-neutral-700/50 to-neutral-900 px-6 py-4 shadow-xl">
      <h2 className="text-xl font-semibold">Selecione um evento</h2>
      <EventsCalendar events={events} showFullCalendar />
    </section>
  )
}

export default Events
