"use client"

import { Users } from "lucide-react"
import { columns, recruitmentColumns } from "./columns"
import { DataTable } from "./data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { trpc } from "@/trpc-client/client"

function Members() {
  const { data: users = [] } = trpc.user.getUsers.useQuery()
  const { data: usersForRecruitment = [] } =
    trpc.user.getUsersForRecruitment.useQuery()

  const utils = trpc.useUtils()
  const { mutate: acceptRecruit } = trpc.user.acceptRecruit.useMutation({
    onSuccess: () => utils.user.getUsers.invalidate(),
  })
  const { mutate: rejectRecruit } = trpc.user.rejectRecruit.useMutation({
    onSuccess: () => utils.user.getUsers.invalidate(),
  })

  return (
    <main className="flex h-full w-full items-center justify-center px-12 py-20">
      <section className="flex h-full w-full max-w-screen-xl flex-col rounded-lg border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-900/50 text-neutral-100">
        <Tabs defaultValue="active">
          <header className="flex items-center justify-between gap-5 border-b border-neutral-800 px-4 py-3">
            <h1 className="inline-flex items-center gap-2 text-base font-semibold">
              <Users size={16} /> Membros da Guilda
            </h1>
            <TabsList>
              <TabsTrigger value="active">Ativos</TabsTrigger>
              <TabsTrigger value="recruiting">Recrutamento</TabsTrigger>
            </TabsList>
          </header>
          <TabsContent value="active">
            <DataTable columns={columns} data={users} />
          </TabsContent>
          <TabsContent value="recruiting">
            <DataTable
              columns={recruitmentColumns({ acceptRecruit, rejectRecruit })}
              data={usersForRecruitment}
            />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  )
}

export default Members
