import type { UniqueIdentifier } from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { CSSProperties } from "react"
import { Items } from "../page"
import { PlayerListItem } from "./PlayerListItem"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

interface SortableItemProps {
  id: UniqueIdentifier
  isPlaceholder?: boolean
}

function SortableItem(props: SortableItemProps) {
  const { id, isPlaceholder = false } = props

  const { attributes, listeners, setNodeRef, transform, transition, isOver } =
    useSortable({ id, disabled: isPlaceholder })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      className="h-8 rounded-full border border-dashed border-transparent transition-all duration-200 data-[isover='true']:border-white/30 data-[isover='true']:bg-white/10"
      data-isover={isOver}
    >
      <PlayerListItem
        id={id}
        isPlaceholder={isPlaceholder}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      />
    </li>
  )
}

interface GroupCardProps {
  hasMe?: boolean
  containerItems: (string | null)[]
  containerId: UniqueIdentifier
  REFERENCE_ITEMS: Items
}

function GroupCard(props: GroupCardProps) {
  const { hasMe = false, containerItems, containerId, REFERENCE_ITEMS } = props

  const membersInGroup = 6

  return (
    <li
      className="flex h-full w-64 select-none flex-col gap-4 rounded border-2 border-black/30 bg-black/60 from-primary-700/40 to-primary-500/40 p-3 backdrop-blur-xl data-[hasme='true']:border-primary/50 data-[hasme='true']:bg-gradient-to-b"
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

      <SortableContext
        id={containerId}
        items={containerItems}
        strategy={verticalListSortingStrategy}
      >
        <ol className="flex flex-col gap-1">
          {containerItems.map((value) =>
            REFERENCE_ITEMS[containerId].includes(value) ? (
              <SortableItem id={value} key={value} />
            ) : (
              <SortableItem id={value} key={value} isPlaceholder />
            )
          )}
        </ol>
      </SortableContext>
    </li>
  )
}

export { GroupCard, SortableItem }
