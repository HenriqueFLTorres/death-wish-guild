"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { SelectItemText } from "@radix-ui/react-select"
import { createInsertSchema } from "drizzle-zod"
import { CalendarDays, CalendarIcon, Dices, User, Users } from "lucide-react"
import moment from "moment"
import Image from "next/image"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { SelectEvent } from "./SelectEvent"
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
import { Input } from "@/components/ui/input"
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
import { trpc } from "@/trpc-client/client"

export const eventSchema = createInsertSchema(events)
  .omit({
    start_time: true,
    id: true,
    confirmed_players: true,
    groups: true,
    points_for_completion: true,
  })
  .and(
    z.object({
      start_time: z.object({ hour: z.number(), minute: z.number() }),
      start_date: z.date(),
      points_for_completion: z.number().int().positive(),
    })
  )

function CreateEvent() {
  const [isOpen, setIsOpen] = useState(false)

  const utils = trpc.useUtils()
  const { mutate } = trpc.events.createEvent.useMutation({
    onSuccess: () => {
      utils.events.getEvents.invalidate()
      setIsOpen(false)
    },
  })

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      start_date: moment(new Date()).startOf("day").toDate(),
      confirmation_type: "PER_GROUP",
      event_type: "GUILD",
      points_for_completion: 0,
    },
  })

  function onSubmit(values: z.infer<typeof eventSchema>) {
    const { start_time, start_date, ...restEvent } = values
    const summedStartTime = moment(start_date).add(start_time).toISOString()

    mutate({
      ...restEvent,
      start_time: summedStartTime,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary-flat">
          <CalendarDays size={16} />
          Criar um evento
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-6">
        <DialogTitle>
          <CalendarDays size={20} /> Criar um evento
        </DialogTitle>

        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <SelectEvent control={form.control} />

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
                        {field.value === "PER_PLAYER" ? (
                          <User size={16} />
                        ) : (
                          <Users size={16} />
                        )}
                        <SelectValue placeholder="Selecione um tipo de confirmação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PER_PLAYER">
                        <User size={16} />
                        <SelectItemText>Por jogador</SelectItemText>
                      </SelectItem>
                      <SelectItem value="PER_GROUP">
                        <Users size={16} />
                        <SelectItemText>Por grupo</SelectItemText>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="event_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Evento</FormLabel>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        {field.value === "OTHER" ? (
                          <Dices size={16} />
                        ) : (
                          <Image
                            alt=""
                            className="shrink-0"
                            height={16}
                            src={`/event-indicator/${field.value?.toLowerCase()}.png`}
                            width={16}
                          />
                        )}
                        <SelectValue placeholder="Tipo de evento" />
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
                          <SelectItemText>Guilda</SelectItemText>
                        </SelectItem>
                        <SelectItem value="PVP">
                          <Image
                            alt=""
                            className="shrink-0"
                            height={16}
                            src="/event-indicator/pvp.png"
                            width={16}
                          />
                          <SelectItemText>PvP</SelectItemText>
                        </SelectItem>
                        <SelectItem value="PVE">
                          <Image
                            alt=""
                            className="shrink-0"
                            height={16}
                            src="/event-indicator/pve.png"
                            width={16}
                          />
                          <SelectItemText>PvE</SelectItemText>
                        </SelectItem>
                        <SelectItem value="OTHER">
                          <Dices size={16} />
                          <SelectItemText>Outro</SelectItemText>
                        </SelectItem>
                      </SelectContent>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="points_for_completion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pontos por Conclusão</FormLabel>

                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.currentTarget.valueAsNumber)
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

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
                          moment(field.value).format("MMMM Do, YYYY")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                          disabled={(date) =>
                            date < moment(new Date()).startOf("day").toDate()
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
              Criar Evento
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export { CreateEvent }
