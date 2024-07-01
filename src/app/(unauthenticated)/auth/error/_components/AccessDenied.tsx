import { ShieldAlert } from "lucide-react"
import Link from "next/link"

function AccessDeniedMessage() {
  return (
    <>
      <header className="relative z-10 flex w-full flex-col items-center gap-4 sm:flex-row">
        <ShieldAlert className="shrink-0" size={48} />
        <h1 className="text-center text-3xl font-semibold drop-shadow sm:text-left">
          Oops, algo deu errado!
        </h1>
      </header>

      <div className="relative z-10 flex flex-col gap-4 text-left">
        <p>Você ainda não está autorizado a acessar a nossa plataforma.</p>

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
    </>
  )
}
export { AccessDeniedMessage }
