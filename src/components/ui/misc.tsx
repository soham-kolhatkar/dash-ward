import type { HTMLAttributes, ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('skeleton rounded-lg', className)} {...props} />
}

export function Separator({ className, vertical }: { className?: string; vertical?: boolean }) {
  return <div className={cn('shrink-0 bg-border', vertical ? 'h-full w-px' : 'h-px w-full', className)} />
}

export function Kbd({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-border bg-surface-2 px-1.5 font-mono text-[10px] font-medium text-fg-subtle',
        className,
      )}
      {...props}
    />
  )
}

export function Progress({ value, className, barClassName }: { value: number; className?: string; barClassName?: string }) {
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-surface-3', className)}>
      <motion.div
        className={cn('h-full rounded-full bg-gradient-brand', barClassName)}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, value)}%` }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col items-center justify-center px-6 py-16 text-center', className)}
    >
      <div className="relative mb-5">
        <div className="absolute inset-0 animate-pulse-ring rounded-2xl bg-accent/20" />
        <div className="relative flex size-14 items-center justify-center rounded-2xl border border-border bg-surface-2 text-accent shadow-elevated [&_svg]:size-6">
          {icon}
        </div>
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-fg-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}
