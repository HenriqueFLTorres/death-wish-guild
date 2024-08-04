import { UserPlus } from "lucide-react"
import { DashboardCard } from "./DashboardCard"
import { Avatar } from "@/components/ui/avatar"

function RecentPlayers() {
  return (
    <DashboardCard icon={UserPlus} title="Membros Recentes">
      <ul className="flex flex-col divide-y divide-neutral-800 px-3 py-4">
        {Array.from(Array(5).keys()).map((index) => (
          <li
            className="flex items-center gap-2 px-0.5 py-2.5 text-sm first-of-type:pt-0 last-of-type:pb-0"
            key={index}
          >
            <Avatar fallbackText="" src="/avatar/variant-1.png" />
            <div className="flex flex-col gap-2 leading-none">
              <h3 className="text-base font-semibold">SpamTaxota</h3>
              <p className="flex items-center gap-2">Ranged DPS</p>
            </div>

            <div className="ml-auto flex flex-col gap-2 text-end leading-none">
              <p className="text-xs text-neutral-400">entrou a</p>
              <p>1 dia atrás</p>
            </div>
          </li>
        ))}
      </ul>
    </DashboardCard>
  )
}

export { RecentPlayers }
