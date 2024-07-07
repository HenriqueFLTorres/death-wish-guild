import { useQuery } from "@tanstack/react-query"
import { SelectEvent } from "@/db/schema"
import { EVENTS } from "@/lib/QueryKeys"

function useGetEvents() {
  return useQuery({
    queryKey: [EVENTS.GET_EVENTS],
    queryFn: async () => {
      try {
        const response = await fetch("/api/events/get-events")

        if (!response.ok) throw new Error(response.statusText)
        const events = await response.json()

        return events as SelectEvent[]
      } catch (error) {
        throw new Error(`Failed to fetch events: ${error}`)
      }
    },
  })
}

export { useGetEvents }
