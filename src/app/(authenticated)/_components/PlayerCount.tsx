import { Cross, Shield, Sword, Users } from "lucide-react"
import { DashboardCard } from "./DashboardCard"
import { RangedDPS } from "@/components/icons/RangedDPS"

function PlayerCount() {
  return (
    <DashboardCard icon={Users} title="Contagem de Jogadores Ativos">
      <ul className="flex flex-col divide-y divide-neutral-800 px-3 py-4">
        {CLASS_LIST.map(({ Icon, name }) => (
          <li
            className="flex items-center gap-2 px-0.5 py-2.5 text-sm first-of-type:pt-0 last-of-type:pb-0"
            key={name}
          >
            <Icon className="fill-neutral-100" size={20} />
            <p>{name}</p>

            <b className="ml-auto font-semibold">13</b>
          </li>
        ))}
      </ul>
    </DashboardCard>
  )
}

export { PlayerCount }

const CLASS_LIST = [
  {
    name: "DPS",
    Icon: Sword,
  },
  {
    name: "Ranged DPS",
    Icon: RangedDPS,
  },
  {
    name: "Tank",
    Icon: Shield,
  },
  {
    name: "Healer",
    Icon: Cross,
  },
] as const
