"use client"

import { Moon, Sun } from "lucide-react"
import moment from "moment"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { EventFromDB } from "./CreateEvent"

function EventCard(props: EventFromDB) {
  const { start_time, name, type, location, id } = props

  const pathname = usePathname()

  const isNight = moment(start_time).isAfter(
    moment().startOf("day").add(18, "hours")
  )

  const weekday = moment(start_time).format("dddd")
  const formattedDate = moment(start_time).format("LL")

  return (
    <li
      className="text-primary-foreground group relative flex w-80 flex-col rounded-br-2xl rounded-tl-2xl border border-b-0 border-t-2 border-secondary transition-colors hover:border-primary data-[active='true']:border-primary"
      data-active={pathname === `/grupos/${id}`}
    >
      <Link
        aria-label="select event"
        className="group relative flex overflow-hidden rounded-br-2xl rounded-tl-2xl bg-gradient-to-b from-neutral-900 to-neutral-800 group-data-[active='true']:from-primary-700 group-data-[active='true']:to-primary-500 group-data-[active='true']:drop-shadow-[0_0_6px_#7B53A7]"
        href={`/grupos/${id}`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary-700 to-primary-500 opacity-0 transition-opacity group-hover:opacity-40" />

        <div className="z-10 flex w-full flex-col p-2 text-left shadow">
          <small className="text-xs font-light text-primary-200">
            {location}
          </small>

          <h2 className="flex from-white to-neutral-300 text-xl font-semibold drop-shadow-[0_0_2px_#ffffff50]">
            {name}
          </h2>

          <p className="flex items-center gap-1 text-xs">
            <Image
              alt=""
              height={14}
              src={getEventTypeImagePath(type)}
              width={14}
            />
            {type}
          </p>

          <footer className="flex w-full items-end justify-between gap-4">
            <p className="mt-2 text-sm">
              <b>{weekday}</b> {formattedDate}
            </p>

            <div className="flex items-center gap-2">
              <div className="grid h-5 w-5 place-items-center rounded-sm border border-primary bg-primary-600">
                {isNight ? (
                  <Moon className="fill-white" size={12} />
                ) : (
                  <Sun className="fill-white" size={12} />
                )}
              </div>
              <p className="font-semibold">{moment(start_time).format("LT")}</p>
            </div>
          </footer>
        </div>

        <Image
          alt="chernobog guild raid"
          className="fade-image absolute right-0 h-full object-cover"
          height={90}
          src={"/event-preview/chernobog.png"}
          width={197}
        />
      </Link>
    </li>
  )
}

export { EventCard, getEventTypeImagePath }

function getEventTypeImagePath(type: string) {
  switch (type) {
    case "PVE":
      return "/event-indicator/peace.png"
    case "PVP":
      return "/event-indicator/battle.png"
    default:
      return "/event-indicator/guild.png"
  }
}
