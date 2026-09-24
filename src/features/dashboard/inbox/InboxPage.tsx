import { AnimatePresence, motion } from 'motion/react'
import {
  Archive,
  ArrowLeft,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Mail,
  MailOpen,
  PenSquare,
  Reply,
  Search,
  Send,
  Star,
  Trash2,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input, Label, Textarea } from '@/components/ui/input'
import { Kbd } from '@/components/ui/misc'
import { Tooltip } from '@/components/ui/tooltip'
import { MESSAGES, type Message } from '@/data/misc'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { fmt } from '@/lib/format'
import { cn, sleep } from '@/lib/utils'
import { useAuth } from '@/store/auth'
import { PageHeader } from '../PageHeader'
import { fillViewport } from '../shared/layout'
import { PillTabs } from '../shared/PillTabs'
import { InboxZero } from './InboxZero'

type Tab = 'all' | 'unread' | 'starred'
type LabelKey = Message['label']

interface Thread extends Message {
  replies: { id: string; text: string; at: string }[]
}

const LABELS: Record<LabelKey, { name: string; color: string; variant: 'accent' | 'danger' | 'cyan' | 'success' }> = {
  report: { name: 'Report', color: 'var(--accent)', variant: 'accent' },
  alert: { name: 'Alert', color: 'var(--danger)', variant: 'danger' },
  team: { name: 'Team', color: 'var(--accent-2)', variant: 'cyan' },
  billing: { name: 'Billing', color: 'var(--success)', variant: 'success' },
}

const ease = [0.16, 1, 0.3, 1] as const

