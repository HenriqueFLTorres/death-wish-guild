"use client"

import { Content, List, Root, Trigger } from "@radix-ui/react-tabs"
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react"

import { cn } from "@/lib/utils"

const Tabs = Root

const TabsList = forwardRef<
  ElementRef<typeof List>,
  ComponentPropsWithoutRef<typeof List>
>(({ className, ...props }, ref) => (
  <List
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-neutral-800 p-1 text-neutral-100",
      className
    )}
    ref={ref}
    {...props}
  />
))
TabsList.displayName = List.displayName

const TabsTrigger = forwardRef<
  ElementRef<typeof Trigger>,
  ComponentPropsWithoutRef<typeof Trigger>
>(({ className, ...props }, ref) => (
  <Trigger
    className={cn(
      "focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-neutral-100 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100 data-[state=active]:shadow",
      className
    )}
    ref={ref}
    {...props}
  />
))
TabsTrigger.displayName = Trigger.displayName

const TabsContent = forwardRef<
  ElementRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ className, ...props }, ref) => (
  <Content
    className={cn(
      "focus-visible:ring-ring mt-2 ring-offset-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      className
    )}
    ref={ref}
    {...props}
  />
))
TabsContent.displayName = Content.displayName

export { Tabs, TabsContent, TabsList, TabsTrigger }
