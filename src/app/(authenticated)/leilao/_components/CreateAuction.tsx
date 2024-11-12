"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { SelectItemText } from "@radix-ui/react-select"
import { createInsertSchema } from "drizzle-zod"
import {
  ArrowBigDown,
  CalendarIcon,
  Cross,
  LucideIcon,
  Scale,
  Shield,
  Sword,
} from "lucide-react"
import moment from "moment"
import Image from "next/image"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { auctions } from "../../../../../supabase/migrations/schema"
import { ItemType } from "../../_components/RecentDrops"
import { RangedDPS } from "@/components/icons/RangedDPS"
import { Button, buttonVariants } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { classesEnum } from "@/types/classes"

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

export function CreateAuction() {
  const [isOpen, setIsOpen] = useState(false)

  const utils = trpc.useUtils()
  const { mutate } = trpc.auctions.createAuction.useMutation({
    onSettled: () => {
      utils.auctions.invalidate()
      setIsOpen(false)
      form.reset()
    },
  })
  const { data: items = [] } = trpc.items.getItems.useQuery()

  const form = useForm<z.infer<typeof auctionSchema>>({
    resolver: zodResolver(auctionSchema),
    defaultValues: {
      item_id: "",
      class_type: ["DPS"],
    },
  })

  function onSubmit(data: z.infer<typeof auctionSchema>) {
    const { start_time, start_date, end_time, end_date, ...restEvent } = data
    const summedStartTime = moment(start_date).add(start_time).toISOString()
    const summedEndTime = moment(end_date).add(end_time).toISOString()

    mutate({
      ...restEvent,
      start_time: summedStartTime,
      end_time: summedEndTime,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Scale size={16} /> Criar Leilão
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <DialogTitle>
            <Scale size={20} /> Criar Leilão
          </DialogTitle>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="class_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex flex-row text-left">
                    Classes permitidias
                  </FormLabel>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={buttonVariants({ variant: "outline" })}
                    >
                      {field.value.length === 0 ? (
                        "Nenhum"
                      ) : (
                        <div className="flex gap-4">
                          {field.value.map((userClass) => (
                            <ClassDisplay userClass={userClass} />
                          ))}
                        </div>
                      )}
                    </DropdownMenuTrigger>
                    <FormMessage />

                    <DropdownMenuContent
                      align="center"
                      className="flex flex-col"
                    >
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
                            <ClassDisplay userClass={class_type} />
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
              name="item_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selecionar Item </FormLabel>

                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Nenhum" />
                        <ItemDisplay id={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {items.map((item) => (
                        <SelectItem value={item.id}>
                          <ItemDisplay {...item} />
                          <SelectItemText></SelectItemText>
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
              name="initial_bid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lance inicial</FormLabel>

                  <Input
                    placeholder="10"
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
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de término</FormLabel>

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
            </div>
            <Button className="w-full" type="submit" variant="primary">
              Adicionar Lance
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
interface classProps {
  userClass: "DPS" | "RANGED_DPS" | "TANK" | "SUPPORT"
  Icon?: LucideIcon
  user?: string
  onlyIcon?: boolean
}

export function ClassDisplay({ userClass, onlyIcon }: classProps) {
  const ClassToIcon: Record<classProps["userClass"], LucideIcon> = {
    DPS: Sword,
    RANGED_DPS: ArrowBigDown,
    TANK: Shield,
    SUPPORT: Cross,
  }
  const ClassToText: Record<classProps["userClass"], string> = {
    DPS: "Melee DPS",
    RANGED_DPS: "Ranged DPS",
    TANK: "Tank",
    SUPPORT: "Healer",
  }

  const Icon = ClassToIcon[userClass]
  const user = ClassToText[userClass]
  return (
    <div className="flex items-center gap-2">
      {Icon === ArrowBigDown ? (
        <RangedDPS />
      ) : (
        <Icon className="fill-current" size={20} />
      )}
      {!onlyIcon && <p>{user}</p>}
    </div>
  )
}

function ItemDisplay({ id }: { id: ItemType["id"] }) {
  const { data } = trpc.items.getItem.useQuery({ itemID: id })
  if (data)
    return (
      <div className="flex items-center justify-center gap-2">
        <div className="relative grid h-6 w-6 shrink-0 place-items-center">
          <Image alt="" height={40} src="/item-frame.svg" width={40} />
          <Image
            alt=""
            className="absolute"
            height={40}
            src="/crossbow.webp"
            width={40}
          />
        </div>
        {data?.name}
      </div>
    )
}
