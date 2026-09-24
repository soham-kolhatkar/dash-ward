import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import type { Billing } from './PlanCard'

const OPTIONS: { value: Billing; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
]

export function BillingToggle({ value, onChange }: { value: Billing; onChange: (b: Billing) => void }) {
  return (
    <div role="radiogroup" aria-label="Billing period" className="relative inline-flex items-center gap-1 rounded-full border border-border bg-surface/70 p-1 shadow-elevated backdrop-blur-xl">
      {OPTIONS.map((o) => {
        const active = value === o.value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'relative flex h-10 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors duration-300',
              active ? 'text-bg' : 'text-fg-muted hover:text-fg',
            )}
          >
            {active && (
              <motion.span
                layoutId="billing-pill"
                className="absolute inset-0 rounded-full bg-fg shadow-md"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{o.label}</span>
            {o.value === 'yearly' && (
              <span
                className={cn(
                  'relative rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors duration-300',
                  active ? 'bg-accent-3 text-[oklch(0.2_0.05_130)]' : 'bg-accent-3/15 text-[color-mix(in_oklch,var(--accent-3)_55%,var(--fg))]',
                )}
              >
                Save 20%
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
