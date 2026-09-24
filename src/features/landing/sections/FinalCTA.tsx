import { Link } from 'react-router'
import { motion } from 'motion/react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Magnetic, TextReveal } from '@/components/fx'
import { buttonVariants } from '@/components/ui/button'
import { fadeUp, inView } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { Serif } from '@/features/marketing/SectionHeading'
import { useLiveDemo } from '@/features/marketing/useLiveDemo'

const ringMask = 'radial-gradient(closest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px))'
const glowMask = 'radial-gradient(closest-side, transparent calc(100% - 22px), #000 calc(100% - 3px), transparent 100%)'

function Ring({ className, duration, from, to, reverse }: { className: string; duration: number; from: string; to: string; reverse?: boolean }) {
  const beam = `conic-gradient(from 0deg, transparent 0 62%, ${from} 86%, ${to} 98%, transparent 100%)`
  return (
    <div className={cn('absolute rounded-full', className)}>
      <div className="absolute inset-0 rounded-full border border-border" />
      <div
        className={cn('absolute inset-0 animate-spin-slow rounded-full', reverse && '[animation-direction:reverse]')}
        style={{ background: beam, mask: ringMask, WebkitMask: ringMask, animationDuration: `${duration}s` }}
      />
      <div
        className={cn('absolute inset-0 animate-spin-slow rounded-full opacity-35 dark:opacity-50', reverse && '[animation-direction:reverse]')}
        style={{ background: beam, mask: glowMask, WebkitMask: glowMask, animationDuration: `${duration}s` }}
      />
    </div>
  )
}

export function FinalCTA() {
  const demo = useLiveDemo()
  return (
    <section className="relative isolate overflow-hidden px-4 py-32 sm:px-8 sm:py-44">
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid mask-radial" />
      <div aria-hidden className="absolute top-1/2 left-1/2 -z-10 aspect-square w-[min(125vw,62rem)] -translate-x-1/2 -translate-y-1/2">
        <div
          className="absolute inset-[12%] rounded-full opacity-70 dark:opacity-100"
          style={{ background: 'radial-gradient(closest-side, color-mix(in oklch, var(--accent) 22%, transparent), transparent)' }}
        />
        <Ring className="inset-0" duration={9} from="var(--accent-2)" to="var(--accent)" />
        <Ring className="inset-[16%]" duration={13} from="var(--accent-3)" to="var(--accent-2)" reverse />
        <Ring className="inset-[32%]" duration={7} from="var(--accent)" to="var(--accent-4)" />
      </div>
      <div
        aria-hidden
        className="absolute -bottom-[38%] left-1/2 -z-10 h-[70%] w-[140%] -translate-x-1/2 rounded-[100%] opacity-50 blur-3xl dark:opacity-80"
        style={{ background: 'radial-gradient(closest-side, color-mix(in oklch, var(--accent) 45%, transparent), transparent)' }}
      />

      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <motion.span
          variants={fadeUp}
          {...inView}
          className="font-mono text-[11px] tracking-[0.18em] text-fg-subtle uppercase"
        >
          14-day free trial · No credit card
        </motion.span>
        <TextReveal
          as="h2"
          by="words"
          stagger={0.05}
          className="mt-6 text-5xl leading-[0.95] font-semibold tracking-[-0.05em] text-balance sm:text-7xl lg:text-8xl"
        >
          Stop reporting. Start <Serif className="text-gradient [&_div:not(:has(div))]:text-gradient">knowing.</Serif>
        </TextReveal>
        <motion.p variants={fadeUp} {...inView} className="mt-7 max-w-xl text-base text-fg-muted sm:text-lg">
          Connect your first source in two minutes and get your first AI insight before the kettle boils.
        </motion.p>
        <motion.div variants={fadeUp} {...inView} className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Magnetic strength={0.4} className="w-full sm:w-auto">
            <Link
              to="/signup"
              className={cn(buttonVariants({ variant: 'brand', size: 'lg' }), 'group h-14 w-full px-9 text-base sm:w-auto')}
            >
              Start free trial
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Magnetic>
          <button type="button" onClick={demo} className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'group h-14 w-full px-8 text-base sm:w-auto')}>
            Explore the live demo
            <ArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
