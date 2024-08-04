import { LucideIcon } from "lucide-react"
import { ReactNode } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface DashboardCardProps {
  title: string
  icon: LucideIcon
  children: ReactNode
  className?: string
}

function DashboardCard(props: DashboardCardProps) {
  const { title, icon: Icon, children, className } = props

  return (
    <section
      className={cn(
        "flex flex-col rounded-lg border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-900/50 text-neutral-100",
        className
      )}
    >
      <header className="flex items-center justify-center border-b border-solid border-neutral-800 p-3">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold leading-none">
          <Icon size={16} /> {title}
        </h2>
      </header>

      <ScrollArea>{children}</ScrollArea>
    </section>
  )
}

export { DashboardCard }
