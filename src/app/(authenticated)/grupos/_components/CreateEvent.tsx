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
import { events } from "@/../supabase/migrations/schema"
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
import type { SelectEvent } from "@/db/schema"
import { trpc } from "@/trpc-client/client"

export const eventSchema = createInsertSchema(events)
  .omit({ start_time: true, id: true, confirmed_players: true, groups: true })
  .and(
    z.object({
      start_time: z.object({ hour: z.number(), minute: z.number() }),
      start_date: z.date(),
    })
  )

function CreateEvent() {
  const [isOpen, setIsOpen] = useState(false)

  const { mutate } = trpc.createEvent.useMutation({
    onSuccess: () => setIsOpen(false),
  })

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      start_date: startOfDay(new Date()),
      confirmation_type: "PER_GROUP",
    },
  })

  function onSubmit(values: z.infer<typeof eventSchema>) {
    const { start_time, start_date, ...restEvent } = values
    const summedStartTime = moment(start_date).add(start_time).toDate()

    mutate({
      ...restEvent,
      start_time: summedStartTime,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Criar um evento</Button>
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
                name="confirmation_type"
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
                          <SelectItem value="GUILD">
                            <Image
                              alt=""
                              className="shrink-0"
                              height={16}
                              src="/event-indicator/guild.png"
                              width={16}
                            />
                            Guild
                          </SelectItem>
                          <SelectItem value="PVP">
                            <Image
                              alt=""
                              className="shrink-0"
                              height={16}
                              src="/event-indicator/battle.png"
                              width={16}
                            />
                            PVP
                          </SelectItem>
                          <SelectItem value="PVE">
                            <Image
                              alt=""
                              className="shrink-0"
                              height={16}
                              src="/event-indicator/peace.png"
                              width={16}
                            />
                            PVE
                          </SelectItem>
                          <SelectItem value="DOMINION_EVENT">
                            Dominion
                          </SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
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
                name="start_date"
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
                name="start_time"
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

const EVENTS_OPTIONS: Pick<SelectEvent, "name" | "location" | "event_type">[] =
  [
    {
      name: "Blood Mushroom Gathering",
      location: "Sandworm Lair",
      event_type: "GUILD",
    },
    {
      name: "Dark Destroyers",
      location: "Ruins of Turayne",
      event_type: "GUILD",
    },
    {
      name: "Desert Caravan",
      location: "Moonlight Desert",
      event_type: "PVE",
    },
    {
      name: "Lantern Seed Festival",
      location: "Nesting Grounds",
      event_type: "PVE",
    },
    {
      name: "Starlight Stones Ritual",
      location: "Urstella Fields",
      event_type: "PVE",
    },
    {
      name: "Stop the Mana Frenzy",
      location: "Manawastes",
      event_type: "PVE",
    },
    {
      name: "Wolf Hunting Contest",
      location: "Blackhowl Plains",
      event_type: "PVE",
    },
    {
      name: "Operation: Talisman Delivery",
      location: "Akidu Valley",
      event_type: "GUILD",
    },
    {
      name: "Chernobog",
      location: "Abandoned Stonemason Town",
      event_type: "PVP",
    },
    {
      name: "Excavator-9",
      location: "Monolith Wastelands",
      event_type: "PVP",
    },
    {
      name: "Kowazan",
      location: "Grayclaw Forest",
      event_type: "PVE",
    },
    {
      name: "Talus",
      location: "The Raging Wilds",
      event_type: "PVE",
    },
  ]
