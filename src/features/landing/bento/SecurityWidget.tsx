import { motion } from 'motion/react'
import { Check, LockKeyhole } from 'lucide-react'

const CHECKS = ['SOC 2 Type II', 'GDPR & CCPA', 'AES-256 at rest', 'SSO / SAML']

export function SecurityWidget() {
  return (
    <div className="flex h-full items-center gap-6 px-6 pb-6 sm:px-7 sm:pb-7">
      <div className="relative shrink-0">
        <div aria-hidden className="absolute inset-0 rounded-full bg-accent-3/25 blur-2xl dark:bg-accent-3/20" />
        <div className="relative h-32 w-28 overflow-hidden">
          <svg viewBox="0 0 112 128" className="absolute inset-0 size-full" aria-hidden>
            <defs>
              <linearGradient id="shield-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="var(--accent-3)" />
                <stop offset="1" stopColor="var(--accent-2)" />
              </linearGradient>
              <linearGradient id="scan-g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--accent-3)" stopOpacity="0" />
                <stop offset="0.9" stopColor="var(--accent-3)" stopOpacity="0.45" />
                <stop offset="1" stopColor="var(--accent-3)" stopOpacity="1" />
              </linearGradient>
              <clipPath id="shield-clip">
                <path d="M56 4 104 22v36c0 32-21 55-48 66C29 113 8 90 8 58V22z" />
              </clipPath>
            </defs>
            <path d="M56 4 104 22v36c0 32-21 55-48 66C29 113 8 90 8 58V22z" fill="var(--surface-2)" stroke="url(#shield-g)" strokeWidth="2.5" />
            <g clipPath="url(#shield-clip)">
              {Array.from({ length: 9 }, (_, i) => (
                <line key={i} x1="0" x2="112" y1={14 + i * 13} y2={14 + i * 13} stroke="var(--accent-3)" strokeOpacity="0.12" />
              ))}
              <motion.rect
                x="0"
                width="112"
                height="40"
                fill="url(#scan-g)"
                initial={{ y: -40 }}
                animate={{ y: [-40, 110] }}
                transition={{ duration: 2.4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              />
            </g>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="flex size-11 items-center justify-center rounded-2xl bg-fg text-bg shadow-elevated"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <LockKeyhole className="size-5" />
            </motion.span>
          </div>
        </div>
      </div>
      <ul className="min-w-0 space-y-2.5">
        {CHECKS.map((c, i) => (
          <motion.li
            key={c}
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
            className="flex items-center gap-2 text-sm text-fg"
          >
            <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-accent-3/20 text-[color-mix(in_oklch,var(--accent-3)_60%,var(--fg))]">
              <Check className="size-3" strokeWidth={3} />
            </span>
            {c}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
