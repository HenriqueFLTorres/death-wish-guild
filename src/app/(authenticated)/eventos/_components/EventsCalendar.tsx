"use client"

import moment from "moment"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SelectEvent } from "@/db/schema"
import { cn, getWeekRange, toKebabCase } from "@/lib/utils"

const HOURS_IN_A_DAY = 24

interface EventsCalendarProps {
  events: SelectEvent[]
  showFullCalendar?: boolean
}

function EventsCalendar(props: EventsCalendarProps) {
  const { events, showFullCalendar = false } = props

  const today = new Date()

  const timezoneOffset = moment(today).format("Z")
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const weekDays = getWeekRange(today)

  const calendarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentTimeCell = document.getElementById("calendar-curent-time")
    const calendarContainer = calendarRef.current?.children[1] as HTMLElement

    if (currentTimeCell == null || calendarContainer == null) return

    calendarContainer.scrollTo({
      behavior: "smooth",
      top: currentTimeCell.offsetTop - calendarContainer.offsetTop,
    })
  }, [calendarRef])

  return (
    <section className="flex flex-col divide-y divide-neutral-800 overflow-auto">
      <ol className="flex py-4">
        <li className="flex w-20 shrink-0 items-end text-neutral-400">
          <Tooltip>
            <TooltipTrigger>
              <small className="text-xs">GMT {timezoneOffset}</small>
            </TooltipTrigger>
            <TooltipContent>{timezone}</TooltipContent>
          </Tooltip>
        </li>
        {weekDays.map((date) => (
          <li className="w-full px-2" key={date.toISOString()}>
            <h3 className="text-sm text-neutral-400">
              {moment(date).format("ddd")}
            </h3>
            <b className="text-2xl font-semibold">{date.getDate()}</b>
          </li>
        ))}
      </ol>
      <ScrollArea className="h-full" ref={calendarRef}>
        <div className="divide-y divide-neutral-800 overflow-auto">
          {Array.from({ length: HOURS_IN_A_DAY }).map((_, index) => (
            <CalendarRow
              events={events}
              index={index}
              key={index}
              showFullCalendar={showFullCalendar}
              weekDays={weekDays}
            />
          ))}
        </div>
      </ScrollArea>
    </section>
  )
}

export { EventsCalendar }

interface CalendarRowProps {
  index: number
  weekDays: Date[]
  events: SelectEvent[]
  showFullCalendar: boolean
}

function CalendarRow(props: CalendarRowProps) {
  const { index, events, weekDays, showFullCalendar } = props

  const hasEventsThisHour = showFullCalendar
    ? true
    : weekDays.some((dayOfWeek) =>
        events.some((event) =>
          moment
            .utc(new Date(event.start_time))
            .isSame(moment(dayOfWeek).add(index, "hours").toDate(), "day")
        )
      )

  if (!hasEventsThisHour) return null

  return (
    <div className="flex divide-x divide-neutral-800">
      <div
        className="flex w-20 shrink-0"
        id={`calendar-${index.toString().padStart(2, "0")}:00`}
      >
        <p className="py-3">{index.toString().padStart(2, "0")}:00</p>
      </div>
      {weekDays.map((date) => {
        const rowHour = moment(date).add(index, "hours").toDate().getHours()
        const isToday = moment(date).isSame(new Date(), "day")
        const isCurrentTime = isToday && rowHour === new Date().getHours()

        return (
          <div
            className={cn("w-full p-1.5", {
              "bg-primary-600/20": isToday,
              "bg-primary-400/50": isCurrentTime,
            })}
            id={isCurrentTime ? "calendar-curent-time" : undefined}
          >
            <CalendarRowDay
              date={date}
              events={events}
              index={index}
              key={`${index}-${date.toISOString()}`}
            />
          </div>
        )
      })}
    </div>
  )
}

interface CalendarRowDayProps {
  events: SelectEvent[]
  index: number
  date: Date
}

function CalendarRowDay(props: CalendarRowDayProps) {
  const { events, date, index } = props

  const eventsToday = events?.filter((event) =>
    moment
      .utc(new Date(event.start_time))
      .isSame(moment(date).add(index, "hours"), "hour")
  )

  return eventsToday?.map((event) => (
    <Link
      className="flex flex-col gap-1 rounded border border-neutral-700/50 bg-neutral-700/20 p-1 text-xs font-medium text-neutral-300 opacity-80 transition-opacity hover:opacity-100"
      href={`/eventos/${event.id}`}
    >
      <span className="flex items-baseline gap-1">
        <Image
          alt=""
          className="translate-y-0.5"
          height={12}
          src={`/event-icon/${toKebabCase(event.name)}.png`}
          width={12}
        />
        <p className="line-clamp-1" title={event.name}>
          {event.name}
        </p>
      </span>
      <p>{moment.utc(new Date(event.start_time)).local().format("HH:mm")}</p>
    </Link>
  ))
}
