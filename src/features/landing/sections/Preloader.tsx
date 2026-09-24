import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { LogoMark } from '@/components/ui/logo'
import { useLenis } from '@/hooks/useLenis'
import { finishIntro, introPlaying } from '@/features/marketing/intro'

const STEPS = ['Connecting sources', 'Warming up models', 'Rendering insights']

/** First-visit-per-session intro: count to 100, then wipe the curtain up. */
export function Preloader() {
  const [show, setShow] = useState(introPlaying)
  if (!show) return null
  return <PreloaderInner onDone={() => setShow(false)} />
}

function PreloaderInner({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    lenis.stop()
    return () => lenis.start()
  }, [lenis])

  useGSAP(
    () => {
      document.documentElement.style.overflow = 'hidden'
      const n = { v: 0 }
      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        onComplete: () => {
          document.documentElement.style.overflow = ''
          onDone()
        },
      })
      tl.from('[data-pl-logo]', { scale: 0.6, opacity: 0, rotate: -20, duration: 0.8 }, 0)
        .from('[data-pl-word]', { yPercent: 110, duration: 0.8 }, 0.08)
        .from('[data-pl-meta]', { opacity: 0, y: 10, duration: 0.6, stagger: 0.05 }, 0.1)
        .to(
          n,
          {
            v: 100,
            duration: 1.15,
            ease: 'power3.inOut',
            onUpdate: () => {
              if (counter.current) counter.current.textContent = String(Math.round(n.v)).padStart(3, '0')
            },
          },
          0,
        )
        .to('[data-pl-bar]', { scaleX: 1, duration: 1.15, ease: 'power3.inOut' }, 0)
        .to('[data-pl-step]', { yPercent: -200, duration: 1, ease: 'steps(2)' }, 0.1)
        .to('[data-pl-content]', { yPercent: -12, opacity: 0, duration: 0.5, ease: 'power3.in' }, 1.2)
        .add(() => finishIntro(), 1.45)
        .to('[data-pl-curtain]', { yPercent: -100, duration: 0.75, ease: 'expo.inOut', stagger: { each: 0.08, from: 'end' } }, 1.25)
      return () => {
        document.documentElement.style.overflow = ''
      }
    },
    { scope: root },
  )

  return (
    <div ref={root} className="fixed inset-0 z-[80]" aria-label="Loading Dashward" role="status">
      <div data-pl-curtain className="absolute inset-0 bg-gradient-brand" />
      <div data-pl-curtain className="absolute inset-0 overflow-hidden bg-bg">
        <div aria-hidden className="absolute inset-0 bg-grid opacity-50 mask-radial" />
        <div data-pl-content className="relative flex h-full flex-col justify-between p-6 sm:p-10">
          <div className="flex items-start justify-between font-mono text-[11px] tracking-[0.14em] text-fg-subtle uppercase">
            <span data-pl-meta>Dashward / v4.2</span>
            <span data-pl-meta className="hidden sm:block">Analytics that talks back</span>
          </div>

          <div className="flex flex-col items-center gap-5">
            <div data-pl-logo className="relative">
              <div className="absolute inset-0 animate-pulse-ring rounded-2xl bg-accent/30" />
              <LogoMark className="relative size-14" />
            </div>
            <div className="overflow-hidden">
              <span data-pl-word className="block text-2xl font-semibold tracking-[-0.03em]">
                Dashward
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between gap-6">
            <div className="h-5 overflow-hidden font-mono text-xs text-fg-muted" data-pl-meta>
              <div data-pl-step className="flex flex-col">
                {STEPS.map((s) => (
                  <span key={s} className="h-5 leading-5">
                    {s}…
                  </span>
                ))}
              </div>
            </div>
            <span
              ref={counter}
              className="font-mono text-[28vw] leading-[0.78] font-medium tracking-[-0.08em] text-fg tabular-nums sm:text-[18vw] lg:text-[15rem]"
            >
              000
            </span>
          </div>
          <div className="absolute inset-x-6 bottom-4 h-px bg-border sm:inset-x-10">
            <div data-pl-bar className="h-full origin-left scale-x-0 bg-gradient-brand" />
          </div>
        </div>
      </div>
    </div>
  )
}
