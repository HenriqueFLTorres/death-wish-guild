import { ScrollText, User } from "lucide-react"
import { DashboardCard } from "./DashboardCard"

function LatestLogs() {
  return (
    <DashboardCard
      className="row-span-2"
      icon={ScrollText}
      title="Últimos Log’s"
    >
      <ul className="flex flex-col divide-y divide-neutral-800 px-2 py-3">
        {Array.from(Array(5).keys()).map((index) => (
          <li
            className="flex flex-col gap-2 px-1 py-2.5 text-left text-xs first-of-type:pt-0 last-of-type:pb-0"
            key={index}
          >
            <h3 className="inline-flex items-center gap-2 font-semibold">
              <User size={16} /> Usuário
            </h3>
            <p className="[&>b]:font-semibold">
              <b>Treffy</b> alterou sua arma secundária de <b>Tome</b> para{" "}
              <b>Dagger</b>.
            </p>
          </li>
        ))}
      </ul>
    </DashboardCard>
  )
}

export { LatestLogs }
