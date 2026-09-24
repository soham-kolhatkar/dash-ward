import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { INTEGRATIONS } from '@/data/integrations'
import { useOnboarding } from '@/store/onboarding'
import { cn } from '@/lib/utils'
import { Block, StepHeader } from '../StepHeader'
import { HubDiagram } from './HubDiagram'

export function ConnectStep() {
  const integrations = useOnboarding((s) => s.integrations)
  const [pending, setPending] = useState<string[]>([])
  // Just-connected cards don't flip to "Disconnect" until the pointer leaves once.
  const [fresh, setFresh] = useState<string[]>([])

  const toggle = (id: string) => {
    if (pending.includes(id)) return
    const { integrations: cur, update } = useOnboarding.getState()
    if (cur.includes(id)) {
      update({ integrations: cur.filter((x) => x !== id) })
      return
    }
    setPending((p) => [...p, id])
    setTimeout(() => {
      const now = useOnboarding.getState().integrations
      if (!now.includes(id)) useOnboarding.getState().update({ integrations: [...now, id] })
      setPending((p) => p.filter((x) => x !== id))
      setFresh((f) => [...f, id])
    }, 1200)
  }

  return (
    <div>
      <StepHeader step={3} title="Plug in your" accent="data">
        Connect a source or two now — Dashward starts modelling the moment data arrives. Read-only, encrypted, revocable any time.
      </StepHeader>

      <Block i={0} className="relative mb-8 overflow-hidden rounded-3xl border border-border bg-surface/50 px-3 py-6 backdrop-blur sm:px-6">
        <div aria-hidden className="absolute inset-0 bg-dots mask-radial opacity-70" />
        <HubDiagram connected={integrations} pending={pending} />
        <p className="relative mt-4 text-center text-xs text-fg-muted" aria-live="polite">
          {integrations.length === 0 ? (
            'No sources yet — you can explore with sample data.'
          ) : (
            <>
              <span className="font-medium text-fg">{integrations.length}</span> source{integrations.length > 1 ? 's' : ''} streaming into your workspace
            </>
          )}
        </p>
      </Block>

      <Block i={1}>
        <div className="grid grid-cols-1 gap-3 min-[520px]:grid-cols-2">
          {INTEGRATIONS.map((it, i) => {
            const on = integrations.includes(it.id)
            const busy = pending.includes(it.id)
            return (
              <motion.div
                key={it.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.035, duration: 0.5 }}
                className={cn(
                  'group relative flex items-center gap-3 rounded-2xl border p-3 transition-all duration-300',
                  on ? 'border-success/40 bg-success/[0.05]' : 'border-border bg-surface/70 hover:border-border-strong hover:bg-surface',
                )}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.3)]"
                    style={{ background: it.color }}
                  >
                    {it.glyph}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{it.name}</span>
                    <span className="block truncate text-xs text-fg-subtle">{it.description}</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(it.id)}
                  onPointerLeave={() => setFresh((f) => f.filter((x) => x !== it.id))}
                  aria-pressed={on}
                  aria-label={on ? `Disconnect ${it.name}` : `Connect ${it.name}`}
                  disabled={busy}
                  className={cn(
                    'group/btn relative inline-flex h-8 min-w-[6.5rem] shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full px-3 text-xs font-medium transition-all',
                    on && 'bg-success/15 text-success',
                    on && !fresh.includes(it.id) && 'hover:bg-danger/10 hover:text-danger',
                    busy && 'bg-surface-3 text-fg-muted',
                    !on && !busy && 'border border-border-strong text-fg hover:bg-fg hover:text-bg',
                  )}
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={busy ? 'busy' : on ? 'on' : 'off'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-1.5"
                    >
                      {busy ? (
                        <>
                          <span className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Connecting
                        </>
                      ) : on ? (
                        <>
                          <Check className="size-3.5" strokeWidth={3} />
                          <span className={cn(!fresh.includes(it.id) && 'group-hover/btn:hidden')}>Connected</span>
                          {!fresh.includes(it.id) && <span className="hidden group-hover/btn:inline">Disconnect</span>}
                        </>
                      ) : (
                        <>
                          <Plus className="size-3.5" /> Connect
                        </>
                      )}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </motion.div>
            )
          })}
        </div>
      </Block>
    </div>
  )
}
