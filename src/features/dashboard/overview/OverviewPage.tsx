import { motion } from 'motion/react'
import { Download, Share2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/features/dashboard/PageHeader'
import type { Range } from '@/data/metrics'
import { fadeUp, stagger } from '@/lib/motion'
import { sleep } from '@/lib/utils'
import { useAuth } from '@/store/auth'
import { ActivityCard } from './ActivityCard'
import { ChannelsCard, FunnelCard, TopPagesCard } from './BreakdownCards'
import { greeting } from './format'
import { InsightsCard } from './InsightsCard'
import { KpiCards } from './KpiCards'
import { RangeControl } from './RangeControl'
import { RealtimeCard } from './RealtimeCard'
import { RevenueCard } from './RevenueCard'

export default function OverviewPage() {
  const [range, setRange] = useState<Range>('30d')
  const first = useAuth((s) => s.user?.name.split(' ')[0]) ?? 'there'
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <>
      <PageHeader
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
            All systems operational · synced 2 min ago
          </span>
        }
        title={`${greeting()}, ${first}`}
        description={`${today} · Here’s what’s happening across Northwind.`}
        actions={
          <>
            <RangeControl value={range} onChange={setRange} />
            <Button
              variant="secondary"
              size="sm"
              className="max-xl:w-8 max-xl:px-0"
              onClick={() =>
                toast.promise(sleep(1200), {
                  loading: 'Preparing export…',
                  success: 'overview.csv is ready',
                  error: 'Export failed',
                })
              }
            >
              <Download />
              <span className="max-xl:sr-only">Export</span>
            </Button>
            <Button
              variant="brand"
              size="sm"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href).catch(() => {})
                toast.success('Share link copied', { description: 'Anyone in Northwind can view this dashboard.' })
              }}
            >
              <Share2 /> Share
            </Button>
          </>
        }
      />

      <KpiCards range={range} />

      <motion.div
        variants={stagger(0.08, 0.2)}
        initial="hidden"
        animate="show"
        className="mt-3 grid grid-cols-12 gap-3 sm:mt-4 sm:gap-4"
      >
        <motion.div variants={fadeUp} className="col-span-12 xl:col-span-8">
          <RevenueCard range={range} />
        </motion.div>
        <motion.div variants={fadeUp} className="col-span-12 xl:col-span-4">
          <InsightsCard />
        </motion.div>
        <motion.div variants={fadeUp} className="col-span-12 md:col-span-6 md:row-span-2 xl:col-span-4">
          <RealtimeCard />
        </motion.div>
        <motion.div variants={fadeUp} className="col-span-12 md:col-span-6 xl:col-span-4">
          <FunnelCard />
        </motion.div>
        <motion.div variants={fadeUp} className="col-span-12 md:col-span-6 xl:col-span-4">
          <ChannelsCard />
        </motion.div>
        <motion.div variants={fadeUp} className="col-span-12 md:col-span-6 xl:col-span-4">
          <TopPagesCard />
        </motion.div>
        <motion.div variants={fadeUp} className="col-span-12 md:col-span-6 xl:col-span-4">
          <ActivityCard />
        </motion.div>
      </motion.div>
    </>
  )
}
