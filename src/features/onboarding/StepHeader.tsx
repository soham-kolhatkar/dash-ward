import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { ease } from '@/lib/motion'
import { STEPS } from './config'

export function StepHeader({ step, title, accent, children }: { step: number; title: string; accent?: string; children?: ReactNode }) {
  const meta = STEPS[step]
  const Icon = meta.icon
  return (
    <div className="mb-8 sm:mb-10">
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: ease.outExpo, delay: 0.05 }}
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 py-1 pr-3 pl-1 text-xs text-fg-muted backdrop-blur"
      >
        <span className="flex size-5 items-center justify-center rounded-full bg-accent/15 text-accent">
          <Icon className="size-3" />
        </span>
        <span className="font-mono tracking-wider text-fg-subtle">{String(step + 1).padStart(2, '0')}</span>
        {meta.title}
      </motion.p>
      <h1 className="text-[1.9rem] leading-[1.08] font-semibold tracking-[-0.035em] text-balance sm:text-[2.6rem]">
        {title}{' '}
        {accent && <span className="font-serif font-normal tracking-[-0.01em] italic text-gradient">{accent}</span>}
      </h1>
      {children && <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-pretty text-fg-muted">{children}</p>}
    </div>
  )
}

/** Stagger helper for step content blocks. */
export function Block({ i = 0, children, className }: { i?: number; children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: ease.outExpo, delay: 0.1 + i * 0.07 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
