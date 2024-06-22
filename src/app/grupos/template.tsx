import { ReactNode } from "react"

import { EventCard } from "./_components/EventCard"

const EVENTS_DATA = [
  {
    id: 1,
    name: "Chernobog | Normal",
    type: "Guild Raid - Boss",
    category: "guild",
    date: 1719014941283,
  },
  {
    id: 2,
    name: "Chernobog | Normal",
    type: "Guild Raid - Boss",
    category: "guild",
    date: 1719014941283,
  },
  {
    id: 3,
    name: "Chernobog | Normal",
    type: "Guild Raid - Boss",
    category: "guild",
    date: 1719014941283,
  },
  {
    id: 4,
    name: "Chernobog | Normal",
    type: "Guild Raid - Boss",
    category: "guild",
    date: 1719014941283,
  },
]

interface TemplateProps {
  children: ReactNode
}

export default function Template(props: TemplateProps) {
  const { children } = props

  return (
    <section className="relative flex w-full max-w-screen-xl gap-6 overflow-hidden rounded-lg px-7 py-10">
      <div className="absolute left-0 top-0 h-full w-full rounded-none bg-gradient-to-b from-neutral-800 to-neutral-900 opacity-60 backdrop-blur-lg" />

      <ol className="flex flex-col gap-4">
        {EVENTS_DATA.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </ol>

      {children}
    </section>
  )
}
