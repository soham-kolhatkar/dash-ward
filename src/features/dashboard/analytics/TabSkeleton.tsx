import { Skeleton } from '@/components/ui/misc'

export function TabSkeleton({ tab }: { tab: string }) {
  if (tab === 'retention')
    return (
      <div className="space-y-4">
        <Skeleton className="h-[108px] rounded-2xl" />
        <Skeleton className="h-[460px] rounded-2xl" />
      </div>
    )
  if (tab === 'engagement')
    return (
      <div className="space-y-4">
        <Skeleton className="h-[320px] rounded-2xl" />
        <Skeleton className="h-[380px] rounded-2xl" />
      </div>
    )
  return (
    <div className="space-y-4">
      <Skeleton className="h-[108px] rounded-2xl" />
      <div className="grid grid-cols-12 gap-4">
        <Skeleton className="col-span-12 h-[380px] rounded-2xl xl:col-span-8" />
        <Skeleton className="col-span-12 h-[380px] rounded-2xl xl:col-span-4" />
      </div>
      <Skeleton className="h-[300px] rounded-2xl" />
    </div>
  )
}
