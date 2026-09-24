import { AnimatePresence, motion } from 'motion/react'
import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function useCopy(timeout = 1600) {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), timeout)
    return () => clearTimeout(id)
  }, [copied, timeout])
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Clipboard can be unavailable (insecure context); still show feedback.
    }
    setCopied(true)
  }
  return { copied, copy }
}

/** Icon swap with a spring morph: copy → check. */
export function CopyIcon({ copied, className }: { copied: boolean; className?: string }) {
  return (
    <span className={cn('relative inline-flex size-4 items-center justify-center', className)}>
      <AnimatePresence initial={false} mode="popLayout">
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0.4, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 26 }}
            className="text-success"
          >
            <Check className="size-4" strokeWidth={2.5} />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 26 }}
          >
            <Copy className="size-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

export function CopyButton({
  value,
  label = 'Copy',
  toastMessage,
  className,
}: {
  value: string
  label?: string
  toastMessage?: string
  className?: string
}) {
  const { copied, copy } = useCopy()
  return (
    <button
      type="button"
      aria-label={copied ? 'Copied' : label}
      onClick={() => {
        copy(value)
        if (toastMessage) toast.success(toastMessage)
      }}
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-full text-fg-subtle transition hover:bg-surface-2 hover:text-fg',
        className,
      )}
    >
      <CopyIcon copied={copied} />
    </button>
  )
}
