import { AnimatePresence, motion } from 'motion/react'
import { BellRing, Check, FileBarChart, Hash, Mail, Megaphone, Radar, Gauge } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { Row, Section, TabBody } from './ui'

type Key = 'digest' | 'weekly' | 'product' | 'anomaly' | 'limits' | 'slack' | 'slackMentions'

const GROUPS: { title: string; description: string; rows: { key: Key; icon: ReactNode; title: string; description: string; extra?: 'digest' | 'slack' }[] }[] = [
  {
    title: 'Email',
    description: 'Sent to ava@northwind.io. Transactional emails such as receipts and security alerts are always on.',
    rows: [
      { key: 'digest', icon: <Mail />, title: 'Email digests', description: 'New insights and changes to the metrics you follow.', extra: 'digest' },
      { key: 'weekly', icon: <FileBarChart />, title: 'Weekly report', description: 'A Monday-morning PDF covering revenue, activation and retention.' },
      { key: 'product', icon: <Megaphone />, title: 'Product updates', description: 'New features and improvements, about twice a month.' },
    ],
  },
  {
    title: 'Alerts',
    description: 'Real-time signals from Dashward AI. We batch anything non-urgent into a single email.',
    rows: [
      { key: 'anomaly', icon: <Radar />, title: 'Anomaly alerts', description: 'When a key metric moves outside its expected range.' },
      { key: 'limits', icon: <Gauge />, title: 'Usage limits', description: 'At 75% and 90% of your plan’s event and AI query limits.' },
    ],
  },
  {
    title: 'Slack',
    description: 'Post alerts and digests straight into the channels your team already watches.',
    rows: [
      { key: 'slack', icon: <Hash />, title: 'Send alerts to Slack', description: 'Anomalies and threshold breaches, posted with a chart preview.', extra: 'slack' },
      { key: 'slackMentions', icon: <BellRing />, title: 'Mention me on critical alerts', description: 'We’ll @mention you when revenue or conversion drops more than 20%.' },
    ],
  },
]

export function NotificationsTab() {
  const [on, setOn] = useState<Record<Key, boolean>>({ digest: true, weekly: true, product: false, anomaly: true, limits: true, slack: true, slackMentions: false })
  const [digest, setDigest] = useState('daily')
  const [channel, setChannel] = useState('growth-alerts')
  const [pulse, setPulse] = useState(0)

  useEffect(() => {
    if (!pulse) return
    const id = setTimeout(() => setPulse(0), 1600)
    return () => clearTimeout(id)
  }, [pulse])

  const toggle = (k: Key, v: boolean) => {
    setOn((s) => ({ ...s, [k]: v, ...(k === 'slack' && !v ? { slackMentions: false } : {}) }))
    setPulse(Date.now())
  }

  return (
    <TabBody>
      <div className="-mb-4 flex h-5 items-center justify-end sm:-mb-6">
        <AnimatePresence>
          {pulse > 0 && (
            <motion.span
              key={pulse}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-1 text-xs text-success"
            >
              <Check className="size-3.5" /> Saved
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {GROUPS.map((g) => (
        <Section key={g.title} title={g.title} description={g.description}>
          <div className="divide-y divide-border">
            {g.rows.map((r) => {
              const disabled = r.key === 'slackMentions' && !on.slack
              return (
                <div key={r.key} className="py-4 first:pt-0 last:pb-0">
                  <Row
                    icon={r.icon}
                    title={
                      <span className="inline-flex items-center gap-2">
                        {r.title}
                        {r.extra === 'slack' && <Badge variant="success">Connected</Badge>}
                      </span>
                    }
                    description={r.description}
                    className={cn('py-0', disabled && 'opacity-50')}
                    control={<Switch checked={on[r.key]} disabled={disabled} onCheckedChange={(v) => toggle(r.key, v)} aria-label={r.title} />}
                  />
                  <AnimatePresence initial={false}>
                    {r.extra && on[r.key] && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                        <div className="flex flex-wrap items-center gap-2 pt-3 pl-11 text-[13px] text-fg-muted">
                          {r.extra === 'digest' ? (
                            <>
                              Send
                              <Select
                                value={digest}
                                onValueChange={(v) => {
                                  setDigest(v)
                                  setPulse(Date.now())
                                }}
                                options={[
                                  { value: 'realtime', label: 'as it happens' },
                                  { value: 'daily', label: 'daily at 8:00' },
                                  { value: 'weekly', label: 'weekly on Monday' },
                                ]}
                                className="h-8 text-[13px]"
                              />
                            </>
                          ) : (
                            <>
                              Post to
                              <Select
                                value={channel}
                                onValueChange={(v) => {
                                  setChannel(v)
                                  toast.success(`Alerts will post to #${v}`)
                                }}
                                options={['growth-alerts', 'revenue', 'eng-oncall', 'leadership'].map((c) => ({ value: c, label: `#${c}` }))}
                                className="h-8 font-mono text-[13px]"
                              />
                              <span className="text-xs text-fg-subtle">in Northwind Slack</span>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </Section>
      ))}
    </TabBody>
  )
}
