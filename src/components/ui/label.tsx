"use client"

import { Root } from "@radix-ui/react-label"
import { type VariantProps, cva } from "class-variance-authority"
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
} from "react"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium flex flex-col w-full gap-2 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = forwardRef<
  ElementRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <Root className={cn(labelVariants(), className)} ref={ref} {...props} />
))
Label.displayName = Root.displayName

export { Label, labelVariants }
