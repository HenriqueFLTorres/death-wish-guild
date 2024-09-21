"use client"

import { LatestPlayerLogs } from "./_components/LatestPlayerLogs"
import { PointsRanking } from "./_components/PointsRanking"
import { UserProfile } from "./_components/UserProfile"

function Membro() {
  return (
    <main className="grid grid-cols-3 gap-5">
      <UserProfile />
      <div className="flex flex-col gap-5">
        <PointsRanking />
        <LatestPlayerLogs />
      </div>
    </main>
  )
}

export default Membro
