"use client"

import { useSession } from '@clerk/nextjs'
import Image from "next/image"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"

interface TemplateProps {
  children: ReactNode
}

export default function Template(props: TemplateProps) {
  const { session } = useSession()
  const { children } = props

  // if (session?.user.role !== "ADMIN") redirect("/")

  return (
    <section className="relative flex max-h-[75vh] w-full max-w-screen-xl gap-6 overflow-hidden rounded-lg px-7 py-10">
      <div className="absolute left-0 top-0 h-full w-full rounded-none bg-gradient-to-b from-neutral-800 to-neutral-900 opacity-60 backdrop-blur-lg" />

      <Image
        alt=""
        className="pointer-events-none absolute w-full scale-125 object-cover"
        src="/groups-decal.png"
        fill
      />

      <div className="relative flex w-full">{children}</div>
    </section>
  )
}
