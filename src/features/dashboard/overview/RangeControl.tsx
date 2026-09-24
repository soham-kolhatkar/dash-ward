import { motion } from 'motion/react'
import { useId } from 'react'
import { RANGES, type Range } from '@/data/metrics'
import { cn } from '@/lib/utils'

/** Segmented control for date ranges with a sliding pill. */
export function RangeControl({ value, onChange, className }: { value: Range; onChange: (r: Range) => void; className?: string }) {
  const id = useId()
  return (
    <div
      role="radiogroup"
      aria-label="Date range"
      className={cn('inline-flex h-9 items-center rounded-full border border-border bg-surface-2/60 p-1 backdrop-blur', className)}
    >
      {RANGES.map((r) => {
        const active = r.value === value
        return (
          <button
            key={r.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={r.label}
            onClick={() => onChange(r.value)}
            className={cn(
              'relative h-7 rounded-full px-3 font-mono text-xs font-medium uppercase transition-colors',
              active ? 'text-fg' : 'text-fg-subtle hover:text-fg-muted',
            )}
          >
            {active && (
              <motion.span
                layoutId={`range-pill-${id}`}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-full border border-border bg-surface shadow-sm dark:bg-surface-3"
              />
            )}
            <span className="relative">{r.value}</span>
          </button>
        )
      })}
    </div>
  )
}
