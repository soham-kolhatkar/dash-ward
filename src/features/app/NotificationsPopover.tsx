import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Bell, CheckCheck, CircleCheck, Info, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { NOTIFICATIONS, type Notification } from '@/data/misc'
import { fmt } from '@/lib/format'
import { cn } from '@/lib/utils'

const KIND: Record<Notification['kind'], { icon: typeof Bell; className: string }> = {
  alert: { icon: TriangleAlert, className: 'bg-danger/10 text-danger border-danger/20' },
  success: { icon: CircleCheck, className: 'bg-success/10 text-success border-success/20' },
  info: { icon: Info, className: 'bg-accent-2/10 text-accent-2 border-accent-2/20' },
}

export function NotificationsPopover() {
  const [items, setItems] = useState(NOTIFICATIONS)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const unread = items.filter((n) => n.unread).length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ''}`}
        className="relative inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface-2/60 text-fg-muted transition hover:border-border-strong hover:text-fg data-[state=open]:border-border-strong data-[state=open]:text-fg"
      >
        <motion.span
          animate={unread ? { rotate: [0, -14, 12, -8, 5, 0] } : { rotate: 0 }}
          transition={{ duration: 0.9, delay: 1.2, repeat: unread ? Infinity : 0, repeatDelay: 8 }}
          style={{ originY: 0.15 }}
        >
          <Bell className="size-4" />
        </motion.span>
        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-2 right-2 size-2"
            >
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-accent" />
              <span className="absolute inset-0 rounded-full bg-accent ring-2 ring-bg" />
            </motion.span>
          )}
        </AnimatePresence>
      </PopoverTrigger>
      <PopoverContent className="w-[min(380px,calc(100vw-2rem))]">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Notifications</span>
            {unread > 0 && (
              <span className="rounded-full bg-accent/12 px-1.5 font-mono text-[10px] leading-4 font-medium text-accent tabular-nums">
                {unread} new
              </span>
            )}
          </div>
          <button
            type="button"
            disabled={!unread}
            onClick={() => setItems((xs) => xs.map((n) => ({ ...n, unread: false })))}
            className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs text-fg-subtle transition hover:bg-surface-2 hover:text-fg disabled:pointer-events-none disabled:opacity-40"
          >
            <CheckCheck className="size-3.5" /> Mark all read
          </button>
        </div>
        <ul className="max-h-[360px] overflow-y-auto p-1.5">
          {items.map((n, i) => {
            const k = KIND[n.kind]
            return (
              <motion.li
                key={n.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  type="button"
                  onClick={() => setItems((xs) => xs.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))}
                  className="group flex w-full gap-3 rounded-lg p-2.5 text-left transition hover:bg-surface-2"
                >
                  <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg border', k.className)}>
                    <k.icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className={cn('truncate text-sm', n.unread ? 'font-medium text-fg' : 'text-fg-muted')}>{n.title}</span>
                      <span className="shrink-0 text-[11px] text-fg-subtle tabular-nums">{fmt.relative(n.time)}</span>
                    </span>
                    <span className="mt-0.5 line-clamp-2 block text-xs text-fg-subtle">{n.body}</span>
                  </span>
                  <span
                    className={cn(
                      'mt-1.5 size-1.5 shrink-0 rounded-full bg-accent transition-all duration-300',
                      n.unread ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
                    )}
                  />
                </button>
              </motion.li>
            )
          })}
        </ul>
        <button
          type="button"
          onClick={() => {
            setOpen(false)
            navigate('/app/inbox')
          }}
          className="group flex w-full items-center justify-center gap-1.5 border-t border-border px-4 py-2.5 text-xs font-medium text-fg-muted transition hover:bg-surface-2 hover:text-fg"
        >
          View all in Inbox
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </PopoverContent>
    </Popover>
  )
}
