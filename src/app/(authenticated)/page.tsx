"use client"

import { LatestLogs } from "./_components/LatestLogs"
import { NextEvents } from "./_components/NextEvents"
import { PlayerCount } from "./_components/PlayerCount"
import { PointsRanking } from "./_components/PointsRanking"
import { RecentDrops } from "./_components/RecentDrops"
import { RecentPlayers } from "./_components/RecentPlayers"

export default function Home() {
  return (
    <main className="flex h-full items-center justify-center px-4 py-20">
      <section className="grid h-full w-full max-w-screen-2xl grid-cols-4 grid-rows-2 gap-5">
        <NextEvents />

        <div className="row-span-2 flex h-full flex-1 flex-col gap-5 [&>section]:min-h-0 [&>section]:flex-grow [&>section]:basis-0">
          <PlayerCount />

          <RecentDrops />

          <RecentPlayers />
        </div>

        <LatestLogs />

        <PointsRanking />
      </section>
    </main>
  )
}
