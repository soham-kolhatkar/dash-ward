import { motion } from 'motion/react'
import { NumberTicker, Reveal } from '@/components/fx'
import { cn } from '@/lib/utils'
import { Serif } from '@/features/marketing/SectionHeading'

const STATS = [
  { value: 2.4, format: (n: number) => `${n.toFixed(1)}B`, label: 'events processed every day', note: 'across 38 regions' },
  { value: 99.99, format: (n: number) => `${n.toFixed(2)}%`, label: 'uptime over the last 12 months', note: 'backed by SLA' },
  { value: 340, format: (n: number) => `${Math.round(n)}ms`, label: 'median time to an AI answer', note: 'on 1B+ row tables' },
  { value: 12, format: (n: number) => `${Math.round(n)}k`, label: 'teams make decisions with Dashward', note: 'from seed to public' },
]

export function Stats() {
  return (
    <section className="relative overflow-x-clip px-4 py-24 sm:px-8 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-radial" />
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl text-3xl leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-4xl"
        >
          Built for scale on day one, <Serif className="text-fg-muted">and on day one thousand.</Serif>
        </motion.h2>
        <Reveal className="mt-14 grid grid-cols-1 border-t border-border sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal.Item
              key={s.label}
              className={cn(
                'relative border-b border-border py-10 sm:px-8 lg:border-b-0',
                i % 2 === 1 && 'sm:border-l',
                i > 0 && 'lg:border-l',
              )}
            >
              <span aria-hidden className="absolute top-0 left-0 h-px w-10 bg-gradient-brand sm:left-8 lg:left-8" />
              <NumberTicker
                value={s.value}
                format={s.format}
                duration={2.2}
                className="block text-6xl font-semibold tracking-[-0.055em] text-gradient-fg sm:text-7xl"
              />
              <p className="mt-4 max-w-[16rem] text-sm text-fg-muted">{s.label}</p>
              <p className="mt-1 font-mono text-[11px] tracking-wide text-fg-subtle uppercase">{s.note}</p>
            </Reveal.Item>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
