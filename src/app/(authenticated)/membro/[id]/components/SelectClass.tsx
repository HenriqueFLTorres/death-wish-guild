"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function SelectClass({ classUser }: { classUser: string }) {
  return (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={`${classUser}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="Suporte">Suporte</SelectItem>
          <SelectItem value="Tank">Tank</SelectItem>
          <SelectItem value="DPS Ranged">DPS Ranged</SelectItem>
          <SelectItem value="DPS">DPS</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export { SelectClass }
