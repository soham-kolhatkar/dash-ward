import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Check, ChevronRight, Database, FileText, RotateCcw, Sparkles, ThumbsDown, ThumbsUp } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { Tooltip } from '@/components/ui/tooltip'
import { useStreamText } from '@/hooks/useStreamText'
import { cn } from '@/lib/utils'
import { CopyIcon, useCopy } from '../shared/CopyButton'
import { Attachment } from './Attachments'
import { Markdown } from './Markdown'
import type { CannedReply } from './responses'

export type MsgStatus = 'thinking' | 'streaming' | 'done' | 'stopped'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  files?: string[]
  reply?: CannedReply
  status?: MsgStatus
  feedback?: 'up' | 'down'
  ms?: number
}

const ease = [0.16, 1, 0.3, 1] as const

export function UserMessage({ m }: { m: ChatMessage }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease }}
      className="flex flex-col items-end gap-1.5"
    >
      {m.files?.map((f) => (
        <span key={f} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-2.5 py-1 text-xs text-fg-muted">
          <FileText className="size-3.5 text-accent" /> {f}
        </span>
      ))}
      <div className="max-w-[85%] rounded-2xl rounded-br-md border border-accent/15 bg-accent/[0.08] px-4 py-2.5 text-[14.5px] leading-relaxed whitespace-pre-wrap text-fg sm:max-w-[75%] dark:bg-accent/[0.12]">
        {m.text}
      </div>
    </motion.div>
  )
}

export function AssistantAvatar({ busy }: { busy?: boolean }) {
  return (
    <span className="relative flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow dark:text-accent-fg">
      {busy && <span className="absolute inset-0 animate-ping rounded-xl bg-accent/40 [animation-duration:1.6s]" />}
      <Sparkles className="relative size-4" />
    </span>
  )
}

function Thinking({ steps }: { steps: string[] }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((n) => Math.min(steps.length - 1, n + 1)), 440)
    return () => clearInterval(id)
  }, [steps.length])
  return (
    <div className="flex h-8 items-center gap-3">
      <span className="flex gap-1" aria-hidden>
        {[0, 1, 2].map((d) => (
          <motion.span
            key={d}
            className="size-1.5 rounded-full bg-accent"
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15, ease: 'easeInOut' }}
          />
        ))}
      </span>
      <span className="relative h-5 overflow-hidden text-[13px] text-fg-muted" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={i}
            initial={{ y: 14, opacity: 0, filter: 'blur(4px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: -14, opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.3, ease }}
            className="block bg-[linear-gradient(90deg,var(--fg-muted)_0%,var(--fg)_50%,var(--fg-muted)_100%)] bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer"
          >
            {steps[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  )
}

function StreamBody({ text, onDone, onProgress }: { text: string; onDone: () => void; onProgress: (n: number) => void }) {
  const { text: shown, done } = useStreamText(text, { speed: 9 })
  const cb = useRef({ onDone, onProgress })
  cb.current = { onDone, onProgress }
  useEffect(() => {
    cb.current.onProgress(shown.length)
  }, [shown.length])
  useEffect(() => {
    if (done && shown.length) cb.current.onDone()
  }, [done, shown.length])
  return <Markdown text={shown} caret={!done} />
}

function Steps({ reply, ms }: { reply: CannedReply; ms?: number }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-1 rounded-md text-xs text-fg-subtle transition hover:text-fg-muted"
      >
        <ChevronRight className={cn('size-3.5 transition-transform duration-300', open && 'rotate-90')} />
        Analyzed in {((ms ?? 1300) / 1000).toFixed(1)}s · {reply.steps.length} steps
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ol
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            {reply.steps.map((s) => (
              <li key={s} className="flex items-center gap-2 pt-1.5 pl-1 text-xs text-fg-muted">
                <Check className="size-3.5 text-success" /> {s.replace('…', '')}
              </li>
            ))}
          </motion.ol>
        )}
      </AnimatePresence>
    </div>
  )
}

