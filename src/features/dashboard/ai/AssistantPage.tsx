import { AnimatePresence, motion } from 'motion/react'
import { ArrowDown, ArrowUpRight, ChartLine, History, MessageSquare, Radar, Route, SquarePen, Presentation } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Sheet, SheetContent } from '@/components/ui/dialog'
import { useAuth } from '@/store/auth'
import { fmt } from '@/lib/format'
import { cn } from '@/lib/utils'
import { PageHeader } from '../PageHeader'
import { fillViewport } from '../shared/layout'
import { Composer, MODELS, type ComposerHandle } from './Composer'
import { AssistantMessage, UserMessage, type ChatMessage } from './Message'
import { Orb } from './Orb'
import { SUGGESTIONS, pickReply } from './responses'

interface Conversation {
  id: string
  title: string
  at: number
  msgs: ChatMessage[]
}

const uid = () => Math.random().toString(36).slice(2, 10)
const HOUR = 3_600_000

function seed(title: string, prompt: string, hoursAgo: number): Conversation {
  const reply = pickReply(prompt)
  return {
    id: uid(),
    title,
    at: Date.now() - hoursAgo * HOUR,
    msgs: [
      { id: uid(), role: 'user', text: prompt },
      { id: uid(), role: 'assistant', text: reply.text, reply, status: 'done', ms: 1200 + (hoursAgo % 7) * 110 },
    ],
  }
}

const SEEDS: Conversation[] = [
  seed('Accounts likely to churn', 'Which accounts are most likely to churn this month?', 2),
  seed('Pricing page engagement', 'How is engagement trending since the pricing page redesign?', 5),
  seed('Q4 MRR forecast', 'Forecast MRR for Q4 with a confidence range', 28),
  seed('Best channel by LTV', 'Which acquisition channel has the best LTV:CAC?', 52),
  seed('Weekly CEO summary', 'Summarize last week for my CEO', 97),
  seed('Tuesday revenue anomaly', 'Why did revenue drop on Tuesday?', 140),
]

const SUGGESTION_ICON = { dip: Radar, forecast: ChartLine, channels: Route, summary: Presentation }

