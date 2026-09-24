import { useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight, Bell, Check, Sparkles, Zap } from 'lucide-react'
import { LogoMark } from '@/components/ui/logo'
import { INTEGRATIONS } from '@/data/integrations'
import { Eyebrow, Serif } from '@/features/marketing/SectionHeading'
import { smoothPath, walk } from '../paths'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const SOURCES = INTEGRATIONS.slice(0, 4)

function ConnectVisual() {
  const ys = [40, 110, 180, 250]
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-md">
      <svg viewBox="0 0 400 300" className="absolute inset-0 size-full" aria-hidden>
        <defs>
          <linearGradient id="hiw-wire" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--accent-2)" />
            <stop offset="1" stopColor="var(--accent)" />
          </linearGradient>
        </defs>
        {ys.map((y) => (
          <g key={y}>
            <path d={`M92 ${y} C 190 ${y}, 200 150, 290 150`} fill="none" stroke="var(--border-strong)" strokeWidth="1.5" />
            <path
              data-flow
              d={`M92 ${y} C 190 ${y}, 200 150, 290 150`}
              fill="none"
              stroke="url(#hiw-wire)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="10 190"
              style={{ animation: `hiw-flow 2.4s linear infinite`, animationDelay: `${y * -0.012}s` }}
            />
          </g>
        ))}
      </svg>
      {SOURCES.map((s, i) => (
        <div
          key={s.id}
          data-pop
          className="absolute left-0 flex -translate-y-1/2 items-center gap-2 rounded-xl border border-border bg-surface px-2.5 py-2 text-xs font-medium shadow-elevated"
          style={{ top: `${(ys[i] / 300) * 100}%` }}
        >
          <span className="flex size-6 items-center justify-center rounded-md text-[10px] font-bold text-white" style={{ background: s.color }}>
            {s.glyph}
          </span>
          <span className="hidden sm:inline">{s.name}</span>
        </div>
      ))}
      <div data-pop className="absolute top-1/2 right-0 -translate-y-1/2">
        <div className="absolute inset-0 animate-pulse-ring rounded-3xl bg-accent/30" />
        <div className="relative flex size-20 items-center justify-center rounded-3xl border border-border bg-surface shadow-glow sm:size-24">
          <LogoMark className="size-10 sm:size-12" />
        </div>
      </div>
      <div data-pop className="absolute right-0 bottom-0 flex items-center gap-1.5 rounded-full border border-success/25 bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">
        <Check className="size-3" /> 312 tables mapped
      </div>
    </div>
  )
}

const askLine = smoothPath(walk(14, 17, 20, 1.6, 5), 260, 70, 6)

