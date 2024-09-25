import { ScrollText, User } from "lucide-react"
import { DashboardCard } from "./DashboardCard"
import { SelectUser } from "@/db/schema"
import { translateGameClass } from "@/lib/utils"
import { RouterOutput, trpc } from "@/trpc-client/client"
import { parseHTML } from "@/utils/parseHTML"

export type LogType = RouterOutput["logs"]["getLatestLogs"][number]

function LatestLogs() {
  const { data: logs = [] } = trpc.logs.getLatestLogs.useQuery()

  return (
    <DashboardCard
      className="row-span-2"
      icon={ScrollText}
      title="Últimos Log’s"
    >
      <ul className="flex flex-col divide-y divide-neutral-800 px-2 py-3">
        {logs.map((log) => (
          <LogFragment key={log.id} log={log} />
        ))}
      </ul>
    </DashboardCard>
  )
}
interface LogFragmentProps {
  log: LogType
}

function LogFragment(props: LogFragmentProps) {
  const { log } = props

  const { Icon, title, message } = createLogObject(log)

  return (
    <li className="flex flex-col gap-2 px-1 py-2.5 text-left text-xs first-of-type:pt-0 last-of-type:pb-0">
      <h3 className="inline-flex items-center gap-2 font-semibold">
        <Icon size={16} /> {title}
      </h3>
      <p className="[&>b]:font-semibold">{parseHTML(message)}</p>
    </li>
  )
}

export { LatestLogs, LogFragment, createLogObject }

function createLogObject(log: LogType) {
  return {
    Icon: User,
    title: getLogTitle(log.category),
    message: generateLogMessage(log),
  }
}

function getLogTitle(category: LogType["category"]) {
  switch (category) {
    case "AUCTION":
      return "Lance"
    case "EVENTS":
      return "Evento"
    case "USER":
      return "Usuário"
    default:
      throw new Error("Unknown log category")
  }
}

function generateLogMessage(log: LogType) {
  const { type } = log

  switch (type) {
    case "USER_CLASS":
      return `<b>${log.triggerUser.name}</b> alterou sua classe de <b>${translateGameClass(log.from as SelectUser["class"])}</b> para <b>${translateGameClass(log.to as SelectUser["class"])}</b>.`
    case "USER_NAME":
      return `<b>${log.triggerUser.name}</b> alterou seu nome de <b>${log.from}</b> para <b>${log.to}</b>.`
    case "PRIMARY_WEAPON":
      return `<b>${log.triggerUser.name}</b> alterou sua arma primaria de <b>${log.from}</b> para <b>${log.to}</b>.`
    case "SECONDARY_WEAPON":
      return `<b>${log.triggerUser.name}</b> alterou sua arma secundária de <b>${log.from}</b> para <b>${log.to}</b>.`
    case "POINTS":
      return `<b>${log.triggerUser.name}</b> alterou a quantia de DKPoints de <b>${log.target_id}</b> de <b>$${log.from}</b> para <b>$${log.to}</b>.`
    case "GUILD_JOIN":
      return `<b>${log.target_id}</b> entrou na guilda pelo convite de <b>${log.triggerUser.name}</b>.`
    default:
      throw new Error("Unknown log type")
  }
}
