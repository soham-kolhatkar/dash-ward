import { AnimatePresence, motion } from 'motion/react'
import { ChartArea, Flame, RotateCcw, SearchX, UsersRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/misc'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/features/dashboard/PageHeader'
import { RANGES, type Range } from '@/data/metrics'
import { EngagementTab } from './EngagementTab'
import { ALL_FILTERS, filterFactor, type Filters } from './filters'
import { FiltersPopover } from './FiltersPopover'
import { RetentionTab } from './RetentionTab'
import { TabSkeleton } from './TabSkeleton'
import { TrafficTab } from './TrafficTab'

type Tab = 'traffic' | 'retention' | 'engagement'
const LOAD_MS = 600

export default function AnalyticsPage() {
  const [tab, setTab] = useState<Tab>('traffic')
  const [range, setRange] = useState<Range>('30d')
  const [filters, setFilters] = useState<Filters>(ALL_FILTERS)
  const [compare, setCompare] = useState(false)
  const factor = useMemo(() => filterFactor(filters), [filters])

  // Simulated fetch: anything that changes the query shows skeletons briefly.
  const key = `${tab}|${range}|${JSON.stringify(filters)}`
  const [loadedKey, setLoadedKey] = useState('')
  const loading = loadedKey !== key
  useEffect(() => {
    const t = setTimeout(() => setLoadedKey(key), LOAD_MS)
    return () => clearTimeout(t)
  }, [key])

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Traffic, retention and engagement across every touchpoint."
        actions={
          <>
            <Select
              value={range}
              onValueChange={(v) => setRange(v as Range)}
              options={RANGES.map((r) => ({ value: r.value, label: `Last ${r.label}` }))}
              className="w-[150px]"
            />
            <FiltersPopover value={filters} onChange={setFilters} />
            <label className="flex h-9 cursor-pointer items-center gap-2.5 rounded-full border border-border bg-surface-2/60 pr-1.5 pl-3.5 text-sm text-fg-muted transition hover:border-border-strong">
              <span className="whitespace-nowrap">
                Compare <span className="hidden sm:inline">to previous</span>
              </span>
              <Switch checked={compare} onCheckedChange={setCompare} aria-label="Compare to previous period" className="scale-90" />
            </label>
          </>
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-5">
          <TabsList className="max-w-full overflow-x-auto scrollbar-none">
            <TabsTrigger value="traffic" className="max-sm:px-3 max-sm:[&_svg]:hidden">
              <ChartArea /> Traffic
            </TabsTrigger>
            <TabsTrigger value="retention" className="max-sm:px-3 max-sm:[&_svg]:hidden">
              <UsersRound /> Retention
            </TabsTrigger>
            <TabsTrigger value="engagement" className="max-sm:px-3 max-sm:[&_svg]:hidden">
              <Flame /> Engagement
            </TabsTrigger>
          </TabsList>
          <span className="flex items-center gap-2 text-xs text-fg-subtle">
            <span className={factor === 0 ? 'size-1.5 rounded-full bg-danger' : loading ? 'size-1.5 animate-pulse rounded-full bg-warning' : 'size-1.5 rounded-full bg-success'} />
            {factor === 0 ? 'No matching traffic' : loading ? 'Querying 2.4M events…' : factor < 1 ? `Filtered to ${(factor * 100).toFixed(factor < 0.1 ? 1 : 0)}% of traffic` : 'Up to date'}
          </span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {factor === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card>
                <EmptyState
                  icon={<SearchX />}
                  title="No data matches these filters"
                  description="Every option in at least one filter group is switched off. Select at least one device, country and plan."
                  action={
                    <Button variant="secondary" size="sm" onClick={() => setFilters(ALL_FILTERS)}>
                      <RotateCcw /> Reset filters
                    </Button>
                  }
                />
              </Card>
            </motion.div>
          ) : loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
              <TabSkeleton tab={tab} />
            </motion.div>
          ) : (
            <motion.div key={key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
              {tab === 'traffic' && <TrafficTab range={range} factor={factor} compare={compare} filters={filters} />}
              {tab === 'retention' && <RetentionTab factor={factor} compare={compare} />}
              {tab === 'engagement' && <EngagementTab factor={factor} />}
            </motion.div>
          )}
        </AnimatePresence>
      </Tabs>
    </>
  )
}
