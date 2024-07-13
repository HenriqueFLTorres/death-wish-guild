"use client"

import { columns } from "./columns"
import { DataTable } from "./data-table"
import { trpc } from "@/trpc-client/client"

function Admin() {
  const { data: users = [] } = trpc.getUsers.useQuery()

  const utils = trpc.useUtils()
  const { mutate: mutateUserRole } = trpc.updateUserRole.useMutation({
    onSuccess: () => utils.getUsers.invalidate(),
  })

  return (
    <DataTable
      columns={columns(({ role, userID }) => mutateUserRole({ role, userID }))}
      data={users}
    />
  )
}

export default Admin
