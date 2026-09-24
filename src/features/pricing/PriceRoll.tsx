import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

const DIGITS = Array.from({ length: 10 }, (_, i) => i)

/** Odometer-style number: each digit rolls to its new value. */
export function PriceRoll({ value, className }: { value: number; className?: string }) {
  const chars = String(value).split('')
  return (
    <span className={cn('inline-flex overflow-hidden leading-none tabular-nums', className)} aria-label={String(value)}>
      {chars.map((c, i) => {
        const d = Number(c)
        const key = chars.length - i
        return (
          <span key={key} aria-hidden className="relative inline-block h-[1em] w-[0.62em] overflow-hidden">
            <motion.span
              className="absolute inset-x-0 top-0 flex flex-col"
              initial={false}
              animate={{ y: `${-d * 10}%` }}
              transition={{ type: 'spring', stiffness: 140, damping: 20, mass: 0.9, delay: (chars.length - i) * 0.04 }}
            >
              {DIGITS.map((n) => (
                <span key={n} className="flex h-[1em] items-center justify-center">
                  {n}
                </span>
              ))}
            </motion.span>
          </span>
        )
      })}
    </span>
  )
}
