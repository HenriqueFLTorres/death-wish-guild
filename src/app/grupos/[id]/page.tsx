"use client"

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  defaultAnnouncements,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { Clock, Users } from "lucide-react"
import moment from "moment"
import Image from "next/image"
import { useState } from "react"
import { GroupCard } from "./_components/GroupCard"

const CURRENT_EVENT = {
  id: 1,
  name: "Chernobog | Normal",
  type: "Guild Raid - Boss",
  category: "guild",
  date: 1719014941283,
}

const MAX_GROUP_SIZE = 3

type Items = {
  [key in string]: string[]
}

function EventPage() {
  const [items, setItems] = useState<Items>({
    root: ["1", "2", "3"],
    container1: ["4", "5", "6"],
    container2: ["7", "8", "9"],
    container3: [],
  })
  const [backupItems, setBackupItems] = useState<Items>(items)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const now = new Date()

  const { name } = CURRENT_EVENT

  return (
    <DndContext
      announcements={defaultAnnouncements}
      collisionDetection={closestCorners}
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

              <button type="button" onClick={() => console.log(items)}>
                showAll items
              </button>

              <div className="flex items-center gap-2">
                <div className="grid h-5 w-5 place-items-center rounded-sm border border-primary bg-primary-600">
                  <Clock size={12} />
                </div>

                <p className="font-semibold drop-shadow">
                  {moment(now).add(2, "hour").format("LT")} -{" "}
                  {moment(now).add(2, "hour").fromNow()}
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <p className="flex items-center gap-2 font-medium drop-shadow">
                <Image
                  alt="guild icon"
                  height={14}
                  src={"/event-indicator/guild.png"}
                  width={14}
                />
                Guilda
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
              <GroupCard containerId={key} containerItems={items} key={key} />
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

    return Object.keys(items).find((key) => items[key].includes(id))
  }

  function handleDragStart() {
    setBackupItems(items)
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

    setItems((prev) => {
      const activeItems = prev[activeContainer]
      const overItems = prev[overContainer]

      // Find the indexes for the items
      const activeIndex = activeItems.indexOf(active.id)
      const overIndex = overItems.indexOf(over.id)

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

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item !== active.id),
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
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

    const overGroupSize = over?.data.current?.sortable.items.length
    if (overGroupSize >= MAX_GROUP_SIZE) return setItems(backupItems)

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
    }
  }
}

export default EventPage