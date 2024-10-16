"use client"

import { ColumnDef } from "@tanstack/react-table"
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
  },
]
