import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input, Label } from '@/components/ui/input'
import { sleep } from '@/lib/utils'

/** Destructive confirmation. Pass `confirmText` to require typing it before the action unlocks. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  actionLabel,
  onConfirm,
  confirmText,
  children,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  title: string
  description?: ReactNode
  actionLabel: string
  onConfirm: () => void
  confirmText?: string
  children?: ReactNode
}) {
  const [typed, setTyped] = useState('')
  const [busy, setBusy] = useState(false)
  const locked = confirmText != null && typed.trim() !== confirmText
  const change = (o: boolean) => {
    if (!o) setTyped('')
    onOpenChange(o)
  }
  return (
    <Dialog open={open} onOpenChange={change}>
      <DialogContent title={title} description={description}>
        {children}
        {confirmText != null && (
          <div className="mb-5">
            <Label htmlFor="confirm-text" className="text-fg-muted">
              Type <span className="font-mono text-fg">{confirmText}</span> to confirm
            </Label>
            <Input
              id="confirm-text"
              autoComplete="off"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={confirmText}
            />
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => change(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            loading={busy}
            disabled={locked}
            onClick={async () => {
              setBusy(true)
              await sleep(700)
              setBusy(false)
              onConfirm()
              change(false)
            }}
          >
            {actionLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
