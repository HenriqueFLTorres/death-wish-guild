"use client"

import { Moon, Sun } from "lucide-react"
import moment from "moment"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getPreviewImage } from "../[id]/page"
import type { SelectEvent } from "@/db/schema"

function EventCard(props: SelectEvent) {
  const { start_time, name, event_type, id } = props

  const pathname = usePathname()

  const isNight = moment(start_time).isAfter(
    moment().startOf("day").add(18, "hours")
  )

  const previewImage = getPreviewImage(name)

  return (
    <li
      className="text-primary-foreground group relative flex w-full flex-col rounded-br-2xl rounded-tl-2xl border border-b-0 border-t-2 border-secondary transition-colors hover:border-primary data-[active='true']:border-primary"
      data-active={pathname === `/eventos/${id}`}
    >
      <Link
        aria-label="select event"
        className="group relative flex overflow-hidden rounded-br-2xl rounded-tl-2xl bg-gradient-to-b from-neutral-900 to-neutral-800 group-data-[active='true']:from-primary-700 group-data-[active='true']:to-primary-500 group-data-[active='true']:drop-shadow-[0_0_6px_#7B53A7]"
        href={`/eventos/${id}`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary-700 to-primary-500 opacity-0 transition-opacity group-hover:opacity-40" />

        <div className="z-10 flex w-full flex-col p-2 text-left shadow">
          <h2 className="flex from-white to-neutral-300 text-xl font-semibold drop-shadow-[0_0_2px_#ffffff50]">
            {name}
          </h2>

          <p className="flex items-center gap-1 text-xs">
            <Image
              alt=""
              height={14}
              src={getEventTypeImagePath(event_type)}
              width={14}
            />
            {event_type}
          </p>

          <footer className="ml-auto flex items-center justify-between gap-2">
            <div className="grid h-5 w-5 place-items-center rounded-sm border border-primary bg-primary-600">
              {isNight ? (
                <Moon className="fill-white" size={12} />
              ) : (
                <Sun className="fill-white" size={12} />
              )}
            </div>
            <p className="shrink-0 font-semibold">
              {moment(start_time).format("LT")}
            </p>
          </footer>
        </div>

        {previewImage == null ? null : (
          <Image
            alt=""
            className="absolute right-0 h-full w-full object-cover opacity-60"
            height={90}
            src={previewImage}
            width={318}
          />
        )}
      </Link>
    </li>
  )
}

export { EventCard, getEventTypeImagePath }

function getEventTypeImagePath(type: string) {
  switch (type) {
    case "PVE":
      return "/event-indicator/pve.png"
    case "PVP":
      return "/event-indicator/pvp.png"
    default:
      return "/event-indicator/guild.png"
  }
}
