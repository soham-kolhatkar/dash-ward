import { AnimatePresence, motion } from 'motion/react'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'

const LEVELS = [
  { label: 'Too short', color: 'var(--fg-subtle)', text: 'text-fg-subtle' },
  { label: 'Weak', color: 'var(--danger)', text: 'text-danger' },
  { label: 'Fair', color: 'var(--warning)', text: 'text-warning' },
  { label: 'Good', color: 'var(--accent-2)', text: 'text-accent-2' },
  { label: 'Strong', color: 'var(--success)', text: 'text-success' },
]

export function scorePassword(pw: string) {
  if (pw.length < 8) return { score: pw.length ? 1 : 0, hint: 'Use at least 8 characters.' }
  const checks = [
    { ok: /[a-z]/.test(pw) && /[A-Z]/.test(pw), hint: 'Mix upper and lowercase letters.' },
    { ok: /\d/.test(pw), hint: 'Add a number.' },
    { ok: /[^A-Za-z0-9]/.test(pw), hint: 'Add a symbol like ! or #.' },
    { ok: pw.length >= 12, hint: 'Go for 12+ characters.' },
  ]
  const passed = checks.filter((c) => c.ok).length
  const score = Math.min(4, 1 + passed)
  const missing = checks.find((c) => !c.ok)
  return { score, hint: missing ? missing.hint : 'Excellent — this one is hard to crack.' }
}

export function PasswordStrength({ password, id }: { password: string; id?: string }) {
  const { score, hint } = scorePassword(password)
  const level = LEVELS[score]
  return (
    <div id={id} className="mt-2.5" aria-live="polite">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((seg) => (
          <div key={seg} className="relative h-1 flex-1 overflow-hidden rounded-full bg-surface-3">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              initial={false}
              animate={{ width: score >= seg ? '100%' : '0%', backgroundColor: level.color }}
              transition={{ duration: 0.45, ease: ease.outExpo, delay: score >= seg ? (seg - 1) * 0.05 : 0 }}
              style={{ boxShadow: score >= seg ? `0 0 10px ${level.color}` : undefined }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between gap-3 text-xs">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={hint}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-fg-subtle"
          >
            {hint}
          </motion.span>
        </AnimatePresence>
        {password && <span className={cn('shrink-0 font-medium transition-colors', level.text)}>{level.label}</span>}
      </div>
    </div>
  )
}
