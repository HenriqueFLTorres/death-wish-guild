import { RefAttributes } from "react"
import {
  Button,
  Group,
  Input,
  Label,
  NumberField,
  NumberFieldProps,
} from "react-aria-components"

interface NumberInputProps
  extends NumberFieldProps,
    RefAttributes<HTMLDivElement> {
  label?: string
}

function NumberInput(props: NumberInputProps) {
  const { label } = props

  return (
    <NumberField {...props}>
      {label == null ? null : <Label>{label}</Label>}
      <Group className="flex h-8 w-full items-center justify-between rounded-md border border-neutral-700 bg-neutral-900 p-1 text-sm shadow-sm transition-colors placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-500 disabled:cursor-not-allowed disabled:opacity-50">
        <Button
          className="h-6 w-6 shrink-0 rounded transition-colors hover:bg-neutral-700 focus-visible:bg-neutral-700"
          slot="decrement"
        >
          -
        </Button>
        <Input className="h-full w-full bg-transparent px-1 text-center outline-none" />
        <Button
          className="h-6 w-6 shrink-0 rounded transition-colors hover:bg-neutral-700 focus-visible:bg-neutral-700"
          slot="increment"
        >
          +
        </Button>
      </Group>
    </NumberField>
  )
}

export { NumberInput }
