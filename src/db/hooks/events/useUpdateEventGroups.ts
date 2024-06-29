import { useMutation } from "@tanstack/react-query"
import { EVENTS } from "@/lib/QueryKeys"

interface useUpdateEventGroupsProps {
  id: string
}

function useUpdateEventGroups(props: useUpdateEventGroupsProps) {
  const { id } = props

  return useMutation({
    mutationKey: [EVENTS.UPDATE_EVENT, id],
    mutationFn: async (newGroups: EventGroups) => {
      const groupsWithoutReserve = structuredClone(newGroups)

      // biome-ignore lint/performance/noDelete: <explanation>
      delete groupsWithoutReserve.RESERVE_PLAYERS

      const response = await fetch("/api/events/update-event", {
        method: "POST",
        body: JSON.stringify({
          event: { id: Number(id), groups: groupsWithoutReserve },
        }),
      })

      if (!response.ok) throw new Error(response.statusText)

      return response.json()
    },
  })
}

export { useUpdateEventGroups }
