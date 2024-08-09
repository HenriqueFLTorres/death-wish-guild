import { CalendarClock } from "lucide-react"
import moment from "moment"
import Image from "next/image"
import { getEventTypeImagePath } from "../grupos/_components/EventCard"
import { DashboardCard } from "./DashboardCard"
import { toKebabCase } from "@/lib/utils"
import { trpc } from "@/trpc-client/client"

function NextEvents() {
  const { data: nextEvents = [] } = trpc.getNextEvents.useQuery()

  return (
    <DashboardCard
      className="col-span-2"
      icon={CalendarClock}
      title="Próximos Eventos"
    >
      <ul className="flex flex-col divide-y divide-neutral-800 px-3 py-4">
        {nextEvents.map(({ id, name, event_type, start_time }) => (
          <li
            className="flex items-center gap-2 px-0.5 py-2.5 text-sm first-of-type:pt-0 last-of-type:pb-0"
            key={id}
          >
            <Image
              alt=""
              height={40}
              src={`/event-icon/${toKebabCase(name)}.png`}
              width={40}
              unoptimized
            />
            <div className="flex flex-col gap-2 leading-none">
              <h3 className="text-base font-semibold">{name}</h3>
              <span className="flex items-center gap-2">
                <Image
                  alt=""
                  height={16}
                  src={getEventTypeImagePath(event_type)}
                  width={16}
                  unoptimized
                />
                {event_type}
              </span>
            </div>

            <div className="ml-auto flex flex-col gap-2 text-end leading-none">
              <p className="text-xs text-neutral-400">início em</p>
              <p>{moment(start_time).fromNow()}</p>
            </div>
          </li>
        ))}
      </ul>
    </DashboardCard>
  )
}

export { NextEvents }
