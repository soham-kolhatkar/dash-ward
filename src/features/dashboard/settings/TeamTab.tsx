import { AnimatePresence, motion } from 'motion/react'
import { Ellipsis, Mail, RotateCw, Send, UserMinus, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/misc'
import { Select } from '@/components/ui/select'
import { Tooltip } from '@/components/ui/tooltip'
import { TEAM } from '@/data/misc'
import { fmt } from '@/lib/format'
import { sleep } from '@/lib/utils'
import { useAuth } from '@/store/auth'
import { Section, TabBody } from './ui'

const ROLES = ['Admin', 'Editor', 'Viewer'].map((r) => ({ value: r, label: r }))
const SEATS = 15

interface Invite {
  email: string
  role: string
  sent: string
}

export function TeamTab() {
  const me = useAuth((s) => s.user?.email) ?? 'ava@northwind.io'
  const [members, setMembers] = useState(TEAM)
  const [invites, setInvites] = useState<Invite[]>([
    { email: 'priya@northwind.io', role: 'Editor', sent: new Date(Date.now() - 2 * 864e5).toISOString() },
    { email: 'felix.berg@contractor.dev', role: 'Viewer', sent: new Date(Date.now() - 5 * 3_600_000).toISOString() },
  ])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Editor')
  const [busy, setBusy] = useState(false)
  const used = members.length + invites.length
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const taken = [...members.map((m) => m.email), ...invites.map((i) => i.email)].includes(email.trim().toLowerCase())

  const invite = async (e: FormEvent) => {
    e.preventDefault()
    if (!valid || taken) return
    setBusy(true)
    await sleep(600)
    setInvites((l) => [{ email: email.trim().toLowerCase(), role, sent: new Date().toISOString() }, ...l])
    toast.success('Invite sent', { description: `${email.trim()} will join as ${role}.` })
    setEmail('')
    setBusy(false)
  }

  return (
    <TabBody>
      <Section title="Invite teammates" description="Invites expire after 7 days. Viewers are free and don’t use a seat on the Scale plan.">
        <form onSubmit={invite} className="flex flex-col gap-2 sm:flex-row">
          <div className="flex-1">
            <Input icon={<Mail />} type="email" aria-label="Email address" placeholder="teammate@northwind.io" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!email && (!valid || taken)} />
          </div>
          <Select value={role} onValueChange={setRole} options={ROLES} className="h-11 rounded-xl sm:w-32" />
          <Button type="submit" variant="brand" className="h-11" loading={busy} disabled={!valid || taken}>
            {!busy && <Send />} Send invite
          </Button>
        </form>
        {taken && <p className="mt-2 text-xs text-warning">That person is already a member or has a pending invite.</p>}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-fg-muted">Seats</span>
            <span className="font-mono text-fg-muted tabular-nums">
              <span className="text-fg">{used}</span> / {SEATS}
            </span>
          </div>
          <Progress value={(used / SEATS) * 100} className="mt-2" />
        </div>
      </Section>

      <Section title="Members" description={`${members.length} people have access to the Northwind workspace.`}>
        <ul className="-my-1 divide-y divide-border">
          <AnimatePresence initial={false}>
            {members.map((m) => {
              const isMe = m.email === me
              const owner = m.role === 'Owner'
              return (
                <motion.li key={m.email} layout exit={{ opacity: 0, height: 0, x: 24 }} className="flex items-center gap-3 overflow-hidden py-3">
                  <Avatar name={m.name} className="size-9 ring-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">{m.name}</span>
                      {isMe && <Badge variant="accent">You</Badge>}
                    </div>
                    <div className="truncate text-xs text-fg-subtle">{m.email}</div>
                  </div>
                  {owner ? (
                    <Tooltip content="Transfer ownership from workspace settings">
                      <span className="inline-flex h-9 items-center rounded-full border border-border px-3.5 text-sm text-fg-subtle">Owner</span>
                    </Tooltip>
                  ) : (
                    <Select
                      value={m.role}
                      onValueChange={(v) => {
                        setMembers((l) => l.map((x) => (x.email === m.email ? { ...x, role: v } : x)))
                        toast.success(`${m.name.split(' ')[0]} is now ${v === 'Admin' ? 'an' : 'a'} ${v}`)
                      }}
                      options={ROLES}
                      className="w-28 text-[13px]"
                    />
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${m.name}`} disabled={owner}>
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => toast.success('Password reset email sent', { description: m.email })}>
                        <RotateCw /> Reset password
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-danger data-highlighted:bg-danger/10 data-highlighted:text-danger"
                        onSelect={() => {
                          const snapshot = members
                          setMembers((l) => l.filter((x) => x.email !== m.email))
                          toast(`${m.name} removed`, { action: { label: 'Undo', onClick: () => setMembers(snapshot) } })
                        }}
                      >
                        <UserMinus /> Remove from workspace
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ul>
      </Section>

      <Section title="Pending invites" description="People who haven’t accepted yet.">
        {invites.length === 0 ? (
          <p className="py-2 text-center text-sm text-fg-subtle">No pending invites.</p>
        ) : (
          <ul className="-my-1 divide-y divide-border">
            <AnimatePresence initial={false}>
              {invites.map((i) => (
                <motion.li
                  key={i.email}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, x: 24 }}
                  className="flex items-center gap-3 overflow-hidden py-3"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-dashed border-border-strong text-fg-subtle">
                    <Mail className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{i.email}</div>
                    <div className="text-xs text-fg-subtle">
                      {i.role} · invited {fmt.relative(i.sent)}
                    </div>
                  </div>
                  <Button variant="ghost" size="xs" onClick={() => toast.success('Invite resent', { description: i.email })}>
                    Resend
                  </Button>
                  <Tooltip content="Revoke invite">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Revoke invite for ${i.email}`}
                      onClick={() => {
                        setInvites((l) => l.filter((x) => x.email !== i.email))
                        toast('Invite revoked', { description: i.email })
                      }}
                    >
                      <X />
                    </Button>
                  </Tooltip>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </Section>
    </TabBody>
  )
}
