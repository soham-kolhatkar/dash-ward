import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  CircleDollarSign,
  Copy,
  Download,
  Ellipsis,
  Eye,
  FlaskConical,
  Mail,
  Rows2,
  Rows4,
  Search,
  SearchX,
  ShieldAlert,
  Tag,
  Trash2,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { NumberTicker } from '@/components/fx'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown'
import { Input } from '@/components/ui/input'
import { EmptyState, Kbd } from '@/components/ui/misc'
import { Select } from '@/components/ui/select'
import { Tooltip } from '@/components/ui/tooltip'
import { CUSTOMERS, type Customer, type Plan, type Status } from '@/data/customers'
import { fmt } from '@/lib/format'
import { cn } from '@/lib/utils'
import { PageHeader } from '../PageHeader'
import { downloadFile, toCsv } from '../shared/download'
import { FloatingBar } from '../shared/FloatingBar'
import { PillTabs } from '../shared/PillTabs'
import { AddCustomerDialog } from './AddCustomerDialog'
import { HealthRing, StatusLabel } from './bits'
import { CustomerSheet } from './CustomerSheet'
import { PLAN_VARIANT, STATUS_META } from './meta'

type SortKey = 'name' | 'company' | 'plan' | 'status' | 'mrr' | 'seats' | 'health' | 'lastActive'
type Sort = { key: SortKey; dir: 'asc' | 'desc' } | null
type StatusFilter = 'all' | Status

const PAGE_SIZE = 10
const PLAN_ORDER: Plan[] = ['Starter', 'Growth', 'Scale', 'Enterprise']
const STATUS_ORDER: Status[] = ['active', 'trial', 'past_due', 'churned']
const TAGS = ['VIP', 'Expansion', 'Needs onboarding', 'Renewal Q4']

const compare: Record<SortKey, (a: Customer, b: Customer) => number> = {
  name: (a, b) => a.name.localeCompare(b.name),
  company: (a, b) => a.company.localeCompare(b.company),
  plan: (a, b) => PLAN_ORDER.indexOf(a.plan) - PLAN_ORDER.indexOf(b.plan),
  status: (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status),
  mrr: (a, b) => a.mrr - b.mrr,
  seats: (a, b) => a.seats - b.seats,
  health: (a, b) => a.health - b.health,
  lastActive: (a, b) => new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime(),
}

const CSV_COLUMNS: { key: keyof Customer; label: string }[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'company', label: 'Company' },
  { key: 'plan', label: 'Plan' },
  { key: 'status', label: 'Status' },
  { key: 'mrr', label: 'MRR (USD)' },
  { key: 'seats', label: 'Seats' },
  { key: 'country', label: 'Country' },
  { key: 'health', label: 'Health' },
  { key: 'joined', label: 'Joined' },
  { key: 'lastActive', label: 'Last active' },
]

function exportCsv(rows: Customer[], name: string) {
  downloadFile(toCsv(rows as unknown as Record<string, unknown>[], CSV_COLUMNS as { key: string; label: string }[]), name)
  toast.success(`Exported ${rows.length} customer${rows.length === 1 ? '' : 's'}`, { description: name })
}

