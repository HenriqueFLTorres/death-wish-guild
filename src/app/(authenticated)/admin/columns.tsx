"use client"

import type { ColumnDef } from "@tanstack/react-table"
import {
  getClassColor,
  getIconByClass,
} from "../eventos/[id]/_components/PlayerListItem"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { SelectUser } from "@/db/schema"
import { cn } from "@/lib/utils"

export const columns = (
  mutateUserRole: ({
    role,
    userID,
  }: {
    role: SelectUser["role"]
    userID: string
  }) => void
): ColumnDef<SelectUser>[] => [
  {
    id: "id",
    accessorKey: "id",
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={
          Boolean(table.getIsAllPageRowsSelected()) ||
          (Boolean(table.getIsSomePageRowsSelected()) && "indeterminate")
        }
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(Boolean(value))
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Usuário",
    cell: ({ row }) => {
      const user = row.original

      return (
        <div className="flex items-center gap-2">
          <Avatar fallbackText={user.name} src={user.image} />
          <div className="flex flex-col gap-1">
            <strong>{user.name}</strong>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Badge
                  className="h-max w-max px-2 py-1 capitalize leading-none"
                  variant={user.role === "MEMBER" ? "neutral" : "primary"}
                >
                  {user.role.toLowerCase()}
                </Badge>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuRadioGroup
                  value={user.role}
                  onValueChange={(value) =>
                    mutateUserRole({
                      role: value as SelectUser["role"],
                      userID: user.id,
                    })
                  }
                >
                  <DropdownMenuRadioItem value="ADMIN">
                    Admin
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="MODERATOR">
                    Moderador
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="MEMBER">
                    Membro
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "class",
    header: "Class",
    cell: ({ row }) => {
      const user = row.original

      const Icon = getIconByClass(user.class)

      return (
        <div className="relative grid w-8 place-items-center">
          <span
            className={cn(
              "absolute z-[0] h-8 w-8 blur-md",
              getClassColor(user.class)
            )}
            aria-hidden
          />
          <Icon className="z-10 fill-white" size={20} />
        </div>
      )
    },
  },
]
