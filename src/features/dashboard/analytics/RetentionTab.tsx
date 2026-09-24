import { motion } from 'motion/react'
import { ChartSpline, Grid3x3, Layers } from 'lucide-react'
import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BarList, ChartCard, ChartTooltip, CohortHeatmap, chartCursor, useSvgId } from '@/components/charts'
import { getCohorts } from '@/data/metrics'
import { fadeUp, stagger } from '@/lib/motion'
import { StatStrip } from './StatStrip'

const PLAN_RETENTION = [
  { name: 'Enterprise', value: 91 },
  { name: 'Scale', value: 78 },
  { name: 'Growth', value: 61 },
  { name: 'Starter', value: 37 },
]

export function RetentionTab({ factor, compare }: { factor: number; compare: boolean }) {
  const gid = useSvgId('ret')
  const cohorts = useMemo(
    () => getCohorts().map((c) => ({ ...c, size: Math.max(1, Math.round(c.size * factor)) })),
    [factor],
  )
  const curve = useMemo(() => {
    const periods = cohorts[0].cells.length
    return Array.from({ length: periods }, (_, i) => {
      const vals = cohorts.map((c) => c.cells[i]).filter((v) => v != null)
      const avg = vals.reduce((a, v) => a + v, 0) / vals.length
      return { label: `W${i}`, retained: Math.round(avg * 10) / 10, benchmark: Math.round(100 * Math.pow(0.7, i)) }
    })
  }, [cohorts])
  const at = (w: number) => curve[w]?.retained ?? 0

  return (
    <motion.div variants={stagger(0.07)} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={fadeUp}>
        <StatStrip
          compare={compare}
          stats={[
            { label: 'Week 1 retention', value: at(1), format: (v) => `${v.toFixed(1)}%`, delta: 3.2 },
            { label: 'Week 4 retention', value: at(4), format: (v) => `${v.toFixed(1)}%`, delta: 1.8 },
            { label: 'Week 8 retention', value: at(8), format: (v) => `${v.toFixed(1)}%`, delta: -0.6 },
            { label: 'Avg. cohort size', value: cohorts.reduce((a, c) => a + c.size, 0) / cohorts.length, format: (v) => Math.round(v).toLocaleString('en-US') },
          ]}
        />
      </motion.div>

      <motion.div variants={fadeUp}>
        <ChartCard title="Cohort retention" description="Share of each weekly signup cohort still active" icon={<Grid3x3 />}>
          <CohortHeatmap rows={cohorts} />
        </ChartCard>
      </motion.div>

      <div className="grid grid-cols-12 gap-4">
        <motion.div variants={fadeUp} className="col-span-12 xl:col-span-8">
          <ChartCard title="Retention curve" description="Average across cohorts vs. industry benchmark" icon={<ChartSpline />} contentClassName="px-2 pb-3">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 600, height: 240 }}>
                <AreaChart data={curve} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" style={{ stopColor: 'var(--chart-1)', stopOpacity: 0.35 }} />
                      <stop offset="100%" style={{ stopColor: 'var(--chart-1)', stopOpacity: 0 }} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} />
                  <YAxis tickLine={false} axisLine={false} width={40} domain={[0, 100]} tickFormatter={(v: number) => `${v}%`} />
                  <Tooltip cursor={chartCursor} content={(p) => <ChartTooltip {...p} format={(v) => `${v}%`} />} />
                  <Area type="monotone" dataKey="benchmark" name="Benchmark" stroke="var(--fg-subtle)" strokeDasharray="4 4" strokeWidth={1.5} fill="none" dot={false} />
                  <Area type="monotone" dataKey="retained" name="Your product" stroke="var(--chart-1)" strokeWidth={2.25} fill={`url(#${gid})`} dot={{ r: 2.5, strokeWidth: 0, fill: 'var(--chart-1)' }} activeDot={{ r: 4.5, strokeWidth: 2, stroke: 'var(--surface)' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>
        <motion.div variants={fadeUp} className="col-span-12 xl:col-span-4">
          <ChartCard title="90-day retention by plan" description="Share of accounts still active" icon={<Layers />} contentClassName="px-3 pt-4">
            <BarList items={PLAN_RETENTION} format={(v) => `${v}%`} color="var(--accent-2)" />
            <p className="mt-4 px-2.5 text-xs leading-relaxed text-fg-muted">
              Paid tiers retain <span className="font-medium text-fg">2.1×</span> better than Starter. Nudging Starter
              teams toward an AI query in week one closes about a third of the gap.
            </p>
          </ChartCard>
        </motion.div>
      </div>
    </motion.div>
  )
}
