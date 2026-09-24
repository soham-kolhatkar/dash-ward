import { Skeleton } from '@/components/ui/misc'

/** Generic dashboard-page placeholder used as the route Suspense fallback. */
export function PageSkeleton() {
  return (
    <div aria-busy className="animate-[fade-in_.4s_ease-out]">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div className="space-y-2.5">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-80 max-w-[70vw]" />
        </div>
        <Skeleton className="hidden h-9 w-48 rounded-full sm:block" />
      </div>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Skeleton className="h-80 rounded-2xl xl:col-span-2" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    </div>
  )
}
