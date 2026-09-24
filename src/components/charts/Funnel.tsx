import { motion } from 'motion/react'
import { ArrowDownRight } from 'lucide-react'
import { Fragment } from 'react'
import { cn } from '@/lib/utils'

/** Horizontal funnel with animated bars and step-to-step drop-off. data: `{ stage, value }[]` */
export function Funnel({
  data,
  format = (v) => v.toLocaleString('en-US'),
  className,
}: {
  data: { stage: string; value: number }[]
  format?: (v: number) => string
  className?: string
}) {
  const max = data[0]?.value || 1
  return (
    <div className={cn('flex flex-col', className)}>
      {data.map((d, i) => {
        const pct = (d.value / max) * 100
        const next = data[i + 1]
        const drop = next ? (1 - next.value / d.value) * 100 : 0
        return (
          <Fragment key={d.stage}>
            <div className="group">
              <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-fg-muted transition-colors group-hover:text-fg">
                  <span className="font-mono text-[10px] text-fg-subtle tabular-nums">0{i + 1}</span>
                  {d.stage}
                </span>
                <span className="flex items-baseline gap-2">
                  <span className="font-mono font-medium tabular-nums">{format(d.value)}</span>
                  <span className="w-11 text-right font-mono text-[11px] text-fg-subtle tabular-nums">
                    {pct.toFixed(pct < 10 ? 1 : 0)}%
                  </span>
                </span>
              </div>
              <div className="relative h-2.5 overflow-hidden rounded-full bg-surface-3/70">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, var(--accent), color-mix(in oklch, var(--accent) ${100 - i * 14}%, var(--accent-2)))`,
                    opacity: 1 - i * 0.08,
                  }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.max(pct, 1.5)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: 0.1 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
            {next && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.09 }}
                className="flex items-center gap-2 py-1.5 pl-6 text-[11px] text-fg-subtle"
              >
                <span className="h-3 w-px bg-border-strong" />
                <ArrowDownRight className="size-3 text-danger/80" />
                <span className="font-mono tabular-nums">{drop.toFixed(1)}% drop-off</span>
              </motion.div>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
