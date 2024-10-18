"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { SelectItemText } from "@radix-ui/react-select"
import { createInsertSchema } from "drizzle-zod"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { items } from "../../../../../supabase/migrations/schema"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { trpc } from "@/trpc-client/client"
import { traitsEnum } from "@/types/traits"

const itemSchema = createInsertSchema(items)
  .omit({
    id: true,
    name: true,
    trait: true,
    acquired_by: true,
    added_at: true,
  })
  .and(
    z.object({
      name: z.string(),
      trait: traitsEnum,
      acquired_by: z.string(),
    })
  )

type addItemFormData = z.infer<typeof itemSchema>

interface ItemFormProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export function ItemForm(props: ItemFormProps) {
  const addItem = trpc.items.addItem.useMutation({
    onSuccess: () => props.setIsOpen(false),
  })
  const { data: users } = trpc.user.getUsers.useQuery()

  const form = useForm<addItemFormData>({
    resolver: zodResolver(itemSchema),
  })

  const onSubmit = (data: addItemFormData) => {
    addItem.mutate(data)
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-y-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do item</FormLabel>
              <FormControl>
                <Input placeholder="Karnix's Netherbow" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="trait"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trait</FormLabel>

              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a trait do item" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {traitsEnum.options.sort().map((trait) => (
                    <SelectItem key={trait} label={trait} value={trait} />
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="acquired_by"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adquirido por</FormLabel>

              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o membro que adiquiriu o item" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users?.map((user) => (
                    <SelectItem key={user.id} label={user.name} value={user.id}>
                      <SelectItemText>
                        <Avatar fallbackText="" src={user.image} /> {user.name}
                      </SelectItemText>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="primary">
          Adicionar Item
        </Button>
      </form>
    </Form>
  )
}
