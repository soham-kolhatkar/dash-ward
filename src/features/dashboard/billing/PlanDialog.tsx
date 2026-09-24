import { AnimatePresence, motion } from 'motion/react'
import { Check, PartyPopper } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { NumberTicker } from '@/components/fx'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { PLANS, type PlanTier } from '@/features/pricing/plans'
import { fmt } from '@/lib/format'
import { cn, sleep } from '@/lib/utils'
import { PillTabs } from '../shared/PillTabs'

export type Cycle = 'monthly' | 'yearly'

export function PlanDialog({
  open,
  onOpenChange,
  current,
  cycle: currentCycle,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  current: PlanTier['id']
  cycle: Cycle
  onConfirm: (id: PlanTier['id'], cycle: Cycle) => void
}) {
  const [picked, setPicked] = useState<PlanTier['id']>(current)
  const [cycle, setCycle] = useState<Cycle>(currentCycle)
  const [phase, setPhase] = useState<'pick' | 'busy' | 'done'>('pick')
  const plan = PLANS.find((p) => p.id === picked)!
  const unchanged = picked === current && cycle === currentCycle
  const price = cycle === 'yearly' ? plan.yearly : plan.monthly

  const change = (o: boolean) => {
    onOpenChange(o)
    if (!o)
      setTimeout(() => {
        setPhase('pick')
        setPicked(current)
        setCycle(currentCycle)
      }, 250)
  }

  const confirm = async () => {
    setPhase('busy')
    await sleep(1300)
    setPhase('done')
    onConfirm(picked, cycle)
    toast.success(`You’re on ${plan.name}`, { description: `${fmt.currency(price)}/mo, billed ${cycle}. Changes apply immediately.` })
  }

  return (
    <Dialog open={open} onOpenChange={change}>
      <DialogContent title={phase === 'done' ? 'Plan updated' : 'Change plan'} description={phase === 'done' ? undefined : 'Upgrades apply immediately and are prorated. Downgrades apply at renewal.'} className="max-h-[92dvh] max-w-3xl overflow-y-auto">
        <AnimatePresence mode="wait" initial={false}>
          {phase === 'done' ? (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 14 }}
                className="relative flex size-16 items-center justify-center rounded-full bg-success/15 text-success"
              >
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-success/25" />
                <Check className="size-8" strokeWidth={2.5} />
              </motion.div>
              <h3 className="mt-5 text-lg font-semibold">Welcome to {plan.name}</h3>
              <p className="mt-1 max-w-sm text-sm text-fg-muted">{plan.tagline} Your new limits are active now.</p>
              <Button className="mt-6" size="sm" onClick={() => change(false)}>
                <PartyPopper /> Back to billing
              </Button>
            </motion.div>
          ) : (
            <motion.div key="pick" exit={{ opacity: 0, scale: 0.98 }}>
              <div className="mb-4 flex items-center gap-3">
                <PillTabs
                  value={cycle}
                  onChange={setCycle}
                  label="Billing cycle"
                  options={[
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'yearly', label: 'Yearly' },
                  ]}
                />
                <Badge variant="success">Save up to 20% yearly</Badge>
              </div>
              <div role="radiogroup" aria-label="Plans" className="grid gap-3 md:grid-cols-3">
                {PLANS.map((p) => {
                  const on = p.id === picked
                  const amount = cycle === 'yearly' ? p.yearly : p.monthly
                  return (
                    <button
                      key={p.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setPicked(p.id)}
                      className={cn(
                        'relative flex flex-col rounded-2xl border p-4 text-left transition-all duration-300',
                        on ? 'border-accent/60 bg-accent/[0.06] shadow-glow' : 'border-border hover:border-border-strong hover:bg-surface-2/60',
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{p.name}</span>
                        {p.id === current ? (
                          <Badge>Current</Badge>
                        ) : p.featured ? (
                          <Badge variant="accent">Popular</Badge>
                        ) : null}
                      </div>
                      <div className="mt-3 flex items-baseline gap-1">
                        <NumberTicker value={amount} startOnView={false} duration={0.6} format={(n) => fmt.currency(n)} className="font-mono text-2xl font-semibold tracking-tight" />
                        <span className="text-xs text-fg-subtle">/mo</span>
                      </div>
                      <p className="mt-1 min-h-8 text-xs text-fg-muted">{p.tagline}</p>
                      <ul className="mt-3 space-y-1.5 border-t border-border pt-3">
                        {p.features.slice(0, 4).map((f) => (
                          <li key={f} className="flex items-start gap-2 text-xs text-fg-muted">
                            <Check className={cn('mt-px size-3.5 shrink-0', on ? 'text-accent' : 'text-fg-subtle')} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  )
                })}
              </div>
              <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-fg-muted">
                  {unchanged ? (
                    'Choose a different plan or billing cycle.'
                  ) : (
                    <>
                      <span className="font-medium text-fg">{plan.name}</span> · <span className="font-mono text-fg tabular-nums">{fmt.currency(cycle === 'yearly' ? price * 12 : price)}</span>
                      {cycle === 'yearly' ? ' billed yearly' : ' billed monthly'}
                    </>
                  )}
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => change(false)}>
                    Cancel
                  </Button>
                  <Button variant="brand" size="sm" disabled={unchanged} loading={phase === 'busy'} onClick={confirm}>
                    {phase === 'busy' ? 'Updating plan…' : `Switch to ${plan.name}`}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
