import { useLayoutEffect, useRef, useState, type HTMLAttributes } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { CircleCheck, Sparkles, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionHeading, Serif } from '@/features/marketing/SectionHeading'
import { DashboardMock, MOCK_H, MOCK_W } from './DashboardMock'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function ScaledMock() {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setScale(el.clientWidth / MOCK_W)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={ref} className="relative w-full" style={{ height: MOCK_H * scale }}>
      <div className="absolute top-0 left-0 origin-top-left" style={{ transform: `scale(${scale})` }}>
        <DashboardMock />
      </div>
    </div>
  )
}

function Chip({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { 'data-side'?: 'left' }) {
  return (
    <div
      data-chip
      {...props}
      className={cn(
        'absolute z-10 flex items-center gap-2.5 rounded-2xl border border-border-strong bg-surface/85 px-3 py-2 text-xs font-medium shadow-elevated backdrop-blur-xl sm:px-4 sm:py-3 sm:text-sm',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function ProductReveal() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const stage = root.current?.querySelector('[data-stage]')
        if (!stage) return
        gsap
          .timeline({ scrollTrigger: { trigger: stage, start: 'top 95%', end: 'top 12%', scrub: 1 } })
          .fromTo('[data-frame]', { rotateX: 26, scale: 0.84, y: 40 }, { rotateX: 0, scale: 1, y: 0, ease: 'power1.out' }, 0)
          .fromTo('[data-glow]', { opacity: 0.15, scale: 0.6 }, { opacity: 1, scale: 1, ease: 'none' }, 0)
        gsap.utils.toArray<HTMLElement>('[data-chip]').forEach((chip, i) => {
          const left = chip.dataset.side === 'left'
          gsap.fromTo(
            chip,
            { opacity: 0, x: left ? -80 : 80, y: 30, scale: 0.85, rotate: left ? -6 : 6 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotate: 0,
              ease: 'power2.out',
              scrollTrigger: { trigger: stage, start: `top ${70 - i * 6}%`, end: `top ${28 - i * 4}%`, scrub: 1 },
            },
          )
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="product" ref={root} className="relative overflow-x-clip px-4 pt-16 pb-24 sm:px-8 sm:pt-20 sm:pb-36">
      <SectionHeading
        eyebrow="The product"
        title={
          <>
            One screen. <Serif className="text-accent">Every</Serif> answer.
          </>
        }
        description="Revenue, product and marketing data in a single living workspace. Dashward watches every metric around the clock and explains what moved, in words you can forward to your CEO."
      />

      <div data-stage className="relative mx-auto mt-16 max-w-[1240px] sm:mt-24" style={{ perspective: 1800 }}>
        <div
          data-glow
          aria-hidden
          className="absolute inset-x-[6%] top-[10%] bottom-[5%] -z-10 rounded-[40%] opacity-60 blur-[90px] dark:opacity-100"
          style={{
            background:
              'conic-gradient(from 180deg at 50% 50%, var(--accent), var(--accent-2), var(--accent-3), var(--accent-4), var(--accent))',
          }}
        />
        <div data-frame className="origin-[50%_0%] will-change-transform [transform-style:preserve-3d]">
          <div className="rounded-[26px] border border-border bg-surface/50 p-1.5 shadow-elevated backdrop-blur-xl sm:rounded-[30px] sm:p-2.5 dark:bg-white/[0.04]">
            <ScaledMock />
          </div>
        </div>

        <Chip className="top-[16%] -left-1 sm:-left-8 lg:-left-16" data-side="left">
          <span className="flex size-6 items-center justify-center rounded-full bg-success/15 text-success sm:size-7">
            <TrendingUp className="size-3.5" />
          </span>
          <span>
            <span className="text-success">↑ 24%</span> MRR
            <span className="hidden text-xs font-normal text-fg-subtle sm:block">vs. last quarter</span>
          </span>
        </Chip>
        <Chip className="top-[44%] -right-1 sm:-right-8 lg:-right-14">
          <span className="relative flex size-2.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-danger opacity-75" />
            <span className="relative size-2.5 rounded-full bg-danger" />
          </span>
          <span>
            Anomaly detected
            <span className="hidden text-xs font-normal text-fg-subtle sm:block">Checkout · iOS Safari</span>
          </span>
        </Chip>
        <Chip className="bottom-[8%] left-[4%] hidden sm:flex lg:-left-10" data-side="left">
          <span className="flex size-7 items-center justify-center rounded-full bg-accent/15 text-accent">
            <Sparkles className="size-3.5" />
          </span>
          <span>
            Q4 forecast: $3.1M
            <span className="block text-xs font-normal text-fg-subtle">±4% · 92% confidence</span>
          </span>
        </Chip>
        <Chip className="-top-5 right-[8%] hidden md:flex">
          <CircleCheck className="size-4 text-accent-2" />
          12 sources synced · 3s ago
        </Chip>
      </div>
    </section>
  )
}
