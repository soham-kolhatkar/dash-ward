import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

/** A pill toolbar that slides up from the bottom of the viewport. Portalled so transforms on ancestors don't trap it. */
export function FloatingBar({ open, children, className }: { open: boolean; children: ReactNode; className?: string }) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4"
        >
          <div
            role="toolbar"
            className={cn(
              'pointer-events-auto flex max-w-full items-center gap-1 rounded-full border border-border-strong bg-surface/90 p-1.5 pl-4 text-sm shadow-elevated backdrop-blur-xl dark:bg-surface-2/90',
              className,
            )}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
