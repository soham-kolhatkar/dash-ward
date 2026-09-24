import { Pin } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  ComposedChart,
  LabelList,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { toast } from 'sonner'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { CUSTOMERS } from '@/data/customers'
import { getSeries } from '@/data/metrics'
import { fmt } from '@/lib/format'
import { cn } from '@/lib/utils'
import { HealthRing } from '../customers/bits'
import { PLAN_VARIANT } from '../customers/meta'
import { ChartTooltip } from '../shared/ChartTooltip'
import type { AttachmentKind } from './responses'

function Frame({ title, caption, legend, children, className }: { title: string; caption: string; legend?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-2xl border border-border bg-surface-2/40', className)}>
      <div className="flex items-start justify-between gap-3 px-4 pt-3.5">
        <div className="min-w-0">
          <div className="text-[13px] font-medium text-fg">{title}</div>
          <div className="text-[11px] text-fg-subtle">{caption}</div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {legend}
          <button
            type="button"
            aria-label="Pin to dashboard"
            onClick={() => toast.success('Pinned to Overview', { description: title })}
            className="flex size-7 items-center justify-center rounded-full text-fg-subtle transition hover:bg-surface-3 hover:text-fg"
          >
            <Pin className="size-3.5" />
          </button>
        </div>
      </div>
      <div className="px-2 pt-3 pb-2">{children}</div>
    </div>
  )
}

const LegendDot = ({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) => (
  <span className="hidden items-center gap-1.5 text-[11px] text-fg-muted sm:inline-flex">
    <span className={cn('h-0.5 w-3 rounded-full', dashed && 'bg-transparent! border-t-2 border-dashed')} style={{ background: color, borderColor: color }} />
    {label}
  </span>
)

const DIP = [
  { d: 'Sep 9', v: 8420 },
  { d: 'Sep 10', v: 8910 },
  { d: 'Sep 11', v: 9240 },
  { d: 'Sep 12', v: 7110 },
  { d: 'Sep 13', v: 6980 },
  { d: 'Sep 14', v: 8760 },
  { d: 'Sep 15', v: 8830 },
  { d: 'Sep 16', v: 9020 },
  { d: 'Sep 17', v: 9310 },
  { d: 'Sep 18', v: 9480 },
  { d: 'Sep 19', v: 7420 },
  { d: 'Sep 20', v: 7210 },
  { d: 'Sep 21', v: 9050 },
  { d: 'Sep 22', v: 6120, dip: true },
  { d: 'Sep 23', v: 9410 },
]

function RevenueDip() {
  return (
    <Frame title="Daily revenue" caption="Sep 9 – 23 · anomaly highlighted" legend={<LegendDot color="var(--fg-subtle)" label="Tuesday baseline" dashed />}>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DIP} margin={{ top: 18, right: 8, bottom: 0, left: -12 }}>
            <XAxis dataKey="d" tickLine={false} axisLine={false} interval={2} tickMargin={6} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => fmt.currencyCompact(v)} width={52} />
            <Tooltip cursor={{ fill: 'var(--surface-3)', opacity: 0.5 }} content={(p) => <ChartTooltip active={p.active} payload={p.payload} label={p.label} format={(v) => fmt.currency(v)} />} />
            <ReferenceLine y={8870} stroke="var(--fg-subtle)" strokeDasharray="4 4" />
            <Bar dataKey="v" name="Revenue" radius={[5, 5, 2, 2]} animationDuration={900}>
              {DIP.map((p) => (
                <Cell key={p.d} fill={p.dip ? 'var(--chart-4)' : 'var(--chart-1)'} fillOpacity={p.dip ? 1 : 0.55} />
              ))}
              <LabelList dataKey="v" content={(p) => (DIP[Number(p.index)]?.dip ? <text x={Number(p.x) + Number(p.width) / 2} y={Number(p.y) - 6} textAnchor="middle" className="fill-accent-4 font-mono text-[10px] font-semibold">−31%</text> : null)} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Frame>
  )
}

const FORECAST = [
  { m: 'Jan', actual: 188 },
  { m: 'Feb', actual: 194 },
  { m: 'Mar', actual: 201 },
  { m: 'Apr', actual: 207 },
  { m: 'May', actual: 214 },
  { m: 'Jun', actual: 219 },
  { m: 'Jul', actual: 228 },
  { m: 'Aug', actual: 236 },
  { m: 'Sep', actual: 248, forecast: 248, band: [248, 248] },
  { m: 'Oct', forecast: 261, band: [255, 267] },
  { m: 'Nov', forecast: 273, band: [262, 284] },
  { m: 'Dec', forecast: 286, band: [271, 301] },
]

