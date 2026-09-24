import { motion } from 'motion/react'
import {
  ArrowUpRight,
  Bell,
  ChartColumn,
  ChevronDown,
  Command,
  CreditCard,
  Inbox,
  LayoutDashboard,
  Lock,
  Search,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { smoothPath, walk } from '../paths'

export const MOCK_W = 1280
export const MOCK_H = 830

const NAV = [
  { icon: LayoutDashboard, label: 'Overview', active: true },
  { icon: ChartColumn, label: 'Analytics' },
  { icon: Users, label: 'Customers' },
  { icon: Sparkles, label: 'AI Assistant', badge: 'New' },
  { icon: Inbox, label: 'Inbox', count: 3 },
  { icon: CreditCard, label: 'Billing' },
  { icon: Settings, label: 'Settings' },
]

const KPIS = [
  { label: 'MRR', value: '$248.3k', delta: '+24.1%', up: true, seed: 3, color: 'var(--accent)' },
  { label: 'Active users', value: '18,492', delta: '+8.7%', up: true, seed: 7, color: 'var(--accent-2)' },
  { label: 'Conversion', value: '4.82%', delta: '+0.6pt', up: true, seed: 11, color: 'var(--accent-3)' },
  { label: 'Churn', value: '1.94%', delta: '−0.3pt', up: false, seed: 19, color: 'var(--accent-4)' },
]

const ACCOUNTS = [
  { name: 'Halcyon Health', plan: 'Scale', mrr: '$12,400', trend: '+18%', up: true },
  { name: 'Kestrel Robotics', plan: 'Growth', mrr: '$8,950', trend: '+11%', up: true },
  { name: 'Oakline Studio', plan: 'Growth', mrr: '$6,120', trend: '−3%', up: false },
  { name: 'Parallel Freight', plan: 'Scale', mrr: '$5,780', trend: '+27%', up: true },
]

const CHANNELS = [
  { name: 'Organic', v: 42, c: 'var(--accent)' },
  { name: 'AI search', v: 23, c: 'var(--accent-2)' },
  { name: 'Referral', v: 18, c: 'var(--accent-3)' },
  { name: 'Paid', v: 17, c: 'var(--accent-4)' },
]

const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']

const revenue = walk(36, 5, 40, 1.4, 9)
const previous = walk(36, 23, 34, 0.9, 7)
const CHART_W = 700
const CHART_H = 190
const lo = Math.min(...revenue, ...previous) - 4
const hi = Math.max(...revenue, ...previous) + 4
const rev = smoothPath(revenue, CHART_W, CHART_H, 6, lo, hi)
const prev = smoothPath(previous, CHART_W, CHART_H, 6, lo, hi)
const marker = rev.points[27]

function Spark({ seed, color }: { seed: number; color: string }) {
  const p = smoothPath(walk(16, seed, 20, 0.8, 5), 96, 32, 3)
  return (
    <svg viewBox="0 0 96 32" className="h-8 w-24 overflow-visible" aria-hidden>
      <defs>
        <linearGradient id={`sp-${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.35" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={p.area} fill={`url(#sp-${seed})`} />
      <path d={p.line} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

/** A detailed, static-size dashboard facsimile. Scale it with a CSS transform to fit. */
export function DashboardMock() {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-[22px] border border-border-strong bg-surface text-fg"
      style={{ width: MOCK_W, height: MOCK_H }}
    >
      <div className="flex h-11 shrink-0 items-center gap-4 border-b border-border bg-surface-2/70 px-4">
        <div className="flex gap-1.5">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto flex h-7 w-96 items-center justify-center gap-2 rounded-lg border border-border bg-surface text-xs text-fg-muted">
          <Lock className="size-3" /> app.dashward.io/overview
        </div>
        <div className="w-12" />
      </div>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-[220px] shrink-0 flex-col gap-1 border-r border-border bg-bg-subtle/50 p-3">
          <div className="mb-2 flex items-center gap-2.5 rounded-xl border border-border bg-surface p-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-brand text-[11px] font-bold text-white">N</span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-[13px] font-medium">Northwind</p>
              <p className="text-[11px] text-fg-subtle">Growth plan</p>
            </div>
            <ChevronDown className="size-3.5 text-fg-subtle" />
          </div>
          <div className="mb-2 flex h-8 items-center gap-2 rounded-lg border border-border bg-surface/60 px-2.5 text-xs text-fg-subtle">
            <Search className="size-3.5" /> Search
            <span className="ml-auto flex items-center gap-0.5 rounded border border-border px-1 font-mono text-[10px]">
              <Command className="size-2.5" />K
            </span>
          </div>
          {NAV.map((n) => (
            <div
              key={n.label}
              className={cn(
                'flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-[13px]',
                n.active ? 'bg-surface font-medium text-fg shadow-sm ring-1 ring-border' : 'text-fg-muted',
              )}
            >
              <n.icon className={cn('size-4', n.active && 'text-accent')} />
              {n.label}
              {n.badge && <span className="ml-auto rounded-full bg-accent/12 px-1.5 text-[10px] font-medium text-accent">{n.badge}</span>}
              {n.count && <span className="ml-auto rounded-full bg-accent-4/15 px-1.5 text-[10px] font-medium text-accent-4">{n.count}</span>}
            </div>
          ))}
          <div className="mt-auto rounded-xl border border-border bg-surface p-3">
            <div className="flex justify-between text-[11px] text-fg-muted">
              <span>Events this month</span>
              <span className="font-medium text-fg">64%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-3">
              <div className="h-full w-[64%] rounded-full bg-gradient-brand" />
            </div>
            <p className="mt-2 text-[11px] text-fg-subtle">3.2M of 5M events</p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[19px] font-semibold tracking-tight">Good morning, Ava</p>
              <p className="text-[13px] text-fg-muted">4 things changed since yesterday. Two need your attention.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-full border border-border bg-surface-2/60 p-0.5 text-xs">
                {['7d', '30d', '90d', '12m'].map((r) => (
                  <span key={r} className={cn('rounded-full px-2.5 py-1', r === '12m' ? 'bg-surface font-medium shadow-sm ring-1 ring-border' : 'text-fg-muted')}>
                    {r}
                  </span>
                ))}
              </div>
              <span className="flex size-8 items-center justify-center rounded-full border border-border text-fg-muted">
                <Bell className="size-3.5" />
              </span>
              <span className="flex h-8 items-center gap-1.5 rounded-full bg-fg px-3 text-xs font-medium text-bg">
                <Sparkles className="size-3.5" /> Ask AI
              </span>
              <Avatar name="Ava Chen" className="size-8" />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {KPIS.map((k) => (
              <div key={k.label} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
                <p className="text-xs text-fg-muted">{k.label}</p>
                <div className="mt-1.5 flex items-end justify-between">
                  <div>
                    <p className="text-[22px] font-semibold tracking-tight tabular-nums">{k.value}</p>
                    <span
                      className={cn(
                        'mt-1 inline-flex rounded-full px-1.5 py-px text-[11px] font-medium',
                        k.up ? 'bg-success/12 text-success' : 'bg-accent-2/12 text-accent-2',
                      )}
                    >
                      {k.delta}
                    </span>
                  </div>
                  <Spark seed={k.seed} color={k.color} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid min-h-0 grid-cols-[1fr_318px] gap-3">
            <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-fg-muted">Net revenue</p>
                  <p className="text-[22px] font-semibold tracking-tight">
                    $2.84M <span className="text-sm font-medium text-success">+31.2% YoY</span>
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-fg-muted">
                  <span className="flex items-center gap-1.5">
                    <span className="h-0.5 w-3 rounded bg-accent" /> This year
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-0.5 w-3 rounded border-t border-dashed border-fg-subtle" /> Last year
                  </span>
                </div>
              </div>
              <div className="relative mt-3">
                <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="h-[190px] w-full overflow-visible" preserveAspectRatio="none" aria-hidden>
                  <defs>
                    <linearGradient id="mock-rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="var(--accent)" stopOpacity="0.32" />
                      <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="mock-rev-line" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="var(--accent)" />
                      <stop offset="0.6" stopColor="var(--accent)" />
                      <stop offset="1" stopColor="var(--accent-2)" />
                    </linearGradient>
                  </defs>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line key={i} x1="0" x2={CHART_W} y1={(CHART_H / 4) * i} y2={(CHART_H / 4) * i} stroke="var(--grid-line)" strokeWidth="1" />
                  ))}
                  <path d={prev.line} fill="none" stroke="var(--fg-subtle)" strokeWidth="1.5" strokeDasharray="4 5" opacity="0.7" />
                  <motion.path
                    d={rev.area}
                    fill="url(#mock-rev)"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.6 }}
                  />
                  <motion.path
                    d={rev.line}
                    fill="none"
                    stroke="url(#mock-rev-line)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  />
                  <line x1={marker[0]} x2={marker[0]} y1="0" y2={CHART_H} stroke="var(--accent)" strokeOpacity="0.4" strokeDasharray="3 3" />
                </svg>
                <span
                  className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-accent shadow-[0_0_0_6px_color-mix(in_oklch,var(--accent)_20%,transparent)]"
                  style={{ left: `${(marker[0] / CHART_W) * 100}%`, top: marker[1] }}
                />
                <div
                  className="absolute -translate-x-1/2 rounded-xl border border-border bg-surface/95 px-3 py-2 text-xs shadow-elevated backdrop-blur"
                  style={{ left: `${(marker[0] / CHART_W) * 100}%`, top: marker[1] - 74 }}
                >
                  <p className="text-fg-subtle">Jul 2026</p>
                  <p className="font-semibold">
                    $268,410 <span className="font-medium text-success">↑ 24%</span>
                  </p>
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-fg-subtle">
                  {MONTHS.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative flex flex-col overflow-hidden rounded-2xl border border-accent/30 bg-surface p-4 shadow-sm">
              <div
                aria-hidden
                className="absolute -top-16 -right-16 size-44 rounded-full opacity-40 blur-3xl"
                style={{ background: 'radial-gradient(circle, var(--accent), transparent 70%)' }}
              />
              <div className="relative flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-brand text-white">
                  <Sparkles className="size-3.5" />
                </span>
                <div className="leading-tight">
                  <p className="text-[13px] font-medium">Dashward AI</p>
                  <p className="text-[11px] text-fg-subtle">Insight · 2 min ago</p>
                </div>
                <span className="ml-auto rounded-full bg-danger/12 px-2 py-0.5 text-[10px] font-medium text-danger">Anomaly</span>
              </div>
              <p className="relative mt-3 text-[13px] leading-relaxed text-fg-muted">
                <span className="font-medium text-fg">Checkout drop-off spiked 38% on mobile Safari</span> after Tuesday’s
                release. 92% of affected sessions hit a hidden postcode error. Fixing it recovers about{' '}
                <span className="font-medium text-success">$14.2k MRR</span>.
              </p>
              <div className="relative mt-auto space-y-2 pt-3">
                <div className="flex items-center justify-between rounded-lg border border-border bg-surface-2/60 px-3 py-2 text-xs">
                  <span className="text-fg-muted">Confidence</span>
                  <span className="font-medium">96%</span>
                </div>
                <div className="flex gap-2">
                  <span className="flex-1 rounded-lg bg-fg py-2 text-center text-xs font-medium text-bg">Create ticket</span>
                  <span className="flex-1 rounded-lg border border-border py-2 text-center text-xs font-medium">Explain</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[1fr_318px] gap-3">
            <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[13px] font-medium">Top accounts</p>
                <span className="flex items-center gap-1 text-xs text-fg-muted">
                  View all <ArrowUpRight className="size-3" />
                </span>
              </div>
              <div className="grid grid-cols-[1.6fr_0.8fr_0.8fr_0.6fr] border-b border-border pb-1.5 text-[11px] text-fg-subtle">
                <span>Account</span>
                <span>Plan</span>
                <span>MRR</span>
                <span className="text-right">30d</span>
              </div>
              {ACCOUNTS.map((a) => (
                <div key={a.name} className="grid grid-cols-[1.6fr_0.8fr_0.8fr_0.6fr] items-center border-b border-border/60 py-[7px] text-xs last:border-0">
                  <span className="flex items-center gap-2 font-medium">
                    <Avatar name={a.name} className="size-5 ring-0" />
                    {a.name}
                  </span>
                  <span>
                    <span className={cn('rounded-full px-1.5 py-px text-[10px] font-medium', a.plan === 'Scale' ? 'bg-accent/12 text-accent' : 'bg-accent-2/12 text-accent-2')}>
                      {a.plan}
                    </span>
                  </span>
                  <span className="tabular-nums">{a.mrr}</span>
                  <span className={cn('text-right font-medium tabular-nums', a.up ? 'text-success' : 'text-danger')}>{a.trend}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
              <p className="text-[13px] font-medium">Acquisition channels</p>
              <div className="mt-3 flex h-2.5 overflow-hidden rounded-full">
                {CHANNELS.map((c) => (
                  <span key={c.name} style={{ width: `${c.v}%`, background: c.c }} className="h-full first:rounded-l-full last:rounded-r-full" />
                ))}
              </div>
              <div className="mt-3 space-y-2">
                {CHANNELS.map((c) => (
                  <div key={c.name} className="flex items-center gap-2 text-xs">
                    <span className="size-2 rounded-full" style={{ background: c.c }} />
                    <span className="text-fg-muted">{c.name}</span>
                    <span className="ml-auto font-medium tabular-nums">{c.v}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
