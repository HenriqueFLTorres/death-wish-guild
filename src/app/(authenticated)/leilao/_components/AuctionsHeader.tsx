import { HeaderContext, Table, flexRender } from "@tanstack/react-table"
import { Scale } from "lucide-react"
import { AuctionType } from "../page"
import { CreateAuction } from "./CreateAuction"
import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ItemsHeaderProps {
  table: Table<AuctionType>
}

function AuctionsHeader(props: ItemsHeaderProps) {
  const { table } = props

  return (
    <div className="flex items-center justify-end gap-2 border-b px-4 py-2">
      <div className="mr-auto flex items-center gap-2">
        <Scale />
        <h1 className="text-base font-semibold">Leilão da Guilda</h1>
      </div>
      <ColumnsToggler table={table} />
    </div>
  )
}

export { AuctionsHeader }

interface ColumnsTogglerProps {
  table: Table<AuctionType>
}

function ColumnsToggler(props: ColumnsTogglerProps) {
  const { table } = props
  const values = [
    { name: "Aberto", key: "OPEN" },
    { name: "Pendente", key: "OPEN" },
    { name: "Aguardando", key: "OPEN" },
    { name: "Finalizado", key: "FINISHED" },
    { name: "Cancelado", key: "CANCELED" },
  ]
  return (
    <>
      <CreateAuction />
      <DropdownMenu>
        <DropdownMenuTrigger className={buttonVariants({ variant: "outline" })}>
          Status
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {values.map((status) => (
            <DropdownMenuCheckboxItem
              checked={
                table.getColumn("status")?.getFilterValue() === status.key
              }
              className="capitalize"
              key={status.key}
              onSelect={() =>
                (table.getColumn("status")?.getFilterValue() as string) ===
                status.key
                  ? table.getColumn("status")?.setFilterValue("")
                  : table.getColumn("status")?.setFilterValue(status.key)
              }
            >
              {status.name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
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
                  undefined as unknown as HeaderContext<AuctionType, unknown>
                )}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
