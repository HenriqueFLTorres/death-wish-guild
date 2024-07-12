"use client"

import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useGetUsers } from "@/db/hooks/users/useGetUsers"

function Admin() {
  const { data: users = [] } = useGetUsers()

  return <DataTable columns={columns} data={users} />
}

export default Admin
