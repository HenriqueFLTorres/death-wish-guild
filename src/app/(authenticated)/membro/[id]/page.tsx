"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Copy } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { getIconByClass } from "../../eventos/[id]/_components/PlayerListItem"
import EditProfileField from "./_components/EditProfileField"
import { Discord } from "@/components/icons/Discord"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { translateGameClass } from "@/lib/utils"
import { trpc } from "@/trpc-client/client"

function Membro() {
  const { id } = useParams<{ id: string }>()

  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
  })

  const { reset, register, control } = form

  const { data: user } = trpc.getUser.useQuery(
    { userID: id },
    {
      onSuccess: (data) =>
        reset({
          class: data.class,
          display_name: data.display_name ?? "",
          image: data.image,
        }),
    }
  )

  const { mutate: updateUser } = trpc.updateUserInfo.useMutation()

  if (user == null) return null

  const ClassIcon = getIconByClass(user.class)

  const onSubmit = (data: z.infer<typeof editProfileSchema>) => updateUser(data)

  return (
    <section className="relative flex w-full max-w-3xl flex-col gap-8 overflow-hidden rounded-lg border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-900/50 p-4 text-neutral-100 shadow-xl">
      <div className="relative z-10 flex w-full gap-4">
        <Avatar
          className="[&>span]:text-xl"
          fallbackText={user.display_name}
          size={92}
          src={user.image}
        />
        <div className="flex flex-col gap-1">
          <h1 className="text-xl">{user?.display_name}</h1>
          <Badge className="w-max">{user?.role}</Badge>

          <span className="flex items-center gap-2 text-sm">
            <ClassIcon className="fill-white" />
            {translateGameClass(user.class)}
          </span>
        </div>

        <div className="ml-auto flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2">
              <Discord />
              {user.name}
            </span>
            <Button size="icon" variant="secondary-flat">
              <Copy size={16} />
            </Button>
          </div>
          <dl className="flex flex-col items-end gap-2 text-end">
            <dt className="text-sm text-neutral-400">convidado por</dt>
            <dt className="flex items-center gap-2 font-bold">
              <Avatar fallbackText="" size={24} src="/avatar/variant-1.png" />
              Snow
            </dt>
          </dl>
        </div>
      </div>

      <Image
        alt=""
        className="fade-to-bottom absolute w-full scale-110 object-cover opacity-50 blur-xl"
        height={200}
        src="/background-3.png"
        width={400}
      />

      <Form {...form}>
        <form
          className="relative z-10 flex flex-col gap-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <EditProfileField
            description="Este nome será usado em rankings, organização de eventos, lances e logs. Use o mesmo do jogo."
            title="Nome de Exibição"
          >
            <Input {...register("display_name")} />
          </EditProfileField>
          <EditProfileField
            description="Você pode atualizar essa imagem com a sua atual imagem do discord ou pode fazer upload da imagem do seu personagem do jogo."
            title="Imagem do Perfil"
          >
            <Input {...register("image")} />
          </EditProfileField>

          <FormField
            control={control}
            name="class"
            render={({ field }) => (
              <EditProfileField
                description="Selecione a classe que você está jogando. Você não poderá receber drops ou fazer lances se trocou recentemente."
                title="Classe"
              >
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      {translateGameClass(field.value)}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem label="DPS" value="DPS" />
                    <SelectItem label="Ranged DPS" value="RANGED_DPS" />
                    <SelectItem label="Support" value="SUPPORT" />
                    <SelectItem label="Tank" value="TANK" />
                  </SelectContent>
                </Select>
              </EditProfileField>
            )}
          />
          <Button type="submit" variant="primary-flat">
            Salvar
          </Button>
        </form>
      </Form>

      <hr className="border-neutral-800" />
    </section>
  )
}

export default Membro

const editProfileSchema = z.object({
  display_name: z.string(),
  image: z.string().url().nullish(),
  class: z.enum(["DPS", "RANGED_DPS", "SUPPORT", "TANK"]),
})
