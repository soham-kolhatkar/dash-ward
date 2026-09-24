import { AnimatePresence, motion } from 'motion/react'
import { Check } from 'lucide-react'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { STEPS } from './config'

/** Vertical rail with a filling line (desktop). */
export function ProgressRail({ step, onJump }: { step: number; onJump: (n: number) => void }) {
  const pct = step / (STEPS.length - 1)
  return (
    <nav aria-label="Onboarding progress" className="relative">
      <div aria-hidden className="absolute top-5 bottom-5 left-[19px] w-px bg-border-strong" />
      <motion.div
        aria-hidden
        className="absolute top-5 left-[19px] w-px origin-top bg-gradient-to-b from-accent via-accent-2 to-accent-3 shadow-[0_0_12px_var(--accent)]"
        style={{ height: 'calc(100% - 2.5rem)' }}
        initial={false}
        animate={{ scaleY: pct }}
        transition={{ duration: 0.8, ease: ease.outExpo }}
      />
      <ol className="relative space-y-2">
        {STEPS.map((s, i) => {
          const done = i < step
          const active = i === step
          return (
            <li key={s.id}>
              <button
                type="button"
                disabled={i > step}
                onClick={() => onJump(i)}
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'group flex w-full items-center gap-4 rounded-2xl py-2 pr-3 text-left transition-colors',
                  i <= step && 'hover:bg-surface-2/60',
                  'disabled:cursor-default',
                )}
              >
                <span
                  className={cn(
                    'relative flex size-10 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-all duration-500',
                    active && 'border-accent bg-surface text-accent shadow-glow',
                    done && 'border-transparent bg-fg text-bg',
                    !active && !done && 'border-border-strong bg-bg text-fg-subtle',
                  )}
                >
                  {active && <span className="absolute inset-0 animate-pulse-ring rounded-full border border-accent/60" />}
                  <AnimatePresence mode="popLayout" initial={false}>
                    {done ? (
                      <motion.span
                        key="done"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                      >
                        <Check className="size-4" strokeWidth={3} />
                      </motion.span>
                    ) : (
                      <motion.span key="n" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                        <s.icon className="size-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                <span className="min-w-0">
                  <span className={cn('block text-sm font-medium transition-colors', active || done ? 'text-fg' : 'text-fg-subtle')}>{s.title}</span>
                  <span className="block truncate text-xs text-fg-subtle">{s.hint}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/** Segmented bar (mobile/tablet). */
export function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex gap-1.5" aria-hidden>
      {STEPS.map((s, i) => (
        <div key={s.id} className="relative h-1 flex-1 overflow-hidden rounded-full bg-border-strong">
          <motion.div
            className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-accent to-accent-2"
            initial={false}
            animate={{ scaleX: i < step ? 1 : i === step ? 0.5 : 0 }}
            transition={{ duration: 0.6, ease: ease.outExpo }}
          />
        </div>
      ))}
    </div>
  )
}
