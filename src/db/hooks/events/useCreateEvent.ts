import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { InsertEvent } from "../../schema"
import { EVENTS } from "@/lib/QueryKeys"

interface useCreateEventProps {
  onSuccess: () => void
}

function useCreateEvent(props: useCreateEventProps) {
  const { onSuccess } = props

  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [EVENTS.CREATE_EVENT],
    mutationFn: async (eventData: InsertEvent) => {
      const response = await fetch("/api/events/create-event", {
        method: "POST",
        body: JSON.stringify({
          event: eventData,
        }),
      })

      if (!response.ok) throw new Error(response.statusText)

      return response.json()
    },
    onSuccess,
    onMutate: async (newEvent) => {
      await queryClient.cancelQueries({ queryKey: [EVENTS.GET_EVENTS] })

      const previousEvents = queryClient.getQueryData([EVENTS.GET_EVENTS])

      queryClient.setQueryData([EVENTS.GET_EVENTS], (old: InsertEvent[]) => [
        ...old,
        newEvent,
      ])

      return { previousEvents }
    },
    onError: (_, __, context) => {
      if (context?.previousEvents != null)
        queryClient.setQueryData([EVENTS.GET_EVENTS], context.previousEvents)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS.GET_EVENTS] })
    },
  })
}

export { useCreateEvent }
