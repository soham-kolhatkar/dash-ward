import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import type { PointerEvent } from 'react'
import { Link, useLocation } from 'react-router'
import { House, LayoutDashboard } from 'lucide-react'
import { Aurora, Noise } from '@/components/fx'
import { Logo } from '@/components/ui/logo'
import { buttonVariants } from '@/components/ui/button'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'

const GLITCH_CLIP = [
  'inset(0 0 100% 0)',
  'inset(12% 0 62% 0)',
  'inset(58% 0 18% 0)',
  'inset(32% 0 44% 0)',
  'inset(78% 0 4% 0)',
  'inset(0 0 100% 0)',
]

function GlitchLayer({ color, dx, x, y, delay, reduce }: { color: string; dx: number; x: MotionValue<number>; y: MotionValue<number>; delay: number; reduce: boolean }) {
  const tx = useTransform(x, (v) => v * dx + dx * 0.4)
  const ty = useTransform(y, (v) => v * dx * 0.6)
  return (
    <motion.span aria-hidden style={{ x: tx, y: ty, color }} className="absolute inset-0 mix-blend-multiply select-none dark:mix-blend-screen">
      <motion.span
        className="block"
        initial={{ clipPath: 'inset(0 0 0 0)', x: 0 }}
        animate={
          reduce
            ? { clipPath: 'inset(0 0 0 0)' }
            : { clipPath: ['inset(0 0 0 0)', ...GLITCH_CLIP, 'inset(0 0 0 0)'], x: [0, dx * -1.4, dx * 2, dx * -0.8, dx * 1.6, 0, 0, 0] }
        }
        transition={{ duration: 0.7, repeat: Infinity, repeatDelay: 2.6, delay, ease: 'linear' }}
      >
        404
      </motion.span>
    </motion.span>
  )
}

function BrokenChart({ reduce }: { reduce: boolean }) {
  const main = 'M8 96 L52 78 L92 86 L136 54 L176 64 L214 34'
  return (
    <svg viewBox="0 0 320 130" className="h-auto w-full max-w-[340px] overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="nf-line" x1="0" x2="1">
          <stop offset="0" stopColor="var(--accent)" />
          <stop offset="1" stopColor="var(--accent-2)" />
        </linearGradient>
        <linearGradient id="nf-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity=".22" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[30, 62, 94].map((y) => (
        <line key={y} x1="0" x2="320" y1={y} y2={y} stroke="var(--border-strong)" strokeDasharray="2 6" />
      ))}
      <motion.path
        d={`${main} L214 126 L8 126 Z`}
        fill="url(#nf-area)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      />
      <motion.path
        d={main}
        fill="none"
        stroke="url(#nf-line)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.3, ease: ease.outExpo, delay: 0.3 }}
      />
      {/* where the line should have gone */}
      <motion.path
        d="M214 34 C 250 22, 280 8, 316 -14"
        fill="none"
        stroke="var(--fg-subtle)"
        strokeWidth="1.5"
        strokeDasharray="3 5"
        strokeLinecap="round"
        initial={{ opacity: 0, x: -6, y: 4 }}
        animate={{ opacity: 0.8, x: 0, y: 0 }}
        transition={{ delay: 2.6, duration: 1, ease: ease.outExpo }}
      />
      {/* the piece that snaps off */}
      <motion.g
        style={{ transformOrigin: 'left bottom', transformBox: 'fill-box' }}
        initial={{ opacity: 0 }}
        animate={
          reduce
            ? { opacity: 1, rotate: 28, y: 18 }
            : { opacity: [0, 1, 1, 0.8, 0], rotate: [0, 0, -6, 64, 90], y: [0, 0, -4, 54, 96] }
        }
        transition={{ duration: 2.4, delay: 1.2, times: [0, 0.18, 0.36, 0.8, 1], ease: 'easeIn' }}
      >
        <path d="M218 32 L252 18 L290 6" fill="none" stroke="var(--accent-2)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="290" cy="6" r="4" fill="var(--accent-2)" />
      </motion.g>
      <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 2.3, type: 'spring', stiffness: 400, damping: 14 }} style={{ transformOrigin: 'center', transformBox: 'fill-box' }}>
        <circle cx="214" cy="34" r="5" fill="var(--accent-4)" />
        {!reduce && (
          <motion.circle
            cx="214"
            cy="34"
            r="5"
            fill="none"
            stroke="var(--accent-4)"
            strokeWidth="1.5"
            style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
            animate={{ scale: [1, 3.2], opacity: [0.8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: 2.5 }}
          />
        )}
      </motion.g>
      {/* sparks at the break */}
      {!reduce &&
        [
          [-14, -10],
          [10, -16],
          [16, 6],
          [-8, 12],
        ].map(([dx, dy], i) => (
          <motion.circle
            key={i}
            cx="216"
            cy="33"
            r="1.8"
            fill="var(--accent-3)"
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], x: dx, y: dy }}
            transition={{ delay: 1.75, duration: 0.6, ease: 'easeOut' }}
          />
        ))}
    </svg>
  )
}

export default function NotFound() {
  const { pathname } = useLocation()
  const reduce = usePrefersReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 80, damping: 20 })
  const y = useSpring(my, { stiffness: 80, damping: 20 })
  const baseX = useTransform(x, (v) => v * 18)
  const baseY = useTransform(y, (v) => v * 12)
  const rotX = useTransform(y, (v) => v * -8)
  const rotY = useTransform(x, (v) => v * 10)

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    mx.set((e.clientX / window.innerWidth - 0.5) * 2)
    my.set((e.clientY / window.innerHeight - 0.5) * 2)
  }

  return (
    <div onPointerMove={onMove} className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-bg">
      <Noise opacity={0.05} />
      <Aurora intensity={0.8} />
      <div aria-hidden className="absolute inset-0 -z-0 bg-grid mask-radial" />

      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/" aria-label="Dashward home">
          <Logo />
        </Link>
        <ThemeToggle />
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 font-mono text-[11px] text-fg-muted backdrop-blur"
        >
          <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-accent-4" />
          <span className="truncate">ERR_ROUTE_NOT_FOUND · {pathname}</span>
        </motion.p>

        <motion.div
          style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 900 }}
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(16px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, ease: ease.outExpo }}
          className="relative text-[clamp(8.5rem,32vw,21rem)] leading-[0.82] font-semibold tracking-[-0.07em] select-none"
        >
          <GlitchLayer color="var(--accent-4)" dx={-9} x={x} y={y} delay={0.9} reduce={reduce} />
          <GlitchLayer color="var(--accent-2)" dx={9} x={x} y={y} delay={1} reduce={reduce} />
          <motion.h1 style={{ x: baseX, y: baseY }} className="relative text-fg">
            <span className="sr-only">Error </span>404
          </motion.h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: ease.outExpo }}
          className="-mt-2 w-full max-w-[340px] sm:-mt-4"
        >
          <BrokenChart reduce={reduce} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8, ease: ease.outExpo }}>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
            This page drifted <span className="font-serif font-normal tracking-normal italic text-gradient">off the chart.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-fg-muted">
            The link might be broken, or the page moved somewhere new. Let’s get you back to numbers that behave.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link to="/" className={cn(buttonVariants({ size: 'lg' }), 'group')}>
              <House className="transition-transform group-hover:-translate-y-0.5" /> Go home
            </Link>
            <Link to="/app" className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'group')}>
              <LayoutDashboard className="transition-transform group-hover:rotate-6" /> Open dashboard
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
