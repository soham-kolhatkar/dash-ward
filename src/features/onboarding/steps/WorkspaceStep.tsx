import { AnimatePresence, motion } from 'motion/react'
import { useId, useRef, useState } from 'react'
import { Globe, Lock, Sparkles } from 'lucide-react'
import { Input, Label } from '@/components/ui/input'
import { useOnboarding } from '@/store/onboarding'
import { useAuth } from '@/store/auth'
import { initials, slugify } from '@/lib/utils'
import { ease } from '@/lib/motion'
import { Block, StepHeader } from '../StepHeader'
import { companyFromEmail, hueFrom } from '../config'

export function WorkspaceAvatar({ name, className }: { name: string; className?: string }) {
  const hue = hueFrom(name || 'dashward')
  const letters = initials(name.trim()) || 'DW'
  return (
    <motion.div
      className={className}
      animate={{
        background: `linear-gradient(135deg, oklch(0.62 0.22 ${hue}), oklch(0.78 0.15 ${(hue + 70) % 360}))`,
      }}
      transition={{ duration: 0.6 }}
      style={{ borderRadius: 18 }}
    >
      <div className="relative flex size-full items-center justify-center overflow-hidden rounded-[inherit] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35)]">
        <div aria-hidden className="absolute -top-1/2 -left-1/4 h-full w-[150%] rotate-12 bg-white/20 blur-md" />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={letters}
            initial={{ y: 16, opacity: 0, scale: 0.6 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -16, opacity: 0, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            className="relative text-xl font-semibold tracking-tight"
          >
            {letters}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

const cleanSlug = (v: string) =>
  v
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-/, '')
    .slice(0, 32)

function AnimatedSlug({ slug }: { slug: string }) {
  const chars = (slug || 'your-team').split('')
  return (
    <span className={slug ? 'text-fg' : 'text-fg-subtle'}>
      <AnimatePresence mode="popLayout" initial={false}>
        {chars.map((c, i) => (
          <motion.span
            key={`${i}-${c}`}
            initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.25, ease: ease.outExpo }}
            className="inline-block whitespace-pre"
          >
            {c}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  )
}

export function WorkspaceStep() {
  const id = useId()
  const { workspace, slug, update } = useOnboarding()
  const email = useAuth((s) => s.user?.email)
  const [slugTouched, setSlugTouched] = useState(() => !!slug && slug !== slugify(workspace))
  const suggestion = companyFromEmail(email)
  const nameRef = useRef<HTMLInputElement>(null)
  const slugTooShort = slug.length > 0 && slug.length < 2

  const setName = (v: string) => update({ workspace: v, ...(slugTouched ? {} : { slug: slugify(v).slice(0, 32) }) })

  return (
    <div>
      <StepHeader step={0} title="Name your" accent="workspace">
        This is where your dashboards, sources and teammates live. You can rename it any time.
      </StepHeader>

      <Block i={0}>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface/80 p-5 shadow-elevated backdrop-blur-xl sm:p-6">
          <div aria-hidden className="absolute -top-24 -right-16 size-56 rounded-full bg-accent/15 blur-3xl" />
          <div className="relative flex items-center gap-4 sm:gap-5">
            <WorkspaceAvatar name={workspace} className="size-16 shrink-0 shadow-glow sm:size-[72px]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-semibold tracking-tight sm:text-xl">
                {workspace.trim() || <span className="text-fg-subtle">Your workspace</span>}
              </p>
              <div className="mt-1.5 flex min-w-0 items-center gap-2 rounded-full border border-border bg-bg/60 px-3 py-1.5 font-mono text-[13px]">
                <Lock className="size-3 shrink-0 text-success" />
                <span className="flex min-w-0 overflow-hidden whitespace-nowrap">
                  <span className="text-fg-subtle">dashward.app/</span>
                  <AnimatedSlug slug={slug} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Block>

      <Block i={1} className="mt-8 space-y-5">
        <div>
          <Label htmlFor={`${id}-name`}>Workspace name</Label>
          <Input
            ref={nameRef}
            id={`${id}-name`}
            autoFocus
            autoComplete="organization"
            placeholder="Northwind Labs"
            value={workspace}
            maxLength={48}
            onChange={(e) => setName(e.target.value)}
          />
          <AnimatePresence>
            {suggestion && !workspace && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                onClick={() => {
                  setName(suggestion)
                  nameRef.current?.focus()
                }}
                className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/8 px-2.5 py-1 text-xs text-accent transition hover:bg-accent/15"
              >
                <Sparkles className="size-3" /> Use “{suggestion}”
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <div>
          <Label htmlFor={`${id}-slug`}>Workspace URL</Label>
          <div className="flex overflow-hidden rounded-xl border border-border bg-surface-2/60 transition focus-within:border-accent/60 focus-within:bg-surface focus-within:ring-4 focus-within:ring-ring/20 hover:border-border-strong">
            <span className="flex items-center gap-1.5 border-r border-border bg-surface-3/50 px-3 text-sm text-fg-subtle">
              <Globe className="size-3.5" />
              <span className="hidden sm:inline">dashward.app/</span>
            </span>
            <input
              id={`${id}-slug`}
              value={slug}
              maxLength={32}
              placeholder="northwind-labs"
              aria-invalid={slugTooShort}
              aria-describedby={`${id}-slug-hint`}
              onChange={(e) => {
                setSlugTouched(true)
                update({ slug: cleanSlug(e.target.value) })
              }}
              onBlur={() => update({ slug: slug.replace(/-+$/, '') })}
              className="h-11 min-w-0 flex-1 bg-transparent px-3 font-mono text-sm text-fg outline-none placeholder:text-fg-subtle"
            />
          </div>
          <p id={`${id}-slug-hint`} className="mt-1.5 text-xs text-fg-subtle">
            Lowercase letters, numbers and dashes. {slugTouched && workspace && (
              <button
                type="button"
                className="text-accent hover:underline"
                onClick={() => {
                  setSlugTouched(false)
                  update({ slug: slugify(workspace).slice(0, 32) })
                }}
              >
                Reset to match name
              </button>
            )}
          </p>
        </div>
      </Block>
    </div>
  )
}
