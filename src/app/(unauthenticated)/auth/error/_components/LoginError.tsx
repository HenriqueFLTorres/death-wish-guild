import { Bug } from "lucide-react"

interface LoginErrorMessageProps {
  error: string
}

function LoginErrorMessage(props: LoginErrorMessageProps) {
  const { error } = props

  return (
    <>
      <header className="relative z-10 flex w-full flex-col items-center gap-4 sm:flex-row">
        <Bug className="shrink-0" size={48} />
        <h1 className="text-center text-3xl font-semibold drop-shadow sm:text-left">
          Oops, algo deu errado!
        </h1>
      </header>

      <div className="relative z-10 flex flex-col gap-4 text-left">
        <p>Parece que você encontrou um erro.</p>

        <p>Entre em contato com nossa staff através do nosso Discord.</p>

        <div className="flex flex-col gap-2">
          <p>Para desenvolvedores</p>

          <pre className="rounded border border-primary-400 bg-primary-600 px-3 py-1">
            <code>Error: {error}</code>
          </pre>
        </div>
      </div>
    </>
  )
}

export { LoginErrorMessage }
