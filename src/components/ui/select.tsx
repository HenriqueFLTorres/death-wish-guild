"use client"

import {
  Content,
  Group,
  Icon,
  Item,
  ItemIndicator,
  ItemText,
  Label,
  Portal,
  Root,
  Separator,
  Trigger,
  Value,
  Viewport,
} from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
} from "react"

import { cn } from "@/lib/utils"

const Select = Root

const SelectGroup = Group

const SelectValue = Value

const SelectTrigger = forwardRef<
  ElementRef<typeof Trigger>,
  ComponentPropsWithoutRef<typeof Trigger>
>(({ className, children, ...props }, ref) => (
  <Trigger
    className={cn(
      "flex h-10 w-full items-center gap-2 rounded-md border border-secondary bg-secondary-600 px-3 py-2 text-sm ring-offset-neutral-500 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
    <Icon asChild>
      <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
    </Icon>
  </Trigger>
))
SelectTrigger.displayName = Trigger.displayName

const SelectContent = forwardRef<
  ElementRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <Portal>
    <Content
      className={cn(
        "scrollbar relative z-50 max-h-96 min-w-[8rem] overflow-auto rounded-md border border-secondary-400 bg-secondary-600 text-neutral-50 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      ref={ref}
      {...props}
    >
      <Viewport
        className={cn(
          "scrollbar overflow-auto p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </Viewport>
    </Content>
  </Portal>
))
SelectContent.displayName = Content.displayName

const SelectLabel = forwardRef<
  ElementRef<typeof Label>,
  ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => (
  <Label
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    ref={ref}
    {...props}
  />
))
SelectLabel.displayName = Label.displayName

const SelectItem = forwardRef<
  ElementRef<typeof Item>,
  ComponentPropsWithoutRef<typeof Item> & { label?: string }
>(({ className, children, label, ...props }, ref) => (
  <Item
    className={cn(
      "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-neutral-800 focus:text-neutral-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ItemIndicator>
        <Check className="h-4 w-4" />
      </ItemIndicator>
    </span>

    {label == null ? children : <ItemText>{label}</ItemText>}
  </Item>
))
SelectItem.displayName = Item.displayName

const SelectSeparator = forwardRef<
  ElementRef<typeof Separator>,
  ComponentPropsWithoutRef<typeof Separator>
>(({ className, ...props }, ref) => (
  <Separator
    className={cn("-mx-1 my-1 h-px bg-neutral-100", className)}
    ref={ref}
    {...props}
  />
))
SelectSeparator.displayName = Separator.displayName

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
