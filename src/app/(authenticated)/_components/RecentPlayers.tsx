import { UserPlus } from "lucide-react"
import moment from "moment"
import { DashboardCard } from "./DashboardCard"
import { Avatar } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { translateGameClass } from "@/lib/utils"
import { trpc } from "@/trpc-client/client"

function RecentPlayers() {
  const { data: recentPlayers = [] } = trpc.getRecentPlayers.useQuery()

  return (
    <DashboardCard icon={UserPlus} title="Membros Recentes">
      <ul className="flex flex-col divide-y divide-neutral-800 px-3 py-4">
        {recentPlayers.map(
          ({ id, class: gameClass, display_name: name, created_at, image }) => (
            <li
              className="flex items-center gap-2 px-0.5 py-2.5 text-sm first-of-type:pt-0 last-of-type:pb-0"
              key={id}
            >
              <Avatar fallbackText={name} src={image} />
              <div className="flex flex-col gap-2 leading-none">
                <h3 className="text-base font-semibold">{name}</h3>
                <p className="flex items-center gap-2">
                  {translateGameClass(gameClass)}
                </p>
              </div>

              <div className="ml-auto flex flex-col gap-2 text-end leading-none">
                <p className="text-xs text-neutral-400">entrou a</p>

                <Tooltip>
                  <TooltipTrigger>
                    <p>{moment(created_at).fromNow()}</p>
                  </TooltipTrigger>
                  <TooltipContent>
                    {moment(created_at).format("MMMM Do YYYY, h:mm:ss a")}
                  </TooltipContent>
                </Tooltip>
              </div>
            </li>
          )
        )}
      </ul>
    </DashboardCard>
  )
}

export { RecentPlayers }
