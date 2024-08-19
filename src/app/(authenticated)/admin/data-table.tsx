"use client"

import { ScrollText, User } from "lucide-react"
import { tabledata } from "./tabledata"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function DataTable() {
  const color = (e: string) => {
    return e == "criacao" ? (
      <p className="w-fit rounded-md border border-green-700 bg-green-600/20 p-1 text-xs">
        Criação
      </p>
    ) : e == "alteracao" ? (
      <p className="w-fit rounded-md border border-yellow-700 bg-yellow-600/20 p-1 text-xs">
        Alteração
      </p>
    ) : e == "remocao" ? (
      <p className="w-fit rounded-md border border-red-700 bg-red-600/20 p-1 text-xs">
        Remoção
      </p>
    ) : (
      e == "finalizacao" && (
        <p className="w-fit rounded-md border border-cyan-700 bg-cyan-600/20 p-1 text-xs">
          Finalização
        </p>
      )
    )
  }
  return (
    <div className="flex w-full flex-col bg-secondary-600 text-neutral-50">
      <div className="text flex border border-b-black bg-secondary-600 p-3">
        <ScrollText className="m-1 my-auto size-4" />
        <h1 className="my-auto h-6 w-32 text-center">Logs da Guilda</h1>
        <div className="bg- right-0 ml-auto flex gap-3">
          <Select>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Usuário" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="test">test</SelectItem>
                <SelectItem value="test">test</SelectItem>
                <SelectItem value="test">test</SelectItem>
                <SelectItem value="test">test</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="usuarios">Usuário</SelectItem>
                <SelectItem value="leilao">Leilão</SelectItem>
                <SelectItem value="eventos">Eventos</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Ações" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="criacao">Criação</SelectItem>
                <SelectItem value="alteracao">Alteração</SelectItem>
                <SelectItem value="remocao">Remoção</SelectItem>
                <SelectItem value="finalizacao">Finalização</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Colunas" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="categoria">Categoria</SelectItem>
                <SelectItem value="acao">Ação</SelectItem>
                <SelectItem value="mensagem">Mensagem</SelectItem>
                <SelectItem value="descricao">Descrição</SelectItem>
                <SelectItem value="datahora">Data e Hora</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Table className="bg-secondary-600">
          <TableHeader>
            <TableRow>
              <TableHead>Categoria</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead className="w-[500px]">Mensagem</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Data e Hora</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tabledata.map((table) => (
              <TableRow key={table.id}>
                <TableCell className="flex gap-1">
                  <User className="size-5" />
                  Usuário
                </TableCell>
                <TableCell>{color(table.acao)}</TableCell>
                <TableCell>{table.mensagem}</TableCell>
                <TableCell>{table.descrição}</TableCell>
                <TableCell className="text-right">{table.data}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
