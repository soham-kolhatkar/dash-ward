import { AnimatePresence, motion } from 'motion/react'
import { Eye, EyeOff, KeyRound, Plus, ShieldCheck, Trash2, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input, Label } from '@/components/ui/input'
import { EmptyState } from '@/components/ui/misc'
import { Select } from '@/components/ui/select'
import { Tooltip } from '@/components/ui/tooltip'
import { fmt } from '@/lib/format'
import { cn, sleep } from '@/lib/utils'
import { ConfirmDialog } from '../shared/ConfirmDialog'
import { CopyIcon, useCopy } from '../shared/CopyButton'
import { Section, TabBody } from './ui'

interface ApiKey {
  id: string
  name: string
  secret: string
  env: 'live' | 'test'
  scope: 'read' | 'full'
  created: string
  lastUsed: string | null
}

const day = 864e5
const randomSecret = (env: 'live' | 'test') => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return `dw_${env}_${[...bytes].map((b) => chars[b % chars.length]).join('')}`
}

const SEED: ApiKey[] = [
  { id: 'k1', name: 'Production ingest', secret: 'dw_live_8f2kq9x7m4v1n6b3c5z0p2r8t4y7w3f9a', env: 'live', scope: 'full', created: new Date(Date.now() - 142 * day).toISOString(), lastUsed: new Date(Date.now() - 4 * 60_000).toISOString() },
  { id: 'k2', name: 'Looker Studio connector', secret: 'dw_live_2h7j4k1l9m3n8b5v6c0x2z7q4w1e9r2d1', env: 'live', scope: 'read', created: new Date(Date.now() - 61 * day).toISOString(), lastUsed: new Date(Date.now() - 3 * 3_600_000).toISOString() },
  { id: 'k3', name: 'Staging', secret: 'dw_test_5t8y1u4i7o0p3a6s9d2f5g8h1j4k7l0c7', env: 'test', scope: 'full', created: new Date(Date.now() - 12 * day).toISOString(), lastUsed: null },
]

const mask = (s: string) => `${s.slice(0, 8)}${'•'.repeat(18)}${s.slice(-4)}`

