import { motion } from 'motion/react'
import { useId } from 'react'
import { cn } from '@/lib/utils'

export interface PillOption<T extends string> {
  value: T
  label: string
  count?: number
  dot?: string
}

/** Segmented filter chips with a shared-layout active pill. */
export function PillTabs<T extends string>({
  value,
  onChange,
  options,
  className,
  size = 'md',
  label,
}: {
  value: T
  onChange: (v: T) => void
  options: PillOption<T>[]
  className?: string
  size?: 'sm' | 'md'
  label?: string
}) {
  const id = useId()
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        'scrollbar-none inline-flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full border border-border bg-surface-2/60 p-1',
        className,
      )}
    >
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'relative shrink-0 rounded-full font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring',
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-[13px]',
              active ? 'text-fg' : 'text-fg-muted hover:text-fg',
            )}
          >
            {active && (
              <motion.span
                layoutId={`pill-${id}`}
                className="absolute inset-0 rounded-full border border-border bg-surface shadow-sm"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              {o.dot && <span className="size-1.5 rounded-full" style={{ background: o.dot }} />}
              {o.label}
              {o.count != null && (
                <span
                  className={cn(
                    'rounded-full px-1.5 font-mono text-[10px] tabular-nums transition-colors',
                    active ? 'bg-accent/12 text-accent' : 'bg-surface-3 text-fg-subtle',
                  )}
                >
                  {o.count}
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
