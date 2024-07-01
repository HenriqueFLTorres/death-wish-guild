"use client"

import { RotateCcw } from "lucide-react"
import Image from "next/image"
import { signIn } from "next-auth/react"
import { AccessDeniedMessage } from "./_components/AccessDenied"
import { LoginErrorMessage } from "./_components/LoginError"
import { Button } from "@/components/ui/button"

interface ErrorPageProps {
  searchParams: { error: string }
}

function ErrorPage(props: ErrorPageProps) {
  const { searchParams } = props

  const error = searchParams.error

  return (
    <main className="flex min-h-screen w-full items-center justify-center">
      <section className="relative flex w-full max-w-screen-sm flex-col justify-center gap-8 overflow-hidden rounded-lg bg-gradient-to-b from-secondary-600/40 to-secondary-400/40 p-4 pb-4 drop-shadow-md backdrop-blur-md">
        {error === "AccessDenied" ? (
          <AccessDeniedMessage />
        ) : (
          <LoginErrorMessage error={error} />
        )}

        <Button
          className="relative z-10 w-full"
          onClick={() => signIn("discord", { callbackUrl: "/" })}
        >
          <RotateCcw />
          Tentar novamente
        </Button>

        <Image
          alt=""
          className="pointer-events-none absolute z-0 h-full w-full scale-125"
          height={600}
          src="/groups-decals-small.png"
          width={600}
        />
      </section>
    </main>
  )
}

export default ErrorPage
