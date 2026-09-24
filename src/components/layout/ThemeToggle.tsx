import { AnimatePresence, motion } from 'motion/react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/store/theme'
import { cn } from '@/lib/utils'

/** Sun/moon toggle. The theme change radiates out from the button (View Transitions). */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolved, setTheme } = useTheme()
  const dark = resolved === 'dark'
  return (
    <button
      type="button"
      aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setTheme(dark ? 'light' : 'dark', { x: r.left + r.width / 2, y: r.top + r.height / 2 })
      }}
      className={cn(
        'relative inline-flex size-9 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-2/60 text-fg-muted transition hover:border-border-strong hover:text-fg',
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? 'moon' : 'sun'}
          initial={{ y: 14, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -14, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {dark ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
