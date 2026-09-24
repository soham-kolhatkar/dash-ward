import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { ArrowUpRight, Sparkles, TrendingDown, TrendingUp } from 'lucide-react'
import { Aurora, NumberTicker, Typewriter } from '@/components/fx'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'

const TESTIMONIALS = [
  {
    quote: 'We replaced four dashboards and a weekly analyst sync with one Dashward workspace. The Monday numbers now write themselves.',
    name: 'Maya Okafor',
    role: 'VP Finance, Lumen Health',
    hue: 290,
  },
  {
    quote: 'The anomaly alerts caught a checkout regression forty minutes after deploy. That single catch paid for the year.',
    name: 'Daniel Ruiz',
    role: 'Head of Growth, Parcel',
    hue: 210,
  },
  {
    quote: 'I ask questions in plain English and get a chart, the SQL, and a caveat I would have missed. It feels like cheating.',
    name: 'Priya Natarajan',
    role: 'Founder, Tinyloop',
    hue: 140,
  },
  {
    quote: 'Our board deck used to take three days. Now it is a link that is always up to date.',
    name: 'Jonas Weber',
    role: 'COO, Northwind',
    hue: 20,
  },
]

const BARS = [38, 52, 44, 68, 57, 74, 63, 88, 79, 96]
const SPARK = 'M0 34 C 12 30, 18 36, 28 28 S 46 18, 56 22 S 74 10, 86 12 S 104 4, 120 2'

function Depth({ x, y, depth, children, className }: { x: MotionValue<number>; y: MotionValue<number>; depth: number; children: ReactNode; className?: string }) {
  const tx = useTransform(x, (v) => v * depth)
  const ty = useTransform(y, (v) => v * depth)
  return (
    <motion.div style={{ x: tx, y: ty }} className={cn('absolute', className)}>
      {children}
    </motion.div>
  )
}

function Float({ children, delay = 0, amp = 10, duration = 7 }: { children: ReactNode; delay?: number; amp?: number; duration?: number }) {
  const reduce = usePrefersReducedMotion()
  return (
    <motion.div
      animate={reduce ? undefined : { y: [0, -amp, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  )
}

function Enter({ children, delay, rotate }: { children: ReactNode; delay: number; rotate: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: rotate * 2, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, rotate, scale: 1 }}
      transition={{ duration: 1.1, ease: ease.outExpo, delay }}
    >
      {children}
    </motion.div>
  )
}

function GlassCard({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/60 bg-white/65 p-4 shadow-elevated backdrop-blur-xl backdrop-saturate-150 dark:border-white/10 dark:bg-surface/55',
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/25" />
      {children}
    </div>
  )
}

function KpiCard() {
  return (
    <GlassCard className="w-[290px]">
      <div className="flex items-center justify-between text-xs text-fg-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-success shadow-[0_0_10px_var(--success)]" />
          Net revenue · live
        </span>
        <span className="font-mono text-[10px] text-fg-subtle">30D</span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-[28px] font-semibold tracking-tight">
          $<NumberTicker value={2418930} startOnView={false} duration={2.4} />
        </span>
      </div>
      <div className="mt-1 flex items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-success/12 px-1.5 py-0.5 font-medium text-success">
          <TrendingUp className="size-3" /> 18.4%
        </span>
        <span className="text-fg-subtle">vs. last month</span>
      </div>
      <svg viewBox="0 0 120 40" className="mt-3 h-10 w-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id="auth-spark" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--accent)" stopOpacity=".35" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={`${SPARK} L120 40 L0 40 Z`}
          fill="url(#auth-spark)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        />
        <motion.path
          d={SPARK}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, ease: ease.outExpo, delay: 0.3 }}
        />
        <motion.circle cx="120" cy="2" r="3" fill="var(--accent)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.8 }} />
      </svg>
    </GlassCard>
  )
}

function ChartCard() {
  return (
    <GlassCard className="w-[260px]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium">Weekly active teams</p>
        <ArrowUpRight className="size-3.5 text-fg-subtle" />
      </div>
      <p className="mt-0.5 text-[11px] text-fg-subtle">+312 this week</p>
      <div className="mt-4 flex h-24 items-end gap-1.5">
        {BARS.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ duration: 1, delay: 0.4 + i * 0.06, ease: ease.outExpo }}
            className={cn(
              'flex-1 rounded-t-[4px]',
              i === BARS.length - 1 ? 'bg-gradient-to-t from-accent to-accent-2' : 'bg-fg/10 dark:bg-white/12',
            )}
          />
        ))}
      </div>
    </GlassCard>
  )
}

function InsightCard() {
  const [start, setStart] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setStart(true), 1200)
    return () => clearTimeout(t)
  }, [])
  return (
    <GlassCard className="w-[330px]">
      <div className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-lg bg-gradient-brand text-white shadow-glow">
          <Sparkles className="size-3.5" />
        </span>
        <span className="text-xs font-medium">AI analyst</span>
        <span className="ml-auto rounded-full border border-accent/25 bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">Insight</span>
      </div>
      <p className="mt-3 min-h-[4.5em] text-[13px] leading-relaxed text-fg-muted">
        <Typewriter
          start={start}
          speed={22}
          text="Churn in the Pro tier fell 18% after the new onboarding checklist shipped. Expansion now outpaces contraction 3.2×."
        />
      </p>
    </GlassCard>
  )
}

