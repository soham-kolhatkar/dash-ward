import * as TabsPrimitive from '@radix-ui/react-tabs'
import { motion } from 'motion/react'
import { createContext, useContext, useId, type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

const TabsCtx = createContext<{ value?: string; id: string }>({ id: '' })

export function Tabs({ value, defaultValue, onValueChange, ...props }: ComponentPropsWithoutRef<typeof TabsPrimitive.Root>) {
  const id = useId()
  return (
    <TabsCtx.Provider value={{ value: value ?? defaultValue, id }}>
      <TabsPrimitive.Root value={value} defaultValue={defaultValue} onValueChange={onValueChange} {...props} />
    </TabsCtx.Provider>
  )
}

export function TabsList({ className, ...props }: ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn('inline-flex items-center gap-1 rounded-full border border-border bg-surface-2/60 p-1', className)}
      {...props}
    />
  )
}

/** Tab trigger with a shared-layout pill. Requires controlled `value` on <Tabs>. */
export function TabsTrigger({ className, value, children, ...props }: ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  const ctx = useContext(TabsCtx)
  const active = ctx.value === value
  return (
    <TabsPrimitive.Trigger
      value={value}
      className={cn(
        'relative rounded-full px-3.5 py-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-fg data-[state=active]:text-fg',
        className,
      )}
      {...props}
    >
      {active && (
        <motion.span
          layoutId={`tab-pill-${ctx.id}`}
          className="absolute inset-0 rounded-full border border-border bg-surface shadow-sm"
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-1.5 [&_svg]:size-4">{children}</span>
    </TabsPrimitive.Trigger>
  )
}

export const TabsContent = TabsPrimitive.Content
