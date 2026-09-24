import { motion } from 'motion/react'
import { ChartArea, ChartColumn, Laptop, Radio, Smartphone, Tablet } from 'lucide-react'
import { useMemo } from 'react'
import { Area, Bar, BarChart, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BarList, ChartCard, ChartTooltip, LegendChip, chartCursor, useSvgId } from '@/components/charts'
import { CHANNELS, getSeries, type Range } from '@/data/metrics'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { fmt } from '@/lib/format'
import { fadeUp, stagger } from '@/lib/motion'
import { createRng } from '@/lib/random'
import { FILTER_GROUPS, type Filters } from './filters'
import { StatStrip } from './StatStrip'

const DEVICE_ICON = { desktop: Laptop, mobile: Smartphone, tablet: Tablet } as Record<string, typeof Laptop>

export function TrafficTab({ range, factor, compare, filters }: { range: Range; factor: number; compare: boolean; filters: Filters }) {
  const isMobile = useIsMobile()
  const gid = useSvgId('traffic')
  const data = useMemo(() => {
    const rng = createRng(range.length * 13 + 5)
    return getSeries(range).map((p) => {
      const users = Math.round(p.users * factor)
      const sessions = Math.round((p.sessions - p.users) * factor)
      const conversions = Math.round(p.conversions * factor)
      return {
        label: p.label,
        users,
        sessions,
        conversions,
        prevTotal: Math.round((users + sessions) * rng.range(0.74, 0.92)),
        prevConversions: Math.round(conversions * rng.range(0.7, 0.95)),
      }
    })
  }, [range, factor])

  const sum = (k: keyof (typeof data)[number]) => data.reduce((a, p) => a + (p[k] as number), 0)
  const users = sum('users')
  const sessions = users + sum('sessions')
  const conversions = sum('conversions')
  const totalSessions = sessions
  const tick = { tickLine: false, axisLine: false } as const
  const devices = FILTER_GROUPS[0].options.filter((o) => filters.device.includes(o.value))
  const deviceTotal = devices.reduce((a, d) => a + d.share, 0)

  return (
    <motion.div variants={stagger(0.07)} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={fadeUp}>
        <StatStrip
          compare={compare}
          stats={[
            { label: 'Unique users', value: users, format: fmt.compact, delta: 12.4 },
            { label: 'Sessions', value: sessions, format: fmt.compact, delta: 9.8 },
            { label: 'Conversions', value: conversions, format: fmt.number, delta: 6.1 },
            { label: 'Bounce rate', value: 38.2, format: (v) => `${v.toFixed(1)}%`, delta: -2.4, invert: true },
          ]}
        />
      </motion.div>

      <div className="grid grid-cols-12 gap-4">
        <motion.div variants={fadeUp} className="col-span-12 xl:col-span-8">
          <ChartCard
            title="Traffic"
            description="Users plus repeat sessions = total sessions"
            icon={<ChartArea />}
            action={
              <div className="hidden items-center sm:flex">
                <LegendChip color="var(--chart-2)" label="Users" />
                <LegendChip color="var(--chart-1)" label="Repeat sessions" />
                {compare && <LegendChip color="var(--fg-subtle)" label="Previous" dashed />}
              </div>
            }
            contentClassName="px-2 pb-3"
          >
            <div className="h-[280px] sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 600, height: 300 }}>
                <ComposedChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    {['1', '2'].map((n) => (
                      <linearGradient key={n} id={`${gid}-${n}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" style={{ stopColor: `var(--chart-${n})`, stopOpacity: 0.38 }} />
                        <stop offset="100%" style={{ stopColor: `var(--chart-${n})`, stopOpacity: 0.02 }} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="label" {...tick} tickMargin={10} minTickGap={isMobile ? 36 : 28} />
                  <YAxis {...tick} width={44} tickFormatter={(v: number) => fmt.compact(v)} />
                  <Tooltip
                    cursor={chartCursor}
                    content={(p) => (
                      <ChartTooltip
                        {...p}
                        format={(v) => fmt.number(v)}
                        footer={(rows) => {
                          const t = rows.filter((r) => r.dataKey !== 'prevTotal').reduce((a, r) => a + Number(r.value), 0)
                          return (
                            <span className="flex justify-between gap-6 text-fg-subtle">
                              Total sessions <span className="font-mono font-medium text-fg tabular-nums">{fmt.number(t)}</span>
                            </span>
                          )
                        }}
                      />
                    )}
                  />
                  <Area type="monotone" dataKey="users" name="Users" stackId="t" stroke="var(--chart-2)" strokeWidth={2} fill={`url(#${gid}-2)`} animationDuration={1100} />
                  <Area type="monotone" dataKey="sessions" name="Repeat sessions" stackId="t" stroke="var(--chart-1)" strokeWidth={2} fill={`url(#${gid}-1)`} animationDuration={1100} />
                  {compare && (
                    <Line
                      type="monotone"
                      dataKey="prevTotal"
                      name="Previous"
                      stroke="var(--fg-subtle)"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      dot={false}
                      activeDot={{ r: 3, strokeWidth: 0, fill: 'var(--fg-subtle)' }}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={fadeUp} className="col-span-12 md:col-span-6 xl:col-span-4">
          <ChartCard title="Top sources" description="Sessions by channel" icon={<Radio />} contentClassName="px-3 pt-4">
            <BarList
              items={CHANNELS.map((c) => ({
                name: c.name,
                value: Math.round((c.value / 100) * totalSessions),
                icon: <span className="block size-2 rounded-full" style={{ background: c.color }} />,
              }))}
              format={fmt.compact}
            />
            <div className="mt-4 rounded-xl border border-dashed border-border px-3 py-2.5 text-xs text-fg-muted">
              <span className="font-medium text-fg">Organic search</span> drives{' '}
              <span className="font-mono text-fg tabular-nums">{CHANNELS[0].value}%</span> of sessions, up 4.2pt this period.
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={fadeUp} className="col-span-12 xl:col-span-8 max-xl:order-last">
          <ChartCard title="Conversions" description={compare ? 'Compared with the previous period' : 'Completed checkouts'} icon={<ChartColumn />} contentClassName="px-2 pb-3">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 600, height: 240 }}>
                <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }} barCategoryGap={data.length > 40 ? 1 : '22%'}>
                  <defs>
                    <linearGradient id={`${gid}-bar`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" style={{ stopColor: 'var(--accent)' }} />
                      <stop offset="100%" style={{ stopColor: 'var(--accent)', stopOpacity: 0.45 }} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="label" {...tick} tickMargin={10} minTickGap={isMobile ? 36 : 28} />
                  <YAxis {...tick} width={44} tickFormatter={(v: number) => fmt.compact(v)} />
                  <Tooltip
                    cursor={{ fill: 'var(--surface-3)', opacity: 0.5 }}
                    content={(p) => <ChartTooltip {...p} format={(v) => fmt.number(v)} />}
                  />
                  {compare && <Bar dataKey="prevConversions" name="Previous" fill="var(--surface-3)" radius={[3, 3, 0, 0]} />}
                  <Bar dataKey="conversions" name="Conversions" fill={`url(#${gid}-bar)`} radius={[3, 3, 0, 0]} animationDuration={900} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={fadeUp} className="col-span-12 md:col-span-6 xl:col-span-4">
          <ChartCard title="Devices" description="Share of sessions" icon={<Laptop />}>
            <div className="flex h-3 overflow-hidden rounded-full bg-surface-3">
              {devices.map((d, i) => (
                <motion.div
                  key={d.value}
                  initial={{ width: 0 }}
                  animate={{ width: `${(d.share / deviceTotal) * 100}%` }}
                  transition={{ duration: 1, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full border-r-2 border-surface last:border-0"
                  style={{ background: `var(--chart-${i + 1})` }}
                />
              ))}
            </div>
            <ul className="mt-5 space-y-3">
              {devices.map((d, i) => {
                const Icon = DEVICE_ICON[d.value]
                const pct = (d.share / deviceTotal) * 100
                return (
                  <li key={d.value} className="flex items-center gap-3 text-sm">
                    <span
                      className="flex size-8 items-center justify-center rounded-lg"
                      style={{ background: `color-mix(in oklch, var(--chart-${i + 1}) 14%, transparent)`, color: `var(--chart-${i + 1})` }}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="flex-1 text-fg-muted">{d.label}</span>
                    <span className="font-mono text-xs text-fg-subtle tabular-nums">{fmt.compact((pct / 100) * totalSessions)}</span>
                    <span className="w-12 text-right font-mono font-medium tabular-nums">{pct.toFixed(1)}%</span>
                  </li>
                )
              })}
            </ul>
          </ChartCard>
        </motion.div>
      </div>
    </motion.div>
  )
}