const plain = (s: string) => s.replace(/\*\*|`/g, '')

export function AssistantMessage({
  m,
  onDone,
  onProgress,
  onRegenerate,
  onFeedback,
  onFollowup,
  isLast,
}: {
  m: ChatMessage
  onDone: () => void
  onProgress: (n: number) => void
  onRegenerate: () => void
  onFeedback: (f: 'up' | 'down') => void
  onFollowup: (p: string) => void
  isLast: boolean
}) {
  const { copied, copy } = useCopy()
  const reply = m.reply!
  const settled = m.status === 'done' || m.status === 'stopped'
  const complete = m.status === 'done'

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }} className="group/msg flex gap-3 sm:gap-4">
      <AssistantAvatar busy={m.status === 'thinking'} />
      <div className="min-w-0 flex-1 pt-1">
        {m.status === 'thinking' ? (
          <Thinking steps={reply.steps} />
        ) : (
          <>
            <Steps reply={reply} ms={m.ms} />
            {m.status === 'streaming' ? (
              <StreamBody text={reply.text} onDone={onDone} onProgress={onProgress} />
            ) : (
              <Markdown text={m.text} />
            )}
            {m.status === 'stopped' && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs text-fg-subtle">
                <span className="size-1.5 rounded-full bg-warning" /> Response stopped
              </div>
            )}
          </>
        )}

        <AnimatePresence>
          {complete && (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.08 } } }}
              className="mt-4 space-y-4"
            >
              {reply.attachment && (
                <motion.div variants={{ hidden: { opacity: 0, y: 12, scale: 0.98, filter: 'blur(6px)' }, show: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.6, ease } } }}>
                  <Attachment kind={reply.attachment} />
                </motion.div>
              )}
              <motion.div variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }} className="flex flex-wrap items-center gap-1.5">
                <span className="mr-1 text-[11px] text-fg-subtle">Sources</span>
                {reply.sources.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-2/60 px-1.5 py-0.5 font-mono text-[11px] text-fg-muted">
                    <Database className="size-3 text-fg-subtle" /> {s}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {settled && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-3 flex items-center gap-0.5 text-fg-subtle">
            <Action label={copied ? 'Copied' : 'Copy'} onClick={() => { copy(plain(m.text)); toast.success('Copied to clipboard') }}>
              <CopyIcon copied={copied} className="size-3.5 [&_svg]:size-3.5" />
            </Action>
            <Action label="Regenerate" onClick={onRegenerate}>
              <RotateCcw className="size-3.5" />
            </Action>
            <Action label="Good response" active={m.feedback === 'up'} onClick={() => onFeedback('up')}>
              <ThumbsUp className="size-3.5" />
            </Action>
            <Action label="Bad response" active={m.feedback === 'down'} onClick={() => onFeedback('down')}>
              <ThumbsDown className="size-3.5" />
            </Action>
          </motion.div>
        )}

        {complete && isLast && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.35 } } }}
            className="mt-4 flex flex-wrap gap-2"
          >
            {reply.followups.map((f) => (
              <motion.button
                key={f}
                type="button"
                variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                onClick={() => onFollowup(f)}
                className="group/f inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-[13px] text-fg-muted transition hover:border-accent/40 hover:bg-accent/5 hover:text-fg"
              >
                {f}
                <ArrowUpRight className="size-3.5 text-fg-subtle transition group-hover/f:translate-x-0.5 group-hover/f:-translate-y-0.5 group-hover/f:text-accent" />
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

function Action({ label, onClick, active, children }: { label: string; onClick: () => void; active?: boolean; children: ReactNode }) {
  return (
    <Tooltip content={label}>
      <button
        type="button"
        aria-label={label}
        aria-pressed={active}
        onClick={onClick}
        className={cn(
          'flex size-7 items-center justify-center rounded-lg transition hover:bg-surface-2 hover:text-fg active:scale-90',
          active && 'bg-accent/10 text-accent hover:bg-accent/15 hover:text-accent',
        )}
      >
        {children}
      </button>
    </Tooltip>
  )
}
