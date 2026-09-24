import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface BarListItem {
  name: string
  value: number
  icon?: ReactNode
  /** Rendered between the label and the value (e.g. a trend chip). */
  trailing?: ReactNode
}

/** Ranked list with proportional background bars: `<BarList items={[{ name, value }]} format={fmt.compact} />` */
export function BarList({
  items,
  format = (v) => v.toLocaleString('en-US'),
  color = 'var(--accent)',
  className,
  onSelect,
}: {
  items: BarListItem[]
  format?: (v: number) => ReactNode
  color?: string
  className?: string
  onSelect?: (item: BarListItem) => void
}) {
  const max = Math.max(...items.map((i) => i.value), 1)
  return (
    <ul className={cn('space-y-1', className)}>
      {items.map((it, i) => (
        <li key={it.name}>
          <button
            type="button"
            onClick={() => onSelect?.(it)}
            className={cn(
              'group relative flex h-9 w-full items-center justify-between gap-3 rounded-lg px-2.5 text-left text-sm',
              !onSelect && 'cursor-default',
            )}
          >
            <motion.span
              aria-hidden
              className="absolute inset-y-0 left-0 rounded-lg transition-[filter] group-hover:brightness-125"
              style={{ background: `color-mix(in oklch, ${color} 13%, transparent)` }}
              initial={{ width: 0 }}
              whileInView={{ width: `${(it.value / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            />
            <span
              aria-hidden
              className="absolute inset-y-1.5 left-0 w-0.5 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
              style={{ background: color }}
            />
            <span className="relative flex min-w-0 items-center gap-2.5 text-fg-muted transition-colors group-hover:text-fg">
              {it.icon && <span className="shrink-0 text-fg-subtle [&_svg]:size-4">{it.icon}</span>}
              <span className="truncate">{it.name}</span>
            </span>
            <span className="relative flex shrink-0 items-center gap-3">
              {it.trailing}
              <span className="font-mono text-[13px] font-medium tabular-nums">{format(it.value)}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
