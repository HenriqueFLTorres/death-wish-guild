"use client"

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { RouterOutput, trpc } from "@/trpc-client/client"

export type AuctionType = RouterOutput["auctions"]["getAuctions"][number]

export default function Inventory() {
  const { data: auctions = [] } = trpc.auctions.getAuctions.useQuery()

  const table = useReactTable<AuctionType>({
    data: auctions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row.id,
  })

  return (
    <div className="flex h-full w-full items-center justify-center py-20">
      <section className="flex h-full w-full max-w-screen-2xl flex-col gap-4 overflow-auto rounded-lg border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-900/50 text-neutral-100">
        <DataTable columns={columns} table={table} />
      </section>
    </div>
  )
}
