"use client"

import { BellRing } from "lucide-react"
import { useEffect } from "react"
import { CreateEvent } from "./CreateEvent"
import { EventCard } from "./EventCard"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { trpc } from "@/trpc-client/client"

function Events() {
  const { data: events = [] } = trpc.events.getEvents.useQuery()

  const eventsSortedByDate = events.sort(
    (a, b) => Number(new Date(b.start_time)) - Number(new Date(a.start_time))
  )

  useEffect(() => {
    Notification.requestPermission()

    const notificationIDs = events
      .map((event) => {
        const currentTime = new Date()
        const eventTime = new Date(event.start_time)
        const fiveMinutesBeforeEvent = new Date(
          eventTime.getTime() - 5 * 60 * 1000
        )
        const timeUntilNotification =
          fiveMinutesBeforeEvent.getTime() - currentTime.getTime()

        if (timeUntilNotification <= 0) return null

        return setTimeout(() => {
          new Notification(event.name, {
            body: `O evento "${event.name}" será iniciado em breve.`,
            icon: "/favicon.ico",
          })
        }, timeUntilNotification)
      })
      .filter(Boolean) as NodeJS.Timeout[]

    return () => {
      notificationIDs.forEach(clearTimeout)
    }
  }, [events])

  return (
    <section className="relative z-10 flex flex-col justify-between gap-4">
      <ol className="scrollbar flex flex-col gap-4 overflow-auto">
        {eventsSortedByDate?.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </ol>

      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button className="cursor-default" variant="secondary">
            <BellRing size={16} />
            Sistema de Notificações
          </Button>
        </TooltipTrigger>
        <TooltipContent
          className="flex max-w-96 flex-col gap-2 pb-4"
          sideOffset={16}
        >
          <h2 className="text-lg font-semibold">Notificações</h2>
          <p className="text-sm">
            Você receberá uma notificação 5 minutos antes do início de cada
            evento.
          </p>
          <p className="text-sm">
            Permita que o seu navegador envie notificações para receber
          </p>
        </TooltipContent>
      </Tooltip>

      <CreateEvent />
    </section>
  )
}
export { Events }