function Forecast() {
  const id = useId().replace(/:/g, '')
  return (
    <Frame
      title="MRR forecast"
      caption="2026 · 80% confidence interval"
      legend={
        <>
          <LegendDot color="var(--chart-1)" label="Actual" />
          <LegendDot color="var(--chart-2)" label="Forecast" dashed />
        </>
      }
    >
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={FORECAST} margin={{ top: 10, right: 10, bottom: 0, left: -12 }}>
            <defs>
              <linearGradient id={`band-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.08} />
              </linearGradient>
              <linearGradient id={`act-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.22} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="m" tickLine={false} axisLine={false} tickMargin={6} />
            <YAxis tickLine={false} axisLine={false} domain={[160, 320]} ticks={[160, 200, 240, 280, 320]} tickFormatter={(v) => `$${v}k`} width={52} />
            <Tooltip
              cursor={{ stroke: 'var(--border-strong)' }}
              content={(p) => <ChartTooltip active={p.active} payload={p.payload} label={p.label} format={(v) => `$${v}k`} />}
            />
            <ReferenceLine y={255} stroke="var(--accent-3)" strokeDasharray="3 5" label={{ value: 'Q4 target', position: 'insideTopLeft', fill: 'var(--fg-subtle)', fontSize: 10 }} />
            <Area dataKey="band" name="80% interval" stroke="none" fill={`url(#band-${id})`} animationDuration={1100} />
            <Area dataKey="actual" name="Actual" stroke="var(--chart-1)" strokeWidth={2.25} fill={`url(#act-${id})`} dot={false} animationDuration={1000} />
            <Line dataKey="forecast" name="Forecast" stroke="var(--chart-2)" strokeWidth={2.25} strokeDasharray="5 5" dot={{ r: 2.5, fill: 'var(--chart-2)', strokeWidth: 0 }} animationDuration={1200} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Frame>
  )
}

const CHANNEL_LTV = [
  { name: 'Organic search', ratio: 15.5, ltv: 4820, cac: 310, color: 'var(--chart-1)' },
  { name: 'Referral', ratio: 9.8, ltv: 3940, cac: 402, color: 'var(--chart-2)' },
  { name: 'Direct', ratio: 7.2, ltv: 3610, cac: 501, color: 'var(--chart-3)' },
  { name: 'Email', ratio: 5.4, ltv: 2280, cac: 422, color: 'var(--chart-5)' },
  { name: 'Paid social', ratio: 2.1, ltv: 1890, cac: 900, color: 'var(--chart-4)' },
]

function Channels() {
  return (
    <Frame title="LTV : CAC by channel" caption="12-month LTV · blended CAC · last 2 quarters">
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={CHANNEL_LTV} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 0 }} barCategoryGap={8}>
            <XAxis type="number" hide domain={[0, 17]} />
            <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={104} tick={{ fontSize: 11 }} />
            <Tooltip
              cursor={{ fill: 'var(--surface-3)', opacity: 0.4 }}
              content={(p) => {
                const row = p.payload?.[0]?.payload as (typeof CHANNEL_LTV)[number] | undefined
                if (!p.active || !row) return null
                return (
                  <ChartTooltip
                    active
                    label={row.name}
                    payload={[
                      { name: 'LTV', value: row.ltv, color: row.color, dataKey: 'ltv' },
                      { name: 'CAC', value: row.cac, color: 'var(--fg-subtle)', dataKey: 'cac' },
                    ]}
                    format={(v) => fmt.currency(v)}
                  />
                )
              }}
            />
            <Bar dataKey="ratio" radius={[4, 999, 999, 4]} animationDuration={900}>
              {CHANNEL_LTV.map((c) => (
                <Cell key={c.name} fill={c.color} />
              ))}
              <LabelList dataKey="ratio" position="right" formatter={(v) => `${v}×`} className="fill-fg font-mono text-[11px]" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Frame>
  )
}

const SIGNALS = ['Seats −46% in 21 days', 'Card declined twice', 'Admin inactive 12 days', 'No AI queries in 30 days', 'Support ticket escalated']

