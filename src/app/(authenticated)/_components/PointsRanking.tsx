import { Crown } from "lucide-react"
import { DashboardCard } from "./DashboardCard"
import { Avatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { trpc } from "@/trpc-client/client"

function PointsRanking() {
  const { data: playersByPoints = [] } = trpc.getPlayersPointsRanking.useQuery()

  return (
    <DashboardCard
      className="col-span-2"
      icon={Crown}
      title="Ranking de Pontos"
    >
      <ul className="flex flex-col divide-y divide-neutral-800 px-3 py-4">
        {playersByPoints.map(
          (
            { id, class: gameClass, display_name: name, points, image },
            index
          ) => (
            <li
              className="flex items-center gap-2 px-0.5 py-2.5 text-sm first-of-type:pt-0 last-of-type:pb-0"
              key={id}
            >
              <p
                className={cn(
                  "mr-1 text-xl font-semibold",
                  getClassByPosition(index + 1)
                )}
              >
                #{index + 1}
              </p>

              <Avatar fallbackText={name} src={image} />
              <div className="flex flex-col gap-2 leading-none">
                <h3 className="text-base font-semibold">{name}</h3>
                <p className="flex items-center gap-2">{gameClass}</p>
              </div>

              <div className="ml-auto flex flex-col gap-2 text-end leading-none">
                <p className="text-xs text-neutral-400">pontos</p>
                <p>{points.toLocaleString()}</p>
              </div>
            </li>
          )
        )}
      </ul>
    </DashboardCard>
  )
}

export { PointsRanking }

function getClassByPosition(position: number) {
  switch (position) {
    case 1:
      return "text-[#C4A747]"
    case 2:
      return "text-[#C0C0C0]"
    case 3:
      return "text-[#CD7F32]"
    default:
      return "text-neutral-400"
  }
}
