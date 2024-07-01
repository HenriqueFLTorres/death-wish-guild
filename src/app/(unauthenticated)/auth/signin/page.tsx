"use client"

import { DoorOpen } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Discord } from "@/components/icons/Discord"
import { Button } from "@/components/ui/button"

function SignIn() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <section className="relative flex w-full max-w-screen-sm flex-col items-center justify-center gap-8 overflow-hidden rounded-lg bg-gradient-to-b from-secondary-600/40 to-secondary-400/40 p-4 pb-4 drop-shadow-md backdrop-blur-md">
        <header className="relative z-10 flex w-full items-center gap-4">
          <DoorOpen size={48} />
          <h1 className="text-left text-3xl font-semibold drop-shadow">
            Entrar na plataforma
          </h1>
        </header>

        <div className="relative z-10 flex flex-col gap-4 text-left">
          <p>
            Caso você não tenha permissão para fazer login em nossa plataforma,
            entre em contato com nossa equipe para maiores orientações.
          </p>

          <p>
            Certifique-se de que nossos administradores tenham seu{" "}
            <strong>ID de usuário do Discord</strong> para você se registrar em
            nossa plataforma.
          </p>

          <div className="flex flex-col gap-2">
            <p>Para mais ajuda</p>

            <ul className="flex list-disc flex-col pl-6">
              <li>
                <Link
                  className="underline"
                  href="https://support.discord.com/hc/pt-br/articles/206346498-Onde-posso-encontrar-minhas-IDs-de-Usu%C3%A1rio-Servidor-Mensagem"
                  passHref
                >
                  Onde posso encontrar meu ID de Usuário do Discord
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Button
          className="relative z-10 w-full"
          onClick={() => signIn("discord")}
        >
          <Discord />
          Acessar com o Discord
        </Button>

        <Image
          alt=""
          className="pointer-events-none absolute z-0 h-full w-full scale-125"
          height={600}
          src="/groups-decals-small.png"
          width={600}
        />
      </section>
    </main>
  )
}

export default SignIn
