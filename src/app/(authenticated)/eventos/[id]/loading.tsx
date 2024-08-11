import { Skeleton } from "@/components/ui/skeleton"

export default function EventPageLoading() {
  return (
    <div className="flex h-full w-full flex-col items-center gap-12 rounded-xl border border-neutral-800 bg-gradient-to-bl from-neutral-700/50 to-neutral-900 px-6 py-4 shadow-xl">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-9 w-72 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <Skeleton className="h-9 w-48 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      <Skeleton className="h-72 w-full max-w-96 rounded" />
    </div>
  )
}
