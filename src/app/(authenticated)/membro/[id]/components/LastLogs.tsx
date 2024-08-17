import { User } from "lucide-react"

function LastLogs() {
  return (
    <div className="px-4 pb-4">
      <div className="mb-2 flex gap-1">
        <User size={16} />
        <p className="text-xs font-semibold">Usuario</p>
      </div>
      <div className="mb-3">
        <p>Treffy alterou seu nome de SpamTaxota para Treffy.</p>
      </div>
      <hr className="my-3 border-neutral-800" />
    </div>
  )
}

export { LastLogs }
