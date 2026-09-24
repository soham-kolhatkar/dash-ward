import { useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'motion/react'
import { ArrowRight, Building2, Headphones, KeyRound, ShieldCheck } from 'lucide-react'
import { Accordion } from '@/components/ui/accordion'
import { buttonVariants } from '@/components/ui/button'
import { Aurora, Magnetic, Marquee, Reveal, TextReveal } from '@/components/fx'
import { fadeUp, inView } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { Eyebrow, SectionHeading, Serif } from '@/features/marketing/SectionHeading'
import { WORDMARKS } from '@/features/marketing/Wordmarks'
import { BillingToggle } from './BillingToggle'
import { ComparisonTable } from './ComparisonTable'
import { PlanCard, type Billing } from './PlanCard'
import { PLANS } from './plans'

const FAQ = [
  {
    q: 'How does the 14-day free trial work?',
    a: 'You get the full Growth plan for 14 days with no credit card required. At the end of the trial you can pick a plan or drop to a read-only workspace. We never charge you automatically.',
  },
  {
    q: 'What counts as an event?',
    a: 'An event is a single row Dashward ingests: a page view, a Stripe charge, a CRM update. Warehouse-native queries on the Scale plan don’t count towards your event volume at all.',
  },
  {
    q: 'Can I change plans later?',
    a: 'Yes. Upgrades take effect immediately and are prorated to the day. Downgrades apply at the end of your current billing period, and you keep your history.',
  },
  {
    q: 'Is my data used to train your AI models?',
    a: 'Never. Your data is only used to answer your team’s questions. Models are fine-tuned per workspace on the Scale plan, and nothing is shared between customers.',
  },
  {
    q: 'Do you offer discounts for startups and non-profits?',
    a: 'Early-stage startups (under $2M raised) get 50% off Growth for the first year, and registered non-profits get 30% off any plan. Email us from your work address to apply.',
  },
  {
    q: 'What happens if I go over my event limit?',
    a: 'Nothing breaks. We’ll let you know when you reach 80% and 100% of your limit, and you can upgrade or buy a one-off top-up. We never silently throttle ingestion.',
  },
]

const ENTERPRISE = [
  { icon: ShieldCheck, label: 'SOC 2 Type II, HIPAA & GDPR' },
  { icon: KeyRound, label: 'SSO, SCIM & custom roles' },
  { icon: Building2, label: 'Dedicated or on-prem deploys' },
  { icon: Headphones, label: '24/7 support with a 1-hour SLA' },
]

export default function PricingPage() {
  const [billing, setBilling] = useState<Billing>('yearly')

  return (
    <>
      <section className="relative isolate overflow-hidden px-4 pt-36 pb-16 sm:px-8 sm:pt-44">
        <Aurora intensity={0.6} className="-z-10 opacity-80 dark:opacity-100" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-grid mask-radial" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-bg to-transparent" />
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
            <Eyebrow>Pricing</Eyebrow>
          </motion.div>
          <TextReveal
            as="h1"
            trigger="load"
            delay={0.15}
            stagger={0.05}
            className="mt-6 text-5xl leading-[0.95] font-semibold tracking-[-0.05em] text-balance sm:text-7xl lg:text-8xl"
          >
            Pay for <Serif className="text-gradient [&_div:not(:has(div))]:text-gradient">answers,</Serif> not seats.
          </TextReveal>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-6 max-w-xl text-base text-fg-muted sm:text-lg"
          >
            Every plan includes the AI analyst, unlimited dashboards and a 14-day free trial of Growth. Switch or cancel whenever you like.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10"
          >
            <BillingToggle value={billing} onChange={setBilling} />
          </motion.div>
        </div>
      </section>

      <section className="relative px-4 pb-24 sm:px-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.7 } } }}
          className="mx-auto grid max-w-6xl items-stretch gap-5 lg:grid-cols-3 lg:gap-6"
        >
          {PLANS.map((p) => (
            <motion.div key={p.id} variants={fadeUp}>
              <PlanCard plan={p} billing={billing} />
            </motion.div>
          ))}
        </motion.div>
        <p className="mt-10 text-center text-sm text-fg-subtle">
          Prices in USD, excluding tax. Need more than 50M events a month?{' '}
          <a href="mailto:sales@dashward.io" className="text-fg underline decoration-border-strong underline-offset-4 hover:decoration-fg">
            Let’s talk volume.
          </a>
        </p>
      </section>

      <section aria-label="Customers" className="overflow-x-clip border-y border-border bg-bg-subtle/50 py-10">
        <p className="mb-7 text-center font-mono text-[11px] tracking-[0.18em] text-fg-subtle uppercase">Trusted by 12,000+ teams, including</p>
        <Marquee duration={50} gap="4rem" className="mask-fade-x">
          {WORDMARKS.map((w) => (
            <span key={w.name} className="text-fg-subtle opacity-70 transition hover:text-fg hover:opacity-100">
              {w.node}
            </span>
          ))}
        </Marquee>
      </section>

      <section className="relative px-4 py-24 sm:px-8 sm:py-32">
        <SectionHeading
          eyebrow="Compare plans"
          title={
            <>
              Every detail, <Serif className="text-accent">side by side.</Serif>
            </>
          }
        />
        <motion.div variants={fadeUp} {...inView} className="mx-auto mt-14 max-w-6xl">
          <ComparisonTable />
        </motion.div>
      </section>

      <section className="relative px-4 pb-24 sm:px-8 sm:pb-32">
        <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-border bg-fg p-8 text-bg shadow-elevated sm:p-12 lg:p-16">
          <div aria-hidden className="absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:44px_44px]" />
          <div
            aria-hidden
            className="absolute -top-40 -right-24 -z-10 size-[30rem] animate-spin-slow rounded-full opacity-60 blur-3xl [animation-duration:20s]"
            style={{ background: 'conic-gradient(from 0deg, var(--accent), var(--accent-2), var(--accent-3), var(--accent))' }}
          />
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <span className="font-mono text-[11px] tracking-[0.18em] uppercase opacity-60">Enterprise</span>
              <h2 className="mt-4 text-4xl leading-[1.02] font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
                Your data team, <Serif>multiplied</Serif> across the company.
              </h2>
              <p className="mt-5 max-w-lg text-base opacity-70">
                Custom contracts, volume pricing, security reviews and a named solutions engineer from day one.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Magnetic>
                  <a
                    href="mailto:sales@dashward.io"
                    className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-bg px-7 font-medium text-fg transition hover:scale-[1.02]"
                  >
                    Talk to sales <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </Magnetic>
                <Link
                  to="/signup"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-current/20 px-7 font-medium opacity-80 transition hover:opacity-100"
                >
                  Start a trial first
                </Link>
              </div>
            </div>
            <Reveal className="grid gap-3 sm:grid-cols-2">
              {ENTERPRISE.map((e) => (
                <Reveal.Item key={e.label} className="rounded-2xl border border-current/10 bg-current/[0.04] p-5 backdrop-blur">
                  <e.icon className="size-5 opacity-80" />
                  <p className="mt-4 text-sm font-medium">{e.label}</p>
                </Reveal.Item>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-32 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              align="left"
              eyebrow="FAQ"
              title={
                <>
                  Questions, <Serif className="text-fg-muted">answered.</Serif>
                </>
              }
              description="Can’t find what you need? Our team replies in under two hours on weekdays."
            />
            <a href="mailto:hello@dashward.io" className={cn(buttonVariants({ variant: 'outline', size: 'md' }), 'mt-8')}>
              Contact support
            </a>
          </div>
          <motion.div variants={fadeUp} {...inView}>
            <Accordion items={FAQ} />
          </motion.div>
        </div>
      </section>
    </>
  )
}
