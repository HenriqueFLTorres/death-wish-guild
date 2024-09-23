"use client"

import type { ColumnDef } from "@tanstack/react-table"
import moment from "moment"
import { LogType, createLogObject } from "../../_components/LatestLogs"
import { LogModal, getActionInfoByType } from "./LogModal"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { parseHTML } from "@/utils/parseHTML"

export const columns: ColumnDef<LogType>[] = [
  {
    accessorKey: "name",
    header: () => <span className="mr-auto flex">Categoria</span>,
    enableHiding: false,
    cell: ({ row }) => {
      const log = row.original
      const { Icon, title } = createLogObject(log)

      return (
        <div className="flex items-center gap-2">
          <Icon size={16} /> <p>{title}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "action",
    header: "Ação",
    cell: ({ getValue }) => {
      const actionType = getValue()
      const { variant, translation } = getActionInfoByType(actionType)

      return <Badge variant={variant}>{translation}</Badge>
    },
  },
  {
    accessorKey: "message",
    header: "Mensagem",
    cell: ({ row }) => {
      const log = row.original
      const { message } = createLogObject(log)

      return <p>{parseHTML(message)}</p>
    },
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: () => <p>-</p>,
  },
  {
    accessorKey: "created_at",
    header: "Horário",
    cell: ({ getValue }) => (
      <Tooltip>
        <TooltipTrigger>
          <p>{moment(getValue() as number).format("LTS")}</p>
        </TooltipTrigger>
        <TooltipContent>
          {moment(getValue() as number).format("MMMM Do YYYY, h:mm:ss a")}
        </TooltipContent>
      </Tooltip>
    ),
  },
  {
    accessorKey: "details",
    header: "Detalhes",
    enableHiding: false,
    cell: ({ row }) => {
      const log = row.original

      return <LogModal log={log} />
    },
  },
]
