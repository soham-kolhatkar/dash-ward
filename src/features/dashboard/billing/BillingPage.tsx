import { motion } from 'motion/react'
import {
  ArrowUpRight,
  Bot,
  Building,
  CalendarClock,
  CreditCard,
  Download,
  ExternalLink,
  HardDrive,
  Pencil,
  Receipt,
  TriangleAlert,
  Users,
  Zap,
} from 'lucide-react'
import { useId, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { Bar, BarChart, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { toast } from 'sonner'
import { BorderBeam, NumberTicker } from '@/components/fx'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input, Label } from '@/components/ui/input'
import { Progress } from '@/components/ui/misc'
import { Tooltip as Tip } from '@/components/ui/tooltip'
import { INVOICES } from '@/data/misc'
import { PLANS, type PlanTier } from '@/features/pricing/plans'
import { fmt } from '@/lib/format'
import { createRng } from '@/lib/random'
import { cn, sleep } from '@/lib/utils'
import { useAuth } from '@/store/auth'
import { PageHeader } from '../PageHeader'
import { ChartTooltip } from '../shared/ChartTooltip'
import { ConfirmDialog } from '../shared/ConfirmDialog'
import { SectionCard } from '../shared/SectionCard'
import { CreditCardVisual } from './CreditCard'
import { PlanDialog, type Cycle } from './PlanDialog'

const RESET_DAYS = 9
const renewal = new Date(Date.now() + RESET_DAYS * 864e5)

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
}

const METERS = [
  { key: 'events', label: 'Tracked events', icon: <Zap />, used: 3_200_000, limit: 5_000_000, fmt: (n: number) => fmt.compact(n) },
  { key: 'ai', label: 'AI queries', icon: <Bot />, used: 1_742, limit: 2_000, fmt: (n: number) => fmt.number(n) },
  { key: 'seats', label: 'Seats', icon: <Users />, used: 12, limit: 15, fmt: (n: number) => fmt.number(n) },
  { key: 'storage', label: 'Warehouse storage', icon: <HardDrive />, used: 18.4, limit: 50, fmt: (n: number) => `${n} GB` },
]

const SPEND = [
  { label: 'Plan', pct: 52, color: 'var(--chart-1)' },
  { label: 'Seats', pct: 36, color: 'var(--chart-2)' },
  { label: 'Usage add-ons', pct: 12, color: 'var(--chart-3)' },
]

const tone = (pct: number) =>
  pct >= 90
    ? { bar: 'bg-danger', text: 'text-danger', label: 'Almost full' }
    : pct >= 75
      ? { bar: 'bg-warning', text: 'text-warning', label: 'Approaching limit' }
      : { bar: 'bg-gradient-brand', text: 'text-fg-subtle', label: 'Healthy' }

function usageSeries() {
  const rng = createRng(404)
  const start = new Date(renewal.getTime() - 30 * 864e5)
  const raw = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(start.getTime() + i * 864e5)
    const weekend = d.getDay() === 0 || d.getDay() === 6
    const projected = i >= 30 - RESET_DAYS
    return {
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      events: Math.round((weekend ? 96_000 : 168_000) * rng.range(0.85, 1.15) * (1 + i / 90)),
      projected,
    }
  })
  // Scale so the elapsed days add up to the meter's 3.2M.
  const k = 3_200_000 / raw.filter((d) => !d.projected).reduce((a, d) => a + d.events, 0)
  return raw.map((d) => ({ ...d, events: Math.round(d.events * k) }))
}

