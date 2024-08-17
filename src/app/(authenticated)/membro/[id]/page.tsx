"use client"

import {
  CalendarClock,
  CalendarDays,
  History,
  Scale,
  ScrollText,
} from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { ActivityHistory } from "./components/ActivityHistory"
import { InformationMember } from "./components/InformationMember"
import { LastLogs } from "./components/LastLogs"
import { LatestReleases } from "./components/LatestReleases"
import { Ranking } from "./components/Ranking"
import { trpc } from "@/trpc-client/client"

function Member() {
  const { data: user, isSuccess } = trpc.getUser.useQuery({
    userID: "580d7b53-0272-4ac3-b0c8-7bcc00783f06",
  })
  const { data: playersByPoints = [] } = trpc.getPlayersPointsRanking.useQuery()
  const { data: PositionRankingMember } = trpc.getPositionMember.useQuery({
    userID: "580d7b53-0272-4ac3-b0c8-7bcc00783f06",
  })

  const [nameInput, setNameInput] = useState("")

  useEffect(() => {
    setNameInput(user?.name ?? "")
  }, [isSuccess])
  if (user == null) return null

  return (
    <main className="grid w-full max-w-7xl grid-cols-3 gap-5">
      <div className="relative col-span-2 overflow-hidden rounded-lg bg-gradient-to-b from-neutral-900 to-neutral-900/50 px-4 pt-4">
        {/*imagem blur*/}
        <Image
          alt=""
          className="fade-to-bottom pointer-events-none absolute max-h-80 object-cover opacity-50 blur-lg"
          src="/background-3.png"
          fill
        />
        <InformationMember
          nameInput={nameInput}
          setNameInput={setNameInput}
          user={user}
        />
        <div className="mt-6">
          <div className="mb-4 flex items-center gap-1">
            <Scale size={16} />
            <h2 className="font-semibold">Últimos Lances</h2>
          </div>
          <div>
            <LatestReleases />
            {/*utilizar map e criar cada componente*/}
          </div>
        </div>
        <div className="mt-6">
          <div className="mb-4 flex items-center gap-1">
            <History size={16} />
            <h2 className="font-semibold">Histórico de Atividades</h2>
          </div>
          <div>
            <ActivityHistory />
            {/*utilizar map e criar cada componente*/}
          </div>
        </div>
      </div>
      <div className="w-full space-y-5">
        <div className="rounded-lg border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-900/50">
          <div className="flex items-center justify-center gap-1 p-3">
            <CalendarClock size={16} />
            <h2 className="font-semibold">Ranking de Pontos</h2>
          </div>
          <hr className="mb-3 border-neutral-800" />
          <Ranking
            playersByPoints={playersByPoints}
            PositionRankingMember={PositionRankingMember?.rank}
            typeScore="pontos"
            user={user}
          />
        </div>
        <div className="rounded-lg border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-900/50">
          <div className="flex items-center justify-center gap-1 p-3">
            <CalendarDays size={16} />
            <h2 className="font-semibold">Ranking de Pontos</h2>
          </div>
          <hr className="mb-3 border-neutral-800" />
          <Ranking
            playersByPoints={playersByPoints}
            PositionRankingMember={PositionRankingMember?.rank}
            typeScore="eventos"
            user={user}
          />
        </div>
        <div className="rounded-lg border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-900/50">
          <div className="flex items-center justify-center gap-1 p-3">
            <ScrollText size={16} />
            <h2 className="font-semibold">Últimos Log’s</h2>
          </div>
          <hr className="mb-3 border-neutral-800" />
          <LastLogs />
        </div>
      </div>
    </main>
  )
}

export default Member
