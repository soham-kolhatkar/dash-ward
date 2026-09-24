import { useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { TrendingUp } from 'lucide-react'
import { CardMenu, ChartTooltip, LegendChip, chartCursor, useSvgId } from '@/components/charts'
import { NumberTicker } from '@/components/fx'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tooltip as UITooltip } from '@/components/ui/tooltip'
import { getSeries, RANGES, type Range } from '@/data/metrics'
import { useIsMobile, usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { fmt } from '@/lib/format'
import { cn } from '@/lib/utils'

type Live = { range: Range; values: number[] }

export function RevenueCard({ range }: { range: Range }) {
  const base = useMemo(() => getSeries(range), [range])
  const [live, setLive] = useState(false)
  const [tick, setTick] = useState<Live | null>(null)
  const [show, setShow] = useState({ revenue: true, previous: true })
  const isMobile = useIsMobile()
  const reduce = usePrefersReducedMotion()
  const gid = useSvgId('rev')

  // Live mode: the current period's value random-walks every 2s.
  useEffect(() => {
    if (!live) return
    const id = setInterval(() => {
      setTick((t) => {
        const last = base[base.length - 1]
        const cur = t && t.range === range ? t.values[t.values.length - 1] : last.revenue
        const next = Math.max(last.previous * 0.9, cur * (1 + (Math.random() - 0.38) * 0.035))
        return { range, values: [...(t && t.range === range ? t.values : []), next].slice(-30) }
      })
    }, 2000)
    return () => clearInterval(id)
  }, [live, base, range])

  const data = useMemo(() => {
    const v = tick && tick.range === range ? tick.values[tick.values.length - 1] : null
    if (v == null) return base
    return base.map((p, i) => (i === base.length - 1 ? { ...p, revenue: Math.round(v) } : p))
  }, [base, tick, range])

  const total = data.reduce((a, p) => a + p.revenue, 0)
  const prevTotal = data.reduce((a, p) => a + p.previous, 0)
  const delta = (total / prevTotal - 1) * 100
  const rangeLabel = RANGES.find((r) => r.value === range)?.label.toLowerCase()
  const lastIdx = data.length - 1

  return (
    <Card className="flex h-full flex-col">
      <div className="flex flex-wrap items-start justify-between gap-4 p-5 pb-0">
        <div>
          <div className="text-sm font-medium">Revenue</div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <NumberTicker
              value={total}
              format={(n) => fmt.currency(n)}
              startOnView={false}
              duration={live ? 0.8 : 1.3}
              className="text-3xl font-semibold tracking-tight sm:text-[34px]"
            />
            <Badge variant="success" className="font-mono tabular-nums">
              <TrendingUp />
              {fmt.delta(delta)}
            </Badge>
          </div>
          <div className="mt-1 text-xs text-fg-subtle">Gross volume · last {rangeLabel}</div>
        </div>
        <div className="flex items-center gap-1.5">
          <UITooltip content={live ? 'Pause live updates' : 'Stream today’s revenue live'}>
            <button
              type="button"
              aria-pressed={live}
              onClick={() => setLive((l) => !l)}
              className={cn(
                'inline-flex h-7 items-center gap-2 rounded-full border px-2.5 text-xs font-medium transition',
                live
                  ? 'border-success/30 bg-success/10 text-success'
                  : 'border-border bg-surface-2/60 text-fg-muted hover:border-border-strong hover:text-fg',
              )}
            >
              <span className="relative flex size-1.5">
                {live && <span className="absolute inset-0 animate-pulse-ring rounded-full bg-success" />}
                <span className={cn('relative size-1.5 rounded-full', live ? 'bg-success' : 'bg-fg-subtle')} />
              </span>
              Live
            </button>
          </UITooltip>
          <CardMenu label="Revenue" />
        </div>
      </div>

      <div className="flex items-center gap-1 px-4 pt-3">
        <LegendChip
          color="var(--chart-1)"
          label="This period"
          active={show.revenue}
          onClick={() => setShow((s) => ({ ...s, revenue: !s.revenue || !s.previous }))}
        />
        <LegendChip
          color="var(--fg-subtle)"
          dashed
          label="Previous period"
          active={show.previous}
          onClick={() => setShow((s) => ({ ...s, previous: !s.previous || !s.revenue }))}
        />
      </div>

      <div className="min-h-[240px] flex-1 px-2 pt-2 pb-3 sm:min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 600, height: 280 }}>
          <AreaChart key={range} data={data} margin={{ top: 16, right: 16, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`${gid}-a`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" style={{ stopColor: 'var(--chart-1)', stopOpacity: 0.35 }} />
                <stop offset="100%" style={{ stopColor: 'var(--chart-1)', stopOpacity: 0 }} />
              </linearGradient>
              <linearGradient id={`${gid}-b`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" style={{ stopColor: 'var(--fg-subtle)', stopOpacity: 0.1 }} />
                <stop offset="100%" style={{ stopColor: 'var(--fg-subtle)', stopOpacity: 0 }} />
              </linearGradient>
              <linearGradient id={`${gid}-s`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" style={{ stopColor: 'var(--accent-2)' }} />
                <stop offset="100%" style={{ stopColor: 'var(--accent)' }} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={isMobile ? 36 : 28}
              interval="preserveStartEnd"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={isMobile ? 40 : 52}
              domain={[(min: number) => Math.floor((min * 0.6) / 1000) * 1000, 'auto']}
              tickFormatter={(v: number) => fmt.currencyCompact(v)}
            />
            <Tooltip
              cursor={chartCursor}
              content={(p) => (
                <ChartTooltip
                  {...p}
                  format={(v) => fmt.currency(v)}
                  footer={(rows) => {
                    const cur = rows.find((r) => r.dataKey === 'revenue')?.value
                    const prev = rows.find((r) => r.dataKey === 'previous')?.value
                    if (typeof cur !== 'number' || typeof prev !== 'number') return null
                    const d = (cur / prev - 1) * 100
                    return (
                      <span className={cn('font-mono text-[11px]', d >= 0 ? 'text-success' : 'text-danger')}>
                        {fmt.delta(d)} <span className="font-sans text-fg-subtle">vs previous</span>
                      </span>
                    )
                  }}
                />
              )}
            />
            <Area
              type="monotone"
              dataKey="previous"
              name="Previous"
              hide={!show.previous}
              stroke="var(--fg-subtle)"
              strokeOpacity={0.7}
              strokeDasharray="4 4"
              strokeWidth={1.5}
              fill={`url(#${gid}-b)`}
              activeDot={{ r: 3, strokeWidth: 0, fill: 'var(--fg-subtle)' }}
              isAnimationActive={!reduce}
              animationDuration={1200}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              hide={!show.revenue}
              stroke={`url(#${gid}-s)`}
              strokeWidth={2.25}
              fill={`url(#${gid}-a)`}
              isAnimationActive={!reduce}
              animationDuration={live ? 700 : 1400}
              activeDot={{ r: 4.5, strokeWidth: 2, stroke: 'var(--surface)', fill: 'var(--chart-1)' }}
              dot={(props: { cx?: number; cy?: number; index?: number }) =>
                live && props.index === lastIdx && props.cx != null && props.cy != null ? (
                  <g key="live-dot">
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={6}
                      fill="var(--chart-1)"
                      className="animate-pulse-ring"
                      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    />
                    <circle cx={props.cx} cy={props.cy} r={4} fill="var(--chart-1)" stroke="var(--surface)" strokeWidth={2} />
                  </g>
                ) : (
                  <g key={`d-${props.index}`} />
                )
              }
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
