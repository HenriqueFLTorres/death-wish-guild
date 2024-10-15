"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { createInsertSchema } from "drizzle-zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { item } from "../../../../../supabase/migrations/schema"
import { Button } from "@/components/ui/button"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { trpc } from "@/trpc-client/client"
import { traitsEnum } from "@/types/traits"

const itemSchema = createInsertSchema(item)
  .omit({
    id: true,
    name: true,
    trait: true,
    added_at: true,
  })
  .and(
    z.object({
      name: z.string(),
      trait: traitsEnum,
    })
  )

type addItemFormData = z.infer<typeof itemSchema>

export function ItemForm() {
  const addItem = trpc.items.addItem.useMutation()

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
              <FormDescription>
                Nome do item para ser adicionado.
              </FormDescription>
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
                  {traitsEnum.options.map((trait) => (
                    <SelectItem key={trait} label={trait} value={trait} />
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="outline">
          Adicionar Item
        </Button>
      </form>
    </Form>
  )
}
