import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { ArrowUp, Sparkles } from 'lucide-react'
import { Typewriter } from '@/components/fx'
import { useStreamText } from '@/hooks/useStreamText'
import { cn } from '@/lib/utils'

const QA = [
  {
    q: 'Why did signups dip last Thursday?',
    a: 'Signups fell 18% because the “Fall Brand” ad campaign hit its daily cap at 11:40am. Organic was flat. Raising the cap by $400 would have recovered about 210 signups.',
    bars: [62, 70, 66, 74, 41, 68, 72],
    hi: 4,
  },
  {
    q: 'Which plan retains best after 90 days?',
    a: 'Growth leads with 84% 90-day retention, 11 points above Starter. Across every plan, teams that invite 3+ teammates in week one retain best.',
    bars: [58, 84, 79, 51, 88, 73, 65],
    hi: 1,
  },
  {
    q: 'Forecast MRR for the end of Q4',
    a: 'Projected Q4 MRR is $312k (±4%), up 26% from today. Expansion from Growth accounts drives 61% of the increase.',
    bars: [40, 46, 51, 57, 63, 70, 78],
    hi: 6,
  },
]

export function AskWidget() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-80px' })
  const [i, setI] = useState(0)
  const item = QA[i]
  const { text: q, done: qDone } = useStreamText(item.q, { speed: 34, start: inView })

  useEffect(() => {
    if (!qDone || !inView) return
    const t = setTimeout(() => setI((n) => (n + 1) % QA.length), item.a.length * 22 + 4200)
    return () => clearTimeout(t)
  }, [qDone, inView, item])

  return (
    <div ref={ref} className="flex h-full flex-col gap-3 px-6 pb-6 sm:px-7 sm:pb-7">
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-2/70 py-2 pr-2 pl-4 shadow-sm">
        <Sparkles className="size-4 shrink-0 text-accent" />
        <p className="min-w-0 flex-1 truncate text-sm text-fg">
          {q}
          {!qDone && <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-blink bg-accent" />}
        </p>
        <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-xl transition-colors duration-300', qDone ? 'bg-fg text-bg' : 'bg-surface-3 text-fg-subtle')}>
          <ArrowUp className="size-4" />
        </span>
      </div>

      <div className="relative min-h-[11rem] flex-1 overflow-hidden rounded-2xl border border-border bg-surface/70 p-4">
        <AnimatePresence mode="wait">
          {qDone && (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="flex h-full flex-col gap-4 sm:flex-row"
            >
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-2 text-xs text-fg-subtle">
                  <span className="flex size-5 items-center justify-center rounded-md bg-gradient-brand text-white">
                    <Sparkles className="size-3" />
                  </span>
                  Dashward AI · analysed 1.2M rows in 340ms
                </div>
                <p className="text-sm leading-relaxed text-fg-muted">
                  <Typewriter text={item.a} speed={14} />
                </p>
              </div>
              <div className="flex h-24 shrink-0 items-end gap-1.5 sm:h-32 sm:w-40 sm:self-end">
                {item.bars.map((b, j) => (
                  <motion.span
                    key={j}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.3 + j * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={cn('flex-1 origin-bottom rounded-t-md', j === item.hi ? 'bg-gradient-brand' : 'bg-surface-3')}
                    style={{ height: `${b}%` }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!qDone && (
          <div className="flex h-full items-center gap-1.5 text-xs text-fg-subtle">
            {[0, 1, 2].map((d) => (
              <motion.span
                key={d}
                className="size-1.5 rounded-full bg-fg-subtle"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
