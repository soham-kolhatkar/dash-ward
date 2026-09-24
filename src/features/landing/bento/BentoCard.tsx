import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { SpotlightCard } from '@/components/fx'
import { fadeUp } from '@/lib/motion'
import { cn } from '@/lib/utils'

export function BentoCard({
  title,
  description,
  icon,
  children,
  className,
  bodyClassName,
  glow,
  textBottom,
}: {
  title: string
  description: string
  icon: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
  glow?: string
  textBottom?: boolean
}) {
  const text = (
    <div className="relative z-10 p-6 sm:p-7">
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-xl border border-border bg-surface-2 text-fg shadow-sm [&_svg]:size-4">
          {icon}
        </span>
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      </div>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-fg-muted">{description}</p>
    </div>
  )
  return (
    <motion.div variants={fadeUp} className={cn('min-w-0', className)}>
      <SpotlightCard glow={glow} className="flex h-full flex-col">
        {!textBottom && text}
        <div className={cn('relative min-h-0 flex-1', bodyClassName)}>{children}</div>
        {textBottom && text}
      </SpotlightCard>
    </motion.div>
  )
}
