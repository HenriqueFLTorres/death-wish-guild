"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { format, startOfDay } from "date-fns"
import { createInsertSchema } from "drizzle-zod"
import { CalendarDays, CalendarIcon } from "lucide-react"
import moment from "moment"
import Image from "next/image"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import DateTimePicker from "@/components/ui/timer-picker"
import { useCreateEvent } from "@/db/hooks/events/useCreateEvent"
import { type InsertEvent, type SelectEvent, eventsTable } from "@/db/schema"

const eventSchema = createInsertSchema(eventsTable)
  .omit({ start_time: true, id: true })
  .and(
    z.object({
      startTime: z.object({ hour: z.number(), minute: z.number() }),
      startDate: z.date(),
    })
  )

function CreateEvent() {
  const [isOpen, setIsOpen] = useState(false)

  const { mutate } = useCreateEvent({ onSuccess: () => setIsOpen(false) })

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      startDate: startOfDay(new Date()),
      confirmed_players: [],
      confirmation_type: "PER_GROUP",
    },
  })

  function onSubmit(values: z.infer<typeof eventSchema>) {
    const { startTime, startDate, ...restEvent } = values
    const summedStartTime = moment(startDate).add(startTime).toDate()

    mutate({ ...restEvent, start_time: summedStartTime } as InsertEvent)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"}>Criar um evento</Button>
      </DialogTrigger>
      <DialogContent className="gap-6">
        <DialogTitle>
          <CalendarDays size={20} /> Criar um evento
        </DialogTitle>

        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evento</FormLabel>

                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um evento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EVENTS_OPTIONS.map((option) => (
                        <SelectItem key={option.name} value={option.name}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmation_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Confirmação</FormLabel>

                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tipo de confirmação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CONFIRMATION_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option === "PER_PLAYER"
                            ? "Por jogador"
                            : "Por grupo"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização</FormLabel>

                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Localização" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EVENTS_OPTIONS.map((option) => (
                          <SelectItem key={option.name} value={option.location}>
                            {option.location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Evento</FormLabel>

                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectContent>
                          <SelectItem value={"GUILD"}>
                            <Image
                              alt=""
                              className="shrink-0"
                              height={16}
                              src="/event-indicator/guild.png"
                              width={16}
                            />
                            Guild
                          </SelectItem>
                          <SelectItem value={"PVP"}>
                            <Image
                              alt=""
                              className="shrink-0"
                              height={16}
                              src="/event-indicator/battle.png"
                              width={16}
                            />
                            PVP
                          </SelectItem>
                          <SelectItem value={"PVE"}>
                            <Image
                              alt=""
                              className="shrink-0"
                              height={16}
                              src="/event-indicator/peace.png"
                              width={16}
                            />
                            PVE
                          </SelectItem>
                          <SelectItem value={"DOMINION_EVENT"}>
                            Dominion
                          </SelectItem>
                          <SelectItem value={"OTHER"}>Other</SelectItem>
                        </SelectContent>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de início</FormLabel>

                    <Popover>
                      <PopoverTrigger className="rounded-md border-secondary bg-secondary-600">
                        {field.value instanceof Date ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          mode="single"
                          selected={field.value}
                          initialFocus
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button className="w-full" type="submit">
              Criar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export { CreateEvent }

const CONFIRMATION_OPTIONS: SelectEvent["confirmation_type"][] = [
  "PER_PLAYER",
  "PER_GROUP",
]

const EVENTS_OPTIONS: Pick<SelectEvent, "name" | "location" | "type">[] = [
  {
    name: "Blood Mushroom Gathering",
    location: "Sandworm Lair",
    type: "GUILD",
  },
  {
    name: "Dark Destroyers",
    location: "Ruins of Turayne",
    type: "GUILD",
  },
  {
    name: "Desert Caravan",
    location: "Moonlight Desert",
    type: "PVE",
  },
  {
    name: "Lantern Seed Festival",
    location: "Nesting Grounds",
    type: "PVE",
  },
  {
    name: "Starlight Stones Ritual",
    location: "Urstella Fields",
    type: "PVE",
  },
  {
    name: "Stop the Mana Frenzy",
    location: "Manawastes",
    type: "PVE",
  },
  {
    name: "Wolf Hunting Contest",
    location: "Blackhowl Plains",
    type: "PVE",
  },
  {
    name: "Operation: Talisman Delivery",
    location: "Akidu Valley",
    type: "GUILD",
  },
  {
    name: "Chernobog",
    location: "Abandoned Stonemason Town",
    type: "PVP",
  },
  {
    name: "Excavator-9",
    location: "Monolith Wastelands",
    type: "PVP",
  },
  {
    name: "Kowazan",
    location: "Grayclaw Forest",
    type: "PVE",
  },
  {
    name: "Talus",
    location: "The Raging Wilds",
    type: "PVE",
  },
]
