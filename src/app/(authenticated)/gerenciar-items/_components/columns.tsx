"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ItemsType } from "../../_components/RecentDrops"

export const columns: ColumnDef<ItemsType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "trait",
    header: "Trait",
  },
  {
    accessorKey: "added_at",
    header: "Added At",
  },
]
