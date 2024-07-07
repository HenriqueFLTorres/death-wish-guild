import { useMutation } from "@tanstack/react-query"

interface useCompleteOnboardingProps {
  onSuccess: () => void
}

interface useCompleteOnboardingMutationProps {
  id: string | undefined
  class: "DPS" | "RANGED_DPS" | "TANK" | "SUPPORT"
  displayName: string
}

function useCompleteOnboarding(props: useCompleteOnboardingProps) {
  const { onSuccess } = props

  return useMutation({
    mutationFn: async (props: useCompleteOnboardingMutationProps) => {
      try {
        if (props.id == null) throw new Error("User ID is required.")

        const response = await fetch("/api/user/complete-onboarding", {
          method: "POST",
          body: JSON.stringify(props),
        })

        if (!response.ok) throw new Error(response.statusText)

        return response.json()
      } catch (error) {
        throw new Error(`Failed to complete onboarding: ${error}`)
      }
    },
    onSuccess,
  })
}

export { useCompleteOnboarding }
