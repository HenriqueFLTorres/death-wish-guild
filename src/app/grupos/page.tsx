"use client"

import { useState } from "react"
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

function Grupos() {
  const [isActive, setIsActive] = useState(0)

  return (
    <section className="flex w-full max-w-screen-xl rounded-lg bg-gradient-to-b from-neutral-800 to-neutral-900 px-7 py-10">
      <ol className="flex flex-col gap-4">
        {EVENTS_DATA.map((event, index) => (
          <EventCard
            key={event.id}
            {...event}
            isActive={index === isActive}
            onSelect={() => setIsActive(index)}
          />
        ))}
      </ol>
    </section>
  )
}

export default Grupos
