"use client"

import {} from "@/components/ui/tooltip"
import { ColumnDef } from "@tanstack/react-table"
import moment from "moment"
import { ItemType } from "../../_components/RecentDrops"

export const columns: ColumnDef<ItemType>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "trait",
    header: "Trait",
  },
  {
    accessorKey: "acquired_by",
    header: "Adquirido por",
  },
  {
    accessorKey: "added_at",
    header: "Adicionado Em",
    cell: ({ getValue }) => (
      <p>
        {moment
          .utc(getValue() as string)
          .local()
          .format("HH:mm:ss - D/MM/YYYY")}
      </p>
    ),
  },
]
