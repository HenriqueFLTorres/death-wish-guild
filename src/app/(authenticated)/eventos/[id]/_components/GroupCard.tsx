import {
  type UniqueIdentifier,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Trash } from "lucide-react"
import type { CSSProperties } from "react"
import { PlayerLeader } from "./PlayerLeader"
import { PlayerListItem } from "./PlayerListItem"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { trpc } from "@/trpc-client/client"

interface DroppableProps {
  id: UniqueIdentifier | null
  index: number
  containerId: UniqueIdentifier
  children: React.ReactNode
  isLeader?: boolean
}

function Droppable(props: DroppableProps) {
  const { id, index, containerId, children, isLeader = false } = props

  if (id == null) return null

  const { isOver, setNodeRef } = useDroppable({
    id,
    data: {
      index,
      containerId,
    },
  })

  return (
    <li
      className={cn(
        "h-8 w-full rounded-full border border-dashed border-transparent transition-all duration-200",
        { "border-white/30 bg-white/10": isOver },
        { "h-10": isLeader }
      )}
      ref={setNodeRef}
    >
      {children}
    </li>
  )
}

interface DraggableProps {
  id: UniqueIdentifier | null
  index: number
  containerId: UniqueIdentifier
  className?: string
}

function Draggable(props: DraggableProps) {
  const { id, containerId, index, className } = props

  const { data: users = [] } = trpc.getUsers.useQuery()
  const currentUser = users.find((user) => user.id === id)

  if (id == null || currentUser == null) return null

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: {
        index,
        containerId,
      },
    })
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0 : 1,
  }

  return (
    <PlayerListItem
      class={currentUser.class}
      className={className}
      id={currentUser.id}
      image={currentUser.image}
      name={currentUser.name}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    />
  )
}

interface GroupCardProps {
  hasMe?: boolean
  items: (UniqueIdentifier | null)[]
  containerId: UniqueIdentifier
  onRemove: () => void
}

function GroupCard(props: GroupCardProps) {
  const { hasMe = false, items, containerId, onRemove } = props

  const groupSize = items.filter(Boolean).length
  const fullArray = Array.from(Array(6).keys())
  const leaderId = items[0]

  const { data: users = [] } = trpc.getUsers.useQuery()

  const leaderUser = users.find((user) => user.id === leaderId)

  return (
    <li
      className="flex h-full w-64 select-none flex-col gap-4 rounded border-2 border-black/30 bg-black/60 from-primary-700/40 to-primary-500/40 p-3 backdrop-blur-xl data-[hasme='true']:border-primary/50 data-[hasme='true']:bg-gradient-to-b"
      data-hasme={hasMe}
    >
      <div className="flex w-full justify-between">
        <h3 className="text-with-gradient bg-gradient-to-b from-white to-neutral-300 font-bold">
          {containerId} {hasMe ? "(Meu grupo)" : ""}
        </h3>

        <small>{groupSize === 6 ? "Cheio" : `${groupSize}/6`}</small>
      </div>

      <div className="flex items-center gap-2">
        <Droppable
          containerId={containerId}
          id={leaderId === null ? `${containerId}-0-droppable` : leaderId}
          index={0}
          isLeader
        >
          <PlayerLeader
            containerId={containerId}
            id={leaderId}
            image={leaderUser?.image ?? null}
            name={leaderUser?.name ?? ""}
          />
        </Droppable>

        <Button
          className="ml-auto"
          size="icon"
          variant="destructive"
          onClick={() => onRemove()}
        >
          <Trash size={16} />
        </Button>
      </div>

      <ol className="flex flex-col gap-1">
        {fullArray.slice(1).map((index) => {
          const value = items[index]
          const hasId = value != null

          return (
            <Droppable
              containerId={containerId}
              id={hasId ? value : `${containerId}-${index}-droppable`}
              index={index}
              key={hasId ? value : `${containerId}-${index}-droppable`}
            >
              {hasId ? (
                <Draggable
                  containerId={containerId}
                  id={value}
                  index={index}
                  key={value}
                />
              ) : null}
            </Droppable>
          )
        })}
      </ol>
    </li>
  )
}

export { Draggable, GroupCard }
