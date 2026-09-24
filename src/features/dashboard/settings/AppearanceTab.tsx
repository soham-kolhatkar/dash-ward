import { motion } from 'motion/react'
import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { useTheme, type Theme } from '@/store/theme'
import { Row, Section, TabBody } from './ui'

const PALETTE = {
  light: { bg: '#faf9f6', side: '#f1efe9', line: '#e2dfd6', card: '#ffffff', text: '#2a2735' },
  dark: { bg: '#131219', side: '#1b1a23', line: '#2c2a36', card: '#1f1e28', text: '#e9e8ef' },
}

function Mock({ mode }: { mode: 'light' | 'dark' }) {
  const p = PALETTE[mode]
  const bars = [38, 62, 46, 80, 58, 92, 70]
  return (
    <div className="flex size-full" style={{ background: p.bg }}>
      <div className="flex w-[26%] flex-col gap-1.5 p-2" style={{ background: p.side }}>
        <div className="mb-1 size-3 rounded-[4px] bg-gradient-brand" />
        {[70, 55, 62, 48].map((w, i) => (
          <div key={i} className="h-1.5 rounded-full" style={{ width: `${w}%`, background: i === 1 ? 'oklch(0.6 0.22 290 / .7)' : p.line }} />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-2">
        <div className="h-2 w-1/2 rounded-full" style={{ background: p.text, opacity: 0.8 }} />
        <div className="grid grid-cols-3 gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-4 rounded-[4px]" style={{ background: p.card, boxShadow: `0 0 0 1px ${p.line}` }} />
          ))}
        </div>
        <div className="flex flex-1 items-end gap-[3px] rounded-[4px] p-1.5" style={{ background: p.card, boxShadow: `0 0 0 1px ${p.line}` }}>
          {bars.map((h, i) => (
            <div key={i} className="flex-1 rounded-t-[2px]" style={{ height: `${h}%`, background: i === 5 ? 'oklch(0.62 0.2 290)' : mode === 'dark' ? 'oklch(0.62 0.2 290 / .35)' : 'oklch(0.55 0.25 290 / .25)' }} />
          ))}
        </div>
      </div>
    </div>
  )
}

const THEMES: { value: Theme; label: string; icon: typeof Sun; hint: string }[] = [
  { value: 'light', label: 'Light', icon: Sun, hint: 'Warm paper tones' },
  { value: 'dark', label: 'Dark', icon: Moon, hint: 'Easy on the eyes' },
  { value: 'system', label: 'System', icon: Monitor, hint: 'Follows your OS' },
]

const ACCENTS = [
  { value: 'violet', color: 'oklch(0.62 0.24 291)' },
  { value: 'cyan', color: 'oklch(0.72 0.15 212)' },
  { value: 'lime', color: 'oklch(0.8 0.2 129)' },
  { value: 'coral', color: 'oklch(0.7 0.2 20)' },
  { value: 'amber', color: 'oklch(0.78 0.16 70)' },
]

export function AppearanceTab() {
  const theme = useTheme((s) => s.theme)
  const setTheme = useTheme((s) => s.setTheme)
  const reduced = usePrefersReducedMotion()
  const [accent, setAccent] = useState('violet')
  const [prefs, setPrefs] = useState({ compact: false, grid: true, transparency: true, mono: true })
  const set = (k: keyof typeof prefs) => (v: boolean) => setPrefs((p) => ({ ...p, [k]: v }))

  return (
    <TabBody>
      <Section title="Theme" description="Pick a look for Dashward. Charts and exports adapt automatically.">
        <div role="radiogroup" aria-label="Theme" className="grid gap-3 sm:grid-cols-3">
          {THEMES.map((t) => {
            const on = theme === t.value
            return (
              <button
                key={t.value}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={(e) => setTheme(t.value, { x: e.clientX, y: e.clientY })}
                className={cn(
                  'group relative rounded-2xl border p-2 text-left transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  on ? 'border-accent/60 shadow-glow' : 'border-border hover:border-border-strong',
                )}
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl ring-1 ring-border transition-transform duration-500 ease-out-expo group-hover:scale-[1.02]">
                  {t.value === 'system' ? (
                    <>
                      <Mock mode="light" />
                      <div className="absolute inset-0 [clip-path:polygon(100%_0,100%_100%,0_100%)]">
                        <Mock mode="dark" />
                      </div>
                    </>
                  ) : (
                    <Mock mode={t.value} />
                  )}
                </div>
                <div className="flex items-center justify-between px-1.5 pt-2.5 pb-1">
                  <div className="flex items-center gap-2">
                    <t.icon className={cn('size-4', on ? 'text-accent' : 'text-fg-subtle')} />
                    <div>
                      <div className="text-sm font-medium">{t.label}</div>
                      <div className="text-[11px] text-fg-subtle">{t.hint}</div>
                    </div>
                  </div>
                  <span className={cn('flex size-5 items-center justify-center rounded-full border transition-all duration-300', on ? 'scale-100 border-accent bg-accent text-white dark:text-accent-fg' : 'scale-90 border-border-strong')}>
                    {on && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                        <Check className="size-3" strokeWidth={3} />
                      </motion.span>
                    )}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </Section>

      <Section title="Accent color" description="Used for highlights, focus rings and the primary chart series.">
        <div className="flex flex-wrap items-center gap-3" role="radiogroup" aria-label="Accent color">
          {ACCENTS.map((a) => {
            const on = accent === a.value
            return (
              <button
                key={a.value}
                type="button"
                role="radio"
                aria-checked={on}
                aria-label={a.value}
                onClick={() => setAccent(a.value)}
                className="relative flex size-10 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {on && <motion.span layoutId="accent-ring" className="absolute inset-0 rounded-full border-2" style={{ borderColor: a.color }} transition={{ type: 'spring', stiffness: 450, damping: 32 }} />}
                <span className="size-7 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,.35),0_4px_12px_-4px_rgba(0,0,0,.4)] transition-transform hover:scale-110" style={{ background: a.color }} />
              </button>
            )
          })}
          <span className="ml-1 text-xs text-fg-subtle capitalize">{accent}{accent !== 'violet' && ' · preview only'}</span>
        </div>
      </Section>

      <Section title="Interface" description="Fine-tune density and visual effects.">
        <div className="divide-y divide-border">
          <Row title="Compact mode" description="Tighter spacing in tables, lists and the sidebar." control={<Switch checked={prefs.compact} onCheckedChange={set('compact')} aria-label="Compact mode" />} />
          <Row title="Chart gridlines" description="Show horizontal guides behind every chart." control={<Switch checked={prefs.grid} onCheckedChange={set('grid')} aria-label="Chart gridlines" />} />
          <Row title="Translucent surfaces" description="Frosted-glass menus and toolbars. Turn off for more contrast." control={<Switch checked={prefs.transparency} onCheckedChange={set('transparency')} aria-label="Translucent surfaces" />} />
          <Row title="Tabular numbers" description="Monospaced digits so columns of numbers line up." control={<Switch checked={prefs.mono} onCheckedChange={set('mono')} aria-label="Tabular numbers" />} />
        </div>
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-border bg-surface-2/50 p-3.5 text-[13px] text-fg-muted">
          <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', reduced ? 'bg-success' : 'bg-fg-subtle')} />
          <p>
            <span className="font-medium text-fg">Reduced motion is {reduced ? 'on' : 'off'}.</span> Dashward follows your operating system’s setting and replaces transitions and
            counters with instant changes when it’s on.
          </p>
        </div>
      </Section>
    </TabBody>
  )
}
