import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

const blob = [
  '42% 58% 63% 37% / 45% 42% 58% 55%',
  '58% 42% 38% 62% / 55% 60% 40% 45%',
  '46% 54% 56% 44% / 38% 52% 48% 62%',
  '42% 58% 63% 37% / 45% 42% 58% 55%',
]

/** A breathing, morphing gradient orb. Pure CSS gradients + motion; no canvas. */
export function Orb({ className, active = false }: { className?: string; active?: boolean }) {
  return (
    <div className={cn('relative size-28', className)} aria-hidden>
      <motion.div
        className="absolute -inset-1/2 rounded-full opacity-60 blur-3xl dark:opacity-70"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, color-mix(in oklch, var(--accent-2) 60%, transparent) 35%, transparent 70%)' }}
        animate={{ scale: active ? [1, 1.25, 1] : [1, 1.1, 1], opacity: active ? [0.6, 0.9, 0.6] : undefined }}
        transition={{ duration: active ? 1.6 : 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-0 overflow-hidden shadow-[inset_0_-10px_30px_rgba(0,0,0,.35),inset_0_8px_24px_rgba(255,255,255,.35),0_20px_60px_-10px_var(--glow)]"
        animate={{ borderRadius: blob, scale: [1, 1.04, 0.98, 1] }}
        transition={{ duration: active ? 3 : 9, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          className="absolute -inset-1/4"
          style={{
            background:
              'conic-gradient(from 0deg, var(--accent), var(--accent-2), var(--accent-3), var(--accent-4), var(--accent))',
            filter: 'blur(16px) saturate(1.2)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: active ? 4 : 14, repeat: Infinity, ease: 'linear' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 32% 28%, rgba(255,255,255,.75), transparent 60%), radial-gradient(70% 60% at 70% 85%, rgba(0,0,0,.35), transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </motion.div>
    </div>
  )
}