export default function CustomersPage() {
  const [params, setParams] = useSearchParams()
  const [rows, setRows] = useState<Customer[]>(CUSTOMERS)
  const [query, setQuery] = useState(() => params.get('q') ?? '')
  const [q, setQ] = useState(query)
  const [status, setStatus] = useState<StatusFilter>('all')
  const [plan, setPlan] = useState<'all' | Plan>('all')
  const [compact, setCompact] = useState(false)
  const [sort, setSort] = useState<Sort>(null)
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [openId, setOpenId] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [fresh, setFresh] = useState<string | null>(null)
  const [tags, setTags] = useState<Record<string, string>>({})
  const searchRef = useRef<HTMLInputElement>(null)

  // Debounce search and mirror it to ?q=
  useEffect(() => {
    const id = setTimeout(() => {
      setQ(query.trim())
      setPage(0)
      setParams(
        (p) => {
          const next = new URLSearchParams(p)
          if (query.trim()) next.set('q', query.trim())
          else next.delete('q')
          return next
        },
        { replace: true },
      )
    }, 220)
    return () => clearTimeout(id)
  }, [query, setParams])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(t.tagName) && !t.isContentEditable) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const base = useMemo(() => {
    const needle = q.toLowerCase()
    return rows.filter(
      (c) =>
        (plan === 'all' || c.plan === plan) &&
        (!needle || c.name.toLowerCase().includes(needle) || c.email.includes(needle) || c.company.toLowerCase().includes(needle)),
    )
  }, [rows, q, plan])

  const filtered = useMemo(() => {
    const list = status === 'all' ? base : base.filter((c) => c.status === status)
    if (!sort) return list
    const s = [...list].sort(compare[sort.key])
    return sort.dir === 'desc' ? s.reverse() : s
  }, [base, status, sort])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pages - 1)
  const visible = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE)
  const openCustomer = rows.find((c) => c.id === openId) ?? null

  const counts = useMemo(() => {
    const m: Record<StatusFilter, number> = { all: base.length, active: 0, trial: 0, past_due: 0, churned: 0 }
    base.forEach((c) => m[c.status]++)
    return m
  }, [base])

  const stats = useMemo(() => {
    const atRisk = rows.filter((c) => c.status !== 'churned' && c.health < 50)
    const active = rows.filter((c) => c.status === 'active').length
    return {
      mrr: rows.reduce((a, c) => a + c.mrr, 0),
      active,
      activeShare: rows.length ? (active / rows.length) * 100 : 0,
      trials: rows.filter((c) => c.status === 'trial').length,
      atRisk: atRisk.length,
      atRiskMrr: atRisk.reduce((a, c) => a + c.mrr, 0),
    }
  }, [rows])

  const filtersActive = !!q || status !== 'all' || plan !== 'all'
  const clearFilters = () => {
    setQuery('')
    setQ('')
    setStatus('all')
    setPlan('all')
    setPage(0)
  }

  const toggleSort = (key: SortKey) => {
    setSort((s) => {
      const first = key === 'name' || key === 'company' ? 'asc' : 'desc'
      if (s?.key !== key) return { key, dir: first }
      if (s.dir === first) return { key, dir: first === 'asc' ? 'desc' : 'asc' }
      return null
    })
    setPage(0)
  }

  const pageIds = visible.map((c) => c.id)
  const pageSelected = pageIds.filter((id) => selected.has(id)).length
  const headerChecked = pageSelected === 0 ? false : pageSelected === pageIds.length ? true : 'indeterminate'
  const toggleAll = () =>
    setSelected((s) => {
      const next = new Set(s)
      if (headerChecked === true) pageIds.forEach((id) => next.delete(id))
      else pageIds.forEach((id) => next.add(id))
      return next
    })
  const toggleOne = (id: string) =>
    setSelected((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const remove = (ids: string[]) => {
    const snapshot = rows
    setRows((r) => r.filter((c) => !ids.includes(c.id)))
    setSelected(new Set())
    if (ids.includes(openId ?? '')) setOpenId(null)
    toast(`Deleted ${ids.length} customer${ids.length === 1 ? '' : 's'}`, {
      description: 'Billing history is kept for 30 days.',
      action: { label: 'Undo', onClick: () => setRows(snapshot) },
    })
  }

  const tag = (ids: string[], t: string) => {
    setTags((m) => ({ ...m, ...Object.fromEntries(ids.map((id) => [id, t])) }))
    toast.success(`Tagged ${ids.length} customer${ids.length === 1 ? '' : 's'}`, { description: `Added “${t}”` })
  }

  const listKey = `${current}|${status}|${plan}|${q}|${sort?.key}|${sort?.dir}`

  return (
    <div>
      <PageHeader
        title="Customers"
        description={
          <>
            <span className="font-mono text-fg tabular-nums">{rows.length}</span> accounts across{' '}
            <span className="font-mono text-fg tabular-nums">{new Set(rows.map((r) => r.company)).size}</span> companies
          </>
        }
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => exportCsv(filtered, `dashward-customers-${new Date().toISOString().slice(0, 10)}.csv`)}>
              <Download /> Export CSV
            </Button>
            <Button variant="brand" size="sm" onClick={() => setAddOpen(true)}>
              <UserPlus /> Add customer
            </Button>
          </>
        }
      />

      {/* Summary strip */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
        className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        <MiniStat
          icon={<CircleDollarSign />}
          tone="var(--accent)"
          label="Total MRR"
          value={<NumberTicker value={stats.mrr} format={(n) => fmt.currency(n)} startOnView={false} />}
          sub={<><span className="text-success">+8.2%</span> vs. last month</>}
        />
        <MiniStat
          icon={<UserCheck />}
          tone="var(--success)"
          label="Active"
          value={<NumberTicker value={stats.active} startOnView={false} />}
          sub={`${stats.activeShare.toFixed(0)}% of all accounts`}
        />
        <MiniStat
          icon={<FlaskConical />}
          tone="var(--accent-2)"
          label="Trials"
          value={<NumberTicker value={stats.trials} startOnView={false} />}
          sub="31% convert on average"
        />
        <MiniStat
          icon={<ShieldAlert />}
          tone="var(--danger)"
          label="At risk"
          value={<NumberTicker value={stats.atRisk} startOnView={false} />}
          sub={<><span className="font-mono text-fg-muted">{fmt.currency(stats.atRiskMrr)}</span> MRR exposed</>}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
        <Card className="overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-border p-3 sm:p-4 xl:flex-row xl:items-center">
            <div className="flex min-w-0 flex-1 flex-col gap-3 md:flex-row md:items-center">
              <div className="w-full md:w-64 md:shrink-0">
                <Input
                  ref={searchRef}
                  icon={<Search />}
                  aria-label="Search customers"
                  placeholder="Search name, email, company"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && setQuery('')}
                  className="h-9 rounded-full text-[13px]"
                  trailing={
                    query ? (
                      <button type="button" aria-label="Clear search" onClick={() => setQuery('')} className="flex size-6 items-center justify-center rounded-full text-fg-subtle transition hover:bg-surface-3 hover:text-fg">
                        <X className="size-3.5" />
                      </button>
                    ) : (
                      <Kbd className="mr-1 hidden md:inline-flex">/</Kbd>
                    )
                  }
                />
              </div>
              <PillTabs
                label="Filter by status"
                value={status}
                onChange={(v) => {
                  setStatus(v)
                  setPage(0)
                }}
                options={[
                  { value: 'all', label: 'All', count: counts.all },
                  ...STATUS_ORDER.map((s) => ({ value: s, label: STATUS_META[s].label, count: counts[s], dot: STATUS_META[s].color })),
                ]}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={plan}
                onValueChange={(v) => {
                  setPlan(v as 'all' | Plan)
                  setPage(0)
                }}
                options={[{ value: 'all', label: 'All plans' }, ...PLAN_ORDER.map((p) => ({ value: p, label: p }))]}
                className="h-9 min-w-32 flex-1 text-[13px] md:flex-none"
              />
              <div className="hidden items-center rounded-full border border-border bg-surface-2/60 p-0.5 md:flex" role="group" aria-label="Row density">
                {[
                  { v: false, icon: <Rows2 />, label: 'Comfortable' },
                  { v: true, icon: <Rows4 />, label: 'Compact' },
                ].map((d) => (
                  <Tooltip key={d.label} content={d.label}>
                    <button
                      type="button"
                      aria-label={`${d.label} rows`}
                      aria-pressed={compact === d.v}
                      onClick={() => setCompact(d.v)}
                      className={cn(
                        'relative flex size-8 items-center justify-center rounded-full text-fg-subtle transition-colors hover:text-fg [&_svg]:size-4',
                        compact === d.v && 'text-fg',
                      )}
                    >
                      {compact === d.v && (
                        <motion.span layoutId="density-pill" className="absolute inset-0 rounded-full border border-border bg-surface shadow-sm" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
                      )}
                      <span className="relative">{d.icon}</span>
                    </button>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={<SearchX />}
              title="No customers match these filters"
              description={q ? `Nothing found for “${q}”. Try a different name, email or company.` : 'Try widening the status or plan filter.'}
              action={
                <Button variant="secondary" size="sm" onClick={clearFilters}>
                  <X /> Clear filters
                </Button>
              }
            />
          ) : (
            <>
              {/* Desktop table */}
              <div className="relative hidden overflow-x-auto md:block">
                <table className="w-full min-w-[1040px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-fg-subtle">
                      <th className="w-12 py-3 pr-0 pl-5">
                        <Checkbox checked={headerChecked} onCheckedChange={toggleAll} aria-label="Select all on this page" />
                      </th>
                      <SortHeader label="Customer" k="name" sort={sort} onSort={toggleSort} />
                      <SortHeader label="Company" k="company" sort={sort} onSort={toggleSort} />
                      <SortHeader label="Plan" k="plan" sort={sort} onSort={toggleSort} />
                      <SortHeader label="Status" k="status" sort={sort} onSort={toggleSort} />
                      <SortHeader label="MRR" k="mrr" sort={sort} onSort={toggleSort} align="right" />
                      <SortHeader label="Seats" k="seats" sort={sort} onSort={toggleSort} align="right" />
                      <SortHeader label="Health" k="health" sort={sort} onSort={toggleSort} />
                      <SortHeader label="Last active" k="lastActive" sort={sort} onSort={toggleSort} />
                      <th className="w-12 pr-4">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <motion.tbody key={listKey} initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.025 } } }}>
                    {visible.map((c) => {
                      const isSel = selected.has(c.id)
                      return (
                        <motion.tr
                          key={c.id}
                          variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } } }}
                          onClick={() => setOpenId(c.id)}
                          className={cn(
                            'group cursor-pointer border-b border-border/70 transition-colors last:border-0 hover:bg-surface-2/70',
                            isSel && 'bg-accent/[0.06] hover:bg-accent/[0.09]',
                            fresh === c.id && 'animate-[dw-fresh_2.4s_ease-out]',
                          )}
                        >
                          <td className={cn('pr-0 pl-5', compact ? 'py-1.5' : 'py-3')} onClick={(e) => e.stopPropagation()}>
                            <Checkbox checked={isSel} onCheckedChange={() => toggleOne(c.id)} aria-label={`Select ${c.name}`} />
                          </td>
                          <td className={cn('px-3', compact ? 'py-1.5' : 'py-3')}>
                            <div className="flex items-center gap-3">
                              <Avatar name={c.name} className={cn('ring-0 transition-all', compact ? 'size-6' : 'size-8')} />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="truncate font-medium text-fg">{c.name}</span>
                                  {tags[c.id] && <Badge variant="accent" className="py-0 text-[10px]">{tags[c.id]}</Badge>}
                                </div>
                                {!compact && <div className="truncate text-xs text-fg-subtle">{c.email}</div>}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 text-fg-muted">{c.company}</td>
                          <td className="px-3">
                            <Badge variant={PLAN_VARIANT[c.plan]}>{c.plan}</Badge>
                          </td>
                          <td className="px-3">
                            <StatusLabel status={c.status} />
                          </td>
                          <td className="px-3 text-right font-mono text-[13px] tabular-nums">
                            {c.mrr ? fmt.currency(c.mrr) : <span className="text-fg-subtle">—</span>}
                          </td>
                          <td className="px-3 text-right font-mono text-[13px] text-fg-muted tabular-nums">{c.seats}</td>
                          <td className="px-3">
                            <HealthRing value={c.health} size={compact ? 20 : 24} />
                          </td>
                          <td className="px-3 text-[13px] whitespace-nowrap text-fg-muted">{fmt.relative(c.lastActive)}</td>
                          <td className="pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <RowActions c={c} onOpen={() => setOpenId(c.id)} onDelete={() => remove([c.id])} onTag={(t) => tag([c.id], t)} />
                          </td>
                        </motion.tr>
                      )
                    })}
                  </motion.tbody>
                </table>
              </div>

              {/* Mobile list */}
              <motion.ul key={`m-${listKey}`} initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.03 } } }} className="divide-y divide-border md:hidden">
                {visible.map((c) => (
                  <motion.li key={c.id} variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }} className={cn('flex items-center gap-3 px-4 py-3', selected.has(c.id) && 'bg-accent/[0.06]')}>
                    <Checkbox checked={selected.has(c.id)} onCheckedChange={() => toggleOne(c.id)} aria-label={`Select ${c.name}`} />
                    <button type="button" onClick={() => setOpenId(c.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                      <Avatar name={c.name} className="ring-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-medium">{c.name}</span>
                          <span className="font-mono text-[13px] tabular-nums">{c.mrr ? fmt.currency(c.mrr) : '—'}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-2">
                          <span className="flex min-w-0 items-center gap-2">
                            <Badge variant={PLAN_VARIANT[c.plan]} className="py-0">{c.plan}</Badge>
                            <StatusLabel status={c.status} className="text-xs" />
                          </span>
                          <HealthRing value={c.health} size={18} stroke={2.5} />
                        </div>
                      </div>
                    </button>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Pagination */}
              <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 sm:flex-row sm:px-5">
                <p className="text-xs text-fg-subtle">
                  Showing{' '}
                  <span className="font-mono text-fg-muted tabular-nums">
                    {current * PAGE_SIZE + 1}–{Math.min(filtered.length, (current + 1) * PAGE_SIZE)}
                  </span>{' '}
                  of <span className="font-mono text-fg-muted tabular-nums">{filtered.length}</span>
                  {filtersActive && (
                    <button type="button" onClick={clearFilters} className="ml-2 text-accent hover:underline">
                      Clear filters
                    </button>
                  )}
                </p>
                <Pagination page={current} pages={pages} onChange={setPage} />
              </div>
            </>
          )}
        </Card>
      </motion.div>

      <style>{`@keyframes dw-fresh { 0%, 30% { background: color-mix(in oklch, var(--accent) 14%, transparent); } }`}</style>

      <FloatingBar open={selected.size > 0}>
        <span className="mr-2 text-[13px] whitespace-nowrap">
          <span className="font-mono font-medium tabular-nums">{selected.size}</span> <span className="text-fg-muted">selected</span>
        </span>
        <span className="mx-1 h-5 w-px bg-border" />
        <Button variant="ghost" size="xs" onClick={() => exportCsv(rows.filter((c) => selected.has(c.id)), 'dashward-customers-selection.csv')}>
          <Download /> <span className="hidden sm:inline">Export</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="xs">
              <Tag /> <span className="hidden sm:inline">Tag</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="center">
            <DropdownMenuLabel>Apply tag</DropdownMenuLabel>
            {TAGS.map((t) => (
              <DropdownMenuItem key={t} onSelect={() => { tag([...selected], t); setSelected(new Set()) }}>
                <Tag /> {t}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="xs" className="text-danger hover:bg-danger/10 hover:text-danger" onClick={() => remove([...selected])}>
          <Trash2 /> <span className="hidden sm:inline">Delete</span>
        </Button>
        <span className="mx-1 h-5 w-px bg-border" />
        <Tooltip content="Clear selection">
          <Button variant="ghost" size="icon-sm" className="size-7" aria-label="Clear selection" onClick={() => setSelected(new Set())}>
            <X />
          </Button>
        </Tooltip>
      </FloatingBar>

      <CustomerSheet customer={openCustomer} onOpenChange={(o) => !o && setOpenId(null)} onDelete={(c) => remove([c.id])} />
      <AddCustomerDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreate={(c) => {
          setRows((r) => [c, ...r])
          clearFilters()
          setSort(null)
          setFresh(c.id)
          toast.success(`${c.name} added`, { description: `${c.company} · ${c.plan} trial started`, action: { label: 'View', onClick: () => setOpenId(c.id) } })
        }}
      />
    </div>
  )
}

function MiniStat({ icon, label, value, sub, tone }: { icon: ReactNode; label: string; value: ReactNode; sub: ReactNode; tone: string }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-elevated transition-colors hover:border-border-strong dark:bg-surface/70"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 size-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `color-mix(in oklch, ${tone} 22%, transparent)` }}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-fg-muted">{label}</span>
        <span
          className="flex size-7 items-center justify-center rounded-lg [&_svg]:size-3.5"
          style={{ color: tone, background: `color-mix(in oklch, ${tone} 12%, transparent)` }}
        >
          {icon}
        </span>
      </div>
      <div className="mt-2 font-mono text-xl font-semibold tracking-tight tabular-nums sm:text-2xl">{value}</div>
      <div className="mt-1 truncate text-[11px] text-fg-subtle">{sub}</div>
    </motion.div>
  )
}

