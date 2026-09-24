import * as SwitchPrimitive from '@radix-ui/react-switch'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export function Switch({ className, ...props }: ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-border bg-surface-3 p-0.5 transition-colors duration-300 data-[state=checked]:border-transparent data-[state=checked]:bg-accent',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="block size-4.5 rounded-full bg-white shadow-md transition-transform duration-300 ease-out-expo data-[state=checked]:translate-x-5" />
    </SwitchPrimitive.Root>
  )
}
