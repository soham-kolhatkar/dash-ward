import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

const overlay =
  'fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-[fade-in_.25s_ease-out] data-[state=closed]:animate-[fade-out_.2s_ease-in]'

export function DialogContent({
  className,
  children,
  title,
  description,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { title: string; description?: ReactNode }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={overlay} />
      <DialogPrimitive.Content
        className={cn(
          'fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-surface p-6 shadow-elevated outline-none data-[state=open]:animate-[dialog-in_.35s_var(--ease-out-expo)] data-[state=closed]:animate-[dialog-out_.2s_ease-in]',
          className,
        )}
        {...props}
      >
        <DialogPrimitive.Title className="text-lg font-semibold tracking-tight">{title}</DialogPrimitive.Title>
        {description ? (
          <DialogPrimitive.Description className="mt-1 text-sm text-fg-muted">{description}</DialogPrimitive.Description>
        ) : (
          <DialogPrimitive.Description className="sr-only">{title}</DialogPrimitive.Description>
        )}
        <div className="mt-5">{children}</div>
        <DialogPrimitive.Close className="absolute top-4 right-4 rounded-full p-1.5 text-fg-subtle transition hover:bg-surface-2 hover:text-fg">
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

/** Side drawer built on Dialog. */
export function SheetContent({
  className,
  children,
  side = 'right',
  title,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { side?: 'left' | 'right'; title: string }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={overlay} />
      <DialogPrimitive.Content
        className={cn(
          'fixed inset-y-0 z-50 flex w-[min(92vw,440px)] flex-col border-border bg-surface shadow-elevated outline-none',
          side === 'right'
            ? 'right-0 border-l data-[state=open]:animate-[sheet-in-right_.45s_var(--ease-out-expo)] data-[state=closed]:animate-[sheet-out-right_.25s_ease-in]'
            : 'left-0 border-r data-[state=open]:animate-[sheet-in-left_.45s_var(--ease-out-expo)] data-[state=closed]:animate-[sheet-out-left_.25s_ease-in]',
          className,
        )}
        {...props}
      >
        <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
        <DialogPrimitive.Description className="sr-only">{title}</DialogPrimitive.Description>
        {children}
        <DialogPrimitive.Close className="absolute top-4 right-4 z-10 rounded-full p-1.5 text-fg-subtle transition hover:bg-surface-2 hover:text-fg">
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
export const Sheet = DialogPrimitive.Root
