import { AnimatePresence, motion } from 'motion/react'
import type { MouseEvent } from 'react'
import { Check, Monitor, Moon, Sun, type LucideIcon } from 'lucide-react'
import { useTheme, type Theme } from '@/store/theme'
import { cn } from '@/lib/utils'
import { Block, StepHeader } from '../StepHeader'

interface Palette {
  bg: string
  surface: string
  border: string
  fg: string
  muted: string
  accent: string
  accent2: string
  accent3: string
}

const LIGHT: Palette = {
  bg: '#f7f6f2',
  surface: '#ffffff',
  border: 'rgba(30, 27, 45, 0.09)',
  fg: '#1e1b2d',
  muted: 'rgba(30, 27, 45, 0.14)',
  accent: '#7a3cf0',
  accent2: '#1596b8',
  accent3: '#6fb514',
}

const DARK: Palette = {
  bg: '#0c0b12',
  surface: '#17161f',
  border: 'rgba(255, 255, 255, 0.08)',
  fg: '#f3f2f8',
  muted: 'rgba(255, 255, 255, 0.12)',
  accent: '#a37cff',
  accent2: '#5fd4f0',
  accent3: '#bdf35a',
}

const AREA = 'M0 34 C 14 30, 22 20, 34 22 S 54 30, 64 18 S 86 8, 100 4 L100 40 L0 40 Z'
const LINE = 'M0 34 C 14 30, 22 20, 34 22 S 54 30, 64 18 S 86 8, 100 4'

function Mock({ p, id }: { p: Palette; id: string }) {
  return (
    <div className="absolute inset-0 flex gap-2 p-2.5" style={{ background: p.bg }}>
      <div className="flex w-7 flex-col items-center gap-1.5 rounded-lg py-2" style={{ background: p.surface, border: `1px solid ${p.border}` }}>
        <span className="size-3.5 rounded-[5px]" style={{ background: `linear-gradient(135deg, ${p.accent}, ${p.accent2})` }} />
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-1 w-3 rounded-full" style={{ background: i === 0 ? p.accent : p.muted }} />
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="h-1.5 w-12 rounded-full" style={{ background: p.fg, opacity: 0.85 }} />
          <span className="size-3 rounded-full" style={{ background: p.muted }} />
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[p.accent, p.accent2, p.accent3].map((c, i) => (
            <div key={i} className="rounded-md p-1.5" style={{ background: p.surface, border: `1px solid ${p.border}` }}>
              <span className="block h-1 w-5 rounded-full" style={{ background: p.muted }} />
              <span className="mt-1 block h-1.5 w-8 rounded-full" style={{ background: p.fg, opacity: 0.8 }} />
              <span className="mt-1 block h-1 w-3 rounded-full" style={{ background: c }} />
            </div>
          ))}
        </div>
        <div className="relative flex-1 overflow-hidden rounded-md" style={{ background: p.surface, border: `1px solid ${p.border}` }}>
          <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-3/4 w-full">
            <defs>
              <linearGradient id={`tm-${id}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor={p.accent} stopOpacity=".35" />
                <stop offset="1" stopColor={p.accent} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={AREA} fill={`url(#tm-${id})`} />
            <path d={LINE} fill="none" stroke={p.accent} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>
    </div>
  )
}

const OPTIONS: { id: Theme; label: string; desc: string; icon: LucideIcon }[] = [
  { id: 'light', label: 'Light', desc: 'Crisp and bright', icon: Sun },
  { id: 'dark', label: 'Dark', desc: 'Easy on the eyes', icon: Moon },
  { id: 'system', label: 'System', desc: 'Follows your OS', icon: Monitor },
]

export function ThemeStep() {
  const { theme, setTheme } = useTheme()

  const pick = (t: Theme, e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const fromPointer = e.clientX !== 0 || e.clientY !== 0
    setTheme(t, fromPointer ? { x: e.clientX, y: e.clientY } : { x: r.left + r.width / 2, y: r.top + r.height / 2 })
  }

  return (
    <div>
      <StepHeader step={5} title="Pick your" accent="vibe">
        Choose how Dashward looks. Watch it change live — you can switch any time from the top bar.
      </StepHeader>

      <Block i={0}>
        <div role="group" aria-label="Theme" className="grid gap-4 sm:grid-cols-3">
          {OPTIONS.map((o, i) => {
            const on = theme === o.id
            return (
              <motion.button
                key={o.id}
                type="button"
                aria-pressed={on}
                onClick={(e) => pick(o.id, e)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, scale: on ? 1.02 : 1 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 360, damping: 22, opacity: { delay: 0.15 + i * 0.06 } }}
                className={cn(
                  'group relative rounded-3xl border p-2 text-left transition-[border-color,box-shadow] duration-300',
                  on ? 'border-accent shadow-glow' : 'border-border bg-surface/60 hover:border-border-strong',
                )}
              >
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl ring-1 ring-black/5 sm:aspect-[4/3] dark:ring-white/5">
                  {o.id === 'system' ? (
                    <>
                      <Mock p={LIGHT} id="sys-l" />
                      <div className="absolute inset-0" style={{ clipPath: 'polygon(58% 0, 100% 0, 100% 100%, 42% 100%)' }}>
                        <Mock p={DARK} id="sys-d" />
                      </div>
                    </>
                  ) : (
                    <Mock p={o.id === 'light' ? LIGHT : DARK} id={o.id} />
                  )}
                </div>
                <div className="flex items-center gap-3 px-2 pt-3 pb-1.5">
                  <span className={cn('flex size-8 items-center justify-center rounded-full border transition-colors', on ? 'border-accent/40 bg-accent/10 text-accent' : 'border-border text-fg-muted')}>
                    <o.icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{o.label}</span>
                    <span className="block text-xs text-fg-subtle">{o.desc}</span>
                  </span>
                  <span className={cn('flex size-5 items-center justify-center rounded-full border transition-colors', on ? 'border-accent bg-accent text-white' : 'border-border-strong')}>
                    <AnimatePresence>
                      {on && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                          <Check className="size-3" strokeWidth={3.5} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </div>
              </motion.button>
            )
          })}
        </div>
      </Block>
    </div>
  )
}
