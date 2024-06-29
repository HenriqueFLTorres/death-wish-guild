import { type UniqueIdentifier, useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Crown } from "lucide-react"
import type { CSSProperties } from "react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

interface PlayerLeaderProps {
  name: string
  id: UniqueIdentifier | null
  containerId: UniqueIdentifier
}

function PlayerLeader(props: PlayerLeaderProps) {
  const { id, containerId, name } = props

  if (id == null) return <LeaderPlaceholder />

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: {
        index: 0,
        containerId,
      },
    })
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
  }

  if (isDragging) return <LeaderPlaceholder />

  return (
    <div
      className="flex gap-2"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Avatar>
        <AvatarImage alt="" size={40} src="/avatar/variant-1.png" />
      </Avatar>
      <div className="flex flex-col text-left">
        <p className="text-xs text-neutral-400">Líder</p>
        <h4 className="text-with-gradient bg-gradient-to-b from-white to-neutral-300 text-sm font-bold">
          {name}
        </h4>
      </div>
    </div>
  )
}

function LeaderPlaceholder() {
  return (
    <div className="flex gap-2">
      <div className="grid h-10 w-10 place-items-center rounded-full border border-black/30 bg-black/20">
        <Crown size={20} />
      </div>
      <div className="flex flex-col text-left">
        <p className="text-xs text-neutral-400">Líder</p>
        <h4 className="text-with-gradient bg-gradient-to-b from-white to-neutral-300 text-sm font-bold">
          -
        </h4>
      </div>
    </div>
  )
}

export { PlayerLeader, LeaderPlaceholder }
