import { CalendarClock } from "lucide-react"
import Image from "next/image"
import { DashboardCard } from "./DashboardCard"

function NextEvents() {
  return (
    <DashboardCard
      className="col-span-2"
      icon={CalendarClock}
      title="Próximos Eventos"
    >
      <ul className="flex flex-col divide-y divide-neutral-800 px-3 py-4">
        {Array.from(Array(5).keys()).map((index) => (
          <li
            className="flex items-center gap-2 px-0.5 py-2.5 text-sm first-of-type:pt-0 last-of-type:pb-0"
            key={index}
          >
            <Image
              alt=""
              height={40}
              src="/event-icon/stop-the-mana-frenzy.png"
              width={40}
              unoptimized
            />
            <div className="flex flex-col gap-2 leading-none">
              <h3 className="text-base font-semibold">Stop the Mana Frenzy</h3>
              <span className="flex items-center gap-2">
                <Image
                  alt=""
                  height={16}
                  src="/event-indicator/pve.png"
                  width={16}
                  unoptimized
                />
                Peace
              </span>
            </div>

            <div className="ml-auto flex flex-col gap-2 text-end leading-none">
              <p className="text-xs text-neutral-400">início em</p>
              <p>23 minutos</p>
            </div>
          </li>
        ))}
      </ul>
    </DashboardCard>
  )
}

export { NextEvents }