export default function InboxPage() {
  const isMobile = useIsMobile()
  const [mails, setMails] = useState<Thread[]>(() =>
    MESSAGES.map((m, i) => ({
      ...m,
      unread: m.unread && !(i === 0 && !window.matchMedia('(max-width: 767px)').matches),
      starred: m.starred || i === 1 || i === 5,
      replies: [],
    })),
  )
  const [tab, setTab] = useState<Tab>('all')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(() => (window.matchMedia('(max-width: 767px)').matches ? null : MESSAGES[0].id))
  const [compose, setCompose] = useState(false)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return mails.filter(
      (m) =>
        (tab === 'all' || (tab === 'unread' ? m.unread : m.starred)) &&
        (!q || `${m.from} ${m.subject} ${m.preview}`.toLowerCase().includes(q)),
    )
  }, [mails, tab, query])

  const selected = mails.find((m) => m.id === selectedId) ?? null
  const unread = mails.filter((m) => m.unread).length

  const patch = (id: string, p: Partial<Thread>) => setMails((ms) => ms.map((m) => (m.id === id ? { ...m, ...p } : m)))

  const open = (id: string) => {
    setSelectedId(id)
    patch(id, { unread: false })
  }

  const removeMail = (id: string, kind: 'archive' | 'delete') => {
    const idx = mails.findIndex((m) => m.id === id)
    const mail = mails[idx]
    if (!mail) return
    const vi = visible.findIndex((m) => m.id === id)
    const next = visible[vi + 1] ?? visible[vi - 1]
    setMails((ms) => ms.filter((m) => m.id !== id))
    if (selectedId === id) setSelectedId(isMobile ? null : (next?.id ?? null))
    if (next && selectedId === id && !isMobile) patch(next.id, { unread: false })
    toast(kind === 'archive' ? 'Conversation archived' : 'Moved to trash', {
      description: mail.subject,
      action: {
        label: 'Undo',
        onClick: () => {
          setMails((ms) => {
            const copy = [...ms]
            copy.splice(Math.min(idx, copy.length), 0, mail)
            return copy
          })
          setSelectedId(mail.id)
        },
      },
    })
  }

  const step = (dir: 1 | -1) => {
    const i = visible.findIndex((m) => m.id === selectedId)
    const n = visible[i + dir]
    if (n) open(n.id)
  }

  // j / k to move, e to archive, s to star
  const keys = useRef({ step, removeMail, selectedId, patch, selected })
  keys.current = { step, removeMail, selectedId, patch, selected }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (['INPUT', 'TEXTAREA'].includes(t.tagName) || t.isContentEditable || e.metaKey || e.ctrlKey || e.altKey) return
      const k = keys.current
      if (e.key === 'j') k.step(1)
      else if (e.key === 'k') k.step(-1)
      else if (e.key === 'e' && k.selectedId) k.removeMail(k.selectedId, 'archive')
      else if (e.key === 's' && k.selected) k.patch(k.selected.id, { starred: !k.selected.starred })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const list = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="space-y-3 border-b border-border p-3">
        <Input
          icon={<Search />}
          aria-label="Search inbox"
          placeholder="Search mail"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-9 rounded-full text-[13px]"
          trailing={
            query && (
              <button type="button" aria-label="Clear search" onClick={() => setQuery('')} className="flex size-6 items-center justify-center rounded-full text-fg-subtle hover:bg-surface-3 hover:text-fg">
                <X className="size-3.5" />
              </button>
            )
          }
        />
        <div className="flex items-center justify-between gap-2">
          <PillTabs
            label="Filter messages"
            size="sm"
            value={tab}
            onChange={setTab}
            options={[
              { value: 'all', label: 'All', count: mails.length },
              { value: 'unread', label: 'Unread', count: unread },
              { value: 'starred', label: 'Starred', count: mails.filter((m) => m.starred).length },
            ]}
          />
          <Tooltip content="Mark all as read">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Mark all as read"
              disabled={!unread}
              onClick={() => {
                setMails((ms) => ms.map((m) => ({ ...m, unread: false })))
                toast.success('All caught up', { description: `${unread} message${unread === 1 ? '' : 's'} marked as read` })
              }}
            >
              <CheckCheck />
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className="scrollbar-none relative min-h-0 flex-1 overflow-y-auto" data-lenis-prevent>
        {visible.length === 0 ? (
          <InboxZero
            title={query ? 'No matches' : tab === 'starred' ? 'Nothing starred yet' : 'Inbox zero ✨'}
            description={
              query
                ? `Nothing in ${tab === 'all' ? 'your inbox' : tab} matches “${query}”.`
                : tab === 'starred'
                  ? 'Star important threads and they’ll wait for you here.'
                  : tab === 'unread'
                    ? 'You’ve read everything. Go look at a dashboard.'
                    : 'Every thread is handled. Dashward AI will ping you if anything changes.'
            }
            action={
              (query || tab !== 'all') && (
                <Button variant="secondary" size="sm" onClick={() => { setQuery(''); setTab('all') }}>
                  Show all mail
                </Button>
              )
            }
          />
        ) : (
          <ul className="p-1.5">
            <AnimatePresence initial={false}>
              {visible.map((m, i) => (
                <MailRow
                  key={m.id}
                  m={m}
                  index={i}
                  active={m.id === selectedId}
                  onOpen={() => open(m.id)}
                  onStar={() => patch(m.id, { starred: !m.starred })}
                  onArchive={() => removeMail(m.id, 'archive')}
                  onDelete={() => removeMail(m.id, 'delete')}
                />
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
      <div className="hidden items-center gap-3 border-t border-border px-4 py-2 text-[11px] text-fg-subtle md:flex">
        <span className="flex items-center gap-1"><Kbd>J</Kbd><Kbd>K</Kbd> navigate</span>
        <span className="flex items-center gap-1"><Kbd>E</Kbd> archive</span>
        <span className="flex items-center gap-1"><Kbd>S</Kbd> star</span>
      </div>
    </div>
  )

  const reader = selected ? (
    <Reader
      key={selected.id}
      m={selected}
      mobile={isMobile}
      position={visible.findIndex((v) => v.id === selected.id)}
      total={visible.length}
      onBack={() => setSelectedId(null)}
      onStep={step}
      onArchive={() => removeMail(selected.id, 'archive')}
      onDelete={() => removeMail(selected.id, 'delete')}
      onStar={() => patch(selected.id, { starred: !selected.starred })}
      onUnread={() => {
        patch(selected.id, { unread: true })
        setSelectedId(null)
        toast('Marked as unread', { description: selected.subject })
      }}
      onReply={(text) => patch(selected.id, { replies: [...selected.replies, { id: Math.random().toString(36).slice(2), text, at: new Date().toISOString() }] })}
    />
  ) : (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-border bg-surface-2 text-fg-subtle">
        <Mail className="size-6" />
      </div>
      <p className="text-sm font-medium">No conversation selected</p>
      <p className="mt-1 text-xs text-fg-subtle">
        Pick a thread from the list, or press <Kbd>J</Kbd> to start.
      </p>
    </div>
  )

  return (
    <div className={cn('flex flex-col', fillViewport)}>
      <PageHeader
        title="Inbox"
        description={
          <>
            <span className="font-mono text-fg tabular-nums">{unread}</span> unread · reports, alerts and team threads in one place
          </>
        }
        actions={
          <Button variant="brand" size="sm" onClick={() => setCompose(true)}>
            <PenSquare /> Compose
          </Button>
        }
      />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease }} className="min-h-0 flex-1">
        <Card className="relative flex h-full overflow-hidden">
          {isMobile ? (
            <AnimatePresence initial={false} mode="popLayout">
              {selected ? (
                <motion.div key="reader" className="absolute inset-0 bg-surface" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.45, ease }}>
                  {reader}
                </motion.div>
              ) : (
                <motion.div key="list" className="absolute inset-0" initial={{ x: '-30%', opacity: 0.4 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '-30%', opacity: 0 }} transition={{ duration: 0.45, ease }}>
                  {list}
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <>
              <div className="w-[340px] shrink-0 border-r border-border lg:w-[380px]">{list}</div>
              <div className="min-w-0 flex-1">{reader}</div>
            </>
          )}
        </Card>
      </motion.div>
      <ComposeDialog open={compose} onOpenChange={setCompose} />
    </div>
  )
}

function MailRow({
  m,
  index,
  active,
  onOpen,
  onStar,
  onArchive,
  onDelete,
}: {
  m: Thread
  index: number
  active: boolean
  onOpen: () => void
  onStar: () => void
  onArchive: () => void
  onDelete: () => void
}) {
  const label = LABELS[m.label]
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: Math.min(index, 8) * 0.03, ease } }}
      exit={{ opacity: 0, x: -40, height: 0, transition: { duration: 0.3, ease } }}
      className="relative overflow-hidden"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen())}
        aria-current={active || undefined}
        className={cn(
          'group relative flex cursor-pointer gap-3 rounded-xl px-3 py-3 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
          active ? 'bg-accent/[0.07] dark:bg-accent/[0.1]' : 'hover:bg-surface-2/70',
        )}
      >
        {active && <motion.span layoutId="inbox-active" className="absolute top-3 bottom-3 left-0 w-[3px] rounded-full bg-accent" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
        <div className="relative shrink-0">
          <Avatar name={m.from} className="size-9 ring-0" />
          {m.unread && <span className="absolute -top-0.5 -left-0.5 size-2.5 rounded-full bg-accent ring-2 ring-surface" aria-label="Unread" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={cn('truncate text-[13px]', m.unread ? 'font-semibold text-fg' : 'font-medium text-fg-muted')}>{m.from}</span>
            <span className="ml-auto shrink-0 text-[11px] text-fg-subtle tabular-nums transition-opacity group-hover:opacity-0">{fmt.relative(m.time)}</span>
          </div>
          <div className={cn('mt-0.5 truncate text-[13px]', m.unread ? 'font-medium text-fg' : 'text-fg-muted')}>{m.subject}</div>
          <div className="mt-0.5 line-clamp-1 text-xs text-fg-subtle">{m.preview}</div>
          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-fg-subtle">
            <span className="size-1.5 rounded-full" style={{ background: label.color }} />
            {label.name}
            {m.replies.length > 0 && (
              <span className="ml-1 inline-flex items-center gap-1">
                <Reply className="size-3" /> {m.replies.length}
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          aria-label={m.starred ? 'Unstar' : 'Star'}
          aria-pressed={m.starred}
          onClick={(e) => {
            e.stopPropagation()
            onStar()
          }}
          className={cn('absolute right-2.5 bottom-2.5 flex size-7 items-center justify-center rounded-full transition hover:bg-surface-3', m.starred ? 'text-warning' : 'text-fg-subtle opacity-0 group-hover:opacity-100 focus-visible:opacity-100')}
        >
          <motion.span key={String(m.starred)} initial={{ scale: 0.5, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
            <Star className={cn('size-3.5', m.starred && 'fill-current')} />
          </motion.span>
        </button>
        <div className="absolute top-2 right-2 flex translate-y-0.5 items-center gap-0.5 rounded-full border border-border bg-surface p-0.5 opacity-0 shadow-sm transition-all group-hover:translate-y-0 group-hover:opacity-100">
          <HoverAction label="Archive" onClick={onArchive}>
            <Archive />
          </HoverAction>
          <HoverAction label="Delete" onClick={onDelete} danger>
            <Trash2 />
          </HoverAction>
        </div>
      </div>
    </motion.li>
  )
}

function HoverAction({ label, onClick, danger, children }: { label: string; onClick: () => void; danger?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={cn('flex size-6 items-center justify-center rounded-full text-fg-subtle transition hover:bg-surface-2 hover:text-fg [&_svg]:size-3.5', danger && 'hover:bg-danger/10 hover:text-danger')}
    >
      {children}
    </button>
  )
}

function ToolbarButton({ label, onClick, children, active, disabled }: { label: string; onClick: () => void; children: ReactNode; active?: boolean; disabled?: boolean }) {
  return (
    <Tooltip content={label} side="bottom">
      <Button variant="ghost" size="icon-sm" aria-label={label} onClick={onClick} disabled={disabled} className={cn(active && 'text-warning hover:text-warning')}>
        {children}
      </Button>
    </Tooltip>
  )
}

function Reader({
  m,
  mobile,
  position,
  total,
  onBack,
  onStep,
  onArchive,
  onDelete,
  onStar,
  onUnread,
  onReply,
}: {
  m: Thread
  mobile: boolean
  position: number
  total: number
  onBack: () => void
  onStep: (d: 1 | -1) => void
  onArchive: () => void
  onDelete: () => void
  onStar: () => void
  onUnread: () => void
  onReply: (text: string) => void
}) {
  const me = useAuth((s) => s.user) ?? { name: 'Ava Chen', email: 'ava@northwind.io' }
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)
  const label = LABELS[m.label]

  const send = async () => {
    if (!draft.trim()) return
    setSending(true)
    await sleep(500)
    onReply(draft.trim())
    setDraft('')
    setSending(false)
    toast.success('Reply sent', { description: `To ${m.from} <${m.email}>` })
    requestAnimationFrame(() => scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' }))
  }

  return (
    <motion.div initial={mobile ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-0.5 border-b border-border px-2 py-2 sm:px-3">
        {mobile && (
          <Button variant="ghost" size="icon-sm" aria-label="Back to inbox" onClick={onBack} className="mr-1">
            <ArrowLeft />
          </Button>
        )}
        <ToolbarButton label="Archive (E)" onClick={onArchive}>
          <Archive />
        </ToolbarButton>
        <ToolbarButton label="Delete" onClick={onDelete}>
          <Trash2 />
        </ToolbarButton>
        <ToolbarButton label="Mark as unread" onClick={onUnread}>
          <MailOpen />
        </ToolbarButton>
        <ToolbarButton label={m.starred ? 'Unstar (S)' : 'Star (S)'} onClick={onStar} active={m.starred}>
          <motion.span key={String(m.starred)} initial={{ scale: 0.4, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 14 }}>
            <Star className={cn(m.starred && 'fill-current')} />
          </motion.span>
        </ToolbarButton>
        <div className="ml-auto flex items-center gap-1">
          <span className="mr-1 hidden font-mono text-[11px] text-fg-subtle tabular-nums sm:inline">
            {position + 1} / {total}
          </span>
          <ToolbarButton label="Previous (K)" onClick={() => onStep(-1)} disabled={position <= 0}>
            <ChevronUp />
          </ToolbarButton>
          <ToolbarButton label="Next (J)" onClick={() => onStep(1)} disabled={position < 0 || position >= total - 1}>
            <ChevronDown />
          </ToolbarButton>
        </div>
      </div>

      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto" data-lenis-prevent>
        <motion.article
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          className="mx-auto max-w-2xl px-5 py-6 sm:px-8 sm:py-8"
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}>
            <Badge variant={label.variant} className="mb-3">
              {label.name}
            </Badge>
            <h2 className="text-xl font-semibold tracking-tight text-balance sm:text-2xl">{m.subject}</h2>
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }} className="mt-5 flex items-center gap-3">
            <Avatar name={m.from} className="size-10 ring-0" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-sm font-medium">{m.from}</span>
                <span className="truncate text-xs text-fg-subtle">&lt;{m.email}&gt;</span>
              </div>
              <div className="text-xs text-fg-subtle">to me</div>
            </div>
            <div className="shrink-0 text-right text-xs text-fg-subtle">
              <div>{fmt.shortDate(m.time)}, {fmt.time(m.time)}</div>
              <div>{fmt.relative(m.time)}</div>
            </div>
          </motion.div>
          <motion.div
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
            className="mt-6 text-[14.5px] leading-relaxed whitespace-pre-line text-fg-muted"
          >
            {m.body}
          </motion.div>

          <AnimatePresence initial={false}>
            {m.replies.map((r) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease }}
                className="mt-6 ml-auto max-w-[90%] rounded-2xl rounded-br-md border border-accent/20 bg-accent/[0.07] p-4"
              >
                <div className="mb-1.5 flex items-center gap-2 text-xs">
                  <Avatar name={me.name} src={me.avatar} className="size-5 ring-0" />
                  <span className="font-medium">You</span>
                  <span className="text-fg-subtle">· {fmt.time(r.at)}</span>
                  <span className="ml-auto inline-flex items-center gap-1 text-success">
                    <CheckCheck className="size-3.5" /> Sent
                  </span>
                </div>
                <p className="text-sm whitespace-pre-line text-fg">{r.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.article>
      </div>

      <div className="border-t border-border p-3 sm:p-4">
        <div className="rounded-2xl border border-border bg-surface-2/50 transition focus-within:border-accent/45 focus-within:bg-surface focus-within:ring-4 focus-within:ring-ring/15">
          <label htmlFor="reply-box" className="sr-only">
            Reply to {m.from}
          </label>
          <Textarea
            id="reply-box"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                send()
              }
            }}
            placeholder={`Reply to ${m.from.split(' ')[0]}…`}
            className="min-h-16 rounded-none border-0 bg-transparent py-3 hover:border-0 focus:bg-transparent focus:ring-0 dark:bg-transparent"
          />
          <div className="flex items-center justify-between px-3 pb-2.5">
            <span className="hidden items-center gap-1 text-[11px] text-fg-subtle sm:flex">
              <Kbd>⌘</Kbd>
              <Kbd>↵</Kbd> to send
            </span>
            <Button size="xs" className="ml-auto" loading={sending} disabled={!draft.trim()} onClick={send}>
              {!sending && <Send />} Send
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ComposeDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to) && subject.trim()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="New message" description="Send from ava@northwind.io">
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault()
            if (!valid) return
            setBusy(true)
            await sleep(600)
            setBusy(false)
            onOpenChange(false)
            toast.success('Message sent', { description: `“${subject}” to ${to}` })
            setTo('')
            setSubject('')
            setBody('')
          }}
        >
          <div>
            <Label htmlFor="c-to">To</Label>
            <Input id="c-to" type="email" placeholder="maya@northwind.io" value={to} onChange={(e) => setTo(e.target.value)} autoFocus />
          </div>
          <div>
            <Label htmlFor="c-subject">Subject</Label>
            <Input id="c-subject" placeholder="Q4 board deck — numbers check" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="c-body">Message</Label>
            <Textarea id="c-body" rows={5} placeholder="Write your message…" value={body} onChange={(e) => setBody(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Discard
            </Button>
            <Button type="submit" variant="brand" size="sm" loading={busy} disabled={!valid}>
              {!busy && <Send />} Send
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
