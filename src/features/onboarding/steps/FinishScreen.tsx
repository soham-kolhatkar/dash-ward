import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import confetti from 'canvas-confetti'
import { ArrowRight, Check } from 'lucide-react'
import { LogoMark } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/store/auth'
import { useOnboarding } from '@/store/onboarding'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'

const TICK = 950
const AUTO_NAV = 2400
const BRAND = ['#8b5cf6', '#a78bfa', '#22d3ee', '#a3e635', '#fb7185']

function Orbits({ done }: { done: boolean }) {
  const reduce = usePrefersReducedMotion()
  const rings = [
    { size: 150, dur: 9, dots: [{ a: 0, c: 'var(--accent)' }, { a: 180, c: 'var(--accent-2)' }] },
    { size: 220, dur: 14, dots: [{ a: 60, c: 'var(--accent-3)' }, { a: 250, c: 'var(--accent)' }] },
    { size: 290, dur: 20, dots: [{ a: 120, c: 'var(--accent-4)' }, { a: 300, c: 'var(--accent-2)' }, { a: 20, c: 'var(--accent-3)' }] },
  ]
  return (
    <div className="relative flex size-[300px] items-center justify-center">
      <motion.div
        aria-hidden
        className="absolute size-40 rounded-full bg-gradient-brand blur-3xl"
        animate={{ opacity: done ? 0.55 : [0.25, 0.45, 0.25], scale: done ? 1.3 : 1 }}
        transition={done ? { duration: 0.8 } : { duration: 2.4, repeat: Infinity }}
      />
      {rings.map((r, i) => (
        <motion.div
          key={r.size}
          aria-hidden
          className="absolute rounded-full border border-border-strong"
          style={{ width: r.size, height: r.size }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: done ? 1.06 : 1, rotate: reduce ? 0 : i % 2 ? -360 : 360 }}
          transition={{
            opacity: { delay: 0.2 + i * 0.15, duration: 0.6 },
            scale: { delay: 0.2 + i * 0.15, duration: 0.8, ease: ease.outExpo },
            rotate: { duration: r.dur, repeat: Infinity, ease: 'linear' },
          }}
        >
          {r.dots.map((d, j) => (
            <span
              key={j}
              className="absolute top-1/2 left-1/2 size-2.5 rounded-full"
              style={{
                background: d.c,
                boxShadow: `0 0 14px 2px ${d.c}`,
                transform: `rotate(${d.a}deg) translateX(${r.size / 2}px) translate(-50%, -50%)`,
                transformOrigin: '0 0',
              }}
            />
          ))}
        </motion.div>
      ))}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: done ? 1.12 : 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 14 }}
        className="relative size-20 rounded-[26px] shadow-glow"
      >
        <LogoMark className="size-full" />
        <AnimatePresence>
          {done && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 16, delay: 0.1 }}
              className="absolute -right-2 -bottom-2 flex size-8 items-center justify-center rounded-full border-4 border-bg bg-success text-white"
            >
              <Check className="size-4" strokeWidth={3.5} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export function FinishScreen() {
  const navigate = useNavigate()
  const reduce = usePrefersReducedMotion()
  const { workspace, integrations } = useOnboarding()
  const { user, completeOnboarding } = useAuth()
  const first = user?.name.split(' ')[0] ?? 'there'
  const n = integrations.length
  const items = [
    `Creating workspace ${workspace.trim() || 'Dashward'}`,
    n ? `Connecting ${n} source${n > 1 ? 's' : ''}` : 'Loading sample data',
    'Training your AI analyst',
    'Generating first insights',
  ]
  const [ticked, setTicked] = useState(0)
  const done = ticked >= items.length
  const left = useRef(false)

  const go = () => {
    if (left.current) return
    left.current = true
    completeOnboarding()
    navigate('/app', { replace: true })
  }

  useEffect(() => {
    if (done) return
    const t = setTimeout(() => setTicked((c) => c + 1), ticked === 0 ? TICK + 300 : TICK)
    return () => clearTimeout(t)
  }, [ticked, done])

  useEffect(() => {
    if (!done) return
    if (!reduce) {
      const opts = { colors: BRAND, disableForReducedMotion: true, ticks: 260, scalar: 1.05 }
      const t0 = setTimeout(() => confetti({ ...opts, particleCount: 110, spread: 90, startVelocity: 42, origin: { y: 0.55 } }), 40)
      const t1 = setTimeout(() => {
        confetti({ ...opts, particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: 0.7 } })
        confetti({ ...opts, particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } })
      }, 250)
      const t2 = setTimeout(go, AUTO_NAV)
      return () => {
        clearTimeout(t0)
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }
    const t = setTimeout(go, AUTO_NAV)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, reduce])

  const pct = Math.round((ticked / items.length) * 100)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 py-12 text-center"
    >
      <div className="-my-6 scale-[0.85] sm:scale-100">
        <Orbits done={done} />
      </div>

      <div className="mt-6 min-h-[5.5rem] sm:mt-8">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.7, ease: ease.outExpo }}>
              <h1 className="text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                You’re all set, <span className="font-serif font-normal tracking-normal italic text-gradient">{first}!</span>
              </h1>
              <p className="mt-3 text-[15px] text-fg-muted">Your dashboard is ready. First insights are already waiting.</p>
            </motion.div>
          ) : (
            <motion.div key="build" exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }} transition={{ duration: 0.35 }}>
              <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Building your <span className="font-serif font-normal tracking-normal italic text-gradient">dashboard</span>
              </h1>
              <p className="mt-3 text-[15px] text-fg-muted">This takes a few seconds. Worth it, we promise.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 w-full max-w-sm">
        <ul className="space-y-1 text-left" aria-live="polite">
          {items.map((label, i) => {
            const state = i < ticked ? 'done' : i === ticked ? 'active' : 'todo'
            return (
              <motion.li
                key={label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: state === 'todo' ? 0.45 : 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                className="flex items-center gap-3 rounded-xl px-3 py-2"
              >
                <span
                  className={cn(
                    'relative flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-300',
                    state === 'done' ? 'border-transparent bg-success text-white' : 'border-border-strong',
                  )}
                >
                  {state === 'active' && <span className="absolute -inset-px animate-spin rounded-full border-2 border-accent border-t-transparent" />}
                  <AnimatePresence>
                    {state === 'done' && (
                      <motion.svg viewBox="0 0 24 24" className="size-3.5" initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}>
                        <motion.path
                          d="M5 12.5l4.5 4.5L19 7.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </span>
                <span className={cn('truncate text-sm transition-colors', state === 'done' ? 'text-fg' : state === 'active' ? 'font-medium text-fg' : 'text-fg-muted')}>
                  {label}
                  {state === 'active' && <span className="animate-pulse">…</span>}
                </span>
              </motion.li>
            )
          })}
        </ul>

        <div className="mt-6 px-3">
          <div className="flex justify-between text-xs text-fg-subtle">
            <span>{done ? 'Complete' : 'Setting things up'}</span>
            <span className="tabular-nums">{pct}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-3">
            <motion.div
              className="h-full rounded-full bg-gradient-brand shadow-[0_0_16px_var(--accent)]"
              initial={{ width: '0%' }}
              animate={{ width: `${Math.max(4, pct)}%` }}
              transition={{ duration: 0.8, ease: ease.outExpo }}
            />
          </div>
        </div>

        <div className="mt-8 h-12">
          <AnimatePresence>
            {done && (
              <motion.div initial={{ opacity: 0, y: 12, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 22 }}>
                <Button variant="brand" size="lg" onClick={go} autoFocus className="group relative w-full overflow-hidden">
                  <motion.span
                    aria-hidden
                    className="absolute inset-y-0 left-0 bg-white/15"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: AUTO_NAV / 1000 - 0.3, ease: 'linear', delay: 0.3 }}
                  />
                  <span className="relative flex items-center gap-2">
                    Go to dashboard <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
