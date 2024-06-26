"use client"

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  defaultAnnouncements,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { useQuery } from "@tanstack/react-query"
import { Clock, Users } from "lucide-react"
import moment from "moment"
import Image from "next/image"
import { useState } from "react"
import { getEventTypeImagePath } from "../_components/EventCard"
import { GroupCard } from "./_components/GroupCard"
import { EVENTS } from "@/lib/QueryKeys"
import { createClient } from "@/lib/supabase/client"

const MAX_GROUP_SIZE = 5

export type Items = {
  [key in string]: (string | null)[]
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

  const [items, setItems] = useState<Items>({
    root: ["1", "2", "3", "4", "5"],
    container1: ["6", "7", "8", "9", "10"],
    container2: ["11", "12", "13", "14", "15"],
    container3: ["16", "17", "18", "19", "20"],
  })
  const [referenceItems, setRefereceItems] = useState<Items>({
    root: ["1", "2", "3", "4", "5"],
    container1: ["6", "7", "8", null, null],
    container2: ["11", "12", "13", null, null],
    container3: [null, null, null, null, null],
  })
  const [backupItems, setBackupItems] = useState<{
    items: Items
    referenceItems: Items
  }>({ items, referenceItems })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  if (isLoading || event == null) return null

  const { name, start_time, type } = event

  return (
    <DndContext
      announcements={defaultAnnouncements}
      collisionDetection={closestCenter}
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
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
            {Object.entries(items).map(([key, items]) => (
              <GroupCard
                containerId={key}
                containerItems={items}
                key={key}
                REFERENCE_ITEMS={referenceItems}
              />
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
    </DndContext>
  )

  function findContainer(id: string | undefined | null) {
    if (id == null) return null

    if (id in items) {
      return id
    }

    return Object.keys(referenceItems).find((key) => items[key].includes(id))
  }

  function handleDragStart() {
    setBackupItems({ items, referenceItems })
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event

    if (over?.id == null || over == null) return

    // Find the containers
    const activeContainer = findContainer(active.id)
    const overContainer = findContainer(over.id)

    if (
      activeContainer == null ||
      overContainer == null ||
      activeContainer === overContainer
    ) {
      return
    }

    const activeItems = items[activeContainer]
    const overItems = items[overContainer]

    // Find the indexes for the items
    const activeIndex = activeItems.indexOf(active.id)
    const overIndex = overItems.indexOf(over.id)

    setItems((prev) => {
      let newIndex: number
      if (over.id in prev) {
        // We're at the root droppable of a container
        newIndex = overItems.length + 1
      } else {
        const isBelowLastItem =
          active.rect.current.translated != null &&
          active.rect.current.translated.top > over.rect.top + over.rect.height

        const modifier = isBelowLastItem ? 1 : 0

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1
      }

      const newActiveContainer = structuredClone(prev[activeContainer])
      newActiveContainer[activeIndex] = over.id

      const newOverContainer = [
        ...prev[overContainer].slice(0, newIndex),
        items[activeContainer][activeIndex],
        ...prev[overContainer].slice(newIndex, prev[overContainer].length),
      ]

      return {
        ...prev,
        [activeContainer]: newActiveContainer,
        [overContainer]: newOverContainer.filter((id) => id !== over.id),
      }
    })

    setRefereceItems((prev) => {
      const newActiveContainer = structuredClone(prev[activeContainer])

      const overId = prev[overContainer].find((id) => id === over.id)
      newActiveContainer[activeIndex] = overId ?? null

      const newOverContainer = structuredClone(prev[overContainer])
      newOverContainer[overIndex] = active.id

      return {
        ...prev,
        [activeContainer]: newActiveContainer,
        [overContainer]: newOverContainer,
      }
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over == null) return

    const activeContainer = findContainer(active.id)
    const overContainer = findContainer(over.id)

    if (
      activeContainer == null ||
      overContainer == null ||
      activeContainer !== overContainer
    ) {
      return
    }

    const overGroup = over?.data.current?.sortable.items.filter((item: never) =>
      referenceItems[overContainer].includes(item)
    ) as string[]

    if (overGroup.length >= MAX_GROUP_SIZE && !overGroup.includes(active.id)) {
      setItems(backupItems.items)
      return setRefereceItems(backupItems.items)
    }

    const activeIndex = items[activeContainer].indexOf(active.id)
    const overIndex = items[overContainer].indexOf(over.id)

    if (activeIndex !== overIndex) {
      setItems((items) => ({
        ...items,
        [overContainer]: arrayMove(
          items[overContainer],
          activeIndex,
          overIndex
        ),
      }))
      setRefereceItems((items) => ({
        ...items,
        [overContainer]: arrayMove(
          items[overContainer],
          activeIndex,
          overIndex
        ),
      }))
    }
  }
}

export default EventPage
