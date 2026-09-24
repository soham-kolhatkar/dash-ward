import { lazy, Suspense } from 'react'
import { BarList, CardMenu } from '@/components/charts'
import { NumberTicker } from '@/components/fx'
import { Card } from '@/components/ui/card'
import { COUNTRIES } from '@/data/metrics'
import { useLiveCounter } from '@/hooks/useLiveSeries'

const Globe = lazy(() => import('@/components/three/Globe'))

export function RealtimeCard() {
  const visitors = useLiveCounter(1284, 26, 2000)
  return (
    <Card className="relative flex h-full flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-4 p-5 pb-0">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium">
            Realtime
            <span className="inline-flex items-center gap-1.5 rounded-full border border-success/25 bg-success/10 px-1.5 py-px text-[10px] font-medium text-success">
              <span className="relative flex size-1.5">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-success" />
                <span className="relative size-1.5 rounded-full bg-success" />
              </span>
              Live
            </span>
          </div>
          <div className="mt-0.5 text-xs text-fg-subtle">Visitors in the last 5 minutes</div>
        </div>
        <CardMenu label="Realtime" />
      </div>

      <div className="px-5 pt-4">
        <NumberTicker
          value={visitors}
          startOnView={false}
          duration={0.9}
          className="text-5xl leading-none font-semibold tracking-tight"
        />
        <div className="mt-2 flex items-center gap-3 text-xs text-fg-subtle">
          <span>active visitors</span>
          <span className="h-3 w-px bg-border-strong" />
          <span>
            Peak today <span className="font-mono text-fg-muted tabular-nums">1,912</span>
          </span>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-6 py-2">
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--glow), transparent 70%)' }}
        />
        <div className="relative w-full max-w-[300px]">
          <Suspense fallback={<div className="aspect-square w-full animate-pulse rounded-full bg-surface-2" />}>
            <Globe />
          </Suspense>
        </div>
      </div>

      <div className="border-t border-border p-3">
        <div className="mb-1 flex items-center justify-between px-2.5 text-[11px] font-medium text-fg-subtle">
          <span>Top countries</span>
          <span>Share</span>
        </div>
        <BarList
          color="var(--accent-2)"
          items={COUNTRIES.map((c) => ({
            name: c.name,
            value: c.value,
            icon: (
              <span className="inline-flex h-4 w-6 items-center justify-center rounded-[4px] border border-border bg-surface-2 font-mono text-[9px] font-semibold text-fg-muted">
                {c.code}
              </span>
            ),
          }))}
          format={(v) => `${v}%`}
        />
      </div>
    </Card>
  )
}
