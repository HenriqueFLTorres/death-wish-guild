import { useQuery } from "@tanstack/react-query"
import type { SelectUser } from "@/db/schema"
import { USERS } from "@/lib/QueryKeys"

interface useGetUsersProps {
  enabled?: boolean
}

function useGetUsers(props?: useGetUsersProps) {
  return useQuery({
    queryKey: [USERS.GET_USERS],
    queryFn: async () => {
      try {
        const response = await fetch("/api/user/get-users")

        if (!response.ok) throw new Error(response.statusText)
        const users = await response.json()

        return users as SelectUser[]
      } catch (error) {
        throw new Error(`Failed to fetch users: ${error}`)
      }
    },
    enabled: props?.enabled,
  })
}

export { useGetUsers }
