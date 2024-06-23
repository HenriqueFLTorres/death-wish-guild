import { Clock } from "lucide-react"
import {
  DateInput,
  DateSegment,
  FieldError,
  Label,
  Text,
  TimeField,
  type TimeValue,
} from "react-aria-components"
import "react-day-picker/dist/style.css"
import { labelVariants } from "./label"

import { cn } from "@/lib/utils"

interface DateTimePickerProps {
  onChange: (date: { minute: number; hour: number }) => void
  value: { minute: number; hour: number }
}

function DateTimePicker(props: DateTimePickerProps) {
  const { onChange, value } = props

  return (
    <TimeField
      className="flex w-full flex-col gap-2"
      hourCycle={24}
      value={value as TimeValue}
      onChange={onChange}
    >
      <Label className={cn(labelVariants())}>Horario</Label>
      <div
        className={
          "flex h-10 items-center justify-between gap-1 rounded-md border border-secondary bg-secondary-600 px-3 py-2"
        }
      >
        <DateInput className={"flex gap-1"}>
          {(segment) => (
            <DateSegment
              className="rounded p-1 text-sm outline-none focus-within:bg-neutral-600"
              segment={segment}
            />
          )}
        </DateInput>
        <Clock size={20} />
      </div>
      <Text slot="description" />
      <FieldError />
    </TimeField>
  )
}

export default DateTimePicker
