import Image from "next/image"
import type { ReactNode } from "react"

import { EventsSidebar } from "./_components/EventsSidebar"

interface TemplateProps {
  children: ReactNode
}

export default async function Template(props: TemplateProps) {
  const { children } = props

  return (
    <main className="flex h-full w-full justify-center gap-6 px-12 py-20">
      <Image
        alt=""
        className="pointer-events-none absolute z-[-1] w-full scale-125 object-cover"
        src="/groups-decal.png"
        fill
      />

      <EventsSidebar />

      {children}
    </main>
  )
}
