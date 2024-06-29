import {
  type UniqueIdentifier,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { useQuery } from "@tanstack/react-query"
import { Trash } from "lucide-react"
import type { CSSProperties } from "react"
import { getUserName } from "../page"
import { PlayerListItem } from "./PlayerListItem"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { USERS } from "@/lib/QueryKeys"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

interface DroppableProps {
  id: UniqueIdentifier | null
  index: number
  containerId: UniqueIdentifier
  children: React.ReactNode
}

function Droppable(props: DroppableProps) {
  const { id, index, containerId, children } = props

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
        "h-8 rounded-full border border-dashed border-transparent transition-all duration-200",
        { "border-white/30 bg-white/10": isOver }
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
  name: string
}

function Draggable(props: DraggableProps) {
  const { id, containerId, index, name } = props

  if (id == null) return null

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
      id={id}
      name={name}
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

  const groupSize = items.filter(Boolean).length + 1

  const fullArray = Array.from(Array(5).keys())

  const supabase = createClient()

  const { data: users = [] } = useQuery({
    queryKey: [USERS.GET_USERS],
    queryFn: async () => {
      const { data, error } = await supabase.from("users").select()

      if (error != null) throw new Error(`Failed to fetch event: ${error}`)

      return data
    },
  })

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
        <Avatar>
          <AvatarImage alt="" size={40} src="/avatar/variant-1.png" />
        </Avatar>
        <div className="flex flex-col text-left">
          <p className="text-xs text-neutral-400">Líder</p>
          <h4 className="text-with-gradient bg-gradient-to-b from-white to-neutral-300 text-sm font-bold">
            Alan Bida
          </h4>
        </div>

        <Button
          className="ml-auto"
          size={"icon"}
          variant="destructive"
          onClick={() => onRemove()}
        >
          <Trash size={16} />
        </Button>
      </div>

      <ol className="flex flex-col gap-1">
        {fullArray.map((index) => {
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
                  name={getUserName(value, users)}
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
