"use client"

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
import { useEffect, useState } from "react"
import { getEventTypeImagePath } from "../_components/EventCard"
import { Draggable, GroupCard } from "./_components/GroupCard"
import { PlayerListItem } from "./_components/PlayerListItem"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useGetEvent } from "@/db/hooks/events/useGetEvent"
import { useUpdateEventGroups } from "@/db/hooks/events/useUpdateEventGroups"
import { useGetUsers } from "@/db/hooks/users/useGetUsers"
import type { SelectUser } from "@/db/schema"

export type Items = {
  [key in UniqueIdentifier]: (UniqueIdentifier | null)[]
}

export type NodeData = {
  index: number
  containerId: UniqueIdentifier
}

interface EventPageProps {
  params: { id: string }
}

function EventPage(props: EventPageProps) {
  const { params } = props

  const id = params.id

  const { data: event, isLoading, isSuccess } = useGetEvent({ id })

  const { mutate: updateGroups } = useUpdateEventGroups({
    id,
  })

  const { data: users = [], isSuccess: isSuccessUsers } = useGetUsers({
    enabled: Number.isInteger(Number(id)),
  })

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [groupData, setGroupData] = useState<Items>({
    RESERVE_PLAYERS: [],
  })

  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => {
    if (isSuccess)
      setGroupData((prev) => ({
        RESERVE_PLAYERS: prev.RESERVE_PLAYERS,
        ...event?.groups,
      }))
  }, [isSuccess, event?.groups])

  useEffect(() => {
    if (isSuccessUsers)
      setGroupData((prev) => ({
        ...prev,
        RESERVE_PLAYERS: users?.map((user) => user.id),
      }))
  }, [isSuccessUsers, users])

  if (isLoading || event == null) return null

  const { name, start_time, type } = event

  const addNewGroup = () => {
    const dataLength = Object.keys(groupData).length

    const newGroupId = `Grupo ${dataLength + 1}`

    setGroupData((prev) => ({
      ...prev,
      [newGroupId]: [null, null, null, null, null],
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
      <section className="relative flex w-full flex-col items-center overflow-hidden rounded-xl px-4 py-3">
        <Image
          alt=""
          className="absolute object-cover"
          src={"/background-2.png"}
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
                  {moment(start_time).format("LT")} -{" "}
                  {moment(start_time).fromNow()}
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <p className="flex items-center gap-2 font-medium drop-shadow">
                <Image
                  alt=""
                  height={14}
                  src={getEventTypeImagePath(type)}
                  width={14}
                />
                {type}
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
              variant={"secondary"}
              onClick={() => updateGroups(groupData)}
            >
              Salvar
            </Button>
          </footer>
        </div>

        <div className="fixed bottom-12 flex gap-3 rounded border border-black/30 bg-black/60 px-4 py-2 backdrop-blur-md">
          {groupData.RESERVE_PLAYERS.slice(0, 3).map((id, index) => (
            <Draggable
              containerId={"RESERVE_PLAYERS"}
              id={id}
              index={index}
              key={id}
              name={getUserName(id, users)}
            />
          ))}
          {groupData.RESERVE_PLAYERS.length > 3 ? (
            <Badge>+{groupData.RESERVE_PLAYERS.length - 3}</Badge>
          ) : null}
        </div>
      </section>
      <DragOverlay className="list-none" wrapperElement="li">
        {activeId == null ? null : (
          <PlayerListItem id={activeId} name={getUserName(activeId, users)} />
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

export default EventPage

export const getUserName = (
  id: UniqueIdentifier | null,
  users: SelectUser[]
) => {
  if (id == null) return ""

  const user = users.find((user) => user.id === id)

  return user?.name ?? ""
}
