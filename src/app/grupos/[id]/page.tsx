"use client"

import { Clock, Users } from "lucide-react"
import moment from "moment"
import Image from "next/image"
import { GroupCard } from "./_components/GroupCard"

const CURRENT_EVENT = {
  id: 1,
  name: "Chernobog | Normal",
  type: "Guild Raid - Boss",
  category: "guild",
  date: 1719014941283,
}

function EventPage() {
  const now = new Date()

  const { name } = CURRENT_EVENT

  return (
    <section className="relative w-full overflow-hidden rounded-xl px-4 py-3">
      <Image
        alt=""
        className="absolute object-cover"
        src={"/background-2.png"}
        fill
      />

      <div className="relative flex flex-col gap-12">
        <header className="flex w-full flex-col gap-2 text-left">
          <div className="flex justify-between">
            <h1 className="text-3xl font-semibold drop-shadow-md">{name}</h1>

            <div className="flex items-center gap-2">
              <div className="grid h-5 w-5 place-items-center rounded-sm border border-primary bg-primary-600">
                <Clock size={12} />
              </div>

              <p className="font-semibold drop-shadow">
                {moment(now).add(2, "hour").format("LT")} -{" "}
                {moment(now).add(2, "hour").fromNow()}
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            <p className="flex items-center gap-2 font-medium drop-shadow">
              <Image
                alt="guild icon"
                height={14}
                src={"/event-indicator/guild.png"}
                width={14}
              />
              Guilda
            </p>

            <div className="flex items-center gap-2">
              <div className="grid h-5 w-5 place-items-center rounded-sm border border-primary bg-primary-600">
                <Users size={12} />
              </div>

              <p className="font-medium drop-shadow">53/56</p>
            </div>
          </div>
        </header>

        <ul className="mx-auto grid w-max grid-cols-3 place-items-center gap-3">
          <GroupCard />
          <GroupCard />
          <GroupCard hasMe />
          <GroupCard />
          <GroupCard />
          <GroupCard />
        </ul>
      </div>
    </section>
  )
}

export default EventPage
