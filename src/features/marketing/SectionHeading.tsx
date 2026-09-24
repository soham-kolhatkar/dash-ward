import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { TextReveal } from '@/components/fx'
import { fadeUp, inView } from '@/lib/motion'
import { cn } from '@/lib/utils'

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 font-mono text-[11px] font-medium tracking-[0.14em] text-fg-muted uppercase backdrop-blur',
        className,
      )}
    >
      <span className="relative flex size-1.5">
        <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative size-1.5 rounded-full bg-accent" />
      </span>
      {children}
    </span>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  align?: 'center' | 'left'
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-5', align === 'center' ? 'items-center text-center' : 'items-start', className)}>
      {eyebrow && (
        <motion.div variants={fadeUp} {...inView}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </motion.div>
      )}
      <TextReveal
        as="h2"
        className="max-w-4xl text-4xl leading-[1.02] font-semibold tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl"
      >
        {title}
      </TextReveal>
      {description && (
        <motion.p
          variants={fadeUp}
          {...inView}
          className={cn('max-w-2xl text-base leading-relaxed text-pretty text-fg-muted sm:text-lg', align === 'center' && 'mx-auto')}
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}

/** Serif italic accent word for editorial contrast inside sans headlines. */
export function Serif({ children, className }: { children: ReactNode; className?: string }) {
  return <em className={cn('pr-[0.06em] font-serif font-normal tracking-[-0.01em] italic', className)}>{children}</em>
}