function Churn() {
  const rows = CUSTOMERS.filter((c) => c.status !== 'churned' && c.health < 50)
    .sort((a, b) => b.mrr - a.mrr)
    .slice(0, 5)
  return (
    <Frame title="Highest MRR at risk" caption={`Top ${rows.length} of 13 accounts · health score < 50`} className="[&>div:last-child]:px-0 [&>div:last-child]:pb-0">
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-border text-[11px] text-fg-subtle">
              <th className="py-2 pl-4 font-medium">Account</th>
              <th className="px-3 font-medium">Plan</th>
              <th className="px-3 text-right font-medium">MRR</th>
              <th className="px-3 font-medium">Health</th>
              <th className="pr-4 font-medium">Top signal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c, i) => (
              <tr key={c.id} className="border-b border-border/60 last:border-0 hover:bg-surface-2/60">
                <td className="py-2.5 pl-4">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={c.company} className="size-6 ring-0" />
                    <div className="min-w-0">
                      <div className="truncate font-medium text-fg">{c.company}</div>
                      <div className="truncate text-[11px] text-fg-subtle">{c.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3">
                  <Badge variant={PLAN_VARIANT[c.plan]}>{c.plan}</Badge>
                </td>
                <td className="px-3 text-right font-mono tabular-nums">{fmt.currency(c.mrr)}</td>
                <td className="px-3">
                  <HealthRing value={c.health} size={20} stroke={2.5} />
                </td>
                <td className="pr-4 text-fg-muted">{SIGNALS[i % SIGNALS.length]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Frame>
  )
}

const KPIS = [
  { label: 'MRR', value: '$248.3k', delta: '+2.1%', up: true, spark: [212, 219, 224, 228, 231, 236, 240, 243, 248] },
  { label: 'Activation', value: '57%', delta: '+4pt', up: true, spark: [49, 51, 50, 52, 53, 52, 54, 53, 57] },
  { label: 'Net revenue retention', value: '118%', delta: '+3pt', up: true, spark: [111, 112, 114, 113, 115, 116, 115, 117, 118] },
  { label: 'Logo churn', value: '1.9%', delta: '−0.2pt', up: true, spark: [2.6, 2.4, 2.5, 2.3, 2.2, 2.1, 2.2, 2.0, 1.9] },
]

function Spark({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${28 - ((v - min) / (max - min || 1)) * 24}`).join(' ')
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-8 w-full overflow-visible" aria-hidden>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.75} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function Summary() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {KPIS.map((k, i) => (
        <div key={k.label} className="rounded-xl border border-border bg-surface-2/40 p-3">
          <div className="truncate text-[11px] text-fg-subtle">{k.label}</div>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span className="font-mono text-base font-semibold tabular-nums">{k.value}</span>
            <span className={cn('font-mono text-[11px] tabular-nums', k.up ? 'text-success' : 'text-danger')}>{k.delta}</span>
          </div>
          <div className="mt-2">
            <Spark data={k.spark} color={`var(--chart-${(i % 4) + 1})`} />
          </div>
        </div>
      ))}
    </div>
  )
}

function Sessions() {
  const id = useId().replace(/:/g, '')
  const data = getSeries('30d')
  return (
    <Frame title="Sessions" caption="Last 30 days · all workspaces">
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: -12 }}>
            <defs>
              <linearGradient id={`ses-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" tickLine={false} axisLine={false} interval={6} tickMargin={6} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => fmt.compact(v)} width={48} />
            <Tooltip cursor={{ stroke: 'var(--border-strong)' }} content={(p) => <ChartTooltip active={p.active} payload={p.payload} label={p.label} format={(v) => fmt.number(v)} />} />
            <Area type="monotone" dataKey="sessions" name="Sessions" stroke="var(--chart-2)" strokeWidth={2} fill={`url(#ses-${id})`} animationDuration={1000} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Frame>
  )
}

export function Attachment({ kind }: { kind: AttachmentKind }) {
  switch (kind) {
    case 'revenue-dip':
      return <RevenueDip />
    case 'forecast':
      return <Forecast />
    case 'channels':
      return <Channels />
    case 'churn':
      return <Churn />
    case 'summary':
      return <Summary />
    case 'sessions':
      return <Sessions />
  }
}
