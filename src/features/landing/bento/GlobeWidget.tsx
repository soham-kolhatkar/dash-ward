import { lazy, Suspense, useRef } from 'react'
import { useInView } from 'motion/react'
import { NumberTicker } from '@/components/fx'
import { useLiveCounter } from '@/hooks/useLiveSeries'

const Globe = lazy(() => import('@/components/three/Globe'))

const CITIES = [
  { city: 'San Francisco', n: '1,204' },
  { city: 'London', n: '986' },
  { city: 'Tokyo', n: '771' },
]

export function GlobeWidget() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '200px' })
  const visitors = useLiveCounter(4821, 40, 1600)

  return (
    <div ref={ref} className="relative flex h-full min-h-[22rem] flex-col">
      <div className="relative z-10 px-6 sm:px-7">
        <div className="flex items-center gap-2 text-[11px] font-medium tracking-wide text-fg-subtle uppercase">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-success opacity-70" />
            <span className="relative size-2 rounded-full bg-success" />
          </span>
          Realtime visitors
        </div>
        <NumberTicker value={visitors} startOnView={false} duration={1.2} className="mt-1 block text-4xl font-semibold tracking-tight" />
        <ul className="mt-4 space-y-1.5">
          {CITIES.map((c) => (
            <li key={c.city} className="flex max-w-52 items-center justify-between text-xs text-fg-muted">
              <span>{c.city}</span>
              <span className="font-mono text-fg">{c.n}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="pointer-events-auto absolute -right-[18%] -bottom-[34%] w-[118%] sm:-right-[20%] md:-bottom-[30%] lg:-right-[28%] lg:-bottom-[8%] lg:w-[140%]">
        <div aria-hidden className="absolute inset-[18%] rounded-full bg-accent/20 blur-3xl" />
        {inView && (
          <Suspense fallback={<div className="aspect-square w-full" />}>
            <Globe />
          </Suspense>
        )}
      </div>
    </div>
  )
}
