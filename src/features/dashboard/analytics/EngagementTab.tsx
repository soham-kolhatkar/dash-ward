import { motion } from 'motion/react'
import { CalendarDays, Clock, Flame, Zap } from 'lucide-react'
import { useMemo } from 'react'
import { ChartCard, Heatmap, MiniBars } from '@/components/charts'
import { EVENTS, HOURLY_HEATMAP } from '@/data/metrics'
import { fmt } from '@/lib/format'
import { fadeUp, stagger } from '@/lib/motion'
import { createRng } from '@/lib/random'
import { cn } from '@/lib/utils'

const hour12 = (h: number) => `${h % 12 || 12}${h < 12 ? 'am' : 'pm'}`

export function EngagementTab({ factor }: { factor: number }) {
  const events = useMemo(() => {
    const rng = createRng(31)
    return EVENTS.map((e) => {
      const drift = e.trend / 100
      return {
        ...e,
        count: Math.max(1, Math.round(e.count * factor)),
        bars: Array.from({ length: 14 }, (_, i) => Math.max(0.1, 1 + drift * (i / 13) + rng.range(-0.18, 0.18))),
      }
    })
  }, [factor])
  const total = events.reduce((a, e) => a + e.count, 0)

  const peak = useMemo(() => {
    let best = { day: '', hour: 0, v: -1 }
    for (const r of HOURLY_HEATMAP) r.hours.forEach((v, h) => v > best.v && (best = { day: r.day, hour: h, v }))
    const dayTotals = HOURLY_HEATMAP.map((r) => ({ day: r.day, v: r.hours.reduce((a, x) => a + x, 0) }))
    const topDay = dayTotals.reduce((a, d) => (d.v > a.v ? d : a))
    const weekend = dayTotals.slice(5).reduce((a, d) => a + d.v, 0) / 2
    const weekday = dayTotals.slice(0, 5).reduce((a, d) => a + d.v, 0) / 5
    return { ...best, topDay: topDay.day, weekendDrop: (1 - weekend / weekday) * 100 }
  }, [])

  return (
    <motion.div variants={stagger(0.07)} initial="hidden" animate="show" className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <motion.div variants={fadeUp} className="col-span-12 xl:col-span-8">
          <ChartCard title="When users are active" description="Sessions by weekday and hour (your local time)" icon={<CalendarDays />}>
            <Heatmap rows={HOURLY_HEATMAP} unit="activity index" />
          </ChartCard>
        </motion.div>
        <motion.div variants={fadeUp} className="col-span-12 xl:col-span-4">
          <ChartCard title="Patterns" description="Detected by Dashward AI" icon={<Zap />}>
            <ul className="space-y-3">
              {[
                { icon: Flame, label: 'Peak hour', value: `${peak.day} ${hour12(peak.hour)}`, hint: 'Best time to ship announcements' },
                { icon: CalendarDays, label: 'Busiest day', value: peak.topDay, hint: 'Highest total sessions' },
                { icon: Clock, label: 'Weekend dip', value: `−${peak.weekendDrop.toFixed(0)}%`, hint: 'vs. average weekday' },
              ].map((p) => (
                <li key={p.label} className="flex items-center gap-3 rounded-xl border border-border bg-surface-2/40 p-3 transition hover:border-border-strong">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <p.icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-fg-subtle">{p.label}</div>
                    <div className="truncate text-[11px] text-fg-subtle/80">{p.hint}</div>
                  </div>
                  <span className="font-mono text-sm font-semibold tabular-nums">{p.value}</span>
                </li>
              ))}
            </ul>
          </ChartCard>
        </motion.div>
      </div>

      <motion.div variants={fadeUp}>
        <ChartCard title="Events" description={`${fmt.compact(total)} events tracked this period`} icon={<Zap />} contentClassName="px-0 pb-2">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] font-medium text-fg-subtle">
                  <th className="px-5 pb-2.5 font-medium">Event</th>
                  <th className="px-3 pb-2.5 text-right font-medium">Count</th>
                  <th className="px-3 pb-2.5 font-medium">Last 14 days</th>
                  <th className="px-3 pb-2.5 text-right font-medium">Change</th>
                  <th className="w-40 px-5 pb-2.5 font-medium">Share</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e, i) => {
                  const up = e.trend >= 0
                  const share = (e.count / total) * 100
                  return (
                    <motion.tr
                      key={e.name}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="group border-b border-border/60 transition-colors last:border-0 hover:bg-surface-2/50"
                    >
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-2 font-mono text-[13px] text-fg">
                          <span className="size-1.5 rounded-full bg-accent/70 transition group-hover:bg-accent" />
                          {e.name}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right font-mono tabular-nums">{fmt.number(e.count)}</td>
                      <td className="px-3 py-3">
                        <MiniBars values={e.bars} color={up ? 'var(--success)' : 'var(--danger)'} />
                      </td>
                      <td className={cn('px-3 py-3 text-right font-mono text-xs tabular-nums', up ? 'text-success' : 'text-danger')}>
                        {fmt.delta(e.trend)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3">
                            <motion.div
                              className="h-full rounded-full bg-accent"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.max(1.5, share)}%` }}
                              transition={{ duration: 0.9, delay: 0.2 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                            />
                          </div>
                          <span className="w-11 text-right font-mono text-[11px] text-fg-subtle tabular-nums">{share.toFixed(1)}%</span>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </motion.div>
    </motion.div>
  )
}
