import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts'
import { cn } from '@/lib/utils'
import { useSvgId } from './utils'

/** Tiny gradient area chart: `<Sparkline data={[4, 8, 6, 12]} color="var(--chart-2)" height={40} />` */
export function Sparkline({
  data,
  color = 'var(--chart-1)',
  height = 40,
  strokeWidth = 1.75,
  className,
  animate = true,
}: {
  data: number[]
  color?: string
  height?: number
  strokeWidth?: number
  className?: string
  animate?: boolean
}) {
  const id = useSvgId('spark')
  const points = data.map((v, i) => ({ i, v }))
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 120, height }}>
        <AreaChart data={points} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.32 }} />
              <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={strokeWidth}
            fill={`url(#${id})`}
            isAnimationActive={animate}
            animationDuration={1100}
            animationEasing="ease-out"
            dot={false}
            activeDot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
