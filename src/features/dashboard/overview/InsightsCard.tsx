import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { INSIGHTS, type Insight } from '@/data/misc'
import { useStreamText } from '@/hooks/useStreamText'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

const KIND: Record<Insight['kind'], { label: string; variant: 'danger' | 'success' | 'cyan' | 'accent' }> = {
  anomaly: { label: 'Anomaly', variant: 'danger' },
  opportunity: { label: 'Opportunity', variant: 'success' },
  forecast: { label: 'Forecast', variant: 'cyan' },
  trend: { label: 'Trend', variant: 'accent' },
}

const THINK_MS = 1200
const DWELL_MS = 7000

export function InsightsCard() {
  const [index, setIndex] = useState(0)
  const [thinking, setThinking] = useState(true)
  const [paused, setPaused] = useState(false)
  const reduce = usePrefersReducedMotion()
  const navigate = useNavigate()
  const insight = INSIGHTS[index]
  const stream = useStreamText(insight.body, { speed: 12, start: !thinking })
  const done = reduce || (!thinking && stream.done)

  useEffect(() => {
    setThinking(true)
    const t = setTimeout(() => setThinking(false), reduce ? 0 : THINK_MS)
    return () => clearTimeout(t)
  }, [index, reduce])

  useEffect(() => {
    if (!done || paused) return
    const t = setTimeout(() => setIndex((i) => (i + 1) % INSIGHTS.length), DWELL_MS)
    return () => clearTimeout(t)
  }, [done, paused, index])

  const go = (d: number) => setIndex((i) => (i + d + INSIGHTS.length) % INSIGHTS.length)
  const kind = KIND[insight.kind]

  return (
    <div
      className="group/ins relative isolate h-full overflow-hidden rounded-2xl p-px shadow-elevated"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Gradient border: a slowly rotating conic sweep that brightens while the model is "thinking". */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-border-strong" />
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -z-10 aspect-square w-[180%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow transition-opacity duration-700"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0deg, var(--accent) 60deg, var(--accent-2) 120deg, transparent 180deg, transparent 220deg, var(--accent-3) 280deg, transparent 340deg)',
          animationDuration: '6s',
          opacity: thinking ? 1 : 0.55,
        }}
      />
      <div className="relative flex h-full flex-col overflow-hidden rounded-[15px] bg-surface">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-16 size-56 rounded-full opacity-40 blur-3xl dark:opacity-30"
          style={{ background: 'radial-gradient(circle, var(--accent), transparent 65%)' }}
        />
        <div className="relative flex items-center justify-between gap-3 p-5 pb-0">
          <div className="flex items-center gap-3">
            <span className="relative flex size-8 items-center justify-center rounded-lg bg-gradient-brand text-white shadow-glow dark:text-accent-fg">
              <Sparkles className={cn('size-4', thinking && 'animate-pulse')} />
            </span>
            <div>
              <div className="text-sm font-medium">AI Insights</div>
              <div className="mt-0.5 text-xs text-fg-subtle">
                {thinking ? <span className="text-shimmer">Analyzing 2.4M events…</span> : 'Updated 4 minutes ago'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <span className="mr-1 font-mono text-[11px] text-fg-subtle tabular-nums">
              {index + 1}/{INSIGHTS.length}
            </span>
            <IconBtn label="Previous insight" onClick={() => go(-1)}>
              <ChevronLeft />
            </IconBtn>
            <IconBtn label="Next insight" onClick={() => go(1)}>
              <ChevronRight />
            </IconBtn>
          </div>
        </div>

        <div className="relative flex flex-1 flex-col p-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-1 flex-col"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={kind.variant}>{kind.label}</Badge>
                <span className="rounded-full border border-border bg-surface-2 px-2 py-0.5 font-mono text-[11px] font-medium text-fg tabular-nums">
                  {insight.impact}
                </span>
              </div>
              <h3 className="mt-3 text-[15px] leading-snug font-medium text-balance">{insight.title}</h3>
              {/* Stack the full text invisibly so the card never changes height while streaming. */}
              <div className="mt-2 grid text-sm leading-relaxed text-fg-muted">
                <p aria-hidden className="invisible col-start-1 row-start-1">
                  {insight.body}
                </p>
                <div className="col-start-1 row-start-1">
                  {thinking && !reduce ? (
                    <div className="space-y-2 pt-1">
                      {[92, 100, 84, 58].map((w, i) => (
                        <div key={i} className="skeleton h-3 rounded-full" style={{ width: `${w}%`, animationDelay: `${i * 0.12}s` }} />
                      ))}
                    </div>
                  ) : (
                    <p>
                      {reduce ? insight.body : stream.text}
                      {!done && (
                        <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-blink bg-accent" />
                      )}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate(`/app/ai?q=${encodeURIComponent(insight.title)}`)}
              className="group/btn inline-flex h-8 items-center gap-1.5 rounded-full bg-fg px-3.5 text-xs font-medium text-bg transition hover:bg-fg/90 active:scale-[0.97]"
            >
              Investigate
              <ArrowRight className="size-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </button>
            <div className="flex items-center gap-1.5">
              {INSIGHTS.map((it, i) => (
                <button
                  key={it.id}
                  type="button"
                  aria-label={`Show insight ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className="relative h-1.5 overflow-hidden rounded-full bg-surface-3 transition-all duration-500"
                  style={{ width: i === index ? 22 : 6 }}
                >
                  {i === index && (
                    <motion.span
                      key={`${it.id}-${done && !paused}`}
                      className="absolute inset-y-0 left-0 rounded-full bg-accent"
                      initial={{ width: '0%' }}
                      animate={{ width: done && !paused ? '100%' : '0%' }}
                      transition={{ duration: done && !paused ? DWELL_MS / 1000 : 0, ease: 'linear' }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`.text-shimmer{background:linear-gradient(90deg,var(--fg-subtle) 0%,var(--fg) 45%,var(--fg-subtle) 90%);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:var(--animate-shimmer)}`}</style>
    </div>
  )
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-7 items-center justify-center rounded-lg text-fg-subtle transition hover:bg-surface-2 hover:text-fg [&_svg]:size-4"
    >
      {children}
    </button>
  )
}
