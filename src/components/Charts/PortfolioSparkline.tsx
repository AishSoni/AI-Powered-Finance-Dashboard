import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { type CSSProperties } from 'react'

interface PortfolioSparklineProps {
  data?: Array<{ value: number }>
  height?: number
}

const PortfolioSparkline = ({ data = defaultData, height = 60 }: PortfolioSparklineProps) => {
  return (
    <div style={{ ...s.wrapper, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--color-success)"
            strokeWidth={2}
            fill="url(#sparklineGradient)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PortfolioSparkline

const defaultData = [
  { value: 100 },
  { value: 105 },
  { value: 103 },
  { value: 108 },
  { value: 112 },
  { value: 110 },
  { value: 115 },
  { value: 118 },
  { value: 116 },
  { value: 120 },
  { value: 125 },
  { value: 122 },
]

const s: Record<string, CSSProperties> = {
  wrapper: {
    width: '100%',
  },
}
