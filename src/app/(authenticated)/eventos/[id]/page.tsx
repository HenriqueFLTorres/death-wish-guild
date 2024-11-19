"use client"

import type { UniqueIdentifier } from "@dnd-kit/core"
import { Check, Clock, DoorOpen, NotebookPen, Users } from "lucide-react"
import moment from "moment"
import Image from "next/image"
import { useSession } from "@clerk/nextjs"
import { getEventTypeImagePath } from "../_components/EventCard"
import { ALL_POSSIBLE_OPTIONS } from "../_components/SelectEvent"
import { PerGroup } from "./_components/PerGroup"
import { PlayerListItem } from "./_components/PlayerListItem"
import { Button } from "@/components/ui/button"
import type { SelectUser } from "@/db/schema"
import { toKebabCase } from "@/lib/utils"
import { trpc } from "@/trpc-client/client"

interface EventPageProps {
  params: { id: string }
}

function EventPage(props: EventPageProps) {
  const { params } = props
  const { session } = useSession()

  const { data: users = [] } = trpc.user.getUsers.useQuery()

  const id = params.id

  const {
    data: event,
    isLoading,
    isSuccess,
  } = trpc.events.getEvent.useQuery({ id: Number(id) })

  const utils = trpc.useUtils()
  const { mutate: confirmPresence } = trpc.events.confirmEvent.useMutation({
    onSuccess: () => utils.events.getEvent.invalidate({ id: Number(id) }),
  })

  const { mutate: removePresence } =
    trpc.events.removeEventConfirmation.useMutation({
      onSuccess: () => utils.events.getEvent.invalidate({ id: Number(id) }),
    })

  if (Boolean(isLoading) || event == null) return null

  if (event?.confirmation_type === "PER_GROUP")
    return (
      <PerGroup
        event={event}
        id={id}
        isLoading={isLoading}
        isSuccess={isSuccess}
      />
    )

  event.confirmed_players = event.confirmed_players ?? []
  const { name, start_time, event_type, confirmed_players } = event

  const fullArray = Array.from(Array(5).keys()).map(() => null)
  const hasUsersConfirmed = confirmed_players.length > 0
  const previewImage = getPreviewImage(name)

  return (
    <section className="relative flex h-full w-full flex-col items-center overflow-hidden rounded-xl border border-neutral-700 bg-gradient-to-b from-neutral-900 to-neutral-900/50 px-4 py-3 pb-24 shadow-xl">
      {previewImage == null ? (
        <Image
          alt=""
          className="absolute object-cover"
          src="/background-2.png"
          fill
        />
      ) : (
        <Image
          alt=""
          className="absolute object-cover opacity-50"
          src={previewImage}
          fill
        />
      )}

      <div className="relative flex w-full flex-col items-center gap-12">
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
                {confirmed_players.length}/56
              </p>
            </div>
          </div>
        </header>

        <div className="flex h-full w-full max-w-96 select-none flex-col gap-2 rounded border-2 border-black/30 bg-black/60 from-primary-700/40 to-primary-500/40 p-3 backdrop-blur-xl">
          <ul className="fade-to-bottom flex flex-col gap-2">
            {fullArray.map((_, index) => {
              const userId = confirmed_players[index]
              const user = users.find((user) => user.id === userId)

              if (userId == null || user == null)
                return <PerPlayerPlaceholder key={index} />

              return (
                <PlayerListItem
                  class={user.class}
                  id={userId}
                  image={user.image}
                  key={userId}
                  name={user.name}
                />
              )
            })}
          </ul>

          <p className="text-center text-sm">
            {hasUsersConfirmed
              ? `${confirmed_players.length} jogadores já estão confirmados`
              : "Seja o primeiro a confirmar presença!"}
          </p>

          {confirmed_players.includes(session?.user.id ?? "") === true ? (
            <Button
              className="group relative overflow-hidden bg-primary-600 hover:border-red-700 hover:bg-red-900 hover:bg-none hover:text-red-100 hover:shadow-none"
              onClick={() => removePresence({ eventID: Number(id) })}
            >
              <span className="absolute flex -translate-y-10 items-center gap-2 transition-transform group-hover:translate-y-0">
                <DoorOpen />
                Tirar confirmação
              </span>

              <span className="flex items-center gap-2 transition-transform group-hover:translate-y-10">
                <Check />
                Presença confirmada
              </span>
            </Button>
          ) : (
            <Button onClick={() => confirmPresence({ eventID: Number(id) })}>
              <NotebookPen />
              Confirmar presença
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}

export default EventPage

function PerPlayerPlaceholder() {
  return (
    <li className="h-8 w-full rounded-full border border-dashed border-white/30 bg-white/10" />
  )
}

export const getUserName = (
  id: UniqueIdentifier | null,
  users: SelectUser[]
) => {
  if (id == null) return ""

  const user = users.find((user) => user.id === id)

  return user?.name ?? ""
}

export const getPreviewImage = (name: string) => {
  if (!ALL_POSSIBLE_OPTIONS.includes(name)) return null

  const formattedName = toKebabCase(name)

  return `/event-preview/${formattedName}.webp`
}
