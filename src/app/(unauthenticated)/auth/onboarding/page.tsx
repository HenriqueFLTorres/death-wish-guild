"use client"

import { signIn, useSession } from "next-auth/react"
import { AlreadyOnboarded } from "./_components/AlreadyOnboarded"
import { OnboardUser } from "./_components/OnboardUser"
import { Skeleton } from "@/components/ui/skeleton"

function Onboarding() {
  const { data: session, status } = useSession()

  if (status === "unauthenticated") signIn("discord", { callbackUrl: "/" })

  if (status === "loading") return <LoadingSkeleton />

  return (
    <main className="flex min-h-screen items-center justify-center">
      {session?.user.is_boarded === true ? (
        <AlreadyOnboarded />
      ) : (
        <OnboardUser />
      )}
    </main>
  )
}

export default Onboarding

function LoadingSkeleton() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center">
      <Skeleton className="h-96 w-full max-w-screen-sm rounded-lg bg-gradient-to-b from-primary-600/60 to-primary-400/60 backdrop-blur-md" />
    </main>
  )
}
