"use client"

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { LogType } from "../_components/LatestLogs"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { LogsHeader } from "./_components/LogsHeader"
import { trpc } from "@/trpc-client/client"

function EventLogs() {
  const { data: logs = [] } = trpc.logs.getLatestLogs.useQuery()

  const table = useReactTable<LogType>({
    data: logs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row.id,
  })

  return (
    <main className="flex h-full w-full items-center justify-center px-12 py-20">
      <section className="flex h-full w-full max-w-screen-xl flex-col rounded-lg border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-900/50 text-neutral-100">
        <LogsHeader table={table} />
        <DataTable columns={columns} table={table} />
      </section>
    </main>
  )
}

export default EventLogs
