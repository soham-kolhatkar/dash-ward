import { motion } from 'motion/react'
import { Inbox, Sparkle } from 'lucide-react'
import type { ReactNode } from 'react'

const sparkles = [
  { x: -46, y: -30, s: 14, d: 0 },
  { x: 50, y: -38, s: 10, d: 0.6 },
  { x: 58, y: 22, s: 12, d: 1.1 },
  { x: -54, y: 26, s: 9, d: 1.6 },
  { x: 4, y: -58, s: 8, d: 0.9 },
]

/** Animated "all caught up" illustration. */
export function InboxZero({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full flex-col items-center justify-center px-6 py-14 text-center"
    >
      <div className="relative mb-7 flex size-36 items-center justify-center">
        <motion.div
          className="absolute inset-3 rounded-full border border-dashed border-border-strong"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-8 rounded-full bg-accent/15 blur-2xl" />
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative flex size-16 items-center justify-center rounded-2xl border border-border bg-surface shadow-elevated"
        >
          <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,color-mix(in_oklch,var(--accent)_16%,transparent),transparent_60%)]" />
          <Inbox className="relative size-7 text-accent" strokeWidth={1.75} />
          <motion.span
            className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-success text-[10px] font-bold text-white shadow-[0_0_0_3px_var(--surface)] dark:text-bg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 14, delay: 0.4 }}
          >
            0
          </motion.span>
        </motion.div>
        {sparkles.map((p, i) => (
          <motion.span
            key={i}
            className="absolute top-1/2 left-1/2 text-accent-2"
            style={{ x: p.x, y: p.y }}
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 90] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: p.d, ease: 'easeInOut' }}
          >
            <Sparkle style={{ width: p.s, height: p.s }} className="-translate-1/2 fill-current" />
          </motion.span>
        ))}
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-xs text-sm text-fg-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}
