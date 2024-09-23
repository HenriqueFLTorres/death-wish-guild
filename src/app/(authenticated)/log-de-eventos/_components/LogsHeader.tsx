import { HeaderContext, Table, flexRender } from "@tanstack/react-table"
import { ScrollText } from "lucide-react"
import { LogType } from "../../_components/LatestLogs"
import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface LogsHeaderProps {
  table: Table<LogType>
}

function LogsHeader(props: LogsHeaderProps) {
  const { table } = props

  return (
    <div className="flex items-center justify-end gap-2 border-b px-4 py-2">
      <div className="mr-auto flex items-center gap-2">
        <ScrollText size={16} />
        <h1 className="text-base font-semibold">Logs da Guilda</h1>
      </div>
      <ColumnsToggler table={table} />
    </div>
  )
}

export { LogsHeader }

interface ColumnsTogglerProps {
  table: Table<LogType>
}

function ColumnsToggler(props: ColumnsTogglerProps) {
  const { table } = props

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={buttonVariants({ variant: "outline" })}>
        Colunas
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem
              checked={column.getIsVisible()}
              className="capitalize"
              key={column.id}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
              onSelect={(event) => event.preventDefault()}
            >
              {flexRender(
                column.columnDef.header,
                undefined as unknown as HeaderContext<LogType, unknown>
              )}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
