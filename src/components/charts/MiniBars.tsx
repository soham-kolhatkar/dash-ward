import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

/** Inline sparkline-ish bars for table rows: `<MiniBars values={[3, 5, 4, 8]} color="var(--success)" />` */
export function MiniBars({
  values,
  color = 'var(--accent)',
  height = 22,
  className,
}: {
  values: number[]
  color?: string
  height?: number
  className?: string
}) {
  const max = Math.max(...values, 1)
  return (
    <div className={cn('flex items-end gap-[3px]', className)} style={{ height }} aria-hidden>
      {values.map((v, i) => (
        <motion.span
          key={i}
          className="w-[4px] rounded-[2px]"
          style={{
            background: color,
            opacity: 0.35 + (i / values.length) * 0.65,
          }}
          initial={{ height: 2 }}
          animate={{ height: Math.max(2, (v / max) * height) }}
          transition={{ duration: 0.7, delay: i * 0.025, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </div>
  )
}
