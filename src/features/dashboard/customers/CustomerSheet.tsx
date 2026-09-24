import { motion } from 'motion/react'
import { Bot, CreditCard, Ellipsis, LifeBuoy, Mail, MapPin, Package, Trash2, Users } from 'lucide-react'
import { useId } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { toast } from 'sonner'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown'
import type { Customer } from '@/data/customers'
import { fmt } from '@/lib/format'
import { cn } from '@/lib/utils'
import { ChartTooltip } from '../shared/ChartTooltip'
import { HealthRing, StatusLabel } from './bits'
import { COUNTRY_NAMES, PLAN_VARIANT, activityFor, healthBreakdown, healthColor, healthLabel, mrrHistory, type ActivityKind } from './meta'

const KIND_ICON: Record<ActivityKind, typeof Mail> = {
  product: Package,
  team: Users,
  ai: Bot,
  support: LifeBuoy,
  billing: CreditCard,
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
}

export function CustomerSheet({
  customer,
  onOpenChange,
  onDelete,
}: {
  customer: Customer | null
  onOpenChange: (open: boolean) => void
  onDelete: (c: Customer) => void
}) {
  return (
    <Sheet open={!!customer} onOpenChange={onOpenChange}>
      {customer && (
        <SheetContent title={`${customer.name} profile`} className="w-[min(94vw,480px)]" onOpenAutoFocus={(e) => e.preventDefault()}>
          <Profile key={customer.id} c={customer} onDelete={onDelete} />
        </SheetContent>
      )}
    </Sheet>
  )
}

