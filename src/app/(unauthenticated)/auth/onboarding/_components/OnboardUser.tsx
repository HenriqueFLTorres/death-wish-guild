import { zodResolver } from "@hookform/resolvers/zod"
import { PartyPopperIcon, Rocket } from "lucide-react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { z } from "zod"
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

const onboardingSchema = z.object({
  class: z.enum(["DPS", "RANGED_DPS", "TANK", "SUPPORT"]),
  name: z.string(),
})

function OnboardUser() {
  const { data: session, update } = useSession()

  const { mutate } = trpc.completeOnboarding.useMutation({
    onSuccess: async () => {
      await update({ ...session, user: { ...session?.user, is_boarded: true } })
    },
  })

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      class: session?.user.class ?? "DPS",
      name: session?.user.name,
    },
  })

  const onSubmit = (values: z.infer<typeof onboardingSchema>) =>
    mutate({ userID: session?.user.id, ...values })

  return (
    <section className="relative flex w-full max-w-screen-sm flex-col items-center justify-center gap-8 overflow-hidden rounded-lg bg-gradient-to-b from-secondary-600/40 to-secondary-400/40 p-4 pb-4 drop-shadow-md backdrop-blur-md">
      <header className="relative z-10 flex w-full items-center gap-4">
        <PartyPopperIcon size={48} />
        <h1 className="text-left text-3xl font-semibold drop-shadow">
          Bem-vindo à Death Wish!
        </h1>
      </header>

      <div className="relative z-10 flex flex-col gap-4">
        <p className="text-left">
          Olá {session?.user.name}, falta muito pouco para você acessar a nossa
          plataforma, para isso, precisamos saber um pouco mais sobre você.
        </p>

        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome em jogo</FormLabel>

                  <Input value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classe principal</FormLabel>

                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="border-primary bg-primary-600 focus:ring-primary focus:ring-offset-0">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-primary bg-primary-600 [&>div>div:focus]:bg-primary-500">
                      <SelectItem label="DPS" value="DPS" />
                      <SelectItem label="RANGED_DPS" value="RANGED_DPS" />
                      <SelectItem label="SUPPORT" value="SUPPORT" />
                      <SelectItem label="TANK" value="TANK" />
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="relative z-10 w-full" type="submit">
              <Rocket />
              Estou pronto!
            </Button>
          </form>
        </Form>
      </div>

      <Image
        alt=""
        className="pointer-events-none absolute z-0 h-full w-full scale-125"
        height={600}
        src="/groups-decals-small.png"
        width={600}
      />
    </section>
  )
}

export { OnboardUser }
