import { useOrganization, useSession } from "@clerk/nextjs"

export const createContext = async () => {
  const { session } = useSession()
  const { membership } = useOrganization()

  return {
    session,
    membership,
  }
}
