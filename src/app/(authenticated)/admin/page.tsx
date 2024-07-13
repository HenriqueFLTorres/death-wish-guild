"use client"

import { columns } from "./columns"
import { DataTable } from "./data-table"
import { trpc } from "@/trpc-client/client"

function Admin() {
  const { data: users = [] } = trpc.getUsers.useQuery()

  // const { mutate: mutateUserRole } = useUpdateUserRole()

  return <DataTable columns={columns()} data={users} />
}

export default Admin
