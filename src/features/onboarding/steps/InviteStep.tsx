import { AnimatePresence, motion, useAnimationControls } from 'motion/react'
import { useId, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react'
import { Check, Copy, Link2, Mail, Plus, X } from 'lucide-react'
import { z } from 'zod'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/input'
import { useOnboarding } from '@/store/onboarding'
import { useAuth } from '@/store/auth'
import { cn } from '@/lib/utils'
import { Block, StepHeader } from '../StepHeader'
import { hueFrom } from '../config'

const emailSchema = z.email()
const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: 'Member' },
  { value: 'viewer', label: 'Viewer' },
]

function Chip({ email, onRemove }: { email: string; onRemove: () => void }) {
  const hue = hueFrom(email)
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.6, filter: 'blur(4px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.6, filter: 'blur(4px)' }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-surface py-1 pr-1 pl-1 text-sm shadow-elevated"
    >
      <span
        className="flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white uppercase"
        style={{ background: `oklch(0.64 0.17 ${hue})` }}
      >
        {email[0]}
      </span>
      <span className="truncate">{email}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${email}`}
        className="flex size-5 shrink-0 items-center justify-center rounded-full text-fg-subtle transition hover:bg-surface-3 hover:text-fg"
      >
        <X className="size-3" />
      </button>
    </motion.span>
  )
}

export function InviteStep() {
  const id = useId()
  const { invites, slug, update } = useOnboarding()
  const user = useAuth((s) => s.user)
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [role, setRole] = useState('member')
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const shake = useAnimationControls()
  const domain = user?.email.split('@')[1] ?? 'company.com'
  const suggestions = ['maya', 'leo', 'priya'].map((n) => `${n}@${domain}`).filter((e) => !invites.includes(e))
  const link = `https://dashward.app/join/${slug || 'workspace'}?t=k7f2q9`

  const add = (raw: string) => {
    const list = raw
      .split(/[\s,;]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
    if (!list.length) return true
    const next = [...useOnboarding.getState().invites]
    for (const e of list) {
      if (!emailSchema.safeParse(e).success) {
        setError(`“${e}” doesn’t look like an email address`)
        shake.start({ x: [0, -8, 8, -5, 5, 0], transition: { duration: 0.4 } })
        return false
      }
      if (next.includes(e)) {
        setError(`${e} is already on the list`)
        return false
      }
      next.push(e)
    }
    update({ invites: next })
    setError(null)
    return true
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || (e.key === ' ' && value.includes('@'))) {
      if (!value.trim()) return
      e.preventDefault()
      if (add(value)) setValue('')
    } else if (e.key === 'Backspace' && !value && invites.length) {
      e.preventDefault()
      update({ invites: invites.slice(0, -1) })
    }
  }

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text')
    if (/[\s,;]/.test(text.trim())) {
      e.preventDefault()
      if (add(text)) setValue('')
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link)
    } catch {
      /* clipboard can be blocked; the state still confirms intent */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div>
      <StepHeader step={4} title="Analytics is a" accent="team sport">
        Invite the people who ask you for numbers. They’ll get a friendly email and land right in your workspace.
      </StepHeader>

      <Block i={0}>
        <div className="mb-1.5 flex items-end justify-between gap-3">
          <Label htmlFor={`${id}-email`} className="mb-0">
            Email addresses
          </Label>
          <div className="flex items-center gap-2 text-xs text-fg-subtle">
            <span className="hidden sm:inline">Invite as</span>
            <Select value={role} onValueChange={setRole} options={ROLES} className="h-8 text-xs" />
          </div>
        </div>
        <motion.div
          animate={shake}
          onClick={() => inputRef.current?.focus()}
          className={cn(
            'flex min-h-[3.25rem] cursor-text flex-wrap items-center gap-1.5 rounded-2xl border bg-surface-2/60 p-2 transition focus-within:bg-surface focus-within:ring-4',
            error ? 'border-danger/60 focus-within:ring-danger/15' : 'border-border hover:border-border-strong focus-within:border-accent/60 focus-within:ring-ring/20',
          )}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {invites.map((e) => (
              <Chip key={e} email={e} onRemove={() => update({ invites: invites.filter((x) => x !== e) })} />
            ))}
          </AnimatePresence>
          <motion.div layout className="flex min-w-[10rem] flex-1 items-center gap-2 px-1.5">
            {!invites.length && <Mail className="size-4 shrink-0 text-fg-subtle" />}
            <input
              ref={inputRef}
              id={`${id}-email`}
              type="email"
              inputMode="email"
              autoComplete="off"
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                if (error) setError(null)
              }}
              onKeyDown={onKeyDown}
              onPaste={onPaste}
              onBlur={() => {
                if (value.trim() && add(value)) setValue('')
              }}
              placeholder={invites.length ? 'Add another…' : 'name@company.com, then Enter'}
              aria-invalid={!!error}
              aria-describedby={`${id}-hint`}
              className="h-9 w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg-subtle"
            />
          </motion.div>
        </motion.div>
        <div id={`${id}-hint`} className="mt-2 min-h-5 text-xs" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {error ? (
              <motion.p key="err" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-danger">
                {error}
              </motion.p>
            ) : (
              <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-fg-subtle">
                Press Enter or comma to add. Paste a list to add many at once.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </Block>

      {suggestions.length > 0 && (
          <Block i={1} className="mt-5">
            <p className="mb-2 text-xs font-medium text-fg-muted">Suggested from {domain}</p>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence mode="popLayout">
                {suggestions.map((s) => (
                  <motion.button
                    layout
                    key={s}
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => add(s)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border-strong px-3 py-1.5 text-xs text-fg-muted transition hover:border-accent/50 hover:bg-accent/5 hover:text-fg"
                  >
                    <Plus className="size-3" /> {s}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </Block>
      )}

      <Block i={2} className="mt-10">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface/70 p-4 backdrop-blur sm:p-5">
          <div aria-hidden className="absolute -bottom-16 -left-10 size-44 rounded-full bg-accent-2/15 blur-3xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-2/12 text-accent-2">
                <Link2 className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">Or share an invite link</p>
                <p className="truncate font-mono text-xs text-fg-subtle">{link}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={copy}
              className={cn(
                'inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border px-4 text-sm font-medium transition-all',
                copied ? 'border-success/40 bg-success/10 text-success' : 'border-border-strong hover:bg-surface-2',
              )}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={copied ? 'y' : 'n'}
                  initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="flex"
                >
                  {copied ? <Check className="size-4" strokeWidth={3} /> : <Copy className="size-4" />}
                </motion.span>
              </AnimatePresence>
              <span aria-live="polite">{copied ? 'Copied' : 'Copy link'}</span>
            </button>
          </div>
        </div>
      </Block>
    </div>
  )
}
