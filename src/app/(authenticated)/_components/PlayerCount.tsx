import { Users } from "lucide-react"
import { getIconByClass } from "../grupos/[id]/_components/PlayerListItem"
import { DashboardCard } from "./DashboardCard"
import { trpc } from "@/trpc-client/client"

function PlayerCount() {
  const { data: usersByClass = [] } = trpc.getPlayersByClass.useQuery()

  return (
    <DashboardCard icon={Users} title="Contagem de Jogadores Ativos">
      <ul className="flex flex-col divide-y divide-neutral-800 px-3 py-4">
        {usersByClass.map(({ class: gameClass, count }) => {
          const Icon = getIconByClass(gameClass)
          return (
            <li
              className="flex items-center gap-2 px-0.5 py-2.5 text-sm first-of-type:pt-0 last-of-type:pb-0"
              key={gameClass}
            >
              <Icon className="fill-neutral-100" size={20} />
              <p>{gameClass}</p>

              <b className="ml-auto font-semibold">{count}</b>
            </li>
          )
        })}
      </ul>
    </DashboardCard>
  )
}

export { PlayerCount }
