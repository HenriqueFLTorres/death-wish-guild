"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Ellipsis } from "lucide-react"
import moment from "moment"
import { getIconByClass } from "../grupos/[id]/_components/PlayerListItem"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { SelectUser } from "@/db/schema"
import { translateGameClass } from "@/lib/utils"

export const columns: ColumnDef<SelectUser>[] = [
  {
    accessorKey: "display_name",
    header: () => <span className="mr-auto flex">Usuário</span>,
    cell: ({ row }) => {
      const user = row.original

      return (
        <div className="flex items-center gap-2">
          <Avatar fallbackText={user.display_name} src={user.image} />
          <div className="flex flex-col gap-1">
            <strong className="text-left">{user.display_name}</strong>
            <Badge
              className="h-max w-max px-2 py-1 capitalize leading-none"
              variant={user.role === "MEMBER" ? "neutral" : "primary"}
            >
              {user.role.toLowerCase()}
            </Badge>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "class",
    header: "Class",
    cell: ({ row }) => {
      const user = row.original

      const Icon = getIconByClass(user.class)

      return (
        <Badge className="gap-2" variant={getGameClassVariant(user.class)}>
          <Icon className="z-10 fill-white" size={16} />
          {translateGameClass(user.class)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "points",
    header: "Pontos",
    cell: ({ getValue }) => {
      const value = Number(getValue() ?? 0)

      return <span>{value.toLocaleString()}</span>
    },
  },
  {
    accessorKey: "joined_at",
    header: "Entrou em",
    cell: ({ getValue }) => {
      const value = new Date(getValue() as Date)

      return (
        <Tooltip>
          <TooltipTrigger>
            <span>{moment(value).fromNow()}</span>
          </TooltipTrigger>
          <TooltipContent>
            <span>{moment(value).format("MMMM Do YYYY, h:mm:ss a")}</span>
          </TooltipContent>
        </Tooltip>
      )
    },
  },
]

export const recruitmentColumns = ({
  acceptRecruit,
  rejectRecruit,
}: {
  acceptRecruit: ({ ID }: { ID: string }) => void
  rejectRecruit: ({ ID }: { ID: string }) => void
}): ColumnDef<SelectUser>[] => [
  {
    accessorKey: "display_name",
    header: () => <span className="mr-auto flex">Usuário</span>,
    cell: ({ row }) => {
      const user = row.original

      return (
        <div className="flex items-center gap-2">
          <Avatar fallbackText={user.display_name} src={user.image} />
          <div className="flex flex-col gap-1">
            <strong className="text-left">{user.display_name}</strong>
            <Badge
              className="h-max w-max px-2 py-1 capitalize leading-none"
              variant={user.role === "MEMBER" ? "neutral" : "primary"}
            >
              {user.role.toLowerCase()}
            </Badge>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "class",
    header: "Class",
    cell: ({ row }) => {
      const user = row.original

      const Icon = getIconByClass(user.class)

      return (
        <Badge className="gap-2" variant={getGameClassVariant(user.class)}>
          <Icon className="z-10 fill-white" size={16} />
          {translateGameClass(user.class)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const user = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            className={buttonVariants({
              variant: "outline",
            })}
          >
            <Ellipsis size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => acceptRecruit({ ID: user.id })}>
              Aceitar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => rejectRecruit({ ID: user.id })}>
              Rejeitar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

function getGameClassVariant(gameClass: SelectUser["class"]) {
  switch (gameClass) {
    case "DPS":
      return "error"
    case "RANGED_DPS":
      return "primary"
    case "SUPPORT":
      return "success"
    case "TANK":
      return "sky"
    default:
      throw new Error("Invalid game class")
  }
}
