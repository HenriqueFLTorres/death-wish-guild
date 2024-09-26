"use client"

import { ArrowRight, Clock, Users } from "lucide-react"
import moment from "moment"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { PlayerListItem } from "../../[id]/_components/PlayerListItem"
import { getEventTypeImagePath } from "../../_components/EventCard"

import { FinishEventAlert } from "./_components/FinishEventAlert"
import { Button } from "@/components/ui/button"
import { SelectUser } from "@/db/schema"
import { cn } from "@/lib/utils"
import { trpc } from "@/trpc-client/client"

interface FinishEventPageProps {
  params: { id: string }
}

interface ShortPlayer
  extends Pick<SelectUser, "class" | "id" | "image" | "name"> {}

function FinishEventPage(props: FinishEventPageProps) {
  const { params } = props
  const id = params.id

  const [nonConfirmedPlayers, setNonConfirmedPlayers] = useState<ShortPlayer[]>(
    []
  )
  const [confirmedPlayers, setConfirmedPlayers] = useState<ShortPlayer[]>([])

  const router = useRouter()

  const { data: event, isSuccess: isSuccessEvent } =
    trpc.events.getEvent.useQuery({ id: Number(id) })
  const { data: users = [], isSuccess: isSuccessUsers } =
    trpc.user.getUsers.useQuery()

  const { mutate: finishEvent } = trpc.events.finishEvent.useMutation({
    onSuccess: () => router.push("/eventos"),
  })

  useEffect(() => {
    if (isSuccessUsers === false || isSuccessEvent === false) return

    const nonConfirmedPlayers = []
    const confirmedPlayers = []

    for (const player of users) {
      const isPlayerConfirmed = event?.confirmed_players?.some(
        (playerID) => playerID === player.id
      )

      if (isPlayerConfirmed === true) confirmedPlayers.push(player)
      else nonConfirmedPlayers.push(player)
    }

    setNonConfirmedPlayers(nonConfirmedPlayers)
    setConfirmedPlayers(confirmedPlayers)
  }, [isSuccessUsers, isSuccessEvent])

  if (event == null) return null

  const { name, start_time, event_type, confirmed_players = [] } = event

  const togglePlayerConfirmation = (
    player: ShortPlayer,
    isConfirmed: boolean
  ) => {
    if (isConfirmed) {
      setNonConfirmedPlayers((prev) => [...prev, player])
      setConfirmedPlayers((prev) => prev.filter(({ id }) => id !== player.id))
      return
    }

    setConfirmedPlayers((prev) => [...prev, player])
    setNonConfirmedPlayers((prev) => prev.filter(({ id }) => id !== player.id))
  }

  return (
    <section className="relative flex h-full w-full flex-col items-center overflow-hidden rounded-xl border border-neutral-700 bg-gradient-to-b from-neutral-900 to-neutral-900/50 px-4 py-3 pb-24 shadow-xl">
      <Image
        alt=""
        className="absolute object-cover"
        src="/background-2.png"
        fill
      />

      <div className="relative flex h-full w-full flex-col items-center gap-12">
        <header className="flex w-full flex-col gap-2 text-left">
          <div className="flex justify-between">
            <h1 className="text-3xl font-semibold drop-shadow-md">{name}</h1>

            <div className="flex items-center gap-2">
              <div className="grid h-5 w-5 place-items-center rounded-sm border border-primary bg-primary-600">
                <Clock size={12} />
              </div>

              <p className="font-semibold drop-shadow">
                {moment.utc(start_time).local().format("LT")} -{" "}
                {moment.utc(start_time).fromNow()}
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            <p className="flex items-center gap-2 font-medium drop-shadow">
              <Image
                alt=""
                height={14}
                src={getEventTypeImagePath(event_type)}
                width={14}
              />
              {event_type}
            </p>

            <div className="flex items-center gap-2">
              <div className="grid h-5 w-5 place-items-center rounded-sm border border-primary bg-primary-600">
                <Users size={12} />
              </div>

              <p className="font-medium drop-shadow">
                {confirmed_players?.length}/56
              </p>
            </div>
          </div>
        </header>

        <div className="flex h-full max-h-96 w-full max-w-[30rem] select-none flex-col gap-2 rounded border-2 border-black/30 bg-black/60 from-primary-700/40 to-primary-500/40 p-3 backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <h2 className="font-semibold">Não participou</h2>
              <ul className="flex flex-col gap-2">
                {nonConfirmedPlayers?.map((player) => (
                  <ConfirmationRow
                    key={player.id}
                    {...player}
                    onToggle={() => togglePlayerConfirmation(player, false)}
                  />
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-end font-semibold">Participou</h2>
              <ul className="flex flex-col gap-2">
                {confirmedPlayers?.map((player) => (
                  <ConfirmationRow
                    key={player.id}
                    {...player}
                    isConfirmed
                    onToggle={() => togglePlayerConfirmation(player, true)}
                  />
                ))}
              </ul>
            </div>
          </div>

          <FinishEventAlert
            onAction={() =>
              finishEvent({
                id: event.id,
                confirmedPlayers: confirmedPlayers.map((player) => player.id),
              })
            }
          />
        </div>
      </div>
    </section>
  )
}

export default FinishEventPage

interface ConfirmationRowProps extends ShortPlayer {
  onToggle: () => void
  isConfirmed?: boolean
}

function ConfirmationRow(props: ConfirmationRowProps) {
  const {
    id,
    name,
    class: playerClass,
    image,
    onToggle,
    isConfirmed = false,
  } = props

  return (
    <div
      className={cn("group flex w-full gap-2 overflow-hidden", {
        "flex-row-reverse": isConfirmed,
      })}
    >
      <PlayerListItem
        class={playerClass}
        id={id}
        image={image}
        key={id}
        name={name}
      />

      <Button
        className="shrink-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
        size="icon"
        variant="secondary-flat"
        onClick={onToggle}
      >
        <ArrowRight className={cn({ "rotate-180": isConfirmed })} size={16} />
      </Button>
    </div>
  )
}
