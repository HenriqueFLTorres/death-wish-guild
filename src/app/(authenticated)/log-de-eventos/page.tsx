"use client"

import { columns } from "./columns"
import { DataTable } from "./data-table"
import { trpc } from "@/trpc-client/client"

function EventLogs() {
  const { data: logs = [] } = trpc.getLatestLogs.useQuery()

  return (
    <main className="flex h-full w-full items-center justify-center px-12 py-20">
      <section className="flex h-full w-full max-w-screen-xl flex-col rounded-lg border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-900/50 text-neutral-100">
        <DataTable columns={columns} data={logs} />
      </section>
    </main>
  )
}

export default EventLogs
