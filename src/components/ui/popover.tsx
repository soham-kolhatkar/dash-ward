import * as PopoverPrimitive from '@radix-ui/react-popover'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'
import { popoverSurface } from './dropdown'

export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger

export function PopoverContent({
  className,
  sideOffset = 8,
  align = 'end',
  ...props
}: ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        sideOffset={sideOffset}
        align={align}
        className={cn(popoverSurface, 'p-0', className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}
