import { AnimatePresence, motion } from 'motion/react'
import { ArrowUp, FileText, Paperclip, Square, X } from 'lucide-react'
import { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import { Textarea } from '@/components/ui/input'
import { Kbd } from '@/components/ui/misc'
import { Select } from '@/components/ui/select'
import { Tooltip } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export interface ComposerHandle {
  focus: () => void
}

export const MODELS = [
  { value: 'analyst-3', label: 'Dashward Analyst 3' },
  { value: 'fast', label: 'Fast' },
]

export const Composer = forwardRef<
  ComposerHandle,
  { busy: boolean; onSend: (text: string, files: string[]) => void; onStop: () => void; model: string; onModel: (m: string) => void }
>(({ busy, onSend, onStop, model, onModel }, ref) => {
  const [value, setValue] = useState('')
  const [files, setFiles] = useState<string[]>([])
  const ta = useRef<HTMLTextAreaElement>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => ({ focus: () => ta.current?.focus() }))

  useLayoutEffect(() => {
    const el = ta.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(200, el.scrollHeight)}px`
  }, [value])

  const canSend = !busy && value.trim().length > 0
  const send = () => {
    if (!canSend) return
    onSend(value.trim(), files)
    setValue('')
    setFiles([])
  }

  return (
    <div className="relative mx-auto w-full max-w-3xl px-3 pb-3 sm:px-6 sm:pb-4">
      <div
        className={cn(
          'rounded-2xl border border-border bg-surface shadow-elevated transition-[border-color,box-shadow] duration-300 focus-within:border-accent/45 focus-within:shadow-[0_0_0_4px_color-mix(in_oklch,var(--accent)_12%,transparent),0_12px_40px_-12px_var(--glow)] dark:bg-surface-2',
        )}
      >
        <AnimatePresence initial={false}>
          {files.length > 0 && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="flex flex-wrap gap-1.5 px-3 pt-3">
                {files.map((f) => (
                  <span key={f} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 py-1 pr-1 pl-2 text-xs text-fg-muted dark:bg-surface-3">
                    <FileText className="size-3.5 text-accent" />
                    <span className="max-w-40 truncate">{f}</span>
                    <button type="button" aria-label={`Remove ${f}`} onClick={() => setFiles((l) => l.filter((x) => x !== f))} className="rounded p-0.5 text-fg-subtle hover:bg-surface-3 hover:text-fg">
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <label htmlFor="ai-composer" className="sr-only">
          Ask Dashward Analyst
        </label>
        <Textarea
          id="ai-composer"
          ref={ta}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault()
              send()
            }
          }}
          placeholder="Ask about revenue, retention, funnels…"
          className="max-h-[200px] min-h-0 rounded-none border-0 bg-transparent px-4 pt-3.5 pb-1 text-[14.5px] leading-relaxed hover:border-0 focus:bg-transparent focus:ring-0 dark:bg-transparent"
        />
        <div className="flex items-center justify-between gap-2 px-2 pb-2">
          <div className="flex min-w-0 items-center gap-1">
            <input
              ref={fileInput}
              type="file"
              multiple
              accept=".csv,.pdf,.xlsx,.json,.png,.jpg"
              className="hidden"
              onChange={(e) => {
                const names = [...(e.target.files ?? [])].map((f) => f.name)
                setFiles((l) => [...new Set([...l, ...names])])
                e.target.value = ''
              }}
            />
            <Tooltip content="Attach CSV, PDF or image">
              <button
                type="button"
                aria-label="Attach files"
                onClick={() => fileInput.current?.click()}
                className="flex size-8 items-center justify-center rounded-full text-fg-subtle transition hover:bg-surface-2 hover:text-fg dark:hover:bg-surface-3"
              >
                <Paperclip className="size-4" />
              </button>
            </Tooltip>
            <Select value={model} onValueChange={onModel} options={MODELS} className="h-8 border-transparent bg-transparent px-2.5 text-xs text-fg-muted hover:border-border hover:text-fg" />
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1 text-[11px] text-fg-subtle sm:flex">
              <Kbd>↵</Kbd> send <span className="mx-0.5">·</span> <Kbd>⇧</Kbd>
              <Kbd>↵</Kbd> newline
            </span>
            <motion.button
              type="button"
              layout
              onClick={busy ? onStop : send}
              disabled={!busy && !canSend}
              aria-label={busy ? 'Stop generating' : 'Send message'}
              whileTap={{ scale: 0.9 }}
              className={cn(
                'relative flex size-8 items-center justify-center overflow-hidden rounded-full transition-colors duration-300 disabled:cursor-not-allowed',
                busy
                  ? 'bg-surface-3 text-fg ring-1 ring-border-strong'
                  : canSend
                    ? 'bg-fg text-bg shadow-[0_6px_20px_-6px_var(--glow)]'
                    : 'bg-surface-3 text-fg-subtle',
              )}
            >
              {busy && (
                <svg className="absolute inset-0 size-8 animate-spin [animation-duration:1.4s]" viewBox="0 0 32 32" aria-hidden>
                  <circle cx="16" cy="16" r="15" fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="24 72" strokeLinecap="round" />
                </svg>
              )}
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={busy ? 'stop' : 'send'}
                  initial={{ scale: 0.3, opacity: 0, rotate: busy ? -90 : 90 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.3, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                  className="relative"
                >
                  {busy ? <Square className="size-3 fill-current" /> : <ArrowUp className="size-4" strokeWidth={2.5} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>
      <p className="mt-2 text-center text-[11px] text-fg-subtle">
        Dashward Analyst can make mistakes. Check important numbers against your source data.
      </p>
    </div>
  )
})
Composer.displayName = 'Composer'
