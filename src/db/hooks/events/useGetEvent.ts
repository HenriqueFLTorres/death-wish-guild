import { useQuery } from "@tanstack/react-query"
import { EVENTS } from "@/lib/QueryKeys"

interface useGetEventProps {
  id: string
}

function useGetEvent(props: useGetEventProps) {
  const { id } = props

  return useQuery({
    queryKey: [EVENTS.GET_EVENT, id],
    queryFn: async () => {
      try {
        const response = await fetch("/api/events/get-event", {
          method: "POST",
          body: JSON.stringify({ id: Number(id) }),
        })

        if (!response.ok) throw new Error(response.statusText)

        return response.json()
      } catch (error) {
        throw new Error(`Failed to fetch event: ${error}`)
      }
    },
    enabled: Number.isInteger(Number(id)),
  })
}

export { useGetEvent }
