import { lazy, Suspense, useRef, useState } from 'react'
import { Link } from 'react-router'
import { motion, useScroll, useTransform, type Variants } from 'motion/react'
import { ArrowRight, Play, Star } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { AvatarStack } from '@/components/ui/avatar'
import { Magnetic, TextReveal } from '@/components/fx'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { useIntroDone } from '@/features/marketing/intro'
import { useLiveDemo } from '@/features/marketing/useLiveDemo'
import { Serif } from '@/features/marketing/SectionHeading'

const HeroScene = lazy(() => import('@/components/three/HeroScene'))
const MotionLink = motion.create(Link)

const item: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: ease.outExpo } },
}

const headlineClass =
  'mx-auto max-w-[min(14ch,100%)] text-[2.7rem] leading-[0.94] min-[400px]:text-5xl font-semibold tracking-[-0.05em] text-balance sm:text-7xl md:text-8xl xl:text-[8.25rem]'

function Headline() {
  return (
    <>
      Your data, <Serif className="text-gradient [&_div:not(:has(div))]:text-gradient">finally</Serif> talking back.
    </>
  )
}

export function OrbFallback({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 flex items-end justify-center pb-[12vh] sm:items-center sm:pb-0', className)}
    >
      <div className="relative aspect-square w-[62vw] sm:w-[min(60vw,30rem)]">
        <div
          className="absolute inset-0 animate-spin-slow rounded-full opacity-80 blur-2xl dark:opacity-70"
          style={{ background: 'conic-gradient(from 90deg, var(--accent), var(--accent-2), var(--accent-3), var(--accent))' }}
        />
        <div
          className="absolute inset-[8%] rounded-full"
          style={{
            background:
              'radial-gradient(circle at 32% 28%, color-mix(in oklch, white 70%, var(--accent-2)) 0%, var(--accent) 38%, color-mix(in oklch, var(--accent) 50%, var(--bg)) 72%)',
            boxShadow: 'inset -30px -40px 80px color-mix(in oklch, var(--bg) 55%, transparent)',
          }}
        />
      </div>
    </div>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const ready = useIntroDone()
  const reduce = usePrefersReducedMotion()
  const demo = useLiveDemo()
  const [sceneReady, setSceneReady] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -140])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.1])
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.92])

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pt-32 pb-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-grid opacity-70 mask-radial" />
        <div
          className="absolute inset-x-0 top-0 h-[70vh] opacity-70 dark:opacity-100"
          style={{ background: 'radial-gradient(60% 60% at 50% 0%, color-mix(in oklch, var(--accent) 16%, transparent), transparent 70%)' }}
        />
      </div>

      <motion.div style={{ opacity: sceneOpacity, scale: sceneScale }} className="absolute inset-0 -z-10">
        <OrbFallback className={cn('transition-opacity duration-1000', sceneReady && 'opacity-0')} />
        {!reduce && (
          <Suspense fallback={null}>
            <HeroScene onReady={() => setSceneReady(true)} />
          </Suspense>
        )}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'radial-gradient(42% 34% at 50% 50%, color-mix(in oklch, var(--bg) 55%, transparent), transparent 100%)' }}
        />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        initial="hidden"
        animate={ready ? 'show' : 'hidden'}
        variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }}
        className="relative z-10 flex w-full max-w-6xl flex-col items-center text-center"
      >
        <motion.div variants={item}>
          <Link
            to="/#features"
            className="group relative inline-flex overflow-hidden rounded-full p-px shadow-elevated"
          >
            <span
              aria-hidden
              className="absolute top-1/2 left-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow [animation-duration:5s]"
              style={{ background: 'conic-gradient(from 0deg, transparent 0 60%, var(--accent-2) 75%, var(--accent) 85%, transparent 100%)' }}
            />
            <span className="relative inline-flex items-center gap-2 rounded-full bg-surface/90 py-1 pr-3 pl-1 text-xs font-medium text-fg-muted backdrop-blur-xl sm:text-sm">
              <span className="rounded-full bg-gradient-brand px-2 py-0.5 text-[11px] font-semibold text-white dark:text-accent-fg">New</span>
              AI Forecasts 2.0 is live
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </Link>
        </motion.div>

        <div className="mt-8">
          {ready ? (
            <TextReveal as="h1" trigger="load" by="words" stagger={0.06} duration={1.2} className={headlineClass}>
              <Headline />
            </TextReveal>
          ) : (
            <h1 className={cn(headlineClass, 'invisible')}>
              <Headline />
            </h1>
          )}
        </div>

        <motion.p variants={item} className="mt-7 max-w-xl text-base leading-relaxed text-pretty text-fg/80 [text-shadow:0_1px_18px_var(--bg),0_0_2px_var(--bg)] sm:text-lg">
          Dashward connects to every tool you run on, answers questions in plain English, and tells you what changed
          before your Monday standup does.
        </motion.p>

        <motion.div variants={item} className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Magnetic className="w-full sm:w-auto">
            <Link to="/signup" className={cn(buttonVariants({ variant: 'brand', size: 'lg' }), 'group w-full sm:w-auto')}>
              Get started free
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Magnetic>
          <button type="button" onClick={demo} className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'group w-full backdrop-blur-xl sm:w-auto')}>
            <span className="flex size-5 items-center justify-center rounded-full bg-fg text-bg transition-transform duration-300 group-hover:scale-110">
              <Play className="!size-2.5 translate-x-px fill-current" />
            </span>
            Live demo
          </button>
        </motion.div>

        <motion.div variants={item} className="mt-10">
          <div className="flex animate-float items-center gap-3 rounded-full border border-border bg-surface/60 py-1.5 pr-4 pl-1.5 shadow-elevated backdrop-blur-xl">
            <AvatarStack names={['Maya Patel', 'Kenji Tanaka', 'Zara Okafor', 'Lucas Rossi', 'Priya Singh']} max={4} />
            <div className="flex flex-col items-start leading-tight">
              <span className="flex items-center gap-0.5 text-warning">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-3 fill-current" />
                ))}
                <span className="ml-1 text-xs font-semibold text-fg">4.9</span>
              </span>
              <span className="text-[11px] text-fg-muted">from 2,400+ data teams</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div style={{ opacity: contentOpacity }} className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 sm:block">
        <MotionLink
          to="/#product"
          initial={{ opacity: 0, y: -8 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
          transition={{ delay: 1.2, duration: 1, ease: ease.outExpo }}
          className="flex flex-col items-center gap-2 text-fg-subtle transition-colors hover:text-fg"
          aria-label="Scroll to product"
        >
          <span className="flex h-9 w-5.5 justify-center rounded-full border border-border-strong pt-1.5">
            <motion.span
              className="h-2 w-0.5 rounded-full bg-fg-muted"
              animate={reduce ? undefined : { y: [0, 10, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        </MotionLink>
      </motion.div>
    </section>
  )
}
