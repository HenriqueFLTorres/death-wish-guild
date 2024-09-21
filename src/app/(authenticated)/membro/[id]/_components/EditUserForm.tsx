import { UseFormReturn } from "react-hook-form"
import { z } from "zod"
import EditProfileField from "./EditProfileField"
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

interface EditUserFormProps {
  form: UseFormReturn<z.infer<typeof editProfileSchema>>
  onSubmit: (data: z.infer<typeof editProfileSchema>) => void
}

function EditUserForm(props: EditUserFormProps) {
  const { form, onSubmit } = props

  return (
    <Form {...form}>
      <form
        className="relative z-10 flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <EditProfileField
          description="Este nome será usado em rankings, organização de eventos, lances e logs. Use o mesmo do jogo."
          title="Nome de Exibição"
        >
          <Input {...form.register("name")} />
        </EditProfileField>
        <EditProfileField
          description="Você pode atualizar essa imagem com a sua atual imagem do discord ou pode fazer upload da imagem do seu personagem do jogo."
          title="Imagem do Perfil"
        >
          <Input {...form.register("image")} />
        </EditProfileField>

        <FormField
          control={form.control}
          name="class"
          render={({ field }) => (
            <EditProfileField
              description="Selecione a classe que você está jogando. Você não poderá receber drops ou fazer lances se trocou recentemente."
              title="Classe"
            >
              <Select defaultValue={field.value} onValueChange={field.onChange}>
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
  )
}

export { EditUserForm }

export const editProfileSchema = z.object({
  name: z.string(),
  image: z.string().url().nullish(),
  class: z.enum(["DPS", "RANGED_DPS", "SUPPORT", "TANK"]),
})
