import { motion } from 'motion/react'
import { CircleDollarSign, MousePointerClick, Timer, TrendingDown, TrendingUp, Users } from 'lucide-react'
import { Sparkline } from '@/components/charts'
import { NumberTicker, SpotlightCard } from '@/components/fx'
import { Badge } from '@/components/ui/badge'
import { getKpis, type Range } from '@/data/metrics'
import { fadeUp, stagger } from '@/lib/motion'
import { fmt } from '@/lib/format'
import { formatKpi } from './format'

const META: Record<string, { icon: typeof Users; color: string }> = {
  revenue: { icon: CircleDollarSign, color: 'var(--chart-1)' },
  users: { icon: Users, color: 'var(--chart-2)' },
  conversion: { icon: MousePointerClick, color: 'var(--chart-3)' },
  session: { icon: Timer, color: 'var(--chart-4)' },
}

export function KpiCards({ range }: { range: Range }) {
  const kpis = getKpis(range)
  return (
    <motion.div variants={stagger(0.07)} initial="hidden" animate="show" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {kpis.map((k) => {
        const m = META[k.key]
        const up = k.delta >= 0
        const good = up
        return (
          <motion.div key={k.key} variants={fadeUp}>
            <SpotlightCard glow={m.color} className="flex h-full flex-col rounded-2xl">
              <div className="flex items-center justify-between gap-2 px-4 pt-4 sm:px-5 sm:pt-5">
                <span className="flex min-w-0 items-center gap-2 text-[13px] text-fg-muted">
                  <span
                    className="flex size-6 shrink-0 items-center justify-center rounded-md"
                    style={{ background: `color-mix(in oklch, ${m.color} 14%, transparent)`, color: m.color }}
                  >
                    <m.icon className="size-3.5" />
                  </span>
                  <span className="truncate">{k.label}</span>
                </span>
                <Badge variant={good ? 'success' : 'danger'} className="hidden font-mono tabular-nums sm:inline-flex">
                  {up ? <TrendingUp /> : <TrendingDown />}
                  {fmt.delta(k.delta)}
                </Badge>
              </div>
              <div className="px-4 pt-3 sm:px-5">
                <NumberTicker
                  value={k.value}
                  format={(v) => formatKpi(k.format, v)}
                  startOnView={false}
                  duration={1.2}
                  className="block text-[22px] leading-none font-semibold tracking-tight sm:text-[28px]"
                />
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-fg-subtle">
                  <span className={good ? 'font-mono text-success sm:hidden' : 'font-mono text-danger sm:hidden'}>{fmt.delta(k.delta)}</span>
                  vs previous period
                </div>
              </div>
              <Sparkline key={range} data={k.spark} color={m.color} height={52} className="mt-auto pt-3 opacity-90" />
            </SpotlightCard>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
