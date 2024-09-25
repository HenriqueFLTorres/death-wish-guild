import { Crown } from "lucide-react"
import { DashboardCard } from "./DashboardCard"
import { RankingFragment } from "./RankingFragment"
import { SelectUser } from "@/db/schema"
import { trpc } from "@/trpc-client/client"

function PointsRanking() {
  const { data: playersByPoints = [] } =
    trpc.user.getPlayersPointsRanking.useQuery()

  return (
    <DashboardCard
      className="col-span-2"
      icon={Crown}
      title="Ranking de Pontos"
    >
      <ul className="flex flex-col divide-y divide-neutral-800 px-3 py-4">
        {playersByPoints.map((player, index) => (
          <PointsRankingFragment index={index} key={index} {...player} />
        ))}
      </ul>
    </DashboardCard>
  )
}

interface PointsRankingFragmentProps extends SelectUser {
  index: number
}

function PointsRankingFragment(props: PointsRankingFragmentProps) {
  const { points, index } = props

  return (
    <RankingFragment rank={index + 1} {...props}>
      <div className="ml-auto flex flex-col gap-2 text-end leading-none">
        <p className="text-xs text-neutral-400">pontos</p>
        <p>{points.toLocaleString()}</p>
      </div>
    </RankingFragment>
  )
}

export { PointsRanking, PointsRankingFragment }
