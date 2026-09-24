import { motion } from 'motion/react'
import type { Status } from '@/data/customers'
import { cn } from '@/lib/utils'
import { STATUS_META, healthColor } from './meta'

export function HealthRing({ value, size = 26, stroke = 3, showValue = true, className }: { value: number; size?: number; stroke?: number; showValue?: boolean; className?: string }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const color = healthColor(value)
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - value / 100) }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{ filter: `drop-shadow(0 0 3px color-mix(in oklch, ${color} 45%, transparent))` }}
        />
      </svg>
      {showValue && <span className="font-mono text-xs text-fg-muted tabular-nums">{value}</span>}
    </span>
  )
}

export function StatusLabel({ status, className }: { status: Status; className?: string }) {
  const m = STATUS_META[status]
  return (
    <span className={cn('inline-flex items-center gap-2 text-[13px] text-fg-muted', className)}>
      <span className="relative flex size-2">
        <span
          className="relative size-2 rounded-full"
          style={{ background: m.color, boxShadow: `0 0 0 3px color-mix(in oklch, ${m.color} 18%, transparent)` }}
        />
      </span>
      {m.label}
    </span>
  )
}
