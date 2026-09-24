import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import {
  Activity,
  AlertTriangle,
  Check,
  DollarSign,
  FileSpreadsheet,
  Filter,
  LineChart,
  Presentation,
  UserMinus,
  type LucideIcon,
} from 'lucide-react'
import { useOnboarding } from '@/store/onboarding'
import { cn } from '@/lib/utils'
import { Block, StepHeader } from '../StepHeader'

const GOALS: { label: string; icon: LucideIcon; widget: string }[] = [
  { label: 'Track revenue', icon: DollarSign, widget: 'MRR & ARR trend' },
  { label: 'Reduce churn', icon: UserMinus, widget: 'Churn cohorts' },
  { label: 'Understand funnels', icon: Filter, widget: 'Conversion funnel' },
  { label: 'Monitor product usage', icon: Activity, widget: 'Active users' },
  { label: 'Forecast growth', icon: LineChart, widget: '90-day forecast' },
  { label: 'Detect anomalies', icon: AlertTriangle, widget: 'Anomaly feed' },
  { label: 'Build exec reports', icon: Presentation, widget: 'Board summary' },
  { label: 'Replace spreadsheets', icon: FileSpreadsheet, widget: 'Live tables' },
]

export function GoalsStep() {
  const { goals, update } = useOnboarding()
  const toggle = (g: string) => update({ goals: goals.includes(g) ? goals.filter((x) => x !== g) : [...goals, g] })
  const picked = GOALS.filter((g) => goals.includes(g.label))

  return (
    <div>
      <StepHeader step={2} title="What should Dashward" accent="figure out first?">
        Pick as many as you like. We’ll assemble your starter dashboard around them.
      </StepHeader>

      <Block i={0}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium" id="goals-label">
            Your goals
          </h2>
          <span className="flex items-center gap-1.5 text-xs text-fg-muted" aria-live="polite">
            <span className="relative inline-flex h-5 min-w-5 items-center justify-center overflow-hidden rounded-full bg-accent/12 px-1.5 font-medium text-accent tabular-nums">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={goals.length} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }}>
                  {goals.length}
                </motion.span>
              </AnimatePresence>
            </span>
            selected
          </span>
        </div>
        <LayoutGroup>
          <div role="group" aria-labelledby="goals-label" className="flex flex-wrap gap-2.5">
            {GOALS.map((g, i) => {
              const on = goals.includes(g.label)
              return (
                <motion.button
                  layout
                  key={g.label}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(g.label)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ layout: { type: 'spring', stiffness: 500, damping: 34 }, scale: { type: 'spring', stiffness: 500, damping: 25 }, opacity: { delay: 0.1 + i * 0.035 } }}
                  style={{ borderRadius: 999 }}
                  className={cn(
                    'relative flex items-center gap-2 border px-4 py-2.5 text-sm font-medium transition-colors duration-300',
                    on
                      ? 'border-transparent bg-fg text-bg shadow-elevated'
                      : 'border-border bg-surface/70 text-fg-muted hover:border-border-strong hover:text-fg',
                  )}
                >
                  <motion.span layout="position" className="flex">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {on ? (
                        <motion.span
                          key="on"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                          className="flex size-4 items-center justify-center rounded-full bg-gradient-brand text-white"
                        >
                          <Check className="size-2.5" strokeWidth={4} />
                        </motion.span>
                      ) : (
                        <motion.span key="off" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex">
                          <g.icon className="size-4" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.span>
                  <motion.span layout="position">{g.label}</motion.span>
                </motion.button>
              )
            })}
          </div>
        </LayoutGroup>
      </Block>

      <Block i={2} className="mt-10">
        <div className="rounded-3xl border border-dashed border-border-strong bg-surface/40 p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="font-medium text-fg-muted">Your starter dashboard</span>
            <span className="font-mono text-fg-subtle">{picked.length}/8 widgets</span>
          </div>
          <div className="grid min-h-[76px] grid-cols-2 gap-2 sm:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {picked.map((g) => (
                <motion.div
                  layout
                  key={g.label}
                  initial={{ opacity: 0, scale: 0.8, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  className="rounded-xl border border-border bg-surface p-3 shadow-elevated"
                >
                  <g.icon className="size-3.5 text-accent" />
                  <p className="mt-2 truncate text-xs font-medium">{g.widget}</p>
                  <div className="mt-2 flex h-4 items-end gap-0.5">
                    {[40, 70, 55, 90, 65, 100].map((h, j) => (
                      <motion.span
                        key={j}
                        className="flex-1 rounded-sm bg-accent/30"
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 0.15 + j * 0.04 }}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
              {picked.length === 0 && (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full self-center text-center text-sm text-fg-subtle"
                >
                  Widgets appear here as you choose goals.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Block>
    </div>
  )
}
