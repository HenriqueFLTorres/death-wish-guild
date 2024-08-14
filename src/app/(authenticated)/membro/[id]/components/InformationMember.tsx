import { Camera, Copy } from "lucide-react"
import { SelectClass } from "./SelectClass"
import { getIconByClass } from "@/app/(authenticated)/grupos/[id]/_components/PlayerListItem"
import { Discord } from "@/components/icons/Discord"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SelectUser } from "@/db/schema"

function InformationMember({
  user,
  nameInput,
  setNameInput,
}: {
  user: SelectUser
  nameInput: string
  setNameInput: React.Dispatch<React.SetStateAction<string>>
}) {
  const Icon = getIconByClass(user.class)
  return (
    <>
      <div className="flex justify-between">
        {/*header do membro*/}
        <div className="flex gap-4">
          {" "}
          <Avatar
            fallbackText={user?.name}
            key={user?.image}
            size={92}
            src={user?.image}
          />
          <div>
            <h1 className="mb-1 text-xl font-semibold">{user?.name}</h1>
            <Badge variant="primary">{user?.role}</Badge>
            <div className="mt-4 flex items-center gap-2">
              {" "}
              <Icon className="fill-neutral-100" size={20} />
              <p className="text-sm">{user?.class}</p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex h-6 items-center justify-center gap-4">
            <div className="flex gap-2">
              <Discord /> <span className="text-sm">.treffy</span>
            </div>
            <div className="flex h-3 w-3 items-center justify-center rounded border border-neutral-700 bg-neutral-800 p-3">
              <button>
                <Copy size={12} />
              </button>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-right text-sm text-neutral-400">convidado por</p>
            <h1 className="mt-2 flex justify-end gap-2 font-semibold">
              <Avatar
                fallbackText={user?.name}
                key={user?.image}
                size={24}
                src={user?.image}
              />{" "}
              Snow
            </h1>
          </div>
        </div>
      </div>
      {/*fechamento do header*/}
      <div className="mt-14 space-y-6">
        <div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h2 className="font-semibold">Nome de Exibição</h2>
              <p className="text-xs text-neutral-400">
                Este nome será usado em rankings, organização de eventos, lances
                e logs. Use o mesmo do jogo.
              </p>
            </div>
            <Input
              className="h-9 border border-neutral-700 bg-neutral-900"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h2 className="font-semibold">Imagem do Perfil</h2>
              <p className="text-xs text-neutral-400">
                Você pode atualizar essa imagem com a sua atual imagem do
                discord ou pode fazer upload da imagem do seu personagem do
                jogo.
              </p>
            </div>
            <div className="space-y-4">
              <Button
                className="h-29 w-full border border-neutral-700 bg-neutral-800 py-1"
                variant="outline"
              >
                {" "}
                <Discord /> Usar imagem do Discord
              </Button>
              <Button
                className="h-29 w-full border border-neutral-700 bg-neutral-800 py-1"
                variant="outline"
              >
                {" "}
                <Camera size={20} /> Fazer um upload
              </Button>
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h2 className="font-semibold">Classe</h2>
              <p className="text-xs text-neutral-400">
                Selecione a classe que você está jogando. Você não poderá
                receber drops ou fazer lances se trocou recentemente.
              </p>
            </div>
            <div>
              <SelectClass classUser={user.class} />
            </div>
          </div>
        </div>
        <hr className="border-neutral-800" />
      </div>
    </>
  )
}

export { InformationMember }
