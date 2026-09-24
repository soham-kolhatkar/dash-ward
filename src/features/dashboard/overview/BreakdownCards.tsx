import { ArrowDownRight, ArrowUpRight, ChartPie, Funnel as FunnelIcon, FileText } from 'lucide-react'
import { useState } from 'react'
import { BarList, ChartCard, Donut, Funnel } from '@/components/charts'
import { Badge } from '@/components/ui/badge'
import { CHANNELS, FUNNEL, TOP_PAGES } from '@/data/metrics'
import { fmt } from '@/lib/format'
import { cn } from '@/lib/utils'

export function FunnelCard() {
  const overall = (FUNNEL[FUNNEL.length - 1].value / FUNNEL[0].value) * 100
  return (
    <ChartCard title="Conversion funnel" description="Visit to retained · last 30 days" icon={<FunnelIcon />}>
      <div className="mb-5 flex items-baseline gap-2">
        <span className="font-mono text-2xl font-semibold tracking-tight tabular-nums">{overall.toFixed(2)}%</span>
        <span className="text-xs text-fg-subtle">end-to-end conversion</span>
        <Badge variant="success" className="ml-auto font-mono tabular-nums">
          +0.6pt
        </Badge>
      </div>
      <Funnel data={FUNNEL} format={fmt.compact} />
    </ChartCard>
  )
}

const TOTAL_SESSIONS = 184_320
const CHANNEL_DATA = CHANNELS.map((c) => ({ ...c, value: (c.value / 100) * TOTAL_SESSIONS }))

export function ChannelsCard() {
  const [active, setActive] = useState<number | null>(null)
  const data = CHANNEL_DATA
  return (
    <ChartCard title="Acquisition channels" description="Share of sessions" icon={<ChartPie />}>
      <div className="flex flex-col items-center gap-5">
        <Donut data={data} active={active} onActiveChange={setActive} format={fmt.compact} centerLabel="Sessions" size={184} />
        <ul className="w-full space-y-0.5">
          {CHANNELS.map((c, i) => (
            <li key={c.name}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition',
                  active === i ? 'bg-surface-2 text-fg' : 'text-fg-muted',
                  active != null && active !== i && 'opacity-50',
                )}
              >
                <span className="size-2 rounded-full" style={{ background: c.color }} />
                <span className="flex-1 truncate text-left">{c.name}</span>
                <span className="font-mono text-xs text-fg-subtle tabular-nums">{fmt.compact(data[i].value)}</span>
                <span className="w-9 text-right font-mono text-[13px] font-medium text-fg tabular-nums">{c.value}%</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  )
}

export function TopPagesCard() {
  return (
    <ChartCard title="Top pages" description="By views · last 30 days" icon={<FileText />} contentClassName="px-3 pt-4">
      <div className="mb-1 flex items-center justify-between px-2.5 text-[11px] font-medium text-fg-subtle">
        <span>Page</span>
        <span>Views</span>
      </div>
      <BarList
        items={TOP_PAGES.map((p) => ({
          name: p.path,
          value: p.views,
          trailing: (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-mono text-[11px] tabular-nums',
                p.change >= 0 ? 'text-success' : 'text-danger',
              )}
            >
              {p.change >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {Math.abs(p.change).toFixed(1)}%
            </span>
          ),
        }))}
        format={fmt.compact}
        className="[&_.truncate]:font-mono [&_.truncate]:text-[13px]"
      />
    </ChartCard>
  )
}
