import type { UniqueIdentifier } from "@dnd-kit/core"
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { PlayerListItem } from "./PlayerListItem"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

interface SortableItemProps {
  id: UniqueIdentifier
}

function SortableItem(props: SortableItemProps) {
  const { id } = props

  const { attributes, listeners, setNodeRef, transform, transition, isOver } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      className="rounded-full border border-dashed border-transparent bg-opacity-0 transition-all duration-200 data-[isover='true']:border-white/30 data-[isover='true']:bg-white/10 data-[isover='true']:bg-opacity-100"
      data-isover={isOver}
    >
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <PlayerListItem />
      </div>
    </div>
  )
}

interface GroupCardProps {
  hasMe?: boolean
  containerItems: UniqueIdentifier[]
  containerId: UniqueIdentifier
}

function GroupCard(props: GroupCardProps) {
  const { hasMe = false, containerItems, containerId } = props

  const membersInGroup = containerItems.length + 1

  return (
    <li
      className="flex h-full w-64 flex-col gap-4 rounded border-2 border-black/30 bg-black/60 from-primary-700/40 to-primary-500/40 p-3 backdrop-blur-xl data-[hasme='true']:border-primary/50 data-[hasme='true']:bg-gradient-to-b"
      data-hasme={hasMe}
    >
      <div className="flex w-full justify-between">
        <h3 className="text-with-gradient bg-gradient-to-b from-white to-neutral-300 font-bold">
          Grupo 1 {hasMe ? "(Meu grupo)" : ""}
        </h3>

        <small>{membersInGroup === 6 ? "Cheio" : `${membersInGroup}/6`}</small>
      </div>

      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage alt="" size={40} src="/avatar/variant-1.png" />
        </Avatar>
        <div className="flex flex-col text-left">
          <p className="text-xs text-neutral-400">Líder</p>
          <h4 className="text-with-gradient bg-gradient-to-b from-white to-neutral-300 text-sm font-bold">
            Alan Bida
          </h4>
        </div>
      </div>

      <ol className="flex flex-col gap-1">
        <div className="flex flex-col gap-1">
          <DroppableContainer
            id={containerId}
            items={containerItems}
            key={containerId}
          >
            <SortableContext
              items={containerItems}
              strategy={rectSortingStrategy}
            >
              {containerItems.map((value) => (
                <SortableItem id={value} key={value} />
              ))}
            </SortableContext>
            {/* {Array.from(Array(Math.max(6 - membersInGroup, 0)).keys()).map(
              (index) => (
                <div
                  className="rounded-full border border-dashed border-transparent bg-opacity-0 transition-all duration-200 data-[isover='true']:border-white/30 data-[isover='true']:bg-white/10 data-[isover='true']:bg-opacity-100"
                  key={index}
                >
                  <div className="relative flex h-8 w-full items-center gap-2 overflow-hidden rounded-full border-2 border-black/10 bg-black/20 px-2 py-1" />
                </div>
              )
            )} */}
          </DroppableContainer>
        </div>
      </ol>
    </li>
  )
}

export { DroppableContainer, GroupCard, SortableItem }

interface DroppableContainerProps {
  id: UniqueIdentifier
  items: UniqueIdentifier[]
  children: React.ReactNode
}

function DroppableContainer(props: DroppableContainerProps) {
  const { id, items, children } = props

  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transition,
    transform,
  } = useSortable({
    id,
    data: {
      type: "container",
      children: items,
    },
    disabled: true,
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
      }}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  )
}
