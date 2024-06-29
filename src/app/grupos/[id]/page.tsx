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
import { useQuery } from "@tanstack/react-query"
import { Clock, Users } from "lucide-react"
import moment from "moment"
import Image from "next/image"
import { useState } from "react"
import { getEventTypeImagePath } from "../_components/EventCard"
import { GroupCard } from "./_components/GroupCard"
import { PlayerListItem } from "./_components/PlayerListItem"
import { EVENTS } from "@/lib/QueryKeys"
import { createClient } from "@/lib/supabase/client"

const DEFAULT_ITEMS = {
  root: ["1", "2", "3", "4", "5"],
  container1: ["6", "7", "8", null, null],
  container2: ["11", "12", "13", null, null],
  container3: [null, null, null, null, null],
}

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

  const supabase = createClient()

  const { data: event, isLoading } = useQuery({
    queryKey: [EVENTS.GET_EVENT, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select()
        .match({ id })
        .single()

      if (error != null) throw new Error(`Failed to fetch event: ${error}`)

      return data
    },
    enabled: Number.isInteger(Number(id)),
  })

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [referenceItems, setRefereceItems] = useState<Items>(DEFAULT_ITEMS)

  const sensors = useSensors(useSensor(PointerSensor))

  if (isLoading || event == null) return null

  const { name, start_time, type } = event

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
            {Object.entries(referenceItems).map(([key, items]) => (
              <GroupCard containerId={key} items={items} key={key} />
            ))}
          </ul>
        </div>

        {/* <div className="fixed bottom-12 flex gap-3 rounded border border-black/30 bg-black/60 px-4 py-2 backdrop-blur-md">
          <SortableItem id={6} />
          <SortableItem id={7} />
          <SortableItem id={8} />
          <Badge>+44</Badge>
        </div> */}
      </section>
      <DragOverlay className="list-none" wrapperElement="li">
        {activeId == null ? null : (
          <PlayerListItem id={activeId} isPlaceholder={false} />
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

    setRefereceItems((prev) => {
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

      return {
        ...prev,
        [activeContainerId]: newActiveContainer,
        [overContainerId]: newOverContainer,
      }
    })
  }
}

export default EventPage