function Profile({ c, onDelete }: { c: Customer; onDelete: (c: Customer) => void }) {
  const gid = useId().replace(/:/g, '')
  const history = mrrHistory(c)
  const breakdown = healthBreakdown(c)
  const activity = activityFor(c)
  const first = history.find((h) => h.mrr > 0)?.mrr ?? 0
  const growth = first ? ((history[11].mrr - first) / first) * 100 : 0
  const ltv = history.reduce((a, h) => a + h.mrr, 0)

  return (
    <>
      <div className="scrollbar-none flex-1 overflow-y-auto" data-lenis-prevent>
        {/* Banner */}
        <div className="relative h-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-brand opacity-90" />
          <div
            className="absolute inset-0 opacity-40 mix-blend-overlay"
            style={{
              background:
                'radial-gradient(120% 90% at 85% 0%, rgba(255,255,255,.7), transparent 55%), radial-gradient(80% 80% at 0% 100%, rgba(0,0,0,.45), transparent 60%)',
            }}
          />
          <div className="absolute inset-0 bg-grid opacity-30 [background-size:22px_22px] mask-fade-y" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-surface to-transparent" />
        </div>

        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } } }} className="px-6 pb-6">
          <motion.div variants={item} className="-mt-10 flex items-end justify-between gap-3">
            <Avatar name={c.name} className="size-20 shadow-elevated ring-4 ring-surface [&_span]:text-xl" />
            <div className="flex items-center gap-2 pb-1">
              <Badge variant={PLAN_VARIANT[c.plan]}>{c.plan}</Badge>
              <StatusLabel status={c.status} className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-xs" />
            </div>
          </motion.div>

          <motion.div variants={item} className="mt-4">
            <h2 className="text-xl font-semibold tracking-tight">{c.name}</h2>
            <p className="mt-0.5 text-sm text-fg-muted">
              {c.email}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fg-subtle">
              <span className="inline-flex items-center gap-1.5">
                <Package className="size-3.5" /> {c.company}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" /> {COUNTRY_NAMES[c.country] ?? c.country}
              </span>
              <span className="font-mono">{c.id}</span>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={item} className="mt-5 grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-surface-2/50">
            {[
              { label: 'MRR', value: fmt.currency(c.mrr) },
              { label: 'Seats', value: fmt.number(c.seats) },
              { label: 'Customer since', value: fmt.shortDate(c.joined) },
            ].map((s) => (
              <div key={s.label} className="px-3.5 py-3">
                <div className="text-[11px] text-fg-subtle">{s.label}</div>
                <div className="mt-0.5 font-mono text-[15px] font-medium tabular-nums">{s.value}</div>
              </div>
            ))}
          </motion.div>

          {/* MRR history */}
          <motion.section variants={item} className="mt-6">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-medium">MRR history</h3>
              <span className="text-xs text-fg-subtle">
                <span className={cn('font-mono tabular-nums', growth >= 0 ? 'text-success' : 'text-danger')}>{fmt.delta(growth, 0)}</span> · 12 mo ·{' '}
                <span className="font-mono tabular-nums">{fmt.currencyCompact(ltv)}</span> billed
              </span>
            </div>
            <div className="mt-3 h-36 rounded-xl border border-border bg-surface-2/30 pt-3 pr-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id={`mrr-${gid}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" tickLine={false} axisLine={false} interval={2} tickMargin={6} padding={{ left: 14, right: 6 }} />
                  <YAxis hide domain={[0, 'dataMax']} />
                  <Tooltip
                    cursor={{ stroke: 'var(--border-strong)' }}
                    content={(p) => <ChartTooltip active={p.active} payload={p.payload} label={p.label} format={(v) => fmt.currency(v)} />}
                  />
                  <Area type="monotone" dataKey="mrr" name="MRR" stroke="var(--chart-1)" strokeWidth={2} fill={`url(#mrr-${gid})`} animationDuration={900} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.section>

          {/* Health */}
          <motion.section variants={item} className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Health score</h3>
              <span className="inline-flex items-center gap-2 text-xs" style={{ color: healthColor(c.health) }}>
                {healthLabel(c.health)}
                <HealthRing value={c.health} size={22} showValue={false} />
                <span className="font-mono text-sm font-semibold text-fg tabular-nums">{c.health}</span>
              </span>
            </div>
            <div className="mt-3 space-y-3 rounded-xl border border-border p-4">
              {breakdown.map((b, i) => (
                <div key={b.label} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5">
                  <span className="text-xs text-fg-muted">{b.label}</span>
                  <span className="font-mono text-xs tabular-nums">{b.value}</span>
                  <div className="col-span-2 h-1.5 overflow-hidden rounded-full bg-surface-3">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: healthColor(b.value) }}
                      initial={{ width: 0 }}
                      animate={{ width: `${b.value}%` }}
                      transition={{ duration: 0.9, delay: 0.3 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Activity */}
          <motion.section variants={item} className="mt-6">
            <h3 className="text-sm font-medium">Activity</h3>
            <ol className="relative mt-3 space-y-4 pl-1">
              <span aria-hidden className="absolute top-2 bottom-2 left-[15px] w-px bg-border" />
              {activity.map((a, i) => {
                const Icon = KIND_ICON[a.kind]
                return (
                  <li key={i} className="relative flex gap-3">
                    <span
                      className={cn(
                        'relative z-10 flex size-[30px] shrink-0 items-center justify-center rounded-full border border-border bg-surface text-fg-subtle',
                        i === 0 && 'border-accent/40 text-accent',
                        a.kind === 'billing' && 'border-warning/40 text-warning',
                      )}
                    >
                      <Icon className="size-3.5" />
                    </span>
                    <div className="min-w-0 pt-1">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-[13px] font-medium">{a.title}</span>
                        <span className="text-[11px] text-fg-subtle">{fmt.relative(a.at)}</span>
                      </div>
                      <p className="truncate text-xs text-fg-muted">{a.detail}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </motion.section>
        </motion.div>
      </div>

      <div className="flex items-center gap-2 border-t border-border bg-surface/80 px-6 py-4 backdrop-blur">
        <Button variant="primary" size="sm" className="flex-1" onClick={() => (window.location.href = `mailto:${c.email}`)}>
          <Mail /> Email {c.name.split(' ')[0]}
        </Button>
        <Button variant="secondary" size="sm" className="flex-1" onClick={() => toast.success('Opened in Stripe', { description: `Customer ${c.id}` })}>
          <CreditCard /> View billing
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon-sm" aria-label="More actions">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top">
            <DropdownMenuItem onSelect={() => toast.success('Health check scheduled', { description: 'Your CSM will reach out within 24h.' })}>
              <LifeBuoy /> Schedule health check
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => toast('AI summary queued', { description: `Summarizing ${c.company}’s last 90 days.` })}>
              <Bot /> Summarize with AI
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-danger data-highlighted:bg-danger/10 data-highlighted:text-danger" onSelect={() => onDelete(c)}>
              <Trash2 /> Delete customer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
