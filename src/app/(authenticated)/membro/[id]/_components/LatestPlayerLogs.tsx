import { ScrollText } from "lucide-react"
import { useParams } from "next/navigation"
import { DashboardCard } from "@/app/(authenticated)/_components/DashboardCard"
import { LogFragment } from "@/app/(authenticated)/_components/LatestLogs"
import { trpc } from "@/trpc-client/client"

function LatestPlayerLogs() {
  const { id } = useParams<{ id: string }>()

  const { data: logs = [] } = trpc.getLatestPlayerLogs.useQuery({ userID: id })

  return (
    <DashboardCard className="flex-1" icon={ScrollText} title="Últimos Log’s">
      <ul className="flex flex-col divide-y divide-neutral-800 px-2 py-3">
        {logs.map((log) => (
          <LogFragment key={log.id} log={log} />
        ))}
      </ul>
    </DashboardCard>
  )
}

export { LatestPlayerLogs }