export function ApiKeysTab() {
  const [keys, setKeys] = useState(SEED)
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [createOpen, setCreateOpen] = useState(false)
  const [revoke, setRevoke] = useState<ApiKey | null>(null)

  return (
    <TabBody>
      <Section
        title="API keys"
        description="Use keys to send events and query metrics from your own services. Treat them like passwords."
        footer={
          <>
            <p className="flex items-center gap-1.5 text-xs text-fg-subtle">
              <ShieldCheck className="size-3.5 text-success" /> Keys are hashed at rest. Full secrets are shown only once.
            </p>
            <Button size="sm" variant="brand" onClick={() => setCreateOpen(true)}>
              <Plus /> Create key
            </Button>
          </>
        }
      >
        {keys.length === 0 ? (
          <EmptyState className="py-8" icon={<KeyRound />} title="No API keys" description="Create a key to start sending events from your backend." />
        ) : (
          <ul className="-my-1 divide-y divide-border">
            <AnimatePresence initial={false}>
              {keys.map((k) => (
                <motion.li
                  key={k.id}
                  layout
                  initial={{ opacity: 0, y: -8, backgroundColor: 'color-mix(in oklch, var(--accent) 10%, transparent)' }}
                  animate={{ opacity: 1, y: 0, backgroundColor: 'rgba(0,0,0,0)', transition: { duration: 0.5, backgroundColor: { duration: 2 } } }}
                  exit={{ opacity: 0, height: 0, x: 24, transition: { duration: 0.3 } }}
                  className="overflow-hidden"
                >
                  <KeyRow
                    k={k}
                    shown={revealed.has(k.id)}
                    onToggle={() =>
                      setRevealed((s) => {
                        const n = new Set(s)
                        if (n.has(k.id)) n.delete(k.id)
                        else n.add(k.id)
                        return n
                      })
                    }
                    onRevoke={() => setRevoke(k)}
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </Section>

      <CreateKeyDialog open={createOpen} onOpenChange={setCreateOpen} onCreate={(k) => setKeys((l) => [k, ...l])} />
      <ConfirmDialog
        open={!!revoke}
        onOpenChange={(o) => !o && setRevoke(null)}
        title={`Revoke “${revoke?.name}”?`}
        description="Requests using this key will start failing with 401 immediately. This can’t be undone."
        actionLabel="Revoke key"
        onConfirm={() => {
          if (!revoke) return
          setKeys((l) => l.filter((x) => x.id !== revoke.id))
          toast.success('Key revoked', { description: revoke.name })
        }}
      />
    </TabBody>
  )
}

function KeyRow({ k, shown, onToggle, onRevoke }: { k: ApiKey; shown: boolean; onToggle: () => void; onRevoke: () => void }) {
  const { copied, copy } = useCopy()
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">{k.name}</span>
          <Badge variant={k.env === 'live' ? 'success' : 'warning'}>{k.env === 'live' ? 'Live' : 'Test'}</Badge>
          <Badge>{k.scope === 'full' ? 'Full access' : 'Read only'}</Badge>
        </div>
        <div className="mt-2 flex min-w-0 items-center gap-1 rounded-lg border border-border bg-surface-2/60 py-1 pr-1 pl-3">
          <code className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-fg-muted">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={String(shown)} initial={{ opacity: 0, filter: 'blur(4px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(4px)' }} transition={{ duration: 0.2 }} className="block truncate">
                {shown ? k.secret : mask(k.secret)}
              </motion.span>
            </AnimatePresence>
          </code>
          <Tooltip content={shown ? 'Hide' : 'Reveal'}>
            <button type="button" aria-label={shown ? 'Hide key' : 'Reveal key'} onClick={onToggle} className="flex size-7 shrink-0 items-center justify-center rounded-md text-fg-subtle transition hover:bg-surface-3 hover:text-fg">
              {shown ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            </button>
          </Tooltip>
          <Tooltip content={copied ? 'Copied!' : 'Copy'}>
            <button
              type="button"
              aria-label={copied ? 'Copied' : 'Copy key'}
              onClick={() => {
                copy(k.secret)
                toast.success('API key copied')
              }}
              className={cn('flex size-7 shrink-0 items-center justify-center rounded-md text-fg-subtle transition hover:bg-surface-3 hover:text-fg', copied && 'text-success')}
            >
              <CopyIcon copied={copied} className="[&_svg]:size-3.5" />
            </button>
          </Tooltip>
        </div>
        <div className="mt-1.5 text-[11px] text-fg-subtle">
          Created {fmt.date(k.created)} · {k.lastUsed ? `Last used ${fmt.relative(k.lastUsed)}` : 'Never used'}
        </div>
      </div>
      <Button variant="ghost" size="sm" className="self-start text-fg-muted hover:bg-danger/10 hover:text-danger sm:self-center" onClick={onRevoke}>
        <Trash2 /> Revoke
      </Button>
    </div>
  )
}

function CreateKeyDialog({ open, onOpenChange, onCreate }: { open: boolean; onOpenChange: (o: boolean) => void; onCreate: (k: ApiKey) => void }) {
  const [name, setName] = useState('')
  const [env, setEnv] = useState<'live' | 'test'>('live')
  const [scope, setScope] = useState<'read' | 'full'>('read')
  const [busy, setBusy] = useState(false)
  const [created, setCreated] = useState<ApiKey | null>(null)
  const { copied, copy } = useCopy(2200)

  const close = (o: boolean) => {
    onOpenChange(o)
    if (!o)
      setTimeout(() => {
        setCreated(null)
        setName('')
        setEnv('live')
        setScope('read')
      }, 250)
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent
        title={created ? 'Save your new key' : 'Create API key'}
        description={created ? 'Copy it now and store it somewhere safe. You won’t be able to see it again.' : 'Give the key a name that says where it’s used.'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {created ? (
            <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="relative overflow-hidden rounded-xl border border-accent/30 bg-accent/[0.06] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium">{created.name}</span>
                  <Badge variant={created.env === 'live' ? 'success' : 'warning'}>{created.env === 'live' ? 'Live' : 'Test'}</Badge>
                </div>
                <code className="block font-mono text-[13px] break-all text-fg">{created.secret}</code>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-warning/10 px-3 py-2 text-xs text-warning">
                <TriangleAlert className="size-3.5 shrink-0" /> This is the only time the full key is shown.
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => copy(created.secret)}>
                  <CopyIcon copied={copied} /> {copied ? 'Copied' : 'Copy key'}
                </Button>
                <Button size="sm" onClick={() => close(false)}>
                  Done
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault()
                if (!name.trim()) return
                setBusy(true)
                await sleep(700)
                const k: ApiKey = { id: Math.random().toString(36).slice(2), name: name.trim(), secret: randomSecret(env), env, scope, created: new Date().toISOString(), lastUsed: null }
                setBusy(false)
                setCreated(k)
                onCreate(k)
              }}
            >
              <div>
                <Label htmlFor="k-name">Name</Label>
                <Input id="k-name" placeholder="e.g. Warehouse sync" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Environment</Label>
                  <Select value={env} onValueChange={(v) => setEnv(v as 'live' | 'test')} options={[{ value: 'live', label: 'Live' }, { value: 'test', label: 'Test' }]} className="h-11 w-full rounded-xl" />
                </div>
                <div>
                  <Label>Permissions</Label>
                  <Select value={scope} onValueChange={(v) => setScope(v as 'read' | 'full')} options={[{ value: 'read', label: 'Read only' }, { value: 'full', label: 'Full access' }]} className="h-11 w-full rounded-xl" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="ghost" size="sm" onClick={() => close(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="brand" size="sm" loading={busy} disabled={!name.trim()}>
                  Create key
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