function SortHeader({ label, k, sort, onSort, align = 'left' }: { label: string; k: SortKey; sort: Sort; onSort: (k: SortKey) => void; align?: 'left' | 'right' }) {
  const active = sort?.key === k
  return (
    <th className={cn('px-3 py-3 font-medium', align === 'right' && 'text-right')} aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button
        type="button"
        onClick={() => onSort(k)}
        className={cn(
          'group/sort -mx-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 transition-colors hover:text-fg',
          align === 'right' && 'flex-row-reverse',
          active && 'text-fg',
        )}
      >
        {label}
        <span className="relative flex size-3.5 items-center justify-center">
          <AnimatePresence initial={false} mode="wait">
            {active ? (
              <motion.span
                key="arrow"
                initial={{ opacity: 0, y: -3 }}
                animate={{ opacity: 1, y: 0, rotate: sort.dir === 'asc' ? 0 : 180 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="text-accent"
              >
                <ArrowUp className="size-3.5" />
              </motion.span>
            ) : (
              <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ChevronsUpDown className="size-3.5 opacity-0 transition-opacity group-hover/sort:opacity-70" />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </button>
    </th>
  )
}

function RowActions({ c, onOpen, onDelete, onTag }: { c: Customer; onOpen: () => void; onDelete: () => void; onTag: (t: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="size-7 opacity-60 group-hover:opacity-100 data-[state=open]:bg-surface-3 data-[state=open]:opacity-100" aria-label={`Actions for ${c.name}`}>
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={onOpen}>
          <Eye /> View profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            navigator.clipboard?.writeText(c.email).catch(() => {})
            toast.success('Email copied', { description: c.email })
          }}
        >
          <Copy /> Copy email
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => (window.location.href = `mailto:${c.email}`)}>
          <Mail /> Send email
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onTag('VIP')}>
          <Tag /> Tag as VIP
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-danger data-highlighted:bg-danger/10 data-highlighted:text-danger" onSelect={onDelete}>
          <Trash2 /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  const items: (number | 'gap')[] = []
  for (let i = 0; i < pages; i++) {
    if (i === 0 || i === pages - 1 || Math.abs(i - page) <= 1) items.push(i)
    else if (items[items.length - 1] !== 'gap') items.push('gap')
  }
  return (
    <nav aria-label="Pagination" className="flex items-center gap-1">
      <Button variant="ghost" size="icon-sm" aria-label="Previous page" disabled={page === 0} onClick={() => onChange(page - 1)}>
        <ChevronLeft />
      </Button>
      {items.map((it, i) =>
        it === 'gap' ? (
          <span key={`g${i}`} className="px-1 text-xs text-fg-subtle">
            …
          </span>
        ) : (
          <button
            key={it}
            type="button"
            aria-current={it === page ? 'page' : undefined}
            onClick={() => onChange(it)}
            className={cn('relative size-8 rounded-full font-mono text-xs tabular-nums transition-colors', it === page ? 'text-fg' : 'text-fg-subtle hover:bg-surface-2 hover:text-fg')}
          >
            {it === page && <motion.span layoutId="page-pill" className="absolute inset-0 rounded-full border border-border bg-surface-2 shadow-sm" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span className="relative">{it + 1}</span>
          </button>
        ),
      )}
      <Button variant="ghost" size="icon-sm" aria-label="Next page" disabled={page >= pages - 1} onClick={() => onChange(page + 1)}>
        <ChevronRight />
      </Button>
    </nav>
  )
}
