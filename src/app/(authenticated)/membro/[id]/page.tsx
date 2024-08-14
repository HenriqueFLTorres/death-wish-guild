"use client"

import { History, Scale } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { InformationMember } from "./components/InformationMember"
import { LatestReleases } from "./components/LatestReleases"
import { trpc } from "@/trpc-client/client"

function Member() {
  const { data: user, isSuccess } = trpc.getUser.useQuery({
    userID: "580d7b53-0272-4ac3-b0c8-7bcc00783f06",
  })
  const [nameInput, setNameInput] = useState("")

  useEffect(() => {
    setNameInput(user?.name ?? "")
  }, [isSuccess])
  if (user == null) return null
  return (
    <main className="border-red grid w-full max-w-7xl grid-cols-3 border-2">
      <div className="relative col-span-2 border-2 border-yellow-300 px-4 pt-4">
        {/*imagem blur*/}
        <Image
          alt=""
          className="fade-to-bottom absolute z-[-1] blur"
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
          </div>
        </div>
        <div className="mt-6">
          <div className="mb-4 flex items-center gap-1">
            <History size={16} />
            <h2 className="font-semibold">Histórico de Atividades</h2>
          </div>
        </div>
      </div>
      <div>....</div>
    </main>
  )
}

export default Member
