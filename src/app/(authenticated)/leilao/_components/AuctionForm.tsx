"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormDescription,
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
import {} from "@/components/ui/select"
import DateTimePicker from "@/components/ui/timer-picker"
import { trpc } from "@/trpc-client/client"
import { classesEnum } from "@/types/classes"
import { zodResolver } from "@hookform/resolvers/zod"
import { createInsertSchema } from "drizzle-zod"
import { CalendarIcon } from "lucide-react"
import moment from "moment"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { auctions } from "../../../../../supabase/migrations/schema"

const auctionSchema = createInsertSchema(auctions)
  .omit({
    id: true,
    item_id: true,
    class_type: true,
    initial_bid: true,
    current_max_bid: true,
    start_time: true,
    end_time: true,
    created_at: true,
  })
  .and(
    z.object({
      item_id: z.string(),
      class_type: z.array(classesEnum),
      initial_bid: z.number(),
      start_date: z.date(),
      end_date: z.date(),
      start_time: z.object({ hour: z.number(), minute: z.number() }),
      end_time: z.object({ hour: z.number(), minute: z.number() }),
    })
  )

type newAuctionFormData = z.infer<typeof auctionSchema>

interface AuctionFormProps {
  item_id: string
}

export function AuctionForm(props: AuctionFormProps) {
  const newAuction = trpc.auctions.createAuction.useMutation()

  const form = useForm<newAuctionFormData>({
    resolver: zodResolver(auctionSchema),
    defaultValues: {
      item_id: props.item_id,
      class_type: ["DPS"],
    },
  })

  const onSubmit = (data: newAuctionFormData) => {
    const { start_time, start_date, end_time, end_date, ...restEvent } = data
    const summedStartTime = moment(start_date).add(start_time).toISOString()
    const summedEndTime = moment(end_date).add(end_time).toISOString()

    newAuction.mutate({
      ...restEvent,
      start_time: summedStartTime,
      end_time: summedEndTime,
    })
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="class_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex flex-row text-left">
                Classes permitidias
              </FormLabel>

              <FormDescription>
                classes selecionadas: {field.value.toString()}
              </FormDescription>

              <DropdownMenu>
                <DropdownMenuTrigger
                  className={buttonVariants({ variant: "outline" })}
                >
                  Selecionar classes
                </DropdownMenuTrigger>

                <DropdownMenuContent align="center">
                  {classesEnum.options.map((class_type) => (
                    <FormControl key={class_type}>
                      <DropdownMenuCheckboxItem
                        checked={field.value?.includes(class_type)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, class_type])
                            : field.onChange(
                                field.value?.filter(
                                  (value) => value !== class_type
                                )
                              )
                        }}
                        onSelect={(event) => event.preventDefault()}
                      >
                        {class_type}
                      </DropdownMenuCheckboxItem>
                    </FormControl>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="initial_bid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lance inicial</FormLabel>

              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)}
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
                    {field.value ? (
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
            )}
          />
        </div>
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de término</FormLabel>

                <Popover>
                  <PopoverTrigger className="rounded-md border-secondary bg-secondary-600">
                    {field.value ? (
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
            name="end_time"
            render={({ field }) => (
              <FormField
                control={form.control}
                name="end_time"
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
            )}
          />
        </div>
        <Button type="submit" variant="primary">
          Adicionar Item
        </Button>
      </form>
    </Form>
  )
}
