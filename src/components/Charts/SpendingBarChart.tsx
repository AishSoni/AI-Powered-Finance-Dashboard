import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { type CSSProperties } from 'react'

export interface SpendingBarChartProps {
  data?: Array<{ month: string; amount: number; isCurrent?: boolean }>
}

const SpendingBarChart = ({ data = defaultData }: SpendingBarChartProps) => {
  return (
    <div style={s.wrapper}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-subtle)" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--color-text-tertiary)', fontSize: 11 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--color-text-tertiary)', fontSize: 11 }}
            tickFormatter={(value) => `Rs ${value}`}
          />
          <Tooltip
            contentStyle={s.tooltip}
            itemStyle={{ color: 'var(--color-text-primary)' }}
            formatter={(value: unknown) => `Rs ${Number(value ?? 0).toLocaleString()}`}
            labelStyle={{ color: 'var(--color-text-secondary)' }}
          />
          <Bar dataKey="amount" fill="var(--color-primary)" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.month}
                fill={entry.isCurrent ? 'var(--color-warning-light)' : 'var(--color-primary)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SpendingBarChart

const defaultData = [
  { month: 'Jan', amount: 32000, isCurrent: false },
  { month: 'Feb', amount: 28000, isCurrent: false },
  { month: 'Mar', amount: 35000, isCurrent: false },
  { month: 'Apr', amount: 31000, isCurrent: false },
  { month: 'May', amount: 29000, isCurrent: false },
  { month: 'Jun', amount: 38000, isCurrent: true },
]

const s: Record<string, CSSProperties> = {
  wrapper: {
    width: '100%',
  },
  tooltip: {
    background: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: '8px 12px',
    fontSize: 12,
    fontFamily: 'var(--font-family)',
  },
}
