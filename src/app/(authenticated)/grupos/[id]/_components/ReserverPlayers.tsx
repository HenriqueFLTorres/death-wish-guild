import type { UniqueIdentifier } from "@dnd-kit/core"
import { Draggable } from "./GroupCard"
import { Badge } from "@/components/ui/badge"

interface ReservePlayersProps {
  RESERVE_PLAYERS: (UniqueIdentifier | null)[]
}

function ReservePlayers(props: ReservePlayersProps) {
  const { RESERVE_PLAYERS } = props

  return (
    <div className="fixed bottom-12 flex gap-3 rounded border border-black/30 bg-black/60 px-4 py-2 backdrop-blur-md">
      {RESERVE_PLAYERS.slice(0, 3).map((id, index) => (
        <Draggable
          className="min-w-40"
          containerId="RESERVE_PLAYERS"
          id={id}
          index={index}
          key={id}
        />
      ))}
      {RESERVE_PLAYERS.length > 3 ? (
        <Badge>+{RESERVE_PLAYERS.length - 3}</Badge>
      ) : null}
    </div>
  )
}
export { ReservePlayers }