function AskVisual() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3">
      <div data-pop className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-fg px-4 py-2.5 text-sm text-bg shadow-elevated">
        How did the spring campaign affect trial-to-paid?
      </div>
      <div data-pop className="max-w-[92%] rounded-2xl rounded-bl-md border border-border bg-surface p-4 shadow-elevated">
        <div className="flex items-center gap-2 text-xs text-fg-subtle">
          <span className="flex size-5 items-center justify-center rounded-md bg-gradient-brand text-white">
            <Sparkles className="size-3" />
          </span>
          Dashward AI
        </div>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          Trial-to-paid rose from <b className="font-semibold text-fg">14.2%</b> to <b className="font-semibold text-fg">19.8%</b> during the
          campaign, with the biggest lift in teams of 10–50.
        </p>
        <svg viewBox="0 0 260 70" className="mt-3 h-16 w-full" aria-hidden>
          <defs>
            <linearGradient id="ask-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--accent)" stopOpacity="0.3" />
              <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={askLine.area} fill="url(#ask-g)" />
          <path data-draw d={askLine.line} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" pathLength={1} />
        </svg>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {['stripe.subscriptions', 'segment.trials', 'hubspot.campaigns'].map((s) => (
            <span key={s} className="rounded-md border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-fg-muted">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function ActVisual() {
  const steps = [
    { icon: Zap, label: 'When churn risk > 70%', sub: 'Evaluated hourly', c: 'var(--accent-4)' },
    { icon: Bell, label: 'Notify #customer-success', sub: 'Slack · with context', c: 'var(--accent)' },
    { icon: Check, label: 'Create follow-up task', sub: 'HubSpot · owner: AE', c: 'var(--accent-3)' },
  ]
  return (
    <div className="relative mx-auto flex w-full max-w-md flex-col items-stretch">
      {steps.map((s, i) => (
        <div key={s.label} className="flex flex-col items-center">
          <div data-pop className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-3 shadow-elevated">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: s.c }}>
              <s.icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{s.label}</p>
              <p className="text-xs text-fg-subtle">{s.sub}</p>
            </div>
            <span className="flex h-5 w-9 items-center rounded-full bg-accent p-0.5">
              <span className="ml-auto size-4 rounded-full bg-white shadow" />
            </span>
          </div>
          {i < steps.length - 1 && <span className="h-6 w-px bg-gradient-to-b from-border-strong to-accent/60" />}
        </div>
      ))}
      <div
        data-pop
        className="mt-5 flex items-center gap-2 self-end rounded-xl border border-border bg-surface/90 px-3 py-2 text-xs shadow-elevated backdrop-blur sm:absolute sm:-right-8 sm:-bottom-10 sm:mt-0"
      >
        <span className="size-2 rounded-full bg-success" /> Alert sent to #customer-success · just now
      </div>
    </div>
  )
}

const STEPS: { n: string; title: ReactNode; body: string; points: string[]; visual: ReactNode; tint: string }[] = [
  {
    n: '01',
    title: (
      <>
        <Serif>Connect</Serif> your stack
      </>
    ),
    body: 'Plug in Stripe, your warehouse, product events and CRM. Dashward maps the schema, joins the entities and backfills two years of history in minutes.',
    points: ['120+ native connectors', 'Automatic entity resolution', 'Read-only by default'],
    visual: <ConnectVisual />,
    tint: 'var(--accent-2)',
  },
  {
    n: '02',
    title: (
      <>
        <Serif>Ask</Serif> like a human
      </>
    ),
    body: 'Type the question you’d ask your best analyst. Get a sourced answer, the chart behind it, and the SQL if you want to check the maths.',
    points: ['Answers cite their sources', 'Follow-ups keep context', 'Save any answer as a live chart'],
    visual: <AskVisual />,
    tint: 'var(--accent)',
  },
  {
    n: '03',
    title: (
      <>
        <Serif>Act</Serif> before it’s a fire
      </>
    ),
    body: 'Turn any insight into an automation. Alert the right channel, open the ticket, or update the CRM the moment a metric crosses the line.',
    points: ['No-code workflow builder', 'Slack, email, webhooks', 'Full audit trail'],
    visual: <ActVisual />,
    tint: 'var(--accent-3)',
  },
]

export function HowItWorks() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const pin = root.current?.querySelector<HTMLElement>('[data-pin]')
        const track = root.current?.querySelector<HTMLElement>('[data-track]')
        const bar = root.current?.querySelector<HTMLElement>('[data-bar]')
        const count = root.current?.querySelector<HTMLElement>('[data-count]')
        if (!pin || !track) return
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            pin: true,
            scrub: 1,
            start: 'top top',
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (bar) gsap.set(bar, { scaleX: self.progress })
              if (count) count.textContent = `0${Math.min(3, Math.floor(self.progress * 2.999) + 1)}`
            },
          },
        })
        gsap.utils.toArray<HTMLElement>('[data-panel]').forEach((panel) => {
          const pops = panel.querySelectorAll('[data-pop]')
          const draws = panel.querySelectorAll('[data-draw]')
          if (pops.length)
            gsap.from(pops, {
              opacity: 0,
              y: 30,
              scale: 0.92,
              stagger: 0.08,
              duration: 0.8,
              ease: 'back.out(1.6)',
              scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left 75%', toggleActions: 'play none none reverse' },
            })
          if (draws.length)
            gsap.fromTo(
              draws,
              { strokeDasharray: 1, strokeDashoffset: 1 },
              {
                strokeDashoffset: 0,
                duration: 1.4,
                ease: 'power2.out',
                scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left 60%' },
              },
            )
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="how" ref={root} className="relative overflow-x-clip">
      <style>{`@keyframes hiw-flow { from { stroke-dashoffset: 200 } to { stroke-dashoffset: 0 } }`}</style>
      <div data-pin className="relative flex flex-col py-24 lg:motion-safe:h-screen lg:motion-safe:justify-center lg:motion-safe:py-0">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-50 mask-fade-y" />
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col items-start gap-5">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="max-w-2xl text-4xl leading-[1.02] font-semibold tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl">
              From raw data to <Serif className="text-accent">decisions</Serif> in three steps.
            </h2>
          </div>
          <div className="hidden w-72 flex-col gap-3 lg:motion-safe:flex">
            <div className="flex items-baseline justify-between font-mono text-xs text-fg-subtle">
              <span>
                <span data-count className="text-2xl font-medium text-fg">
                  01
                </span>{' '}
                / 03
              </span>
              <span className="flex items-center gap-1">
                Scroll <ArrowRight className="size-3" />
              </span>
            </div>
            <div className="h-px w-full bg-border">
              <div data-bar className="h-full origin-left scale-x-0 bg-gradient-brand" />
            </div>
          </div>
        </div>

        <div data-track className="mx-auto mt-12 flex w-full max-w-7xl flex-col gap-5 px-5 sm:px-8 lg:mt-14 lg:motion-safe:mx-0 lg:motion-safe:w-max lg:motion-safe:max-w-none lg:motion-safe:flex-row lg:motion-safe:gap-8 lg:motion-safe:pr-[10vw] lg:motion-safe:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:motion-safe:will-change-transform">
          {STEPS.map((s) => (
            <article
              key={s.n}
              data-panel
              className="relative grid overflow-hidden rounded-[2rem] border border-border bg-surface shadow-elevated md:grid-cols-2 lg:motion-safe:h-[min(62vh,36rem)] lg:motion-safe:w-[min(72vw,68rem)] dark:bg-surface/60"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full opacity-25 blur-3xl dark:opacity-30"
                style={{ background: `radial-gradient(circle, ${s.tint}, transparent 65%)` }}
              />
              <div className="relative flex flex-col p-7 sm:p-10">
                <span
                  className="text-7xl leading-none font-semibold tracking-[-0.06em] sm:text-8xl"
                  style={{ WebkitTextStroke: '1px var(--border-strong)', color: 'transparent' }}
                >
                  {s.n}
                </span>
                <h3 className="mt-auto pt-10 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{s.title}</h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-muted sm:text-base">{s.body}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-1.5 rounded-full border border-border bg-surface-2/60 px-3 py-1 text-xs text-fg-muted">
                      <Check className="size-3 text-accent" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative flex items-center border-t border-border bg-bg-subtle/60 p-7 sm:p-10 md:border-t-0 md:border-l">
                <div aria-hidden className="absolute inset-0 bg-dots opacity-70" />
                <div className="relative w-full">{s.visual}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
