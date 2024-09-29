import { Scale } from "lucide-react"
import Image from "next/image"
import { DashboardCard } from "./DashboardCard"
import { Badge } from "@/components/ui/badge"

function RecentDrops() {
  return (
    <DashboardCard icon={Scale} title="Drops Recentes">
      <ul className="flex flex-col divide-y divide-neutral-800 px-3 py-4"></ul>
    </DashboardCard>
  )
}

export { RecentDrops, RecentDropFragment }

function RecentDropFragment() {
  return (
    <li className="flex items-center gap-2 px-0.5 py-2.5 text-sm first-of-type:pt-0 last-of-type:pb-0">
      <div className="relative grid h-10 w-10 shrink-0 place-items-center">
        <Image
          alt=""
          height={40}
          src="/item-frame.svg"
          width={40}
          unoptimized
        />
        <Image
          alt=""
          className="absolute"
          height={38}
          src="/crossbow.webp"
          width={38}
          unoptimized
        />
      </div>
      <div className="flex h-10 flex-col justify-between overflow-hidden">
        <h3
          className="overflow-hidden text-ellipsis whitespace-nowrap font-semibold leading-none"
          title="Talus's Resonance Staff"
        >
          Talus's Resonance Staff
        </h3>
        <Badge className="h-5 w-max rounded font-normal" variant="success">
          Disponível
        </Badge>
      </div>

      <div className="ml-auto flex flex-col gap-2 text-end leading-none">
        <p className="text-xs text-neutral-400">adquirido por</p>
        <p className="font-semibold">-</p>
      </div>
    </li>
  )
}
