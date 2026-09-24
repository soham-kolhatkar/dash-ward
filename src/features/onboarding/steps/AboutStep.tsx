import { AnimatePresence, motion } from 'motion/react'
import { BarChart3, Check, CodeXml, Database, Megaphone, Rocket, Shapes, type LucideIcon } from 'lucide-react'
import { useOnboarding } from '@/store/onboarding'
import { cn } from '@/lib/utils'
import { Block, StepHeader } from '../StepHeader'

const ROLES: { id: string; label: string; desc: string; icon: LucideIcon; tint: string }[] = [
  { id: 'founder', label: 'Founder', desc: 'The whole picture', icon: Rocket, tint: 'var(--accent)' },
  { id: 'product', label: 'Product', desc: 'Adoption & funnels', icon: Shapes, tint: 'var(--accent-2)' },
  { id: 'engineering', label: 'Engineering', desc: 'Reliability & usage', icon: CodeXml, tint: 'var(--accent-3)' },
  { id: 'data', label: 'Data', desc: 'Models & pipelines', icon: Database, tint: 'var(--accent-4)' },
  { id: 'marketing', label: 'Marketing', desc: 'Campaigns & CAC', icon: Megaphone, tint: 'var(--warning)' },
  { id: 'other', label: 'Other', desc: 'A bit of everything', icon: BarChart3, tint: 'var(--success)' },
]

const SIZES = ['1-10', '11-50', '51-200', '201-1000', '1000+']

export function AboutStep() {
  const { role, teamSize, update } = useOnboarding()
  return (
    <div>
      <StepHeader step={1} title="Tell us about" accent="you">
        We’ll tune your default metrics, alerts and AI suggestions to the way you work.
      </StepHeader>

      <Block i={0}>
        <h2 className="mb-3 text-sm font-medium" id="role-label">
          What best describes your role?
        </h2>
        <div role="group" aria-labelledby="role-label" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ROLES.map((r, i) => {
            const on = role === r.id
            return (
              <motion.button
                key={r.id}
                type="button"
                aria-pressed={on}
                onClick={() => update({ role: r.id })}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, scale: on ? 1.03 : 1 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 380, damping: 20, opacity: { delay: 0.15 + i * 0.04, duration: 0.4 } }}
                style={{ ['--tint' as string]: r.tint }}
                className={cn(
                  'group relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border p-4 text-left transition-[border-color,background-color,box-shadow] duration-300',
                  on
                    ? 'border-accent bg-accent/[0.06] shadow-glow'
                    : 'border-border bg-surface/70 hover:border-border-strong hover:bg-surface',
                )}
              >
                <div
                  aria-hidden
                  className={cn('absolute -top-10 -right-10 size-28 rounded-full blur-2xl transition-opacity duration-500', on ? 'opacity-40' : 'opacity-0 group-hover:opacity-20')}
                  style={{ background: 'var(--tint)' }}
                />
                <span
                  className="relative flex size-10 items-center justify-center rounded-xl border border-border transition-colors"
                  style={{ color: 'var(--tint)', background: 'color-mix(in oklch, var(--tint) 12%, transparent)' }}
                >
                  <r.icon className="size-5" />
                </span>
                <span className="relative">
                  <span className="block text-sm font-semibold">{r.label}</span>
                  <span className="block text-xs text-fg-muted">{r.desc}</span>
                </span>
                <AnimatePresence>
                  {on && (
                    <motion.span
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-accent text-white"
                    >
                      <Check className="size-3" strokeWidth={3.5} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>
      </Block>

      <Block i={2} className="mt-9">
        <h2 className="mb-3 text-sm font-medium" id="size-label">
          How big is your team?
        </h2>
        <div role="group" aria-labelledby="size-label" className="grid grid-cols-5 gap-0.5 rounded-full border border-border bg-surface/70 p-1 sm:inline-grid sm:gap-1">
          {SIZES.map((s) => {
            const on = teamSize === s
            return (
              <button
                key={s}
                type="button"
                aria-pressed={on}
                onClick={() => update({ teamSize: s })}
                className={cn(
                  'relative rounded-full px-1 py-2 text-[13px] font-medium whitespace-nowrap transition-colors sm:px-4 sm:text-sm',
                  on ? 'text-bg' : 'text-fg-muted hover:text-fg',
                )}
              >
                {on && (
                  <motion.span
                    layoutId="team-size-pill"
                    className="absolute inset-0 rounded-[inherit] bg-fg shadow-elevated"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
                <span className="relative tabular-nums">{s}</span>
              </button>
            )
          })}
        </div>
      </Block>
    </div>
  )
}
