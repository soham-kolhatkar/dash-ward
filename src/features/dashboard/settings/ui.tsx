import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/** Two-column settings block: title/description on the left, a card on the right. */
export function Section({
  title,
  description,
  children,
  footer,
  className,
  danger,
}: {
  title: ReactNode
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
  danger?: boolean
}) {
  return (
    <motion.section
      variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
      className={cn('grid gap-4 lg:grid-cols-[260px_1fr] lg:gap-10', className)}
    >
      <div className="lg:pt-1">
        <h2 className={cn('text-sm font-semibold', danger && 'text-danger')}>{title}</h2>
        {description && <p className="mt-1 text-[13px] leading-relaxed text-fg-muted">{description}</p>}
      </div>
      <Card className={cn('overflow-hidden', danger && 'border-danger/25')}>
        <div className="p-5 sm:p-6">{children}</div>
        {footer && (
          <div className="flex flex-col gap-3 border-t border-border bg-surface-2/40 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            {footer}
          </div>
        )}
      </Card>
    </motion.section>
  )
}

export function TabBody({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.07 } } }}
      className="space-y-8 sm:space-y-10"
    >
      {children}
    </motion.div>
  )
}

export function Row({ icon, title, description, control, className }: { icon?: ReactNode; title: ReactNode; description?: ReactNode; control: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0', className)}>
      <div className="flex min-w-0 gap-3">
        {icon && (
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-2 text-fg-muted [&_svg]:size-4">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <div className="text-sm font-medium">{title}</div>
          {description && <div className="mt-0.5 text-[13px] text-fg-muted">{description}</div>}
        </div>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  )
}
