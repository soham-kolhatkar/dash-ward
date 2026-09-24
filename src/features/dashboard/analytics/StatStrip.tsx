import { motion } from 'motion/react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { NumberTicker } from '@/components/fx'
import { Card } from '@/components/ui/card'
import { fmt } from '@/lib/format'
import { cn } from '@/lib/utils'

export interface Stat {
  label: string
  value: number
  format: (v: number) => string
  delta?: number
  /** Lower is better (e.g. bounce rate). */
  invert?: boolean
}

/** A single card split into evenly divided stat cells. */
export function StatStrip({ stats, compare }: { stats: Stat[]; compare: boolean }) {
  return (
    <Card className="grid grid-cols-2 overflow-hidden sm:grid-cols-4">
      {stats.map((s, i) => {
        const good = s.delta != null && (s.invert ? s.delta < 0 : s.delta >= 0)
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'relative p-4 transition-colors hover:bg-surface-2/50 sm:p-5',
              i % 2 === 1 && 'border-l border-border',
              i >= 2 && 'border-t border-border sm:border-t-0',
              i === 2 && 'sm:border-l',
            )}
          >
            <div className="text-xs text-fg-subtle">{s.label}</div>
            <NumberTicker
              value={s.value}
              format={s.format}
              startOnView={false}
              duration={1}
              className="mt-1.5 block text-xl font-semibold tracking-tight sm:text-2xl"
            />
            {s.delta != null && (
              <div className={cn('mt-1 flex items-center gap-1 font-mono text-[11px] tabular-nums', good ? 'text-success' : 'text-danger')}>
                {s.delta >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                {fmt.delta(s.delta)}
                {compare && <span className="font-sans text-fg-subtle">vs prev.</span>}
              </div>
            )}
          </motion.div>
        )
      })}
    </Card>
  )
}
