import { TextSearch } from "lucide-react"
import moment from "moment"
import Link from "next/link"
import { LogType, createLogObject } from "../_components/LatestLogs"
import { Avatar } from "@/components/ui/avatar"
import { Badge, BadgeProps } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PATHS } from "@/lib/constants/paths"
import { cn, translateGameClass } from "@/lib/utils"
import { parseHTML } from "@/utils/parseHTML"

interface LogModalProps {
  log: LogType
}

function LogModal(props: LogModalProps) {
  const { log } = props

  const { Icon, title, message } = createLogObject(log)
  const { variant, translation: actionTranslation } = getActionInfoByType(
    log.action
  )

  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({
          variant: "secondary-flat",
          size: "icon",
        })}
      >
        <TextSearch size={16} />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          <Icon size={16} /> <p>{title}</p>
        </DialogTitle>
        <dl className="grid grid-cols-2 gap-4 [&>div]:flex [&>div]:flex-col [&>div]:gap-2 [&_dt]:text-sm [&_dt]:text-neutral-500">
          <div>
            <dt>Causado por</dt>
            <dd className="flex gap-2">
              <Avatar
                fallbackText={log.triggerUser.name}
                src={log.triggerUser.image}
              />
              <div className="flex flex-col gap-1 leading-none">
                <Link
                  className={cn("hover:underline focus-visible:underline")}
                  href={PATHS.MEMBRO.ID({ UUID: log.triggerUser.id })}
                  target="_blank"
                >
                  <h3 className="text-base font-semibold leading-none">
                    {log.triggerUser.name}
                  </h3>
                </Link>
                <p className="text-xs">
                  {translateGameClass(log.triggerUser.class)}
                </p>
              </div>
            </dd>
          </div>
          <div>
            <dt>Categoria</dt>
            <dd className="flex items-center gap-2">
              <Icon size={16} /> <p className="font-semibold">{title}</p>
            </dd>
          </div>
          <div>
            <dt>Ação</dt>
            <dd>
              <Badge variant={variant}>{actionTranslation}</Badge>
            </dd>
          </div>
          <div>
            <dt>Data e Hora</dt>
            <dd>{moment(log.created_at).format("MMMM Do YYYY, h:mm:ss a")}</dd>
          </div>
          <div className="col-span-2">
            <dt>Mensagem</dt>
            <dd>{parseHTML(message)}</dd>
          </div>
          <div className="col-span-2">
            <dt>Descrição</dt>
            <dd>-</dd>
          </div>
        </dl>
      </DialogContent>
    </Dialog>
  )
}

export { LogModal, getActionInfoByType, getActionVariant }

const getActionInfoByType = (type: unknown) => {
  const actionType = type as LogType["action"]
  return {
    variant: getActionVariant(actionType),
    translation: actionTranslation[actionType],
  }
}

const getActionVariant = (
  actionType: LogType["action"]
): BadgeProps["variant"] => {
  switch (actionType) {
    case "CREATE":
      return "success"
    case "UPDATE":
      return "warning"
    case "DELETE":
      return "error"
    case "FINISH":
      return "sky"
  }
}

const actionTranslation = {
  CREATE: "Criação",
  UPDATE: "Alteração",
  DELETE: "Remoção",
  FINISH: "Finalização",
}
