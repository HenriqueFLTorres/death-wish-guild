"use client"

import moment from "moment"
import { EventsCalendar } from "./_components/EventsCalendar"
import { trpc } from "@/trpc-client/client"

function Events() {
  const { data: events = [] } = trpc.getEventsByDay.useQuery({
    startOfDay: moment(new Date()).startOf("day").subtract(1, "days").toDate(),
    endOfDay: moment(new Date()).endOf("day").add(6, "days").toDate(),
  })

  return (
    <section className="flex h-full w-full flex-col rounded-xl border border-neutral-800 bg-gradient-to-bl from-neutral-700/50 to-neutral-900 px-6 py-4 shadow-xl">
      <h2 className="text-xl font-semibold">Selecione um evento</h2>
      <EventsCalendar events={events} showFullCalendar />
    </section>
  )
}

export default Events
