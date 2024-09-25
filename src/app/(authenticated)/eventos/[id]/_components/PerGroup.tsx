import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  type UniqueIdentifier,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { Clock, Users } from "lucide-react"
import moment from "moment"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { getEventTypeImagePath } from "../../_components/EventCard"
import { GroupCard } from "./GroupCard"
import { PlayerListItem } from "./PlayerListItem"
import { ReservePlayers } from "./ReserverPlayers"
import { Button } from "@/components/ui/button"
import type { SelectEvent } from "@/db/schema"
import { trpc } from "@/trpc-client/client"

export type Items = {
  [key in UniqueIdentifier]: (UniqueIdentifier | null)[]
}

export type NodeData = {
  index: number
  containerId: UniqueIdentifier
}

interface PerGroupProps {
  id: string
  event: SelectEvent
  isSuccess: boolean
  isLoading: boolean
}

function PerGroup(props: PerGroupProps) {
  const { id, event, isLoading, isSuccess } = props

  const { data: users = [], isSuccess: isSuccessUsers } =
    trpc.user.getUsers.useQuery()

  const { mutate: updateGroups } = trpc.events.updateEventGroup.useMutation()

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [groupData, setGroupData] = useState<Items>({
    RESERVE_PLAYERS: [],
  })

  const sensors = useSensors(useSensor(PointerSensor))

  const activeUser = useMemo(
    () => users.find((user) => user.id === activeId),
    [activeId, users]
  )

  useEffect(() => {
    if (isSuccess)
      setGroupData((prev) => ({
        RESERVE_PLAYERS: prev.RESERVE_PLAYERS,
        ...(event?.groups as Record<string, UniqueIdentifier[]>),
      }))
  }, [isSuccess, event?.groups])

  useEffect(() => {
    if (Boolean(isSuccessUsers) && isSuccess) {
      setGroupData((prev) => ({
        ...prev,
        RESERVE_PLAYERS:
          users
            ?.map((user) => user.id)
            .filter(
              (userId) =>
                !Object.values(event?.groups ?? {})
                  .flat()
                  .includes(userId)
            ) ?? [],
      }))
    }
  }, [isSuccessUsers, users, isSuccess, event?.groups])

  if (isLoading || event == null) return null

  const { name, start_time, event_type } = event

  const addNewGroup = () => {
    const dataLength = Object.keys(groupData).length

    const newGroupId = `Grupo ${dataLength + 1}`

    setGroupData((prev) => ({
      ...prev,
      [newGroupId]: [null, null, null, null, null, null],
    }))
  }

  const onGroupRemove = (key: UniqueIdentifier) => {
    if (key === "RESERVE_PLAYERS")
      throw new Error("Cannot remove reserve players")

    setGroupData((prev) => {
      const playersRemoved = prev[key].filter(Boolean)

      const newsGroupsData = structuredClone(prev)

      newsGroupsData.RESERVE_PLAYERS.push(...playersRemoved)
      delete newsGroupsData[key]

      return newsGroupsData
    })
  }

  return (
    <DndContext
      collisionDetection={pointerWithin}
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <section className="relative flex h-full w-full flex-col items-center overflow-hidden rounded-xl border border-neutral-700 bg-gradient-to-b from-neutral-900 to-neutral-900/50 px-4 py-3 pb-24 shadow-xl">
        <Image
          alt=""
          className="absolute object-cover"
          src="/background-2.png"
          fill
        />

        <div className="relative flex w-full flex-col gap-12">
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

                <p className="font-medium drop-shadow">53/56</p>
              </div>
            </div>
          </header>

          <ul className="mx-auto grid w-max grid-cols-3 place-items-center gap-3">
            {Object.entries(groupData).map(([key, items]) =>
              key === "RESERVE_PLAYERS" ? null : (
                <GroupCard
                  containerId={key}
                  items={items}
                  key={key}
                  onRemove={() => onGroupRemove(key)}
                />
              )
            )}
          </ul>

          <footer className="flex w-full gap-4">
            <Button className="w-full" onClick={addNewGroup}>
              Adicionar novo grupo
            </Button>
            <Button
              className="w-full"
              variant="secondary"
              onClick={() =>
                updateGroups({ id: Number(id), groups: groupData })
              }
            >
              Salvar
            </Button>
          </footer>
        </div>

        <ReservePlayers RESERVE_PLAYERS={groupData.RESERVE_PLAYERS} />
      </section>
      <DragOverlay className="list-none" wrapperElement="li">
        {activeId == null || activeUser == null ? null : (
          <PlayerListItem
            class={activeUser.class}
            id={activeUser.id}
            image={activeUser.image}
            name={activeUser.name}
          />
        )}
      </DragOverlay>
    </DndContext>
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    setActiveId(null)

    if (over == null) return

    const activeData = active.data.current
    const overData = over.data.current

    if (activeData == null || overData == null) return

    const { index: activeIndex, containerId: activeContainerId }: NodeData =
      activeData as NodeData
    const { index: overIndex, containerId: overContainerId }: NodeData =
      overData as NodeData

    if (activeIndex === overIndex && activeContainerId === overContainerId)
      return

    setGroupData((prev) => {
      const isOverDroppable = String(over.id).includes("droppable")
      const isSameContainer = activeContainerId === overContainerId

      if (isSameContainer) {
        prev[activeContainerId][activeIndex] = isOverDroppable ? null : over.id
        prev[activeContainerId][overIndex] = active.id

        return prev
      }

      const newActiveContainer = structuredClone(prev[activeContainerId])
      newActiveContainer[activeIndex] = isOverDroppable
        ? (null as unknown as UniqueIdentifier)
        : (over.id as UniqueIdentifier)

      const newOverContainer = structuredClone(prev[overContainerId])
      newOverContainer[overIndex] = active.id

      // prevent nulls from being added to reserve players
      const activeIsReserve = activeContainerId === "RESERVE_PLAYERS"
      if (activeIsReserve) newActiveContainer.splice(activeIndex, 1)

      return {
        ...prev,
        [activeContainerId]: newActiveContainer,
        [overContainerId]: newOverContainer,
      }
    })
  }
}

export { PerGroup }
