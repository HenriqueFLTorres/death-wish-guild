import { Crown } from "lucide-react"
import { useParams } from "next/navigation"
import { DashboardCard } from "@/app/(authenticated)/_components/DashboardCard"
import { PointsRankingFragment } from "@/app/(authenticated)/_components/PointsRanking"
import { trpc } from "@/trpc-client/client"

function PointsRanking() {
  const { id } = useParams<{ id: string }>()

  const { data: playersByPoints = [] } =
    trpc.user.getPlayersPointsRanking.useQuery()
  const { data: playerRank } = trpc.user.getPositionMember.useQuery(
    {
      userID: id,
    },
    { enabled: id != null }
  )

  return (
    <DashboardCard className="flex-1" icon={Crown} title="Ranking de Pontos">
      <ul className="flex flex-col px-3 py-4">
        {playersByPoints.map((player, index) => (
          <PointsRankingFragment index={index} key={index} {...player} />
        ))}

        <hr />

        {playerRank == null ? null : (
          <PointsRankingFragment
            index={Number(playerRank.rank)}
            {...playerRank}
          />
        )}
      </ul>
    </DashboardCard>
  )
}

export { PointsRanking }