function AlertCard() {
  return (
    <GlassCard className="flex w-[290px] items-center gap-3 p-3">
      <span className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent-4/15 text-accent-4">
        <span className="absolute inset-0 animate-pulse-ring rounded-xl bg-accent-4/25" />
        <TrendingDown className="relative size-4" />
      </span>
      <span className="min-w-0 text-xs">
        <span className="block font-medium">Anomaly detected</span>
        <span className="block truncate text-fg-muted">Checkout conversion −12% · 2m ago</span>
      </span>
    </GlassCard>
  )
}

function Testimonials() {
  const [i, setI] = useState(0)
  const reduce = usePrefersReducedMotion()
  const DURATION = 6500
  useEffect(() => {
    const t = setTimeout(() => setI((n) => (n + 1) % TESTIMONIALS.length), DURATION)
    return () => clearTimeout(t)
  }, [i])
  const t = TESTIMONIALS[i]
  return (
    <div className="relative">
      <div className="relative min-h-[150px]">
        <AnimatePresence mode="wait">
          <motion.figure
            key={i}
            initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
            transition={{ duration: 0.6, ease: ease.outExpo }}
          >
            <blockquote className="font-serif text-[26px] leading-[1.2] tracking-[-0.01em] text-balance text-fg xl:text-[30px]">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span
                className="flex size-9 items-center justify-center rounded-full text-xs font-semibold text-white ring-2 ring-white/40 dark:ring-white/10"
                style={{ background: `linear-gradient(135deg, oklch(0.62 0.2 ${t.hue}), oklch(0.72 0.16 ${t.hue + 60}))` }}
              >
                {t.name
                  .split(' ')
                  .map((p) => p[0])
                  .join('')}
              </span>
              <span className="text-sm">
                <span className="block font-medium text-fg">{t.name}</span>
                <span className="block text-fg-muted">{t.role}</span>
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      <div className="mt-6 flex gap-2" role="tablist" aria-label="Testimonials">
        {TESTIMONIALS.map((q, n) => (
          <button
            key={q.name}
            type="button"
            role="tab"
            aria-selected={n === i}
            aria-label={`Show testimonial from ${q.name}`}
            onClick={() => setI(n)}
            className="relative h-1 w-10 overflow-hidden rounded-full bg-fg/12 transition hover:bg-fg/20"
          >
            {n === i && (
              <motion.span
                key={i}
                className="absolute inset-y-0 left-0 rounded-full bg-fg"
                initial={{ width: reduce ? '100%' : '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: DURATION / 1000, ease: 'linear' }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export function AuthShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 })
  const y = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 })
  const rotX = useTransform(y, (v) => v * -6)
  const rotY = useTransform(x, (v) => v * 6)

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2)
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2)
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(0)
        my.set(0)
      }}
      className="relative isolate flex h-full flex-col overflow-hidden rounded-[28px] border border-border bg-bg-subtle dark:bg-[oklch(0.11_0.01_280)]"
    >
      <Aurora intensity={1.1} className="dark:opacity-100" />
      <div aria-hidden className="absolute top-1/3 left-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 blur-[140px] dark:bg-accent/30" />
      <div aria-hidden className="absolute inset-0 bg-grid mask-radial opacity-80" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-bg-subtle via-bg-subtle/80 to-transparent dark:from-[oklch(0.11_0.01_280)] dark:via-[oklch(0.11_0.01_280)]/80" />

      <div className="relative z-10 flex items-center justify-between px-10 pt-9">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-fg-muted backdrop-blur">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-success" />
            <span className="relative size-2 rounded-full bg-success" />
          </span>
          12,400 teams shipped decisions this week
        </span>
      </div>

      <motion.div style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1400 }} className="relative z-0 mx-auto mt-6 min-h-[340px] w-[calc(100%-5rem)] max-w-[620px] flex-1">
        <Depth x={x} y={y} depth={-14} className="top-[4%] left-[2%]">
          <Enter delay={0.1} rotate={-4}>
            <Float amp={8} duration={8}>
              <ChartCard />
            </Float>
          </Enter>
        </Depth>
        <Depth x={x} y={y} depth={22} className="top-[16%] right-[0%]">
          <Enter delay={0.25} rotate={3}>
            <Float amp={12} duration={7} delay={0.8}>
              <KpiCard />
            </Float>
          </Enter>
        </Depth>
        <Depth x={x} y={y} depth={34} className="top-[50%] left-[8%]">
          <Enter delay={0.4} rotate={-1}>
            <Float amp={9} duration={9} delay={1.6}>
              <InsightCard />
            </Float>
          </Enter>
        </Depth>
        <Depth x={x} y={y} depth={46} className="top-[74%] right-[2%]">
          <Enter delay={0.9} rotate={2}>
            <Float amp={6} duration={6} delay={0.4}>
              <AlertCard />
            </Float>
          </Enter>
        </Depth>
        <Depth x={x} y={y} depth={-26} className="top-[0%] right-[20%]">
          <div className="size-20 rounded-full bg-gradient-brand opacity-60 blur-2xl" />
        </Depth>
      </motion.div>

      <div className="relative z-10 px-10 pb-10">
        <Testimonials />
      </div>
    </div>
  )
}
