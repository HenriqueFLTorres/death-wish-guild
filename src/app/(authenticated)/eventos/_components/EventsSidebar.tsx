"use client"

import { BellRing, CalendarDays } from "lucide-react"
import moment from "moment"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { CreateEvent } from "./CreateEvent"
import { EventCard } from "./EventCard"
import { EventsCalendar } from "./EventsCalendar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getWeekRange } from "@/lib/utils"
import { trpc } from "@/trpc-client/client"

function EventsSidebar() {
  const [selectedDay, setSelectedDay] = useState(new Date())
  const pathname = useParams<{ id: string }>()

  const { data: session } = useSession()

  const { data: events = [] } = trpc.events.getEventsByDay.useQuery({
    startOfDay: moment(new Date()).startOf("day").subtract(1, "days").toDate(),
    endOfDay: moment(new Date()).endOf("day").add(6, "days").toDate(),
  })

  const { data: unfinishedEvents = [] } =
    trpc.events.getUnfinishedEvents.useQuery()

  const { data: event, isSuccess } = trpc.events.getEvent.useQuery({
    id: Number(pathname.id),
  })

  useEffect(() => {
    if (isSuccess) setSelectedDay(new Date(event.start_time))
  }, [isSuccess])

  const weekDays = getWeekRange(new Date())

  const eventsToday = events.filter((event) =>
    moment.utc(selectedDay).isSame(new Date(event.start_time), "day")
  )

  return (
    <section className="flex h-full w-80 shrink-0 flex-col rounded-xl border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-700/50 shadow-xl">
      <header className="flex items-center justify-center border-b border-neutral-800 p-2">
        <h1 className="absolute text-base font-semibold text-neutral-100">
          Calendário de Eventos
        </h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="ml-auto" size="icon" variant="secondary-flat">
              <CalendarDays size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent
            autoFocus={false}
            className="flex h-full max-h-[80vh] max-w-screen-xl flex-col overflow-auto"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <h2 className="text-xl font-semibold capitalize">
              {moment.utc(selectedDay).local().format("MMMM yyyy")}
            </h2>
            <EventsCalendar events={events} />
          </DialogContent>
        </Dialog>
      </header>

      <div className="flex grow flex-col justify-between gap-4 overflow-auto px-2 py-3">
        <Tabs className="flex grow flex-col overflow-hidden">
          <TabsList className="flex">
            <TabsTrigger value="next-events">Próximos Eventos</TabsTrigger>
            <TabsTrigger value="to-be-finished">
              Esperando Finalizar
            </TabsTrigger>
          </TabsList>
          <TabsContent
            className="flex grow overflow-hidden"
            value="next-events"
          >
            <ol className="flex w-full gap-1">
              {weekDays.map((date) => (
                <WeekDay
                  date={date}
                  isSelected={
                    date.toDateString() === selectedDay.toDateString()
                  }
                  key={date.toISOString()}
                  setDate={setSelectedDay}
                />
              ))}
            </ol>

            <ScrollArea className="h-full">
              <ol className="flex flex-col gap-4">
                {eventsToday?.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </ol>
            </ScrollArea>
          </TabsContent>
          <TabsContent
            className="flex grow overflow-hidden"
            value="to-be-finished"
          >
            <ScrollArea className="h-full">
              <ol className="flex flex-col gap-4">
                {unfinishedEvents?.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </ol>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="flex grow flex-col justify-end gap-2.5">
          <Button className="cursor-default" variant="secondary-flat">
            <BellRing size={16} />
            Sistema de Notificações
          </Button>

          {session?.user.role === "ADMIN" ? <CreateEvent /> : null}
        </div>
      </div>
    </section>
  )
}

export { EventsSidebar }

interface WeekDayProps {
  date: Date
  setDate: (date: Date) => void
  isSelected: boolean
}

function WeekDay(props: WeekDayProps) {
  const { date, setDate, isSelected } = props

  return (
    <li className="w-full">
      <Button
        className="flex h-11 w-full flex-col gap-0 p-0 font-semibold"
        variant={isSelected ? "primary-flat" : "secondary-flat"}
        onClick={() => setDate(date)}
      >
        <small className="text-xs font-normal">
          {moment.utc(date).local().format("ddd")}
        </small>
        {date.getDate()}
      </Button>
    </li>
  )
}
