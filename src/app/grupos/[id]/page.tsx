"use client"

import {
  DndContext,
  type DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  MeasuringStrategy,
  MouseSensor,
  TouchSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { Clock, Users } from "lucide-react"
import moment from "moment"
import Image from "next/image"
import { useRef, useState } from "react"
import { GroupCard, SortableItem } from "./_components/GroupCard"
import { Badge } from "@/components/ui/badge"

const CURRENT_EVENT = {
  id: 1,
  name: "Chernobog | Normal",
  type: "Guild Raid - Boss",
  category: "guild",
  date: 1719014941283,
}

const MEASURING_CONFIGURATION = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}

export type Items = Record<UniqueIdentifier, UniqueIdentifier[]>

function EventPage() {
  const [items, setItems] = useState<Items>(() => ({
    A: createRange(5, (index) => `A${index + 1}`),
    B: createRange(3, (index) => `B${index + 1}`),
    C: createRange(2, (index) => `C${index + 1}`),
    D: createRange(5, (index) => `D${index + 1}`),
  }))
  const [containers, setContainers] = useState(
    Object.keys(items) as UniqueIdentifier[]
  )
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  // const lastOverId = useRef<UniqueIdentifier | null>(null)
  const recentlyMovedToNewContainer = useRef(false)

  // const collisionDetectionStrategy: CollisionDetection = useCallback(
  //   (args) => {
  //     if (activeId != null && activeId in items) {
  //       return closestCenter({
  //         ...args,
  //         droppableContainers: args.droppableContainers.filter(
  //           (container) => container.id in items
  //         ),
  //       })
  //     }

  //     const pointerIntersections = pointerWithin(args)
  //     const intersections =
  //       pointerIntersections.length > 0
  //         ? pointerIntersections
  //         : rectIntersection(args)
  //     let overId = getFirstCollision(intersections, "id")

  //     if (overId != null) {
  //       if (overId in items) {
  //         const containerItems = items[overId]

  //         if (containerItems.length > 0) {
  //           overId = closestCenter({
  //             ...args,
  //             droppableContainers: args.droppableContainers.filter(
  //               (container) =>
  //                 container.id !== overId &&
  //                 containerItems.includes(container.id)
  //             ),
  //           })[0]?.id
  //         }
  //       }

  //       lastOverId.current = overId

  //       return [{ id: overId }]
  //     }

  //     if (recentlyMovedToNewContainer.current) lastOverId.current = activeId

  //     return lastOverId.current == null ? [] : [{ id: lastOverId.current }]
  //   },
  //   [activeId, items]
  // )

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))
  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) {
      return id
    }

    return Object.keys(items).find((key) => items[key].includes(id))
  }

  const now = new Date()

  const { name } = CURRENT_EVENT

  return (
    <DndContext
      measuring={MEASURING_CONFIGURATION}
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={onDragStart}
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
            {containers.map((containerId) => (
              <GroupCard
                containerId={containerId}
                containerItems={items[containerId]}
                key={containerId}
              />
            ))}
          </ul>
        </div>

        <div className="fixed bottom-12 flex gap-3 rounded border border-black/30 bg-black/60 px-4 py-2 backdrop-blur-md">
          <SortableItem id={6} />
          <SortableItem id={7} />
          <SortableItem id={8} />
          <Badge>+44</Badge>
        </div>
      </section>
    </DndContext>
  )

  function onDragStart(event: DragStartEvent) {
    const { active } = event

    if (activeId !== active.id) {
      setActiveId(active.id)
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    const overId = over?.id

    if (overId == null || active.id in items) {
      return
    }

    const overContainer = findContainer(overId)
    const activeContainer = findContainer(active.id)

    if (overContainer == null || activeContainer == null) {
      return
    }

    if (activeContainer !== overContainer) {
      setItems((items) => {
        const activeItems = items[activeContainer]
        const overItems = items[overContainer]
        const overIndex = overItems.indexOf(overId)
        const activeIndex = activeItems.indexOf(active.id)

        let newIndex: number

        if (overId in items) {
          newIndex = overItems.length + 1
        } else {
          const isBelowOverItem =
            over &&
            active.rect.current.translated &&
            active.rect.current.translated.top >
              over.rect.top + over.rect.height

          const modifier = isBelowOverItem === true ? 1 : 0

          newIndex =
            overIndex >= 0 ? overIndex + modifier : overItems.length + 1
        }

        recentlyMovedToNewContainer.current = true

        return {
          ...items,
          [activeContainer]: items[activeContainer].filter(
            (item) => item !== active.id
          ),
          [overContainer]: [
            ...items[overContainer].slice(0, newIndex),
            items[activeContainer][activeIndex],
            ...items[overContainer].slice(
              newIndex,
              items[overContainer].length
            ),
          ],
        }
      })
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id in items && over?.id != null)
      setContainers((containers) => {
        const activeIndex = containers.indexOf(active.id)
        const overIndex = containers.indexOf(over.id)

        console.log(containers[overIndex].length)

        return arrayMove(containers, activeIndex, overIndex)
      })

    const activeContainer = findContainer(active.id)

    if (activeContainer == null) {
      setActiveId(null)
      return
    }

    const overId = over?.id

    if (overId == null) {
      setActiveId(null)
      return
    }

    const overContainer = findContainer(overId)

    if (overContainer != null) {
      const activeIndex = items[activeContainer].indexOf(active.id)
      const overIndex = items[overContainer].indexOf(overId)

      if (activeIndex !== overIndex)
        console.log("asdfasdfas", items[overContainer].length > 5)
      setItems((items) =>
        items[overContainer].length > 5
          ? items
          : {
              ...items,
              [overContainer]: arrayMove(
                items[overContainer],
                activeIndex,
                overIndex
              ),
            }
      )
    }

    setActiveId(null)
  }
}

export default EventPage

function createRange<T = number>(
  length: number,
  initializer: (index: number) => T
): T[] {
  return [...new Array(length)].map((_, index) => initializer(index))
}
