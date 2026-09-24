import { AnimatePresence, motion } from 'motion/react'
import { forwardRef, useState, type ReactNode } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { Button, type ButtonProps } from '@/components/ui/button'
import { Input, type InputProps } from '@/components/ui/input'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'

export type SubmitState = 'idle' | 'loading' | 'success'

export function AuthHeading({ eyebrow, title, accent, children }: { eyebrow?: string; title: string; accent?: string; children?: ReactNode }) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: ease.outExpo }}
          className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-fg-subtle uppercase"
        >
          <span className="size-1.5 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" />
          {eyebrow}
        </motion.p>
      )}
      <h1 className="text-[2rem] leading-[1.1] font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
        {title} {accent && <span className="font-serif font-normal tracking-normal italic text-gradient">{accent}</span>}
      </h1>
      {children && <p className="mt-3 text-[15px] leading-relaxed text-fg-muted">{children}</p>}
    </div>
  )
}

export function AnimatedError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          key="err"
          id={id}
          role="alert"
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: -4 }}
          transition={{ duration: 0.28, ease: ease.outExpo }}
          className="overflow-hidden text-xs text-danger"
        >
          <span className="flex items-center gap-1.5 pt-1.5">
            <span className="inline-block size-1 rounded-full bg-danger" />
            {message}
          </span>
        </motion.p>
      )}
    </AnimatePresence>
  )
}

export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, 'type' | 'trailing'>>((props, ref) => {
  const [show, setShow] = useState(false)
  return (
    <Input
      ref={ref}
      type={show ? 'text' : 'password'}
      icon={<Lock />}
      {...props}
      trailing={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          aria-pressed={show}
          className="relative flex size-7 items-center justify-center overflow-hidden rounded-lg text-fg-subtle transition hover:bg-surface-3 hover:text-fg"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={show ? 'off' : 'on'}
              initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 30 }}
              transition={{ duration: 0.2 }}
              className="flex"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </motion.span>
          </AnimatePresence>
        </button>
      }
    />
  )
})
PasswordInput.displayName = 'PasswordInput'

/** Full-width submit that morphs label → spinner → drawn checkmark. */
export function SubmitButton({ state, children, className, disabled, ...props }: Omit<ButtonProps, 'loading'> & { state: SubmitState }) {
  return (
    <Button
      type="submit"
      size="lg"
      aria-busy={state === 'loading'}
      disabled={state !== 'idle' || disabled}
      className={cn(
        'group w-full overflow-hidden text-[15px] disabled:opacity-100',
        state === 'success' && 'text-white',
        className,
      )}
      {...props}
    >
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-[inherit] bg-success"
        initial={false}
        animate={{ opacity: state === 'success' ? 1 : 0, scale: state === 'success' ? 1 : 0.6 }}
        transition={{ duration: 0.35, ease: ease.outExpo }}
      />
      <AnimatePresence mode="popLayout" initial={false}>
        {state === 'idle' && (
          <motion.span
            key="idle"
            className="relative flex items-center gap-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.span>
        )}
        {state === 'loading' && (
          <motion.span
            key="loading"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="relative flex items-center"
          >
            <svg viewBox="0 0 24 24" className="size-5! animate-spin" aria-hidden>
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity=".2" strokeWidth="2.5" />
              <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="sr-only">Working…</span>
          </motion.span>
        )}
        {state === 'success' && (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            className="relative flex items-center"
          >
            <svg viewBox="0 0 24 24" className="size-5!" aria-hidden>
              <motion.path
                d="M5 12.5l4.5 4.5L19 7.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, ease: ease.outExpo, delay: 0.05 }}
              />
            </svg>
            <span className="sr-only">Done</span>
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  )
}

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3.01c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.95H1.26v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.6H1.26A12 12 0 0 0 0 12c0 1.94.46 3.77 1.26 5.4l4.01-3.11z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.26 6.6l4.01 3.11C6.22 6.88 8.87 4.77 12 4.77z" />
    </svg>
  )
}

export function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
    </svg>
  )
}

export function SocialButtons({ onSelect, busy }: { onSelect: (provider: 'Google' | 'GitHub') => void; busy?: string | null }) {
  const providers = [
    { name: 'Google' as const, icon: <GoogleIcon /> },
    { name: 'GitHub' as const, icon: <GitHubIcon /> },
  ]
  return (
    <div className="grid grid-cols-2 gap-3">
      {providers.map((p, i) => (
        <motion.div
          key={p.name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 + i * 0.06, ease: ease.outExpo }}
        >
          <Button
            type="button"
            variant="secondary"
            size="lg"
            loading={busy === p.name}
            disabled={!!busy}
            onClick={() => onSelect(p.name)}
            className="w-full rounded-xl text-sm hover:-translate-y-px hover:shadow-elevated"
          >
            {busy !== p.name && p.icon}
            {p.name}
          </Button>
        </motion.div>
      ))}
    </div>
  )
}

export function OrDivider({ label = 'or continue with email' }: { label?: string }) {
  return (
    <div className="my-6 flex items-center gap-3 text-[11px] tracking-[0.14em] text-fg-subtle uppercase">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-border-strong" />
      {label}
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-border-strong" />
    </div>
  )
}

/** Staggered entrance wrapper for form rows. */
export function Row({ i, children, className }: { i: number; children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.12 + i * 0.05, ease: ease.outExpo }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function nameFromEmail(email: string) {
  const local = email.split('@')[0] ?? ''
  const parts = local.split(/[._+-]+/).filter(Boolean)
  if (!parts.length) return 'Friend'
  return parts
    .slice(0, 2)
    .map((p) => p.replace(/\d+/g, ''))
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1).toLowerCase())
    .join(' ') || 'Friend'
}
