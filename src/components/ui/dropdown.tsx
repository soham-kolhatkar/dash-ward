import * as DM from '@radix-ui/react-dropdown-menu'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export const DropdownMenu = DM.Root
export const DropdownMenuTrigger = DM.Trigger
export const DropdownMenuGroup = DM.Group

export const popoverSurface =
  'z-50 min-w-44 overflow-hidden rounded-xl border border-border bg-surface/95 p-1 text-sm shadow-elevated backdrop-blur-xl data-[state=open]:animate-[pop-in_.2s_var(--ease-out-expo)] data-[state=closed]:animate-[pop-out_.12s_ease-in] origin-(--radix-popper-transform-origin)'

export function DropdownMenuContent({ className, sideOffset = 8, ...props }: ComponentPropsWithoutRef<typeof DM.Content>) {
  return (
    <DM.Portal>
      <DM.Content sideOffset={sideOffset} className={cn(popoverSurface, className)} {...props} />
    </DM.Portal>
  )
}

export function DropdownMenuItem({ className, ...props }: ComponentPropsWithoutRef<typeof DM.Item>) {
  return (
    <DM.Item
      className={cn(
        'flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-fg-muted outline-none select-none data-highlighted:bg-surface-2 data-highlighted:text-fg [&_svg]:size-4',
        className,
      )}
      {...props}
    />
  )
}

export function DropdownMenuLabel({ className, ...props }: ComponentPropsWithoutRef<typeof DM.Label>) {
  return <DM.Label className={cn('px-2.5 py-1.5 text-xs text-fg-subtle', className)} {...props} />
}

export function DropdownMenuSeparator({ className, ...props }: ComponentPropsWithoutRef<typeof DM.Separator>) {
  return <DM.Separator className={cn('my-1 h-px bg-border', className)} {...props} />
}
