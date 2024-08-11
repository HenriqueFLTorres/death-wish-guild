import { ChevronsUpDown, Dices } from "lucide-react"
import Image from "next/image"

import type { Control } from "react-hook-form"
import type { z } from "zod"
import type { eventSchema } from "./CreateEvent"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn, toKebabCase } from "@/lib/utils"

interface SelectEventProps {
  control: Control<z.infer<typeof eventSchema>>
}

function SelectEvent(props: SelectEventProps) {
  const { control } = props

  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => {
        const hasPresetValue = ALL_POSSIBLE_OPTIONS.includes(field.value)

        return (
          <FormItem>
            <FormLabel>Evento</FormLabel>

            <Popover modal>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    className={cn(
                      "w-full",
                      field.value === "" && "text-muted-foreground"
                    )}
                    role="combobox"
                    variant="outline"
                  >
                    {hasPresetValue ? (
                      <Image
                        alt=""
                        height={24}
                        src={`/event-icon/${toKebabCase(field.value)}.png`}
                        width={24}
                      />
                    ) : (
                      <Dices />
                    )}
                    {field.value?.length > 0
                      ? field.value
                      : "Selecione um evento"}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput
                    className="h-9"
                    placeholder="Selecione ou escreva o nome do evento..."
                    onValueChange={(value) => field.onChange(value)}
                  />
                  <CommandList className="scrollbar">
                    <CommandEmpty>Evento não encontrado.</CommandEmpty>
                    <CommandGroup heading="Eventos Especiais">
                      {SPECIAL_EVENTS.map((option) => (
                        <CommandItem
                          key={option}
                          value={option}
                          onSelect={() => field.onChange(option)}
                        >
                          <Image
                            alt=""
                            height={24}
                            src={`/event-icon/${toKebabCase(option)}.png`}
                            width={24}
                          />
                          {option}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandGroup heading="Bosses Mundial">
                      {WORLD_BOSS_EVENTS.map((option) => (
                        <CommandItem
                          key={option}
                          value={option}
                          onSelect={() => field.onChange(option)}
                        >
                          <Image
                            alt=""
                            height={24}
                            src={`/event-icon/${toKebabCase(option)}.png`}
                            width={24}
                          />
                          {option}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandGroup heading="Eventos Dinâmicos">
                      {DYNAMIC_EVENTS.map((option) => (
                        <CommandItem
                          key={option}
                          value={option}
                          onSelect={() => field.onChange(option)}
                        >
                          <Image
                            alt=""
                            height={24}
                            src={`/event-icon/${toKebabCase(option)}.png`}
                            width={24}
                          />
                          {option}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandGroup heading="Field Bosses">
                      {FIELD_BOSS_EVENTS.map((option) => (
                        <CommandItem
                          key={option}
                          value={option}
                          onSelect={() => field.onChange(option)}
                        >
                          <Image
                            alt=""
                            height={24}
                            src={`/event-icon/${toKebabCase(option)}.png`}
                            width={24}
                          />
                          {option}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

export { SelectEvent }

export const DYNAMIC_EVENTS = [
  "Blood Mushroom Gathering",
  "Dark Destroyers",
  "Desert Caravan",
  "Festival of Fire",
  "Hidden Brown Mica",
  "Lantern Seed Festival",
  "Lift the Moonlight Spell",
  "Operation: Talisman Delivery",
  "Requiem of Light",
  "Starlight Stones Ritual",
  "Stop the Mana Frenzy",
  "Wolf Hunting Contest",
]

export const WORLD_BOSS_EVENTS = ["Courte's Wraith", "Desert Overlord"]

export const FIELD_BOSS_EVENTS = [
  "Adentus",
  "Ahzreil",
  "Aridus",
  "Chernobog",
  "Cornelius",
  "Excavator-9",
  "Grand Aelon",
  "Junobote",
  "Kowazan",
  "Malakar",
  "Minezerok",
  "Morokai",
  "Nirma",
  "Talus",
]

export const SPECIAL_EVENTS = ["Vienta Tax Delivery", "Stonegard Siege Warfare"]

export const ALL_POSSIBLE_OPTIONS = [
  ...DYNAMIC_EVENTS,
  ...WORLD_BOSS_EVENTS,
  ...FIELD_BOSS_EVENTS,
  ...SPECIAL_EVENTS,
]
