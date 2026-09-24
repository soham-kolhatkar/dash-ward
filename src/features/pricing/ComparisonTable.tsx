import { Fragment } from 'react'
import { motion } from 'motion/react'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { COMPARISON, PLANS } from './plans'

function Cell({ v, featured }: { v: string | boolean; featured?: boolean }) {
  if (v === true)
    return (
      <span className={cn('inline-flex size-6 items-center justify-center rounded-full', featured ? 'bg-accent/15 text-accent' : 'bg-success/12 text-success')}>
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    )
  if (v === false)
    return (
      <span className="inline-flex size-6 items-center justify-center text-fg-subtle/70" aria-label="Not included">
        <Minus className="size-3.5" />
      </span>
    )
  return <span className={cn('text-sm', featured ? 'font-medium text-fg' : 'text-fg-muted')}>{v}</span>
}

export function ComparisonTable() {
  const featuredIdx = PLANS.findIndex((p) => p.featured)
  return (
    <div className="relative rounded-3xl border border-border bg-surface shadow-elevated dark:bg-surface/60">
      <div className="overflow-x-auto scrollbar-none md:overflow-visible">
        <table className="w-full min-w-[40rem] border-separate border-spacing-0 text-left">
          <caption className="sr-only">Plan feature comparison</caption>
          <thead>
            <tr>
              <th scope="col" className="sticky top-0 z-10 w-[34%] rounded-tl-3xl border-b border-border bg-surface/95 px-6 py-5 text-sm font-medium text-fg-subtle backdrop-blur-xl">
                Features
              </th>
              {PLANS.map((p, i) => (
                <th
                  key={p.id}
                  scope="col"
                  className={cn(
                    'sticky top-0 z-10 border-b border-border bg-surface/95 px-6 py-5 text-center backdrop-blur-xl',
                    i === PLANS.length - 1 && 'rounded-tr-3xl',
                  )}
                >
                  <span className="block text-base font-semibold">{p.name}</span>
                  <span className="text-xs font-normal text-fg-muted">from ${p.yearly}/mo</span>
                  {i === featuredIdx && <span className="absolute inset-x-6 bottom-0 h-0.5 rounded-full bg-gradient-brand" />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map((g) => (
              <Fragment key={g.group}>
                <tr>
                  <th colSpan={4} scope="colgroup" className="bg-bg-subtle/70 px-6 pt-7 pb-3 font-mono text-[11px] font-medium tracking-[0.16em] text-fg-subtle uppercase">
                    {g.group}
                  </th>
                </tr>
                {g.rows.map((r, ri) => (
                  <motion.tr
                    key={r.label}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: ri * 0.04, duration: 0.5 }}
                    className="group"
                  >
                    <th scope="row" className="border-b border-border px-6 py-4 text-sm font-normal text-fg transition-colors group-hover:bg-surface-2/60">
                      {r.label}
                    </th>
                    {r.values.map((v, i) => (
                      <td
                        key={i}
                        className={cn(
                          'border-b border-border px-6 py-4 text-center transition-colors group-hover:bg-surface-2/60',
                          i === featuredIdx && 'bg-accent/[0.04]',
                        )}
                      >
                        <Cell v={v} featured={i === featuredIdx} />
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