export default function BillingPage() {
  const user = useAuth((s) => s.user)
  const [planId, setPlanId] = useState<PlanTier['id']>('scale')
  const [cycle, setCycle] = useState<Cycle>('monthly')
  const [planOpen, setPlanOpen] = useState(false)
  const [cardOpen, setCardOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [card, setCard] = useState({ last4: '4242', expiry: '08/28' })
  const [paid, setPaid] = useState<Set<string>>(new Set())
  const plan = PLANS.find((p) => p.id === planId)!
  const price = cycle === 'yearly' ? plan.yearly : plan.monthly
  const series = useMemo(() => usageSeries(), [])
  const spent = series.filter((d) => !d.projected).reduce((a, d) => a + d.events, 0)
  const projectedTotal = series.reduce((a, d) => a + d.events, 0)
  const gid = useId().replace(/:/g, '')

  return (
    <div>
      <PageHeader
        title="Billing"
        description="Your plan, usage, payment method and invoices."
        actions={
          <Button variant="secondary" size="sm" onClick={() => toast('Opening Stripe customer portal…', { description: 'You’ll be redirected in a new tab.' })}>
            <ExternalLink /> Billing portal
          </Button>
        }
      />

      <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.07 } } }} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Plan hero */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="relative h-full overflow-hidden">
            <BorderBeam size={220} duration={10} />
            <div aria-hidden className="pointer-events-none absolute -top-24 -right-16 size-80 rounded-full bg-accent/20 blur-3xl dark:bg-accent/25" />
            <div aria-hidden className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-accent-2/15 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_65%)]" />
            <div className="relative flex h-full flex-col p-6 sm:p-7">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-fg-muted">Current plan</span>
                {cancelled ? <Badge variant="warning">Cancels {fmt.shortDate(renewal)}</Badge> : <Badge variant="success">Active</Badge>}
              </div>
              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <motion.h2
                    key={plan.id}
                    initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    className="text-gradient animate-gradient-x font-serif text-6xl leading-none tracking-tight italic sm:text-7xl"
                  >
                    {plan.name}
                  </motion.h2>
                  <p className="mt-3 max-w-md text-sm text-fg-muted">{plan.tagline}</p>
                </div>
                <div className="sm:text-right">
                  <div className="flex items-baseline gap-1 sm:justify-end">
                    <NumberTicker value={price} startOnView={false} format={(n) => fmt.currency(n)} className="font-mono text-3xl font-semibold tracking-tight" />
                    <span className="text-sm text-fg-subtle">/mo</span>
                  </div>
                  <p className="mt-1 text-xs text-fg-subtle">Billed {cycle} · + seats and usage</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {plan.features.slice(0, 5).map((f) => (
                  <span key={f} className="rounded-full border border-border bg-surface/70 px-2.5 py-1 text-[11px] text-fg-muted backdrop-blur">
                    {f}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <div>
                    <div className="text-[11px] text-fg-subtle">{cancelled ? 'Access until' : 'Renews on'}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 font-medium">
                      <CalendarClock className="size-3.5 text-fg-subtle" /> {fmt.date(renewal)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-fg-subtle">Next invoice</div>
                    <div className="mt-0.5 font-mono font-medium tabular-nums">{cancelled ? '—' : fmt.currency(2400)}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to="/pricing" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                    Compare plans
                  </Link>
                  <Button variant="brand" size="sm" onClick={() => setPlanOpen(true)}>
                    Change plan <ArrowUpRight />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Payment method */}
        <motion.div variants={item}>
          <SectionCard
            title="Payment method"
            description="Charged automatically on renewal"
            icon={<CreditCard />}
            className="h-full"
            action={
              <Button variant="secondary" size="xs" onClick={() => setCardOpen(true)}>
                Update
              </Button>
            }
          >
            <CreditCardVisual last4={card.last4} expiry={card.expiry} name={user?.name ?? 'Ava Chen'} className="mx-auto max-w-[340px]" />
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-fg-muted">
                Visa ending <span className="font-mono text-fg">{card.last4}</span>
              </span>
              <span className="text-fg-subtle">
                Expires <span className="font-mono">{card.expiry}</span>
              </span>
            </div>
          </SectionCard>
        </motion.div>

        {/* Usage */}
        <motion.div variants={item} className="lg:col-span-2">
          <SectionCard
            title="Usage this period"
            description={`${fmt.shortDate(new Date(renewal.getTime() - 30 * 864e5))} – ${fmt.shortDate(renewal)}`}
            icon={<Zap />}
            action={
              <Badge>
                <CalendarClock /> Resets in {RESET_DAYS} days
              </Badge>
            }
          >
            <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {METERS.map((m, i) => {
                const pct = (m.used / m.limit) * 100
                const t = tone(pct)
                return (
                  <div key={m.key}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-[13px] text-fg-muted [&_svg]:size-3.5 [&_svg]:text-fg-subtle">
                        {m.icon} {m.label}
                      </span>
                      <span className={cn('text-[11px]', t.text)}>{pct.toFixed(0)}%</span>
                    </div>
                    <div className="mt-1.5 flex items-baseline gap-1">
                      <NumberTicker value={m.used} startOnView={false} duration={1.2 + i * 0.1} format={(n) => m.fmt(m.key === 'storage' ? Math.round(n * 10) / 10 : n)} className="font-mono text-lg font-semibold tabular-nums" />
                      <span className="font-mono text-xs text-fg-subtle">/ {m.fmt(m.limit)}</span>
                    </div>
                    <Progress value={pct} className="mt-2" barClassName={t.bar} />
                    {pct >= 75 && <p className={cn('mt-1.5 text-[11px]', t.text)}>{t.label} · add-ons from $49/mo</p>}
                  </div>
                )
              })}
            </div>

            <div className="mt-7 border-t border-border pt-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <div className="text-[13px] font-medium">Daily events</div>
                  <div className="text-[11px] text-fg-subtle">
                    <span className="font-mono tabular-nums">{fmt.compact(spent)}</span> so far · on pace for{' '}
                    <span className="font-mono text-fg-muted tabular-nums">{fmt.compact(projectedTotal)}</span> of 5M
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-fg-muted">
                  <span className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-chart-1" /> Actual</span>
                  <span className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-chart-1/30" /> Projected</span>
                </div>
              </div>
              <div className="mt-3 -ml-3 h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={series} margin={{ top: 8, right: 0, bottom: 0, left: 0 }} barCategoryGap={3}>
                    <defs>
                      <pattern id={`stripe-${gid}`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <rect width="4" height="4" fill="var(--chart-1)" opacity="0.14" />
                        <rect width="1.5" height="4" fill="var(--chart-1)" opacity="0.4" />
                      </pattern>
                    </defs>
                    <XAxis dataKey="label" tickLine={false} axisLine={false} interval={6} tickMargin={6} />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => fmt.compact(v)} width={44} />
                    <Tooltip cursor={{ fill: 'var(--surface-3)', opacity: 0.4 }} content={(p) => <ChartTooltip active={p.active} payload={p.payload} label={p.label} format={(v) => fmt.number(v)} />} />
                    <ReferenceLine y={5_000_000 / 30} stroke="var(--warning)" strokeDasharray="4 4" label={{ value: 'Daily budget', position: 'insideTopRight', fill: 'var(--fg-subtle)', fontSize: 10 }} />
                    <Bar dataKey="events" name="Events" radius={[4, 4, 1, 1]} animationDuration={900}>
                      {series.map((d) => (
                        <Cell key={d.label} fill={d.projected ? `url(#stripe-${gid})` : 'var(--chart-1)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </SectionCard>
        </motion.div>

        {/* Billing details */}
        <motion.div variants={item}>
          <SectionCard
            title="Billing details"
            description="Shown on every invoice"
            icon={<Building />}
            className="h-full"
            action={
              <Tip content="Edit details">
                <Button variant="ghost" size="icon-sm" aria-label="Edit billing details" onClick={() => toast('Billing details are managed in the Stripe portal')}>
                  <Pencil />
                </Button>
              </Tip>
            }
          >
            <dl className="space-y-4 text-sm">
              <Detail label="Billing email" value="finance@northwind.io" />
              <Detail label="Company" value="Northwind Analytics, Inc." />
              <Detail
                label="Address"
                value={
                  <>
                    548 Market St, Suite 71
                    <br />
                    San Francisco, CA 94104, US
                  </>
                }
              />
              <Detail label="Tax ID" value={<span className="font-mono">US EIN 84-2917731</span>} />
              <Detail label="Currency" value="USD · invoices in English" />
            </dl>
            <div className="mt-6 rounded-xl border border-border bg-surface-2/50 p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] text-fg-subtle">Spend this year</span>
                <span className="font-mono text-[11px] text-success">−18% vs. list</span>
              </div>
              <NumberTicker value={14160} startOnView={false} format={(n) => fmt.currency(n)} className="mt-1 block font-mono text-xl font-semibold tabular-nums" />
              <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-surface-3">
                {SPEND.map((s, i) => (
                  <motion.div
                    key={s.label}
                    className="h-full first:rounded-l-full last:rounded-r-full"
                    style={{ background: s.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={{ duration: 1, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  />
                ))}
              </div>
              <ul className="mt-3 space-y-1.5">
                {SPEND.map((s) => (
                  <li key={s.label} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-fg-muted">
                      <span className="size-2 rounded-sm" style={{ background: s.color }} /> {s.label}
                    </span>
                    <span className="font-mono text-fg tabular-nums">{fmt.currency((14160 * s.pct) / 100)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>
        </motion.div>

        {/* Invoices */}
        <motion.div variants={item} className="lg:col-span-3">
          <SectionCard
            title="Invoices"
            description="Receipts are emailed to finance@northwind.io"
            icon={<Receipt />}
            bodyClassName="p-0 pt-4"
            action={
              <Button variant="ghost" size="xs" onClick={() => toast.success('Preparing ZIP of 8 invoices', { description: 'We’ll email it to you when it’s ready.' })}>
                <Download /> Download all
              </Button>
            }
          >
            <div className="relative overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-y border-border text-xs text-fg-subtle">
                    <th className="py-2.5 pl-5 font-medium">Invoice</th>
                    <th className="px-3 font-medium">Date</th>
                    <th className="px-3 font-medium">Plan</th>
                    <th className="px-3 font-medium">Status</th>
                    <th className="px-3 text-right font-medium">Amount</th>
                    <th className="w-24 pr-5">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {INVOICES.map((inv) => {
                    const due = inv.status === 'due' && !paid.has(inv.id)
                    return (
                      <tr key={inv.id} className="group border-b border-border/70 transition-colors last:border-0 hover:bg-surface-2/60">
                        <td className="py-3 pl-5 font-mono text-[13px]">{inv.id}</td>
                        <td className="px-3 text-fg-muted">{fmt.date(inv.date)}</td>
                        <td className="px-3 text-fg-muted">{inv.plan}</td>
                        <td className="px-3">
                          {due ? (
                            <Badge variant="warning">
                              <span className="size-1.5 rounded-full bg-current" /> Due {fmt.shortDate(renewal)}
                            </Badge>
                          ) : (
                            <Badge variant="success">
                              <span className="size-1.5 rounded-full bg-current" /> Paid
                            </Badge>
                          )}
                        </td>
                        <td className="px-3 text-right font-mono text-[13px] tabular-nums">{fmt.currency(inv.amount)}.00</td>
                        <td className="pr-5">
                          <div className="flex items-center justify-end gap-1">
                            {due && (
                              <Button
                                size="xs"
                                variant="secondary"
                                onClick={async () => {
                                  const id = toast.loading(`Charging Visa •••• ${card.last4}…`)
                                  await sleep(900)
                                  setPaid((s) => new Set(s).add(inv.id))
                                  toast.success(`${inv.id} paid`, { id, description: `${fmt.currency(inv.amount)}.00 charged` })
                                }}
                              >
                                Pay now
                              </Button>
                            )}
                            <Tip content="Download PDF">
                              <Button variant="ghost" size="icon-sm" aria-label={`Download ${inv.id}`} onClick={() => toast.success(`Downloading ${inv.id}.pdf`, { description: `${fmt.date(inv.date)} · ${fmt.currency(inv.amount)}.00` })}>
                                <Download />
                              </Button>
                            </Tip>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </motion.div>

        {/* Danger zone */}
        <motion.div variants={item} className="lg:col-span-3">
          <Card className="border-danger/25 dark:bg-surface/70">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-danger/25 bg-danger/10 text-danger">
                  <TriangleAlert className="size-4" />
                </span>
                <div>
                  <h3 className="text-sm font-medium">{cancelled ? 'Subscription scheduled to cancel' : 'Cancel subscription'}</h3>
                  <p className="mt-0.5 text-xs text-fg-subtle">
                    {cancelled
                      ? `Your workspace stays on ${plan.name} until ${fmt.date(renewal)}, then moves to read-only.`
                      : `You keep access until ${fmt.date(renewal)}. Dashboards and data are kept for 30 days after that.`}
                  </p>
                </div>
              </div>
              {cancelled ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setCancelled(false)
                    toast.success('Subscription resumed', { description: `Welcome back to ${plan.name}.` })
                  }}
                >
                  Resume subscription
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="border-danger/40 text-danger hover:bg-danger/10" onClick={() => setCancelOpen(true)}>
                  Cancel subscription
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>

      <PlanDialog
        open={planOpen}
        onOpenChange={setPlanOpen}
        current={planId}
        cycle={cycle}
        onConfirm={(id, c) => {
          setPlanId(id)
          setCycle(c)
          setCancelled(false)
        }}
      />
      <CardDialog
        open={cardOpen}
        onOpenChange={setCardOpen}
        onSave={(c) => {
          setCard(c)
          toast.success('Payment method updated', { description: `Visa ending ${c.last4} will be charged on ${fmt.shortDate(renewal)}.` })
        }}
      />
      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title={`Cancel ${plan.name}?`}
        description={`Your subscription ends on ${fmt.date(renewal)}. You won’t be charged again.`}
        actionLabel="Cancel subscription"
        onConfirm={() => {
          setCancelled(true)
          toast('Subscription cancelled', { description: `Access continues until ${fmt.date(renewal)}.` })
        }}
      >
        <ul className="mb-5 space-y-2 rounded-xl border border-border bg-surface-2/50 p-4 text-sm text-fg-muted">
          {['AI Analyst and anomaly alerts turn off', '12 teammates lose edit access', 'Scheduled reports stop sending'].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-danger" /> {t}
            </li>
          ))}
        </ul>
      </ConfirmDialog>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] text-fg-subtle">{label}</dt>
      <dd className="mt-0.5 text-[13px] text-fg">{value}</dd>
    </div>
  )
}

function CardDialog({ open, onOpenChange, onSave }: { open: boolean; onOpenChange: (o: boolean) => void; onSave: (c: { last4: string; expiry: string }) => void }) {
  const [num, setNum] = useState('')
  const [exp, setExp] = useState('')
  const [cvc, setCvc] = useState('')
  const [busy, setBusy] = useState(false)
  const digits = num.replace(/\D/g, '')
  const valid = digits.length >= 15 && /^\d{2}\/\d{2}$/.test(exp) && cvc.length >= 3
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Update payment method" description="Your card is stored securely by Stripe. Dashward never sees the full number.">
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault()
            if (!valid) return
            setBusy(true)
            await sleep(900)
            setBusy(false)
            onSave({ last4: digits.slice(-4), expiry: exp })
            onOpenChange(false)
            setNum('')
            setExp('')
            setCvc('')
          }}
        >
          <div>
            <Label htmlFor="cc-num">Card number</Label>
            <Input
              id="cc-num"
              inputMode="numeric"
              autoComplete="cc-number"
              icon={<CreditCard />}
              placeholder="4242 4242 4242 4242"
              className="font-mono tracking-wider"
              value={num}
              onChange={(e) =>
                setNum(
                  e.target.value
                    .replace(/\D/g, '')
                    .slice(0, 16)
                    .replace(/(.{4})/g, '$1 ')
                    .trim(),
                )
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cc-exp">Expiry</Label>
              <Input
                id="cc-exp"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                className="font-mono"
                value={exp}
                onChange={(e) => {
                  const d = e.target.value.replace(/\D/g, '').slice(0, 4)
                  setExp(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d)
                }}
              />
            </div>
            <div>
              <Label htmlFor="cc-cvc">CVC</Label>
              <Input id="cc-cvc" inputMode="numeric" autoComplete="cc-csc" placeholder="123" className="font-mono" value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="brand" size="sm" loading={busy} disabled={!valid}>
              Save card
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
