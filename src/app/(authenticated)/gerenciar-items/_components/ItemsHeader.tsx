import { HeaderContext, Table, flexRender } from "@tanstack/react-table"
import { Backpack } from "lucide-react"
import { ItemType } from "../../_components/RecentDrops"
import { ItemModal } from "./ItemModal"
import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ItemsHeaderProps {
  table: Table<ItemType>
}

function ItemsHeader(props: ItemsHeaderProps) {
  const { table } = props

  return (
    <div className="flex items-center justify-end gap-2 border-b px-4 py-2">
      <div className="mr-auto flex items-center gap-2">
        <Backpack size={16} />
        <h1 className="text-base font-semibold">
          Items no Inventário da Guilda
        </h1>
      </div>
      <ColumnsToggler table={table} />
    </div>
  )
}

export { ItemsHeader }

interface ColumnsTogglerProps {
  table: Table<ItemType>
}

function ColumnsToggler(props: ColumnsTogglerProps) {
  const { table } = props

  return (
    <>
      <ItemModal />
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
                  undefined as unknown as HeaderContext<ItemType, unknown>
                )}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