export default function AssistantPage() {
  const [convos, setConvos] = useState<Conversation[]>(SEEDS)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [model, setModel] = useState(MODELS[0].value)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [stuck, setStuck] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const composer = useRef<ComposerHandle>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const streamLen = useRef(0)
  const stuckRef = useRef(true)

  const active = convos.find((c) => c.id === activeId) ?? null
  const msgs = active?.msgs ?? []
  const last = msgs[msgs.length - 1]
  const busy = last?.role === 'assistant' && (last.status === 'thinking' || last.status === 'streaming')

  const patchMsg = useCallback((cid: string, mid: string, patch: Partial<ChatMessage>) => {
    setConvos((cs) => cs.map((c) => (c.id !== cid ? c : { ...c, msgs: c.msgs.map((m) => (m.id === mid ? { ...m, ...patch } : m)) })))
  }, [])

  const startReply = useCallback(
    (cid: string, mid: string, thinkMs: number) => {
      clearTimeout(timer.current)
      streamLen.current = 0
      timer.current = setTimeout(() => patchMsg(cid, mid, { status: 'streaming' }), thinkMs)
    },
    [patchMsg],
  )

  useEffect(() => () => clearTimeout(timer.current), [])

  const send = (text: string, files: string[] = []) => {
    const reply = pickReply(text)
    const thinkMs = (model === 'fast' ? 700 : 1200) + Math.round(Math.random() * 400)
    const user: ChatMessage = { id: uid(), role: 'user', text, files }
    const bot: ChatMessage = { id: uid(), role: 'assistant', text: '', reply, status: 'thinking', ms: thinkMs }
    let cid = activeId
    if (!cid || !active) {
      cid = uid()
      const title = text.length > 42 ? text.slice(0, 40).trimEnd() + '…' : text
      setConvos((cs) => [{ id: cid!, title, at: Date.now(), msgs: [user, bot] }, ...cs])
      setActiveId(cid)
    } else {
      setConvos((cs) => cs.map((c) => (c.id === cid ? { ...c, at: Date.now(), msgs: [...c.msgs, user, bot] } : c)))
    }
    stuckRef.current = true
    setStuck(true)
    startReply(cid, bot.id, thinkMs)
  }

  const stop = () => {
    if (!active || !last || !busy) return
    clearTimeout(timer.current)
    const partial = last.status === 'streaming' ? last.reply!.text.slice(0, streamLen.current) : ''
    patchMsg(active.id, last.id, { status: 'stopped', text: partial })
  }

  const regenerate = (m: ChatMessage) => {
    if (!active || busy) return
    patchMsg(active.id, m.id, { status: 'thinking', text: '', feedback: undefined })
    startReply(active.id, m.id, m.ms ?? 1200)
    stuckRef.current = true
    setStuck(true)
  }

  const openConvo = (id: string | null) => {
    if (busy) stop()
    setActiveId(id)
    setHistoryOpen(false)
    stuckRef.current = true
    setStuck(true)
    requestAnimationFrame(() => composer.current?.focus())
  }

  // Keep pinned to the bottom while content grows (streaming, attachments), unless the user scrolled up.
  useLayoutEffect(() => {
    const el = scrollRef.current
    const content = contentRef.current
    if (!el || !content) return
    const ro = new ResizeObserver(() => {
      if (stuckRef.current) el.scrollTop = el.scrollHeight
    })
    ro.observe(content)
    el.scrollTop = el.scrollHeight
    return () => ro.disconnect()
  }, [activeId])

  const onScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80
    stuckRef.current = atBottom
    if (atBottom !== stuck) setStuck(atBottom)
  }

  const history = <HistoryList convos={convos} activeId={activeId} onSelect={openConvo} />

  return (
    <div className={cn('flex flex-col', fillViewport)}>
      <PageHeader
        title="AI Analyst"
        description="Ask in plain English. Every answer is grounded in your connected data."
        actions={
          <>
            <Button variant="secondary" size="sm" className="lg:hidden" onClick={() => setHistoryOpen(true)}>
              <History /> History
            </Button>
            <Button variant="secondary" size="sm" onClick={() => openConvo(null)} disabled={!activeId}>
              <SquarePen /> New chat
            </Button>
          </>
        }
      />

      <Card className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface-2/30 lg:flex">{history}</aside>

        <section className="relative flex min-w-0 flex-1 flex-col">
          <div ref={scrollRef} onScroll={onScroll} className="relative flex-1 overflow-y-auto" data-lenis-prevent>
            <div ref={contentRef} className="flex min-h-full flex-col">
              <AnimatePresence mode="wait" initial={false}>
                {!active ? (
                  <Welcome key="welcome" onPick={(p) => send(p)} />
                ) : (
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mx-auto w-full max-w-3xl space-y-8 px-4 pt-6 pb-10 sm:px-6 sm:pt-8"
                  >
                    {msgs.map((m, i) =>
                      m.role === 'user' ? (
                        <UserMessage key={m.id} m={m} />
                      ) : (
                        <AssistantMessage
                          key={m.id}
                          m={m}
                          isLast={i === msgs.length - 1}
                          onProgress={(n) => (streamLen.current = n)}
                          onDone={() => patchMsg(active.id, m.id, { status: 'done', text: m.reply!.text })}
                          onRegenerate={() => regenerate(m)}
                          onFeedback={(f) => {
                            const next = m.feedback === f ? undefined : f
                            patchMsg(active.id, m.id, { feedback: next })
                            if (next === 'up') toast.success('Thanks for the feedback', { description: 'Marked as helpful.' })
                            if (next === 'down') toast('Thanks — we’ll use this to improve', { description: 'Tell us more in Settings → Feedback.' })
                          }}
                          onFollowup={(p) => send(p)}
                        />
                      ),
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence>
            {!stuck && active && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.9 }}
                onClick={() => {
                  stuckRef.current = true
                  setStuck(true)
                  scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
                }}
                aria-label="Scroll to latest"
                className="absolute bottom-36 left-1/2 z-10 flex size-8 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-surface shadow-elevated text-fg-muted hover:text-fg"
              >
                <ArrowDown className="size-4" />
              </motion.button>
            )}
          </AnimatePresence>

          <div className="relative">
            <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-surface to-transparent dark:from-[color-mix(in_oklch,var(--surface)_70%,var(--bg))]" />
            <Composer ref={composer} busy={busy} onSend={send} onStop={stop} model={model} onModel={setModel} />
          </div>
        </section>
      </Card>

      <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
        <SheetContent side="left" title="Chat history" className="w-[min(86vw,320px)]">
          {history}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function HistoryList({ convos, activeId, onSelect }: { convos: Conversation[]; activeId: string | null; onSelect: (id: string | null) => void }) {
  const today = convos.filter((c) => Date.now() - c.at < 24 * HOUR)
  const week = convos.filter((c) => Date.now() - c.at >= 24 * HOUR)
  const group = (label: string, list: Conversation[]) =>
    list.length > 0 && (
      <div className="mb-4">
        <div className="px-2.5 pb-1.5 text-[11px] font-medium tracking-wide text-fg-subtle uppercase">{label}</div>
        <ul className="space-y-0.5">
          {list.map((c) => {
            const on = c.id === activeId
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onSelect(c.id)}
                  className={cn('group relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors', on ? 'text-fg' : 'text-fg-muted hover:bg-surface-2 hover:text-fg')}
                >
                  {on && <motion.span layoutId="ai-history-pill" className="absolute inset-0 rounded-lg border border-border bg-surface shadow-sm" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
                  <MessageSquare className={cn('relative size-3.5 shrink-0', on ? 'text-accent' : 'text-fg-subtle')} />
                  <span className="relative min-w-0 flex-1 truncate">{c.title}</span>
                  <span className="relative shrink-0 text-[10px] text-fg-subtle tabular-nums">{fmt.relative(new Date(c.at)).replace(' ago', '')}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    )
  return (
    <div className="flex h-full flex-col">
      <div className="p-3">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="group flex w-full items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-[13px] font-medium shadow-sm transition hover:border-accent/40 hover:shadow-glow"
        >
          <SquarePen className="size-4 text-accent" />
          New chat
        </button>
      </div>
      <div className="scrollbar-none flex-1 overflow-y-auto px-2 pb-3" data-lenis-prevent>
        {group('Today', today)}
        {group('Last 7 days', week)}
      </div>
      <div className="m-3 rounded-xl border border-border bg-surface/70 p-3">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-fg-muted">AI queries this month</span>
          <span className="font-mono text-fg tabular-nums">1,284</span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-3">
          <div className="h-full w-[64%] rounded-full bg-gradient-brand" />
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-fg-subtle">
          <span className="size-1.5 rounded-full bg-success shadow-[0_0_0_3px_color-mix(in_oklch,var(--success)_20%,transparent)]" />
          Stripe, Postgres, Segment connected
        </div>
      </div>
    </div>
  )
}

function Welcome({ onPick }: { onPick: (p: string) => void }) {
  const name = useAuth((s) => s.user?.name.split(' ')[0])
  const container = { show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }
  const item = { hidden: { opacity: 0, y: 14, filter: 'blur(6px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } } }
  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
      variants={container}
      className="relative flex flex-1 flex-col items-center justify-center px-4 py-10 text-center sm:px-6"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-70 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,black,transparent)]" />
      <motion.div variants={item} className="relative">
        <Orb className="size-20 sm:size-24" />
      </motion.div>
      <motion.p variants={item} className="relative mt-7 text-sm text-fg-muted">
        Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}{name ? `, ${name}` : ''}
      </motion.p>
      <motion.h2 variants={item} className="relative mt-1.5 text-3xl font-semibold tracking-tight text-balance sm:text-[40px] sm:leading-[1.1]">
        What do you want to{' '}
        <span className="font-serif text-[1.12em] font-normal italic">
          <span className="text-gradient animate-gradient-x">know</span>?
        </span>
      </motion.h2>
      <motion.p variants={item} className="relative mt-3 max-w-md text-sm text-balance text-fg-muted">
        Dashward Analyst queries Stripe, Postgres and Segment, then shows you the chart, the numbers and where they came from.
      </motion.p>
      <motion.div variants={container} className="relative mt-8 grid w-full max-w-2xl gap-2.5 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => {
          const Icon = SUGGESTION_ICON[s.icon]
          return (
            <motion.button
              key={s.prompt}
              type="button"
              variants={item}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPick(s.prompt)}
              className="group relative flex items-start gap-3 overflow-hidden rounded-2xl border border-border bg-surface/80 p-3.5 text-left shadow-sm backdrop-blur transition-[border-color,box-shadow] hover:border-accent/35 hover:shadow-glow dark:bg-surface-2/60"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-2 text-fg-muted transition-colors group-hover:border-accent/30 group-hover:bg-accent/10 group-hover:text-accent">
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-medium text-fg">{s.prompt}</span>
                <span className="mt-0.5 block text-[11px] text-fg-subtle">{s.tag}</span>
              </span>
              <ArrowUpRight className="size-4 shrink-0 text-fg-subtle opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent group-hover:opacity-100" />
            </motion.button>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
